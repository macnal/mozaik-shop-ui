'use client'

import {Add, Delete, Remove} from "@mui/icons-material"
import {Button, ButtonGroup, IconButton, Stack, Typography} from "@mui/material"
import {RemoveFromCartDELETE} from "@/types/responses";
import {useRouter} from "next/navigation";


interface ItemCardActionsProps {
  productId: number;
  quantity: number;
  price: number;
}

export function ItemCardActions({productId, quantity, price}: ItemCardActionsProps) {
  const router = useRouter();
  //const cartId = Cookies.get(CART_ID_COOKIE_NAME) || null;

  const handleRemoveFromCart = async (items: RemoveFromCartDELETE["items"]) => {
    await fetch(`/api/cart`, {
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

  return <Stack direction={'row'} spacing={3} sx={{alignItems: 'center'}}>
    <ButtonGroup variant="outlined" aria-label="Loading button group">
      <Button loading={false} loadingPosition="center"

              onClick={() => {
                void handleRemoveFromCart([
                  {productId, quantity: 1}
                ])
              }}
      >
        <Remove/>
      </Button>

      <Button color={'primary'} disableRipple sx={{width: 56}} >
        {quantity}
      </Button>

      <Button onClick={() => {
        void fetch(`/api/cart`, {
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
    </ButtonGroup>

    <Typography variant={'h6'} fontWeight={800} sx={{minWidth: 90, textAlign: 'right'}}>
      {(price * quantity).toFixed(2)} zł
    </Typography>

    <IconButton edge="end" aria-label="Usuń">
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
