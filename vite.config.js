import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import manifest from "./manifest.webapp.json";
import react from "@vitejs/plugin-react";
import assetManifest from "rollup-plugin-output-manifest";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      manifest,
      srcDir: ".",
      filename: "service-worker.js",
      strategies: "injectManifest",
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,svg,json}"],
      },
    }),
  ],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      plugins: [assetManifest()],
    },
  },
});
