import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { WifiModal } from './guest/WifiModal';
import { DiningModal } from './modals/DiningModal';
import { AmenitiesModal } from './modals/AmenitiesModal';
import { FacilitiesModal } from './modals/FacilitiesModal';
import { ChatModal } from './modals/ChatModal';
import { MaintenanceModal } from './modals/MaintenanceModal';
import { OrderTrackerModal } from './modals/OrderTrackerModal';
import {
  Wifi,
  UtensilsCrossed,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  Wrench,
  Clock,
  ArrowRight,
  Layers,
  ChevronDown,
} from 'lucide-react';

export const SanctuaryHub: React.FC = () => {
  const {
    currentRoom,
    availableRooms,
    switchRoom,
    requests,
    setIsWifiModalOpen,
    setViewMode,
    pendingRequestsCount,
    openMaintenanceCount,
    resetRoomSelection,
  } = useHotel();

  // Modals state
  const [isDiningOpen, setIsDiningOpen] = useState(false);
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);
  const [isFacilitiesOpen, setIsFacilitiesOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isRoomMenuOpen, setIsRoomMenuOpen] = useState(false);

  // Active room request
  const activeRequest =
    requests.find((r) => r.roomNumber === currentRoom.roomNumber && (r.status === 'pending' || r.status === 'in_progress')) ||
    requests.find((r) => r.roomNumber === currentRoom.roomNumber) ||
    requests[0];

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-stone-950 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background High-Impact Photography with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hotel_hero_facade_1790868857420.jpg"
          alt="Aura Haven Luxury Resort"
          className="w-full h-full object-cover object-center scale-102 transform transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Cinematic dark vignette / gradient scrim matching the user's screenshot */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/80 to-stone-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/50" />
      </div>

      {/* Discreet Subtle Top Bar for Demo Room Switch & Staff Management Access */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-5 sm:pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg sm:text-xl font-bold tracking-widest uppercase text-white/90">
            Aura Haven
          </span>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Change Suite / Return to Room Selection */}
          <button
            onClick={resetRoomSelection}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-stone-900/70 hover:bg-stone-800/90 border border-stone-700/60 rounded-lg backdrop-blur-md transition-all shadow-xs"
            title="Return to Room Check-in / Selection Page"
          >
            <span>Change Suite</span>
          </button>

          {/* Room Switcher demo dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoomMenuOpen(!isRoomMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-200 bg-stone-900/70 hover:bg-stone-800/90 border border-stone-700/60 rounded-lg backdrop-blur-md transition-all shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Room {currentRoom.roomNumber}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {isRoomMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-stone-900/95 rounded-xl border border-stone-700 shadow-2xl py-1.5 z-50 backdrop-blur-md">
                <div className="px-3 py-1.5 border-b border-stone-800 text-[11px] text-stone-400 font-medium">
                  Switch Active Room
                </div>
                {availableRooms.map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      switchRoom(num);
                      setIsRoomMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-stone-800/80 transition-colors ${
                      num === currentRoom.roomNumber ? 'text-amber-300 font-bold' : 'text-stone-300'
                    }`}
                  >
                    <span>Room {num}</span>
                    {num === currentRoom.roomNumber && <span className="text-[10px] text-amber-400">Active</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Toggle Staff Console */}
          <button
            onClick={() => setViewMode('staff')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-200 bg-stone-900/70 hover:bg-stone-800/90 border border-stone-700/60 rounded-lg backdrop-blur-md transition-all shadow-xs group"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Staff Management</span>
            {(pendingRequestsCount > 0 || openMaintenanceCount > 0) && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            )}
          </button>
        </div>
      </header>

      {/* Main Sanctuary Companion Content Matching Screenshot Pixel-by-Pixel */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 my-auto">
        <div className="max-w-5xl space-y-6 sm:space-y-8">
          {/* Metadata line */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium tracking-wide">
            <span className="text-amber-300/95 font-semibold">Room {currentRoom.roomNumber}</span>
            <span className="text-amber-300/80" aria-hidden="true">·</span>
            <span className="text-amber-300/95">{currentRoom.roomType}</span>
            <span className="text-amber-300/80" aria-hidden="true">·</span>
            <span className="text-amber-300/95">Floor {currentRoom.floor}</span>
            <span className="text-amber-300/80" aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Keycard Active
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15] max-w-3xl drop-shadow-sm">
            Welcome to your sanctuary, {currentRoom.guestName}.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl font-normal">
            Explore customized in-room dining, request fresh linens, book private pool cabanas, or message front desk reception 24/7.
          </p>

          {/* Active Room Service Request Banner */}
          {activeRequest && (
            <div className="p-3.5 sm:p-4 bg-stone-900/80 hover:bg-stone-900/90 border border-amber-500/35 rounded-2xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-2.5 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
                  <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                    Active Room Service Request (#{activeRequest.id})
                  </p>
                  <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5">
                    Status:{' '}
                    <span className="capitalize font-semibold text-amber-300">
                      {activeRequest.status.replace('_', ' ')}
                    </span>{' '}
                    · Estimated delivery to Room {currentRoom.roomNumber} in ~15–20 min.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsTrackerOpen(true)}
                className="text-xs sm:text-sm font-semibold text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1 self-end sm:self-auto cursor-pointer pr-1"
              >
                <span>Track Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* The Six Interactive Action Cards */}
          <div className="pt-2 sm:pt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {/* Card 1: WiFi Password */}
            <div
              onClick={() => setIsWifiModalOpen(true)}
              className="bg-stone-900/75 hover:bg-stone-900/95 border border-stone-800 hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all backdrop-blur-md cursor-pointer group text-left shadow-lg min-h-[145px]"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Wifi className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300 transition-colors leading-tight">
                  WiFi Password
                </h3>
                <p className="text-[11px] text-stone-400 mt-1">
                  Ultra5G & QR Code
                </p>
              </div>
            </div>

            {/* Card 2: Dining Menu */}
            <div
              onClick={() => setIsDiningOpen(true)}
              className="bg-stone-900/75 hover:bg-stone-900/95 border border-stone-800 hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all backdrop-blur-md cursor-pointer group text-left shadow-lg min-h-[145px]"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300 transition-colors leading-tight">
                  Dining Menu
                </h3>
                <p className="text-[11px] text-stone-400 mt-1">
                  Gourmet & Breakfast
                </p>
              </div>
            </div>

            {/* Card 3: Room Amenities */}
            <div
              onClick={() => setIsAmenitiesOpen(true)}
              className="bg-stone-900/75 hover:bg-stone-900/95 border border-stone-800 hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all backdrop-blur-md cursor-pointer group text-left shadow-lg min-h-[145px]"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300 transition-colors leading-tight">
                  Room Amenities
                </h3>
                <p className="text-[11px] text-stone-400 mt-1">
                  Towels, Pillows, Kits
                </p>
              </div>
            </div>

            {/* Card 4: Hotel Facilities */}
            <div
              onClick={() => setIsFacilitiesOpen(true)}
              className="bg-stone-900/75 hover:bg-stone-900/95 border border-stone-800 hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all backdrop-blur-md cursor-pointer group text-left shadow-lg min-h-[145px]"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300 transition-colors leading-tight">
                  Hotel Facilities
                </h3>
                <p className="text-[11px] text-stone-400 mt-1">
                  Pool, Spa & Rooftop
                </p>
              </div>
            </div>

            {/* Card 5: Chat Reception */}
            <div
              onClick={() => setIsChatOpen(true)}
              className="bg-stone-900/75 hover:bg-stone-900/95 border border-stone-800 hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all backdrop-blur-md cursor-pointer group text-left shadow-lg min-h-[145px]"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300 transition-colors leading-tight">
                  Chat Reception
                </h3>
                <p className="text-[11px] text-stone-400 mt-1">
                  Instant Concierge
                </p>
              </div>
            </div>

            {/* Card 6: Room Assistance */}
            <div
              onClick={() => setIsMaintenanceOpen(true)}
              className="bg-stone-900/75 hover:bg-stone-900/95 border border-stone-800 hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all backdrop-blur-md cursor-pointer group text-left shadow-lg min-h-[145px]"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Wrench className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300 transition-colors leading-tight">
                  Room Assistance
                </h3>
                <p className="text-[11px] text-stone-400 mt-1">
                  Maintenance & AC
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Bottom Note */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 pb-5 text-[11px] text-stone-400/80 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/5 pt-4">
        <span>Aura Haven Luxury Resort & Spa · 24/7 Guest Services Ext. 0</span>
        <span>WiFi: AuraHaven_Guest_Ultra5G (Gigabit Fiber)</span>
      </footer>

      {/* Overlay Modals for Full Functionality */}
      <WifiModal />
      <DiningModal isOpen={isDiningOpen} onClose={() => setIsDiningOpen(false)} />
      <AmenitiesModal isOpen={isAmenitiesOpen} onClose={() => setIsAmenitiesOpen(false)} />
      <FacilitiesModal isOpen={isFacilitiesOpen} onClose={() => setIsFacilitiesOpen(false)} />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <MaintenanceModal isOpen={isMaintenanceOpen} onClose={() => setIsMaintenanceOpen(false)} />
      <OrderTrackerModal isOpen={isTrackerOpen} onClose={() => setIsTrackerOpen(false)} />
    </div>
  );
};
