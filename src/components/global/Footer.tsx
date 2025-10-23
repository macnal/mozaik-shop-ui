import {Container, Divider, Grid, Link, Stack, Typography} from "@mui/material";
import NextLink from 'next/link';
import {grey} from "@mui/material/colors";
import {NotionService} from "@/services/notion";
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
                <Grid size={{xs: 6, md: 3}} sx={colSx}>
                    <Typography variant={'subtitle1'} sx={{mb: 1}}>Obsługa klienta</Typography>
                    <Link component={NextLink} href={'/strony/regulamin'} fontWeight={600}>Regulamin</Link>
                    <Link component={NextLink} href={'/strony/polityka-prywatnosci'} fontWeight={600}>Polityka prywatności</Link>
                    <Link component={NextLink} href={'/strony/kontakt'} fontWeight={600}>Kontakt</Link>
                    <Link component={NextLink} href={'/strony/zwroty'} fontWeight={600}>Zwroty</Link>
                    <Link component={NextLink} href={'/strony/dostawa'} fontWeight={600}>Dostawa</Link>
                </Grid>
                <Grid size={{xs: 6, md: 3}} sx={colSx}>
                    <Typography variant={'subtitle1'} sx={{mb: 1}}>Guildmage</Typography>
                    <Link component={NextLink} href={'/strony/guildmage'}>O nas</Link>
                    <Link component={NextLink} href={'/strony/sklep'}>Sklep stacjonarny</Link>
                    <Link component={NextLink} href={'/strony/kawiarnia'}>Kawiarnia</Link>
                </Grid>
                <Grid size={{xs: 6, md: 3}} sx={colSx}>
                    <Typography variant={'subtitle1'} sx={{mb: 1}}>Przydatne linki</Typography>
{/*
                    <Link component={NextLink} href={'/strony/faq'}>FAQ</Link>
*/}
                    <Link component={NextLink} href={'/strony/turnieje'}>Kalendarz turniejów</Link>
                    <Link component={NextLink} href={'https://www.cardmarket.com/en/Magic/Users/guildmage-pl'}>Single na Cardmarket</Link>
                </Grid>
                <Grid size={{xs: 6, md: 3}} sx={colSx}>
                    <Typography variant={'subtitle1'} sx={{mb: 1}}>Obserwuj nas</Typography>
                    <Link component={NextLink} href={'https://www.instagram.com/guildmage_pl/'}>Instagram</Link>
                    <Link component={NextLink} href={'https://www.facebook.com/guildmage.mtg'}>Facebook</Link>
                    <Link component={NextLink} href={'https://www.youtube.com/@guildmage'}>Kanał Youtube</Link>
                    <Link component={NextLink} href={'https://x.com/guildmage_pl'}>Twitter / X</Link>
                    <Link component={NextLink} href={'https://www.tiktok.com/@guildmage.pl'}>Tiktok</Link>
{/*
                    <Link component={NextLink} href={'https://www.twitch.tv/GuildmageMTG'}>Twitch</Link>
*/}
                    <Link component={NextLink} href={'https://discord.com/invite/VKCcqSG'}>Dołącz do Discord</Link>
                </Grid>
                <Grid size={{xs: 6, md: 3}} sx={colSx}>

                </Grid>

                <Grid size={{xs: 12}}>
                    <Divider/>
                </Grid>
                <Grid size={{xs: 12}}>
                    {/* Footer bottom row: version left, policy links right */}
                    <Stack direction={'row'} spacing={2}
                           sx={{mb: 3, justifyContent: 'space-between', alignItems: 'center'}}>
                        <Typography variant={'body2'} color="text.secondary">Wersja: {pkg.version}</Typography>

                        <Stack direction={'row'} spacing={2}>
                            <Link component={NextLink} href={'/strony/polityka-prywatnosci'} fontWeight={600}>Polityka
                                prywatności</Link>
                            <Link component={NextLink} href={'/strony/regulamin'} fontWeight={600}>Regulamin</Link>
                        </Stack>
                    </Stack>


                </Grid>
            </Grid>
        </Container>

    </Stack>
}
