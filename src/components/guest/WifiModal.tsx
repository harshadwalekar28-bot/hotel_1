import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { HOTEL_WIFI } from '../../data/hotelData';
import {
  Wifi,
  Copy,
  Check,
  X,
  QrCode,
  ShieldCheck,
  Gauge,
  Smartphone,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const WifiModal: React.FC = () => {
  const { isWifiModalOpen, setIsWifiModalOpen, currentRoom, setActiveGuestTab, sendChatMessage } = useHotel();
  const [copied, setCopied] = useState(false);

  if (!isWifiModalOpen) return null;

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(HOTEL_WIFI.pass);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleNeedHelp = () => {
    setIsWifiModalOpen(false);
    setActiveGuestTab('chat');
    sendChatMessage('Hello reception, I need some assistance connecting my laptop/tablet to the hotel WiFi.', true);
  };

  // Encoded Wi-Fi string standard: WIFI:T:WPA;S:SSID;P:PASSWORD;;
  const wifiQrString = `WIFI:T:WPA;S:${HOTEL_WIFI.ssid};P:${HOTEL_WIFI.pass};;`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold tracking-wide">High-Speed Hotel WiFi</h3>
              <p className="text-xs text-stone-300">Complimentary Gigabit Fiber for Room {currentRoom.roomNumber}</p>
            </div>
          </div>
          <button
            onClick={() => setIsWifiModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-white rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Main Credentials Box */}
          <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3.5">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                Network Name (SSID)
              </label>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono text-sm font-bold text-stone-900 select-all">
                  {HOTEL_WIFI.ssid}
                </span>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm font-medium">
                  5 GHz Optimal
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200/60">
              <label className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                Guest Password
              </label>
              <div className="flex items-center justify-between gap-3 mt-1">
                <span className="font-mono text-base font-bold text-stone-900 tracking-wider select-all">
                  {HOTEL_WIFI.pass}
                </span>
                <button
                  onClick={handleCopyPassword}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-900 bg-amber-200 hover:bg-amber-300 rounded-md transition-colors shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Password</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Connect QR Code section */}
          <div className="flex items-center gap-4 p-4 bg-amber-50/50 rounded-lg border border-amber-200/70">
            <div className="shrink-0 p-2 bg-white rounded-lg border border-stone-200 shadow-xs">
              {/* Clean high-contrast SVG QR Representation for Wi-Fi */}
              <svg
                className="w-24 h-24"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Standard QR Framing and Pattern */}
                <rect width="100" height="100" fill="white" />
                {/* Top-Left Finder */}
                <rect x="10" y="10" width="28" height="28" stroke="#1c1917" strokeWidth="4" fill="none" />
                <rect x="18" y="18" width="12" height="12" fill="#1c1917" />
                {/* Top-Right Finder */}
                <rect x="62" y="10" width="28" height="28" stroke="#1c1917" strokeWidth="4" fill="none" />
                <rect x="70" y="18" width="12" height="12" fill="#1c1917" />
                {/* Bottom-Left Finder */}
                <rect x="10" y="62" width="28" height="28" stroke="#1c1917" strokeWidth="4" fill="none" />
                <rect x="18" y="70" width="12" height="12" fill="#1c1917" />
                {/* Data Pixels */}
                <rect x="44" y="12" width="6" height="6" fill="#1c1917" />
                <rect x="52" y="20" width="6" height="6" fill="#1c1917" />
                <rect x="44" y="28" width="6" height="6" fill="#1c1917" />
                <rect x="12" y="44" width="6" height="6" fill="#1c1917" />
                <rect x="22" y="48" width="6" height="6" fill="#1c1917" />
                <rect x="34" y="44" width="6" height="6" fill="#1c1917" />
                <rect x="44" y="44" width="8" height="8" fill="#d97706" />
                <rect x="56" y="44" width="6" height="6" fill="#1c1917" />
                <rect x="68" y="48" width="6" height="6" fill="#1c1917" />
                <rect x="80" y="44" width="6" height="6" fill="#1c1917" />
                <rect x="44" y="60" width="6" height="6" fill="#1c1917" />
                <rect x="56" y="64" width="6" height="6" fill="#1c1917" />
                <rect x="48" y="76" width="6" height="6" fill="#1c1917" />
                <rect x="64" y="72" width="8" height="8" fill="#1c1917" />
                <rect x="78" y="62" width="6" height="6" fill="#1c1917" />
                <rect x="74" y="80" width="6" height="6" fill="#1c1917" />
                <rect x="86" y="74" width="6" height="6" fill="#1c1917" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900">
                <Smartphone className="w-3.5 h-3.5 text-amber-700" />
                <span>Instant Phone Scan & Connect</span>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Open your smartphone camera and point at the QR code. Tap the pop-up banner to join without typing the password.
              </p>
            </div>
          </div>

          {/* Network Specs Specs Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <div className="flex items-center gap-1.5 text-stone-500 font-medium mb-1">
                <Gauge className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bandwidth</span>
              </div>
              <p className="font-mono font-semibold text-stone-900 tabular-nums">940 Mbps Dedicated</p>
              <p className="text-[11px] text-stone-500 mt-0.5">Stream 4K, video conferences, or gaming</p>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <div className="flex items-center gap-1.5 text-stone-500 font-medium mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>Security</span>
              </div>
              <p className="font-semibold text-stone-900">WPA3 Enterprise</p>
              <p className="text-[11px] text-stone-500 mt-0.5">Isolated private guest VLAN</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-stone-100/80 border-t border-stone-200 text-xs">
          <span className="text-stone-500">Need personal IT setup help?</span>
          <button
            onClick={handleNeedHelp}
            className="flex items-center gap-1.5 font-semibold text-amber-900 hover:text-amber-950 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat with Front Desk Concierge</span>
          </button>
        </div>
      </div>
    </div>
  );
};
