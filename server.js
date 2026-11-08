// Functional AAC Server with SQLite Database Backend
// Serves static web assets and provides real-time REST API for SQLite database
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Helper to parse JSON body from request
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// Helper to send JSON response
function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // ==================== REST API ROUTES (SQLite) ====================

  if (pathname.startsWith('/api/')) {
    try {
      // 1. Database Health & Status
      if (pathname === '/api/status' && req.method === 'GET') {
        const phrases = db.getAllPhrases();
        const paired = db.getPairedDevice();
        return sendJson(res, 200, {
          status: 'connected',
          database: 'SQLite',
          databaseFile: 'aac_database.sqlite',
          phraseCount: phrases.length,
          device: paired
        });
      }

      // 2. GET all phrases
      if (pathname === '/api/phrases' && req.method === 'GET') {
        const phrases = db.getAllPhrases();
        return sendJson(res, 200, phrases);
      }

      // 3. POST new custom phrase
      if (pathname === '/api/phrases' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        if (!body.text || !body.category) {
          return sendJson(res, 400, { error: 'Text and category are required' });
        }
        const created = db.addCustomPhrase(body);
        return sendJson(res, 201, created);
      }

      // 4. PUT update phrase
      if (pathname.startsWith('/api/phrases/') && req.method === 'PUT') {
        const id = decodeURIComponent(pathname.replace('/api/phrases/', ''));
        const body = await parseJsonBody(req);
        const updated = db.updatePhrase(id, body);
        if (!updated) {
          return sendJson(res, 404, { error: 'Phrase not found' });
        }
        return sendJson(res, 200, updated);
      }

      // 5. DELETE phrase
      if (pathname.startsWith('/api/phrases/') && req.method === 'DELETE') {
        const id = decodeURIComponent(pathname.replace('/api/phrases/', ''));
        const deleted = db.deletePhrase(id);
        return sendJson(res, 200, { success: deleted });
      }

      // 6. POST toggle phrase enabled/disabled
      if (pathname === '/api/phrases/toggle' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const toggled = db.togglePhrase(body.id);
        if (!toggled) {
          return sendJson(res, 404, { error: 'Phrase not found' });
        }
        return sendJson(res, 200, toggled);
      }

      // 7. POST category batch toggle
      if (pathname === '/api/phrases/category-toggle' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        db.setCategoryAll(body.category, Boolean(body.enabled));
        return sendJson(res, 200, { success: true, category: body.category, enabled: body.enabled });
      }

      // 8. POST move phrase category
      if (pathname === '/api/phrases/move' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        db.movePhraseCategory(body.id, body.category);
        return sendJson(res, 200, { success: true });
      }

      // 9. GET / POST paired device
      if (pathname === '/api/device' && req.method === 'GET') {
        const dev = db.getPairedDevice();
        const sync = db.getLatestSync();
        return sendJson(res, 200, { device: dev, sync });
      }

      if (pathname === '/api/device' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const saved = db.savePairedDevice(body);
        return sendJson(res, 200, saved);
      }

      // 10. POST sync transaction
      if (pathname === '/api/sync' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const syncRecord = db.recordSync(body);
        return sendJson(res, 200, {
          success: true,
          sync: syncRecord,
          message: 'Changes committed to SQLite database successfully'
        });
      }

      // 11. POST reset to factory defaults
      if (pathname === '/api/reset' && req.method === 'POST') {
        db.resetAllToDefaults();
        return sendJson(res, 200, { success: true, message: 'SQLite database reset to factory defaults' });
      }

      return sendJson(res, 404, { error: 'API route not found' });
    } catch (err) {
      console.error('API Error:', err);
      return sendJson(res, 500, { error: err.message || 'Internal Server Error' });
    }
  }

  // ==================== STATIC FILE SERVING ====================

  let reqPath = decodeURI(pathname);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(__dirname, reqPath);

  // Security check
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + reqPath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Functional AAC server running at http://0.0.0.0:${PORT}/`);
  console.log(`SQLite database connected: aac_database.sqlite`);
});
