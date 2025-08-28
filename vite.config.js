import { defineConfig, splitVendorChunkPlugin } from "vite";
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
    splitVendorChunkPlugin(),
    VitePWA({
      manifest,
      srcDir: ".",
      filename: "service-worker.js",
      strategies: "injectManifest",
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,svg,json}"],
      },
      injectManifest: {
        maximumFileSizeToCacheInBytes: 6900000,
      },
    }),
  ],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.js"],
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
    exclude: ["node_modules", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/setupTests.js", "**/*.d.ts", "**/*.config.js", "**/*.config.ts"],
    },
  },

  // build: {
  //   sourcemap: true,
  //   rollupOptions: {
  //     plugins: [assetManifest()],
  //   },
  // },
});
