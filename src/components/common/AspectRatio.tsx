import {Box} from "@mui/material";
import {PropsWithChildren} from "react";


export const AspectRatio = ({
                              children,
                              aspectRatio: propAspectRatio = '1/1',
                            }: PropsWithChildren<{
  aspectRatio?: '1/1' | '16/9';
}>) => {

  const aspectRatio = propAspectRatio;

  return <Box sx={{position: 'relative', display: 'flex', flexDirection: 'column', aspectRatio}}>
    {children}
  </Box>
}
