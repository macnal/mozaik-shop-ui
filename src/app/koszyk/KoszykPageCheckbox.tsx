'use client';
import {useListSelect} from "@/components/common/ListSelect/ListSelectProvider";
import {Checkbox} from "@mui/material";

export const KoszykPageCheckbox = ({id}: { id: number }) => {
  const [isSelected, toggle] = useListSelect();

  return <Checkbox
    checked={isSelected(id)}
    onClick={() => toggle(id)}
    edge={'start'}
    sx={{mr: 2}}
    name={'selected'}
    value={id}
  />
}
