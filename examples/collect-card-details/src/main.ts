import "./style.css";

import type EvervaultClient from "@evervault/browser";

const evervault = new window.Evervault(
  import.meta.env.VITE_EV_TEAM_UUID as string,
  import.meta.env.VITE_EV_APP_UUID as string
) as EvervaultClient;

const card = evervault.ui.cardDetails({
  theme: evervault.ui.themes.clean(),
});

card.on("change", (values) => {
  console.log("change", values);
});

card.on("swipe", (values) => {
  console.log("swipe", values);
});

card.mount("#form");
