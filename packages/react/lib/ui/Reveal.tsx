import * as React from "react";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useEventListener } from "./useEventListener";
import { useEvervault } from "../main";
import Evervault from "@evervault/browser";
import { RevealText } from "./RevealText";
import { RevealCopyButton } from "./RevealCopyButton";

type RevealClass = ReturnType<Evervault["ui"]["reveal"]>;

export type RevealContextType = {
  reveal: RevealClass | null;
};

export const RevealContext = createContext<RevealContextType | undefined>(
  undefined
);

export interface RevealProps {
  request: Request;
  children: ReactNode | ReactNode[];
  onReady?: () => void;
  onError?: () => void;
}

function Reveal({ request, children, onReady, onError }: RevealProps) {
  const initialized = useRef(false);
  const ev = useEvervault();
  const [instance, setInstance] = useState<RevealClass | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEventListener(instance, "ready", onReady);
  useEventListener(instance, "error", onError);

  useEffect(() => {
    if (!ref.current || initialized.current) return;

    async function init() {
      initialized.current = true;
      const evervault = await ev;
      if (!evervault) return;
      const reveal = evervault.ui.reveal(request);
      setInstance(reveal);
    }

    init();
  }, [instance, request, ev]);

  return (
    <RevealContext.Provider value={{ reveal: instance }}>
      <>
        <div ref={ref} />
        {children}
      </>
    </RevealContext.Provider>
  );
}

export function useRevealContext() {
  const context = useContext(RevealContext);

  if (!context) {
    throw new Error("Reveal consumers must be used within a Reveal component");
  }

  return context;
}

Reveal.Text = RevealText;
Reveal.CopyButton = RevealCopyButton;

export { Reveal };
