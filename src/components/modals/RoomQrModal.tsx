import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useHotel } from '../../context/HotelContext';
import { HOTEL_WIFI } from '../../data/hotelData';
import {
  QrCode,
  X,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Wifi,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface RoomQrModalProps {
  roomNumber: string;
  roomType?: string;
  floor?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const RoomQrModal: React.FC<RoomQrModalProps> = ({
  roomNumber,
  roomType = 'Luxury Suite',
  floor = 'Floor 4',
  isOpen,
  onClose,
}) => {
  const { selectRoomAndProceed } = useHotel();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // The actual live URL of the application
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const roomUrl = `${origin}/?room=${roomNumber}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(roomUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestScan = () => {
    onClose();
    selectRoomAndProceed(roomNumber);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-100 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">In-Room QR Code Plaque</h3>
              <p className="text-xs text-stone-300">
                Direct phone scan for Suite {roomNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Card Area */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Luxury Acrylic Bedside Plaque Simulation */}
          <div className="p-6 bg-gradient-to-b from-stone-50 via-stone-100/60 to-stone-50 rounded-2xl border-2 border-stone-300 shadow-md text-center space-y-4">
            {/* Plaque Header */}
            <div>
              <span className="font-serif text-xs font-bold tracking-widest uppercase text-stone-900 block">
                Aura Haven Luxury Resort
              </span>
              <span className="text-[10px] uppercase tracking-wider text-amber-800 font-semibold">
                In-Room Digital Companion
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 mt-1">
                Suite {roomNumber}
              </h2>
              <p className="text-xs text-stone-500">{roomType} · {floor}</p>
            </div>

            {/* Generated Real Scannable QR Code */}
            <div className="inline-block p-4 bg-white rounded-2xl border border-stone-200 shadow-xs mx-auto">
              <QRCodeSVG
                value={roomUrl}
                size={180}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: '',
                  x: undefined,
                  y: undefined,
                  height: 24,
                  width: 24,
                  excavate: true,
                }}
              />
            </div>

            {/* Scan Instructions */}
            <div className="space-y-1 max-w-xs mx-auto">
              <p className="text-xs font-semibold text-stone-800 flex items-center justify-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-amber-700" />
                <span>Scan with your phone camera</span>
              </p>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Instantly unlocks high-speed WiFi, room service dining, fresh towels, pool reservations, and front desk reception chat.
              </p>
            </div>

            {/* WiFi Quick Strip */}
            <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between text-[11px] text-stone-600 px-2 font-mono">
              <span className="flex items-center gap-1">
                <Wifi className="w-3 h-3 text-emerald-600" />
                <span>WiFi: {HOTEL_WIFI.ssid}</span>
              </span>
              <span>Pass: {HOTEL_WIFI.pass}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={handleTestScan}
                className="w-full sm:flex-1 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <span>Simulate Camera Scan (Enter Suite {roomNumber})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handlePrint}
                className="w-full sm:w-auto py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-stone-600" />
                <span>Print Plaque</span>
              </button>
            </div>

            {/* Direct Room Link for Hotel Staff / Tablet */}
            <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
              <span className="text-[11px] text-stone-500 truncate mr-2 font-mono">
                {roomUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-300 rounded-md font-semibold text-stone-700 shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
