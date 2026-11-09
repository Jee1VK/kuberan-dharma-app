import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import HomePage from '@/app/page';

describe('Home Page Discovery Hub', () => {
  it('renders Kuberan Dharma branding, Shloka of the Day, and all 5 scripture gateway cards', () => {
    const html = renderToString(React.createElement(HomePage));
    expect(html).toContain('Timeless Wisdom from Ramayana to the Gita');
    expect(html).toContain('Shloka of the Day');
    expect(html).toContain('The Five Sacred Corpuses');
    expect(html).toContain('Bhagavad Gita');
    expect(html).toContain('Valmiki Ramayana');
    expect(html).toContain('Mahabharata');
    expect(html).toContain('Puranas');
  });
});
