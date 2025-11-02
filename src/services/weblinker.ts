import 'server-only'
import {auth} from "@/auth";
import ky, {Options} from "ky";
import {
    WeblinkerCart,
    WeblinkerOrder,
    WeblinkerProductResponseDetail,
    WeblinkerProductsResponseSummary
} from "@/api/gen/model";


interface FetchProductsParams {
    page: number;
    size: number;
    query?: string;
    category?: number | number[];
}

type PaymentStatus =
    | "PENDING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED"
    | "SETTLED"
    | "NO_MATCHED_BL"

export const WebLinkerService = async () => {

    const getAccessToken = async () => {
        const session = await auth();

        if (session?.access_token) {
            return session?.access_token
        }

        return null;
    }

    return ({
        baseUrl: process.env.API_BASE,
        api: ky.create({

            prefixUrl: process.env.API_BASE,
            hooks: {
                beforeRequest: [
                    async (options) => {
                        const token = await getAccessToken();

                        if (token) {
                            options.headers.set('Authorization', `Bearer ${token}`);
                        }
                    }]
            }
        }),

        async createOrder(data: WeblinkerOrder): Promise<string> {
            console.log('ORDER', data);

            const responseData = await this.api.post<{ url: string }>(
                `weblinker/order`,
                {json: data}
            ).json();

            return responseData.url;
        },

        async fetchOrderStatus(id: string) {
            const responseData = await this.api.get<{ paymentStatus: PaymentStatus }>(
                `weblinker/order/${id}`
            ).json();

            return responseData
        },


        async fetchCardId(token: string) {
            const responseData = await this.api.get<WeblinkerCart>(
                `weblinker/cart`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            ).json();

            return responseData.uuid;
        },

        async fetchCart(id: string | null = null, options: Options = {}): Promise<WeblinkerCart> {
            const url = id ? `weblinker/cart/${id}` : `weblinker/cart`;
            const responseData = await this.api.get<WeblinkerCart>(
                url,
                options
            ).json<WeblinkerCart>();

            return await responseData;
        },

        async updateCart(cart: WeblinkerCart): Promise<WeblinkerCart> {
            console.log('UPDATE CART', cart);
            const responseData = await this.api.put<WeblinkerCart>(
                `weblinker/cart`, {
                    json: cart,
                }
            ).json<WeblinkerCart>();

            return await responseData;
        },


        async fetchProduct(id: number): Promise<WeblinkerProductResponseDetail> {
            console.log('FETCH PRODUCT', id);
            const res = await this.api.get(`weblinker/products/${id}`);
            return await res.json()
        },

        async fetchProducts(params: FetchProductsParams): Promise<WeblinkerProductsResponseSummary> {
            const nextSearchParams = new URLSearchParams({
                page: `${params.page - 1}`,
                size: `${params.size}`,
                q: `${params.query || ''}`,
            });

            if (params.category) {
                const arr = Array.isArray(params.category) ? params.category : [params.category];
                arr.forEach((categoryId) => {
                    nextSearchParams.append('c', `${categoryId}`)
                });
            }

            const responseData = await this.api.get<WeblinkerProductsResponseSummary>(
                `weblinker/products`,
                {
                    searchParams: nextSearchParams
                }
            ).json();

            responseData.page.number = responseData.page.number + 1;
            return responseData
        },
    })
}
