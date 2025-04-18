import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: [
      // Add any dependencies that might be causing issues
      "@radix-ui/react-slot",
      "@radix-ui/react-dialog",
      // Add other problematic dependencies here
    ]
  }
})
