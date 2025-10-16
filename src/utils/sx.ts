import {SxProps} from "@mui/material";

export const mergeSx = (sx?: SxProps) => Array.isArray(sx) ? sx : [sx];
