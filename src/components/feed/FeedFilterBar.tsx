'use client';

import React from 'react';
import { Globe, Filter, Search } from 'lucide-react';
import { LanguageCode } from '../../lib/types/scripture';

interface FeedFilterBarProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FeedFilterBar: React.FC<FeedFilterBarProps> = ({
  currentLanguage,
  onLanguageChange,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}) => {
  const categories = [
    { id: 'all', label: 'All Wisdom' },
    { id: 'Mindset', label: 'Mindset' },
    { id: 'Leadership', label: 'Leadership' },
    { id: 'Dharma & Ethics', label: 'Dharma & Ethics' },
    { id: 'Inner Peace', label: 'Inner Peace' },
    { id: 'bhagavad-gita', label: 'Bhagavad Gita' },
    { id: 'ramayana', label: 'Ramayana' },
    { id: 'mahabharata', label: 'Mahabharata' },
  ];

  const languages: Array<{ code: LanguageCode; label: string }> = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'sa', label: 'संस्कृतम् (Sanskrit)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-3 py-2 sticky top-16 z-30 bg-stitch-ivory/95 backdrop-blur-md pb-3 border-b border-stitch-sand/60">
      {/* Top Bar: Search and Language Selector */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stitch-stone absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search verses, themes, or life situations..."
            className="w-full text-xs md:text-sm pl-9 pr-3 py-2 rounded-xl bg-stitch-parchment border border-stitch-sand focus:outline-none focus:ring-1 focus:ring-stitch-maroon text-stitch-slate placeholder:text-stitch-stone"
          />
        </div>

        {/* Language Dropdown */}
        <div className="relative flex items-center">
          <Globe className="w-4 h-4 text-stitch-deepGold absolute left-2.5 pointer-events-none" />
          <select
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
            aria-label="Select Scripture Language"
            className="pl-8 pr-3 py-2 text-xs md:text-sm rounded-xl bg-stitch-parchment border border-stitch-sand text-stitch-slate font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-stitch-maroon appearance-none shadow-sm"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pill Filter Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <Filter className="w-3.5 h-3.5 text-stitch-stone shrink-0 ml-1" />
        {categories.map((cat) => {
          const isActive = activeFilter === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onFilterChange(cat.id)}
              className={`min-h-[36px] px-3.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all border cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-stitch-maroon text-stitch-ivory border-stitch-maroon shadow-sm'
                  : 'bg-stitch-parchment text-stitch-stone border-stitch-sand hover:border-stitch-gold hover:text-stitch-slate'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
