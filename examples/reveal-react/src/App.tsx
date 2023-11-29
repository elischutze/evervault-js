import { EvervaultProvider, Reveal } from "@evervault/react";
import { motion } from "framer-motion";
import { useState } from "react";

// This example expects your test reveal endpoint to return a JSON payload with the following shape:
// {
//  "card": {
//    "number": "4242424242424242",
//    "cvc": "123"
//   }
// }

function App() {
  const [loading, setLoading] = useState(true);
  const request = new Request(import.meta.env.VITE_REVEAL_ENDPOINT as string);

  const handleReady = () => {
    setLoading(false);
  };

  const animation = {
    scale: loading ? 0.5 : 1,
    opacity: loading ? 0 : 1,
    y: loading ? 20 : 0,
  };

  const handleCopy = () => {
    console.log("Copied!");
  };

  return (
    <EvervaultProvider
      teamId={import.meta.env.VITE_EV_TEAM_UUID as string}
      appId={import.meta.env.VITE_EV_APP_UUID as string}
    >
      <motion.div
        className="container"
        initial={animation}
        animate={animation}
        transition={{ duration: 0.5 }}
      >
        <Reveal request={request} onReady={handleReady}>
          <Reveal.Text path="$.card.number" />
          <Reveal.CopyButton path="$.card.number" onCopy={handleCopy} />
        </Reveal>
      </motion.div>
    </EvervaultProvider>
  );
}

export default App;
