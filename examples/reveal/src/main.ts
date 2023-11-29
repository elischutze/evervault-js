import "./style.css";
import type EvervaultClient from "@evervault/browser";

const ENDPOINT = import.meta.env.VITE_REVEAL_ENDPOINT as string;

// This example expects your test reveal endpoint to return a JSON payload with the following shape:
// {
//  "card": {
//    "number": "4242424242424242",
//    "cvc": "123"
//   }
// }

const button = document.getElementById("show-button");
const card = document.getElementById("card");

let loaded = false;
let isShown = false;

const theme = {
  styles: {
    body: {
      fontSize: 14,
      color: "white",
      fontFamily: "monospace",
    },
  },
};

const buttonTheme = {
  styles: {
    button: {
      color: "white",
      border: "none",
      background: "none",
      appearance: "none",
      opacity: 0.7,
      cursor: "pointer",
      "&:hover": {
        opacity: 1,
      },
    },
  },
};

const copyButtonConfig = {
  text: "",
  icon: "data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A",
  theme: buttonTheme,
};

button.addEventListener("click", () => {
  if (loaded) {
    card.classList.toggle("show");
    if (isShown) {
      button.querySelector(".text").innerText = "Hide Details";
      isShown = false;
    } else {
      button.querySelector(".text").innerText = "Show Details";
      isShown = true;
    }
    return;
  }

  button.querySelector(".text").innerText = "Loading...";

  const request = new Request(ENDPOINT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const evervault = new window.Evervault(
    import.meta.env.VITE_EV_TEAM_UUID as string,
    import.meta.env.VITE_EV_APP_UUID as string
  ) as EvervaultClient;

  const rev = evervault.ui.reveal(request);
  rev
    .text("$.card.number", {
      theme,
      format: {
        regex: /(.{4})/g,
        replace: "$1 ",
      },
    })
    .mount(".back .number .value");

  rev.text("$.card.cvc", { theme }).mount(".back .cvc .value");
  rev
    .copyButton("$.card.number", copyButtonConfig)
    .mount(".copy-number")
    .on("copy", () => {
      console.log("copied number");
    });

  rev
    .copyButton("$.card.cvc", copyButtonConfig)
    .mount(".copy-cvc")
    .on("copy", () => {
      console.log("copied cvc");
    });

  rev.on("ready", () => {
    loaded = true;
    button.querySelector(".text").innerText = "Hide Details";
    card.classList.add("show");
  });

  rev.on("error", () => {
    console.log("Oh no, reveal failed to load");
  });
});
