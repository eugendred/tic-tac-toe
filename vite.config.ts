import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import vitePluginSvgr from 'vite-plugin-svgr';

export default defineConfig({
  server: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      }
    }
  },
  plugins: [react(), vitePluginSvgr()],
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
    ],
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@emotion')) return 'emotion';
          if (id.includes('@mui')) return 'mui';
        },
      },
    },
  },
});
