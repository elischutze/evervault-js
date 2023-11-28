import cardValidator from "card-validator";
import { CardDetailsForm } from ".";
import { UseFormReturn } from "../utilities/useForm";
import type {
  CardDetailsPayload,
  SwipedCardDetails,
} from "@evervault/browser";
import { MagStripeData } from "./useCardReader";
import { PromisifiedEvervaultClient } from "@evervault/react";

export async function changePayload(
  ev: PromisifiedEvervaultClient,
  form: UseFormReturn<CardDetailsForm>,
): Promise<CardDetailsPayload> {
  const { number, expiry, cvc } = form.values;
  const brand = cardBrand(number);

  return {
    brand,
    number: await encryptedNumber(ev, number),
    cvc: await encryptedCVC(ev, cvc, brand),
    expiry: formatExpiry(expiry),
    isValid: form.isValid,
    last4: last4(number),
    bin: binNumber(number, brand),
    errors: Object.keys(form.errors || {}).length > 0 ? form.errors : null,
  };
}

export async function swipePayload(
  ev: PromisifiedEvervaultClient,
  values: MagStripeData,
): Promise<SwipedCardDetails> {
  return {
    brand: cardBrand(values.number),
    number: await encryptedNumber(ev, values.number),
    expiry: {
      month: values.month,
      year: values.year,
    },
    firstName: values.firstName || null,
    lastName: values.lastName || null,
    last4: last4(values.number),
    bin: binNumber(values.number),
  };
}

function formatExpiry(expiry: string) {
  const parsedExpiry = cardValidator.expirationDate(expiry);

  return {
    month: parsedExpiry.month,
    year: parsedExpiry.year,
  };
}

function cardBrand(number: string) {
  const { card } = cardValidator.number(number);
  return card?.type;
}

function binNumber(card: string, brand?: string) {
  const { isValid } = cardValidator.number(card);
  if (!isValid) return null;
  if (brand === "amex") return card.substring(0, 6);
  return card.substring(0, 8);
}

function last4(card: string) {
  const { isValid } = cardValidator.number(card);
  if (!isValid) return null;
  return card.substring(card.length - 4);
}

async function encryptedNumber(ev: PromisifiedEvervaultClient, number: string) {
  const { isValid } = cardValidator.number(number);
  if (!isValid) return null;
  return await ev.encrypt(number);
}

async function encryptedCVC(
  ev: PromisifiedEvervaultClient,
  cvc: string,
  brand?: string,
) {
  if (!isCVCValid(cvc, brand)) return null;
  return await ev.encrypt(cvc);
}

export function isCVCValid(cvc: string, brand?: string) {
  const { isValid } = cardValidator.cvv(
    cvc,
    brand === "american-express" ? 4 : 3,
  );
  return isValid;
}
