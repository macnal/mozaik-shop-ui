'use client'

import {PropsWithChildren, useMemo} from "react";
import {ThemeProvider} from "@mui/material/styles";
import themeFactory from "@/theme";
import {ThemeOptions} from "@mui/system";

export const ThemeContext = ({ui, children}: PropsWithChildren<{ ui: Partial<ThemeOptions> }>) => {
  const theme = useMemo(() => themeFactory(ui), []);

  return <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
}
