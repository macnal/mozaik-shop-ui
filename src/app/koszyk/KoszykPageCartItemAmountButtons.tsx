'use client'

import {Add, Remove} from "@mui/icons-material"
import {Button, ButtonGroup, OutlinedInput, SxProps} from "@mui/material"
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {WeblinkerCartItem} from "@/api/gen/model";
import {useCart} from "@/context/cartProvider";

interface ItemCardActionsProps {
    productId: number;
    quantity: number;
    price: number;
    sx?: SxProps;
}

export function KoszykPageCartItemAmountButtons({sx, productId, quantity, price}: ItemCardActionsProps) {
    const router = useRouter();
    const {basket, updateBasetItem} = useCart();
    const [loading, setLoading] = useState<{ productId: number | null, direction: 'add' | 'sub' | null }>({
        productId: null,
        direction: null
    });

    useEffect(() => {
        setLoading(() => ({productId: null, direction: null}));
    }, [basket])


    return <ButtonGroup variant="outlined" aria-label="Loading button group">
        <Button loading={loading.productId === productId && loading.direction === 'sub'}
                disabled={loading.productId === productId}
                loadingPosition="center"

                onClick={() => {
                    setLoading(() => ({productId, direction: 'add'}));
                    updateBasetItem({productId: productId, quantity: 0} as WeblinkerCartItem, "SUB")
                }}>
            <Remove/>
        </Button>

        <OutlinedInput sx={{width: 56, borderRadius: 0}}
                       inputProps={{sx: {textAlign: 'center'}}}
                       slotProps={{notchedOutline: {sx: {borderColor: 'primary.light'}}}}
                       size={'small'} value={quantity} readOnly/>

        <Button
            loading={loading.productId === productId && loading.direction === 'add'}
            disabled={loading.productId != null}

            onClick={() => {
                setLoading(() => ({productId, direction: 'add'}));
                updateBasetItem({productId: productId, quantity: 0} as WeblinkerCartItem, "ADD")
            }}>
            <Add/>
        </Button>
    </ButtonGroup>
}
