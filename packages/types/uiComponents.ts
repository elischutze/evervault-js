import type { Styles } from "jss";

export interface TranslationsObject {
  [key: string]: string | TranslationsObject | undefined;
}

export type ThemeStyles = Partial<Styles>;

export interface UIComponentMessageDetail {
  type: string;
  payload: unknown;
}

export interface ThemeObject {
  fonts?: string[];
  styles?: ThemeStyles;
}

export type ThemeFunction = (utilities: ThemeUtilities) => ThemeObject;

export type ThemeDefinition = ThemeObject | ThemeFunction;

export interface ThemeUtilities {
  media: (property: string, styles: ThemeStyles) => object;
  extend: (theme: ThemeDefinition) => object;
}

export type SelectorType = string | HTMLElement;

interface CardExpiry {
  month: string | null;
  year: string | null;
}

export interface CardDetailsPayload {
  isValid: boolean;
  card: {
    brand: string | undefined;
    number: string | null;
    last4: string | null;
    bin: string | null;
    expiry: CardExpiry;
    cvc: string | null;
  };
  errors: null | Partial<{
    number?: string;
    cvc?: string;
    expiry?: string;
  }>;
}

export type CardDetailsField = "number" | "expiry" | "cvc";

interface CardFieldTranslations<E extends TranslationsObject>
  extends TranslationsObject {
  label?: string;
  placeholder?: string;
  errors?: E;
}

export interface CardDetailsTranslations extends TranslationsObject {
  number: CardFieldTranslations<{ invalid?: string }>;
  expiry: CardFieldTranslations<{ invalid?: string }>;
  cvc: CardFieldTranslations<{ invalid?: string }>;
}

export interface CardDetailsOptions {
  theme?: ThemeDefinition;
  autoFocus?: boolean;
  hiddenFields?: CardDetailsField[];
  translations?: Partial<CardDetailsTranslations>;
}

export interface SwipedCardDetails {
  brand: string | undefined;
  number: string | null;
  expiry: CardExpiry | null;
  firstName: string | null;
  lastName: string | null;
  last4: string | null;
  bin: string | null;
}

export interface EvervaultFrameClientMessages {
  EV_RESIZE: { height: number };
  EV_FRAME_READY: undefined;
  EV_FRAME_HANDSHAKE: undefined;
}

export interface EvervaultFrameHostMessages {
  EV_INIT: {
    theme?: ThemeObject;
    config?: unknown;
  };
  EV_UPDATE: {
    theme?: ThemeObject;
    config?: unknown;
  };
}

export interface CardDetailsFrameClientMessages
  extends EvervaultFrameClientMessages {
  EV_SWIPE: SwipedCardDetails;
  EV_CHANGE: CardDetailsPayload;
}

export interface CardDetailsFrameHostMessages
  extends EvervaultFrameHostMessages {
  EV_VALIDATE: undefined;
}

export interface PinOptions {
  theme?: ThemeDefinition;
  length?: number;
  autoFocus?: boolean;
  mode?: "numeric" | "alphanumeric";
  inputType?: "number" | "text" | "password";
}

export interface PinPayload {
  isComplete: boolean;
  value: string | null;
}

export interface PinFrameClientMessages extends EvervaultFrameClientMessages {
  EV_CHANGE: PinPayload;
  EV_COMPLETE: PinPayload;
}

export interface RevealRequestClientMessages
  extends EvervaultFrameClientMessages {
  EV_REVEAL_REQUEST_READY: undefined;
  EV_ERROR: undefined;
}

export interface RevealConsumerClientMessages
  extends EvervaultFrameClientMessages {
  EV_COPY: undefined;
  EV_REVEAL_CONSUMER_READY: undefined;
  EV_REVEAL_CONSUMER_ERROR: string;
}

export interface RevealFormat {
  regex: RegExp;
  replace: string;
}