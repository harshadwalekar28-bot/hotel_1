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
  X,
  CheckCircle2,
} from 'lucide-react';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ isOpen, onClose }) => {
  const { currentRoom, submitMaintenanceTicket } = useHotel();
  const [category, setCategory] = useState<MaintenanceCategory>('ac_climate');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<MaintenanceUrgency>('standard');
  const [preferredTime, setPreferredTime] = useState('Morning (09:00 AM - 12:00 PM)');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories: { id: MaintenanceCategory; label: string; icon: any }[] = [
    { id: 'ac_climate', label: 'AC & Climate', icon: ThermometerSnowflake },
    { id: 'plumbing_water', label: 'Plumbing & Water', icon: Droplets },
    { id: 'tv_entertainment', label: 'TV & Audio', icon: Tv },
    { id: 'electrical_lighting', label: 'Lighting & Power', icon: Zap },
    { id: 'keycard_lock', label: 'Keycard & Locks', icon: KeyRound },
    { id: 'furniture_fixtures', label: 'Furniture & Fixtures', icon: Hammer },
    { id: 'other', label: 'Other Concern', icon: HelpCircle },
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

    setSubmittedId(ticket.id);
    setSummary('');
    setDescription('');
    setTimeout(() => {
      setSubmittedId(null);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-100 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">Room Assistance & Maintenance</h3>
              <p className="text-xs text-stone-300">
                Direct dispatch to on-duty engineering for Room {currentRoom.roomNumber}
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

        {/* Success */}
        {submittedId && (
          <div className="p-4 bg-emerald-50 border-b border-emerald-200 flex items-center gap-3 animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-900">
                Work Order #{submittedId} Registered!
              </p>
              <p className="text-[11px] text-emerald-700">
                Engineering will attend Room {currentRoom.roomNumber} according to your schedule.
              </p>
            </div>
          </div>
        )}

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-stone-800 block mb-1.5">Select Issue Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-amber-50 border-amber-600 text-stone-900 font-bold'
                        : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-700' : 'text-stone-400'}`} />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="font-semibold text-stone-800 block mb-1">Issue Summary</label>
            <input
              type="text"
              required
              placeholder="e.g. AC fan making a whistling noise when on cool"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-800 block mb-1">Additional Details (Optional)</label>
            <textarea
              rows={2}
              placeholder="Any details to help technician bring the right tools..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as MaintenanceUrgency)}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
              >
                <option value="low">Low Priority</option>
                <option value="standard">Standard Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-stone-800 block mb-1">Preferred Timing</label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
              >
                <option value="Immediate / As Soon As Possible">Immediate / As Soon As Possible</option>
                <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                <option value="Afternoon (01:00 PM - 05:00 PM)">Afternoon (01:00 PM - 05:00 PM)</option>
                <option value="While Away From Room">While I am out</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-200 font-semibold rounded-lg shadow-xs"
            >
              Submit Work Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
