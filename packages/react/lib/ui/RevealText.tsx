import * as React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import Evervault from "@evervault/browser";
import type { RevealFormat, ThemeDefinition } from "@evervault/browser";
import { useRevealContext } from "./Reveal";

type RevealTextProps = {
  path: string;
  theme?: ThemeDefinition;
  format?: RevealFormat;
};

type RevealInstance = ReturnType<Evervault["ui"]["reveal"]>;
type RevealTextClass = ReturnType<RevealInstance["text"]>;

export function RevealText({ path, theme, format }: RevealTextProps) {
  const [instance, setInstance] = useState<RevealTextClass | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { reveal } = useRevealContext();

  useLayoutEffect(() => {
    async function init() {
      if (!ref.current || instance || !reveal) return;

      const inst = reveal.text(path, {
        theme,
        format,
      });
      inst.mount(ref.current);
      setInstance(inst);
    }

    init();
  }, [reveal, path, theme, format, instance]);

  return <div ref={ref} />;
}
