import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    port: 8080, // or your preferred port
    strictPort: true,
    allowedHosts: [
      "artshare-client-g7cef7eub0evf3fj.switzerlandnorth-01.azurewebsites.net",
      "localhost",
    ],
  },
});
