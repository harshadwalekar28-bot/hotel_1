import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { HOTEL_FACILITIES } from '../../data/hotelData';
import { HotelFacility } from '../../types/hotel';
import {
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle,
  X,
  ChevronRight,
} from 'lucide-react';

interface FacilitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FacilitiesModal: React.FC<FacilitiesModalProps> = ({ isOpen, onClose }) => {
  const { currentRoom, bookFacility } = useHotel();
  const [selectedFacility, setSelectedFacility] = useState<HotelFacility | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [resDate, setResDate] = useState<string>('2026-10-01');
  const [resNotes, setResNotes] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectFacility = (fac: HotelFacility) => {
    setSelectedFacility(fac);
    setSelectedSlot(fac.slots[0] || '10:00 AM - 12:00 PM');
  };

  const handleConfirmReservation = () => {
    if (!selectedFacility) return;
    bookFacility({
      roomNumber: currentRoom.roomNumber,
      guestName: currentRoom.guestName,
      facilityId: selectedFacility.id,
      facilityTitle: selectedFacility.title,
      date: resDate,
      timeSlot: selectedSlot,
      guestCount,
      notes: resNotes,
    });

    setSuccessMsg(`Reserved ${selectedFacility.title} for ${resDate} at ${selectedSlot}!`);
    setSelectedFacility(null);
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-100 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">Hotel Facilities & Wellness</h3>
              <p className="text-xs text-stone-300">
                Horizon Pool, Soma Spa, Rooftop Lounge & Beach Club
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border-b border-emerald-200 flex items-center gap-2.5 animate-in fade-in duration-300">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs font-semibold text-emerald-900">{successMsg}</p>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!selectedFacility ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HOTEL_FACILITIES.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-stone-50 rounded-xl border border-stone-200 overflow-hidden flex flex-col justify-between group hover:border-amber-400/60 transition-all"
                >
                  <div className="relative h-40 bg-stone-200">
                    <img
                      src={fac.image}
                      alt={fac.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-3 text-white">
                      <span className="text-[10px] text-amber-300 font-semibold uppercase">{fac.subtitle}</span>
                      <h4 className="font-serif font-bold text-base leading-tight text-white">{fac.title}</h4>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-xs text-stone-600 line-clamp-2">{fac.description}</p>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{fac.hours}</span>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between border-t border-stone-200/60 mt-1">
                    <span className="text-[11px] text-stone-500">
                      {fac.requiresBooking ? 'Reservation Required' : 'Open 24/7'}
                    </span>
                    {fac.requiresBooking ? (
                      <button
                        onClick={() => handleSelectFacility(fac)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs font-semibold rounded-md transition-colors"
                      >
                        <span>Reserve Slot</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm font-semibold">
                        Walk-in
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Booking Form */
            <div className="max-w-lg mx-auto bg-stone-50 p-6 rounded-xl border border-stone-200 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900">{selectedFacility.title}</h4>
                  <p className="text-stone-500 text-[11px]">Select your preferred slot</p>
                </div>
                <button
                  onClick={() => setSelectedFacility(null)}
                  className="text-amber-900 hover:underline font-semibold"
                >
                  ← Back to Facilities
                </button>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Date</label>
                <input
                  type="date"
                  value={resDate}
                  onChange={(e) => setResDate(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-lg text-stone-800"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Available Time Slot</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedFacility.slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                        selectedSlot === slot
                          ? 'border-amber-600 bg-amber-50 text-stone-900 font-bold'
                          : 'border-stone-200 bg-white hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Guest Count</label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-stone-300 rounded-lg text-stone-800"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Special Preferences</label>
                <input
                  type="text"
                  placeholder="e.g. Near sunset view, quiet corner..."
                  value={resNotes}
                  onChange={(e) => setResNotes(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-lg text-stone-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedFacility(null)}
                  className="px-3 py-2 text-stone-600 hover:text-stone-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReservation}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-200 font-semibold rounded-lg shadow-xs"
                >
                  Confirm Reservation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
