import "./style.css";

const evervault = new window.Evervault(
  import.meta.env.VITE_EV_TEAM_UUID,
  import.meta.env.VITE_EV_APP_UUID,
  {
    urls: {
      keysUrl: import.meta.env.VITE_KEYS_URL as string,
      apiUrl: import.meta.env.VITE_API_URL as string,
      componentsUrl: import.meta.env.VITE_UI_COMPONENTS_URL as string,
    },
  }
);

evervault.hubspotFormProtection();