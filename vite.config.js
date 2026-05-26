import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@store": path.resolve(__dirname, "./src/store"),
    },
  },
  server: {
    port: 5000,
    open: true,
    proxy: {
      "/auth": {
        target: "http://p69ewng0uhoyo2jaeq93jpjb.82.29.164.173.sslip.io",
        changeOrigin: true,
        secure: false,
      },
      "/user": {
        target: "http://p69ewng0uhoyo2jaeq93jpjb.82.29.164.173.sslip.io",
        changeOrigin: true,
        secure: false,
      },
      "/admin": {
        target: "http://p69ewng0uhoyo2jaeq93jpjb.82.29.164.173.sslip.io",
        changeOrigin: true,
        secure: false,
      },
      "/upload": {
        target: "http://p69ewng0uhoyo2jaeq93jpjb.82.29.164.173.sslip.io",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

