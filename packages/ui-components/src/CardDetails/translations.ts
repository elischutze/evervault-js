import { CardDetailsTranslations } from "@evervault/browser";

export const DEFAULT_TRANSLATIONS: CardDetailsTranslations = {
  number: {
    label: "Number",
    placeholder: "0000 0000 0000 0000",
    errors: {
      invalid: "Invalid card number",
    },
  },
  expiry: {
    label: "Expiry",
    placeholder: "MM/YY",
    errors: {
      invalid: "Invalid expiry date",
    },
  },
  cvc: {
    label: "CVC",
    placeholder: "123",
    errors: {
      invalid: "Invalid CVC",
    },
  },
};
