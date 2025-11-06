'use client';
import {Checkbox} from "@mui/material";
import {useCart} from "@/context/cartProvider";
import {WeblinkerCartItem} from "@/api/gen/model";

interface ItemCardActionsProps {
    productId: number;
    checked: boolean | undefined;
}

export function KoszykPageCartCheckbox({productId, checked}: Readonly<ItemCardActionsProps>) {
    const {basket, updateBasetItem} = useCart();

    const handleClick = () => {
        void updateBasetItem({productId: productId, checked: checked} as WeblinkerCartItem, 'TOGGLE');
    }

    return <Checkbox
        checked={checked}
        onClick={handleClick}
        edge={'start'}
        sx={{mr: 2}}
        name={'selected'}
        value={productId}
    />
}
