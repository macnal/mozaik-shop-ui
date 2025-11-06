import {AppBar, Box, Container, Grid, IconButton, Stack, Toolbar} from "@mui/material"
import NextLink from "next/link";
import Image from 'next/image';
import {NavbarClient} from "@/app/@navbar/_components/Navbar.client";
import {NavbarCartButton} from '@/app/@navbar/_components/NavbarCartButton';
import {NavbarSearch} from "@/app/@navbar/_components/NavbarSearch";
import {auth} from "@/auth";
import {NavbarCategories} from "@/app/@navbar/_components/NavbarCategories";
import TestBadge from './_components/TestBadge';
import {categories} from "@/data/categories";
import {NavbarCategorySubmenu} from "@/app/@navbar/_components/NavbarCategorySubmenu";

const Navbar = async () => {
    let session: unknown;
    let authError = false;

    try {
        session = await auth();
    } catch (e) {
        // If auth call fails (fetch/backend down), don't throw — render navbar with no session and notify client
        console.error('Auth fetch failed in navbar:', e);
        session = null;
        authError = true;
    }

    const userName = (session as { user?: { name?: string } })?.user?.name;

    return <AppBar position="static" elevation={0}
                   sx={{overflow: 'hidden', bgcolor: 'white', color: 'text.primary', boxShadow: 'none'}}>
        {/* Test badge */}
        <TestBadge/>

        <Container component={Toolbar} maxWidth={false} disableGutters>
            <Grid container sx={{width: '100%'}}>
                <Grid size={{xs: 'auto',}} sx={{
                    order: 0
                }}>
                    <IconButton
                        component={NextLink}
                        href={`/`}
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{mr: 2, bgcolor: 'white', py: {xs: 1, md: 2}}}
                    >
                        {/* Desktop logo */}
                        <Box sx={{display: {xs: 'none', md: 'block'}}}>
                            <Image
                                src="/Guildmage-logo-black-color.svg"
                                alt="Guildmage"
                                width={120}
                                height={32}
                                priority
                                style={{display: 'block'}}
                            />
                        </Box>

                        {/* Mobile logo */}
                        <Box sx={{display: {xs: 'block', md: 'none'}}}>
                            <Image
                                src="/logo_mobile.svg"
                                alt="Guildmage"
                                width={40}
                                height={32}
                                priority
                                style={{display: 'block'}}
                            />
                        </Box>

                    </IconButton>
                </Grid>

                <Grid size={{xs: 'auto',}} sx={{order: 6, display: 'flex', alignItems: 'center', gap: 1,}}>
                    <NavbarCartButton/>
                    {/*<NavbarClient*/}
                    {/*    isAuthenticated={!!session}*/}
                    {/*    name={userName}*/}
                    {/*    authError={authError}*/}
                    {/*/>*/}
                </Grid>

                <Grid sx={{
                    display: 'flex',
                    alignItems: 'center',
                    order: {xs: 8, md: 4},
                    flex: '1 1 0%',
                    minWidth: 0,
                    px: {xs: 0, md: 2}
                }}>
                    <NavbarSearch sx={{flex: 1, minWidth: 0, width: '100%'}}/>
                </Grid>

                <Grid size={{xs: 12, md: 12}} sx={{order: 8, mt: {xs: 1, md: 0}}}>
                    <Stack sx={{
                        position: 'relative',
                        bgcolor: '#F2F2F2',
                        color: 'text.primary',

                        // Ensure menu text is not forced to uppercase by MUI defaults
                        // Apply to the Stack container and common inner elements
                        '&, & *': {
                            textTransform: 'none',
                        },
                        '& a': {
                            textTransform: 'none',
                        },
                        '& .MuiButton-root': {
                            textTransform: 'none',
                        },
                        '& .MuiTypography-root': {
                            textTransform: 'none',
                        },

                        '&::after': {
                            content: "''",
                            bgcolor: '#F2F2F2',
                            position: 'absolute',
                            top: 0,
                            right: '100%',
                            width: '9999px',
                            height: '100%'
                        },
                        '&::before': {
                            content: "''",
                            bgcolor: '#F2F2F2',
                            position: 'absolute',
                            top: 0,
                            left: '100%',
                            width: '9999px',
                            height: '100%'
                        },

                    }}>
                        <NavbarCategories categories={categories}/>

                        <Stack direction={'row'} spacing={2} sx={{display: {xs: 'none', md: 'flex'}}}>
                            {categories.map(x => <NavbarCategorySubmenu key={x.id} parent={x}/>)}
                        </Stack>

                    </Stack>
                </Grid>
            </Grid>
        </Container>


    </AppBar>
}

export default Navbar;
