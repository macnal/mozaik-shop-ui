import {getServerSession} from "next-auth/next"
import RedirectToDefaultProviderPage from "./page.client";
import {authConfig} from "@/auth.config";
import {redirect} from "next/navigation";

interface PageProps {
  searchParams: Promise<{ callbackUrl?: string }>
}

export default async function Page({searchParams}: PageProps) {
  const {callbackUrl} = (await searchParams);
  const session = await getServerSession(authConfig);

  if (session) {
    return redirect(callbackUrl || '/auth')
  }

  return <RedirectToDefaultProviderPage/>
}
