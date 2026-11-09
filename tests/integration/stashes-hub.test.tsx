import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import StashesPage from '@/app/stashes/page';

describe('Stashes Hub Integration', () => {
  it('renders curated editorial stashes and button to create custom stash', () => {
    const html = renderToString(React.createElement(StashesPage));
    expect(html).toContain('Curated Stashes');
    expect(html).toContain('New Stash');
    expect(html).toContain('The 7 Mental Models of Lord Krishna');
  });
});
