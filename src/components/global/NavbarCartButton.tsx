'use client'
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  Stack,
  Typography
} from "@mui/material";
import PopupState, {bindPopover, bindTrigger} from "material-ui-popup-state";
import {useEffect, useLayoutEffect, useState} from "react";
import {AddToCartPOST, ApiCartResponse, RemoveFromCartPOST} from "@/types/responses";
import {AddItemToCartEvent, CartEvents} from './Navbar.types';
import {useLocalStorage} from "usehooks-ts";
import {Delete} from '@mui/icons-material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const NavbarCartButton = () => {
  const [cartId, setCartId] = useLocalStorage<string | null>('CART_ID', null);
  const [cart, setCart] = useState<ApiCartResponse | null>(null);

  useEffect(() => {
    if (cartId) {
      void fetch(`/api/cart/${cartId}`)
        .then((res) => res.json())
        .then((data) => {
          setCart(data)
        });
    }
  }, [])

  const handleAddItem = async (items: AddToCartPOST["items"]) => {
    await fetch('/api/cart', {
      method: 'PUT',
      body: JSON.stringify({
        ...(cartId && {uuid: cartId}),
        items
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setCart(data);

        if (!cartId) {
          setCartId(data.uuid);
        }
      });
  }

  const handleRemoveFromCart = async (items: RemoveFromCartPOST["items"]) => {
    await Promise.all(items.map(async (item) => {
      await fetch(`/api/cart/${cartId}?p=${item.productId}&q=${item.quantity}`, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then((data) => {
          setCart(data);

          if (!cartId) {
            setCartId(data.uuid);
          }
        });
    }));


  }


  useLayoutEffect(() => {
    const fn = (event: AddItemToCartEvent) => {
      void handleAddItem(event.detail.items)

    }

    document.addEventListener(CartEvents.addItem, fn);

    return () => {
      document.removeEventListener(CartEvents.addItem, fn);
    }

  }, [])

  const itemsInCartCount = cart?.items?.length ? cart.items.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0) : undefined

  return <>
    <PopupState variant="popover" popupId="demo-popup-popover">
      {(popupState) => (
        <div>
          <IconButton color={'inherit'} {...bindTrigger(popupState)}>
            <Badge badgeContent={itemsInCartCount} color="error">
              <ShoppingCartTwoToneIcon/>
            </Badge>
          </IconButton>

          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            slotProps={{
              paper: {
                sx: {
                  width: 300
                }
              }
            }}
          >
            <Stack sx={{px: 2, pt: 2}}>
              <Typography variant={'h6'}>
                Koszyk
              </Typography>
            </Stack>


            {(!cart || (cart?.items?.length === 0)) ?
              <Typography sx={{p: 2, color: 'text.secondary'}}>
                Koszyk jest pusty
              </Typography>
              : <><List>
                {cart.items.map((x) => {
                  return <ListItem
                    key={x.productId}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        <Delete onClick={() => {
                          void handleRemoveFromCart([x]);
                        }}/>
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar variant={"rounded"}>
                        AD
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      slotProps={{primary: {variant: 'subtitle1'}}}
                      primary={<>
                        <Typography color={'textSecondary'} component={'span'}>{x.quantity} x </Typography>
                        {x.name}
                      </>}/>
                  </ListItem>
                })}
              </List>

                <Divider/>

                <Stack sx={{p: 2}}>
                  <Button
                    variant={'contained'}
                    endIcon={<ArrowForwardIcon/>}
                  >Przejdź do koszyka</Button>
                </Stack>


              </>
            }
          </Popover>
        </div>
      )}
    </PopupState>
  </>
}
