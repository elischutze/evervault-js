import jss, { JssStyle, StyleSheet } from "jss";
import type { CompiledTheme } from "@evervault/browser";
import { EvervaultProvider } from "@evervault/react";
import preset from "jss-preset-default";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Pin } from "./Pin";
import { CardDetails } from "./CardDetails";
import { resize } from "./utilities/resize";
import { useSearchParams } from "./utilities/useSearchParams";
import { useMessaging } from "./utilities/useMessaging";
import { RevealRequest } from "./Reveal/RevealRequest";
import { RevealText } from "./Reveal/RevealText";
import { RevealCopyButton } from "./Reveal/RevealCopyButton";

jss.setup(preset());

const COMPONENTS = {
  Pin,
  RevealText,
  RevealRequest,
  RevealCopyButton,
  CardDetails,
};

export default function App() {
  const initialized = useRef(false);
  const styles = useRef<StyleSheet | null>(null);
  const [theme, setTheme] = useState<CompiledTheme | null>(null);
  const [config, setConfig] = useState<any | null>(null);
  const { on, send } = useMessaging();
  const { team, app, component } = useSearchParams();

  if (!app || !component) {
    throw new Error("Missing app or component");
  }

  useLayoutEffect(resize);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    // Send a message to the parent window to let it know that the frame is ready
    // to recieve configuration.
    send("EV_FRAME_HANDSHAKE");
  }, [send]);

  useEffect(() => {
    return on("EV_INIT", (payload) => {
      setTheme(payload.theme || null);
      setConfig(payload.config);
      send("EV_FRAME_READY");
    });
  }, [on, send]);

  useEffect(() => {
    return on("EV_UPDATE", (payload) => {
      setTheme(payload.theme || null);
      setConfig(payload.config);
    });
  }, [on]);

  useEffect(() => {
    if (!theme) return;

    const opts = {
      "@import": (theme.fonts || []).map((url) => `url(${url})`) as JssStyle[],
      "@global": theme.styles,
    };

    if (styles.current) {
      styles.current.detach();
    }

    styles.current = jss.createStyleSheet(opts);
    styles.current.attach();

    resize();
  }, [theme]);

  if (!config) return null;

  const Component = COMPONENTS[component as keyof typeof COMPONENTS];

  if (!Component) {
    console.warn("Unknown component", component);
    return null;
  }

  return (
    <EvervaultProvider teamId={team} appId={app}>
      <Component config={config} />
    </EvervaultProvider>
  );
}
