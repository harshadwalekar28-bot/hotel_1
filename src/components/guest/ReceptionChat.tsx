import React, { useState, useRef, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Send,
  MessageSquare,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCheck,
  Building,
  User,
  CornerDownLeft,
} from 'lucide-react';

export const ReceptionChat: React.FC = () => {
  const { currentRoom, chatMessages, sendChatMessage, isReceptionTyping } = useHotel();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isReceptionTyping]);

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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          Front Desk Messaging
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
          Chat with Reception & Concierge
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Connected to the 24/7 Front Desk team for Room{' '}
          <span className="font-semibold text-stone-900">{currentRoom.roomNumber}</span>. Typical response time is under 1 minute.
        </p>
      </div>

      {/* Main Chat Box Container */}
      <div className="bg-white rounded-xl border border-stone-200/90 shadow-2xs overflow-hidden flex flex-col h-[580px]">
        {/* Chat Header Bar */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-serif font-bold text-sm">
                AH
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-stone-900"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-semibold text-sm">Front Desk Concierge Desk</span>
                <span className="text-[10px] text-emerald-400 font-medium bg-emerald-950/60 px-1.5 py-0.2 rounded-xs border border-emerald-800">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Assisting {currentRoom.guestName} · Room {currentRoom.roomNumber} ({currentRoom.roomType})
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-stone-400 block font-mono">Direct Dial: Ext 0</span>
            <span className="text-[10px] text-amber-300">Duty Manager: Jean-Luc</span>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3 bg-stone-50 border-b border-stone-100 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
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
            onClick={() => handleQuickPrompt('Could you please book a table for 2 at the Rooftop Lounge at 8:00 PM?')}
            className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-md font-medium text-stone-700 whitespace-nowrap transition-colors"
          >
            Rooftop reservation
          </button>
          <button
            onClick={() => handleQuickPrompt('Can you arrange luggage assistance for our departure?')}
            className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-md font-medium text-stone-700 whitespace-nowrap transition-colors"
          >
            Luggage pickup
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-stone-50/40">
          {chatMessages.map((msg) => {
            const isGuest = msg.sender === 'guest';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isGuest ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                    isGuest ? 'bg-amber-100 text-amber-900' : 'bg-stone-900 text-stone-200'
                  }`}
                >
                  {isGuest ? <User className="w-3.5 h-3.5" /> : <Building className="w-3.5 h-3.5" />}
                </div>

                {/* Bubble */}
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

          {/* Typing Indicator */}
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
            placeholder="Type a request or inquiry to Front Desk Reception..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-stone-900 placeholder:text-stone-400 transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed text-amber-200 font-semibold text-xs rounded-lg transition-colors shadow-2xs"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
