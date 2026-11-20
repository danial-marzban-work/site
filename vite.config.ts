import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The preview proxy forwards the sandbox host (which rotates per sandbox), so the dev
// server's host allowlist has to accept any subdomain of the current sandbox domain.
const sandboxDomain = process.env.BASE44_SANDBOX_HOST_DOMAIN;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    allowedHosts: sandboxDomain ? [`.${sandboxDomain}`] : true,
    watch: {
      usePolling: process.env.BASE44_PREVIEW_MODE === "1",
    },
  },
});
