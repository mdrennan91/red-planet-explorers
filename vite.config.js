import { resolve } from "path";
import { defineConfig } from "vite";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        rovers: resolve(__dirname, "src/image-search/index.html"),
        gallery: resolve(__dirname, "src/image-gallery/index.html"),
        favorites: resolve(__dirname, "src/favorites-gallery/index.html"),
        photo: resolve(__dirname, "src/single-photo/index.html"),
      },
    },
  },
});