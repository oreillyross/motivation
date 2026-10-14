// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { quickAdd } from "./src/integrations/quick-add";

export default defineConfig({
  output: "static",
  integrations: [quickAdd()],
  vite: {
    plugins: [tailwindcss()],
  },
});
