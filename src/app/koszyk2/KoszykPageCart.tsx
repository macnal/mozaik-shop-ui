'use client';
import {
    Avatar,
    Card,
    CardContent,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {KoszykPageCartItemAmountButtons} from "@/app/koszyk2/KoszykPageCartItemAmountButtons";
import {KoszykPageCartCheckbox} from "@/app/koszyk2/KoszykPageCartCheckbox";
import Link from "next/link";
import {ImageTwoTone} from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {KoszykPageCartItemDelete} from "@/app/koszyk2/KoszykPageCartItemDelete";
import {useEffect, useRef, useState} from "react";
import {WeblinkerCart} from "@/api/gen/model";
import {CartTotalStr2} from "@/app/koszyk/components/CartTotalStr";
import {useCart} from "@/context/cartProvider";
import {KoszykSubmitButton} from "@/app/koszyk2/KoszykSubmitButton";

interface KoszykPageCartProps {
    cart: WeblinkerCart;
    [key: string]: unknown;
}

export const KoszykPageCart = ({
                                   cart,
                               }: KoszykPageCartProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const sortedItems = cart?.items ? [...cart.items].sort((a, b) => a.productId - b.productId) : [];
    const [discountCodeState, setDiscountCodeState] = useState<boolean>(false);
    const {basket, addPromoCode} = useCart();

    useEffect(() => {
        setDiscountCodeState(false);
    }, [basket])

    return <Grid container spacing={6}>

        <Grid sx={{display: 'flex', flexDirection: 'column'}}>
            {cart && <Stack component={'ul'} sx={{pl: 0}}>
                {sortedItems.map(({
                                      name,
                                      slug,
                                      productId,
                                      quantity,
                                      price,
                                      image,
                                      categoryName,
                                      categorySlug
                                  }, index, {length}) => {
                    return <Grid
                        container
                        key={productId}
                        component={'li'}
                        spacing={0}
                    >
                        <Grid size={{xs: 'auto'}}>
                            <KoszykPageCartCheckbox id={productId}/>
                        </Grid>

                        <Grid container size={{xs: 'grow'}} spacing={{xs: 2}} sx={{alignItems: 'center'}}>
                            <Grid container spacing={2} size={{xs: 'grow'}}
                                  sx={{order: 0, display: 'flex', alignItems: 'center', flexWrap: 'nowrap'}}>
                                <Avatar component={Link} href={`/${categorySlug}/${slug}`} variant={"square"}
                                        src={image}>
                                    <ImageTwoTone/>
                                </Avatar>

                                <Stack sx={{width: '100%'}}>
                                    <Typography variant={'subtitle1'}>{name}</Typography>
                                    <Grid container alignItems={'center'} sx={{width: '100%'}}>
                                        <Grid sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                                            <Typography variant={'h6'} fontWeight={800}>
                                                {(price * quantity).toFixed(2)} zł
                                            </Typography>
                                            <Typography variant={'body2'} color={'textSecondary'} whiteSpace={'nowrap'}>
                                                {categoryName}
                                            </Typography>
                                        </Grid>
                                        <Grid sx={{ml: 'auto', display: 'flex', alignItems: 'center', gap: 1}}>
                                            <Grid sx={{transform: 'scale(0.8)'}}>
                                                <KoszykPageCartItemAmountButtons {...{productId, quantity, price}}
                                                                                 sx={{mb: 0, ml: 0}}/>
                                            </Grid>
                                            <Grid sx={{transform: 'scale(0.7)'}}>
                                                <KoszykPageCartItemDelete
                                                    {...{productId, quantity}}/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </Grid>

                            {index !== (length - 1) && <Grid size={{xs: 12}} sx={{order: 12}}>
                                <Divider sx={{mb: {xs: 2}}}/>
                            </Grid>}
                        </Grid>
                    </Grid>
                })}
            </Stack>

            }
            <Card variant={'elevation'}>
                <CardContent>
                    <Typography variant={'h2'} gutterBottom>
                        Kod rabatowy
                    </Typography>

                    <TextField
                        inputRef={inputRef}
                        label={'Wprowadź go tutaj'}
                        margin={'normal'}
                        size={'small'}
                        onKeyDown={() => {
                            // intentionally empty; handler removed to avoid unused param warning
                        }}
                         slotProps={{
                             input: {
                                 endAdornment:     <IconButton
                                      loading={discountCodeState}
                                      onClick={() => {
                                          setDiscountCodeState(true)
                                          void addPromoCode(inputRef.current!.value)
                                      }}>
                                      <ArrowForwardIcon/>
                                  </IconButton>
                             },
                         }}

                    />

                    {!!cart.promoCode && <Typography color={'success'}>
                        {cart.promoCode}  {cart.promoDesc}
                    </Typography>}


                </CardContent>
            </Card>

            <Card variant={'elevation'}>
                <CardContent>
                    <Typography variant={'h2'}>
                        Podsumowanie
                    </Typography>

                    <List>
                        <ListItem secondaryAction={<Typography variant={'body1'}>
                            <CartTotalStr2 cart={cart}/>
                        </Typography>}>
                            <ListItemText
                                slotProps={{primary: {variant: 'subtitle1'}}}
                                primary={<>
                                    Wartość produktów
                                </>}/>
                        </ListItem>

                        <ListItem secondaryAction={<Typography variant={'body1'}>
                            {cart?.shippingFees ? cart.shippingFees.toFixed(2) : 0} zł
                        </Typography>}>
                            <ListItemText
                                slotProps={{primary: {variant: 'subtitle1'}}}
                                primary={<>
                                    Dostawa
                                </>}/>
                        </ListItem>

                        <Divider/>


                        <ListItem secondaryAction={<Typography variant={'h6'} fontWeight={800}>
                            {cart?.total ? cart.total.toFixed(2) : 0} zł
                        </Typography>}>
                            <ListItemText
                                slotProps={{primary: {variant: 'h6'}}}
                                primary={<>
                                    Całość
                                </>}/>
                        </ListItem>
                    </List>

                    <KoszykSubmitButton/>

                </CardContent>
            </Card>
        </Grid>
    </Grid>
}
