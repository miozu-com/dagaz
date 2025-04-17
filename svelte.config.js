import adapter from '@sveltejs/adapter-cloudflare';
import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';
import {mdsvex} from 'mdsvex';
import fs from 'fs';
import path from 'path';

// Function to dynamically get blog post slugs for prerendering
function getBlogPosts() {
  const blogDir = path.join('src', 'lib', 'data', 'blogposts');
  if (!fs.existsSync(blogDir)) return [];

  return fs
    .readdirSync(blogDir)
    .filter(file => file.endsWith('.md'))
    .map(file => `/blog/${path.parse(file).name}`);
}

export default {
  compilerOptions: {
    runes: true
  },
  extensions: ['.svelte', '.md'],
  kit: {
    adapter: adapter({
      routes: {
        include: ['/*'],
        exclude: ['<all>']
      },
      prerender: {
        // Prerender blog index and all posts at build time
        entries: ['/', '/blog', ...getBlogPosts()],
        handleMissingId: 'warn',
        handleEntryGeneratorMismatch: 'warn',
        handleHttpError: ({path, message}) => {
          if (path === '/not-found') return;
          console.error('HTTP Error during prerendering:', message);
        }
      },
      platformProxy: {
        configPath: 'wrangler.toml',
        environment: undefined,
        experimentalJsonConfig: false,
        persist: false
      }
    }),
    prerender: {
      handleHttpError: 'warn',
      handleMissingId: 'warn'
    },
    alias: {
      $lib: 'src/lib',
      $components: 'src/lib/components',
      $features: 'src/lib/features',
      $data: 'src/lib/data',
      $utils: 'src/lib/utils',
      $stores: 'src/lib/stores',
      $constants: 'src/lib/constants'
    }
  },
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.md'],
      smartypants: true,
      rehypePlugins: []
    })
  ]
};
