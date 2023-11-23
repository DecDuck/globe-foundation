import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    baseURL: "/globe-foundation/",
  },
  modules: ["@nuxtjs/tailwindcss"],
  vite: {
    plugins: [nodePolyfills()],
  },
  ssr: false,
});
