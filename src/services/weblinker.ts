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

interface FetchProductsParams {
  page: number;
  size: number;
  query?: string;
  category?: number | number[];
}


interface FetchCategoriesParams {
  parentId: number;
}

const x = {
  baseUrl: process.env.API_BASE,

  async createOrder(data: CreateOrderRequest): Promise<string> {
    const res = await fetch(`${this.baseUrl}/weblinker/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await res.json();
    console.log(responseData);
    return responseData.url;
  },

  async fetchCategory(slug: string): Promise<Category> {
    const url = new URL(`${this.baseUrl}/weblinker/categories`);
    const res = await fetch(url);
    const {items} = (await res.json()) as ApiResponse<Category>;

    return items.find(x => x.slug === slug)! || items[0];
  },

  async fetchCategoryById(id: number): Promise<Category> {
    const url = new URL(`${this.baseUrl}/weblinker/categories`);
    const res = await fetch(url);
    const {items} = (await res.json()) as ApiResponse<Category>;

    return items.find(x => x.id === id)! || items[0];
  },

  async fetchCategories(params: FetchCategoriesParams) {
    const url = new URL(`${this.baseUrl}/weblinker/categories`);
    const res = await fetch(url);
    const {items} = (await res.json()) as ApiResponse<Category>;

    return {
      items: items.filter(x => x.parent === (params.parentId || 0))
    };
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

  async fetchCart(id: string): Promise<AppCartResponse> {
    const res = await fetch(`${this.baseUrl}/weblinker/cart/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    try {
      const data: ApiCartResponse = await res.json();

      return {
        ...data,
        items: await Promise.all(data.items.map(this.enhanceCartItem.bind(this))),
      };
    } catch (err) {
      if (err instanceof SyntaxError) {
        return {uuid: id, items: [], total: 0, shippingFees: 0}
      } else {
        throw err;
      }
    }

  },

  async addToCart(id: string | null = null, items: AddToCartPUTItem[]): Promise<AppCartResponse> {
    const data: {
      uuid?: string;
      items: AddToCartPUTItem[];
    } = {items};

    if (id) {
      data.uuid = id;
    }

    const res = await fetch(`${this.baseUrl}/weblinker/cart`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const resData: ApiCartResponse = await res.json();

    return {
      ...resData,
      items: await Promise.all(resData.items.map(this.enhanceCartItem.bind(this))),
    };
  },

  async removeFromCart(id: string, items: AddToCartPUTItem[]): Promise<RemoveFromCartDELETEResponse> {
    const item = items[0];

    const res = await fetch(`${this.baseUrl}/weblinker/cart/${id}?p=${item.productId}&q=${item.quantity}`, {
      method: 'DELETE',
    });

    const resData: ApiCartResponse = await res.json();

    return {
      ...resData,
      items: await Promise.all(resData.items.map(this.enhanceCartItem.bind(this))),
    };
  },

  async fetchCategoryFormSchema(categoryId: number) {
    const [formSchema, layoutSchema] = await Promise.all([
      fetch(`${this.baseUrl}/jsonforms/schema/${categoryId}`).then(async (x) => await x.json()),
      fetch(`${this.baseUrl}/jsonforms/uischema/${categoryId}`).then(async (x) => await x.json()),
    ]);

    return {
      formSchema,
      layoutSchema,
    }
  },

  async fetchProduct(id: number): Promise<ApiSingleItemResponse<GameExtended>> {
    const res = await fetch(`${this.baseUrl}/weblinker/products/${id}`, {});

    return await res.json()
  },

  async fetchProducts(params: FetchProductsParams): Promise<ApiResponsePaginated<Game>> {
    // await new Promise(r => setTimeout(r, 5000));

    const url = new URL(`${this.baseUrl}/weblinker/products`);
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

    url.search = nextSearchParams.toString();


    const res = await fetch(url);

    const data = (await res.json()) as ApiResponsePaginated<Game>;
    data.page.number = data.page.number + 1;
    return data
  },


}

export const WebLinkerService = () => x
