'use client'

import {Delete} from "@mui/icons-material"
import {IconButton} from "@mui/material"
import {useEffect, useState} from "react";
import {useCart} from "@/context/cartProvider";
import {WeblinkerCartItem} from "@/api/gen/model";


interface ItemCardActionsProps {
    productId: number;
    quantity?: number;
}

export function KoszykPageCartItemDelete({productId}: Readonly<ItemCardActionsProps>) {
    const {basket, updateBasetItem} = useCart();
    const [loading, setLoading] = useState<{ productId: number | null }>({
        productId: null,
    });

    useEffect(() => {
        setLoading(() => ({productId: null, direction: null}));
    }, [basket])

    return <IconButton edge="end" aria-label="Usuń"
                       loading={loading.productId === productId}
                       disabled={loading.productId != null}
                       onClick={() => {
                           // pass operation as second argument
                           setLoading(() => ({productId}));
                           updateBasetItem({productId: productId, quantity: 0} as WeblinkerCartItem, "DEL")
                       }}
    >
        <Delete/>
    </IconButton>
}
