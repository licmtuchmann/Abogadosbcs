import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Política de seguridad de contenido: solo se permite cargar recursos del propio sitio.
// Se inyecta únicamente en la compilación de producción, porque el servidor de desarrollo
// de Vite necesita scripts en línea para la recarga en caliente.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  'upgrade-insecure-requests',
].join('; ');

const securityMeta = {
  name: 'security-meta',
  apply: 'build',
  transformIndexHtml() {
    return [
      { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head-prepend' },
      { tag: 'meta', attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' }, injectTo: 'head-prepend' },
    ];
  },
};

export default defineConfig({
  plugins: [react(), securityMeta],
});
