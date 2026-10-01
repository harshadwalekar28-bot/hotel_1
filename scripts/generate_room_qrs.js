import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://ais-pre-hofe5jyaxreh3kxi5ug5dd-299982903843.asia-southeast1.run.app';
const publicDir = path.resolve(__dirname, '../public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const rooms = ['402', '305', '210', '314', '502', '601', '108'];

async function run() {
  for (const r of rooms) {
    const url = `${baseUrl}/?room=${r}`;
    const svgPath = path.join(publicDir, `qr-room-${r}.svg`);
    const svgString = await QRCode.toString(url, {
      type: 'svg',
      margin: 1,
      color: {
        dark: '#1c1917',
        light: '#ffffff',
      },
    });
    fs.writeFileSync(svgPath, svgString, 'utf-8');
    console.log(`Generated QR for Room ${r} at ${svgPath}`);
  }
}

run();
