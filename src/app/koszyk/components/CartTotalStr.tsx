import {AppCartResponse} from "@/types/responses";
import {useListSelect} from "@/components/common/ListSelect/ListSelectProvider";
import {WeblinkerCart} from "@/api/gen/model";

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

export const CartTotalStr2 = ({cart}: {
    cart: WeblinkerCart,
    withShippingFees?: boolean
}) => {
    const [isChecked] = useListSelect();

    const amount = !!cart?.items ? cart.items
        .filter(x => isChecked(x.productId))
        .reduce((acc, item) => {
            acc += (item.quantity * item.price);

            return acc
        }, 0) : 0;

    return `${amount.toFixed(2)} zł`;
}
``
