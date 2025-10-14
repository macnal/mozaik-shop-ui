import 'server-only';
import {cookies} from "next/headers";
import {CART_ID_COOKIE_NAME} from "@/app/@navbar/_components/Navbar.types";
import {User} from "next-auth";
import {WebLinkerService} from "@/services/weblinker";


export const maybeMergeCart = async ({user}: { user: User }) => {
  const dataSource = WebLinkerService();
  const cookieStore = await cookies();
  const nextCartId = user.id;
  const currentCartId = cookieStore.get(CART_ID_COOKIE_NAME)?.value || null;
  cookieStore.set(CART_ID_COOKIE_NAME, nextCartId);

  if (currentCartId && (currentCartId !== nextCartId)) {
    const cartItems = await dataSource.fetchCart(currentCartId);

    await dataSource.addToCart(nextCartId, cartItems.items.map(x => ({
      quantity: x.quantity,
      productId: x.productId,
    })));
  }
}

export const clearCart = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(CART_ID_COOKIE_NAME);
}
