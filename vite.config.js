import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  appType: "mpa",
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        projects: resolve(__dirname, "projects.html"),
        privacy: resolve(__dirname, "privacy.html"),
        terms: resolve(__dirname, "terms.html"),
        notfound: resolve(__dirname, "404.html"),
      },
    },
  },
});
