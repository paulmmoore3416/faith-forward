import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        resources: resolve(__dirname, 'resources.html'),
        contact: resolve(__dirname, 'contact.html'),
        events: resolve(__dirname, 'events.html'),
        error: resolve(__dirname, '404.html'),
      },
    },
  },
});
