'use client'
import {Button, Grid, Link, Stack, Typography, useMediaQuery} from "@mui/material";
import PopupState, {bindHover, bindPopover} from "material-ui-popup-state";
import {Category} from "@/types/responses";
import NextLink from "next/link";
import HoverPopover from 'material-ui-popup-state/HoverPopover'
import {getSlug} from '@/utils/slug';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const createChunks = <T = unknown>(arr: T[], chunkSize = 10) =>
  Array.from({length: Math.ceil(arr.length / chunkSize)}, (_, i) =>
    arr.slice(i * chunkSize, i * chunkSize + chunkSize)
  );

export const NavbarCategorySubmenuClient = ({parent, categories}: { parent: Category, categories: Category[] }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const chunks = createChunks(categories, 6);

  return <PopupState variant="popover" popupId={`${parent.id}-submenu-popup`}>
    {(popupState) => (
      <>
        <Button
          component={NextLink}
          href={`/${getSlug(parent)}`}
          color={'inherit'}
          endIcon={<ArrowDropDownIcon sx={{color: 'red', fontSize: 20}} />}
          {...!isMobile && bindHover(popupState)}
        >{parent.name}</Button>

        {!isMobile && <HoverPopover
          disableScrollLock
          {...bindPopover(popupState)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          slotProps={{
            paper: {
              sx: {
                width: 400
              }
            }
          }}
        >
          <Stack sx={{p: 2}}>
            <Typography variant={'h6'} gutterBottom>
              {parent.name}
            </Typography>

            <Grid container>
              {
                chunks.map((items, index) => {
                  const chunkKey = items[0]?.id ?? `chunk-${index}`;


                  return <Grid key={chunkKey} size={{xs: 12, sm: 6}}
                               sx={{display: 'flex', flexDirection: 'column', gap: '4px'}}

                  >
                    {
                      items.map(y => <Link
                        key={y.id}
                        component={NextLink}
                        href={`/${getSlug(parent)}`}
                        color={'inherit'}
                        sx={{whiteSpace: 'nowrap'}}
                      >
                        <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
                          {y.name}
                          <ArrowDropDownIcon sx={{color: 'red', fontSize: 16}} />
                        </span>
                      </Link>)
                    }
                  </Grid>
                })
              }
            </Grid>

          </Stack>


        </HoverPopover>}
      </>
    )}
  </PopupState>
}
