import { defineConfig } from 'astro/config';
import sass from 'sass';

export default defineConfig({
  site: 'https://rus-news.online',
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