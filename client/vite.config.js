import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Inlines `public/favicon.svg` into the threshold markup in index.html.
 *
 * The threshold has to paint before any JavaScript runs, so its sigil cannot
 * come from a component, and it cannot be an <img> either: that is a second
 * request and a blank hole in the middle of the gate until it lands. Injecting
 * it here keeps the mark to one source file rather than a copy pasted into the
 * HTML that quietly drifts out of step with the favicon.
 */
function inlineSigil() {
  const source = fileURLToPath(new URL("./public/favicon.svg", import.meta.url));

  return {
    name: "inline-sigil",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        const svg = readFileSync(source, "utf8")
          .replace(/<\?xml[\s\S]*?\?>/, "")
          .replace(/<title>[\s\S]*?<\/title>/, "")
          .replace(/<!--[\s\S]*?-->/g, "")
          .replace(/<svg /, '<svg class="th-sigil" ')
          .trim();

        return html.replace("<!--SIGIL-->", svg);
      },
    },
  };
}

export default defineConfig({
  plugins: [inlineSigil(), react(), tailwindcss()],
  build: {
    target: "es2022",
    cssCodeSplit: true,
    // The threshold covers the whole of the first paint, so a slightly larger
    // initial payload costs nothing anyone can see, while an extra round trip
    // for a 2 kB asset is real latency on a phone.
    assetsInlineLimit: 2048,
    rollupOptions: {
      // 404.html is a second entry rather than a file in public/, so it goes
      // through the same pipeline and gets the sigil injected. It pulls in no
      // script of its own: the one page guaranteed to be served when something
      // has already gone wrong should not depend on a bundle to render.
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        notFound: fileURLToPath(new URL("./404.html", import.meta.url)),
      },
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
