import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// This is the standard ES Module way to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 1. Development Server Configuration
  server: {
    // Configure the proxy for API requests
    proxy: {
      // Any request starting with /api will be forwarded
      '/api': {
        // Your backend server running on port 8000
        target: 'http://localhost:8000',
        
        // Needed for virtual-hosted sites and to avoid CORS issues
        changeOrigin: true,
        
        // You can uncomment this if you need to remove the /api prefix
        // before the request is sent to your backend. We don't need it
        // for our current backend setup.
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  // 2. Path Alias Configuration
  resolve: {
    alias: {
      // This allows you to use `import Something from '@/components/Something'`
      // instead of complex relative paths like `../../components/Something`
      '@': path.resolve(__dirname, './src'),
    },
  },
});