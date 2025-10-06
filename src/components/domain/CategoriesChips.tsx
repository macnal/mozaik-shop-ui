'use client'
import {Chip, Stack, SxProps} from "@mui/material"
import {Category} from "@/types/responses";

export const CategoriesChips = ({items, sx}: { items: Category[], sx?: SxProps }) => {


  return <Stack spacing={1.5} direction={'row'} sx={sx}>
    {items.map(x => <Chip key={x.id} label={x.name}/>)}
  </Stack>
}
