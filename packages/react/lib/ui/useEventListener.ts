import { useEffect } from "react";

export function useEventListener(instance: any, event: string, callback: any) {
  useEffect(() => {
    if (!callback || !instance) return;
    return instance.on(event, callback);
  });
}
