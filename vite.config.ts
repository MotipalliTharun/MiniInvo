import { defineConfig } from "vite";

export default defineConfig({
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: { sourcemap: false, target: "es2020" }
});
