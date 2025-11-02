import RedirectToDefaultProviderPage from "./page.client";
import {redirect} from "next/navigation";
import {auth} from "@/auth";

interface PageProps {
  searchParams: Promise<{ callbackUrl?: string }>
}

export default async function Page({searchParams}: PageProps) {
  const {callbackUrl} = (await searchParams);
  const session = await auth()

  if (session) {
    return redirect(callbackUrl || '/auth')
  }

  return <RedirectToDefaultProviderPage/>
}
