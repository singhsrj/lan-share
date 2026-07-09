const express = require('express');
const multer = require('multer');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');
const QRCode = require('qrcode');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// --- Helpers ---
function getLocalIp() {
  const nets = os.networkInterfaces();

  // Common Wi-Fi interface names across OSes
  const wifiNames = ['Wi-Fi', 'en0', 'en1', 'wlan0'];

  for (const name of wifiNames) {
    const iface = nets[name];
    if (!iface) continue;
    const ipv4 = iface.find((net) => net.family === 'IPv4' && !net.internal);
    if (ipv4) return ipv4.address;
  }

  return '127.0.0.1';
}

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(msg);
  });
}

function humanSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  const units = ['KB', 'MB', 'GB'];
  let i = -1;
  do {
    bytes /= 1024;
    i++;
  } while (bytes >= 1024 && i < units.length - 1);
  return bytes.toFixed(1) + ' ' + units[i];
}

function listFiles() {
  return fs.readdirSync(UPLOAD_DIR)
    .filter((f) => !f.startsWith('.'))
    .map((f) => {
      const stat = fs.statSync(path.join(UPLOAD_DIR, f));
      return {
        name: f,
        size: humanSize(stat.size),
        time: stat.mtimeMs,
      };
    })
    .sort((a, b) => b.time - a.time);
}

// --- Multer setup (preserve original filename, avoid collisions) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const original = Buffer.from(file.originalname, 'latin1').toString('utf8');
    let finalName = original;
    let counter = 1;
    while (fs.existsSync(path.join(UPLOAD_DIR, finalName))) {
      const ext = path.extname(original);
      const base = path.basename(original, ext);
      finalName = `${base} (${counter})${ext}`;
      counter++;
    }
    cb(null, finalName);
  },
});
const upload = multer({ storage });

// --- Routes ---
app.use(express.static(path.join(__dirname, 'public')));
app.use('/files', express.static(UPLOAD_DIR)); // direct download links

app.get('/api/files', (req, res) => {
  res.json(listFiles());
});

app.post('/api/upload', upload.array('files'), (req, res) => {
  res.json({ ok: true });
  broadcast({ type: 'update', files: listFiles() });
});

app.delete('/api/files/:name', (req, res) => {
  const target = path.join(UPLOAD_DIR, req.params.name);
  if (target.startsWith(UPLOAD_DIR) && fs.existsSync(target)) {
    fs.unlinkSync(target);
    res.json({ ok: true });
    broadcast({ type: 'update', files: listFiles() });
  } else {
    res.status(404).json({ ok: false });
  }
});

app.get('/api/qr', async (req, res) => {
  const ip = getLocalIp();
  const url = `http://${ip}:${PORT}`;
  const dataUrl = await QRCode.toDataURL(url, { margin: 1, width: 300 });
  res.json({ url, dataUrl });
});

// --- WebSocket: send current file list on connect ---
wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'update', files: listFiles() }));
});

server.listen(PORT, '0.0.0.0', async () => {
  const ip = getLocalIp();
  const url = `http://${ip}:${PORT}`;
  console.log('\n=== LAN Share ===');
  console.log(`Server running at: ${url}`);
  console.log('Scan this QR code from your phone:\n');
  const qrTerminal = await QRCode.toString(url, { type: 'terminal', small: true });
  console.log(qrTerminal);
  console.log(`Or open manually: ${url}\n`);
});
