import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { NEARBY_PLACES } from '../../data/hotelData';
import { NearbyPlace } from '../../types/hotel';
import {
  MapPin,
  Clock,
  Compass,
  Car,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export const NearbyPlaces: React.FC = () => {
  const { currentRoom, setActiveGuestTab, sendChatMessage } = useHotel();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [chauffeurSuccess, setChauffeurSuccess] = useState<string | null>(null);

  const filteredPlaces = NEARBY_PLACES.filter((place) => {
    if (selectedFilter === 'all') return true;
    return place.category === selectedFilter;
  });

  const handleRequestChauffeur = (place: NearbyPlace) => {
    setActiveGuestTab('chat');
    sendChatMessage(
      `Hello Concierge, I would like to arrange private hotel chauffeur transport to "${place.name}" (${place.distance} away) for Room ${currentRoom.roomNumber}. What times are available?`,
      true
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          Concierge Local Guide
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
          Nearby Destinations & Experiences
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
          Curated secret coves, artisan vineyards, and historic promenades hand-selected by the Aura Haven concierge team.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            selectedFilter === 'all'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-950'
          }`}
        >
          All Destinations ({NEARBY_PLACES.length})
        </button>
        <button
          onClick={() => setSelectedFilter('beaches')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            selectedFilter === 'beaches'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-950'
          }`}
        >
          Beaches & Sea Caves
        </button>
        <button
          onClick={() => setSelectedFilter('culture')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            selectedFilter === 'culture'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-950'
          }`}
        >
          Historic Town & Parks
        </button>
        <button
          onClick={() => setSelectedFilter('dining')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            selectedFilter === 'dining'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-950'
          }`}
        >
          Vineyards & Dining
        </button>
        <button
          onClick={() => setSelectedFilter('adventure')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            selectedFilter === 'adventure'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-950'
          }`}
        >
          Scenic Coastal Trails
        </button>
      </div>

      {/* Places Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPlaces.map((place) => (
          <div
            key={place.id}
            className="bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Media Container with measured scrim */}
              <div className="relative h-56 w-full bg-stone-100 overflow-hidden">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-600"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent pointer-events-none" />

                {/* Badges and metadata */}
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 text-[11px] text-amber-300 font-medium">
                    <span>{place.distance}</span>
                    <span aria-hidden="true">·</span>
                    <span>{place.travelTime}</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white mt-0.5 drop-shadow-xs">
                    {place.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-stone-600 leading-relaxed">{place.description}</p>

                {/* Highlights */}
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-1.5">
                    Signature Highlights
                  </p>
                  <ul className="space-y-1">
                    {place.highlights.map((hl) => (
                      <li key={hl} className="flex items-center gap-2 text-xs text-stone-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0"></span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Concierge Insider Tip Box */}
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-amber-900 block">
                      Concierge Recommendation
                    </span>
                    <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                      {place.conciergeTip}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 pt-0 mt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">{place.hours}</span>
              <button
                onClick={() => handleRequestChauffeur(place)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-200 font-semibold rounded-md transition-colors"
              >
                <Car className="w-3.5 h-3.5" />
                <span>Request Chauffeur / Shuttle</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
