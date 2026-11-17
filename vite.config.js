import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api/proxy/aihorde': { target: 'https://oai.aihorde.net', changeOrigin: true, rewrite: p => p.replace(/^\/api\/proxy\/aihorde/, '') },
      '/api/proxy/pollinations': { target: 'https://text.pollinations.ai', changeOrigin: true, rewrite: p => p.replace(/^\/api\/proxy\/pollinations/, '') },
      '/api/proxy/llm7': { target: 'https://api.llm7.io', changeOrigin: true, rewrite: p => p.replace(/^\/api\/proxy\/llm7/, '') },
      '/api/proxy/ollama': { target: 'http://localhost:11434', changeOrigin: true, rewrite: p => p.replace(/^\/api\/proxy\/ollama/, '') },
      '/api/web': { target: 'http://localhost:8787', changeOrigin: true }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: { main: './index.html' }
    }
  },
  preview: { host: '0.0.0.0', port: 4173 }
});
