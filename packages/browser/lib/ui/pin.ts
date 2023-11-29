import type {
  PinPayload,
  SelectorType,
  PinFrameClientMessages,
  EvervaultFrameHostMessages,
  PinOptions,
} from "./types";
import { EvervaultFrame } from "./evervaultFrame";

export default class Pin {
  values: any = {};
  #options: PinOptions;
  #frame: EvervaultFrame<PinFrameClientMessages, EvervaultFrameHostMessages>;
  #events: EventTarget = new EventTarget();

  constructor(app: string, options?: PinOptions) {
    this.#options = options || {};
    this.#frame = new EvervaultFrame(app, "Pin");

    this.#frame.on("EV_CHANGE", (payload) => {
      this.values = payload;
      const event = new CustomEvent("change", { detail: payload });
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
        const event = new CustomEvent("error");
        this.#events.dispatchEvent(event);
      },
    });
  }

  unmount() {
    this.#frame.unmount();
  }

  update(options: PinOptions) {
    if (options) {
      this.#options = { ...this.#options, ...options };
    }
    this.#frame.update(this.config);
  }

  on(event: "ready", callback: () => void): void;
  on(event: "error", callback: () => void): void;
  on(event: "change", callback: (payload: PinPayload) => void): void;
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
