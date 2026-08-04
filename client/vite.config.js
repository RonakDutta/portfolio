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

/**
 * Serves 404.html for unknown paths in `dev` and `preview`.
 *
 * A static host does this on its own, which is what the page is written for.
 * Neither Vite server does: the dev server answers an unmatched path with its
 * own plain-text 404 and preview answers with the connect default, so the one
 * page that exists to be seen when someone mistypes a URL was the one page you
 * could not look at without deploying it.
 *
 * Only whole-document navigations are caught. Anything that accepts HTML but
 * is really a missing module or image should keep failing as a missing module
 * or image, or a typo'd import silently returns a page of markup and surfaces
 * as an unrelated parse error somewhere else entirely.
 */
function notFoundFallback() {
  const page = fileURLToPath(new URL("./404.html", import.meta.url));

  const middleware = (transform) => async (req, res, next) => {
    const accepts = req.headers.accept ?? "";
    if (req.method !== "GET" || !accepts.includes("text/html")) return next();

    const path = (req.url ?? "/").split("?")[0];
    if (path === "/" || path.endsWith(".html") || path.startsWith("/@")) {
      return next();
    }

    try {
      let html = readFileSync(page, "utf8");
      if (transform) html = await transform(html, req.url);
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html");
      res.end(html);
    } catch {
      next();
    }
  };

  return {
    name: "not-found-fallback",
    // Appended, so real files and modules are resolved first and only genuine
    // misses reach this.
    configureServer(server) {
      return () =>
        server.middlewares.use(
          middleware((html, url) => server.transformIndexHtml(url, html)),
        );
    },
    configurePreviewServer(server) {
      return () => server.middlewares.use(middleware(null));
    },
  };
}

export default defineConfig({
  // Multi-page, not single-page. There is no client-side router here: there is
  // index.html and there is 404.html. Left on the "spa" default, both Vite
  // servers rewrite every unknown path to index.html, so a mistyped URL
  // silently served the portfolio with a 200 and the 404 page was unreachable.
  appType: "mpa",
  plugins: [inlineSigil(), notFoundFallback(), react(), tailwindcss()],
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
