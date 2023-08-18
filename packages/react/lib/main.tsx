import * as React from "react";
import EvervaultClient from "@evervault/browser";

export type EvervaultProviderProps = {
  teamId: string;
  appId: string;
  customConfig?: any;
  children: React.ReactNode | null;
};

export type EvervaultInputProps = {
  onChange?: (cardData: any) => void;
  config?: any;
  onInputsLoad?: () => void;
};

export const EvervaultContext = React.createContext<EvervaultClient | null>(
  null
);

export const EvervaultProvider = ({
  teamId,
  appId,
  customConfig,
  children,
}: EvervaultProviderProps) => {
  const _evervault = new EvervaultClient(teamId, appId, customConfig);

  return (
    <EvervaultContext.Provider value={_evervault}>
      {children}
    </EvervaultContext.Provider>
  );
};

export const EvervaultInput = ({
  onChange,
  config,
  onInputsLoad,
}: EvervaultInputProps) => {
  const id = React.useId();

  if (typeof window === "undefined") {
    return <div id={id} />;
  }

  const evervault = useEvervault();

  const initEvForm = async () => {
    const encryptedInput = evervault?.inputs(id, config);
    encryptedInput?.on("change", async (cardData: any) => {
      if (typeof onChange === "function") {
        onChange(cardData);
      }
    });

    if (
      onInputsLoad &&
      encryptedInput?.isInputsLoaded != null &&
      encryptedInput.isInputsLoaded instanceof Promise
    ) {
      encryptedInput.isInputsLoaded.then(() => onInputsLoad());
    }
  };

  React.useEffect(() => {
    initEvForm();
  }, [evervault]);

  return <div id={id} />;
};

export function useEvervault() {
  if (typeof React.useContext !== "function") {
    throw new Error(
      "You must use React >= 16.8 in order to use useEvervault()"
    );
  }
  const evervault = React.useContext(EvervaultContext);
  if (!evervault) {
    throw new Error(
      "You must wrap your app in an <EvervaultProvider> to use useEvervault()"
    );
  }
  return evervault;
}
