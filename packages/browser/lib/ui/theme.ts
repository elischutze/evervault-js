import { CompiledTheme, ThemeStyles, ThemeDefinition } from "./types";
import deepmerge from "deepmerge";
import { EvervaultFrame } from "./evervaultFrame";

// The Theme class is responsible for compiling the theme definition into an
// object that can be sent to the iframe. It also handles media queries and
// updates the iframe when the viewport changes.
export class Theme {
  config: CompiledTheme;
  frame;
  #breakpoints: Record<
    string,
    {
      styles: any;
      matches: boolean;
    }
  > = {};

  constructor(frame: EvervaultFrame, config: ThemeDefinition = {}) {
    this.config =
      typeof config === "function"
        ? config({
            media: this.media.bind(this),
          })
        : config;
    this.frame = frame;
  }

  update(config: ThemeDefinition) {
    this.config =
      typeof config === "function"
        ? config({
            media: this.media.bind(this),
          })
        : config;
  }

  media(query: string, styles: ThemeStyles): Object {
    const media = window.matchMedia(query);

    const handler = (e: MediaQueryListEvent) => {
      this.#breakpoints[query].matches = e.matches;
      this.frame.update();
    };

    media.addEventListener("change", handler);

    this.#breakpoints[query] = {
      styles,
      matches: media.matches,
    };

    return {};
  }

  compile() {
    const matchingBreakpoints = Object.values(this.#breakpoints).filter((b) => {
      return b.matches;
    });

    const breakpointStyles = matchingBreakpoints.reduce((acc, b) => {
      return deepmerge(acc, b.styles);
    }, {});

    return {
      ...this.config,
      styles: deepmerge(this.config.styles || {}, breakpointStyles),
    };
  }
}
