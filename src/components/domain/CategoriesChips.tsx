'use client'
import {Chip, Stack, SxProps} from "@mui/material"
import {WeblinkerCategory} from "@/api/gen/model";

export const CategoriesChips = ({items, sx}: { items: WeblinkerCategory[], sx?: SxProps }) => {


  return <Stack spacing={1.5} direction={'row'} sx={sx}>
    {items.map(x => <Chip key={x.id} label={x.name}/>)}
  </Stack>
}
