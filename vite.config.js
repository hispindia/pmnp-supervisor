import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import manifest from "./manifest.webapp.json";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      manifest,
      filename: "service-worker.js",
      registerType: "prompt",
      // includeAssets: [
      //   "favicon.ico",
      //   "apple-touch-icon.png",
      //   "mask-icon.svg",
      //   "logo.svg",
      // ],
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,svg,json}"],
      },
    }),
  ],
});
