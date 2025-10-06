import {AddToCartPOST, ApiCartResponseItem} from "@/types/responses";

export enum CartEvents {
  init = "cart:init",
  addItem = "cart:addItem",
  removeItem = "cart:removeItem",
}

export type AddItemToCartEvent = CustomEvent<AddToCartPOST>

export type RemoveItemToCartEvent = CustomEvent<{ items: ApiCartResponseItem[] }>
