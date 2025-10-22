import {Container, Divider, Grid, Link, Stack, Typography} from "@mui/material";
import NextLink from 'next/link';
import {grey} from "@mui/material/colors";
import {DataSourceObjectResponse} from "@notionhq/client";
import { NotionService } from "@/services/notion";
// Import package.json to read app version (server component -> safe to import)
import pkg from '../../../package.json';

const colSx = {
  display: "flex",
  flexDirection: "column",
}

export const Footer = async () => {
  const notion = NotionService();
  // const {results} = (await notion.dataSources.query({
  //   data_source_id: "280f44b7-9147-801e-b41a-000b4e64b0e0"
  // })) as { results: DataSourceObjectResponse[] };

  return <Stack component={'footer'} sx={{bgcolor: grey[50], py: 6}}>
    <Container>
      <Grid container spacing={3}>
        <Grid size={{ xs: 6, md: 3}} sx={colSx}>
          <Typography variant={'subtitle1'} sx={{mb: 1}}>Obsługa klienta</Typography>

          <Link component={NextLink} href={'/strony/kontakt'}>Koszty dostawy</Link>
          <Link component={NextLink} href={'/strony/kontakt'}>Kontakt</Link>
          <Link component={NextLink} href={'/strony/kontakt'}>O rejestracji</Link>
          <Link component={NextLink} href={'/strony/kontakt'}>FAQ</Link>
        </Grid>
        <Grid size={{ xs: 6, md: 3}} sx={colSx}>
          <Typography variant={'subtitle1'} sx={{mb: 1}}>Przydatne linki</Typography>

          <Link component={NextLink} href={'/strony/kontakt'}>Koszty dostawy</Link>
          <Link component={NextLink} href={'/strony/kontakt'}>Kontakt</Link>
          <Link component={NextLink} href={'/strony/kontakt'}>O rejestracji</Link>
          <Link component={NextLink} href={'/strony/kontakt'}>FAQ</Link>
        </Grid>
        <Grid size={{ xs: 6, md: 3}} sx={colSx}>
          <Typography variant={'subtitle1'} sx={{mb: 1}}>Obserwuj nas</Typography>

          <Link component={NextLink} href={'/strony/kontakt'}>Koszty dostawy</Link>
          <Link component={NextLink} href={'/strony/kontakt'}>Kontakt</Link>
          <Link component={NextLink} href={'/strony/kontakt'}>O rejestracji</Link>
          <Link component={NextLink} href={'/strony/kontakt'}>FAQ</Link>
        </Grid>
        <Grid size={{ xs: 6, md: 3}} sx={colSx}>

        </Grid>

        <Grid size={{xs: 12}}>
          <Divider/>
        </Grid>
        <Grid size={{xs: 12}}>
          {/* Footer bottom row: version left, policy links right */}
          <Stack direction={'row'} spacing={2} sx={{mb: 3, justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant={'body2'} color="text.secondary">Wersja: {pkg.version}</Typography>

            <Stack direction={'row'} spacing={2}>
              <Link component={NextLink} href={'/strony/polityka-prywatnosci'} fontWeight={600}>Polityka prywatności</Link>
              <Link component={NextLink} href={'/strony/regulamin'} fontWeight={600}>Regulamin</Link>
            </Stack>
          </Stack>


        </Grid>
      </Grid>
    </Container>

  </Stack>
}
