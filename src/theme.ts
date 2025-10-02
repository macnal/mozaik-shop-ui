'use client';
import {createTheme} from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-roboto)',
    h1: {
      fontSize: '2rem',
      fontWeight: 800
    },
    h3: {
      fontSize: '1.4rem',
      fontWeight: 600
    },
    subtitle1: {
      fontWeight: 600
    }
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: ({theme}) => ({
          fontWeight: 600,
          letterSpacing: '0.042em',
        }),

      }
    }
  }
});

export default theme;
