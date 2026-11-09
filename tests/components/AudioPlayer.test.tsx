import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import { DharmaCard } from '@/components/card/DharmaCard';
import { getCardUnit } from '@/lib/data';

describe('Component SSR & DOM Render Tests', () => {
  it('renders AudioPlayer with playback controls', () => {
    const html = renderToString(
      React.createElement(AudioPlayer, {
        audioUrl: '/audio/bg-2-47.mp3',
        shlokaText: 'कर्मण्येवाधिकारस्ते',
        language: 'en',
      })
    );
    expect(html).toContain('Shloka Chanting');
    expect(html).toContain('speed');
    expect(html).toContain('Repeat count');
  });

  it('renders DharmaCard with citation, Devanagari and 3 layers', () => {
    const unit = getCardUnit('bg-2-47')!;
    const html = renderToString(
      React.createElement(DharmaCard, {
        unit,
        currentLanguage: 'en',
        isStashed: false,
      })
    );
    expect(html).toContain('Bhagavad Gita');
    expect(html).toContain('Focus on Effort, Release the Outcome');
    expect(html).toContain('कर्मण्येवाधिकारस्ते');
    expect(html).toContain('Translation');
    expect(html).toContain('Philosophical Essence');
    expect(html).toContain('Modern Life Application');
  });
});
