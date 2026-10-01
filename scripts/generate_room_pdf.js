import PDFDocument from 'pdfkit';
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

const rooms = [
  { num: '402', title: 'Deluxe Ocean View Suite', floor: 'Floor 4 · Oceanfront West' },
  { num: '305', title: 'Executive Garden Balcony', floor: 'Floor 3 · Garden Sanctuary' },
  { num: '210', title: 'Signature King Room', floor: 'Floor 2 · Courtyard Terrace' },
  { num: '314', title: 'Ocean View Deluxe Room', floor: 'Floor 3 · Coastal Promenade' },
  { num: '502', title: 'Executive Balcony Suite', floor: 'Floor 5 · Sky Deck West' },
  { num: '601', title: 'Penthouse Presidential Villa', floor: 'Floor 6 · Private Penthouse Deck' },
  { num: '108', title: 'Lagoon Beachfront Suite', floor: 'Floor 1 · Beachfront Boardwalk' },
];

async function generatePDF() {
  const outputPath = path.join(publicDir, 'Aura_Haven_Room_QR_Cards.pdf');
  const writeStream = fs.createWriteStream(outputPath);

  // 5" x 7" acrylic tent card format (360 x 504 points)
  const doc = new PDFDocument({
    size: [360, 504],
    margins: { top: 20, bottom: 20, left: 24, right: 24 },
    autoFirstPage: false,
  });

  doc.pipe(writeStream);

  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    doc.addPage({ size: [360, 504], margins: { top: 20, bottom: 20, left: 24, right: 24 } });

    // 1. Decorative border & background card container
    doc
      .roundedRect(12, 12, 336, 480, 16)
      .lineWidth(1.5)
      .strokeColor('#d6d3d1')
      .stroke();

    // Top gold accent bar
    doc
      .rect(12, 12, 336, 6)
      .fillColor('#d97706')
      .fill();

    // 2. Hotel Wordmark & Subtitle
    doc
      .font('Helvetica-Bold')
      .fontSize(18)
      .fillColor('#1c1917')
      .text('AURA HAVEN', 24, 34, { align: 'center', characterSpacing: 4 });

    doc
      .font('Helvetica')
      .fontSize(8.5)
      .fillColor('#78716c')
      .text('LUXURY RESORT & SPA · ' + room.floor.toUpperCase(), 24, 56, { align: 'center', characterSpacing: 1.5 });

    // 3. Suite Badge
    doc
      .roundedRect(60, 74, 240, 24, 12)
      .fillColor('#fef3c7')
      .fill();

    doc
      .font('Helvetica-Bold')
      .fontSize(10.5)
      .fillColor('#92400e')
      .text(`SUITE ${room.num} · ${room.title.toUpperCase()}`, 60, 81, { align: 'center', characterSpacing: 0.5 });

    // 4. Headline
    doc
      .font('Helvetica-Bold')
      .fontSize(16)
      .fillColor('#1c1917')
      .text('Scan with Your Phone Camera', 24, 114, { align: 'center' });

    doc
      .font('Helvetica')
      .fontSize(9.5)
      .fillColor('#57534e')
      .text('Unlock your in-room companion & guest services instantly', 24, 134, { align: 'center' });

    // 5. Generate and embed QR code
    const targetUrl = `${baseUrl}/?room=${room.num}`;
    const qrBuffer = await QRCode.toBuffer(targetUrl, {
      type: 'png',
      width: 360,
      margin: 1,
      color: {
        dark: '#1c1917',
        light: '#ffffff',
      },
    });

    // QR container box
    doc
      .roundedRect(95, 156, 170, 170, 12)
      .fillColor('#fafaf9')
      .strokeColor('#e7e5e4')
      .lineWidth(1)
      .fillAndStroke();

    // Place QR code image inside container
    doc.image(qrBuffer, 105, 166, { width: 150, height: 150 });

    // 6. Amenities highlight strip
    doc
      .roundedRect(36, 340, 288, 22, 6)
      .fillColor('#f5f5f4')
      .fill();

    doc
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .fillColor('#44403c')
      .text('High-Speed WiFi   ·   In-Room Dining   ·   Fresh Linens   ·   Concierge', 36, 347, {
        align: 'center',
      });

    // 7. Dark WiFi credentials box
    doc
      .roundedRect(28, 380, 304, 76, 10)
      .fillColor('#1c1917')
      .fill();

    doc
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .fillColor('#fbbf24')
      .text('IN-ROOM COMPLIMENTARY GIGABIT WIFI', 40, 394, { characterSpacing: 1 });

    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor('#e7e5e4')
      .text('Network:', 40, 414);

    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor('#ffffff')
      .text('AuraHaven_Guest_Ultra5G', 95, 414);

    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor('#e7e5e4')
      .text('Password:', 40, 432);

    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor('#ffffff')
      .text('AuraGuest2026', 100, 432);

    // 8. Subtle footer
    doc
      .font('Helvetica')
      .fontSize(7)
      .fillColor('#a8a29e')
      .text('For assistance, dial Front Desk Reception Ext. 0 from your room telephone', 24, 468, {
        align: 'center',
      });
  }

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      console.log(`PDF successfully generated at: ${outputPath}`);
      resolve(outputPath);
    });
    writeStream.on('error', reject);
  });
}

generatePDF()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error generating PDF:', err);
    process.exit(1);
  });
