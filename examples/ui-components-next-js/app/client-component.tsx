"use client";

import { CardDetails, themes } from "@evervault/react";
const theme = themes.clean();

export function ClientComponent() {
  const handleChange = (data) => {
    console.log("change", data);
  };

  const handleReady = () => {
    console.log("ready");
  };

  return (
    <div>
      <h2>This is a client component</h2>
      <CardDetails
        theme={theme}
        onChange={handleChange}
        onReady={handleReady}
      />
    </div>
  );
}
