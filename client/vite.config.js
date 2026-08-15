import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

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

appType: "mpa",
  plugins: [notFoundFallback(), react(), tailwindcss()],
  build: {
    target: "es2022",
    cssCodeSplit: true,

assetsInlineLimit: 2048,
    rollupOptions: {

input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        notFound: fileURLToPath(new URL("./404.html", import.meta.url)),
      },
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("gsap") || id.includes("lenis")) return "motion-core";
          if (id.includes("react")) return "react-vendor";
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
});
