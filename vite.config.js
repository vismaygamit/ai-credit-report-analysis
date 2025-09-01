import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "vite-plugin-sitemap";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: "https://ai-credit-report-analysis.vercel.app", // replace with your domain
      routes: ["/", "/privacypolicy"],
    }),
    tailwindcss(),
  ],
});
