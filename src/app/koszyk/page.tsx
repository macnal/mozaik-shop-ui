import {PageContainer} from "@/components/PageContainer";
import {cookies} from "next/headers";
import {CART_ID_COOKIE_NAME} from "@/app/@navbar/_components/Navbar.types";
import {WebLinkerService} from "@/services/weblinker";
import {Typography} from "@mui/material";
import {redirect} from "next/navigation";
import {KoszykPageClient} from "@/app/koszyk/page.client";
import layoutSchema from '../../../public/order/uischema.json';
import formSchema from '../../../public/order/schema.json';
import z from "zod";
import {CreateOrderRequest} from "@/types/responses";
import {CustomerDataZodSchema} from "@/app/koszyk/_schema";

async function createOrder(formData: Record<string, unknown>) {
  'use server';
  const dataSource = await WebLinkerService();

  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_ID_COOKIE_NAME)?.value || null;

  let cart;
  if (cartId) {
    cart = await dataSource.fetchCart(cartId);
    if (cart) {
      const RequestSchema = CustomerDataZodSchema.safeExtend({
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
        })),
      }).omit({
        wantInvoice: true
      });

      const {data, error, success} = RequestSchema.safeParse(formData);

      if (success && data) {
        const paymentUrl = await dataSource.createOrder({
          uuid: cartId,
          ...data,
        } as unknown as CreateOrderRequest);
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
  const dataSource = await WebLinkerService();
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_ID_COOKIE_NAME)?.value || null;

  let cart;

  if (cartId) {
    cart = await dataSource.fetchCart(cartId);

    if (cart && cart.items?.length > 0) {
      return <PageContainer>
        <KoszykPageClient
          cart={cart}
          createOrder={createOrder}
          layoutSchema={layoutSchema}
          formSchema={formSchema}
          initialData={{address: {}}}
        />
      </PageContainer>
    }
  }

  return <PageContainer>
    <Typography variant={'h1'} gutterBottom>
      Koszyk
    </Typography>

    <Typography>
      Koszyk jest pusty
    </Typography>
  </PageContainer>
}
