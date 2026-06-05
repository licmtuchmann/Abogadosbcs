import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Base path for GitHub Pages — overridable via env (e.g. VITE_BASE=/Abogadosbcs/)
const base = process.env.VITE_BASE || './';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json,webmanifest}'],
        // Lazy-load: don't precache per-compendio detail files. They are
        // fetched on demand by CompendioDetail.jsx and cached at runtime
        // via the StaleWhileRevalidate handler below.
        globIgnores: ['**/data/compendios/*.json'],
        maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.endsWith('.json'),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'data-json' },
          },
        ],
      },
      manifest: {
        name: 'Buscador Penal MX',
        short_name: 'Penal MX',
        description: 'CNPP + jurisprudencia SCJN/CIDH para litigio penal',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'any',
        scope: './',
        start_url: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
});
