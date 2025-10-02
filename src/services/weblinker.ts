import 'server-only'
import {
  ApiResponse,
  ApiResponsePaginated,
  ApiSingleItemResponse,
  Category,
  Game,
  GameExtended
} from "@/types/responses";
import {notFound} from "next/navigation";

interface FetchProductsParams {
  page: number;
  size: number;
}

interface FetchCategoriesParams {
  parentIds: number[];
}

const x = {
  baseUrl: process.env.API_BASE,

  async fetchProduct(id: number): Promise<ApiSingleItemResponse<GameExtended>> {
    const res = await fetch(`${this.baseUrl}/products/${id}`, {});

    if (res.status === 404) {
      throw notFound();
    }

    return await res.json()
  },

  async fetchProducts(params: FetchProductsParams): Promise<ApiResponsePaginated<Game>> {
    // await new Promise(r => setTimeout(r, 5000));

    const url = new URL(this.baseUrl + '/products');
    url.search = new URLSearchParams({
      ...params,
      page: `${params.page - 1}`,
      size: `${params.size}`,
    }).toString();

    const res = await fetch(url);

    const data = (await res.json()) as ApiResponsePaginated<Game>;
    data.page.number = data.page.number + 1;
    return data
  },

  async fetchCategory(id: number): Promise<ApiSingleItemResponse<Category>> {
    const url = new URL(this.baseUrl + '/categories');
    url.search = new URLSearchParams({
      id: String(id),
    }).toString();

    const res = await fetch(url);
    const mock = await res.json();
    return {
      ...mock,
      item: mock.items.find((x: Category) => x.id === id),
    };
  },

  async fetchCategories(params: FetchCategoriesParams) {
    const url = new URL(this.baseUrl + '/categories');
    url.search = new URLSearchParams({
      ...params,
      parentIds: `${params.parentIds.join(',')}`,
    }).toString();

    const res = await fetch(url);
    const mock = (await res.json()) as ApiResponse<Category>;

    if (params.parentIds[0] === 0) {
      return {
        ...mock,
        items: mock.items.filter(x => x.parent === 0)
      }
    }

    return mock


  }
}

export const WebLinkerService = () => x
