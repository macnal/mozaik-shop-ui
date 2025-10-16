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
  Stack,
  Typography,
  useMediaQuery
} from "@mui/material";
import PopupState, {bindHover, bindPopover, bindToggle} from "material-ui-popup-state";
import {useEffect, useLayoutEffect, useState} from "react";
import {AddToCartPUT, AppCartResponse, RemoveFromCartDELETE} from "@/types/responses";
import {AddItemToCartEvent, CartEvents, RemoveItemFromCartEvent} from './Navbar.types';
import {ImageTwoTone} from '@mui/icons-material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from "next/link";
import HoverPopover from 'material-ui-popup-state/HoverPopover'

export const NavbarCartButton = ({}) => {
  const [cart, setCart] = useState<AppCartResponse | null>(null);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const refetchCart = () => {
    void fetch(`/api/cart`)
      .then((res) => res.json())
      .then((data) => {
        setCart(data)

        const event = new CustomEvent(CartEvents.fetch, {
          detail: {} as never,
        });

        document.dispatchEvent(event);

      });
  }

  useEffect(() => {
    void refetchCart();
  }, [])

  const handleAddItem = async (items: AddToCartPUT["items"]) => {
    await fetch(`/api/cart`, {
      method: 'PUT',
      body: JSON.stringify({
        // ...(cartId && {uuid: cartId}),
        items
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setCart(data);
        const event = new CustomEvent(CartEvents.fetch, {
          detail: {} as never,
        });

        document.dispatchEvent(event);
      });
  }

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
        setCart(data);
        const event = new CustomEvent(CartEvents.fetch, {
          detail: {} as never,
        });

        document.dispatchEvent(event);
      });
  }

  useLayoutEffect(() => {
    const onAddItem = (event: AddItemToCartEvent) => {
      void handleAddItem(event.detail.items);
    }

    const onRemoveItem = (event: RemoveItemFromCartEvent) => {
      void handleRemoveFromCart(event.detail.items);
    }

    document.addEventListener(CartEvents.addItem, onAddItem);
    document.addEventListener(CartEvents.removeItem, onRemoveItem);

    return () => {
      document.removeEventListener(CartEvents.addItem, onAddItem);
      document.removeEventListener(CartEvents.removeItem, onRemoveItem);
    }

  }, [])

  const itemsInCartCount = cart?.items?.length ? cart.items.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0) : undefined

  return <>
    <PopupState variant="popover" popupId="demo-popup-popover">
      {(popupState) => (
        <>
          <IconButton
            component={Link}
            href={'/koszyk'}
            color={'inherit'}
            {...!isMobile && bindHover(popupState)}
          >
            <Badge badgeContent={itemsInCartCount} color="error">
              <ShoppingCartTwoToneIcon/>
            </Badge>
          </IconButton>

          {!isMobile && <HoverPopover
            disableScrollLock
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
                    // secondaryAction={
                    //   <IconButton edge="end" aria-label="delete">
                    //     <Delete onClick={() => {
                    //       void handleRemoveFromCart([x]);
                    //     }}/>
                    //   </IconButton>
                    // }
                  >
                    <ListItemAvatar>
                      <ListItemAvatar>
                        <Avatar component={Link} href={x.url} variant={"square"} src={x.image}>
                          <ImageTwoTone/>
                        </Avatar>
                      </ListItemAvatar>
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
                    {...bindToggle(popupState)}
                    component={Link}
                    href={'/koszyk'}

                    variant={'contained'}
                    endIcon={<ArrowForwardIcon/>}
                  >Przejdź do koszyka</Button>
                </Stack>
              </>
            }
          </HoverPopover>}
        </>
      )}
    </PopupState>
  </>
}
