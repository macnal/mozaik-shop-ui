'use client'

import {Add, Delete, Remove} from "@mui/icons-material"
import {Button, ButtonGroup, IconButton, OutlinedInput, Stack, Typography} from "@mui/material"
import {RemoveFromCartDELETE} from "@/types/responses";
import {useRouter} from "next/navigation";
import {useEffect, useLayoutEffect, useState} from "react";
import {AddItemToCartEvent, CartEvents, RemoveItemFromCartEvent} from "../@navbar/_components/Navbar.types";


interface ItemCardActionsProps {
  productId: number;
  quantity: number;
  price: number;
}

export function KoszykPageItemActions({productId, quantity, price}: ItemCardActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<{ productId: number | null, direction: 'add' | 'sub' | null }>({
    productId: null,
    direction: null
  });

  useLayoutEffect(() => {
    const fn = () => {
      router.refresh();
      setLoading(() => ({productId: null, direction: null}));
    }

    document.addEventListener(CartEvents.fetch, fn, {

    });

    return () => {
      document.removeEventListener(CartEvents.fetch, fn)

    }
  }, [])

  const handleRemoveFromCart = async (items: RemoveFromCartDELETE["items"]) => {
    setLoading(() => ({productId: items[0].productId, direction: 'sub'}));

    const event = new CustomEvent<RemoveItemFromCartEvent>(CartEvents.removeItem, {
      detail: {
        items,
      } as never,
    });

    document.dispatchEvent(event);
  }

  return <Stack direction={'row'} spacing={3} sx={{alignItems: 'center'}}>
    <ButtonGroup variant="outlined" aria-label="Loading button group">
      <Button loading={loading.productId === productId && loading.direction === 'sub'}
              disabled={loading.productId === productId}
              loadingPosition="center"

              onClick={() => {
                void handleRemoveFromCart([
                  {productId, quantity: 1}
                ])
              }}
      >
        <Remove/>
      </Button>

      <OutlinedInput sx={{width: 56, borderRadius: 0}}
                     inputProps={{sx: {textAlign: 'center'}}}
                     slotProps={{
                       notchedOutline: {
                         sx: {
                           borderColor: 'primary.light'
                         }
                       }
                     }}

                     size={'small'} value={quantity} readOnly/>

      <Button

        loading={loading.productId === productId && loading.direction === 'add'}
        disabled={loading.productId === productId}

        onClick={() => {
          setLoading(() => ({productId, direction: 'add'}));

          const event = new CustomEvent<AddItemToCartEvent>(CartEvents.addItem, {
            detail: {
              items: [
                {productId, quantity: 1},
              ],
            } as never,
          });

          document.dispatchEvent(event);
        }}>
        <Add/>

      </Button>
    </ButtonGroup>

    <Typography variant={'h6'} fontWeight={800} sx={{minWidth: 90, textAlign: 'right'}}>
      {(price * quantity).toFixed(2)} zł
    </Typography>

    <IconButton edge="end" aria-label="Usuń"
                disabled={loading.productId === productId}
    >
      <Delete
        onClick={() => {
          void handleRemoveFromCart([{
            productId,
            quantity
          }]);
        }}
      />
    </IconButton>
  </Stack>
}
