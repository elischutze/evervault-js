import "./style.css";
import type EvervaultClient from "@evervault/browser";

// themes can just be objects, however, here we are using a function so that we can update the theme
// when the card type is detected.
const theme = (
  opts: {
    showIcon?: boolean;
  } = {}
) => ({
  styles: {
    fieldset: {
      position: "relative",
    },

    label: {
      display: "none",
    },

    input: {
      padding: 15,
      fontSize: 18,
      outline: "none",
      border: "2px solid #ccc",

      "&::placeholder": {
        color: "#aaa",
      },
    },

    "fieldset[ev-valid=false]": {
      paddingBottom: 15,

      "& input": {
        borderColor: "#f00",
      },
    },

    ".field": {
      position: "unset",
    },

    ".error": {
      left: 0,
      bottom: 0,
      color: "#f00",
      fontSize: 14,
      display: "none",
      position: "absolute",
    },

    ".field[ev-valid=false]:first-child .error": {
      display: "block",
    },

    ".field[ev-valid=true] + .field[ev-valid=false] .error": {
      display: "block",
    },

    "fieldset:focus-within .field:first-child input": {
      borderColor: "#63e",
    },

    '.field[data-name="expiry"] input': {
      top: 0,
      right: 60,
      width: "100px",
      position: "absolute",
      borderColor: "transparent",
      transition: "transform 0.2s ease",
      transform: opts.showIcon ? "translateX(-50px)" : "translateX(0)",
    },

    '.field[data-name="cvc"] input': {
      top: 0,
      right: 0,
      width: 80,
      position: "absolute",
      textAlign: "right",
      borderColor: "transparent",
      transition: "transform 0.2s ease",
      transform: opts.showIcon ? "translateX(-50px)" : "translateX(0)",
    },
  },
});

const evervault = new window.Evervault(
  import.meta.env.VITE_EV_TEAM_UUID as string,
  import.meta.env.VITE_EV_APP_UUID as string
) as EvervaultClient;

const card = evervault.ui.cardDetails({ theme: theme() });

card.on("ready", () => {
  document.body.classList.add("ready");
});

const cardIcon = document.querySelector(".card-icon");
card.on("change", (values) => {
  console.log("change", values);
  if (values.brand) {
    cardIcon.dataset.type = values.brand;
    cardIcon.classList.add("show");
    card.update({ theme: theme({ showIcon: true }) });
  } else {
    cardIcon.classList.remove("show");
    card.update({ theme: theme() });
  }
});

card.on("swipe", (values) => {
  console.log("swipe", values);
});

card.mount("#card");
