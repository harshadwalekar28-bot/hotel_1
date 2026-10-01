import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Building,
  Layers,
  ChevronRight,
  Search,
} from 'lucide-react';

export const RoomSelectionHome: React.FC = () => {
  const { selectRoomAndProceed, setViewMode } = useHotel();
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [customRoomInput, setCustomRoomInput] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  // Complete hotel rooms list - STRICTLY NO GUEST NAMES
  const hotelRooms = [
    // Floor 4
    { roomNumber: '402', type: 'Deluxe Ocean View Suite', floor: 'Floor 4', wing: 'Oceanfront West', status: 'Keycard Active' },
    { roomNumber: '405', type: 'Executive Oceanfront Suite', floor: 'Floor 4', wing: 'Oceanfront West', status: 'Keycard Active' },
    { roomNumber: '408', type: 'Grand Panorama Suite', floor: 'Floor 4', wing: 'Oceanfront East', status: 'Keycard Active' },

    // Floor 3
    { roomNumber: '305', type: 'Executive Garden Balcony', floor: 'Floor 3', wing: 'Garden Sanctuary', status: 'Keycard Active' },
    { roomNumber: '314', type: 'Ocean View Deluxe Room', floor: 'Floor 3', wing: 'Coastal Promenade', status: 'Keycard Active' },
    { roomNumber: '318', type: 'Botanical Terrace Suite', floor: 'Floor 3', wing: 'Garden Sanctuary', status: 'Keycard Active' },

    // Floor 2
    { roomNumber: '204', type: 'Executive King Suite', floor: 'Floor 2', wing: 'Mezzanine South', status: 'Keycard Active' },
    { roomNumber: '210', type: 'Signature King Room', floor: 'Floor 2', wing: 'Courtyard Terrace', status: 'Keycard Active' },
    { roomNumber: '215', type: 'Deluxe Garden Room', floor: 'Floor 2', wing: 'Garden Sanctuary', status: 'Keycard Active' },

    // Floor 5 & 6 (Penthouse level)
    { roomNumber: '501', type: 'Lagoon Sky Terrace', floor: 'Floor 5', wing: 'Sky Deck East', status: 'Keycard Active' },
    { roomNumber: '502', type: 'Executive Balcony Suite', floor: 'Floor 5', wing: 'Sky Deck West', status: 'Keycard Active' },
    { roomNumber: '601', type: 'Penthouse Presidential Villa', floor: 'Floor 6', wing: 'Private Penthouse Deck', status: 'Keycard Active' },
    { roomNumber: '602', type: 'Imperial Horizon Penthouse', floor: 'Floor 6', wing: 'Private Penthouse Deck', status: 'Keycard Active' },

    // Floor 1 & Ground
    { roomNumber: '102', type: 'Private Plunge Pool Villa', floor: 'Floor 1', wing: 'Beachfront Boardwalk', status: 'Keycard Active' },
    { roomNumber: '108', type: 'Lagoon Beachfront Suite', floor: 'Floor 1', wing: 'Beachfront Boardwalk', status: 'Keycard Active' },
  ];

  const filteredRooms = hotelRooms.filter((r) => {
    const matchesFloor =
      selectedFloor === 'all' ||
      (selectedFloor === '4' && r.floor === 'Floor 4') ||
      (selectedFloor === '3' && r.floor === 'Floor 3') ||
      (selectedFloor === '2' && r.floor === 'Floor 2') ||
      (selectedFloor === 'penthouse' && (r.floor === 'Floor 5' || r.floor === 'Floor 6')) ||
      (selectedFloor === '1' && r.floor === 'Floor 1');

    const matchesSearch =
      r.roomNumber.includes(searchFilter) ||
      r.type.toLowerCase().includes(searchFilter.toLowerCase());

    return matchesFloor && matchesSearch;
  });

  const handleSelectRoom = (roomNum: string) => {
    selectRoomAndProceed(roomNum);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoomInput.trim()) return;
    selectRoomAndProceed(customRoomInput.trim());
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-stone-950 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background High-Impact Imagery with Cinematic Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hotel_hero_facade_1790868857420.jpg"
          alt="Aura Haven Luxury Resort"
          className="w-full h-full object-cover object-center scale-102 transform transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/85 to-stone-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-stone-950/60" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-6 sm:pt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest uppercase text-white">
            Aura Haven
          </span>
          <span className="text-stone-500 hidden sm:inline" aria-hidden="true">|</span>
          <span className="text-stone-400 text-xs hidden sm:inline tracking-wider uppercase">
            Luxury Resort & Spa
          </span>
        </div>

        {/* Staff Management Portal Access */}
        <button
          onClick={() => setViewMode('staff')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-300 bg-stone-900/80 hover:bg-stone-800 border border-stone-700/60 rounded-lg backdrop-blur-md transition-all shadow-xs cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Hotel Staff Portal</span>
        </button>
      </header>

      {/* Main Room Selection Viewport */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 py-8 sm:py-10 my-auto space-y-6 sm:space-y-8">
        {/* Editorial Heading */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Select Your Room Number</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-sm">
            Which room are you staying in?
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">
            Select your room number below to access high-speed WiFi credentials, order in-room dining, request fresh linens, and message reception.
          </p>
        </div>

        {/* Floor Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-900/80 p-2 sm:p-2.5 rounded-2xl border border-stone-800 backdrop-blur-md">
          {/* Segmented Floor Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedFloor('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                selectedFloor === 'all'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              All Rooms ({hotelRooms.length})
            </button>
            <button
              onClick={() => setSelectedFloor('4')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                selectedFloor === '4'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              Floor 4
            </button>
            <button
              onClick={() => setSelectedFloor('3')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                selectedFloor === '3'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              Floor 3
            </button>
            <button
              onClick={() => setSelectedFloor('2')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                selectedFloor === '2'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              Floor 2
            </button>
            <button
              onClick={() => setSelectedFloor('penthouse')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                selectedFloor === 'penthouse'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              Penthouse (5 & 6)
            </button>
            <button
              onClick={() => setSelectedFloor('1')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                selectedFloor === '1'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              Floor 1
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
            <input
              type="text"
              placeholder="Search room #..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder:text-stone-500 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Room Numbers Grid - ONLY ROOM NUMBERS, NO NAMES */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredRooms.map((room) => {
            const isFeatured = room.roomNumber === '402';
            return (
              <div
                key={room.roomNumber}
                onClick={() => handleSelectRoom(room.roomNumber)}
                className={`p-4 sm:p-4.5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between backdrop-blur-md shadow-lg ${
                  isFeatured
                    ? 'bg-stone-900/90 border-amber-500/80 hover:border-amber-400 ring-1 ring-amber-500/30'
                    : 'bg-stone-900/75 hover:bg-stone-900/95 border-stone-800 hover:border-amber-400/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                      {room.roomNumber}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>

                  <p className="text-xs font-medium text-amber-200/90 mt-1 line-clamp-1">
                    {room.type}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {room.floor} · {room.wing}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-stone-800 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-semibold">Active Keycard</span>
                  <span className="text-amber-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    <span>Enter</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Or Type Room Number directly */}
        <form
          onSubmit={handleCustomSubmit}
          className="p-4 bg-stone-900/70 border border-stone-800/80 rounded-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
        >
          <span className="text-stone-300 font-medium">
            Room number not in the list? Enter any room number:
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="e.g. 402"
              value={customRoomInput}
              onChange={(e) => setCustomRoomInput(e.target.value)}
              className="w-full sm:w-32 px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-white font-mono font-bold focus:outline-hidden focus:border-amber-400 text-center"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              Enter Room →
            </button>
          </div>
        </form>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-6 text-xs text-stone-400/80 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/5 pt-4">
        <span>Aura Haven Luxury Resort & Spa · 24/7 Front Desk Concierge</span>
        <span>Keycard verification powered by Aura Guest Services</span>
      </footer>
    </div>
  );
};
