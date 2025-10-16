import z from "zod";
import {mobilePhoneValidator, nipValidator, zipCodeValidator} from "@/utils/validators";

const invoiceSchema = z.object({
  companyName: z.string().trim().min(1, {error: 'Pole wymagane'}),
  nip: z.string().trim().min(1, {error: 'Pole wymagane'}).refine(nipValidator),

  street: z.string().trim(),
  city: z.string().trim().min(1, {error: 'Pole wymagane'}),
  zip: z.string().trim().min(1, {error: 'Pole wymagane'}).refine(zipCodeValidator, {error: 'Podaj poprawny kod w formacie xx-xxx' }),

  homeNumber: z.string().trim().min(1, {error: 'Pole wymagane'}),
  flatNumber: z.string().trim(),
  country: z.string().trim(),
  state: z.string().trim(),
  info: z.string().trim(),
});

export const CustomerDataZodSchema = z.object({
  wantInvoice: z.coerce.boolean().default(false),
  address: z.object({
    name: z.string().trim().min(1, {error: 'Pole wymagane'}),
    street: z.string().trim(),
    city: z.string().trim().min(1, {error: 'Pole wymagane'}),
    zip: z.string().trim().min(1, {error: 'Pole wymagane'}).refine(zipCodeValidator, {error: 'Podaj poprawny kod w formacie xx-xxx' }),

    homeNumber: z.string().trim().min(1, {error: 'Pole wymagane'}),
    flatNumber: z.string().trim(),
    country: z.string().trim(),
    state: z.string().trim(),

    phone: z.string().trim().min(1, {error: 'Pole wymagane'}).refine(mobilePhoneValidator, {error: 'Podaj poprawny numer' }),
    email: z.email({error: 'Podaj poprawny adres e-mail'}).trim().min(1, {error: 'Pole wymagane'}),
    info: z.string().trim(),
  }),
  invoice: z.object().loose()

}).superRefine((val, ctx) => {

  if (val.wantInvoice) {
    const {data, error, success} = invoiceSchema.safeParse(val.invoice || {});

    if (error) {
      error.issues.forEach(({path, ...value}) => {
        ctx.addIssue({
          ...value,
          path: ['invoice', ...path],
        })
      });
    }
  }
});
