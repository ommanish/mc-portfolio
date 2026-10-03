import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function standaloneMotionLibraryRoute() {
  const rewrite = (req, _res, next) => {
    if (req.url === "/motion-library/" || req.url === "/motion-library") {
      req.url = "/motion-library/index.html";
    }
    next();
  };

  return {
    name: "standalone-motion-library-route",
    configureServer(server) {
      server.middlewares.use(rewrite);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
  };
}

// Custom domain deployment for https://manishchawla.com
// Keep base as "/" because the site is served from the domain root.
export default defineConfig({
  plugins: [standaloneMotionLibraryRoute(), react()],
  base: "/",
});
