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

let miniSearchInstance: MiniSearch<SearchDoc> | null = null;

function buildSearchDocs(cards: DharmaCardUnit[]): SearchDoc[] {
  return cards.map(card => {
    // Combine all language versions into searchable text blocks
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
      fields: ['cardTitle', 'transliteration', 'devanagari', 'translation', 'essence', 'lifeApplication', 'thematicTags'],
      storeFields: ['id'],
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
      },
    });

    miniSearchInstance.addAll(buildSearchDocs(ALL_DHARMA_CARDS));
  }
  return miniSearchInstance;
}

export function searchCards(query: string, lang?: LanguageCode): SearchResultItem[] {
  if (!query || query.trim() === '') return [];

  const engine = getSearchEngine();
  const searchResults = engine.search(query.trim());

  const cardMap = new Map<string, DharmaCardUnit>();
  ALL_DHARMA_CARDS.forEach(card => cardMap.set(card.id, card));

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
