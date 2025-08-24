import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // ensures source maps for prod builds
  },
  server: {
    sourcemapIgnoreList: () => false, // prevents Vite from ignoring TSX/JSX
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
