import { resolve } from 'path';
import { readdirSync } from 'fs';
import { defineConfig } from 'vite';

// Every top-level .html file is a page. GitHub Pages serves the project at
// /faith-forward/; set BASE_PATH=/ when deploying to a custom domain root.
const pages = Object.fromEntries(
  readdirSync(__dirname)
    .filter((f) => f.endsWith('.html'))
    .map((f) => [f.replace('.html', ''), resolve(__dirname, f)]),
);

export default defineConfig({
  base: process.env.BASE_PATH ?? '/faith-forward/',
  build: { rollupOptions: { input: pages } },
});
