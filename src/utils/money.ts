import {pipe} from "pipe-ts";

const defaultTransform = (value: string | number) => {
  if (!value || typeof value === 'number') {
    return value as number;
  } else if (typeof value === 'string' && !isNaN(value as unknown as number)) {
    return +value as number;
  } else {
    return value as unknown as number;
  }
};

const formatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const transformFn = (value: number) => {
  return formatter.format(value);
};

export const formatMoney = (value: string | number) =>
  pipe(defaultTransform, transformFn)(value);
