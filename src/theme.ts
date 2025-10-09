'use client';
import {createTheme} from '@mui/material/styles';
import {ThemeOptions} from "@mui/system";
import {deepmerge} from "@mui/utils";

const themeFactory = (options: Omit<Partial<ThemeOptions>, "shadows">) => createTheme(
  deepmerge({
    components: {
      MuiTextField: {
        defaultProps: {
          fullWidth: true,
        }
      },
      MuiFormControl: {
        defaultProps: {
          fullWidth: true
        },
        styleOverrides: {
          root: ({theme}) => theme.unstable_sx({
            mt: `${23 + 8}px`,

            ".MuiInputLabel-root": {
              transform: "none",
              transition: "none",
              bottom: `calc(100% + ${8}px)`,
              top: "unset"
            },
            ".MuiOutlinedInput-notchedOutline": {
              top: -2.5,
              bottom: -2.5,
              legend: {
                display: "none"
              }
              // backgroundColor: theme.palette.background.paper
            },

            ".MuiFormHelperText-root": {
              mx: 0
            }
          })
        }
      },
      MuiChip: {
        styleOverrides: {
          root: ({theme}) => ({
            fontWeight: 600,
            letterSpacing: '0.042em',
          }),
        }
      }
    }
  }, options)
)

export default themeFactory;
