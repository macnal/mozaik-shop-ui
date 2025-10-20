'use client';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography
} from "@mui/material";
import {ListSelectProvider, useListSelect} from "@/components/common/ListSelect/ListSelectProvider";
import {KoszykPageItemAmountButtons} from "@/app/koszyk/KoszykPageItemAmountButtons";
import {KoszykPageCheckbox} from "@/app/koszyk/KoszykPageCheckbox";
import {JSX, useEffect, useRef, useState} from "react";
import {JsonSchema, UISchemaElement} from "@jsonforms/core";
import {CheckboxElement, FormContainer, TextFieldElement, useFormContext} from 'react-hook-form-mui'
import {zodResolver} from '@hookform/resolvers/zod';
import {CustomerDataZodSchema} from "@/app/koszyk/_schema";
import Link from "next/link";
import {AppCartResponse} from "@/types/responses";
import {ImageTwoTone} from "@mui/icons-material";
import KoszykPageSummaryInpost from "@/app/koszyk/KoszykPageSummaryInpost";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import {KoszykPageItemDelete} from "@/app/koszyk/KoszykPageItemDelete";

interface KoszykPageClientProps {
  cart: AppCartResponse;
  createOrder: (arg: Record<string, unknown>) => void,
  initialData: Record<string, unknown>,
  formSchema: JsonSchema,
  layoutSchema: UISchemaElement,
}

const TotalStr = ({cart}: { cart: AppCartResponse }) => {
  const [isChecked] = useListSelect();

  const amount = cart.items
    .filter(x => isChecked(x.productId))
    .reduce((acc, item) => {
      acc += (item.quantity * item.price);

      return acc
    }, 0);

  return `${amount.toFixed(2)} zł`;
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
  const {trigger, formState: {errors, isSubmitted, isValid, isSubmitting}, watch,} = useFormContext()
  const wantInvoice = watch('wantInvoice');
  const init = useRef(true);

  useEffect(() => {
    if (!init.current) {
      void trigger();
      init.current = false;
    }

  }, [wantInvoice]);

  return <Button
    loading={isSubmitting}
    disabled={isSubmitting || (isSubmitted && !isValid)}
    type={"submit"}
    variant={'contained'}
    size={'large'}
    fullWidth
    color={'success'}
    startIcon={<LockTwoToneIcon/>}
  >
    Bezpieczna płatność
  </Button>
}


const args = {

  resolver: zodResolver(CustomerDataZodSchema),
  defaultValues: {
    wantInvoice: false,
    address: {
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      phone: '',
      email: '',
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
    }
  }
}

const SummaryPage = ({
                       cart,
                       createOrder,
                       initialData,
                       formSchema,
                       layoutSchema,
                     }: KoszykPageClientProps) => {
  const [isChecked] = useListSelect();
  const selectedItems = cart.items
    .filter(x => isChecked(x.productId));

  return <FormContainer
    {...args}
    onSuccess={(data) => {

      createOrder({
        ...data,
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
                <TextFieldElement name="address.name" label="Imię i nazwisko"/>
              </Grid>

              <Grid size={{xs: 12, md: 6}}>
                <TextFieldElement name="address.city" label="Miasto"/>
              </Grid>
              <Grid size={{xs: 12, md: 6}}>
                <TextFieldElement name="address.zip" label="Kod pocztowy"/>
              </Grid>

              <Grid size={{xs: 12, md: 6}}>
                <TextFieldElement name="address.street" label="Ulica"/>
              </Grid>


              <Grid size={{xs: 6, md: 3}}>
                <TextFieldElement name="address.homeNumber" label="Numer domu / mieszkania"
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
                <TextFieldElement name="address.flatNumber" label=""/>
              </Grid>

              <Grid size={{xs: 12, md: 6}}>
                <TextFieldElement name="address.phone" label="Numer telefonu"/>
              </Grid>
              <Grid size={{xs: 12, md: 6}}>
                <TextFieldElement name="address.email" label="Adres e-mail"/>
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
            <KoszykPageSummaryInpost/>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title={'Przedmioty'}/>

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
                <TotalStr cart={cart}/>
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
                  <TotalStr cart={cart}/>
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

export const CartPage = ({
                           cart,
                           goToSummary
                         }: KoszykPageClientProps & {
  goToSummary: () => void;
}) => {
  return <Grid container spacing={6}>
    <Grid size={{xs: 12, lg: 8}}>
      {cart && <Stack component={'ul'} sx={{pl: 0}}>
        {cart.items.map(({name, productId, quantity, price, image, url, categoryName}, index, {length}) => {
          return <Grid
            container
            key={productId}
            component={'li'}
            spacing={0}
          >
            <Grid size={{xs: 'auto'}}>
              <KoszykPageCheckbox id={productId}/>
            </Grid>

            <Grid container size={{xs: 'grow'}} spacing={{ xs: 2 }} sx={{alignItems: 'center'}}>
              <Grid container spacing={2} size={{xs: 'grow'}}
                    sx={{order: 0, display: 'flex', alignItems: 'center', flexWrap: 'nowrap'}}>
                <Avatar component={Link} href={url} variant={"square"} src={image}>
                  <ImageTwoTone/>
                </Avatar>

                <Stack sx={{ flexShrink: 0 }}>
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
                <KoszykPageItemAmountButtons sx={{}} {...{productId, quantity, price}} />
              </Grid>

              <Grid size={{xs: 6, sm: 'auto'}} sx={{order: {sm: 4}, display: 'flex', justifyContent: 'flex-end'}}>
                <KoszykPageItemDelete sx={{}} {...{productId, quantity, price}} />
              </Grid>

              {index !== (length - 1) && <Grid size={{xs: 12}} sx={{order: 12}}>
                <Divider sx={{mb: { xs: 2  }}}/>
              </Grid>}
            </Grid>
          </Grid>
        })}
      </Stack>

      }
    </Grid>

    <Grid size={{xs: 12, lg: 4}}>
      <Card variant={'elevation'}>
        <CardContent>
          <Typography variant={'h2'}>
            Podsumowanie
          </Typography>

          <List>
            <ListItem secondaryAction={<Typography variant={'body1'}>
              <TotalStr cart={cart}/>
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
              <TotalStr cart={cart}/>
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


export const KoszykPageClient = (props: KoszykPageClientProps) => {
  const {
    cart,
  } = props;
  const [summary, setSummary] = useState<boolean>(false);

  return <>
    <Typography variant={'h1'} gutterBottom>
      {summary ? 'Podsumowanie' : 'Koszyk'} {cart.uuid}
    </Typography>

    <ListSelectProvider
      initialValue={(cart.items).map(x => x.productId)}
    >
      {summary
        ? <SummaryPage {...props} />
        : <CartPage {...props} goToSummary={() => {
          setSummary(true);
        }}/>
      }
    </ListSelectProvider>
  </>
}
