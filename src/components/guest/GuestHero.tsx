import React from 'react';
import { useHotel } from '../../context/HotelContext';
import { HOTEL_WIFI } from '../../data/hotelData';
import {
  Wifi,
  UtensilsCrossed,
  Sparkles,
  Compass,
  MessageSquare,
  Wrench,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const GuestHero: React.FC = () => {
  const { currentRoom, setActiveGuestTab, setIsWifiModalOpen, requests } = useHotel();

  // Active requests for this room
  const activeRoomRequests = requests.filter(
    (r) => r.roomNumber === currentRoom.roomNumber && (r.status === 'pending' || r.status === 'in_progress')
  );

  return (
    <section className="relative overflow-hidden rounded-2xl bg-stone-900 text-stone-100 shadow-md">
      {/* Background Hero Image with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hotel_hero_facade_1790868857420.jpg"
          alt="Aura Haven Luxury Hotel Facade"
          className="w-full h-full object-cover object-center opacity-40 scale-102 transform transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-900/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-4xl">
        {/* Room Header Kicker (Unboxed metadata with typographic separators) */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-200/90 font-medium tracking-wide mb-3">
          <span>Room {currentRoom.roomNumber}</span>
          <span aria-hidden="true">·</span>
          <span>{currentRoom.roomType}</span>
          <span aria-hidden="true">·</span>
          <span>Floor {currentRoom.floor}</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Keycard Active
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight max-w-2xl">
          Welcome to your sanctuary, {currentRoom.guestName}.
        </h1>

        <p className="mt-3 text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
          Explore customized in-room dining, request fresh linens, book private pool cabanas, or message front desk reception 24/7.
        </p>

        {/* Active In-Progress Room Orders Banner (if any) */}
        {activeRoomRequests.length > 0 && (
          <div className="mt-6 p-3.5 bg-stone-800/90 border border-amber-500/40 rounded-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                <Clock className="w-4 h-4 animate-spin text-amber-300" style={{ animationDuration: '4s' }} />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  Active Room Service Request (#{activeRoomRequests[0].id})
                </p>
                <p className="text-[11px] text-stone-300">
                  Status:{' '}
                  <span className="capitalize font-semibold text-amber-300">
                    {activeRoomRequests[0].status.replace('_', ' ')}
                  </span>{' '}
                  · Estimated delivery to Room {currentRoom.roomNumber} in ~15-20 min.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveGuestTab('dining')}
              className="text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1 self-end sm:self-auto"
            >
              <span>Track Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Fast Action Shortcuts */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. WiFi Action Card */}
          <button
            onClick={() => setIsWifiModalOpen(true)}
            className="flex flex-col items-start p-3.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 hover:border-amber-400/60 transition-all text-left group"
          >
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 mb-2 group-hover:scale-105 transition-transform">
              <Wifi className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
              WiFi Password
            </span>
            <span className="text-[11px] text-stone-400 mt-0.5">Ultra5G & QR Code</span>
          </button>

          {/* 2. In-Room Dining */}
          <button
            onClick={() => setActiveGuestTab('dining')}
            className="flex flex-col items-start p-3.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 hover:border-amber-400/60 transition-all text-left group"
          >
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 mb-2 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
              Dining Menu
            </span>
            <span className="text-[11px] text-stone-400 mt-0.5">Gourmet & Breakfast</span>
          </button>

          {/* 3. Room Resources & Linens */}
          <button
            onClick={() => setActiveGuestTab('dining')}
            className="flex flex-col items-start p-3.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 hover:border-amber-400/60 transition-all text-left group"
          >
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 mb-2 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
              Room Amenities
            </span>
            <span className="text-[11px] text-stone-400 mt-0.5">Towels, Pillows, Kits</span>
          </button>

          {/* 4. Hotel Facilities */}
          <button
            onClick={() => setActiveGuestTab('facilities')}
            className="flex flex-col items-start p-3.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 hover:border-amber-400/60 transition-all text-left group"
          >
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 mb-2 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
              Hotel Facilities
            </span>
            <span className="text-[11px] text-stone-400 mt-0.5">Pool, Spa & Rooftop</span>
          </button>

          {/* 5. Reception Chat */}
          <button
            onClick={() => setActiveGuestTab('chat')}
            className="flex flex-col items-start p-3.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 hover:border-amber-400/60 transition-all text-left group"
          >
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 mb-2 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
              Chat Reception
            </span>
            <span className="text-[11px] text-stone-400 mt-0.5">Instant Concierge</span>
          </button>

          {/* 6. Maintenance */}
          <button
            onClick={() => setActiveGuestTab('maintenance')}
            className="flex flex-col items-start p-3.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 hover:border-amber-400/60 transition-all text-left group"
          >
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 mb-2 group-hover:scale-105 transition-transform">
              <Wrench className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
              Room Assistance
            </span>
            <span className="text-[11px] text-stone-400 mt-0.5">Maintenance & AC</span>
          </button>
        </div>
      </div>
    </section>
  );
};
