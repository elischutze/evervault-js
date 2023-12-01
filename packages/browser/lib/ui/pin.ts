import type {
  PinPayload,
  SelectorType,
  PinFrameClientMessages,
  EvervaultFrameHostMessages,
  PinOptions,
} from "types";
import { EvervaultFrame } from "./evervaultFrame";
import EvervaultClient from "../main";
import EventManager from "./eventManager";

export default class Pin {
  values: any = {};
  #options: PinOptions;
  #frame: EvervaultFrame<PinFrameClientMessages, EvervaultFrameHostMessages>;
  #events = new EventManager();

  constructor(client: EvervaultClient, options?: PinOptions) {
    this.#options = options || {};
    this.#frame = new EvervaultFrame(client, "Pin");

    this.#frame.on("EV_CHANGE", (payload) => {
      this.values = payload;
      this.#events.dispatch("change", payload);
    });

    this.#frame.on("EV_COMPLETE", (payload) => {
      this.values = payload;
      this.#events.dispatch("complete", payload);
    });

    this.#frame.on("EV_FRAME_READY", () => {
      this.#events.dispatch("ready");
    });
  }

  get config() {
    return {
      theme: this.#options.theme,
      config: {
        length: Math.min(this.#options.length ?? 4, 10),
        mode: this.#options.mode || "numeric",
        autoFocus: this.#options.autoFocus,
        inputType: this.#options.inputType,
      },
    };
  }

  mount(selector: SelectorType) {
    this.#frame.mount(selector, {
      ...this.config,
      onError: () => {
        this.#events.dispatch("error");
      },
    });

    return this;
  }

  unmount() {
    this.#frame.unmount();
    return this;
  }

  update(options: PinOptions) {
    if (options) {
      this.#options = { ...this.#options, ...options };
    }
    this.#frame.update(this.config);
    return this;
  }

  on(event: "ready", callback: () => void): void;
  on(event: "error", callback: () => void): void;
  on(event: "change", callback: (payload: PinPayload) => void): void;
  on(event: "complete", callback: (payload: PinPayload) => void): void;
  on(event: string, callback: Function) {
    return this.#events.on(event, callback);
  }
}
