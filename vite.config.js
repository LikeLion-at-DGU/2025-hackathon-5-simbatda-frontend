import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  server: {
    proxy: {
      "/accounts": {
        target: "https://yeonhee.shop",
        changeOrigin: true,
        secure: false,
      },
      "/categories": {
        target: "https://yeonhee.shop",
        changeOrigin: true,
        secure: false,
      },
      "/products": {
        target: "https://yeonhee.shop",
        changeOrigin: true,
        secure: false,
      },
      "/reservations": {
        target: "https://yeonhee.shop",
        changeOrigin: true,
        secure: false,
      },
      "/stores": {
        target: "https://yeonhee.shop",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),

    __ROUTER_FUTURE_FLAGS__: JSON.stringify({
      v7_startTransition: true,
    }),
  },
});
