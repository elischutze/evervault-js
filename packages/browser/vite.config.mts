import { resolve } from "node:path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["**/test/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
  build: {
    sourcemap: "inline",
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "lib/main.ts"),
      name: "Evervault",
      // the proper extensions will be added
      fileName: "evervault-browser.main",
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});
