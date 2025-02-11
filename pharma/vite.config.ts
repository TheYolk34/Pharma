import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import fs from 'fs';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// Путь к вашему manifest.json
const manifestPath = path.resolve(__dirname, 'public/manifest.json');

// Проверяем, существует ли файл manifest.json
if (!fs.existsSync(manifestPath)) {
  console.error('Manifest file not found at:', manifestPath);
  process.exit(1);
}

// Чтение manifest.json
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    host: true,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
    proxy: {
      '/api': {
        target: 'http://192.168.31.169:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/'),
      },
    },
  },
  base: "/Pharma",
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: manifest, // Используем manifest.json из вашего проекта
    }),
  ],
});