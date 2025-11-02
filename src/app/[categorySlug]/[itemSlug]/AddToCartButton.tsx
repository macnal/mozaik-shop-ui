'use client'

import {GameExtended} from "@/types/responses";
import {ShoppingCartTwoTone} from "@mui/icons-material";
import {Button} from "@mui/material";
import {getAppConfig} from "@/app.config";
import {useCart} from "@/context/cartProvider";
import {WeblinkerCartItem} from "@/api/gen/model";

const {interface: {availableProductsMin}} = await getAppConfig();

export const AddToCartButton = ({item}: { item: GameExtended }) => {
    const {updateBasetItem} = useCart();
    const isAvailable = availableProductsMin < item.stock


    return <Button
        onClick={() => {
            updateBasetItem({productId: item.id, quantity: item.stock} as WeblinkerCartItem, "ADD");
        }}
        variant={'contained'}
        size={'large'}
        startIcon={<ShoppingCartTwoTone/>}
        disabled={!isAvailable}
    >
        Dodaj do koszyka

    </Button>
}
