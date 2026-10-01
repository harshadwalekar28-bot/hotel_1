import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { HOTEL_FACILITIES } from '../../data/hotelData';
import { HotelFacility } from '../../types/hotel';
import {
  Clock,
  MapPin,
  Users,
  Calendar,
  CheckCircle,
  X,
  Sparkles,
  Waves,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const HotelFacilities: React.FC = () => {
  const { currentRoom, facilityReservations, bookFacility, cancelFacilityReservation } = useHotel();
  const [selectedFacility, setSelectedFacility] = useState<HotelFacility | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [resDate, setResDate] = useState<string>('2026-10-01');
  const [resNotes, setResNotes] = useState<string>('');
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  const handleOpenBooking = (facility: HotelFacility) => {
    setSelectedFacility(facility);
    setSelectedSlot(facility.slots[0] || '10:00 AM - 12:00 PM');
    setGuestCount(2);
    setResNotes('');
  };

  const handleConfirmBooking = () => {
    if (!selectedFacility) return;
    const newRes = bookFacility({
      roomNumber: currentRoom.roomNumber,
      guestName: currentRoom.guestName,
      facilityId: selectedFacility.id,
      facilityTitle: selectedFacility.title,
      date: resDate,
      timeSlot: selectedSlot,
      guestCount,
      notes: resNotes,
    });

    setBookingSuccessMsg(`Reserved ${selectedFacility.title} for ${resDate} at ${selectedSlot}!`);
    setSelectedFacility(null);
    setTimeout(() => setBookingSuccessMsg(null), 5000);
  };

  // Reservations for this room
  const myReservations = facilityReservations.filter((r) => r.roomNumber === currentRoom.roomNumber);

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-stone-200 pb-5">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          Resort Amenities
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
          Hotel Facilities & Wellness
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
          Complimentary resort access is included with your stay. Reserve private cabanas, holistic spa treatments, or rooftop sunset tables in advance.
        </p>
      </div>

      {/* Booking Success Alert */}
      {bookingSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <p className="text-xs font-semibold text-emerald-900">{bookingSuccessMsg}</p>
          </div>
          <button
            onClick={() => setBookingSuccessMsg(null)}
            className="text-xs text-emerald-800 hover:underline"
          >
            Close
          </button>
        </div>
      )}

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {HOTEL_FACILITIES.map((facility) => (
          <div
            key={facility.id}
            className="bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Facility Image with Scrim */}
              <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                <img
                  src={facility.image}
                  alt={facility.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-600"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/30 to-transparent pointer-events-none" />

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[11px] font-medium text-amber-300 tracking-wide uppercase">
                    {facility.subtitle}
                  </span>
                  <h3 className="text-base font-serif font-bold text-white leading-snug drop-shadow-xs">
                    {facility.title}
                  </h3>
                </div>
              </div>

              {/* Facility Details */}
              <div className="p-5 space-y-3.5">
                <p className="text-xs text-stone-600 leading-relaxed">{facility.description}</p>

                {/* Location and Hours metadata (Zero-pill compliant) */}
                <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{facility.hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{facility.location}</span>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="pt-2">
                  <p className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-1.5">
                    Complimentary Privileges
                  </p>
                  <ul className="grid grid-cols-2 gap-1 text-[11px] text-stone-600">
                    {facility.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-amber-600"></span>
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-5 pt-0 mt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                {facility.requiresBooking ? 'Reservation Recommended' : 'Walk-in Welcome'}
              </span>

              {facility.requiresBooking ? (
                <button
                  onClick={() => handleOpenBooking(facility)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs font-semibold rounded-md transition-colors"
                >
                  <span>Reserve Slot</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Open 24/7
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Active Room Reservations */}
      {myReservations.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base font-serif font-bold text-stone-900">
                Your Facility Bookings (Room {currentRoom.roomNumber})
              </h3>
              <p className="text-xs text-stone-500">Confirmed wellness and cabana passes</p>
            </div>
            <span className="text-xs text-stone-500 font-mono tabular-nums">
              {myReservations.length} reservation{myReservations.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {myReservations.map((res) => (
              <div key={res.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-stone-900">{res.id}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-stone-900">{res.facilityTitle}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-600 mt-1">
                    <span className="font-mono tabular-nums">{res.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-amber-900">{res.timeSlot}</span>
                    <span aria-hidden="true">·</span>
                    <span>{res.guestCount} Guests</span>
                  </div>
                  {res.notes && <p className="text-[11px] text-stone-500 mt-0.5 italic">"{res.notes}"</p>}
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-md font-semibold capitalize ${
                      res.status === 'confirmed'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {res.status}
                  </span>
                  {res.status === 'confirmed' && (
                    <button
                      onClick={() => cancelFacilityReservation(res.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reservation Dialog Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-50">
              <div>
                <h3 className="text-base font-serif font-bold">Reserve Facility Access</h3>
                <p className="text-xs text-stone-300">{selectedFacility.title} · Room {currentRoom.roomNumber}</p>
              </div>
              <button
                onClick={() => setSelectedFacility(null)}
                className="p-1 text-stone-400 hover:text-white rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4 text-xs">
              {/* Date */}
              <div>
                <label className="font-semibold text-stone-800 block mb-1">Reservation Date</label>
                <input
                  type="date"
                  value={resDate}
                  onChange={(e) => setResDate(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                />
              </div>

              {/* Time Slots */}
              <div>
                <label className="font-semibold text-stone-800 block mb-1">Select Time Window</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedFacility.slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                        selectedSlot === slot
                          ? 'border-amber-600 bg-amber-50 text-stone-900 shadow-2xs font-semibold'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Count */}
              <div>
                <label className="font-semibold text-stone-800 block mb-1">Number of Guests</label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests (Standard)</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests (Cabana Max)</option>
                </select>
              </div>

              {/* Special Requests */}
              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Special Notes or Seating Preference
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prefer front-row sunset daybed, anniversary surprise..."
                  value={resNotes}
                  onChange={(e) => setResNotes(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-600 text-[11px] leading-relaxed">
                Notice: Cancellations may be made up to 1 hour before scheduled slot. Towels and infused refreshments are provided complimentary.
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-stone-100/80 border-t border-stone-200">
              <button
                onClick={() => setSelectedFacility(null)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-200 font-semibold rounded-lg text-xs transition-colors shadow-xs"
              >
                Confirm Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
