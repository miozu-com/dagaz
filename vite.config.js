import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';
import viteCompression from 'vite-plugin-compression';
import {enhancedImages} from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      $components: path.resolve('./src/lib/components/'),
      $features: path.resolve('./src/lib/features/'),
      $data: path.resolve('./src/lib/data/'),
      $utils: path.resolve('./src/lib/utils'),
      $settings: path.resolve('./src/lib/settings'),
      $styles: path.resolve('./src/lib/styles')
    }
  },
  plugins: [
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false,
      threshold: 1024
    }),

    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024
    }),

    enhancedImages({
      formats: ['webp', 'avif'],
      sizes: [320, 640, 1280, 1920],
      defaultFormat: 'webp',
      optimize: true
    }),

    sveltekit(),
    tailwindcss()
  ],
  build: {
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        // TODO Implement more efficient chunking for better caching
        manualChunks: {
          vendor: ['svelte', 'svelte/internal']
        }
      }
    },
    sourcemap: true
  },
  server: {
    cors: true,
    strictPort: true
  }
});
