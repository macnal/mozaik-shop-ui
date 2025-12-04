import z from "zod";
import {mobilePhoneValidator, nipValidator, zipCodeValidator} from "@/utils/validators";

const invoiceSchema = z.object({
  companyName: z.string().trim().min(1, {error: 'Pole wymagane'}),
  nip: z.string().trim().min(1, {error: 'Pole wymagane'}).refine(nipValidator),

  street: z.string().trim(),
  city: z.string().trim().min(1, {error: 'Pole wymagane'}),
  zip: z.string().trim().min(1, {error: 'Pole wymagane'}).refine(zipCodeValidator, {error: 'Podaj poprawny kod w formacie xx-xxx'}),

  homeNumber: z.string().trim().min(1, {error: 'Pole wymagane'}),
  flatNumber: z.string().trim(),
  country: z.string().trim(),
  state: z.string().trim(),
  info: z.string().trim(),
});

const addressSchema = z.object(({
  street: z.string().trim(),
  city: z.string().trim().min(1, {error: 'Pole wymagane'}),
  zip: z.string().trim().min(1, {error: 'Pole wymagane'}).refine(zipCodeValidator, {error: 'Podaj poprawny kod w formacie xx-xxx'}),
  homeNumber: z.string().trim().min(1, {error: 'Pole wymagane'}),
  flatNumber: z.string().trim(),
  country: z.string().trim(),
  state: z.string().trim(),
  info: z.string().trim(),
}))

export const CustomerDataZodSchema = z.object({
  wantInvoice: z.coerce.boolean().default(false),
  acceptedTerms: z.boolean().refine(v => v === true, {message: 'Musisz zaakceptować regulamin'}).default(false),
  person: z.object({
    name: z.string().trim().min(1, {error: 'Pole wymagane'}),
    phone: z.string().trim().min(1, {error: 'Pole wymagane'}).refine(mobilePhoneValidator, {error: 'Podaj poprawny numer'}),
    email: z.email({error: 'Podaj poprawny adres e-mail'}).trim().min(1, {error: 'Pole wymagane'}),
  }),
  address: z.object().loose(),
  invoice: z.object().loose(),
    deliveryMethod: z.union([
    z.literal('INPOST'),
    z.literal('INPOST_TO_HOME'),
    z.literal('PERSONAL_PICKUP'),
  ]),
  deliveryPointId: z.string(),


}).superRefine((val, ctx) => {
  if (val.deliveryMethod === 'INPOST') {
    const inpostResult = z.string()
      .min(6, {error: `Musisz wybrać paczkomat`})
      .safeParse(val.deliveryPointId);

    if (!inpostResult.success) {
      for (const issue of inpostResult.error.issues) {
        ctx.addIssue({
          ...issue,
          path: ['inpostMachineCode', ...(issue.path || [])],
        })
      }
    }
  } else if (val.deliveryMethod === 'INPOST_TO_HOME') {
    const addressResult = addressSchema.safeParse(val.address || {});

    if (!addressResult.success) {
      for (const issue of addressResult.error.issues) {
        ctx.addIssue({
          ...issue,
          path: ['address', ...(issue.path || [])],
        })
      }
    }
  }

  if (val.wantInvoice) {
    const invoiceResult = invoiceSchema.safeParse(val.invoice || {});

    if (!invoiceResult.success) {
      for (const issue of invoiceResult.error.issues) {
        ctx.addIssue({
          ...issue,
          path: ['invoice', ...(issue.path || [])],
        })
      }
    }
  }
});
