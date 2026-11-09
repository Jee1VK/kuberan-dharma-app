'use client';

import React, { useMemo } from 'react';
import { DharmaCardUnit, LanguageCode } from '../../lib/types/scripture';
import { DharmaCard } from '../card/DharmaCard';
import { useUserStore } from '../../lib/storage/userStore';
import { searchCards } from '../../lib/search/searchEngine';
import { Sparkles, Compass } from 'lucide-react';

interface CardStreamProps {
  initialCards: DharmaCardUnit[];
  currentLanguage: LanguageCode;
  activeFilter: string;
  searchQuery: string;
}

export const CardStream: React.FC<CardStreamProps> = ({
  initialCards,
  currentLanguage,
  activeFilter,
  searchQuery,
}) => {
  const { isCardInAnyStash, completedCardIds, markCardRead } = useUserStore();

  const filteredCards = useMemo(() => {
    let result = initialCards;

    // Apply search query if present
    if (searchQuery.trim()) {
      const searchResults = searchCards(searchQuery, currentLanguage);
      result = searchResults.map(r => r.unit);
    }

    // Apply category filter
    if (activeFilter !== 'all') {
      if (['bhagavad-gita', 'ramayana', 'mahabharata', 'vedas', 'puranas'].includes(activeFilter)) {
        result = result.filter(card => card.corpusId === activeFilter);
      } else {
        // Match against thematic tags or categories
        result = result.filter(card =>
          card.thematicTags.some(t => t.toLowerCase().includes(activeFilter.toLowerCase()))
        );
      }
    }

    return result;
  }, [initialCards, currentLanguage, activeFilter, searchQuery]);

  if (filteredCards.length === 0) {
    return (
      <div className="w-full max-w-lg mx-auto my-12 p-8 text-center bg-stitch-parchment/60 rounded-2xl border border-dashed border-stitch-sand">
        <Compass className="w-8 h-8 text-stitch-deepGold mx-auto mb-2 opacity-70" />
        <h4 className="font-serif font-bold text-base text-stitch-slate mb-1">
          No Dharma Cards Found
        </h4>
        <p className="text-xs text-stitch-stone">
          Try searching for keywords like &ldquo;Karma&rdquo;, &ldquo;Anxiety&rdquo;, &ldquo;Peace&rdquo;, or &ldquo;Hanuman&rdquo;.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      {filteredCards.map((card) => {
        const isStashed = isCardInAnyStash(card.id);
        const isRead = completedCardIds.includes(card.id);

        return (
          <DharmaCard
            key={card.id}
            unit={card}
            currentLanguage={currentLanguage}
            isStashed={isStashed}
            isRead={isRead}
            onMarkRead={() => markCardRead(card.id)}
          />
        );
      })}

      <div className="py-8 text-center text-xs text-stitch-stone flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-stitch-gold" />
        <span>You have reached the end of today&apos;s cards. Reflect and Stash your favorites!</span>
      </div>
    </div>
  );
};
