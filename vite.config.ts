import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Additional production optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_debugger: true,
        passes: 2,
      },
      mangle: {
        safari10: true,
        properties: {
          regex: /^_/,  // Mangle properties starting with underscore
        },
      },
      format: {
        comments: false,  // Remove all comments
      },
    },
    rollupOptions: {
      output: {
        // Randomize chunk names
        chunkFileNames: 'assets/[hash].js',
        entryFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
      },
    },
  },
}));
