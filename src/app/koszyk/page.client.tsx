'use client';


import {
  Avatar,
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
  Typography
} from "@mui/material";
import {ListSelectProvider, useListSelect} from "@/components/common/ListSelect/ListSelectProvider";
import {ItemCardActions} from "@/app/koszyk/ItemCardActions";
import {KoszykPageCheckbox} from "@/app/koszyk/KoszykPageCheckbox";
import {ApiCartResponse} from "@/types/responses";
import {useState} from "react";
import {JsonSchema, UISchemaElement} from "@jsonforms/core";
import {materialCells, materialRenderers} from "@jsonforms/material-renderers";
import {JsonForms} from "@jsonforms/react";
import {useRouter} from "next/navigation";

interface KoszykPageClientProps {
  cart: ApiCartResponse,
  createOrder: (arg: Record<string, unknown>) => void,
  initialData: Record<string, unknown>,
  formSchema: JsonSchema,
  layoutSchema: UISchemaElement,
}

const TotalStr = ({cart}: { cart: ApiCartResponse }) => {
  const [isChecked] = useListSelect();

  const amount = cart.items
    .filter(x => isChecked(x.productId))
    .reduce((acc, item) => {
      acc += (item.quantity * item.price);

      return acc
    }, 0);

  return amount.toFixed(2);
}

const SummaryPage = ({
                       cart,
                       createOrder,
                       initialData,
                       formSchema,
                       layoutSchema,
                     }: KoszykPageClientProps) => {
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData);
  const [hasErrors, setHasErrors] = useState(true);
  const [isChecked] = useListSelect();

  const selectedItems = cart.items
    .filter(x => isChecked(x.productId));

  return <Grid container spacing={6}>
    <Grid size={{xs: 12, lg: 8}}>
      <JsonForms
        schema={formSchema}
        uischema={layoutSchema}
        data={formData}
        renderers={materialRenderers}
        cells={materialCells}
        validationMode={'ValidateAndShow'}

        onChange={({data, errors}) => {
          setFormData(data);

          console.log(data, errors);
          setHasErrors(() => !!errors?.length)
        }}
      />

      <Card>
        <CardHeader title={'Przedmioty'}/>

        <CardContent>
          <List disablePadding dense>
            {selectedItems.map(({name, productId, quantity, price}) => {
              return <ListItem
                key={productId}
                disableGutters
              >
                <ListItemAvatar>
                  <Avatar variant={"rounded"}>
                    AD
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  slotProps={{primary: {variant: 'subtitle1'}}}
                  primary={`${quantity} x ${name}`}
                  secondary={'Tu tez trzeba slug zeby był link do produktu'}
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
              {cart?.total || ' - '}
            </Typography>}>
              <ListItemText
                slotProps={{primary: {variant: 'subtitle1'}}}
                primary={<>
                  Wartość produktów
                </>}/>
            </ListItem>

            <ListItem secondaryAction={<Typography variant={'body1'}>
              12 zł
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

          <Button
            variant={'contained'}
            size={'large'}
            fullWidth
            onClick={() => createOrder({
              items: selectedItems,
              ...formData,
            })}
            disabled={hasErrors}
          >
            Płacę
          </Button>

        </CardContent>
      </Card>
    </Grid>
  </Grid>

}

export const CartPage = ({
                           cart,
                           goToSummary
                         }: KoszykPageClientProps & {
  goToSummary: () => void;
}) => {
  const router = useRouter();

  return <Grid container spacing={6}>
    <Grid size={{xs: 12, lg: 8}}>
      {cart?.uuid || 'brak'}

      {cart && <List>
        {cart.items.map(({name, productId, quantity, price}) => {
          return <ListItem
            key={productId}
            disableGutters
            secondaryAction={
              <ItemCardActions {...{productId, quantity, price}} />
            }
          >
            <KoszykPageCheckbox id={productId}/>

            <ListItemAvatar>
              <Avatar variant={"rounded"}>
                AD
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              slotProps={{primary: {variant: 'subtitle1'}}}
              primary={name}
              secondary={'Tu tez trzeba slug zeby był link do produktu'}
            />
          </ListItem>
        })}
      </List>

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
              {cart?.total || ' - '}
            </Typography>}>
              <ListItemText
                slotProps={{primary: {variant: 'subtitle1'}}}
                primary={<>
                  Wartość produktów
                </>}/>
            </ListItem>

            <ListItem secondaryAction={<Typography variant={'body1'}>
              12 zł
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
  const router = useRouter();

  return <>
    <Typography variant={'h1'} sx={{mb: 6}}>
      {summary ? 'Podsumowanie' : 'Koszyk'}
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
