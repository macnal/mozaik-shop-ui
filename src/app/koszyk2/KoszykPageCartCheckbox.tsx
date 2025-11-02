'use client';
import {useListSelect} from "@/components/common/ListSelect/ListSelectProvider";
import {Checkbox} from "@mui/material";
import {useCart} from "@/context/cartProvider";

export const KoszykPageCartCheckbox = ({id}: { id: number }) => {
  const [isSelected, toggle] = useListSelect();
  const {basket, updateBasetItem} = useCart();

  const handleClick = () => {
    const item = basket?.items?.find((i) => i.productId === id);
    if (item) {
      console.log(isSelected(id), item.checked);
      void updateBasetItem(item, 'TOGGLE');
    }
     toggle(id);
  }

  return <Checkbox
    checked={isSelected(id)}
    onClick={handleClick}
    edge={'start'}
    sx={{mr: 2}}
    name={'selected'}
    value={id}
  />
}
