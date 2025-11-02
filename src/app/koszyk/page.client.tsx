'use client';
import {Grid, Skeleton, Typography} from "@mui/material";
import {ListSelectProvider} from "@/components/common/ListSelect/ListSelectProvider";
import {useEffect, useState} from "react";
import {KoszykPageCart} from "@/app/koszyk/KoszykPageCart";
import ky from "ky";
import {WeblinkerCart} from "@/api/gen/model";
import {useCart} from "@/context/cartProvider";
import {useNotification} from "@/context/notification";
import {KoszykPageCustomerAndDelivery} from "@/app/koszyk/KoszykPageCustomerAndDelivery";
import {FormContainer} from 'react-hook-form-mui'
import {formArgs} from '@/app/koszyk/formArgs'
import {JsonSchema, UISchemaElement} from "@jsonforms/core";

interface KoszykPageClientProps {
    createOrder: (arg: Record<string, unknown>) => void,
    initialData: Record<string, unknown>,
    formSchema: JsonSchema,
    layoutSchema: UISchemaElement,
}

const FormInner = ({
                       basket,
                       props,
                   }: {
    basket: WeblinkerCart,
    props: KoszykPageClientProps,
}) => {

    return (
        <FormContainer
            {...formArgs}
            onSuccess={(data) => {
                console.log('order: ', data)
                try {
                    props.createOrder(data as Record<string, unknown>);
                } catch (e) {
                    console.error('createOrder handler failed', e);
                }
            }}
        >
            <Grid container spacing={6}>
                {/* On mobile show cart first, then customer/delivery; on large screens keep side-by-side */}
                <Grid size={{xs: 12, lg: 6}} sx={{order: { xs: 2, lg: 1 }}}>
                    <KoszykPageCustomerAndDelivery
                        {...props}
                        cart={basket}
                    />
                </Grid>

                <Grid size={{xs: 12, lg: 6}} sx={{order: { xs: 1, lg: 2 }}}>
                    <KoszykPageCart
                        {...props}
                        cart={basket}
                    />
                </Grid>
            </Grid>
        </FormContainer>
    )
}

export const KoszykPageClient = (props: KoszykPageClientProps) => {
     const {basket, setBasket} = useCart();
     const notification = useNotification();
     const [cartLoading, setCartLoading] = useState<boolean>(true);

    useEffect(() => {
        let mounted = true;
        setCartLoading(true);

        (async () => {
            try {
                const data = await ky<WeblinkerCart>(`/api/cart`, {}).json();
                if (mounted) setBasket(data);
            } catch (err) {
                console.error('Failed to fetch cart', err);
                try {
                    notification.showNotification('Nie udało się pobrać koszyka', 'error');
                } catch {
                    // ignore
                }
                // leave basket as-is
            } finally {
                if (mounted) setCartLoading(false);
            }
        })();

        return () => {
            mounted = false
        };
    }, [setBasket, notification]);

    if (!basket && cartLoading) {
        return <>
            <Typography variant={'h1'} gutterBottom>
                Koszyk
            </Typography>

            <Grid container spacing={6}>
                <Grid size={{xs: 12, lg: 8}}>


                    <Skeleton variant={'rectangular'} width={"100%"} height={339}/>
                </Grid>

                <Grid size={{xs: 12, lg: 4}}>
                    <Skeleton variant={'rectangular'} width={"100%"} height={200} sx={{mb: 2}}/>
                    <Skeleton variant={'rectangular'} width={"100%"} height={500}/>
                </Grid>

            </Grid>


        </>
    }

    if (!(basket?.items?.length)) {
        return <>
            <Typography variant={'h1'} gutterBottom>
                Koszyk
            </Typography>

            <Typography>
                Koszyk jest pusty
            </Typography>
        </>
    }

    return <>
        <Typography variant={'h1'} gutterBottom>
            Koszyk: {basket.uuid}
        </Typography>

        <ListSelectProvider
            initialValue={basket.items?.map(x => x.productId) ?? []}
        >
            <FormInner basket={basket} props={props}/>
        </ListSelectProvider>
    </>
}
