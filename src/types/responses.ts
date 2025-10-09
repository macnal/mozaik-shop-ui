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

export interface AddToCartPUTItem {
  productId: number;
  quantity: number;
}

export interface AddToCartPUT {
  items: AddToCartPUTItem[]
}

export interface AddToCartPUTResponse {
  items: AddToCartPUTItem[]
  uuid: string;
}

export interface RemoveFromCartDELETE {
  items: AddToCartPUTItem[]
}

export interface RemoveFromCartDELETEResponse {
  items: AddToCartPUTItem[];
  uuid: string;
}

export interface ApiCartResponse {
  uuid: string;
  items: ApiCartResponseItem[];
  total: number;
}

interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
  homeNumber: string;
  flatNumber: string;
  info: string;
}

export interface CreateOrderRequest {
  uuid: string;
  items: ApiCartResponseItem[];
  address: Address;
  invoice?: Address;
}
