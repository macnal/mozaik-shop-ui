'use client'
import {AccountCircleTwoTone, ExpandMore} from "@mui/icons-material"
import {Button, CardActionArea, Divider, IconButton, Popover, Stack, Typography} from "@mui/material"
import PopupState, {bindPopover, bindTrigger} from "material-ui-popup-state"
import {signIn, signOut} from "next-auth/react"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const NavbarClient = ({
                               isAuthenticated,
                               name
                             }: {
  isAuthenticated: boolean,
  name?: string | null | undefined,

}) => {

  if (isAuthenticated) {
    return <PopupState variant="popover" popupId="account-popup">
      {(popupState) => (
        <div>

          <CardActionArea {...bindTrigger(popupState)} sx={{px: 2, py: .5}}>
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

          <Popover
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


          </Popover>
        </div>
      )}
    </PopupState>

  }

  return <PopupState variant="popover" popupId="anon-account-popup">
    {(popupState) => (
      <div>
        <IconButton color={'inherit'} {...bindTrigger(popupState)}>
          <AccountCircleTwoTone/>
        </IconButton>

        <Popover
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
        </Popover>
      </div>
    )}
  </PopupState>


}
