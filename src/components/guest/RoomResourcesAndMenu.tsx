import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { RESOURCE_ITEMS } from '../../data/hotelData';
import { ResourceCategory, ResourceItem } from '../../types/hotel';
import {
  UtensilsCrossed,
  Sparkles,
  Coffee,
  Wine,
  Search,
  Plus,
  Minus,
  Check,
  Clock,
  ShoppingBag,
  Trash2,
  X,
  Send,
  Bed,
  CheckCircle2,
} from 'lucide-react';

export const RoomResourcesAndMenu: React.FC = () => {
  const {
    currentRoom,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    cartItemCount,
    isCartOpen,
    setIsCartOpen,
    submitOrderRequest,
    requests,
  } = useHotel();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  // Filter items
  const filteredItems = RESOURCE_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'food' && (item.category === 'breakfast' || item.category === 'dining')) ||
      (selectedCategory === 'drinks' && item.category === 'drinks') ||
      (selectedCategory === 'linens' && item.category === 'linens') ||
      (selectedCategory === 'amenities' && (item.category === 'amenities' || item.category === 'comfort'));

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const req = submitOrderRequest(specialNotes);
    setOrderSuccessId(req.id);
    setSpecialNotes('');
    setTimeout(() => {
      setOrderSuccessId(null);
    }, 5000);
  };

  // Recent requests for this room
  const roomRequests = requests.filter((r) => r.roomNumber === currentRoom.roomNumber);

  return (
    <div className="space-y-8">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
            In-Room Catalog
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Dining & Room Resources
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Order fresh breakfast, artisan dinner, extra pillows, towels, or adapters delivered straight to Room{' '}
            <span className="font-semibold text-stone-900">{currentRoom.roomNumber}</span>.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search food, towels, pillows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-stone-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Interactive Category Filter Tabs (Zero-pill compliant segmented buttons) */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-950'
          }`}
        >
          All Resources ({RESOURCE_ITEMS.length})
        </button>
        <button
          onClick={() => setSelectedCategory('food')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            selectedCategory === 'food'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-950'
          }`}
        >
          Gourmet Dining & Breakfast
        </button>
        <button
          onClick={() => setSelectedCategory('drinks')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            selectedCategory === 'drinks'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-950'
          }`}
        >
          Cocktails, Coffee & Wine
        </button>
        <button
          onClick={() => setSelectedCategory('linens')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            selectedCategory === 'linens'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-950'
          }`}
        >
          Towels & Linens (Free)
        </button>
        <button
          onClick={() => setSelectedCategory('amenities')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            selectedCategory === 'amenities'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-950'
          }`}
        >
          Amenities & Travel Adapters
        </button>
      </div>

      {/* Success Notification Alert */}
      {orderSuccessId && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-xs font-bold text-emerald-900">
                Order #{orderSuccessId} sent to Room {currentRoom.roomNumber}!
              </p>
              <p className="text-[11px] text-emerald-700">
                The service dispatch desk has logged your request. You can also view it in the Staff Console.
              </p>
            </div>
          </div>
          <button
            onClick={() => setOrderSuccessId(null)}
            className="text-xs font-medium text-emerald-800 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid of Resource Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const cartEntry = cart.find((c) => c.item.id === item.id);
          const isFoodOrDrink = item.category === 'breakfast' || item.category === 'dining' || item.category === 'drinks';

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Visual Header / Image Slot with Zero-broken image fallback */}
                <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                  {item.category === 'breakfast' || item.category === 'dining' ? (
                    <img
                      src="/src/assets/images/hotel_dining_spread_1790868888210.jpg"
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : item.category === 'linens' || item.category === 'comfort' ? (
                    <img
                      src="/src/assets/images/hotel_suite_room_1790868874111.jpg"
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4 text-center">
                      {item.category === 'drinks' ? (
                        <Wine className="w-8 h-8 text-amber-700/60 mb-2" />
                      ) : (
                        <Sparkles className="w-8 h-8 text-stone-500 mb-2" />
                      )}
                      <span className="text-xs font-serif text-stone-600">{item.title}</span>
                    </div>
                  )}

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent pointer-events-none" />

                  {/* Top Tags - Unboxed Text with typographic separator */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white font-medium drop-shadow-xs">
                    <span className="capitalize">{item.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-300" />
                      <span className="tabular-nums font-mono">~{item.estimatedMinutes} min</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-serif font-bold text-stone-900 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {/* Dietary notes */}
                  {item.dietary && (
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
                      {item.dietary.map((d, i) => (
                        <React.Fragment key={d}>
                          <span>{d}</span>
                          {i < item.dietary!.length - 1 && <span aria-hidden="true">·</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action Area */}
              <div className="p-4 pt-0 mt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                <div>
                  {item.isComplimentary ? (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                      Complimentary
                    </span>
                  ) : (
                    <span className="font-mono text-base font-bold text-stone-900 tabular-nums">
                      ${item.price}
                    </span>
                  )}
                </div>

                {cartEntry ? (
                  <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                    <button
                      onClick={() => updateCartQuantity(item.id, cartEntry.quantity - 1)}
                      className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-sm transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-semibold text-xs text-stone-900 px-1.5 tabular-nums">
                      {cartEntry.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, cartEntry.quantity + 1)}
                      className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-sm transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-900 bg-amber-100 hover:bg-amber-200 rounded-md transition-colors shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{item.isComplimentary ? 'Request Item' : 'Add to Order'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Orders History for Room 402 */}
      {roomRequests.length > 0 && (
        <div className="mt-12 bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base font-serif font-bold text-stone-900">
                Recent Orders for Room {currentRoom.roomNumber}
              </h3>
              <p className="text-xs text-stone-500">Live request status directly updated by hotel dispatch staff</p>
            </div>
            <span className="text-xs text-stone-500 font-mono tabular-nums">
              {roomRequests.length} total request{roomRequests.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {roomRequests.map((req) => (
              <div key={req.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-stone-900">{req.id}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-stone-500 font-mono tabular-nums">{req.createdAt}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize text-stone-600">{req.type}</span>
                  </div>
                  <p className="text-xs font-medium text-stone-800">
                    {req.items.map((i) => `${i.quantity}x ${i.item.title}`).join(', ')}
                  </p>
                  {req.notes && <p className="text-[11px] text-stone-500 italic">"{req.notes}"</p>}
                </div>

                <div className="flex items-center gap-3">
                  {req.totalAmount > 0 ? (
                    <span className="font-mono text-xs font-bold text-stone-900 tabular-nums">
                      ${req.totalAmount}
                    </span>
                  ) : (
                    <span className="text-xs text-stone-500 font-medium">Complimentary</span>
                  )}
                  <span
                    className={`text-xs px-2.5 py-1 rounded-md font-semibold capitalize ${
                      req.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : req.status === 'in_progress'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                        : 'bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                  >
                    {req.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slide-out Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-serif font-bold text-base">Room Request Basket</h3>
                  <p className="text-xs text-stone-300">
                    Delivering to Room {currentRoom.roomNumber} ({currentRoom.guestName})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 text-stone-400 hover:text-white rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-stone-500 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium">Your request basket is empty</p>
                  <p className="text-xs text-stone-400">
                    Select in-room dining dishes, fresh linens, extra pillows, or toiletries to request delivery.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100 space-y-3">
                  {cart.map((entry) => (
                    <div key={entry.item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-xs font-semibold text-stone-900">{entry.item.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                          {entry.item.isComplimentary ? (
                            <span className="text-emerald-700 font-medium">Complimentary</span>
                          ) : (
                            <span className="font-mono font-medium text-stone-800 tabular-nums">
                              ${entry.item.price} each
                            </span>
                          )}
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">~{entry.item.estimatedMinutes} min</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-stone-100 rounded-md p-0.5 border border-stone-200">
                          <button
                            onClick={() => updateCartQuantity(entry.item.id, entry.quantity - 1)}
                            className="p-1 text-stone-600 hover:text-stone-900"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs font-semibold px-1 tabular-nums">
                            {entry.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(entry.item.id, entry.quantity + 1)}
                            className="p-1 text-stone-600 hover:text-stone-900"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(entry.item.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Special Instructions & Notes */}
              {cart.length > 0 && (
                <div className="mt-6 pt-4 border-t border-stone-200 space-y-2">
                  <label className="text-xs font-semibold text-stone-800">
                    Delivery Instructions or Dietary Notes
                  </label>
                  <textarea
                    rows={2}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Please knock gently, leave items on balcony table, extra ice..."
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-stone-800"
                  />
                  <p className="text-[11px] text-stone-500">
                    Estimated service delivery to Floor {currentRoom.floor}: 20–30 minutes
                  </p>
                </div>
              )}
            </div>

            {/* Drawer Footer & Checkout Button */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
                <div className="flex items-center justify-between text-xs font-medium text-stone-600">
                  <span>Room Folio Total</span>
                  <span className="font-mono text-base font-bold text-stone-900 tabular-nums">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Complimentary amenities are free. Paid dining items are billed directly to your room folio.
                </p>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-amber-200 rounded-lg font-semibold text-xs transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Place Request to Room {currentRoom.roomNumber}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
