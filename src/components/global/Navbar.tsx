import {Mail, Notifications} from "@mui/icons-material"
import {AppBar, Badge, Box, Button, Container, IconButton, Stack, Toolbar} from "@mui/material"
import NextLink from "next/link";
import {Breadcrumb} from "@/types/client";
import {getSlug} from "@/utils/slug";
import {WebLinkerService} from "@/services/weblinker";
import {NavbarClient} from "./Navbar.client";

export const Navbar = async () => {
  const dataSource = WebLinkerService();
  const {items: categories} = await dataSource.fetchCategories({parentIds: [0]});
  const category = categories[0];

  const breadcrumbs: Breadcrumb[] = [
    {
      href: `/${getSlug(category)}`,
      label: category.name,
    },
    // {
    //   href: `/${getSlug(category)}/${getSlug(item)}`,
    //   label: item.name
    // },
  ];

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
        <Box sx={{display: {xs: 'none', md: 'flex'}}}>
          <IconButton size="large" aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={4} color="error">
              <Mail/>
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
          >
            <Badge badgeContent={17} color="error">
              <Notifications/>
            </Badge>
          </IconButton>

        </Box>
        <Box sx={{display: {xs: 'flex', md: 'none'}}}>
          <NavbarClient/>
        </Box>
      </Container>

      <Stack sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
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
