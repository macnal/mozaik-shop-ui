'use client';
import {Box, Card, CardContent, CardHeader, Grid} from "@mui/material";
import {useListSelect} from "@/components/common/ListSelect/ListSelectProvider";
import {JSX} from "react";
import {CheckboxElement, TextFieldElement, useFormContext} from 'react-hook-form-mui'
import {WeblinkerCart} from "@/api/gen/model";
import {KoszykPageDelivery} from "@/app/koszyk/KoszykPageDelivery";

interface KoszykPageClientProps {
    cart: WeblinkerCart;
}


function WatchField<FieldType>({watch: fieldsToWatch, render}: {
    watch: string,
    render: (x: FieldType) => JSX.Element | null
}) {
    const {watch} = useFormContext();
    const value = watch(fieldsToWatch)

    return render(value)
}


export const KoszykPageCustomerAndDelivery = ({
                                      cart,
                                  }: KoszykPageClientProps) => {
    const [isChecked] = useListSelect();
    const selectedItems = (cart.items ?? [])
        .filter(x => isChecked(x.productId));

    return (
        <Grid container spacing={6}>
            <Card sx={{}}>
                <Card sx={{width: '100%'}}>
                    <CardHeader title={'Dostawa'}/>
                    <CardContent>
                        <KoszykPageDelivery/>
                    </CardContent>
                </Card>

                <CardHeader title={'Twoje dane'}/>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid size={{xs: 12, md: 12}}>
                            <TextFieldElement name="person.name" label="Imię i nazwisko"/>
                        </Grid>
                        <Grid size={{xs: 12, md: 6}}>
                            <TextFieldElement name="person.phone" label="Numer telefonu"/>
                        </Grid>
                        <Grid size={{xs: 12, md: 6}}>
                            <TextFieldElement name="person.email" label="Adres e-mail"/>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/*<Box sx={{mb: 3}}>*/}
            {/*    <CheckboxElement*/}
            {/*        disabled={true}*/}
            {/*        name={'wantInvoice'}*/}
            {/*        label={"Chcę otrzymać fakturę"}*/}
            {/*    />*/}
            {/*</Box>*/}

            <WatchField<boolean>
                watch={'wantInvoice'}
                render={(wantInvoice) => {
                    if (!wantInvoice) {
                        return null
                    }

                    return <Card sx={{mb: 2}}>
                        <CardHeader title={'Dane do faktury'}/>

                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid size={{xs: 12, md: 6}}>
                                    <TextFieldElement name="invoice.nip" label="NIP"/>
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <TextFieldElement name="invoice.companyName" label="Nazwa firmy"/>
                                </Grid>

                                <Grid size={{xs: 12, md: 6}}>
                                    <TextFieldElement name="invoice.city" label="Miasto"/>
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <TextFieldElement name="invoice.zip" label="Kod pocztowy"/>
                                </Grid>

                                <Grid size={{xs: 12, md: 6}}>
                                    <TextFieldElement name="invoice.street" label="Ulica"/>
                                </Grid>


                                <Grid size={{xs: 6, md: 3}}>
                                    <TextFieldElement name="invoice.homeNumber" label="Numer domu / mieszkania" required
                                                      sx={{}}
                                                      slotProps={{
                                                          inputLabel: {
                                                              sx: {

                                                                  overflow: 'visible',
                                                                  maxWidth: '400px'
                                                              }
                                                          }
                                                      }}
                                    />
                                </Grid>

                                <Grid size={{xs: 6, md: 3}}>
                                    <TextFieldElement name="invoice.flatNumber" label=""/>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                }}

            />

        </Grid>
    )
}
