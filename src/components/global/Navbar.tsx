import {AppBar, Box, Button, Container, IconButton, Stack, Toolbar} from "@mui/material"
import NextLink from "next/link";
import {Breadcrumb} from "@/types/client";
import {getSlug} from "@/utils/slug";
import {WebLinkerService} from "@/services/weblinker";
import {NavbarClient} from "./Navbar.client";
import {getServerSession} from "next-auth/next";
import {authConfig} from "@/auth.config";
import {NavbarCartButton} from './NavbarCartButton';
import {NavbarSearch} from "./NavbarSearch";

export const Navbar = async () => {
  const session = await getServerSession(authConfig);
  const dataSource = WebLinkerService();
  const {items: categories} = await dataSource.fetchCategories({parentId: 0});
  // const category = categories[0];
  //
  // const breadcrumbs: Breadcrumb[] = [
  //   {
  //     href: `/${getSlug(category)}`,
  //     label: category.name,
  //   },
  //   // {
  //   //   href: `/${getSlug(category)}/${getSlug(item)}`,
  //   //   label: item.name
  //   // },
  // ];

  return <AppBar position="static">
    <Container component={Toolbar}>
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

      <Box sx={{flexGrow: 1}}/>

      <NavbarSearch/>

      <Box sx={{flexGrow: 1}}/>

      <Stack direction={'row'} spacing={1} sx={{display: {xs: 'none', md: 'flex'}, alignItems: 'center'}}>
        <NavbarCartButton/>

        <NavbarClient isAuthenticated={!!session} name={session?.user?.name}/>
      </Stack>

      <Box sx={{display: {xs: 'flex', md: 'none'}}}>
        <NavbarClient isAuthenticated={!!session} name={session?.user?.name}/>
      </Box>
    </Container>

    <Stack sx={{bgcolor: 'primary.light', color: 'primary.contrastText'}}>
      <Container>
        <Stack direction={"row"} spacing={2}>
          {categories.map(x => <Button
            component={NextLink}
            key={x.id}
            href={`/${getSlug(x)}`}
            color={'inherit'}
          >{x.name}</Button>)}
        </Stack>
      </Container>
    </Stack>
  </AppBar>
}
