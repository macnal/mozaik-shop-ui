'use client';
import {
    Avatar,
    Button,
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
import {KoszykPageCartItemAmountButtons} from "@/app/koszyk/KoszykPageCartItemAmountButtons";
import {KoszykPageCartCheckbox} from "@/app/koszyk/KoszykPageCartCheckbox";
import Link from "next/link";
import {Close, ImageTwoTone} from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {KoszykPageCartItemDelete} from "@/app/koszyk/KoszykPageCartItemDelete";
import {CartTotalStr} from "./components/CartTotalStr";
import {AppCartResponse} from "@/types/responses";
import {JsonSchema, UISchemaElement} from "@jsonforms/core";
import {useRef} from "react";

interface KoszykPageClientProps {
    cart: AppCartResponse;
    createOrder: (arg: Record<string, unknown>) => void,
    initialData: Record<string, unknown>,
    formSchema: JsonSchema,
    layoutSchema: UISchemaElement,
}

export const KoszykPageCart = ({
                                   cart,
                                   goToSummary,
                                   onDiscountCodeChange,
                                   discountCodeState,
                                   hasDiscountCode
                               }: KoszykPageClientProps & {
    goToSummary: () => void;
    onDiscountCodeChange: (code: string) => void;
    discountCodeState: "IDLE" | "LOADING" | "ERROR";
    hasDiscountCode: boolean;
}) => {
    const inputRef = useRef<HTMLInputElement>(null as unknown as HTMLInputElement);

    return <Grid container spacing={6}>
        <Grid size={{xs: 12, lg: 8}}>
            {cart && <Stack component={'ul'} sx={{pl: 0}}>
                {cart.items
                    .sort((a, b) => a.productId - b.productId)
                    .map(({name, productId, quantity, price, image, url, categoryName}, index, {length}) => {
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
                                    <Avatar component={Link} href={url} variant={"square"} src={image}>
                                        <ImageTwoTone/>
                                    </Avatar>

                                    <Stack sx={{flexShrink: 0}}>
                                        <Typography variant={'subtitle1'}>{name}</Typography>
                                        <Typography variant={'body2'} color={'textSecondary'}
                                                    whiteSpace={'nowrap'}>{categoryName}</Typography>
                                    </Stack>
                                </Grid>

                                <Grid size={{xs: 6, sm: 2}} sx={{
                                    order: {sm: 3},
                                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end'
                                }}>
                                    <Typography variant={'h6'} fontWeight={800}>
                                        {(price * quantity).toFixed(2)} zł
                                    </Typography>
                                </Grid>

                                <Grid size={{xs: 6, sm: 'auto'}} sx={{order: {sm: 2}}}>
                                    <KoszykPageCartItemAmountButtons sx={{}} {...{productId, quantity, price}} />
                                </Grid>

                                <Grid size={{xs: 6, sm: 'auto'}}
                                      sx={{order: {sm: 4}, display: 'flex', justifyContent: 'flex-end'}}>
                                    <KoszykPageCartItemDelete sx={{}} {...{productId, quantity, price}} />
                                </Grid>

                                {index !== (length - 1) && <Grid size={{xs: 12}} sx={{order: 12}}>
                                    <Divider sx={{mb: {xs: 2}}}/>
                                </Grid>}
                            </Grid>
                        </Grid>
                    })}
            </Stack>

            }
        </Grid>

        <Grid size={{xs: 12, lg: 4}} sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
            <Card variant={'elevation'}>
                <CardContent>
                    <Typography variant={'h2'} gutterBottom>
                        Kod rabatowy
                    </Typography>

                    {!cart.promoDesc && <TextField
                        inputRef={inputRef}
                        label={'Wprowadź go tutaj'}
                        margin={'normal'}
                        size={'small'}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                onDiscountCodeChange(inputRef.current!.value)
                            }
                        }}
                        slotProps={{
                            input: {
                                endAdornment: hasDiscountCode ? <IconButton
                                    loading={discountCodeState === 'LOADING'}
                                    onClick={event => {
                                        inputRef.current.value = '';
                                        onDiscountCodeChange('')
                                    }}
                                >
                                    <Close/>
                                </IconButton> : <IconButton
                                    loading={discountCodeState === 'LOADING'}
                                    onClick={event => {
                                        onDiscountCodeChange(inputRef.current!.value)
                                    }}>
                                    <ArrowForwardIcon/>
                                </IconButton>
                            },
                        }}

                    />}

                    {hasDiscountCode && <Typography color={'success'}>
                        Kod rabatowy zaakceptowany
                    </Typography>}

                    {discountCodeState === 'ERROR' && <Typography color={'error'}>
                        Kod rabatowy jest niepoprawny
                    </Typography>}

                    {!!cart.promoDesc && <Typography color={'success'}>
                        {cart.promoDesc}
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
                            <CartTotalStr cart={cart}/>
                        </Typography>}>
                            <ListItemText
                                slotProps={{primary: {variant: 'subtitle1'}}}
                                primary={<>
                                    Wartość produktów
                                </>}/>
                        </ListItem>

                        <ListItem secondaryAction={<Typography variant={'body1'}>
                            {cart.shippingFees} zł
                        </Typography>}>
                            <ListItemText
                                slotProps={{primary: {variant: 'subtitle1'}}}
                                primary={<>
                                    Dostawa
                                </>}/>
                        </ListItem>

                        <Divider/>

                        <ListItem secondaryAction={<Typography variant={'h6'} fontWeight={800}>
                            <CartTotalStr cart={cart} withShippingFees/>
                        </Typography>}>
                            <ListItemText
                                slotProps={{primary: {variant: 'h6'}}}
                                primary={<>
                                    Całość
                                </>}/>
                        </ListItem>
                    </List>

                    <Button
                        variant={'contained'}
                        size={'large'}
                        fullWidth
                        onClick={() => {
                            goToSummary();
                        }}
                        endIcon={<ArrowForwardIcon/>}
                    >
                        Dostawa i płatność
                    </Button>

                </CardContent>
            </Card>
        </Grid>
    </Grid>
}
