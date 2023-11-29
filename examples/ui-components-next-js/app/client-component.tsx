"use client";

import { CardDetails } from "@evervault/react";

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
      <CardDetails onChange={handleChange} onReady={handleReady} />
    </div>
  );
}
