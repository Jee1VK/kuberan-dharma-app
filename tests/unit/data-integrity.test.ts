import { describe, it, expect } from 'vitest';
import { getCorpus, getCardUnit, getAllCards, getCuratedStashes } from '@/lib/data';

describe('Scripture & Stash Data Integrity', () => {
  it('loads all 5 scripture corpuses and curated stashes', () => {
    const corpuses = ['bhagavad-gita', 'ramayana', 'mahabharata', 'vedas', 'puranas'] as const;
    corpuses.forEach(id => {
      const corpus = getCorpus(id);
      expect(corpus).toBeDefined();
      expect(corpus?.title.en).toBeTruthy();
      expect(corpus?.title.hi).toBeTruthy();
      expect(corpus?.title.kn).toBeTruthy();
      expect(corpus?.title.sa).toBeTruthy();
      expect(corpus?.title.ta).toBeTruthy();
      expect(corpus?.title.te).toBeTruthy();
    });

    const stashes = getCuratedStashes();
    expect(stashes.length).toBeGreaterThanOrEqual(4);
  });

  it('verifies verse bg-2-47 contains Deepstash cardTitle, Devanagari, and 3-layer data in all 6 languages', () => {
    const v47 = getCardUnit('bg-2-47');
    expect(v47).toBeDefined();
    expect(v47?.cardTitle.en).toBeTruthy();
    expect(v47?.cardTitle.hi).toBeTruthy();
    expect(v47?.cardTitle.kn).toBeTruthy();
    expect(v47?.cardTitle.sa).toBeTruthy();
    expect(v47?.cardTitle.ta).toBeTruthy();
    expect(v47?.cardTitle.te).toBeTruthy();

    expect(v47?.sanskrit.devanagari).toContain('कर्मण्येवाधिकारस्ते');
    expect(v47?.sanskrit.transliteration).toContain('karmaṇy-evādhikāras-te');

    // Layer 1: Translations in 6 languages
    expect(v47?.translation.en).toBeTruthy();
    expect(v47?.translation.hi).toBeTruthy();
    expect(v47?.translation.kn).toBeTruthy();
    expect(v47?.translation.sa).toBeTruthy();
    expect(v47?.translation.ta).toBeTruthy();
    expect(v47?.translation.te).toBeTruthy();

    // Layer 2: Philosophical Essence in 6 languages
    expect(v47?.essence.philosophicalMeaning.en).toBeTruthy();
    expect(v47?.essence.philosophicalMeaning.hi).toBeTruthy();
    expect(v47?.essence.philosophicalMeaning.kn).toBeTruthy();
    expect(v47?.essence.philosophicalMeaning.sa).toBeTruthy();
    expect(v47?.essence.philosophicalMeaning.ta).toBeTruthy();
    expect(v47?.essence.philosophicalMeaning.te).toBeTruthy();

    // Layer 3: Modern Practical Takeaway in 6 languages
    expect(v47?.essence.modernLifeApplication.en).toBeTruthy();
    expect(v47?.essence.modernLifeApplication.hi).toBeTruthy();
    expect(v47?.essence.modernLifeApplication.kn).toBeTruthy();
    expect(v47?.essence.modernLifeApplication.sa).toBeTruthy();
    expect(v47?.essence.modernLifeApplication.ta).toBeTruthy();
    expect(v47?.essence.modernLifeApplication.te).toBeTruthy();
  });

  it('verifies all cards have valid structure and tags', () => {
    const allCards = getAllCards();
    expect(allCards.length).toBeGreaterThanOrEqual(8);
    allCards.forEach(card => {
      expect(card.id).toBeTruthy();
      expect(card.thematicTags.length).toBeGreaterThan(0);
      expect(card.readTimeMinutes).toBeGreaterThanOrEqual(1);
    });
  });
});
