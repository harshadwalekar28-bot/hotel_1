import React from 'react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { RoomSelectionHome } from './components/RoomSelectionHome';
import { SanctuaryHub } from './components/SanctuaryHub';
import { StaffDashboard } from './components/staff/StaffDashboard';
import { ArrowLeft } from 'lucide-react';

const HotelAppContent: React.FC = () => {
  const { viewMode, setViewMode, isRoomIdentified } = useHotel();

  // If in staff management view
  if (viewMode === 'staff') {
    return (
      <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
        {/* Staff Console Header with Back to Guest Room Button */}
        <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('guest')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Guest Room Hub</span>
              </button>
              <span className="text-stone-600 hidden sm:inline" aria-hidden="true">|</span>
              <span className="font-serif font-bold text-base tracking-wider hidden sm:inline">
                AURA HAVEN OPERATIONS CONSOLE
              </span>
            </div>

            <div className="text-xs text-stone-400">
              <span>Hotel Dispatch & Maintenance System</span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <StaffDashboard />
        </main>
      </div>
    );
  }

  // 1st Screen: Customer identifies which room they are in
  if (!isRoomIdentified) {
    return <RoomSelectionHome />;
  }

  // 2nd Screen: The Sanctuary Room Companion Hub (as requested in the screenshot)
  return <SanctuaryHub />;
};

export default function App() {
  return (
    <HotelProvider>
      <HotelAppContent />
    </HotelProvider>
  );
}
