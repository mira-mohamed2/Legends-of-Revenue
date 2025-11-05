#!/usr/bin/env node

/**
 * Simple static file server with correct MIME types for ES modules
 * Used for portable expo builds
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 7766;
const DIST_DIR = path.join(__dirname, 'dist');

// MIME types mapping
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

const server = http.createServer((req, res) => {
  // Remove query parameters and decode URL
  let filePath = decodeURIComponent(req.url.split('?')[0]);
  
  // Default to index.html
  if (filePath === '/' || filePath === '') {
    filePath = '/index.html';
  }
  
  // Build full file path
  const fullPath = path.join(DIST_DIR, filePath);
  
  // Security check - prevent directory traversal
  if (!fullPath.startsWith(DIST_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }
  
  // Check if file exists
  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      // File not found - serve index.html for SPA routing
      const indexPath = path.join(DIST_DIR, 'index.html');
      fs.readFile(indexPath, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 - Not Found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
      return;
    }
    
    // Read and serve the file
    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 - Internal Server Error');
        return;
      }
      
      // Get MIME type
      const ext = path.extname(fullPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log('========================================');
  console.log('  MIRA - Legends of Revenue');
  console.log('  Portable Server Running');
  console.log('========================================');
  console.log('');
  console.log(`  Game URL: http://localhost:${PORT}`);
  console.log('');
  console.log('  Press Ctrl+C to stop the server');
  console.log('');
  console.log('========================================');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`ERROR: Port ${PORT} is already in use.`);
    console.error('Please close the other application or use a different port.');
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
