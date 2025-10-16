import {NextRequest} from "next/server";
import {WebLinkerService} from "@/services/weblinker";
import { CART_ID_COOKIE_NAME } from "@/app/@navbar/_components/Navbar.types";
import { cookies } from "next/headers";
import {revalidatePath} from "next/cache";
import {getServerSession} from "next-auth/next";
import {authConfig} from "@/auth.config";

type SharedContext = { params: Promise<{ cartId?: string }> }


export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_ID_COOKIE_NAME)?.value || null;

  if (!cartId) {
    return Response.json({ uuid: null, items: [] }, {status: 404});
  }

  const dataSource = await WebLinkerService();
  return Response.json(await dataSource.fetchCart(cartId!));
}

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_ID_COOKIE_NAME)?.value || null;

  const {items} = await request.json()
  const dataSource = await WebLinkerService();

  const nextCart = await dataSource.addToCart(cartId, items);
  cookieStore.set(CART_ID_COOKIE_NAME, nextCart.uuid);

  return Response.json(nextCart);
}

export async function DELETE(request: NextRequest) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_ID_COOKIE_NAME)?.value || null;

  if (!cartId) {
    return Response.json({ uuid: null, items: [] }, {status: 404});
  }

  const {items} = await request.json()
  const dataSource = await WebLinkerService();

  const nextCart = await dataSource.removeFromCart(cartId, items);
  cookieStore.set(CART_ID_COOKIE_NAME, nextCart.uuid);

  return Response.json(nextCart);
}
