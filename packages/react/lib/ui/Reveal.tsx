import * as React from "react";
import {
  ReactNode,
  RefObject,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useEventListener } from "./useEventListener";
import { useEvervault } from "../main";
import Evervault from "@evervault/browser";
import { ThemeDefinition } from "@evervault/browser";
import { RevealFormat } from "@evervault/browser";

type RevealContextType = {
  reveal: RefObject<RevealClass | null>;
};

type RevealClass = ReturnType<Evervault["ui"]["reveal"]>;
const RevealContext = createContext<RevealContextType | undefined>(undefined);

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

type RevealTextProps = {
  path: string;
  theme?: ThemeDefinition;
  format?: RevealFormat;
};

function useRevealContext() {
  const context = useContext(RevealContext);

  if (!context) {
    throw new Error("Reveal consumers must be used within a Reveal component");
  }

  return context;
}

type RevealTextClass = ReturnType<Evervault["ui"]["reveal"]["text"]>;

function RevealText({ path, theme, format }: RevealTextProps) {
  const [instance, setInstance] = useState<RevealTextClass | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { reveal } = useRevealContext();

  useLayoutEffect(() => {
    if (!ref.current || instance || !reveal) return;

    async function init() {
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

Reveal.Text = RevealText;

type RevealCopyButtonClass = ReturnType<
  Evervault["ui"]["reveal"]["copyButton"]
>;

export type RevealCopyButtonProps = {
  path: string;
  onCopy?: () => void;
};

function RevealCopyButton({ path, ...options }: RevealCopyButtonProps) {
  const [instance, setInstance] = useState<RevealCopyButtonClass | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { reveal } = useRevealContext();
  useEventListener(instance, "copy", options.onCopy);

  useLayoutEffect(() => {
    if (!ref.current || instance || !reveal) return;

    async function init() {
      const inst = reveal.copyButton(path, options);
      inst.mount(ref.current);
      setInstance(inst);
    }

    init();
  }, [reveal, path, options, instance]);

  return <div ref={ref} />;
}

Reveal.CopyButton = RevealCopyButton;

export { Reveal };
