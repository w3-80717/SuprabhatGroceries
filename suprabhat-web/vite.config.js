import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // The key is the path you want to proxy.
      // Any request to '/api' will be forwarded.
      '/api': {
        // The target is your backend server.
        target: 'http://localhost:8000',
        // This is crucial for virtual hosts and ensures
        // the 'Host' header is set correctly.
        changeOrigin: true,
        // Optional: you can rewrite the path if needed,
        // but for our case, we don't need to.
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});