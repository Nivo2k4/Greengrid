
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
    devSourcemap: true,
  },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  build: {
    target: 'esnext',
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-scroll-area'
          ],
          'chart-vendor': ['recharts'],
          'form-vendor': ['react-hook-form'],
          'icons-vendor': ['lucide-react'],
          // Page chunks
          'dashboard': ['./src/components/DashboardPage.tsx'],
          'auth': ['./src/components/LoginPage.tsx', './src/components/RegisterPage.tsx'],
          'pages': [
            './src/components/TrackingPage.tsx',
            './src/components/EmergencyReportPage.tsx',
            './src/components/CommunityHubPage.tsx',
            './src/components/ContactPage.tsx'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    },
    sourcemap: false,
    reportCompressedSize: false
  },
  server: {
    port: 3000,
    open: true,
  },
});