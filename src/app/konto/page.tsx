'use client'
import { PageContainer } from "@/components/PageContainer"
import {Button, Divider, Stack, Typography} from "@mui/material";
import {signIn} from "next-auth/react";

const KontoPage = () => {

  return <PageContainer>

    <Stack sx={{px: 2, pt: 2}}>
      <Typography variant={'h6'}>
        Masz już konto
      </Typography>
    </Stack>

    <Stack sx={{p: 2}} spacing={2}>
      <Button color={'primary'} variant={'contained'} onClick={() => signIn()}>
        Zaloguj
      </Button>

      <Divider/>

      <Button color={'inherit'} onClick={() => signIn()}>
        Zarejestruj się
      </Button>
    </Stack>

  </PageContainer>
}

export default KontoPage;
