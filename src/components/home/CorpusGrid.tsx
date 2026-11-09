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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {corpuses.map((corpus) => {
          const title = corpus.title[preferences.language] || corpus.title.en;
          const description = corpus.description[preferences.language] || corpus.description.en;

          return (
            <div
              key={corpus.id}
              className="bg-stitch-ivory rounded-2xl p-5 border border-stitch-sand/80 shadow-card hover:shadow-cardHover hover:border-stitch-gold/60 transition-all flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stitch-maroon/10 text-stitch-maroon border border-stitch-maroon/20">
                    {corpus.category}
                  </span>
                  <span className="text-[11px] font-mono text-stitch-deepGold font-semibold">
                    {corpusBadges[corpus.id]}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-stitch-slate mb-1">
                  {title}
                </h3>

                <p className="font-serif text-xs text-stitch-stone font-semibold mb-2 italic">
                  {corpus.sanskritTitle}
                </p>

                <p className="text-xs text-stitch-stone line-clamp-3 leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stitch-sand/50">
                <Link
                  href={corpus.id === 'bhagavad-gita' ? '/read/bhagavad-gita/1' : `/feed`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-stitch-maroon hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5 text-stitch-gold" />
                  <span>{corpus.id === 'bhagavad-gita' ? 'Read Chapters' : 'Explore Cards'}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <span className="text-[11px] font-mono text-stitch-stone">
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
