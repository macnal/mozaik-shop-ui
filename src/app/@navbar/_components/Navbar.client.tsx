'use client'
import {AccountCircleTwoTone, ExpandMore} from "@mui/icons-material"
import {Button, CardActionArea, Divider, IconButton, Popover, Stack, Typography, useMediaQuery} from "@mui/material"
import PopupState, {bindHover, bindPopover} from "material-ui-popup-state"
import {signIn, signOut} from "next-auth/react"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import HoverPopover from 'material-ui-popup-state/HoverPopover';
import Link from "next/link";


export const NavbarClient = ({
                               isAuthenticated,
                               name,
                             }: {
  isAuthenticated: boolean,
  name?: string | null | undefined,

}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  if (isAuthenticated) {
    return <PopupState variant="popover" popupId="account-popup">
      {(popupState) => (
        <>
          <CardActionArea {...!isMobile && bindHover(popupState)} sx={{px: 2, py: .5}}>
            <Stack direction={'row'} spacing={2} sx={{alignItems: 'center'}}>
              <Stack>
                <Typography variant={'subtitle2'} fontWeight={600}>
                  Cześć {name}!
                </Typography>

                <Typography variant={'button'}>
                  Twoje konto
                </Typography>
              </Stack>

              <ExpandMore/>
            </Stack>
          </CardActionArea>

          {!isMobile && <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            slotProps={{
              paper: {
                sx: {
                  width: 300
                }
              }
            }}
          >
            <Stack sx={{p: 1}}>
              <Button
                color={'primary'}
                variant={'contained'}
                onClick={() => signOut()}
                endIcon={<ArrowForwardIosIcon/>}
              >
                Wyloguj
              </Button>
            </Stack>
          </Popover>}
        </>
      )}
    </PopupState>

  }

  return <PopupState variant="popover" popupId="anon-account-popup">
    {(popupState) => (
      <>
        <IconButton
          color={'inherit'}
          component={Link}
          href={'/konto'}
          {...!isMobile && bindHover(popupState)}>
          <AccountCircleTwoTone/>
        </IconButton>

        {!isMobile && <HoverPopover
          disableScrollLock
          {...bindPopover(popupState)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          slotProps={{
            paper: {
              sx: {
                width: 300
              }
            }
          }}
        >
          <Stack sx={{px: 2, pt: 2}}>
            <Typography variant={'h6'}>
              Masz już konto
            </Typography>
          </Stack>

          <Stack sx={{p: 2}} spacing={2}>
            <Button color={'primary'} variant={'contained'} onClick={() => signIn()}>
              Zaloguj
            </Button>

            <Divider/>

            <Button color={'inherit'} onClick={() => signIn()}>
              Zarejestruj się
            </Button>
          </Stack>
        </HoverPopover>}
      </>
    )}
  </PopupState>


}
