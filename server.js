import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COOKIE_FILE = path.join(__dirname, 'cookies.txt');

const app = express();
const server = http.createServer(app);
app.use(express.static(__dirname));

const wss = new WebSocketServer({ server });
const clients = new Set();

let cookies = 0;


if (fs.existsSync(COOKIE_FILE)) {
  const data = fs.readFileSync(COOKIE_FILE, 'utf-8');
  cookies = parseInt(data, 10) || 0;
  console.log(`Loaded ${cookies} cookies from cookies.txt`);
} else {
  console.error('Error: cookies.txt file not found. Server will not start.');
  process.exit(1);
}

wss.on('connection', (socket) => {
  clients.add(socket);

  socket.on('message', (message) => {
    const msg = message.toString();
    if (msg === "connect") {
      console.log("Client connected");
    }
    else if (msg === "btnCookie_pressed") {
      cookies++;
    }

    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(cookies.toString());
      }
    }
  });

  socket.on('close', () => clients.delete(socket));
  socket.on('error', (err) => console.error(`Socket error: ${err.message}`));
});

const saveCookies = () => {
  fs.writeFileSync(COOKIE_FILE, cookies.toString());
  console.log(`Saved ${cookies} cookies to cookies.txt`);
};

process.on('SIGINT', () => {
  saveCookies();
  process.exit();
});

process.on('SIGTERM', () => {
  saveCookies();
  process.exit();
});

const PORT = process.env.NODE_ENV == "production" ? 80 : 8081;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});







// sqlite