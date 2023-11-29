import cardValidator from "card-validator";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Field } from "../Common/Field";
import { useForm } from "../utilities/useForm";
import { CardCVC } from "./CardCVC";
import { CardExpiry } from "./CardExpiry";
import { CardNumber } from "./CardNumber";
import { resize } from "../utilities/resize";
import { Error } from "../Common/Error";
import { changePayload, isCVCValid, swipePayload } from "./utilities";
import { useTranslations } from "../utilities/useTranslations";
import { DEFAULT_TRANSLATIONS } from "./translations";
import { useEvervault } from "@evervault/react";
import { useMessaging } from "../utilities/useMessaging";
import type {
  CompiledTheme,
  CardDetailsField,
  CardDetailsTranslations,
  CardDetailsFrameClientMessages,
  CardDetailsFrameHostMessages,
} from "@evervault/browser";
import { useCardReader } from "./useCardReader";

export type CardDetailsForm = {
  number: string;
  cvc: string;
  expiry: string;
};

type CardDetailsConfig = {
  theme?: CompiledTheme;
  autoFocus?: boolean;
  hiddenFields?: CardDetailsField[];
  translations?: Partial<CardDetailsTranslations>;
};

export function CardDetails({ config }: { config: CardDetailsConfig }) {
  const cvc = useRef<HTMLInputElement | null>(null);
  const { on, send } = useMessaging<
    CardDetailsFrameHostMessages,
    CardDetailsFrameClientMessages
  >();
  const ev = useEvervault();
  const { t } = useTranslations(DEFAULT_TRANSLATIONS, config?.translations);

  const hidden = String(config?.hiddenFields || "").split(",");

  const form = useForm<CardDetailsForm>({
    initialValues: {
      cvc: "",
      expiry: "",
      number: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      const cardValidation = cardValidator.number(values.number);
      if (!cardValidation.isValid) {
        errors.number = "invalid";
      }

      const expiry = cardValidator.expirationDate(values.expiry);
      if (!expiry.isValid) {
        errors.expiry = "invalid";
      }

      const validCVC = isCVCValid(values.cvc, cardValidation.card?.type);
      if (!validCVC) {
        errors.cvc = "invalid";
      }

      return errors;
    },
    onChange: (form) => {
      const triggerChange = async () => {
        if (!ev) return;
        const cardData = await changePayload(ev, form);
        send("EV_CHANGE", cardData);
      };

      triggerChange();
    },
  });

  const cardReaderListening = useCardReader((card) => {
    form.setValues({
      number: card.number,
      expiry: `${card.month}/${card.year}`,
      cvc: "",
    });

    async function triggerSwipe() {
      if (!ev) return;
      const swipeData = await swipePayload(ev, card);
      send("EV_SWIPE", swipeData);
    }

    triggerSwipe();
    cvc.current?.focus();
  });

  useLayoutEffect(() => {
    resize();
  });

  useEffect(() => {
    return on("EV_VALIDATE", () => {
      form.validate();
    });
  }, [on, form]);

  const hasErrors = Object.keys(form.errors || {}).length > 0;

  return (
    <fieldset
      ev-component="cardDetails"
      ev-valid={hasErrors ? "false" : "true"}
    >
      {!hidden.includes("number") && (
        <Field
          name="number"
          error={
            form.errors?.number &&
            form.touched.number &&
            t(`number.errors.${form.errors.number}`)
          }
        >
          <label htmlFor="number">{t("number.label")}</label>
          <CardNumber
            disabled={!config}
            readOnly={cardReaderListening}
            autoFocus={config.autoFocus}
            placeholder={t("number.placeholder")}
            value={form.values.number}
            {...form.register("number")}
          />
          {form.errors?.number && form.touched.number && (
            <Error>{t(`number.errors.${form.errors.number}`)}</Error>
          )}
        </Field>
      )}

      {!hidden.includes("expiry") && (
        <Field
          name="expiry"
          error={
            form.errors?.expiry &&
            form.touched.expiry &&
            t(`expiry.errors.${form.errors.expiry}`)
          }
        >
          <label htmlFor="expiry">{t("expiry.label")}</label>
          <CardExpiry
            value={form.values.expiry}
            disabled={!config}
            readOnly={cardReaderListening}
            placeholder={t("expiry.placeholder")}
            {...form.register("expiry")}
          />
          {form.errors?.expiry && form.touched.expiry && (
            <Error>{t(`expiry.errors.${form.errors.expiry}`)}</Error>
          )}
        </Field>
      )}

      {!hidden.includes("cvc") && (
        <Field
          name="cvc"
          error={
            form.errors?.cvc &&
            form.touched.cvc &&
            t(`cvc.errors.${form.errors.cvc}`)
          }
        >
          <label htmlFor="cvc">{t("cvc.label")}</label>
          <CardCVC
            ref={cvc}
            value={form.values.cvc}
            disabled={!config}
            readOnly={cardReaderListening}
            placeholder={t("cvc.placeholder")}
            {...form.register("cvc")}
          />
          {form.errors?.cvc && form.touched.cvc && (
            <Error>{t(`cvc.errors.${form.errors.cvc}`)}</Error>
          )}
        </Field>
      )}
    </fieldset>
  );
}
