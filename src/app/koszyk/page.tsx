import {PageContainer} from "@/components/PageContainer";
import {cookies} from "next/headers";
import {CART_ID_COOKIE_NAME} from "@/components/global/Navbar.types";
import {WebLinkerService} from "@/services/weblinker";
import {Typography} from "@mui/material";
import {redirect} from "next/navigation";
import {KoszykPageClient} from "@/app/koszyk/page.client";
import layoutSchema from '../../../public/order/uischema.json';
import formSchema from '../../../public/order/schema.json';
import {jsonSchemaObjectToZodRawShape} from "zod-from-json-schema";
import z from "zod";
import type {JSONSchema} from "zod/v4/core";
import {CreateOrderRequest} from "@/types/responses";

async function createOrder(formData: Record<string, unknown>) {
  'use server';
  const dataSource = WebLinkerService();

  const cookieStore = await cookies();
  const cartId = (await cookieStore.get(CART_ID_COOKIE_NAME))?.value || null;

  let cart;
  if (cartId) {
    cart = await dataSource.fetchCart(cartId);
    if (cart) {
      const FromJsonSchema = jsonSchemaObjectToZodRawShape(formSchema as JSONSchema.Schema);
      const RequestSchema = z.object({
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
        })),
        ...FromJsonSchema
      });

      const {data, error} = RequestSchema.safeParse(formData);

      if (data) {
        const paymentUrl = await dataSource.createOrder({
          uuid: cartId,
          ...data,
        } as CreateOrderRequest);
        redirect(paymentUrl);
      }

      if (error) {
        console.error(error);
      }
    }
  }

  redirect('/koszyk');
}

export default async function KoszykPage() {
  const dataSource = WebLinkerService();
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_ID_COOKIE_NAME)?.value || null;

  let cart;

  if (cartId) {
    cart = await dataSource.fetchCart(cartId);

    if (cart) {
      return <PageContainer>
        <KoszykPageClient
          cart={cart}
          createOrder={createOrder}
          layoutSchema={layoutSchema}
          formSchema={formSchema}
          initialData={{}}
        />
      </PageContainer>
    }
  }

  return <PageContainer>
    <Typography variant={'h1'} sx={{mb: 6}}>
      Koszyk
    </Typography>

    <Typography>
      Koszyk jest pusty
    </Typography>
  </PageContainer>
}
