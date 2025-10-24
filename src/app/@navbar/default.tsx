import {AppBar, Container, Grid, IconButton, Stack, Toolbar, Box} from "@mui/material"
import NextLink from "next/link";
import Image from 'next/image';
import {NavbarClient} from "@/app/@navbar/_components/Navbar.client";
import {NavbarCartButton} from '@/app/@navbar/_components/NavbarCartButton';
import {NavbarSearch} from "@/app/@navbar/_components/NavbarSearch";
import {auth} from "@/auth";
import {NavbarCategories} from "@/app/@navbar/_components/NavbarCategories";
import {NavbarCategorySubmenu} from "@/app/@navbar/_components/NavbarCategorySubmenu";
import TestBadge from './_components/TestBadge';

const Navbar = async () => {
    const session = await auth();


    const categories = [
        {id: 5052434, name: 'Magic: the Gathering', parent: 0, slug: 'magic-the-gathering'},
        {id: 5126624, name: 'Pokémon', parent: 0, slug: 'pokemon'},
        {id: 5126616, name: 'One Piece', parent: 0, slug: 'one-piece'},
        {id: 5126625, name: 'Star Wars: Unlimited', parent: 0, slug: 'star-wars-unlimited'},
        {id: 5126626, name: 'Flesh and Blood', parent: 0, slug: 'flesh-and-blood'},
        {id: 5126628, name: 'Yu-Gi-Oh!', parent: 0, slug: 'yu-gi-oh'},
        {id: 5126629, name: 'Disney Lorcana', parent: 0, slug: 'disney-lorcana'},
        {id: 5063564, name: 'Gry planszowe', parent: 0, slug: 'gry-planszowe'},
        {id: 5052433, name: 'Inne gry', parent: 0, slug: 'inne-gry'},
        {id: 5126627, name: 'Akcesoria', parent: 0, slug: 'akcesoria'},
    ]

    return <AppBar position="static" elevation={0} sx={{overflow: 'hidden', bgcolor: 'white', color: 'text.primary', boxShadow: 'none'}}>
        {/* Test badge */}
        <TestBadge />

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
                    <NavbarClient
                        isAuthenticated={!!session}
                        name={session?.user?.name}
                    />
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
                            {categories.map(x => <NavbarCategorySubmenu
                                key={x.id}
                                parent={x}
                            />)}
                        </Stack>

                    </Stack>
                </Grid>
            </Grid>
        </Container>


    </AppBar>
}

export default Navbar;
