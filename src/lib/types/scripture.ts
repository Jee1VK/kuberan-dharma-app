export type CorpusId = 'bhagavad-gita' | 'ramayana' | 'mahabharata' | 'vedas' | 'puranas';

export type LanguageCode = 'en' | 'hi' | 'kn' | 'sa' | 'ta' | 'te';

export interface SanskritPayload {
  devanagari: string;
  transliteration: string; // IAST phonetic transliteration
  syllableBreakdown?: string[];
  wordByWord?: Array<{
    sanskrit: string;
    transliteration: string;
    meaning: Record<LanguageCode, string>;
  }>;
}

export interface EssencePayload {
  philosophicalMeaning: Record<LanguageCode, string>; // Layer 2: Core spiritual essence / Tatparya
  modernLifeApplication: Record<LanguageCode, string>; // Layer 3: Modern practical takeaway / Vyavahara
}

export interface DharmaCardUnit {
  id: string; // e.g. "bg-2-47"
  corpusId: CorpusId;
  sectionNumber: number;
  unitNumber: string; // "2.47"
  readTimeMinutes: number; // e.g. 1

  // Deepstash-style bold takeaway header
  cardTitle: Record<LanguageCode, string>;

  // Classical shloka and chanting data
  sanskrit: SanskritPayload;
  audioUrl?: string;

  // The 3-Layer Understanding Model
  translation: Record<LanguageCode, string>; // Layer 1: Literal translation
  essence: EssencePayload;

  thematicTags: string[]; // e.g. ["Karma Yoga", "Duty", "Detachment", "Anxiety", "Action"]
  speaker?: string; // e.g. "Lord Krishna", "Arjuna"
}

export interface ScriptureSection {
  id: string; // e.g. "bg-ch-2", "ramayana-bala-kanda"
  corpusId: CorpusId;
  sectionNumber: number;
  title: Record<LanguageCode, string>;
  sanskritTitle: string;
  summary: Record<LanguageCode, string>;
  totalUnits: number;
  unitIds: string[];
}

export interface ScriptureCorpus {
  id: CorpusId;
  title: Record<LanguageCode, string>;
  sanskritTitle: string;
  category: 'Itihasa' | 'Shruti' | 'Smriti' | 'Purana';
  description: Record<LanguageCode, string>;
  totalUnits: number;
  sections: ScriptureSection[];
}

export interface DharmaStash {
  id: string;
  title: Record<LanguageCode, string>;
  description: Record<LanguageCode, string>;
  icon: string;
  cardIds: string[];
  isCurated: boolean;
  category: 'Mindset' | 'Leadership' | 'Dharma & Ethics' | 'Inner Peace' | 'Chants & Mantras';
}
