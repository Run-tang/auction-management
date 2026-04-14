import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// GitHub Pages 部署路径，本地开发使用 '/'
const base = process.env.GITHUB_PAGES ? '/auction-management/admin/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
