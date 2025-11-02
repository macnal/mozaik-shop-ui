'use client'
import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone';

import {Fab} from "@mui/material";
import {useCart} from "@/context/cartProvider";
import {WeblinkerCartItem} from "@/api/gen/model";

interface ItemCardAddToCartProps {
  itemId: number;
  disabled?: boolean;
}

export const ItemCardAddToCart = ({itemId, disabled}: ItemCardAddToCartProps) => {
    const {updateBasetItem} = useCart();


  return <Fab
    size="small"
    color="secondary"
    aria-label="Dodaj do koszyka"
    disabled={disabled}
    sx={{right: 12, bottom: 12, position: 'absolute'}}
    onClick={(outerEvent) => {
        updateBasetItem({productId: itemId, quantity: 1} as WeblinkerCartItem,"ADD");
        outerEvent.preventDefault();
    }}
  >
    <AddShoppingCartTwoToneIcon/>
  </Fab>
}
