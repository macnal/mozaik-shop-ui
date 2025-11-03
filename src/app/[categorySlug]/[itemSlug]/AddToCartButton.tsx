'use client'

import React, {useState} from 'react';
import {ShoppingCartTwoTone} from "@mui/icons-material";
import {Button, CircularProgress} from "@mui/material";
import {getAppConfig} from "@/app.config";
import {useCart} from "@/context/cartProvider";
import {WeblinkerCartItem, WeblinkerProductDetail} from "@/api/gen/model";

const {interface: {availableProductsMin}} = await getAppConfig();

export const AddToCartButton = ({item}: { item: WeblinkerProductDetail }) => {
    const {updateBasetItem} = useCart();
    const isAvailable = availableProductsMin < item.stock;
    const [submitting, setSubmitting] = useState(false);


    return <Button
        onClick={async () => {
            if (submitting) return;
            setSubmitting(true);
            try {
                // zawsze dodajemy 1 sztukę przy pierwszym dodaniu z poziomu strony produktu
                await updateBasetItem({productId: item.id, quantity: 1} as WeblinkerCartItem, "ADD");
            } catch (e) {
                // swallow — notification zrobione w providerze
                console.error('Add to cart failed', e);
            } finally {
                // krótkie opóźnienie żeby zapobiec natychmiastowemu ponownemu kliknięciu
                setTimeout(() => setSubmitting(false), 300);
            }
        }}
        variant={'contained'}
        size={'large'}
        startIcon={submitting ? <CircularProgress color="inherit" size={20} /> : <ShoppingCartTwoTone/>}
        disabled={!isAvailable || submitting}
        aria-busy={submitting}
    >
        {submitting ? 'Dodawanie...' : 'Dodaj do koszyka'}

    </Button>
}
