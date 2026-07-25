/* ============================================================
   M.E.T.A.S · Servidor estático mínimo
   ------------------------------------------------------------
   Solo para revisar en el navegador; el sitio real es estático.
   Hace falta porque las misiones cargan sus JS con rutas
   absolutas y file:// no sirve para medir nada.

   Uso:  node _dev/servidor-estatico.js   → http://localhost:8123
   ============================================================ */
const http = require('http');
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon'
};

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/index.html';
  const f = path.join(RAIZ, rel);
  if (!f.startsWith(path.resolve(RAIZ))) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (e, data) => {
    if (e) { res.writeHead(404); return res.end('no está: ' + rel); }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(8123, () => console.log('sirviendo en http://localhost:8123'));
