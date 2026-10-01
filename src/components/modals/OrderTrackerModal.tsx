import React from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Clock,
  CheckCircle2,
  X,
  ChefHat,
  Truck,
  Check,
  Building,
  User,
} from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ isOpen, onClose }) => {
  const { currentRoom, requests } = useHotel();

  if (!isOpen) return null;

  // Find active or most recent request for this room
  const activeReq =
    requests.find((r) => r.roomNumber === currentRoom.roomNumber && (r.status === 'pending' || r.status === 'in_progress')) ||
    requests.find((r) => r.roomNumber === currentRoom.roomNumber) ||
    requests[0];

  const steps = [
    { title: 'Order Received', icon: CheckCircle2, completed: true },
    {
      title: 'In Preparation',
      icon: ChefHat,
      completed: activeReq?.status === 'in_progress' || activeReq?.status === 'delivered',
      current: activeReq?.status === 'in_progress',
    },
    {
      title: 'En Route to Room',
      icon: Truck,
      completed: activeReq?.status === 'delivered',
    },
    {
      title: 'Delivered',
      icon: Check,
      completed: activeReq?.status === 'delivered',
      current: activeReq?.status === 'delivered',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-100 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">Order Status Tracker</h3>
              <p className="text-xs text-stone-300">
                Request {activeReq?.id || '#REQ-8021'} · Room {currentRoom.roomNumber}
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

        {/* Body */}
        <div className="p-6 space-y-6 text-xs">
          {/* Status Step Progression Bar */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="flex-1 flex flex-col items-center text-center relative">
                    {/* Connecting line */}
                    {idx < steps.length - 1 && (
                      <div
                        className={`absolute top-4 left-1/2 w-full h-0.5 z-0 ${
                          step.completed ? 'bg-amber-600' : 'bg-stone-200'
                        }`}
                      />
                    )}
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step.completed
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-white border-2 border-stone-300 text-stone-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] mt-1.5 font-semibold ${
                        step.completed ? 'text-stone-900' : 'text-stone-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details */}
          {activeReq && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="font-semibold text-stone-700">Requested Items</span>
                <span className="font-mono text-stone-500 tabular-nums">
                  Placed at {activeReq.createdAt}
                </span>
              </div>

              <div className="divide-y divide-stone-100 max-h-40 overflow-y-auto">
                {activeReq.items.map((i, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-stone-900">
                        {i.quantity}x {i.item.title}
                      </span>
                      {i.specialInstructions && (
                        <p className="text-[11px] text-stone-500 italic">{i.specialInstructions}</p>
                      )}
                    </div>
                    <span className="font-mono font-bold text-stone-900">
                      {i.item.price > 0 ? `$${(i.item.price * i.quantity).toFixed(2)}` : 'Free'}
                    </span>
                  </div>
                ))}
              </div>

              {activeReq.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-amber-900">
                  <span className="font-semibold block text-[11px]">Guest Delivery Note:</span>
                  <p className="italic text-[11px] mt-0.5">"{activeReq.notes}"</p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-stone-600">
                <span>Assigned Staff:</span>
                <span className="font-semibold text-stone-900">{activeReq.assignedStaff}</span>
              </div>

              <div className="flex items-center justify-between text-stone-600">
                <span>Estimated Arrival:</span>
                <span className="font-semibold text-amber-900">~15–20 minutes to Suite {currentRoom.roomNumber}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-xs rounded-lg transition-colors"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
