"use client";

import { UI } from "@evervault/react";

export function ClientComponent() {
  const handleChange = (data) => {
    console.log("change", data);
  };

  return (
    <div>
      <h2>This is a client component</h2>
      <UI.CardDetails onChange={handleChange} />
    </div>
  );
}
