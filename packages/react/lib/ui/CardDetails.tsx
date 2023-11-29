import * as React from "react";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useEvervault } from "../main";
import Evervault, {
  CardDetailsPayload,
  CardDetailsTranslations,
  SwipedCardDetails,
  ThemeDefinition,
} from "@evervault/browser";
import { useEventListener } from "./useEventListener";

export type CardDetailsProps = {
  theme?: ThemeDefinition;
  translations?: CardDetailsTranslations;
  onReady?: () => void;
  onError?: () => void;
  onSwipe?: (data: SwipedCardDetails) => void;
  onChange?: (data: CardDetailsPayload) => void;
};

type CardDetailsClass = ReturnType<Evervault["ui"]["cardDetails"]>;

export function CardDetails({
  theme,
  onSwipe,
  onReady,
  onError,
  onChange,
  translations,
}: CardDetailsProps) {
  const ev = useEvervault();
  const initialized = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const [instance, setInstance] = React.useState<CardDetailsClass | null>(null);

  useEventListener(instance, "ready", onReady);
  useEventListener(instance, "error", onError);
  useEventListener(instance, "swipe", onSwipe);
  useEventListener(instance, "change", onChange);

  const config = useMemo(() => {
    return {
      theme,
      translations,
    };
  }, [theme, translations]);

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
        const inst = evervault.ui.cardDetails(config);
        inst.mount(ref.current);
        setInstance(inst);
      }

      init();
    }
  }, [config, instance]);

  return <div ref={ref} />;
}
