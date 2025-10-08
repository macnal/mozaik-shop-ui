import {PageContainer} from "@/components/PageContainer";
import {cookies} from "next/headers";
import {CART_ID_COOKIE_NAME} from "@/components/global/Navbar.types";
import {WebLinkerService} from "@/services/weblinker";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from "@mui/material";
import {ItemCardActions} from "./ItemCardActions";

async function createOrder() {
  'use server';

  const dataSource = WebLinkerService();
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_ID_COOKIE_NAME)?.value || null;
  console.log(cartId);
  let cart;

  if (cartId) {
    cart = await dataSource.fetchCart(cartId)

    if (cart){
      const dataSource = WebLinkerService();
      const nextUrl = await dataSource.createOrder(cart);
      console.log(cart)
      console.log(nextUrl);
      return Response.redirect(nextUrl);
    }
  }

  return Response.redirect('/koszyk')
}

export default async function KoszykPage() {
  const dataSource = WebLinkerService();
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_ID_COOKIE_NAME)?.value || null;
  console.log(cartId);
  let cart;

  if (cartId) {
    cart = await dataSource.fetchCart(cartId)
  }


  return <PageContainer>
    <Typography variant={'h1'} sx={{mb: 6}}>
      Koszyk
    </Typography>

    <Grid container spacing={6}>
      <Grid size={{xs: 12, lg: 8}}>
        {cart?.uuid || 'brak'}

        {cart && <List>
          {cart.items.map(({name, productId, quantity}) => {
            return <ListItem
              key={productId}
              secondaryAction={
                <ItemCardActions {...{productId, quantity}} />
              }
            >
              <ListItemAvatar>
                <Avatar variant={"rounded"}>
                  AD
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                slotProps={{primary: {variant: 'subtitle1'}}}
                secondary={'Tu tez trzeba slug zeby był link do produktu'}
                primary={<>
                  <Typography color={'textSecondary'} component={'span'}>{quantity} x </Typography>
                  {name}
                </>}/>
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

              <ListItem secondaryAction={<Typography variant={'h6'}>
                {cart?.total || ' - '}
              </Typography>}>
                <ListItemText
                  slotProps={{primary: {variant: 'h6'}}}
                  primary={<>
                    Całość
                  </>}/>
              </ListItem>
            </List>

            <Button variant={'contained'} size={'large'} fullWidth onClick={createOrder}>
              Dostawa i płatność
            </Button>

          </CardContent>
        </Card>

      </Grid>


    </Grid>


  </PageContainer>
}
