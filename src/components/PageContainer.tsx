import { Breadcrumb } from "@/types/client";
import {Breadcrumbs, Container, Link, SxProps, Typography} from "@mui/material";
import {PropsWithChildren} from "react";

const mergeSx= (sx: SxProps) => Array.isArray(sx) ? sx : [sx];

export const PageContainer = ({children, sx = {}, breadcrumbs = []}: PropsWithChildren<{
  breadcrumbs?: Breadcrumb[];
  sx?: SxProps;
}>) => {


  return <Container sx={[{py: 6}, ...mergeSx(sx)]}>
    {!!breadcrumbs?.length && <Breadcrumbs sx={{ mb: 4 }} aria-label="breadcrumb">
      {breadcrumbs.map(({label, href}, index, arr) => {
        const isLast = (arr.length - 1) === index;
        const key = `${label}-${href}`;

        if (isLast) {
          return <Typography key={key} sx={{color: 'text.primary'}}>
            {label}
          </Typography>
        }

        return <Link
          key={key}
          underline="hover"
          color="inherit"
          href={href}
        >
          {label}
        </Link>
      })}
    </Breadcrumbs>}

    {children}
  </Container>
}
