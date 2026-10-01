import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  Wifi,
  ShoppingBag,
  Bell,
  MessageSquare,
  Wrench,
  Compass,
  Building2,
  UtensilsCrossed,
  Layers,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentRoom,
    availableRooms,
    switchRoom,
    viewMode,
    setViewMode,
    activeGuestTab,
    setActiveGuestTab,
    activeStaffTab,
    setActiveStaffTab,
    setIsWifiModalOpen,
    cartItemCount,
    setIsCartOpen,
    pendingRequestsCount,
    openMaintenanceCount,
  } = useHotel();

  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Brand) - Zone 2 (Nav) - Zone 3 (Actions) */}
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (viewMode === 'guest') {
                  setActiveGuestTab('services');
                } else {
                  setActiveStaffTab('overview');
                }
              }}
              className="text-xl sm:text-2xl font-serif font-bold tracking-widest uppercase text-stone-900 hover:text-amber-800 transition-colors text-left"
            >
              Aura Haven
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          {viewMode === 'guest' ? (
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-stone-600">
              <button
                onClick={() => setActiveGuestTab('services')}
                className={`transition-colors hover:text-stone-950 pb-0.5 ${
                  activeGuestTab === 'services'
                    ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                    : ''
                }`}
              >
                Room Hub
              </button>
              <button
                onClick={() => setActiveGuestTab('dining')}
                className={`transition-colors hover:text-stone-950 pb-0.5 ${
                  activeGuestTab === 'dining'
                    ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                    : ''
                }`}
              >
                In-Room Dining & Amenities
              </button>
              <button
                onClick={() => setActiveGuestTab('facilities')}
                className={`transition-colors hover:text-stone-950 pb-0.5 ${
                  activeGuestTab === 'facilities'
                    ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                    : ''
                }`}
              >
                Hotel Facilities
              </button>
              <button
                onClick={() => setActiveGuestTab('nearby')}
                className={`transition-colors hover:text-stone-950 pb-0.5 ${
                  activeGuestTab === 'nearby'
                    ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                    : ''
                }`}
              >
                Nearby Guide
              </button>
              <button
                onClick={() => setActiveGuestTab('chat')}
                className={`transition-colors hover:text-stone-950 pb-0.5 ${
                  activeGuestTab === 'chat'
                    ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                    : ''
                }`}
              >
                Reception Chat
              </button>
              <button
                onClick={() => setActiveGuestTab('maintenance')}
                className={`transition-colors hover:text-stone-950 pb-0.5 ${
                  activeGuestTab === 'maintenance'
                    ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                    : ''
                }`}
              >
                Maintenance
              </button>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-stone-600">
              <button
                onClick={() => setActiveStaffTab('overview')}
                className={`transition-colors hover:text-stone-950 pb-0.5 ${
                  activeStaffTab === 'overview'
                    ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                    : ''
                }`}
              >
                Operations Dashboard
              </button>
              <button
                onClick={() => setActiveStaffTab('requests')}
                className={`transition-colors hover:text-stone-950 pb-0.5 flex items-center gap-1.5 ${
                  activeStaffTab === 'requests'
                    ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                    : ''
                }`}
              >
                <span>Guest Requests</span>
                {pendingRequestsCount > 0 && (
                  <span className="text-[11px] font-mono tabular-nums px-1.5 py-0.2 bg-amber-100 text-amber-900 font-semibold rounded-sm">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveStaffTab('maintenance')}
                className={`transition-colors hover:text-stone-950 pb-0.5 flex items-center gap-1.5 ${
                  activeStaffTab === 'maintenance'
                    ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                    : ''
                }`}
              >
                <span>Maintenance Orders</span>
                {openMaintenanceCount > 0 && (
                  <span className="text-[11px] font-mono tabular-nums px-1.5 py-0.2 bg-rose-100 text-rose-900 font-semibold rounded-sm">
                    {openMaintenanceCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveStaffTab('reservations')}
                className={`transition-colors hover:text-stone-950 pb-0.5 ${
                  activeStaffTab === 'reservations'
                    ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                    : ''
                }`}
              >
                Room Bookings
              </button>
              <button
                onClick={() => setActiveStaffTab('facilities')}
                className={`transition-colors hover:text-stone-950 pb-0.5 ${
                  activeStaffTab === 'facilities'
                    ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                    : ''
                }`}
              >
                Facility Schedules
              </button>
            </nav>
          )}

          {/* Zone 3: 1-2 primary actions & room switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* WiFi quick button (Guest mode) */}
            {viewMode === 'guest' && (
              <button
                onClick={() => setIsWifiModalOpen(true)}
                title="View Hotel High-Speed WiFi Credentials"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors whitespace-nowrap"
              >
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>WiFi: Ultra5G</span>
              </button>
            )}

            {/* Room selector dropdown (Guest mode) */}
            {viewMode === 'guest' && (
              <div className="relative">
                <button
                  onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-800 bg-amber-50 border border-amber-200/80 rounded-md hover:bg-amber-100/60 transition-colors whitespace-nowrap"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-semibold">Room {currentRoom.roomNumber}</span>
                  <ChevronDown className="w-3 h-3 text-stone-500" />
                </button>

                {isRoomDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-stone-200 py-1.5 z-50">
                    <div className="px-3 py-1.5 border-b border-stone-100">
                      <p className="text-[11px] text-stone-500 font-medium">Switch Active Room (Demo)</p>
                      <p className="text-xs font-semibold text-stone-800 truncate">{currentRoom.guestName}</p>
                    </div>
                    <div className="py-1">
                      {availableRooms.map((num) => (
                        <button
                          key={num}
                          onClick={() => {
                            switchRoom(num);
                            setIsRoomDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-stone-50 transition-colors ${
                            num === currentRoom.roomNumber
                              ? 'font-bold text-amber-900 bg-amber-50/60'
                              : 'text-stone-700'
                          }`}
                        >
                          <span>Room {num}</span>
                          {num === currentRoom.roomNumber && (
                            <span className="text-[10px] text-amber-700 font-medium">Active</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cart Drawer Toggle (Guest mode) */}
            {viewMode === 'guest' && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
                title="View Room Request Order Basket"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 bg-amber-700 text-white text-[10px] font-bold rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}

            {/* Mode Switcher: Guest Hub vs Staff Management */}
            <button
              onClick={() => {
                if (viewMode === 'guest') {
                  setViewMode('staff');
                } else {
                  setViewMode('guest');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-xs"
            >
              {viewMode === 'guest' ? (
                <>
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hotel Staff Mode</span>
                  {(pendingRequestsCount > 0 || openMaintenanceCount > 0) && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  )}
                </>
              ) : (
                <>
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Guest Companion Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="md:hidden flex items-center gap-3 overflow-x-auto py-2 border-t border-stone-100 text-xs font-medium text-stone-600 no-scrollbar">
          {viewMode === 'guest' ? (
            <>
              <button
                onClick={() => setActiveGuestTab('services')}
                className={`whitespace-nowrap px-2.5 py-1 rounded-sm ${
                  activeGuestTab === 'services' ? 'bg-stone-900 text-white' : 'hover:text-stone-900'
                }`}
              >
                Room Hub
              </button>
              <button
                onClick={() => setActiveGuestTab('dining')}
                className={`whitespace-nowrap px-2.5 py-1 rounded-sm ${
                  activeGuestTab === 'dining' ? 'bg-stone-900 text-white' : 'hover:text-stone-900'
                }`}
              >
                In-Room Dining
              </button>
              <button
                onClick={() => setActiveGuestTab('facilities')}
                className={`whitespace-nowrap px-2.5 py-1 rounded-sm ${
                  activeGuestTab === 'facilities' ? 'bg-stone-900 text-white' : 'hover:text-stone-900'
                }`}
              >
                Facilities
              </button>
              <button
                onClick={() => setActiveGuestTab('nearby')}
                className={`whitespace-nowrap px-2.5 py-1 rounded-sm ${
                  activeGuestTab === 'nearby' ? 'bg-stone-900 text-white' : 'hover:text-stone-900'
                }`}
              >
                Nearby Guide
              </button>
              <button
                onClick={() => setActiveGuestTab('chat')}
                className={`whitespace-nowrap px-2.5 py-1 rounded-sm ${
                  activeGuestTab === 'chat' ? 'bg-stone-900 text-white' : 'hover:text-stone-900'
                }`}
              >
                Reception Chat
              </button>
              <button
                onClick={() => setActiveGuestTab('maintenance')}
                className={`whitespace-nowrap px-2.5 py-1 rounded-sm ${
                  activeGuestTab === 'maintenance' ? 'bg-stone-900 text-white' : 'hover:text-stone-900'
                }`}
              >
                Maintenance
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveStaffTab('overview')}
                className={`whitespace-nowrap px-2.5 py-1 rounded-sm ${
                  activeStaffTab === 'overview' ? 'bg-stone-900 text-white' : 'hover:text-stone-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveStaffTab('requests')}
                className={`whitespace-nowrap px-2.5 py-1 rounded-sm ${
                  activeStaffTab === 'requests' ? 'bg-stone-900 text-white' : 'hover:text-stone-900'
                }`}
              >
                Guest Requests ({pendingRequestsCount})
              </button>
              <button
                onClick={() => setActiveStaffTab('maintenance')}
                className={`whitespace-nowrap px-2.5 py-1 rounded-sm ${
                  activeStaffTab === 'maintenance' ? 'bg-stone-900 text-white' : 'hover:text-stone-900'
                }`}
              >
                Maintenance ({openMaintenanceCount})
              </button>
              <button
                onClick={() => setActiveStaffTab('reservations')}
                className={`whitespace-nowrap px-2.5 py-1 rounded-sm ${
                  activeStaffTab === 'reservations' ? 'bg-stone-900 text-white' : 'hover:text-stone-900'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveStaffTab('facilities')}
                className={`whitespace-nowrap px-2.5 py-1 rounded-sm ${
                  activeStaffTab === 'facilities' ? 'bg-stone-900 text-white' : 'hover:text-stone-900'
                }`}
              >
                Facilities
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
