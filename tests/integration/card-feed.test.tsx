import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import FeedPage from '@/app/feed/page';

describe('Card Feed Integration', () => {
  it('renders card stream with category filters', () => {
    const html = renderToString(React.createElement(FeedPage));
    expect(html).toContain('Daily Wisdom Feed');
    expect(html).toContain('All Wisdom');
  });
});
