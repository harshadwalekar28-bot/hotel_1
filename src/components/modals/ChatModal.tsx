import React, { useState, useRef, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  MessageSquare,
  Send,
  Building,
  User,
  X,
} from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const { currentRoom, chatMessages, sendChatMessage, isReceptionTyping } = useHotel();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, chatMessages, isReceptionTyping]);

  if (!isOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText.trim(), true);
    setInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    sendChatMessage(prompt, true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl h-[85vh] bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-100 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-serif font-bold text-sm">
                AH
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-stone-900"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-semibold text-base text-white">Front Desk Concierge Desk</h3>
                <span className="text-[10px] text-emerald-400 font-medium bg-emerald-950/60 px-1.5 py-0.2 rounded-xs border border-emerald-800">
                  Online
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Assisting Room {currentRoom.roomNumber} ({currentRoom.guestName})
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

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-stone-400 text-[11px] font-semibold whitespace-nowrap pl-1">
            Quick Prompts:
          </span>
          <button
            onClick={() => handleQuickPrompt('Request fresh bath towels for Room ' + currentRoom.roomNumber)}
            className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-md font-medium text-stone-700 whitespace-nowrap transition-colors"
          >
            Extra towels
          </button>
          <button
            onClick={() => handleQuickPrompt('Could I request a late checkout until 1:30 PM tomorrow?')}
            className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-md font-medium text-stone-700 whitespace-nowrap transition-colors"
          >
            Late checkout
          </button>
          <button
            onClick={() => handleQuickPrompt('What is the WiFi network password for our suite?')}
            className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-md font-medium text-stone-700 whitespace-nowrap transition-colors"
          >
            WiFi password
          </button>
          <button
            onClick={() => handleQuickPrompt('Can you arrange luggage assistance for our departure?')}
            className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-md font-medium text-stone-700 whitespace-nowrap transition-colors"
          >
            Luggage pickup
          </button>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-stone-50/40">
          {chatMessages.map((msg) => {
            const isGuest = msg.sender === 'guest';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isGuest ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                    isGuest ? 'bg-amber-100 text-amber-900' : 'bg-stone-900 text-stone-200'
                  }`}
                >
                  {isGuest ? <User className="w-3.5 h-3.5" /> : <Building className="w-3.5 h-3.5" />}
                </div>

                <div className="space-y-1">
                  <div
                    className={`flex items-center gap-2 text-[10px] text-stone-400 ${
                      isGuest ? 'justify-end' : ''
                    }`}
                  >
                    <span className="font-semibold text-stone-700">{msg.senderName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                      isGuest
                        ? 'bg-amber-900 text-white rounded-tr-xs shadow-2xs'
                        : 'bg-white text-stone-800 border border-stone-200/80 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}

          {isReceptionTyping && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-7 h-7 rounded-full bg-stone-900 text-stone-200 flex items-center justify-center shrink-0 text-xs">
                <Building className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 bg-white border border-stone-200/80 rounded-xl rounded-tl-xs text-xs text-stone-500 flex items-center gap-1.5 shadow-2xs">
                <span>Concierge is typing</span>
                <span className="inline-flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-stone-200 flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a request to Front Desk Concierge..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 text-stone-900"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-amber-200 font-semibold text-xs rounded-lg transition-colors shadow-2xs"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
