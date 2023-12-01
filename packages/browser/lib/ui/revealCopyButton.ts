import EvervaultClient from "../main";
import { EvervaultFrame } from "./evervaultFrame";
import Reveal from "./reveal";
import type {
  EvervaultFrameHostMessages,
  RevealConsumerClientMessages,
  RevealFormat,
  SelectorType,
  ThemeDefinition,
} from "types";

export type RevealCopyButtonOptions = {
  theme?: ThemeDefinition;
  text?: string;
  icon?: string;
  format?: RevealFormat;
};

export default class RevealCopyButton {
  path: string;
  ready: boolean = false;
  options: RevealCopyButtonOptions;
  #reveal: Reveal;
  #frame: EvervaultFrame<
    RevealConsumerClientMessages,
    EvervaultFrameHostMessages
  >;
  #events: EventTarget = new EventTarget();

  constructor(
    reveal: Reveal,
    client: EvervaultClient,
    path: string,
    options?: RevealCopyButtonOptions
  ) {
    this.path = path;
    this.#reveal = reveal;
    this.options = options || {};

    this.#frame = new EvervaultFrame(client, "RevealCopyButton", {
      allow: "clipboard-read; clipboard-write",
    });

    this.#frame.on("EV_REVEAL_CONSUMER_READY", () => {
      this.ready = true;
      reveal.checkIfReady();
    });

    this.#frame.on("EV_COPY", () => {
      const event = new CustomEvent("copy");
      this.#events.dispatchEvent(event);
    });
  }

  mount(selector: SelectorType) {
    this.#frame.mount(selector, {
      theme: this.options.theme,
      config: {
        path: this.path,
        text: this.options.text,
        icon: this.options.icon,
        channel: this.#reveal.channel,
        format: this.options.format,
      },
    });

    return this;
  }

  unmount() {
    this.#frame.unmount();
    return this;
  }

  on(event: "copy", handler: () => void): void;
  on(event: string, callback: Function) {
    const handler = (e: Event) => {
      callback((e as CustomEvent).detail);
    };

    this.#events.addEventListener(event, handler);
    return () => {
      this.#events.removeEventListener(event, handler);
    };
  }
}
