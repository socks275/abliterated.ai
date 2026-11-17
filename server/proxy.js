import http from 'http';
import https from 'https';
const PORT = 8787;
const TARGETS = {
  '/api/proxy/aihorde': 'https://oai.aihorde.net',
  '/api/proxy/pollinations': 'https://text.pollinations.ai',
  '/api/proxy/llm7': 'https://api.llm7.io',
  '/api/proxy/ollama': 'http://localhost:11434',
  '/api/proxy/hf': 'https://huggingface.co',
  '/api/proxy/cdn': 'https://cdn.jsdelivr.net',
};

const srv = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.writeHead(204).end();
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let targetBase = null;
  for (const [prefix, tgt] of Object.entries(TARGETS)) if (url.pathname.startsWith(prefix)) { targetBase = tgt; break; }
  if (url.pathname === '/api/health') {
    res.writeHead(200, {'Content-Type':'application/json', 'Access-Control-Allow-Origin':'*'});
    return res.end(JSON.stringify({ proxy: true, uptime: process.uptime() }));
  }
  if (!targetBase) {
    res.writeHead(404, {'Content-Type':'application/json'});
    return res.end(JSON.stringify({ error: 'unknown proxy target', path: url.pathname }));
  }
  const targetUrl = targetBase + url.pathname.replace(/^\/api\/proxy\/[^/]+/, '') + url.search;
  const lib = targetUrl.startsWith('https:') ? https : http;
  const proxyReq = lib.request(targetUrl, { method: req.method, headers: { ...req.headers, host: new URL(targetBase).host } }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  proxyReq.on('error', e=> { res.writeHead(502, {'Content-Type':'application/json'}); res.end(JSON.stringify({error: e.message})); });
  req.pipe(proxyReq);
});
srv.listen(PORT, '0.0.0.0', ()=> console.log(`[proxy] http://localhost:${PORT} → CORS proxy ready`));
