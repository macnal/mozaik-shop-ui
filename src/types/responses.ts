export interface Game {
  id: number;
  ean: string;
  sku: string;
  name: string;
  stock: number;
  price: number;
  description: string;
  image: string;
  tag?: string;
  shortDescription: string
}

export interface GameExtended {
  id: number;
  ean: string;
  sku: string;
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
