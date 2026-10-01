import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { MaintenanceCategory, MaintenanceUrgency } from '../../types/hotel';
import {
  Wrench,
  ThermometerSnowflake,
  Droplets,
  Tv,
  Zap,
  KeyRound,
  Hammer,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';

export const MaintenanceRequestForm: React.FC = () => {
  const { currentRoom, submitMaintenanceTicket, maintenanceTickets } = useHotel();

  const [category, setCategory] = useState<MaintenanceCategory>('ac_climate');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<MaintenanceUrgency>('standard');
  const [preferredTime, setPreferredTime] = useState('Morning (09:00 AM - 12:00 PM)');
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  const categories: { id: MaintenanceCategory; label: string; icon: any; placeholder: string }[] = [
    {
      id: 'ac_climate',
      label: 'AC & Climate',
      icon: ThermometerSnowflake,
      placeholder: 'e.g. AC fan blowing warm or making whistling noise',
    },
    {
      id: 'plumbing_water',
      label: 'Plumbing & Water',
      icon: Droplets,
      placeholder: 'e.g. Shower drain emptying slowly, water pressure low',
    },
    {
      id: 'tv_entertainment',
      label: 'TV & Audio',
      icon: Tv,
      placeholder: 'e.g. Samsung remote control unlinked, no signal on HDMI',
    },
    {
      id: 'electrical_lighting',
      label: 'Lights & Power',
      icon: Zap,
      placeholder: 'e.g. Bedside reading lamp flickering, USB outlet inactive',
    },
    {
      id: 'keycard_lock',
      label: 'Keycard & Locks',
      icon: KeyRound,
      placeholder: 'e.g. Balcony sliding door lock stiff, RFID reader flashing red',
    },
    {
      id: 'furniture_fixtures',
      label: 'Furniture & Decor',
      icon: Hammer,
      placeholder: 'e.g. Wardrobe door sticking, balcony umbrella tilted',
    },
    {
      id: 'other',
      label: 'Other Assistance',
      icon: HelpCircle,
      placeholder: 'Describe any other technical or room fixture concern',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;

    const ticket = submitMaintenanceTicket({
      roomNumber: currentRoom.roomNumber,
      guestName: currentRoom.guestName,
      category,
      summary: summary.trim(),
      description: description.trim() || summary.trim(),
      urgency,
      preferredTime,
      reportedBy: `Guest (Room ${currentRoom.roomNumber})`,
    });

    setSubmittedTicketId(ticket.id);
    setSummary('');
    setDescription('');
  };

  // Tickets for this room
  const myRoomTickets = maintenanceTickets.filter((t) => t.roomNumber === currentRoom.roomNumber);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          Engineering & Housekeeping
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
          Report In-Room Maintenance
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Notice an issue with air conditioning, water pressure, lighting, or technology? Our on-duty certified engineering team responds promptly.
        </p>
      </div>

      {/* Success banner */}
      {submittedTicketId && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-900">
                Maintenance Work Order #{submittedTicketId} Dispatched!
              </p>
              <p className="text-[11px] text-emerald-700">
                Our Chief Engineer has been notified for Room {currentRoom.roomNumber}. A technician will arrive within your preferred window.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSubmittedTicketId(null)}
            className="text-xs text-emerald-800 font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200/90 shadow-2xs p-6 space-y-6">
        {/* Category Picker */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
            1. Select Issue Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-lg border text-left flex flex-col items-start gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-amber-50 border-amber-600 text-stone-900 shadow-2xs font-semibold'
                      : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-600'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-700' : 'text-stone-400'}`} />
                  <span className="text-xs">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Issue Summary */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
            2. Issue Summary
          </label>
          <input
            type="text"
            required
            placeholder={categories.find((c) => c.id === category)?.placeholder || 'Brief summary of the issue'}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-stone-900"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
            3. Detailed Description (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Please provide any additional context (e.g. started this morning, happens when setting thermostat to 20°C)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-stone-900"
          />
        </div>

        {/* Urgency & Preferred Timing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
              Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUrgency('low')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                  urgency === 'low'
                    ? 'bg-stone-100 border-stone-400 text-stone-900'
                    : 'bg-white border-stone-200 text-stone-600'
                }`}
              >
                Low
              </button>
              <button
                type="button"
                onClick={() => setUrgency('standard')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                  urgency === 'standard'
                    ? 'bg-amber-50 border-amber-500 text-amber-900'
                    : 'bg-white border-stone-200 text-stone-600'
                }`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setUrgency('urgent')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                  urgency === 'urgent'
                    ? 'bg-rose-50 border-rose-500 text-rose-900'
                    : 'bg-white border-stone-200 text-stone-600'
                }`}
              >
                Urgent
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
              Preferred Visit Window
            </label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-800"
            >
              <option value="Immediate / As Soon As Possible">Immediate / As Soon As Possible</option>
              <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
              <option value="Afternoon (01:00 PM - 05:00 PM)">Afternoon (01:00 PM - 05:00 PM)</option>
              <option value="While Away From Room">While I am out of the room</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Reporting for Room {currentRoom.roomNumber} ({currentRoom.guestName})
          </span>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-200 font-semibold text-xs rounded-lg transition-colors shadow-xs"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-300" />
            <span>Submit Maintenance Work Order</span>
          </button>
        </div>
      </form>

      {/* Existing Tickets for Room 402 */}
      {myRoomTickets.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base font-serif font-bold text-stone-900">
                Reported Issues for Room {currentRoom.roomNumber}
              </h3>
              <p className="text-xs text-stone-500">Engineering ticket progress</p>
            </div>
            <span className="text-xs text-stone-500 font-mono tabular-nums">
              {myRoomTickets.length} ticket{myRoomTickets.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {myRoomTickets.map((t) => (
              <div key={t.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-stone-900">{t.id}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-stone-500 font-mono tabular-nums">{t.reportedAt}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize text-stone-600">{t.category.replace('_', ' ')}</span>
                  </div>
                  <p className="text-xs font-semibold text-stone-900">{t.summary}</p>
                  <p className="text-[11px] text-stone-500">
                    Window: {t.preferredTime} · Technician: {t.assignedTechnician || 'Dispatching'}
                  </p>
                  {t.resolutionNotes && (
                    <p className="text-[11px] text-emerald-800 bg-emerald-50 p-1.5 rounded-sm mt-1">
                      Resolution: {t.resolutionNotes}
                    </p>
                  )}
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-semibold capitalize self-start sm:self-auto ${
                    t.status === 'resolved'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : t.status === 'investigating'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
