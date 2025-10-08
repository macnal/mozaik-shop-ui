import 'server-only'
import {
  AddToCartPUT,
  AddToCartPUTItem,
  ApiCartResponse,
  ApiResponse,
  ApiResponsePaginated,
  ApiSingleItemResponse,
  Category,
  Game,
  GameExtended,
  RemoveFromCartDELETE
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

  async createOrder(cart: ApiCartResponse) {
    const res = await fetch(`${this.baseUrl}/weblinker/order`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uuid: cart.uuid,
        items: [{}],// cart.items,
        address: {
          name: '',
          street: '',
          city: '',
          state: '',
          zip: '',
          country: '',
          phone: '',
          email: '',
          homeNumber: '',
          flatNumber: '',
          info: ''
        },
        invoice: {
          name: '',
          street: '',
          city: '',
          state: '',
          zip: '',
          country: '',
          phone: '',
          email: '',
          homeNumber: '',
          flatNumber: '',
          info: '',
          nip: '',
          companyName: ''
        }
      })
    });

    const paymentUrl = await res.text();
    console.log(paymentUrl);
    return paymentUrl;
  },

  async fetchCart(id: string): Promise<ApiCartResponse> {
    const res = await fetch(`${this.baseUrl}/weblinker/cart/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    console.log(res.status);

    return data;
  },

  async addToCart(id: string | null = null, items: AddToCartPUTItem[]): Promise<AddToCartPUT> {
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

    return await res.json();
  },

  async removeFromCart(id: string, items: AddToCartPUTItem[]): Promise<RemoveFromCartDELETE> {
    const item = items[0];

    const res = await fetch(`${this.baseUrl}/weblinker/cart/${id}?p=${item.productId}&q=${item.quantity}`, {
      method: 'DELETE',
    });

    return await res.json();
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
  }
}

export const WebLinkerService = () => x
