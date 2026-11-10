'use client';

import React, { useState } from 'react';
import { Bookmark, Share2, CheckCircle2, Clock, Sparkles, BookOpen, Lightbulb, ArrowRight, Check } from 'lucide-react';
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

  // Indic language font size, family, and line height adjustment
  const isIndicScript = ['kn', 'te', 'sa', 'hi', 'ta'].includes(currentLanguage);
  const scriptFontClass = {
    sa: 'font-devanagari',
    hi: 'font-devanagari',
    kn: 'font-kannada',
    ta: 'font-tamil',
    te: 'font-telugu',
    en: 'font-sans',
  }[currentLanguage] || 'font-sans';

  const bodyTextClasses = isIndicScript
    ? `text-[16px] md:text-[17px] leading-[1.85] text-stitch-slate ${scriptFontClass}`
    : 'text-sm md:text-base leading-relaxed text-stitch-slate font-sans';

  return (
    <article className="w-full max-w-2xl mx-auto bg-stitch-ivory rounded-3xl border border-stitch-sand/80 shadow-card hover:shadow-cardHover transition-all p-5 md:p-7 flex flex-col gap-4 relative overflow-hidden">
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
            className={`min-h-[44px] px-3 py-2 rounded-xl border transition-all active:scale-95 flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
              isStashed
                ? 'bg-stitch-maroon text-stitch-ivory border-stitch-maroon shadow-sm'
                : 'bg-stitch-parchment text-stitch-slate border-stitch-sand hover:border-stitch-gold'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isStashed ? 'fill-current text-stitch-gold' : ''}`} />
            <span className="hidden sm:inline">{isStashed ? 'Stashed' : 'Stash'}</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            aria-label="Share card"
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-stitch-sand bg-stitch-parchment hover:border-stitch-gold text-stitch-slate transition-all active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Insight Title */}
      <h3 className="font-serif font-bold text-xl md:text-2xl text-stitch-slate leading-snug">
        {title}
      </h3>

      {/* Sacred Shloka Box */}
      <div className="bg-stitch-parchment/70 rounded-2xl p-4 md:p-5 border border-stitch-sand flex flex-col gap-3">
        <p className="font-serif text-lg md:text-xl font-semibold text-stitch-maroon whitespace-pre-line leading-[1.8] text-center">
          {unit.sanskrit.devanagari}
        </p>

        <p className="text-xs md:text-sm font-mono text-stitch-stone italic text-center leading-normal">
          {unit.sanskrit.transliteration}
        </p>

        {/* Syllable Pronunciation Toggle */}
        <div className="flex justify-center pt-0.5">
          <button
            type="button"
            onClick={() => setShowPronunciation(!showPronunciation)}
            className="min-h-[36px] px-2 text-[11px] font-semibold text-stitch-deepGold hover:text-stitch-maroon flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-stitch-gold" />
            <span>{showPronunciation ? 'Hide Syllable Breakdown' : 'Show Sanskrit Syllables & Chanting Guide'}</span>
          </button>
        </div>

        {showPronunciation && (
          <PronunciationGuide
            syllables={unit.sanskrit.syllableBreakdown}
            transliteration={unit.sanskrit.transliteration}
          />
        )}

        {/* Audio Player with Japa repetition */}
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
            className={`min-h-[44px] flex-1 py-2 px-2 rounded-lg text-xs md:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
            className={`min-h-[44px] flex-1 py-2 px-2 rounded-lg text-xs md:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
            className={`min-h-[44px] flex-1 py-2 px-2 rounded-lg text-xs md:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
        <div className="min-h-[90px] p-4 md:p-5 rounded-2xl bg-stitch-ivory border border-stitch-sand/60">
          {activeLayer === 'translation' && (
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stitch-stone">
                Layer 1: Plain Language Translation
              </span>
              <p className={bodyTextClasses}>
                {translationText}
              </p>
            </div>
          )}

          {activeLayer === 'essence' && (
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stitch-deepGold">
                Layer 2: Timeless Philosophical Essence
              </span>
              <p className={bodyTextClasses}>
                {essenceText}
              </p>
            </div>
          )}

          {activeLayer === 'application' && (
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stitch-maroon">
                Layer 3: Everyday Workplace &amp; Life Application
              </span>
              <p className={bodyTextClasses}>
                {applicationText}
              </p>
            </div>
          )}
        </div>

        {/* P5: Modern Life Application Teaser Strip (When on Translation layer) */}
        {activeLayer === 'translation' && (
          <button
            type="button"
            onClick={() => setActiveLayer('application')}
            className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-stitch-gold/10 via-stitch-parchment to-stitch-gold/15 border border-stitch-gold/40 hover:border-stitch-gold transition-all flex items-center justify-between gap-3 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-stitch-deepGold/15 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-3.5 h-3.5 text-stitch-deepGold" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold tracking-wider text-stitch-deepGold">
                  Practical Workplace &amp; Life Insight
                </div>
                <p className="text-xs text-stitch-slate font-medium line-clamp-1 group-hover:text-stitch-maroon transition-colors">
                  {applicationText}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-stitch-maroon flex items-center gap-1 flex-shrink-0 group-hover:translate-x-1 transition-transform">
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        )}
      </div>

      {/* Card Footer: Thematic Tags & P2 "Mark Reflected" Interactive Button */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-stitch-sand/50 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {unit.thematicTags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stitch-parchment text-stitch-stone border border-stitch-sand"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* P2: Interactive "Mark as Reflected" Completion Loop */}
        <button
          type="button"
          onClick={() => {
            if (onMarkRead) onMarkRead();
          }}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
            isRead
              ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30'
              : 'bg-stitch-maroon text-stitch-ivory hover:bg-stitch-maroonHover shadow-sm border border-stitch-gold/40'
          }`}
        >
          {isRead ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Reflected &amp; Understood</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-stitch-gold" />
              <span>Mark Reflected</span>
            </>
          )}
        </button>
      </div>

      {/* Modals */}
      <StashModal
        isOpen={showStashModal}
        onClose={() => setShowStashModal(false)}
        card={unit}
      />

      <ShareCardModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        card={unit}
        language={currentLanguage}
      />
    </article>
  );
};
