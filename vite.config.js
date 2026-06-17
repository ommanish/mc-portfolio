import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Custom domain deployment for https://manishchawla.com
// Keep base as "/" because the site is served from the domain root.
export default defineConfig({
  plugins: [react()],
  base: "/",
});
