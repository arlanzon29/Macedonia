// Servidor HTTPS local para probar Macedonia en el Quest por wifi (WebXR exige HTTPS).
// Sirve la carpeta del proyecto en solo lectura y sin caché. Uso: node servidor/servidor.js [puerto]
// La primera vez crea un certificado casero (cert.pem / key.pem, fuera de git) con las IP del PC.
// Si cambia la IP, borra los .pem y vuelve a arrancar.
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const RAIZ = path.resolve(__dirname, '..');
const PUERTO = Number(process.argv[2] || 8443);
const CERT = path.join(__dirname, 'cert.pem');
const CLAVE = path.join(__dirname, 'key.pem');

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream',
  '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.mp4': 'video/mp4',
  '.wasm': 'application/wasm', '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8',
};

function ipsLocales() {
  const ips = [];
  for (const lista of Object.values(os.networkInterfaces()))
    for (const i of lista) if (i.family === 'IPv4' && !i.internal) ips.push(i.address);
  return ips;
}

function crearCertificado() {
  const git = 'C:\\Program Files\\Git\\mingw64\\bin\\openssl.exe';
  const openssl = fs.existsSync(git) ? git : 'openssl';
  const nombres = ['DNS:localhost', 'IP:127.0.0.1', ...ipsLocales().map(ip => 'IP:' + ip)].join(',');
  console.log('Creando certificado para', nombres);
  execFileSync(openssl, ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', CLAVE, '-out', CERT,
    '-days', '825', '-subj', '/CN=macedonia-local', '-addext', 'subjectAltName=' + nombres], { stdio: 'ignore' });
}

if (!fs.existsSync(CERT) || !fs.existsSync(CLAVE)) crearCertificado();

https.createServer({ key: fs.readFileSync(CLAVE), cert: fs.readFileSync(CERT) }, (req, res) => {
  let ruta;
  try { ruta = decodeURIComponent(new URL(req.url, 'https://x').pathname); }
  catch { res.writeHead(400); return res.end(); }
  let archivo = path.join(RAIZ, ruta);
  // Nada fuera del proyecto, ni .git, ni esta carpeta (tiene la clave privada).
  const primera = path.relative(RAIZ, archivo).split(path.sep)[0].toLowerCase();
  if (archivo !== RAIZ && (!archivo.startsWith(RAIZ + path.sep) || primera === '.git' || primera === 'servidor')) {
    res.writeHead(403); return res.end('Prohibido');
  }
  fs.stat(archivo, (err, st) => {
    if (!err && st.isDirectory()) archivo = path.join(archivo, 'index.html');
    fs.readFile(archivo, (err2, datos) => {
      if (err2) { res.writeHead(404); return res.end('No encontrado'); }
      res.writeHead(200, {
        'Content-Type': TIPOS[path.extname(archivo).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      res.end(datos);
    });
  });
  console.log(new Date().toLocaleTimeString(), req.method, ruta);
}).listen(PUERTO, '0.0.0.0', () => {
  console.log('Sirviendo', RAIZ);
  for (const ip of ipsLocales()) console.log(`  https://${ip}:${PUERTO}/`);
});
