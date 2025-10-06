'use client'

import {GameExtended} from "@/types/responses";
import {ShoppingCartTwoTone} from "@mui/icons-material";
import {Button} from "@mui/material";
import {AddItemToCartEvent, CartEvents} from "@/components/global/Navbar.types";

export const AddToCartButton = ({item}: { item: GameExtended }) => {


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
    disabled={item.stock === 0}
  >
    Dodaj do koszyka

  </Button>
}
