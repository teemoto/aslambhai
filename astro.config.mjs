import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import AstroPWA from "@vite-pwa/astro";

export default defineConfig({
  site: "https://tanviraslam.com",
  output: "static",
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !["/about/terminal/", "/offline/"].includes(new URL(page).pathname),
    }),
    AstroPWA({
      manifest: false,
      registerType: "autoUpdate",
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: undefined,
        globPatterns: [
          "index.html",
          "about/index.html",
          "projects/index.html",
          "offline/index.html",
          "_astro/**/*.{css,js}",
          "scripts/**/*.js",
          "brand/aslam-bhai-mark.png",
          "apple-touch-icon.png",
          "icon-192.png",
          "icon-512.png",
          "manifest.webmanifest",
        ],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "aslam-pages",
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 30 },
              precacheFallback: { fallbackURL: "/offline/index.html" },
            },
          },
          {
            urlPattern: ({ request, url }) => request.destination === "image" && url.origin === self.location.origin,
            handler: "CacheFirst",
            options: {
              cacheName: "aslam-images",
              expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      experimental: {
        directoryAndTrailingSlashHandler: true,
      },
    }),
  ],
  vite: {
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
    },
  },
});
