import {NextRequest} from "next/server";
import {WebLinkerService} from "@/services/weblinker";

type SharedContext = { params: Promise<{ cartId?: string }> }


export async function GET(request: NextRequest, {params}: SharedContext) {
  const {cartId} = await params;
  //const items = await request.json()
  const dataSource = WebLinkerService();
  return Response.json(await dataSource.fetchCart(cartId!));
}

export async function PUT(request: NextRequest, {params}: SharedContext) {
  const {cartId} = await params;

  const {items} = await request.json()
  const dataSource = WebLinkerService();
  return Response.json(await dataSource.addToCart(cartId, items));
}

export async function DELETE(request: NextRequest, {params}: SharedContext) {
  const {cartId} = await params;
  const {items} = await request.json()
  const dataSource = WebLinkerService();
  return Response.json(await dataSource.removeFromCart(cartId!, items));
}
