'use client'

import {signIn} from "next-auth/react";
import {useSearchParams} from "next/navigation";
import {useLayoutEffect} from "react";
import {CircularProgress} from "@mui/material";
import {PageContainer} from "@/components/PageContainer";

export default function RedirectToDefaultProviderPage({}) {
  const searchParams = useSearchParams();

  useLayoutEffect(() => {
    void signIn("keycloak", {redirectTo: searchParams.get("callbackUrl")});
  }, [])


  return <PageContainer>
    <CircularProgress/>
  </PageContainer>
}
