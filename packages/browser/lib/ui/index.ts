import EvervaultClient from "../main";
import CardDetails, { CardDetailsOptions } from "./cardDetails";
import Pin from "./pin";
import Reveal from "./reveal";
import { themes } from "./themes";
import type { PinOptions } from "./types";

export default class UIComponents {
  client: EvervaultClient;
  themes = themes;

  constructor(client: EvervaultClient) {
    this.client = client;
  }

  cardDetails(opts?: CardDetailsOptions) {
    return new CardDetails(this.client.config.appId, opts);
  }

  pin(opts?: PinOptions) {
    return new Pin(this.client.config.appId, opts);
  }

  reveal(request: Request) {
    return new Reveal(this.client.config.appId, request);
  }
}
