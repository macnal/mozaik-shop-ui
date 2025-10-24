'use client'

import {GameExtended} from "@/types/responses";
import {ShoppingCartTwoTone} from "@mui/icons-material";
import {Button} from "@mui/material";
import {AddItemToCartEvent, CartEvents} from "@/app/@navbar/_components/Navbar.types";
import {getAppConfig} from "@/app.config";
const {interface: {availableProductsMin}} = await getAppConfig();

export const AddToCartButton = ({item}: { item: GameExtended }) => {

  const isAvailable = availableProductsMin < item.stock


  return <Button
    onClick={() => {
      const event = new CustomEvent<AddItemToCartEvent>(CartEvents.addItem, {
        detail: {
          items: [
            {
              productId: item.id,
              quantity: 1
            },
          ]
        } as never,
      });

      document.dispatchEvent(event);
    }}
    variant={'contained'}
    size={'large'}
    startIcon={<ShoppingCartTwoTone/>}
    disabled={!isAvailable}
  >
    Dodaj do koszyka

  </Button>
}
