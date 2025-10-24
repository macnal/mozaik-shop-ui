'use client';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid, Link,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText, Stack,
    Typography
} from "@mui/material";
import {useListSelect} from "@/components/common/ListSelect/ListSelectProvider";
import {JSX, useEffect, useRef} from "react";
import {JsonSchema, UISchemaElement} from "@jsonforms/core";
import {CheckboxElement, FormContainer, TextFieldElement, useFormContext} from 'react-hook-form-mui'
import {zodResolver} from '@hookform/resolvers/zod';
import {CustomerDataZodSchema} from "@/app/koszyk/_schema";
import {AppCartResponse} from "@/types/responses";
import {ImageTwoTone} from "@mui/icons-material";
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import {CartTotalStr} from "./components/CartTotalStr";
import {KoszykPageSummaryShipping, ShippingType} from "@/app/koszyk/KoszykPageSummaryShipping";
import NextLink from "next/link";

interface KoszykPageClientProps {
  cart: AppCartResponse;
  createOrder: (arg: Record<string, unknown>) => void,
  initialData: Record<string, unknown>,
  formSchema: JsonSchema,
  layoutSchema: UISchemaElement,
}


function WatchField<FieldType>({watch: fieldsToWatch, render}: {
  watch: string,
  render: (x: FieldType) => JSX.Element | null
}) {
  const {watch} = useFormContext();
  const value = watch(fieldsToWatch)

  return render(value)
}

const SubmitButton = () => {
  const {trigger, formState: {isSubmitted, isValid, isSubmitting}, watch,} = useFormContext()
  const wantInvoice = watch('wantInvoice');
  const acceptedTerms = watch('acceptedTerms');
  const init = useRef(true);

  useEffect(() => {
    // trigger validation on subsequent changes of dependent toggles
    if (init.current) {
      init.current = false;
      return;
    }

    void trigger();

  }, [wantInvoice, acceptedTerms, trigger]);

  return <>
    <Button
      loading={isSubmitting}
      disabled={isSubmitting || (isSubmitted && !isValid) || !acceptedTerms}
      type={"submit"}
      variant={'contained'}
      size={'large'}
      fullWidth
      color={'success'}
      startIcon={<LockTwoToneIcon/>}
    >
      Bezpieczna płatność
    </Button>
    <Box sx={{mt: 1}}>
      <CheckboxElement name={'acceptedTerms'} label={'Akceptuję regulamin (obowiązkowe)'} />
        <Stack direction={'row'} spacing={2}>
            <Link component={NextLink} href={'/strony/regulamin'}>Regulamin</Link>
            <Link component={NextLink} href={'/strony/polityka-prywatnosci'}>Polityka
                prywatności</Link>
        </Stack>
    </Box>
  </>
}


const args = {

  resolver: zodResolver(CustomerDataZodSchema),
  defaultValues: {
    discountCode: '',
    wantInvoice: false,
    acceptedTerms: false,
    deliveryMethod: 'INPOST' as ShippingType,
    deliveryPointId: '',
    person: {
      name: '',
      phone: '',
      email: '',
    },
    address: {

      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',

      homeNumber: '',
      flatNumber: '',
      info: '',
    },
    invoice: {
      companyName: "",
      nip: "",

      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      phone: "",
      email: "",
      homeNumber: "",
      flatNumber: "",
      info: "",
    },

  }
}

export const KoszykPageSummary = ({
                                    cart,
                                    createOrder,
                                    goBack,
                                    discountCode
                                  }: KoszykPageClientProps & {
  goBack: () => void,
  discountCode: string
}) => {
  const [isChecked] = useListSelect();
  const selectedItems = cart.items
    .filter(x => isChecked(x.productId));

  return <FormContainer
    {...args}
    onSuccess={(data) => {

      createOrder({
        ...data,
        discountCode,
        items: selectedItems.map(x => ({
          productId: x.productId,
          quantity: x.quantity,
        }))
      });
    }}>
    <Grid container spacing={6}>
      <Grid size={{xs: 12, lg: 8}}>


        <Card sx={{}}>
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

        <Box sx={{mb: 3}}>
          <CheckboxElement
            name={'wantInvoice'}
            label={"Chcę otrzymać fakturę"}
          />
        </Box>


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

        <Card sx={{mb: 3}}>
          <CardHeader title={'Dostawa'}/>

          <CardContent>
            <KoszykPageSummaryShipping/>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title={'Przedmioty'}
            action={<Button size={'small'} onClick={() => {
              goBack()
            }}>
              Zmień
            </Button>}
          />

          <CardContent>
            <List disablePadding dense>
              {selectedItems.map(({name, productId, quantity, image}) => {
                return <ListItem
                  key={productId}
                  disableGutters
                >
                  <ListItemAvatar>
                    <ListItemAvatar>
                      <Avatar variant={"square"} src={image}>
                        <ImageTwoTone/>
                      </Avatar>
                    </ListItemAvatar>
                  </ListItemAvatar>

                  <ListItemText
                    slotProps={{primary: {variant: 'subtitle1'}}}
                    primary={`${quantity} x ${name}`}
                  />
                </ListItem>
              })}
            </List>

          </CardContent>
        </Card>
      </Grid>

      <Grid size={{xs: 12, lg: 4}}>
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

              <ListItem
                secondaryAction={<Typography variant={'h6'} fontWeight={800}>
                  <CartTotalStr cart={cart} withShippingFees/>
                </Typography>}
              >
                <ListItemText
                  slotProps={{primary: {variant: 'h6'}}}
                  primary={<>
                    Całość
                  </>}/>
              </ListItem>
            </List>

            <SubmitButton/>

          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </FormContainer>
}
