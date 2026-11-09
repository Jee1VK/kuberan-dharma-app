'use client';

import React, { useState } from 'react';
import { Bookmark, Share2, CheckCircle2, Clock, Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import { DharmaCardUnit, LanguageCode } from '../../lib/types/scripture';
import { AudioPlayer } from '../audio/AudioPlayer';
import { PronunciationGuide } from '../audio/PronunciationGuide';
import { StashModal } from './StashModal';
import { ShareCardModal } from './ShareCardModal';

interface DharmaCardProps {
  unit: DharmaCardUnit;
  currentLanguage: LanguageCode;
  isStashed?: boolean;
  isRead?: boolean;
  onStash?: () => void;
  onMarkRead?: () => void;
}

export const DharmaCard: React.FC<DharmaCardProps> = ({
  unit,
  currentLanguage,
  isStashed = false,
  isRead = false,
  onStash,
  onMarkRead,
}) => {
  const [activeLayer, setActiveLayer] = useState<'translation' | 'essence' | 'application'>('translation');
  const [showStashModal, setShowStashModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPronunciation, setShowPronunciation] = useState(false);

  const title = unit.cardTitle[currentLanguage] || unit.cardTitle.en;
  const translationText = unit.translation[currentLanguage] || unit.translation.en;
  const essenceText = unit.essence.philosophicalMeaning[currentLanguage] || unit.essence.philosophicalMeaning.en;
  const applicationText = unit.essence.modernLifeApplication[currentLanguage] || unit.essence.modernLifeApplication.en;

  const corpusDisplayNames: Record<string, string> = {
    'bhagavad-gita': 'Bhagavad Gita',
    'ramayana': 'Valmiki Ramayana',
    'mahabharata': 'Mahabharata',
    'vedas': 'Vedas & Upanishads',
    'puranas': 'Puranas',
  };

  return (
    <article className="w-full max-w-2xl mx-auto bg-stitch-ivory rounded-2xl border border-stitch-sand/80 shadow-card hover:shadow-cardHover transition-all p-5 md:p-7 flex flex-col gap-4 relative overflow-hidden">
      {/* Decorative top accent border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-stitch-maroon via-stitch-gold to-stitch-maroon" />

      {/* Header: Citation, Read Time, and Actions */}
      <div className="flex items-center justify-between gap-2 pt-1 border-b border-stitch-sand/50 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 text-xs font-serif font-bold uppercase tracking-wider rounded-md bg-stitch-maroon/10 text-stitch-maroon border border-stitch-maroon/20">
            {corpusDisplayNames[unit.corpusId] || unit.corpusId} · {unit.unitNumber}
          </span>
          <span className="text-[11px] text-stitch-stone flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-stitch-stone" />
            {unit.readTimeMinutes} min read
          </span>
          {unit.speaker && (
            <span className="text-[11px] text-stitch-deepGold font-semibold italic">
              — {unit.speaker}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Stash Button */}
          <button
            type="button"
            onClick={() => {
              setShowStashModal(true);
              if (onStash) onStash();
            }}
            aria-label="Stash to collection"
            className={`p-2 rounded-xl border transition-all active:scale-95 flex items-center gap-1 text-xs font-semibold ${
              isStashed
                ? 'bg-stitch-maroon text-stitch-ivory border-stitch-maroon shadow-sm'
                : 'bg-stitch-parchment text-stitch-slate border-stitch-sand hover:border-stitch-gold'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isStashed ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{isStashed ? 'Stashed' : 'Stash'}</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            aria-label="Share card"
            className="p-2 rounded-xl border border-stitch-sand bg-stitch-parchment hover:border-stitch-gold text-stitch-slate transition-all active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Deepstash Insight Title */}
      <h3 className="font-serif font-bold text-xl md:text-2xl text-stitch-slate leading-snug">
        {title}
      </h3>

      {/* Sacred Shloka Box */}
      <div className="bg-stitch-parchment/70 rounded-xl p-4 md:p-5 border border-stitch-sand flex flex-col gap-2.5">
        <p className="font-serif text-lg md:text-xl font-semibold text-stitch-maroon whitespace-pre-line leading-relaxed text-center">
          {unit.sanskrit.devanagari}
        </p>

        <p className="text-xs md:text-sm font-mono text-stitch-stone italic text-center leading-normal">
          {unit.sanskrit.transliteration}
        </p>

        {/* Syllable Pronunciation Toggle */}
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={() => setShowPronunciation(!showPronunciation)}
            className="text-[11px] font-medium text-stitch-deepGold hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>{showPronunciation ? 'Hide Syllable Breakdown' : 'Show Sanskrit Syllables & Chanting Guide'}</span>
          </button>
        </div>

        {showPronunciation && (
          <PronunciationGuide
            syllables={unit.sanskrit.syllableBreakdown}
            transliteration={unit.sanskrit.transliteration}
          />
        )}

        {/* Audio Player */}
        <div className="mt-1">
          <AudioPlayer
            audioUrl={unit.audioUrl}
            shlokaText={unit.sanskrit.devanagari}
            language={currentLanguage}
          />
        </div>
      </div>

      {/* The 3-Layer Insight Tabs */}
      <div className="flex flex-col gap-3 mt-1">
        <div className="flex items-center gap-1 bg-stitch-parchment/60 p-1 rounded-xl border border-stitch-sand" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeLayer === 'translation'}
            onClick={() => setActiveLayer('translation')}
            className={`flex-1 py-2 px-2 rounded-lg text-xs md:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeLayer === 'translation'
                ? 'bg-stitch-maroon text-stitch-ivory shadow-sm'
                : 'text-stitch-stone hover:text-stitch-slate hover:bg-stitch-parchment'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Translation</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeLayer === 'essence'}
            onClick={() => setActiveLayer('essence')}
            className={`flex-1 py-2 px-2 rounded-lg text-xs md:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeLayer === 'essence'
                ? 'bg-stitch-maroon text-stitch-ivory shadow-sm'
                : 'text-stitch-stone hover:text-stitch-slate hover:bg-stitch-parchment'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Philosophical Essence</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeLayer === 'application'}
            onClick={() => setActiveLayer('application')}
            className={`flex-1 py-2 px-2 rounded-lg text-xs md:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeLayer === 'application'
                ? 'bg-stitch-maroon text-stitch-ivory shadow-sm'
                : 'text-stitch-stone hover:text-stitch-slate hover:bg-stitch-parchment'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Modern Life Application</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="min-h-[90px] p-4 rounded-xl bg-stitch-ivory border border-stitch-sand/60">
          {activeLayer === 'translation' && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stitch-stone">
                Layer 1: Plain Language Translation
              </span>
              <p className="text-sm md:text-base text-stitch-slate leading-relaxed font-sans">
                {translationText}
              </p>
            </div>
          )}

          {activeLayer === 'essence' && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stitch-deepGold">
                Layer 2: Spiritual Essence (Tatparya)
              </span>
              <p className="text-sm md:text-base text-stitch-slate leading-relaxed font-sans font-medium">
                {essenceText}
              </p>
            </div>
          )}

          {activeLayer === 'application' && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stitch-maroon">
                Layer 3: Modern Practical Takeaway (Vyavahara)
              </span>
              <p className="text-sm md:text-base text-stitch-slate leading-relaxed font-sans">
                {applicationText}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Tags and Read Status */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-stitch-sand/50">
        <div className="flex flex-wrap gap-1.5">
          {unit.thematicTags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stitch-parchment text-stitch-stone border border-stitch-sand"
            >
              #{tag}
            </span>
          ))}
        </div>

        {onMarkRead && (
          <button
            type="button"
            onClick={onMarkRead}
            className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
              isRead ? 'text-emerald-700' : 'text-stitch-stone hover:text-stitch-maroon'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isRead ? 'fill-emerald-100 text-emerald-700' : ''}`} />
            <span>{isRead ? 'Completed' : 'Mark as Read'}</span>
          </button>
        )}
      </div>

      {/* Modals */}
      <StashModal
        card={unit}
        isOpen={showStashModal}
        onClose={() => setShowStashModal(false)}
      />

      <ShareCardModal
        card={unit}
        language={currentLanguage}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </article>
  );
};
