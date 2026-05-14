import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        resources: resolve(__dirname, 'resources.html'),
        contact: resolve(__dirname, 'contact.html'),
        events: resolve(__dirname, 'events.html'),
        recovery: resolve(__dirname, 'recovery-manual.html'),
        error: resolve(__dirname, '404.html'),
      },
    },
  },
});
