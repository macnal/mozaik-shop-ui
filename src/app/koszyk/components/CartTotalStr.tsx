import {AppCartResponse} from "@/types/responses";
import {useListSelect} from "@/components/common/ListSelect/ListSelectProvider";

export const CartTotalStr = ({cart, withShippingFees}: {
  cart: AppCartResponse,
  withShippingFees?: boolean
}) => {
  const [isChecked] = useListSelect();

  let amount = cart.items
    .filter(x => isChecked(x.productId))
    .reduce((acc, item) => {
      acc += (item.quantity * item.price);

      return acc
    }, 0);

  if (withShippingFees) {
    amount += cart.shippingFees;
  }

  return `${amount.toFixed(2)} zł`;
}
