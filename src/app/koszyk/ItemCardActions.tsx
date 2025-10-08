'use client'

import {Add, Delete, Remove} from "@mui/icons-material"
import {Button, ButtonGroup, IconButton, Stack} from "@mui/material"
import {RemoveFromCartDELETE} from "@/types/responses";
import Cookies from "js-cookie";
import {CART_ID_COOKIE_NAME} from "@/components/global/Navbar.types";
import {useRouter} from "next/navigation";


interface ItemCardActionsProps {
  productId: number;
  quantity: number;
}

export function ItemCardActions({productId, quantity}: ItemCardActionsProps) {
  const router = useRouter();
  const cartId = Cookies.get(CART_ID_COOKIE_NAME) || null;

  const handleRemoveFromCart = async (items: RemoveFromCartDELETE["items"]) => {
    await fetch(`/api/cart/${cartId}`, {
      method: 'DELETE',
      body: JSON.stringify({
        items
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        router.refresh();
        // if (!cartId) {
        //   Cookies.set(CART_ID_COOKIE_NAME, data.uuid, {expires: 365});
        // }
      });
  }

  return <Stack direction={'row'} spacing={3}>
    <ButtonGroup variant="outlined" aria-label="Loading button group">
      <Button onClick={() => {
        void fetch(`/api/cart/${cartId}`, {
          method: 'PUT',
          body: JSON.stringify({
            items: [
              {productId, quantity: 1},
            ]
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(() => {
          router.refresh();
        })


      }}>
        <Add/>

      </Button>
      <Button color={'primary'} disableRipple>
        {quantity}
      </Button>
      <Button loading={false} loadingPosition="center"

              onClick={() => {
                void handleRemoveFromCart([
                  {productId, quantity: 1}
                ])
              }}
      >
        <Remove/>
      </Button>
    </ButtonGroup>

    <IconButton edge="end" aria-label="delete">
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
