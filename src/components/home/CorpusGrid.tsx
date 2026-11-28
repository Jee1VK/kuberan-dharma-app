'use client';

import React from 'react';
import Link from 'next/link';
import { getAllCorpuses } from '../../lib/data';
import { useUserStore } from '../../lib/storage/userStore';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';

export const CorpusGrid: React.FC = () => {
  const corpuses = getAllCorpuses();
  const { preferences } = useUserStore();

  const corpusBadges: Record<string, string> = {
    'bhagavad-gita': 'Complete 18 Chapters',
    'ramayana': 'Adi Kavya Epics',
    'mahabharata': 'Moral Crossroads',
    'vedas': 'Universal Shruti',
    'puranas': 'Divine Parables',
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-stitch-maroon" />
          <h2 className="font-serif font-bold text-lg md:text-xl text-stitch-slate">
            The Five Sacred Corpuses
          </h2>
        </div>
      </div>

      {/* Asymmetric Bento Grid: Gita spans 2 cols on desktop so all 5 fill 2 clean rows with zero orphan gap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {corpuses.map((corpus) => {
          const title = corpus.title[preferences.language] || corpus.title.en;
          const description = corpus.description[preferences.language] || corpus.description.en;
          const isFeatured = corpus.id === 'bhagavad-gita';

          return (
            <div
              key={corpus.id}
              className={`relative rounded-2xl p-5 border shadow-stitch-layered hover:border-stitch-gold/80 transition-all flex flex-col justify-between gap-4 overflow-hidden ${
                isFeatured
                  ? 'sm:col-span-2 bg-gradient-to-br from-stitch-parchment/90 via-stitch-ivory to-stitch-parchment/60 border-stitch-gold/50'
                  : 'bg-stitch-ivory border-stitch-sand/80'
              }`}
            >
              {isFeatured && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-stitch-maroon via-stitch-gold to-stitch-maroon" />
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stitch-maroon/10 text-stitch-maroon border border-stitch-maroon/20">
                    {corpus.category}
                  </span>
                  <span className="text-[11px] font-mono text-stitch-deepGold font-semibold tabular-nums">
                    {corpusBadges[corpus.id]}
                  </span>
                </div>

                <h3 className={`font-serif font-bold text-stitch-slate mb-1 ${isFeatured ? 'text-xl md:text-2xl text-stitch-maroon' : 'text-lg'}`}>
                  {title}
                </h3>

                <p className="font-serif text-xs text-stitch-stone font-semibold mb-2 italic">
                  {corpus.sanskritTitle}
                </p>

                <p className={`text-xs md:text-sm text-stitch-stone leading-relaxed ${isFeatured ? 'max-w-xl' : 'line-clamp-3'}`}>
                  {description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stitch-sand/60">
                <Link
                  href={isFeatured ? '/read/bhagavad-gita/1' : `/feed`}
                  className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-stitch-maroon hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5 text-stitch-gold" />
                  <span>{isFeatured ? 'Read Chapters' : 'Explore Cards'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <span className="text-[11px] font-mono text-stitch-stone tabular-nums">
                  {corpus.totalUnits} Units
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
