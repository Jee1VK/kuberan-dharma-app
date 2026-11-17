import MiniSearch from 'minisearch';
import { DharmaCardUnit, LanguageCode } from '../types/scripture';
import { ALL_DHARMA_CARDS } from '../data';

export interface SearchDoc {
  id: string;
  cardTitle: string;
  devanagari: string;
  transliteration: string;
  translation: string;
  essence: string;
  lifeApplication: string;
  thematicTags: string;
  corpusId: string;
}

export interface SearchResultItem {
  unit: DharmaCardUnit;
  score: number;
  match: Record<string, string[]>;
}

/**
 * Normalizes text for diacritic-insensitive and multi-script search.
 *
 * Uses Unicode NFD decomposition to strip combining diacritical marks (\u0300-\u036f)
 * so plain ASCII/English queries match IAST transliterations:
 * - "sri" matches "śrī"
 * - "ganesha" matches "gaṇeśa" (with phonetic sh -> s alignment & fuzzy matching)
 * - "krishna" matches "kṛṣṇa"
 * - "karmanye" matches "karmaṇy-evādhikāras-te"
 *
 * Indic scripts (Devanagari, Kannada, Tamil, Telugu) have vowel/consonant signs
 * outside \u0300-\u036f, so native Indic queries remain intact.
 */
export function normalizeSearchText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Token processor used by MiniSearch at both index-time and query-time.
 * Strips combining diacritical marks and aligns common Sanskrit sibilant
 * transliterations (e.g., "sh" -> "s") so "ganesha" matches "gaṇeśa" directly.
 */
function processSearchTerm(term: string): string {
  const normalized = normalizeSearchText(term);
  return normalized.replace(/sh/g, 's');
}

let miniSearchInstance: MiniSearch<SearchDoc> | null = null;

function buildSearchDocs(cards: DharmaCardUnit[]): SearchDoc[] {
  return cards.map((card) => {
    const titles = Object.values(card.cardTitle).join(' ');
    const translations = Object.values(card.translation).join(' ');
    const essences = Object.values(card.essence.philosophicalMeaning).join(' ');
    const lifeApplications = Object.values(card.essence.modernLifeApplication).join(' ');
    const tags = card.thematicTags.join(' ');

    return {
      id: card.id,
      cardTitle: titles,
      devanagari: card.sanskrit.devanagari,
      transliteration: card.sanskrit.transliteration,
      translation: translations,
      essence: essences,
      lifeApplication: lifeApplications,
      thematicTags: tags,
      corpusId: card.corpusId,
    };
  });
}

export function getSearchEngine(): MiniSearch<SearchDoc> {
  if (!miniSearchInstance) {
    miniSearchInstance = new MiniSearch<SearchDoc>({
      fields: [
        'cardTitle',
        'transliteration',
        'devanagari',
        'translation',
        'essence',
        'lifeApplication',
        'thematicTags',
      ],
      storeFields: ['id'],
      processTerm: processSearchTerm,
      searchOptions: {
        boost: {
          cardTitle: 3,
          thematicTags: 2.5,
          transliteration: 2,
          devanagari: 2,
          essence: 1.5,
          translation: 1,
        },
        fuzzy: 0.2,
        prefix: true,
        processTerm: processSearchTerm,
      },
    });

    miniSearchInstance.addAll(buildSearchDocs(ALL_DHARMA_CARDS));
  }
  return miniSearchInstance;
}

/**
 * Resets the cached MiniSearch instance (useful for testing or dynamic corpus updates).
 */
export function resetSearchEngine(): void {
  miniSearchInstance = null;
}

export function searchCards(query: string, _lang?: LanguageCode): SearchResultItem[] {
  if (!query || query.trim() === '') return [];

  const engine = getSearchEngine();
  const normalizedQuery = normalizeSearchText(query.trim());
  const searchResults = engine.search(normalizedQuery);

  const cardMap = new Map<string, DharmaCardUnit>();
  ALL_DHARMA_CARDS.forEach((card) => cardMap.set(card.id, card));

  const results: SearchResultItem[] = [];

  for (const res of searchResults) {
    const unit = cardMap.get(res.id);
    if (unit) {
      results.push({
        unit,
        score: res.score,
        match: res.match,
      });
    }
  }

  return results;
}
