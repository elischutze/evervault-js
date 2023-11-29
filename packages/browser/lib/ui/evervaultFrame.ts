import { Theme } from "./theme";
import {
  EvervaultFrameClientMessages,
  EvervaultFrameHostMessages,
  SelectorType,
  ThemeDefinition,
} from "./types";
import { generateID, resolveSelector } from "./utils";

const FRAME_URL = import.meta.env.VITE_EVERVAULT_UI_COMPONENTS_URL;

type FrameConfiguration = {
  theme?: ThemeDefinition;
  config?: any;
  onError?: OnErrorEventHandler;
};

type FrameOptions = {
  allow?: string;
};

// The EvervaultFrame class is responsible for creating and managing the iframe
// that is used to render the component. It also handles communication between
// the iframe and the parent window.
export class EvervaultFrame<
  ReceivableMessages extends EvervaultFrameClientMessages = EvervaultFrameClientMessages,
  SendableMessages extends EvervaultFrameHostMessages = EvervaultFrameHostMessages
> {
  iframe: HTMLIFrameElement;
  payload: any;
  #id = generateID();
  #theme: Theme | null = null;

  // The constructor accepts the app and component name and generates the URL
  // for the iframe passing both as a query params. The component params is
  // used to determine which component to render in the iframe.
  constructor(app: string, component: string, options?: FrameOptions) {
    this.iframe = document.createElement("iframe");
    this.iframe.id = this.#id;
    this.iframe.src = this.#generateUrl(app, component);
    this.iframe.dataset.evervault = "component";
    this.iframe.style.height = "0";
    this.iframe.style.border = "none";
    this.iframe.style.width = "100%";
    this.iframe.style.display = "block";
    this.iframe.setAttribute("ev-component", component);

    if (options?.allow) {
      this.iframe.allow = options.allow;
    }
  }

  // After instantiating the EvervaultFrame class, it needs to be mounted
  // to the DOM. This method accepts a selector or HTMLElement and appends
  // the iframe to the element.
  mount(selector: SelectorType, opts: FrameConfiguration = {}) {
    if (this.isMounted) {
      throw new Error("Evervault frame already mounted");
    }

    const element = resolveSelector(selector);

    this.#theme = opts.theme ? new Theme(this, opts.theme) : null;

    // The frame will trigger an EV_FRAME_READY event when it is ready to
    // receive messages from the parent window.
    this.on("EV_FRAME_HANDSHAKE", () => {
      this.#setupListeners();
      // Once the frame is ready, we send an EV_INIT event to the frame with
      // the theme and configurgation for the frame.
      this.send("EV_INIT", {
        theme: this.#theme?.compile(),
        config: opts.config,
      });
    });

    this.iframe.onerror = opts.onError || null;

    element.appendChild(this.iframe);
  }

  unmount() {
    if (!this.iframe) return;
    this.iframe.remove();
  }

  // Takes an update configuration object and posts it into the iframe via an
  // EV_UPDATE event.
  update(opts?: FrameConfiguration) {
    if (!this.isMounted) {
      throw new Error("Evervault frame not mounted");
    }

    if (opts?.theme) {
      if (!this.#theme) {
        this.#theme = new Theme(this, opts.theme);
      } else {
        this.#theme?.update(opts.theme);
      }
    }

    this.send("EV_UPDATE", {
      theme: this.#theme?.compile(),
      config: opts?.config,
    });
  }

  // The on method can be used to setup event listeners for messages sent from
  // the iframe. This will automatically filter out messages that are not
  // intended for this instance of the EvervaultFrame class by comparing the
  // frame ID.
  on<K extends keyof ReceivableMessages>(
    event: K,
    callback: (message: ReceivableMessages[K]) => void
  ) {
    const handleMessage = (e: MessageEvent) => {
      if (e.data.frame !== this.#id) return;
      if (e.data.type === event) callback(e.data.payload);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }

  // The send method is used to send messages to the iframe.
  send<K extends keyof SendableMessages>(
    type: K,
    payload?: SendableMessages[K]
  ) {
    if (!this.iframe?.contentWindow) {
      console.error("iframe not loaded");
      return;
    }

    const data = { type, payload };
    this.iframe.contentWindow.postMessage(data, FRAME_URL);
  }

  get isMounted() {
    return !!this.iframe.parentNode;
  }

  #generateUrl(app: string, component: string) {
    const url = new URL(FRAME_URL);
    url.searchParams.set("id", this.#id);
    url.searchParams.set("app", app);
    url.searchParams.set("component", component);
    return url.toString();
  }

  #setupListeners() {
    this.on("EV_RESIZE", ({ height }) => {
      if (!this.iframe) return;
      this.iframe.style.height = `${height}px`;
    });
  }
}
