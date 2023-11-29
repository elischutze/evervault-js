import "./style.css";

import type EvervaultClient from "@evervault/browser";

const evervault = new window.Evervault(
  import.meta.env.VITE_EV_TEAM_UUID as string,
  import.meta.env.VITE_EV_APP_UUID as string
) as EvervaultClient;

const comp = evervault.ui.pin({
  theme: evervault.ui.themes.clean(),
});

comp.on("change", (values) => {
  console.log(values);
});

comp.mount("#form");
