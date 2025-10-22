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
import {KoszykPageCartItemAmountButtons} from "@/app/koszyk/KoszykPageCartItemAmountButtons";
import {KoszykPageCartCheckbox} from "@/app/koszyk/KoszykPageCartCheckbox";
import {JSX, useEffect, useRef, useState} from "react";
import {JsonSchema, UISchemaElement} from "@jsonforms/core";
import {CheckboxElement, FormContainer, TextFieldElement, useFormContext} from 'react-hook-form-mui'
import {zodResolver} from '@hookform/resolvers/zod';
import {CustomerDataZodSchema} from "@/app/koszyk/_schema";
import Link from "next/link";
import {AppCartResponse} from "@/types/responses";
import {ImageTwoTone} from "@mui/icons-material";
import KoszykPageSummaryShippingInpost from "@/app/koszyk/KoszykPageSummaryShippingInpost";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import {KoszykPageCartItemDelete} from "@/app/koszyk/KoszykPageCartItemDelete";
import {KoszykPageSummary} from "@/app/koszyk/KoszykPageSummary";
import { CartTotalStr } from "./components/CartTotalStr";
import {KoszykPageCart} from "@/app/koszyk/KoszykPageCart";

interface KoszykPageClientProps {
  cart: AppCartResponse;
  createOrder: (arg: Record<string, unknown>) => void,
  initialData: Record<string, unknown>,
  formSchema: JsonSchema,
  layoutSchema: UISchemaElement,
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
        ? <KoszykPageSummary {...props} goBack={() => {
          setSummary(false);
        }}/>
        : <KoszykPageCart {...props} goToSummary={() => {
          setSummary(true);
        }}/>
      }
    </ListSelectProvider>
  </>
}
