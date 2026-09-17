const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = 3000;

const orders = [
  { id: 'NW-1042', customer: 'Amina', status: 'Processing' },
  { id: 'NW-1043', customer: 'Jordan', status: 'Packed' },
  { id: 'NW-1044', customer: 'Mei', status: 'Shipped' },
];

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(payload));
}

const server = http.createServer((request, response) => {
  console.log(`[request] ${request.method} ${request.url}`);

  if (request.method === 'GET' && request.url === '/api/orders?simulateError=true') {
    console.error('[incident] Simulated upstream database timeout');
    sendJson(response, 500, { error: 'Unable to load orders' });
    return;
  }

  if (request.method === 'GET' && request.url === '/api/orders') {
    sendJson(response, 200, { orders });
    return;
  }

  if (request.url.startsWith('/api/')) {
    sendJson(response, 404, { error: 'Route not found' });
    return;
  }

  if (request.method === 'GET' && (request.url === '/' || request.url === '/index.html')) {
    const pagePath = path.join(__dirname, 'public', 'index.html');

    fs.readFile(pagePath, 'utf8', (error, html) => {
      if (error) {
        console.error('[incident] Unable to read the dashboard file:', error.message);
        sendJson(response, 500, { error: 'Unable to load the application' });
        return;
      }

      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(html);
    });
    return;
  }

  sendJson(response, 404, { error: 'Page not found' });
});

server.listen(PORT, () => {
  console.log(`Incident lab running at http://localhost:${PORT}`);
});