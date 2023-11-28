import {
  EvervaultFrameHostMessages,
  RevealRequestClientMessages,
} from "./types";
import { EvervaultFrame } from "./evervaultFrame";
import RevealCopyButton, { RevealCopyButtonOptions } from "./revealCopyButton";
import RevealText, { RevealTextOptions } from "./revealText";
import { generateID } from "./utils";

export default class Reveal {
  app: string;
  ready: boolean = false;
  channel: string;
  #request: Request;
  #frame: EvervaultFrame<
    RevealRequestClientMessages,
    EvervaultFrameHostMessages
  >;
  consumers: (RevealText | RevealCopyButton)[] = [];
  #events: EventTarget = new EventTarget();

  constructor(app: string, request: Request) {
    this.app = app;
    this.channel = generateID();
    this.#request = request;
    this.#frame = new EvervaultFrame(app, "RevealRequest");
    this.#frame.iframe.style.position = "absolute";
    this.#frame.iframe.style.pointerEvents = "none";
    this.#frame.iframe.style.opacity = "0";
    this.#mount();

    this.#frame.on("EV_REVEAL_REQUEST_READY", () => {
      this.ready = true;
      this.checkIfReady();
    });

    this.#frame.on("EV_ERROR", () => {
      this.#emitError();
    });
  }

  async #mount() {
    this.#frame.mount(document.body, {
      config: {
        channel: this.channel,
        request: await this.#serializedRequest(),
      },
      onError: () => {
        this.#emitError();
      },
    });
  }

  async #serializedRequest() {
    return {
      cache: this.#request.cache,
      credentials: this.#request.credentials,
      destination: this.#request.destination,
      integrity: this.#request.integrity,
      keepalive: this.#request.keepalive,
      method: this.#request.method,
      mode: this.#request.mode,
      referrer: this.#request.referrer,
      referrerPolicy: this.#request.referrerPolicy,
      url: this.#request.url,
      body: await this.#request.text(),
      headers: Object.fromEntries(this.#request.headers.entries()),
    };
  }

  #emitError() {
    const event = new CustomEvent("error");
    this.#events.dispatchEvent(event);
  }

  text(path: string, options?: RevealTextOptions) {
    const text = new RevealText(this, path, options);
    this.consumers.push(text);
    return text;
  }

  copyButton(path: string, options?: RevealCopyButtonOptions) {
    const btn = new RevealCopyButton(this, path, options);
    this.consumers.push(btn);
    return btn;
  }

  unmount() {
    this.consumers.forEach((consumer) => consumer.unmount());
    this.#frame.unmount();
  }

  on(event: "ready", callback: () => void): void;
  on(event: "error", callback: () => void): void;
  on(event: string, callback: Function) {
    const handler = (e: Event) => {
      callback((e as CustomEvent).detail);
    };

    this.#events.addEventListener(event, handler);
    return () => {
      this.#events.removeEventListener(event, handler);
    };
  }

  checkIfReady() {
    if (!this.ready) return;
    const consumersReady = this.consumers.every((consumer) => consumer.ready);
    if (!consumersReady) return;
    const event = new CustomEvent("ready");
    this.#events.dispatchEvent(event);
  }
}
