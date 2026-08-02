import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2022",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("three") || id.includes("@react-three"))
            return "three";
          if (id.includes("gsap") || id.includes("lenis")) return "motion-core";
          if (id.includes("framer-motion") || id.includes("motion-dom"))
            return "framer";
          if (id.includes("react")) return "react-vendor";
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
});
