# 📡 LAN Share

**Drop a file. Scan a code. Done.**

A zero-friction, self-hosted file-sharing server for your local network. No cloud, no accounts, no cables — just a QR code that turns any phone or laptop on the same Wi-Fi into a drop zone.

![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/express-4.x-000000?logo=express&logoColor=white)
![WebSocket](https://img.shields.io/badge/realtime-WebSocket-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Why

You've been there: AirDrop won't talk to Android, Bluetooth is glacial, and emailing yourself a 2GB video is not a plan. LAN Share spins up a tiny web server on your machine, prints a QR code to your terminal, and lets *anything with a browser* upload or grab files instantly — no app install required.

## 🚀 Features

- **📷 Instant QR pairing** — scan from your phone, land straight on the upload page
- **⚡ Live file list** — WebSocket-powered, updates on every device the moment a file lands
- **📤 Drag, drop, done** — multi-file uploads with automatic name-collision handling
- **🗑️ Manage from anywhere** — delete files from any connected device
- **🔗 Direct download links** — served straight from `/files`, no extra clicks
- **🖥️ Zero-config** — auto-detects your LAN IP, just run and scan

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Server | Node.js + Express |
| Realtime sync | `ws` (WebSocket) |
| Uploads | Multer |
| QR generation | `qrcode` |
| Frontend | *(static, served from `/public`)* |

## 📦 Quick Start

```bash
git clone github.com:singhsrj/lan-share.git
cd lan-share
npm install
npm start
```

Your terminal will print a scannable QR code:

```
=== LAN Share ===
Server running at: http://192.168.x.x:3000
Scan this QR code from your phone:

[QR CODE]

Or open manually: http://192.168.x.x:3000
```

Scan it, and you're uploading in seconds.

> **Note:** All devices must be on the same Wi-Fi/LAN network.

## ⚙️ Configuration

| Env Var | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port the server listens on |

## 🧩 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/files` | List all uploaded files |
| `POST` | `/api/upload` | Upload one or more files (`multipart/form-data`, field: `files`) |
| `DELETE` | `/api/files/:name` | Delete a file by name |
| `GET` | `/api/qr` | Get the connection URL + QR code as a data URL |
| `WS` | `/` | Live file-list updates |

## 📱 Companion Apps

LAN Share isn't just a web page:

- **Android app** — built with Flutter, for a native drop experience
- **Windows build** — packaged as a standalone `.exe` (via `@yao-pkg/pkg`), no Node.js install required

*(See their respective folders/releases for setup instructions.)*

## 🗺️ Roadmap

- [ ] Transfer progress bars
- [ ] Optional room codes / pairing PINs for shared networks
- [ ] Dark mode UI
- [ ] Drag-and-drop folder support

## 🤝 Contributing

PRs and issues welcome — this is a weekend project that grew teeth. Fork it, break it, send it back better.

## 📄 License

MIT © [Your Name]
