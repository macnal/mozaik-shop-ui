'use client'

import {PropsWithChildren, useMemo} from "react";
import {ThemeProvider} from "@mui/material/styles";
import themeFactory from "@/theme";
import {AppProgressProvider as ProgressProvider, BProgressOptions} from '@bprogress/next';
import {useAppConfig} from "@/context/config";

const options: Partial<BProgressOptions> = {showSpinner: false}

export const ThemeContext = ({children}: PropsWithChildren) => {
  const {mui} = useAppConfig();
  const theme = useMemo(() => themeFactory(mui), []);

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
