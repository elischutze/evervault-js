import * as React from "react";
import { useLayoutEffect, useMemo, useRef } from "react";
import Evervault, { PinPayload } from "@evervault/browser";
import type { PinOptions } from "@evervault/browser";
import { useEventListener } from "./useEventListener";
import { useEvervault } from "../main";

export type PinProps = PinOptions & {
  onReady?: () => void;
  onError?: () => void;
  onChange?: (data: PinPayload) => void;
};

type PinClass = ReturnType<Evervault["ui"]["pin"]>;

export function Pin({ theme, onReady, onChange, onError, length }: PinProps) {
  const ev = useEvervault();
  const initialized = useRef(false);
  const [instance, setInstance] = React.useState<PinClass | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEventListener(instance, "ready", onReady);
  useEventListener(instance, "error", onError);
  useEventListener(instance, "change", onChange);

  const config = useMemo(() => {
    return {
      theme,
      length,
    };
  }, [theme, length]);

  useLayoutEffect(() => {
    if (!ref.current) return;
    if (instance) {
      instance.update(config);
    } else {
      async function init() {
        if (initialized.current || !ref.current) return;
        initialized.current = true;
        const evervault = await ev;
        if (!evervault) return;
        const inst = evervault.ui.pin(config);
        inst.mount(ref.current);
        setInstance(inst);
      }

      init();
    }
  }, [instance, config]);

  return <div ref={ref} />;
}
