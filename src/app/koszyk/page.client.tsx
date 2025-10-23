'use client';
import {Grid, Skeleton, Typography} from "@mui/material";
import {ListSelectProvider} from "@/components/common/ListSelect/ListSelectProvider";
import {useEffect, useState} from "react";
import {JsonSchema, UISchemaElement} from "@jsonforms/core";
import {AppCartResponse} from "@/types/responses";
import {KoszykPageSummary} from "@/app/koszyk/KoszykPageSummary";
import {KoszykPageCart} from "@/app/koszyk/KoszykPageCart";
import ky from "ky";

interface KoszykPageClientProps {
  createOrder: (arg: Record<string, unknown>) => void,
  initialData: Record<string, unknown>,
  formSchema: JsonSchema,
  layoutSchema: UISchemaElement,
}

export const KoszykPageClient = (props: KoszykPageClientProps) => {
  const {} = props;
  const [summary, setSummary] = useState<boolean>(false);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [cartLoading, setCartLoading] = useState<boolean>(true);

  const [discountCodeState, setDiscountCodeState] = useState<"IDLE" | "ERROR" | "LOADING">("IDLE");
  const [hasDiscountCode, setHasDiscountCode] = useState<boolean>(false);

  const [cart, setCart] = useState<AppCartResponse | null>(null);

  const handleFetchCart = async () => {

    try {
      await ky<AppCartResponse>(`/api/cart`, {
        searchParams: {
          discountCode,
        }
      }).json().then(data => {
        setCart(data);
        return data
      });
    } finally {
    }
  }

  useEffect(() => {

    setCartLoading(true);
    void handleFetchCart().finally(() => {
      setCartLoading(false);
    });

  }, []);

  useEffect(() => {
    if (!cart) {
      return
    }

    setDiscountCodeState("LOADING");
    void handleFetchCart().then(() => {
      setHasDiscountCode(!!discountCode);
    }).then(() => {
      setDiscountCodeState("IDLE");
    }).catch(() => {
      setDiscountCodeState("ERROR");
    });
  }, [discountCode]);


  if (!cart && cartLoading) {
    return <>
      <Typography variant={'h1'} gutterBottom>
        Koszyk
      </Typography>

      <Grid container spacing={6}>
        <Grid size={{xs: 12, lg: 8}}>


          <Skeleton variant={'rectangular'} width={"100%"} height={339}/>
        </Grid>

        <Grid size={{xs:12,lg: 4}}>
          <Skeleton variant={'rectangular'} width={"100%"} height={200} sx={{mb:2}}/>
          <Skeleton variant={'rectangular'} width={"100%"} height={500}/>
        </Grid>

      </Grid>



    </>
  }

  if (!cart) {
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
      {summary ? 'Podsumowanie' : 'Koszyk'} {cart.uuid}
    </Typography>

    <ListSelectProvider
      initialValue={(cart.items).map(x => x.productId)}
    >
      {summary
        ? <KoszykPageSummary
          {...props}
          discountCode={discountCode}
          cart={cart}
          goBack={() => {
            setSummary(false);
          }}

        />
        : <KoszykPageCart
          {...props}
          cart={cart}
          discountCodeState={discountCodeState}
          hasDiscountCode={hasDiscountCode}
          goToSummary={() => {
            setSummary(true);
          }}
          onDiscountCodeChange={(nextValue) => {
            setDiscountCode(() => nextValue)
          }}
        />
      }
    </ListSelectProvider>
  </>
}
