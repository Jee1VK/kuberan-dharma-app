'use client';

import React, { useState } from 'react';
import { getAllCards } from '../../lib/data';
import { FeedFilterBar } from '../../components/feed/FeedFilterBar';
import { CardStream } from '../../components/feed/CardStream';
import { useUserStore } from '../../lib/storage/userStore';

export default function FeedPage() {
  const { preferences, setLanguage } = useUserStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allCards = getAllCards();

  return (
    <main className="min-h-screen bg-stitch-ivory px-4 pb-20">
      <div className="max-w-2xl mx-auto pt-4 pb-2">
        <h1 className="font-serif font-bold text-2xl md:text-3xl text-stitch-maroon tracking-wide">
          Daily Wisdom Feed
        </h1>
        <p className="text-xs text-stitch-stone">
          Bite-sized cards from Bhagavad Gita, Epics, Vedas & Puranas.
        </p>
      </div>

      <FeedFilterBar
        currentLanguage={preferences.language}
        onLanguageChange={setLanguage}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <CardStream
        initialCards={allCards}
        currentLanguage={preferences.language}
        activeFilter={activeFilter}
        searchQuery={searchQuery}
      />
    </main>
  );
}
