import {AppBar, Button, Container, Grid, IconButton, Stack, Toolbar} from "@mui/material"
import NextLink from "next/link";
import {getSlug} from "@/utils/slug";
import {WebLinkerService} from "@/services/weblinker";
import {NavbarClient} from "@/app/@navbar/_components/Navbar.client";
import {NavbarCartButton} from '@/app/@navbar/_components/NavbarCartButton';
import {NavbarSearch} from "@/app/@navbar/_components/NavbarSearch";
import {auth} from "@/auth";
import {NavbarCategorySubmenu} from "@/app/@navbar/_components/NavbarCategorySubmenu";

const Navbar = async () => {
  const session = await auth();
  // const dataSource = await WebLinkerService();
  // const {items: categories} = await dataSource.fetchCategories({parentId: 0});

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

  return <AppBar position="static" sx={{overflow: 'hidden'}}>
    <Container component={Toolbar}>
      <Grid container sx={{width: '100%'}}>
        <Grid size={{xs: 'auto',}} sx={{order: 0}}>
          <IconButton
            component={NextLink}
            href={`/`}
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{mr: 2}}
          >
            Logo
          </IconButton>
        </Grid>

        <Grid size={{xs: 'grow',}} sx={{order: 3}}></Grid>

        <Grid size={{xs: 'grow',}} sx={{order: 5}}></Grid>


        <Grid size={{xs: 'auto',}} sx={{order: 6, display: 'flex', alignItems: 'center', gap: 1,}}>
          <NavbarCartButton/>

          <NavbarClient
            isAuthenticated={!!session}
            name={session?.user?.name}
          />
        </Grid>

        <Grid size={{xs: 12, md: 4}} sx={{display: 'flex', alignItems: 'center', order: {xs: 8, md: 4}}}>
          <NavbarSearch sx={{width: "100%", order: 1}}/>
        </Grid>

        <Grid size={{xs: 'auto', md: 12}} sx={{order: 8, mt: {xs: 1, md: 0}}}>
          <Stack sx={{
            position: 'relative',
            bgcolor: 'primary.light',
            color: 'primary.contrastText',

            '&::after': {
              content: "''",
              bgcolor: 'primary.light',
              position: 'absolute',
              top: 0,
              right: '100%',
              width: '9999px',
              height: '100%'
            },
            '&::before': {
              content: "''",
              bgcolor: 'primary.light',
              position: 'absolute',
              top: 0,
              left: '100%',
              width: '9999px',
              height: '100%'
            },

          }}>
            <Stack direction={"row"} spacing={2}>


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
