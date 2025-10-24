import type {Metadata, Viewport} from "next";
import {Roboto} from "next/font/google";
import {GoogleAnalytics} from '@next/third-parties/google'
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter';

import {CssBaseline, Stack} from "@mui/material";
import {Footer} from "@/components/global/Footer";
import {ThemeContext} from "@/context/theme";

import {SessionProvider} from "@/context/auth";
import {auth} from "@/auth";
import {AppConfigContextProvider} from "@/context/config";
import ClientGoogleAnalytics from "@/components/global/ClientGoogleAnalytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-6SZZHD30W4';

const roboto = Roboto({
    weight: ['300', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
});

export const metadata: Metadata = {
    title: {default: `Sklep Guildmage`, template: `%s | Sklep Guildmage`},
    description: "Magic: the Gathering, Pokemon, Planszówki",
    icons: {
        icon: '/favicon.svg',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
};


export default async function RootLayout({
                                             children,
                                             navbar,
                                         }: Readonly<{
    children: React.ReactNode;
    navbar: React.ReactNode;
}>) {
    // const res = await fetch(`${process.env.PUBLIC_URL}/config.json`);
    // const config = await res.json();
    const session = await auth();

    return (
        <html lang="pl">
        <body className={`${roboto.variable}`} style={{display: 'flex', flexDirection: 'column', minHeight: "100vh"}}>
        <AppRouterCacheProvider>
            <AppConfigContextProvider>
                <ThemeContext>
                    <SessionProvider session={session}>
                        <CssBaseline/>

                        {navbar}

                        <Stack sx={{flexGrow: 1}}>
                            {children}
                        </Stack>

                        <Footer/>
                    </SessionProvider>
                </ThemeContext>
            </AppConfigContextProvider>
        </AppRouterCacheProvider>
        <GoogleAnalytics gaId={GA_ID}/>
        <ClientGoogleAnalytics/>
        </body>
        </html>
    );
}
