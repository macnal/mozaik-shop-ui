'use client'

import {PropsWithChildren, useMemo} from "react";
import {ThemeProvider} from "@mui/material/styles";
import themeFactory from "@/theme";
import {ThemeOptions} from "@mui/system";
import {AppProgressProvider as ProgressProvider, BProgressOptions} from '@bprogress/next';

const options: Partial<BProgressOptions> = {showSpinner: false}

export const ThemeContext = ({ui, children}: PropsWithChildren<{ ui: Partial<ThemeOptions> }>) => {
  const theme = useMemo(() => themeFactory(ui), []);

  return <ThemeProvider theme={theme}>
    <ProgressProvider
      height="4px"
      color={theme.palette.secondary.main}
      options={options}
      delay={50}
      //shallowRouting
    >
      {children}
    </ProgressProvider>
  </ThemeProvider>
}
