import {NextRequest} from "next/server";
import {WebLinkerService} from "@/services/weblinker";
import {cookies} from "next/headers";
import {CART_ID_COOKIE_NAME} from "@/app/@navbar/_components/Navbar.types";

type SharedContext = { params: Promise<{ cartId?: string }> }

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const cartId = cookieStore.get(CART_ID_COOKIE_NAME)?.value || null;

    console.log('FETCH CART ID', cartId);

    if (!cartId) {
        return Response.json({uuid: null, items: []}, {status: 404});
    }

    const dataSource = await WebLinkerService();
    return Response.json(await dataSource.fetchCart(cartId!));
}

export async function PUT(request: NextRequest) {
    const cookieStore = await cookies();

    const req = await request.json()
    const dataSource = await WebLinkerService();

    const nextCart = await dataSource.updateCart(req);
    if (nextCart.uuid) {
        cookieStore.set(CART_ID_COOKIE_NAME, nextCart.uuid);
    }

    return Response.json(nextCart);
}
