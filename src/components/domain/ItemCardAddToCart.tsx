'use client'
import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone';

import {Fab} from "@mui/material";
import {AddItemToCartEvent, CartEvents} from "@/components/global/Navbar.types";

interface ItemCardAddToCartProps {
  itemId: number;
  disabled?: boolean;
}

export const ItemCardAddToCart = ({itemId, disabled}: ItemCardAddToCartProps) => {


  return <Fab size="small" color="secondary" aria-label="Dodaj do koszyka"
              disabled={disabled}
              sx={{right: 12, bottom: 12, position: 'absolute'}}


              onClick={(outerEvent) => {
                const event = new CustomEvent<AddItemToCartEvent>(CartEvents.addItem, {
                  detail: {
                    items: [
                      {
                        productId: itemId,
                        quantity: 1
                      },
                    ]
                  } as never,
                });

                document.dispatchEvent(event);
                outerEvent.preventDefault();
              }}
  >
    <AddShoppingCartTwoToneIcon/>
  </Fab>
}
