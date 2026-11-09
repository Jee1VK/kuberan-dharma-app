import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { DharmaCard } from '@/components/card/DharmaCard';
import { getCardUnit } from '@/lib/data';

describe('DharmaCard Deepstash Component', () => {
  it('renders card title, citation badge, Devanagari, and 3 insight layers', () => {
    const unit = getCardUnit('bg-2-47')!;
    const html = renderToString(
      React.createElement(DharmaCard, {
        unit,
        currentLanguage: 'en',
        isStashed: false,
      })
    );

    // Check citation and card title
    expect(html).toContain('Bhagavad Gita');
    expect(html).toContain('Focus on Effort, Release the Outcome');

    // Check Devanagari presence
    expect(html).toContain('कर्मण्येवाधिकारस्ते');

    // Check 3 Insight Layers
    expect(html).toContain('Translation');
    expect(html).toContain('Philosophical Essence');
    expect(html).toContain('Modern Life Application');

    // Check Stash button
    expect(html).toContain('Stash');
  });
});
