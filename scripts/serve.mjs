import { resolve, extname, sep } from 'node:path';
const directory = resolve(import.meta.dir, '..', process.argv.includes('--dist') ? 'dist' : 'public');
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'application/javascript; charset=utf-8', '.svg':'image/svg+xml', '.txt':'text/plain; charset=utf-8' };
const server = Bun.serve({
  hostname:'127.0.0.1', port:Number(process.env.PORT || 4321),
  async fetch(request) {
    const url = new URL(request.url);
    let path;
    try { path = resolve(directory, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)); }
    catch { return new Response('Bad request', { status:400 }); }
    if (!path.startsWith(directory + sep)) return new Response('Forbidden', { status:403 });
    const file = Bun.file(path);
    if (!await file.exists()) return new Response(Bun.file(resolve(directory, '404.html')), { status:404, headers:{'content-type':'text/html; charset=utf-8'} });
    return new Response(file, { headers:{'content-type':types[extname(path)] || 'application/octet-stream'} });
  }
});
console.log(`Local: http://${server.hostname}:${server.port}`);
