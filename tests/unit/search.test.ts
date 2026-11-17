import { describe, it, expect } from 'vitest';
import { searchCards, normalizeSearchText } from '@/lib/search/searchEngine';

describe('In-Memory Dharma Search', () => {
  it('finds cards by insight title and themes like "Effort", "Action", or "Anxiety"', () => {
    const results = searchCards('Action');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].unit.id).toBe('bg-2-47');
  });

  it('finds cards by IAST transliteration "karmanye"', () => {
    const results = searchCards('karmanye');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].unit.id).toBe('bg-2-47');
  });

  it('normalizes IAST diacritics cleanly via Unicode NFD decomposition', () => {
    expect(normalizeSearchText('śrī')).toBe('sri');
    expect(normalizeSearchText('gaṇeśa')).toBe('ganesa');
    expect(normalizeSearchText('kṛṣṇa')).toBe('krsna');
    expect(normalizeSearchText('karmaṇy-evādhikāras-te')).toBe('karmany-evadhikaras-te');
    // Preserves Devanagari intact
    expect(normalizeSearchText('कर्म')).toBe('कर्म');
  });

  it('finds cards with ASCII queries matching IAST diacritics (e.g. "phalesu", "evadhikaras")', () => {
    const results = searchCards('phalesu');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].unit.id).toBe('bg-2-47');
  });

  it('finds Ramayana card by searching for "Hanuman" or "Leap"', () => {
    const results = searchCards('Hanuman');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.unit.id === 'ramayana-sundara-1')).toBe(true);
  });

  it('finds cards with Devanagari query "कर्म"', () => {
    const results = searchCards('कर्म');
    expect(results.length).toBeGreaterThan(0);
  });

  it('returns empty array when query is empty or spaces', () => {
    expect(searchCards('')).toEqual([]);
    expect(searchCards('   ')).toEqual([]);
  });
});
