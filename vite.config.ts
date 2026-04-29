import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom plugin to log requests
function logRequests() {
  return {
    name: 'log-requests',
    configureServer(server: { middlewares: { use: (arg0: (req: any, res: any, next: any) => void) => void; }; }) {
      server.middlewares.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
      });
    },
  }
}

export default defineConfig({
  plugins: [react(), logRequests()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})