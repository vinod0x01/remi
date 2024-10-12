import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    preview: {
        port: 3000,
        strictPort: true,
        host: "0.0.0.0",
    },
    server: {
        proxy: {
            "/api": {
                target: process.env.API_BASE_URL ?? "http://localhost:8001",
                changeOrigin: true,
                // rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
