'use client'

import {Delete} from "@mui/icons-material"
import {IconButton, SxProps} from "@mui/material"
import {RemoveFromCartDELETE} from "@/types/responses";
import {useRouter} from "next/navigation";
import {useLayoutEffect, useState} from "react";
import {CartEvents, RemoveItemFromCartEvent} from "../@navbar/_components/Navbar.types";


interface ItemCardActionsProps {
  productId: number;
  quantity: number;
  price: number;
  sx?: SxProps;
}

export function KoszykPageCartItemDelete({sx, productId, quantity, price}: ItemCardActionsProps) {
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

    document.addEventListener(CartEvents.fetch, fn, {});

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

  return <IconButton edge="end" aria-label="Usuń"
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
}
