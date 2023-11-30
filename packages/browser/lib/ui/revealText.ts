import EvervaultClient from "../main";
import { EvervaultFrame } from "./evervaultFrame";
import Reveal from "./reveal";
import {
  EvervaultFrameHostMessages,
  RevealConsumerClientMessages,
  RevealFormat,
  SelectorType,
  ThemeDefinition,
} from "./types";

export type RevealTextOptions = {
  theme?: ThemeDefinition;
  format?: RevealFormat;
};

export default class RevealText {
  path: string;
  ready: boolean = false;
  #reveal: Reveal;
  #frame: EvervaultFrame<
    RevealConsumerClientMessages,
    EvervaultFrameHostMessages
  >;
  #options: RevealTextOptions;

  constructor(
    reveal: Reveal,
    client: EvervaultClient,
    path: string,
    options?: RevealTextOptions
  ) {
    this.path = path;
    this.#reveal = reveal;
    this.#options = options || {};
    this.#frame = new EvervaultFrame(client, "RevealText");

    this.#frame.on("EV_REVEAL_CONSUMER_READY", () => {
      this.ready = true;
      reveal.checkIfReady();
    });
  }

  mount(selector: SelectorType) {
    this.#frame.mount(selector, {
      theme: this.#options.theme,
      config: {
        path: this.path,
        channel: this.#reveal.channel,
        format: this.#options.format,
      },
    });

    return this;
  }

  unmount() {
    this.#frame.unmount();
    return this;
  }
}
