import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { RESOURCE_ITEMS } from '../../data/hotelData';
import {
  UtensilsCrossed,
  Search,
  Plus,
  Minus,
  Check,
  Clock,
  ShoppingBag,
  Trash2,
  X,
  Send,
  CheckCircle2,
} from 'lucide-react';

interface DiningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiningModal: React.FC<DiningModalProps> = ({ isOpen, onClose }) => {
  const { currentRoom, cart, addToCart, removeFromCart, updateCartQuantity, cartTotal, submitOrderRequest } = useHotel();
  const [activeTab, setActiveTab] = useState<'all' | 'breakfast' | 'dining' | 'drinks'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const diningItems = RESOURCE_ITEMS.filter(
    (item) => item.category === 'breakfast' || item.category === 'dining' || item.category === 'drinks'
  );

  const filteredItems = diningItems.filter((item) => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const req = submitOrderRequest(specialNotes);
    setOrderSuccess(req.id);
    setSpecialNotes('');
    setTimeout(() => {
      setOrderSuccess(null);
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
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">In-Room Gourmet Dining</h3>
              <p className="text-xs text-stone-300">
                Delivered directly to Room {currentRoom.roomNumber} ({currentRoom.guestName})
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

        {/* Filter & Search Bar */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-lg w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                activeTab === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setActiveTab('breakfast')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                activeTab === 'breakfast' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Breakfast & Brunch
            </button>
            <button
              onClick={() => setActiveTab('dining')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                activeTab === 'dining' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All-Day Mains
            </button>
            <button
              onClick={() => setActiveTab('drinks')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                activeTab === 'drinks' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Drinks & Cellar
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search dishes or drinks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 text-stone-900"
            />
          </div>
        </div>

        {/* Success Notice */}
        {orderSuccess && (
          <div className="p-4 bg-emerald-50 border-b border-emerald-200 flex items-center gap-3 animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-900">
                Order #{orderSuccess} placed successfully!
              </p>
              <p className="text-[11px] text-emerald-700">
                The culinary team has received your order. Delivery to Room {currentRoom.roomNumber} in ~25 min.
              </p>
            </div>
          </div>
        )}

        {/* Modal Body: Split view with Items Catalog and Cart */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Items (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const cartEntry = cart.find((c) => c.item.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 hover:border-amber-400/60 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif font-bold text-sm text-stone-900 leading-snug">
                          {item.title}
                        </h4>
                        <span className="font-mono font-bold text-xs text-stone-900 tabular-nums">
                          ${item.price}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-2">
                        <span className="capitalize">{item.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-amber-600" />
                          ~{item.estimatedMinutes} min
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-end">
                      {cartEntry ? (
                        <div className="flex items-center gap-1.5 bg-white rounded-md p-0.5 border border-stone-300">
                          <button
                            onClick={() => updateCartQuantity(item.id, cartEntry.quantity - 1)}
                            className="p-1 text-stone-600 hover:text-stone-900"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs font-bold px-1 tabular-nums">
                            {cartEntry.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, cartEntry.quantity + 1)}
                            className="p-1 text-stone-600 hover:text-stone-900"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-stone-900 rounded-md transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Order Basket */}
          <div className="bg-stone-50 rounded-xl border border-stone-200 p-4 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 border-b border-stone-200 pb-2 mb-3">
                <ShoppingBag className="w-4 h-4 text-amber-700" />
                <h4 className="font-serif font-bold text-sm text-stone-900">Your Room Basket</h4>
              </div>

              {cart.length === 0 ? (
                <div className="py-8 text-center text-stone-400 text-xs">
                  <p>Your basket is empty.</p>
                  <p className="text-[11px] text-stone-400 mt-1">Select items from the menu to build your order.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                  {cart.map((entry) => (
                    <div key={entry.item.id} className="flex items-center justify-between text-xs gap-2">
                      <div className="flex-1 truncate">
                        <span className="font-semibold text-stone-800">{entry.item.title}</span>
                        <span className="text-[11px] text-stone-500 block">
                          ${entry.item.price} x {entry.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateCartQuantity(entry.item.id, entry.quantity - 1)}
                          className="p-0.5 text-stone-500 hover:text-stone-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-xs px-1">{entry.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(entry.item.id, entry.quantity + 1)}
                          className="p-0.5 text-stone-500 hover:text-stone-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-200">
                  <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                    Special Preparation / Dietary Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Poached eggs soft, extra napkins..."
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg text-stone-800"
                  />
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="mt-4 pt-3 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600">Total Charged to Folio</span>
                  <span className="font-mono text-base font-bold text-stone-900 tabular-nums">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-amber-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Order to Room {currentRoom.roomNumber}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
