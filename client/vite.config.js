import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ============================================
// ⚙️ VITE CONFIGURATION
// ============================================
export default defineConfig({
  plugins: [react()],

  // ============================================
  // 🌐 DEV SERVER (LOCAL)
  // ============================================
  server: {
    port: 5173,
    open: true,

    // Optional proxy (helps during local dev)
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ============================================
  // 📦 BUILD SETTINGS (PRODUCTION)
  // ============================================
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },

  // ============================================
  // 🔧 RESOLVE SETTINGS
  // ============================================
  resolve: {
    alias: {
      "@": "/src",
    },
  },

  // ============================================
  // 🌍 PREVIEW SETTINGS
  // ============================================
  preview: {
    port: 4173,
    host: true,
  },
});