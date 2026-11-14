import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

function copyStaticAssetsPlugin() {
  return {
    name: 'copy-static-assets-to-dist',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) return;

      const copyDir = (srcName: string) => {
        const src = path.resolve(__dirname, srcName);
        const dest = path.resolve(distDir, srcName);
        if (fs.existsSync(src)) {
          fs.cpSync(src, dest, { recursive: true });
        }
      };

      const copyFile = (fileName: string) => {
        const src = path.resolve(__dirname, fileName);
        const dest = path.resolve(distDir, fileName);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
        }
      };

      copyDir('images');
      copyFile('404.html');
      copyFile('robots.txt');
      copyFile('sitemap.xml');
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [copyStaticAssetsPlugin()],
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
