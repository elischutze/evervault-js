import * as React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { useEventListener } from "./useEventListener";
import Evervault from "@evervault/browser";
import { useRevealContext } from "./Reveal";

type RevealCopyButtonProps = {
  path: string;
  onCopy?: () => void;
};

type RevealInstance = ReturnType<Evervault["ui"]["reveal"]>;
type RevealCopyButtonClass = ReturnType<RevealInstance["copyButton"]>;

export function RevealCopyButton({
  path,
  onCopy,
  ...options
}: RevealCopyButtonProps) {
  const [instance, setInstance] = useState<RevealCopyButtonClass | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { reveal } = useRevealContext();
  useEventListener(instance, "copy", onCopy);

  useLayoutEffect(() => {
    async function init() {
      if (!ref.current || instance || !reveal) return;
      const inst = reveal?.copyButton(path, options);
      inst.mount(ref.current);
      setInstance(inst);
    }

    init();
  }, [reveal, path, options, instance]);

  return <div ref={ref} />;
}
