import { defineConfig } from 'astro/config';
import sass from 'sass';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://rus-news.online',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  markdown: {
    // Настройки для Markdown по умолчанию
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          implementation: sass,
        }
      }
    }
  }
});