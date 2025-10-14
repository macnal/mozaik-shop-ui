import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import isPostalCode from 'validator/lib/isPostalCode';
import isIBAN from "validator/lib/isIBAN";

export const mobilePhoneValidator = (value: string) => isMobilePhone(value, 'pl-PL')

export const zipCodeValidator = (value: string) => isPostalCode(value, 'PL')

export const ibanValidator = (value: string) => isIBAN(value)


export const nipValidator = (nip: string | number) => {
  if (typeof nip === "number") {
    nip = nip.toString();
  } else {
    nip = nip.replace(/-/g, "");
  }

  if (nip.length !== 10) {
    return false;
  }

  const nipArray: number[] = nip.split("").map(value => parseInt(value));
  const checkSum = (6 * nipArray[0] + 5 * nipArray[1] + 7 * nipArray[2] + 2 * nipArray[3] + 3 * nipArray[4] + 4 * nipArray[5] + 5 * nipArray[6] + 6 * nipArray[7] + 7 * nipArray[8])%11;
  return nipArray[9] == checkSum;
}
