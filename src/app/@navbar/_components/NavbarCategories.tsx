'use client'
import {Button, Menu, MenuItem, Stack} from "@mui/material"
import NextLink from "next/link";
import {getSlug} from "@/utils/slug";
import PopupState, {bindMenu, bindTrigger} from "material-ui-popup-state";
import {Category} from "@/types/responses";
import MenuIcon from '@mui/icons-material/Menu';

export const NavbarCategories = ({categories}: { categories: Category[] }) => {


  return <Stack direction={'row'} sx={{justifyContent: 'flex-end'}}>
    <PopupState variant="popover" popupId="categories-popup-menu">
      {(popupState) => (
        <>
          <Button {...bindTrigger(popupState)} sx={{display: {md: 'none'}}}
                  color={'inherit'}
                  startIcon={<MenuIcon/>}
          >
            Kategorie
          </Button>
          <Menu {...bindMenu(popupState)} sx={{width: '100%'}}>
            {categories.map(x => <MenuItem
              key={x.id}
              component={NextLink}
              href={`/${getSlug(x)}`}
            >{x.name}</MenuItem>)}
          </Menu>
        </>
      )}
    </PopupState>


  </Stack>
}
