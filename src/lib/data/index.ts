import { CorpusId, DharmaCardUnit, ScriptureCorpus, ScriptureSection, DharmaStash } from '../types/scripture';
import { CORPUS_LIST } from './corpusMeta';
import { GITA_CHAPTERS } from './gita/chapters';
import { GITA_VERSES } from './gita/verses';
import { RAMAYANA_EPISODES } from './ramayana/episodes';
import { MAHABHARATA_EPISODES } from './mahabharata/episodes';
import { VEDIC_SUKTAS } from './vedas/suktas';
import { PURANIC_STORIES } from './puranas/stories';
import { CURATED_STASHES } from './stashes/curatedStashes';

// Aggregate all cards
export const ALL_DHARMA_CARDS: DharmaCardUnit[] = [
  ...GITA_VERSES,
  ...RAMAYANA_EPISODES,
  ...MAHABHARATA_EPISODES,
  ...VEDIC_SUKTAS,
  ...PURANIC_STORIES,
];

// Helper to assemble full corpus with its sections
export function getAllCorpuses(): ScriptureCorpus[] {
  return CORPUS_LIST.map(corpus => {
    if (corpus.id === 'bhagavad-gita') {
      return {
        ...corpus,
        sections: GITA_CHAPTERS
      };
    }
    return corpus;
  });
}

export function getCorpus(id: CorpusId): ScriptureCorpus | undefined {
  const corpus = CORPUS_LIST.find(c => c.id === id);
  if (!corpus) return undefined;
  if (id === 'bhagavad-gita') {
    return {
      ...corpus,
      sections: GITA_CHAPTERS
    };
  }
  return corpus;
}

export function getSection(corpusId: CorpusId, sectionNumber: number): ScriptureSection | undefined {
  if (corpusId === 'bhagavad-gita') {
    return GITA_CHAPTERS.find(s => s.sectionNumber === sectionNumber);
  }
  return undefined;
}

export function getCardUnit(unitId: string): DharmaCardUnit | undefined {
  return ALL_DHARMA_CARDS.find(card => card.id === unitId);
}

export function getAllCards(): DharmaCardUnit[] {
  return ALL_DHARMA_CARDS;
}

export function getCardsByCorpus(corpusId: CorpusId): DharmaCardUnit[] {
  return ALL_DHARMA_CARDS.filter(card => card.corpusId === corpusId);
}

export function getCuratedStashes(): DharmaStash[] {
  return CURATED_STASHES;
}

export function getStashById(stashId: string): DharmaStash | undefined {
  return CURATED_STASHES.find(stash => stash.id === stashId);
}

export function getShlokaOfTheDay(): DharmaCardUnit {
  // Returns bg-2-47 or rotates deterministically
  return GITA_VERSES[0];
}
