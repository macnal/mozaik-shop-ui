import {AddToCartPUT, ApiCartResponseItem} from "@/types/responses";

export enum CartEvents {
  init = "cart:init",
  addItem = "cart:addItem",
  removeItem = "cart:removeItem",
  fetch = "cart:fetch",
}

export type AddItemToCartEvent = CustomEvent<AddToCartPUT>

export type RemoveItemFromCartEvent = CustomEvent<{ items: ApiCartResponseItem[] }>

export const CART_ID_COOKIE_NAME = 'CART_ID';
