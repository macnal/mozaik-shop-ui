import {AddToCartPUT, ApiCartResponseItem} from "@/types/responses";

export enum CartEvents {
  init = "cart:init",
  addItem = "cart:addItem",
  removeItem = "cart:removeItem",
}

export type AddItemToCartEvent = CustomEvent<AddToCartPUT>

export type RemoveItemToCartEvent = CustomEvent<{ items: ApiCartResponseItem[] }>

export const CART_ID_COOKIE_NAME = 'CART_ID';
export const CART_SUMMARY_COOKIE_NAME = 'CART_SUMMARY_COOKIE_NAME';
