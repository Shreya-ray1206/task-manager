/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,              // allows test(), expect(), describe() without imports
    environment: "jsdom",       // simulates browser for React Testing Library
    setupFiles: "./src/tests/setup.js", // loads jest-dom matchers
  },
});
