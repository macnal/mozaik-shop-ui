'use client';

import {usePathname} from "next/navigation";
import {PropsWithChildren} from "react";

const focusPathnameUrls = [
  `/koszyk/podsumowanie`
]

export const CartSummaryFocus = ({children}: PropsWithChildren) => {
  const pathname = usePathname();
  const isActive = focusPathnameUrls.some(x => pathname === x);

  return isActive ? null : children;
}
