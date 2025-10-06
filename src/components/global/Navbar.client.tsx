'use client'
import {Button} from "@mui/material"
import {signIn, signOut} from "next-auth/react"

export const NavbarClient = ({isAuthenticated}: { isAuthenticated: boolean }) => {

  if (isAuthenticated) {
    return <Button color={'inherit'} onClick={() => signOut()}>
      Wyloguj
    </Button>
  }

  return <Button color={'inherit'} onClick={() => signIn()}>
    Zaloguj
  </Button>
}
