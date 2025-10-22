'use client'

import {SessionProvider as NextAuthSessionProvider} from "next-auth/react";
import {PropsWithChildren, useEffect} from "react";
import {signIn, signOut} from "next-auth/react"
import {Session} from "next-auth";

const LogoutOnError = () => {

  // if (session?.error === "RefreshTokenError" ||) {
  //
  //   console.log('MEGA ERROR REFERESH')
  // }
}

export const SessionProvider = ({session, children}: PropsWithChildren<{ session: Session | null }>) => {

  useEffect(() => {
    if (session?.error === "RefreshTokenError" || session?.error === "NoRefreshTokenError") {
      signOut();
      console.log('MEGA ERROR REFERESH')
    }
  }, [session?.error])

  return <NextAuthSessionProvider session={session}>
    {children}
  </NextAuthSessionProvider>
}
