'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, Brain, Shield, Compass, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { DharmaStash, LanguageCode } from '../../lib/types/scripture';

interface StashCardProps {
  stash: DharmaStash;
  currentLanguage: LanguageCode;
}

const iconMap: Record<string, React.ElementType> = {
  Brain,
  Shield,
  Compass,
  Sparkles,
};

export const StashCard: React.FC<StashCardProps> = ({ stash, currentLanguage }) => {
  const IconComponent = iconMap[stash.icon] || Layers;

  const title = stash.title[currentLanguage] || stash.title.en;
  const description = stash.description[currentLanguage] || stash.description.en;

  return (
    <Link
      href={`/stashes/${stash.id}`}
      className="group block bg-stitch-ivory rounded-2xl p-5 border border-stitch-sand/80 shadow-card hover:shadow-cardHover hover:border-stitch-gold/60 transition-all flex flex-col justify-between gap-4"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-stitch-maroon/10 border border-stitch-maroon/20 text-stitch-maroon flex items-center justify-center group-hover:scale-105 transition-transform">
            <IconComponent className="w-5 h-5 text-stitch-maroon" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stitch-parchment text-stitch-deepGold border border-stitch-sand">
            {stash.category}
          </span>
        </div>

        <h3 className="font-serif font-bold text-lg text-stitch-slate group-hover:text-stitch-maroon transition-colors mb-1.5 leading-snug">
          {title}
        </h3>

        <p className="text-xs text-stitch-stone line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-stitch-sand/50 text-xs">
        <span className="font-mono text-stitch-stone flex items-center gap-1.5">
          <Bookmark className="w-3.5 h-3.5 text-stitch-gold fill-stitch-gold/20" />
          <strong>{stash.cardIds.length}</strong> Cards in Stash
        </span>

        <span className="text-stitch-maroon font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
};
