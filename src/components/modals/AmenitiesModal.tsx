import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { RESOURCE_ITEMS } from '../../data/hotelData';
import {
  Sparkles,
  Check,
  Clock,
  Send,
  X,
  Plus,
  Minus,
  CheckCircle2,
} from 'lucide-react';

interface AmenitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AmenitiesModal: React.FC<AmenitiesModalProps> = ({ isOpen, onClose }) => {
  const { currentRoom, submitOrderRequest } = useHotel();
  const [selectedItems, setSelectedItems] = useState<{ [id: string]: number }>({});
  const [notes, setNotes] = useState('');
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const amenityItems = RESOURCE_ITEMS.filter(
    (item) => item.category === 'linens' || item.category === 'amenities' || item.category === 'comfort'
  );

  const handleToggleItem = (itemId: string, qty: number) => {
    setSelectedItems((prev) => {
      const copy = { ...prev };
      if (qty <= 0) {
        delete copy[itemId];
      } else {
        copy[itemId] = qty;
      }
      return copy;
    });
  };

  const handleRequestAll = () => {
    const keys = Object.keys(selectedItems);
    if (keys.length === 0) return;

    // Build synthetic request
    const cartItems = keys.map((k) => ({
      item: amenityItems.find((i) => i.id === k)!,
      quantity: selectedItems[k],
    }));

    // Place via context
    const req = submitOrderRequest(
      notes || 'Complimentary room amenities and linens requested.',
      'standard'
    );

    setRequestSuccess(req.id);
    setSelectedItems({});
    setNotes('');
    setTimeout(() => {
      setRequestSuccess(null);
      onClose();
    }, 2500);
  };

  const totalItemsCount = Object.values(selectedItems).reduce((sum, q) => sum + q, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-100 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">Room Amenities & Linens</h3>
              <p className="text-xs text-stone-300">
                Complimentary room essentials dispatched to Room {currentRoom.roomNumber}
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

        {/* Success Notice */}
        {requestSuccess && (
          <div className="p-4 bg-emerald-50 border-b border-emerald-200 flex items-center gap-3 animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-900">
                Amenities Request #{requestSuccess} Dispatched!
              </p>
              <p className="text-[11px] text-emerald-700">
                Housekeeping has been dispatched with your items to Room {currentRoom.roomNumber}.
              </p>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {amenityItems.map((item) => {
              const currentQty = selectedItems[item.id] || 0;
              const isSelected = currentQty > 0;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-50/50 border-amber-500/60 shadow-xs'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100/60'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif font-bold text-sm text-stone-900 leading-snug">
                        {item.title}
                      </h4>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                        Free
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mt-2">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>Delivery in ~{item.estimatedMinutes} min</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 font-medium capitalize">
                      {item.category}
                    </span>

                    {isSelected ? (
                      <div className="flex items-center gap-1 bg-white rounded-md p-0.5 border border-stone-300">
                        <button
                          onClick={() => handleToggleItem(item.id, currentQty - 1)}
                          className="p-1 text-stone-600 hover:text-stone-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold px-1.5">{currentQty}</span>
                        <button
                          onClick={() => handleToggleItem(item.id, currentQty + 1)}
                          className="p-1 text-stone-600 hover:text-stone-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleToggleItem(item.id, 1)}
                        className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-md text-xs font-semibold transition-colors"
                      >
                        Request
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Note Input */}
          <div className="pt-4 border-t border-stone-200">
            <label className="text-xs font-semibold text-stone-800 block mb-1">
              Delivery Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Please leave at door, guest resting, extra hanger needed..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-800"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-medium">
            {totalItemsCount > 0 ? `${totalItemsCount} item(s) selected` : 'Select items to request delivery'}
          </span>
          <button
            onClick={handleRequestAll}
            disabled={totalItemsCount === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed text-amber-200 font-semibold text-xs rounded-lg transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Request to Room {currentRoom.roomNumber}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
