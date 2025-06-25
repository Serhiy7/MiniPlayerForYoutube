// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      // чтобы можно было писать "@/styles/variables"
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // автоматически подключаем переменные в каждый .scss
        additionalData: `@use "@/styles/variables.scss" as *;`,
      },
    },
  },
});
