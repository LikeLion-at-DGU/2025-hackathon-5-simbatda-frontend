import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
  build: {
    // 빌드 캐시 무효화
    rollupOptions: {
      output: {
        // 파일명에 해시 추가로 캐시 무효화
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    // 소스맵 생성 (디버깅용)
    sourcemap: false,
    // 청크 크기 경고 임계값
    chunkSizeWarningLimit: 1000,
  },
  // 환경 변수 처리
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
