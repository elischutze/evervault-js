import "./style.css";
import EvervaultClient from "@evervault/browser";

const evervault = new EvervaultClient(
  process.env.EV_TEAM_UUID,
  process.env.EV_APP_UUID
);

const card = evervault.ui.cardDetails({
  theme: evervault.ui.themes.clean(),
});

card.on("change", (values) => {
  console.log(values);
});

card.mount("#form");
