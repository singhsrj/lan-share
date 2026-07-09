# LAN Share

Share photos, videos, APKs, or any file between two devices on the same WiFi/hotspot network — no internet, no app install on the phone.

## How it works

- Your laptop runs a small local server.
- It shows a **QR code** — scan it with your phone's camera to open the shared page in the browser (no typing IP addresses).
- Drop a file on either device and it instantly appears on the other, ready to download.
- Works with any file type/size: photos, videos, APKs, zips, PDFs, etc.

## Setup (one-time)

Make sure [Node.js](https://nodejs.org) is installed on your laptop (v18+ recommended).

```bash
cd lan-share
npm install
```

## Run it

```bash
npm start
```

You'll see something like:

```
=== LAN Share ===
Server running at: http://192.168.1.5:3000
Scan this QR code from your phone:

[QR CODE]

Or open manually: http://192.168.1.5:3000
```

**On your phone:**
1. Connect to the **same WiFi network or hotspot** as your laptop.
2. Open your camera app and scan the QR code shown in the terminal (or shown in the browser page itself once you open it on the laptop).
3. Tap the notification/link to open the page in your phone's browser.

**To send a file:**
- Drag & drop it onto the laptop page, or tap the drop zone on the phone to pick a file from your gallery/files.
- It appears in the "Shared files" list on **both** devices immediately (live update, no refresh needed).
- Tap "Download" on the receiving device.

## Notes

- Both devices must be on the same local network (same WiFi, or one device's hotspot with the other connected to it).
- Files are stored temporarily in the `uploads/` folder on the laptop. Delete them with the ✕ button when done, or just stop the server — they persist on disk until you remove them.
- If your laptop has multiple network adapters (e.g. both WiFi and Ethernet), the server auto-detects the active local IP. If the QR code shows the wrong IP (e.g. a VPN adapter), find your correct local IP manually (`ipconfig` on Windows / `ifconfig` or `ip a` on Mac/Linux) and open `http://<that-ip>:3000` manually.
- To change the port: `PORT=8080 npm start`.
- No data ever leaves your local network — everything is served directly from your laptop.

## Stopping the server

Press `Ctrl+C` in the terminal where it's running.
