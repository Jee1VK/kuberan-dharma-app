'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getStashById, getCardUnit } from '../../../lib/data';
import { useUserStore } from '../../../lib/storage/userStore';
import { DharmaCard } from '../../../components/card/DharmaCard';
import { ArrowLeft, Bookmark, Layers } from 'lucide-react';

export default function StashDetailPage() {
  const params = useParams();
  const stashId = params?.stashId as string;
  const { preferences, stashes, isCardInAnyStash, completedCardIds, markCardRead } = useUserStore();

  // Check if it is a curated stash or user stash
  const curatedStash = getStashById(stashId);
  const userStash = stashes.find(s => s.id === stashId);

  const title = curatedStash
    ? (curatedStash.title[preferences.language] || curatedStash.title.en)
    : userStash?.title || 'Collection';

  const description = curatedStash
    ? (curatedStash.description[preferences.language] || curatedStash.description.en)
    : 'Your custom curated collection of sacred wisdom.';

  const cardIds = curatedStash ? curatedStash.cardIds : (userStash?.cardIds || []);
  const cards = cardIds.map(id => getCardUnit(id)).filter((c): c is NonNullable<typeof c> => c !== undefined);

  return (
    <main className="min-h-screen bg-stitch-ivory px-4 py-6 pb-24">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Link
            href="/stashes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stitch-stone hover:text-stitch-maroon transition-colors py-1 px-2.5 rounded-lg bg-stitch-parchment border border-stitch-sand"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Stashes</span>
          </Link>
        </div>

        {/* Stash Header */}
        <div className="bg-stitch-parchment/60 rounded-2xl p-6 border border-stitch-sand/80 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-stitch-maroon/10 text-stitch-maroon border border-stitch-maroon/20">
              {curatedStash ? curatedStash.category : 'Personal Stash'}
            </span>
            <span className="text-xs text-stitch-stone font-mono">
              {cards.length} cards
            </span>
          </div>

          <h1 className="font-serif font-bold text-2xl md:text-3xl text-stitch-slate leading-tight">
            {title}
          </h1>

          <p className="text-xs md:text-sm text-stitch-stone leading-relaxed">
            {description}
          </p>
        </div>

        {/* Cards in this Stash */}
        <div className="flex flex-col gap-6">
          {cards.length === 0 ? (
            <div className="p-8 text-center bg-stitch-parchment/60 rounded-2xl border border-dashed border-stitch-sand">
              <Bookmark className="w-6 h-6 text-stitch-stone mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-stitch-slate">No cards in this stash yet.</p>
              <Link href="/feed" className="inline-block mt-3 text-xs font-semibold text-stitch-maroon underline">
                Browse wisdom feed to add cards
              </Link>
            </div>
          ) : (
            cards.map(card => {
              const isStashed = isCardInAnyStash(card.id);
              const isRead = completedCardIds.includes(card.id);

              return (
                <DharmaCard
                  key={card.id}
                  unit={card}
                  currentLanguage={preferences.language}
                  isStashed={isStashed}
                  isRead={isRead}
                  onMarkRead={() => markCardRead(card.id)}
                />
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
