'use client'
import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone';

import {Fab, CircularProgress} from "@mui/material";
import React, {useState} from 'react';
import {useCart} from "@/context/cartProvider";
import {WeblinkerCartItem} from "@/api/gen/model";

interface ItemCardAddToCartProps {
  itemId: number;
  disabled?: boolean;
}

export const ItemCardAddToCart = ({itemId, disabled}: ItemCardAddToCartProps) => {
    const {updateBasetItem} = useCart();
    const [submitting, setSubmitting] = useState(false);


  return <Fab
    size="small"
    color="primary"
    aria-label="Dodaj do koszyka"
    disabled={disabled || submitting}
    sx={{right: 12, bottom: 12, position: 'absolute'}}
    onClick={async (outerEvent) => {
        outerEvent.preventDefault();
        if (disabled || submitting) return;
        setSubmitting(true);
        try {
            await updateBasetItem({productId: itemId, quantity: 1} as WeblinkerCartItem,"ADD");
        } catch (e) {
            // updateBasetItem pokazuje powiadomienia — logujemy dla debugu
            console.error('Failed to add item to cart', e);
        } finally {
            // krótkie opóźnienie aby zapobiec natychmiastowemu ponownemu kliknięciu
            setTimeout(() => setSubmitting(false), 300);
        }
    }}
    aria-busy={submitting}
  >
    {submitting ? <CircularProgress color="inherit" size={20} /> : <AddShoppingCartTwoToneIcon/>}
  </Fab>
}
