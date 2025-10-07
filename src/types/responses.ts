export interface Game {
  categoryId: number;
  id: number;
  ean: string;
  sku: string;
  name: string;
  slug: string;
  stock: number;
  price: number;
  description: string;
  image: string;
  tag?: string;
  shortDescription: string
}

export interface GameExtended {
  categoryId: number;
  id: number;
  ean: string;
  sku: string;
  slug: string;
  name: string;
  stock: number;
  price: number;
  description: string;
  image: string;
  tag?: string;
  shortDescription: string;
  images: string[];
}


export interface Category {
  id: number;
  slug: string;
  name: string;
  parent: number;
}

export interface ApiSingleItemResponse<T> {
  errors: string[];
  warnings: string[];
  successMessage: string | null;
  traceId: string | null;
  subject: string | null;
  time: string | null;
  item: T;
}

export interface ApiPageResponsePage {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface ApiResponsePaginated<T> {
  errors: string[];
  warnings: string[];
  successMessage: string | null;
  traceId: string | null;
  subject: string | null;
  time: string | null;
  items: T[];
  page: ApiPageResponsePage;
}

export interface ApiResponse<T> {
  errors: string[];
  warnings: string[];
  successMessage: string | null;
  traceId: string | null;
  subject: string | null;
  time: string | null;
  items: T[];
}

export interface ApiCartResponseItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface AddToCartPOSTItem {
  productId: number;
  quantity: number;
}

export interface AddToCartPOST {
  items: AddToCartPOSTItem[]
}

export interface RemoveFromCartPOST {
  items: AddToCartPOSTItem[]
}

export interface ApiCartResponse {
  uuid: string;
  items: ApiCartResponseItem[];
  total: number;
}
