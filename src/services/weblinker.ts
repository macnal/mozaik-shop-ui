import 'server-only'
import {
  AddToCartPUTItem,
  ApiCartResponse,
  ApiCartResponseItem,
  ApiResponse,
  ApiResponsePaginated,
  ApiSingleItemResponse,
  AppCartResponse,
  AppCartResponseItem,
  Category,
  CreateOrderRequest,
  Game,
  GameExtended,
  RemoveFromCartDELETEResponse
} from "@/types/responses";
import {auth} from "@/auth";
import ky from "ky";
import {JsonSchema, UISchemaElement} from "@jsonforms/core";
import {Options} from "ky";


interface FetchProductsParams {
  page: number;
  size: number;
  query?: string;
  category?: number | number[];
}


interface FetchCategoriesParams {
  parentId: number;
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

    async createOrder(data: CreateOrderRequest): Promise<string> {
      console.log('ORDER');
      console.log(data);

      const responseData = await this.api.post<{ url: string }>(
        `weblinker/order`,
        {
          json: data
        }
      ).json();

      return responseData.url;
    },

    async fetchOrderStatus(id: string) {
      const responseData = await this.api.get<{ paymentStatus: PaymentStatus }>(
        `weblinker/order/${id}`
      ).json();

      return responseData
    },

    async fetchCategoryBySlug(slug: string) {
      const responseData = await this.api.get<ApiResponse<Category>>(
        `weblinker/categories`
      ).json();

      return responseData.items.find(x => x.slug === slug)! || responseData.items[0];
    },

    async fetchCategoryById(id: number) {
      const responseData = await this.api.get<ApiResponse<Category>>(
        `weblinker/categories`
      ).json();

      return responseData.items.find(x => x.id === id)! || responseData.items[0];
    },

    async fetchCategories(params: FetchCategoriesParams) {
      const responseData = await this.api.get<ApiResponse<Category>>(
        `weblinker/categories`
      ).json();

      return {
        items: responseData.items.filter(x => x.parent === (params.parentId || 0))
      }
    },

    async enhanceCartItem(item: ApiCartResponseItem): Promise<AppCartResponseItem> {
      const category = await this.fetchCategoryById(item.categoryId as number);

      return {
        ...item,
        categorySlug: category.slug,
        categoryName: category.name,
        url: `/${category.slug}/${item.slug}`,
      }
    },

    async fetchCardId(token: string) {
      const responseData = await this.api.get<ApiCartResponse>(
        `weblinker/cart2`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      ).json();

      return responseData.uuid;
    },

    async fetchCart(id: string | null = null, options: Options = {}): Promise<AppCartResponse> {
      const url = id ? `weblinker/cart2/${id}` : `weblinker/cart2`;
      const responseData = await this.api.get<ApiCartResponse>(
        url,
        options
      ).json();

      return {
        ...responseData,
        items: await Promise.all((responseData.items || []).map(this.enhanceCartItem.bind(this))),
      };
    },

    async addToCart(id: string | null = null, items: AddToCartPUTItem[]): Promise<AppCartResponse> {
      const data: {
        uuid?: string;
        items: AddToCartPUTItem[];
      } = {items};

      if (id) {
        data.uuid = id;
      }

      const responseData = await this.api.put<ApiCartResponse>(
        `weblinker/cart`,
        {
          json: data,
        }
      ).json();

      return {
        ...responseData,
        items: await Promise.all(responseData.items.map(this.enhanceCartItem.bind(this))),
      };
    },

    async removeFromCart(id: string, items: AddToCartPUTItem[]): Promise<RemoveFromCartDELETEResponse> {
      const item = items[0];
      const responseData = await this.api.delete<ApiCartResponse>(
        `weblinker/cart/${id}`,
        {
          searchParams: {
            p: item.productId,
            q: item.quantity,
          },
        }
      ).json();

      return {
        ...responseData,
        items: await Promise.all(responseData.items.map(this.enhanceCartItem.bind(this))),
      };
    },

    async fetchCategoryFormSchema(categoryId: number) {
      const [formSchema, layoutSchema] = await Promise.all([
        this.api.get(`jsonforms/schema/${categoryId}`).json<JsonSchema>(),
        this.api.get(`jsonforms/uischema/${categoryId}`).json<UISchemaElement>(),
      ]);

      return {
        formSchema,
        layoutSchema,
      }
    },

    async fetchProduct(id: number): Promise<ApiSingleItemResponse<GameExtended>> {
      const res = await this.api.get(`weblinker/products/${id}`);
      return await res.json()
    },

    async fetchProducts(params: FetchProductsParams): Promise<ApiResponsePaginated<Game>> {
      // await new Promise(r => setTimeout(r, 5000));
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

      const responseData = await this.api.get<ApiResponsePaginated<Game>>(
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
