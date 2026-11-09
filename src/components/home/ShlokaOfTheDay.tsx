'use client';

import React from 'react';
import Link from 'next/link';
import { getShlokaOfTheDay } from '../../lib/data';
import { useUserStore } from '../../lib/storage/userStore';
import { DharmaCard } from '../card/DharmaCard';
import { Sparkles, ArrowRight } from 'lucide-react';

export const ShlokaOfTheDay: React.FC = () => {
  const shloka = getShlokaOfTheDay();
  const { preferences, isCardInAnyStash, completedCardIds, markCardRead } = useUserStore();

  const isStashed = isCardInAnyStash(shloka.id);
  const isRead = completedCardIds.includes(shloka.id);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-stitch-gold fill-stitch-gold/40" />
          <h2 className="font-serif font-bold text-lg md:text-xl text-stitch-slate">
            Shloka of the Day
          </h2>
        </div>

        <Link
          href="/feed"
          className="text-xs font-semibold text-stitch-maroon hover:underline flex items-center gap-1"
        >
          <span>Explore All Cards</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <DharmaCard
        unit={shloka}
        currentLanguage={preferences.language}
        isStashed={isStashed}
        isRead={isRead}
        onMarkRead={() => markCardRead(shloka.id)}
      />
    </section>
  );
};
