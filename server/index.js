const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const ISR_INTERVAL = 30 * 1000;

let cachedTimestamp = null;
let lastFetchedTime = 0;

const generateTimestamp = () => {
  return new Date().toISOString();
};

const getTimestamp = () => {
  const now = Date.now();

  if (!cachedTimestamp || now - lastFetchedTime > ISR_INTERVAL) {
    cachedTimestamp = generateTimestamp();
    lastFetchedTime = now;
    fs.writeFileSync(path.join(__dirname, 'timestamp.json'), JSON.stringify({ timestamp: cachedTimestamp }));
  } else {
    const data = fs.readFileSync(path.join(__dirname, 'timestamp.json'));
    cachedTimestamp = JSON.parse(data).timestamp;
  }

  return cachedTimestamp;
};

const requestListener = (req, res) => {
  console.log(`Request received: ${req.url}`);

  if (req.url === '/api/timestamp' && req.method === 'GET') {
    const timestamp = getTimestamp();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ timestamp }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
};

const server = http.createServer(requestListener);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
