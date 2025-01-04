import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  worker: {
    format: "es", // Vite uses native worker format
  },
  define: {
    "process.env": {}, // If needed, define process environment variables
  },
  resolve: {
    alias: {
      // You can add aliases for packages that need resolving
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis", // Define global variables for compatibility
      },
    },
  },
});
