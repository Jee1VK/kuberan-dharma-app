'use client';

import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';

interface PronunciationGuideProps {
  syllables?: string[];
  transliteration: string;
}

export const PronunciationGuide: React.FC<PronunciationGuideProps> = ({ syllables, transliteration }) => {
  const [activeSyllable, setActiveSyllable] = useState<number | null>(null);

  const speakSyllable = (syllable: string, index: number) => {
    setActiveSyllable(index);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance !== 'undefined') {
      const utterance = new window.SpeechSynthesisUtterance(syllable);
      utterance.rate = 0.8;
      utterance.lang = 'hi-IN'; // Phonetic Sanskrit/Hindi cadence
      utterance.onend = () => setActiveSyllable(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setActiveSyllable(null), 400);
    }
  };

  return (
    <div className="bg-stitch-parchment/60 rounded-xl p-3 border border-stitch-sand/60">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-stitch-stone uppercase tracking-wider mb-2">
        <Volume2 className="w-3.5 h-3.5 text-stitch-deepGold" />
        <span>Sanskrit Syllable Pronunciation Guide</span>
      </div>

      {syllables && syllables.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {syllables.map((syl, idx) => (
            <button
              key={`${syl}-${idx}`}
              type="button"
              onClick={() => speakSyllable(syl, idx)}
              className={`px-2.5 py-1 text-sm font-mono rounded-lg transition-all active:scale-95 border ${
                activeSyllable === idx
                  ? 'bg-stitch-maroon text-stitch-ivory border-stitch-maroon shadow-sm scale-105'
                  : 'bg-stitch-ivory text-stitch-slate border-stitch-sand hover:border-stitch-gold'
              }`}
              title="Tap to hear syllable"
            >
              {syl}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm font-mono italic text-stitch-stone">
          {transliteration}
        </p>
      )}
    </div>
  );
};
