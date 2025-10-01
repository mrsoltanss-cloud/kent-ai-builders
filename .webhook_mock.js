const http = require('http'), fs = require('fs');
const PORT = process.env.PORT || 4009;
const LOG = '.webhook_hits.jsonl';
const server = http.createServer((req, res) => {
  if (req.method !== 'POST') { res.writeHead(405); return res.end('Only POST'); }
  let body=''; req.on('data', c => body += c);
  req.on('end', () => {
    try {
      const entry = { t: new Date().toISOString(), url: req.url, headers: req.headers, json: JSON.parse(body||'{}') };
      fs.appendFileSync(LOG, JSON.stringify(entry) + "\n");
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch(e) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, note: 'non-json body accepted'}));
    }
  });
});
server.listen(PORT, () => console.log('webhook-mock: listening on', PORT));
