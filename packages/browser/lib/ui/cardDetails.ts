import {
  CardDetailsPayload,
  CardDetailsTranslations,
  CardDetailsField,
  ThemeDefinition,
  SwipedCardDetails,
  CardDetailsFrameClientMessages,
  CardDetailsFrameHostMessages,
} from "./types";
import { EvervaultFrame } from "./evervaultFrame";
import { SelectorType } from "./types";
import EvervaultClient from "../main";

export type CardDetailsOptions = {
  theme?: ThemeDefinition;
  autoFocus?: boolean;
  hiddenFields?: CardDetailsField[];
  translations?: Partial<CardDetailsTranslations>;
};

export default class CardDetails {
  values?: CardDetailsPayload;
  #options: CardDetailsOptions;
  #frame: EvervaultFrame<
    CardDetailsFrameClientMessages,
    CardDetailsFrameHostMessages
  >;
  #events: EventTarget = new EventTarget();

  constructor(client: EvervaultClient, options?: CardDetailsOptions) {
    this.#options = options || {};
    this.#frame = new EvervaultFrame(client, "CardDetails");

    // update the values when the frame sends a change event and dispatch
    // a change event.
    this.#frame.on("EV_CHANGE", (payload) => {
      this.values = payload;
      const event = new CustomEvent("change", { detail: payload });
      this.#events.dispatchEvent(event);
    });

    this.#frame.on("EV_SWIPE", (payload) => {
      const event = new CustomEvent("swipe", { detail: payload });
      this.#events.dispatchEvent(event);
    });

    this.#frame.on("EV_FRAME_READY", () => {
      const event = new CustomEvent("ready");
      this.#events.dispatchEvent(event);
    });
  }

  get config() {
    return {
      theme: this.#options.theme,
      config: {
        autoFocus: this.#options.autoFocus,
        translations: this.#options.translations,
        hiddenFields: (this.#options.hiddenFields || [])?.join(","),
      },
    };
  }

  mount(selector: SelectorType) {
    this.#frame.mount(selector, {
      ...this.config,
      onError: () => {
        const event = new CustomEvent("error");
        this.#events.dispatchEvent(event);
      },
    });

    return this;
  }

  update(options?: CardDetailsOptions) {
    if (options) {
      this.#options = { ...this.#options, ...options };
    }
    this.#frame.update(this.config);
    return this;
  }

  unmount() {
    this.#frame.unmount();
    return this;
  }

  on(event: "ready", callback: () => void): void;
  on(event: "error", callback: () => void): void;
  on(event: "change", callback: (payload: CardDetailsPayload) => void): void;
  on(event: "swipe", callback: (payload: SwipedCardDetails) => void): void;
  on(event: string, callback: Function) {
    const handler = (e: Event) => {
      callback((e as CustomEvent).detail);
    };

    this.#events.addEventListener(event, handler);
    return () => this.#events.removeEventListener(event, handler);
  }

  validate() {
    this.#frame.send("EV_VALIDATE");
    return this;
  }
}
