/**
 * Dynamic Daily Sankalpam Generator
 *
 * Generates formal Vedic Sankalpam invocations in Sanskrit (Devanagari),
 * IAST transliteration, and English translation from lunar Panchanga parameters:
 * Masa (lunar month), Paksha (fortnight), Tithi (lunar day), Vara (weekday),
 * and Nakshatra (lunar mansion).
 *
 * @example
 * ```ts
 * import { generateSankalpam, getDefaultLunarParamsForDate } from '@/lib/panchanga/sankalpam';
 *
 * // 1. Dynamic usage with explicit Panchanga parameters
 * const sankalpam = generateSankalpam({
 *   masa: 'Kartika',
 *   paksha: 'Shukla',
 *   tithi: 'Ashtami',
 *   vara: 'Mangalavara',
 *   nakshatra: 'Dhanishtha',
 *   samvatsara: 'Parabhava',
 *   purpose: 'Parayanam & Dharma Reflection',
 * });
 *
 * console.log(sankalpam.sanskrit);
 * console.log(sankalpam.transliteration);
 *
 * // 2. Automatic date-seeded defaults
 * const todayDefaults = getDefaultLunarParamsForDate(new Date());
 * const dailySankalpam = generateSankalpam(todayDefaults);
 * ```
 */

export type LunarMasa =
  | 'Chaitra'
  | 'Vaishakha'
  | 'Jyeshtha'
  | 'Ashadha'
  | 'Shravana'
  | 'Bhadrapada'
  | 'Ashvina'
  | 'Kartika'
  | 'Margashirsha'
  | 'Pausha'
  | 'Magha'
  | 'Phalguna';

export type LunarPaksha = 'Shukla' | 'Krishna';

export type LunarTithi =
  | 'Pratipada'
  | 'Dvitiya'
  | 'Tritiya'
  | 'Chaturthi'
  | 'Panchami'
  | 'Shashthi'
  | 'Saptami'
  | 'Ashtami'
  | 'Navami'
  | 'Dashami'
  | 'Ekadashi'
  | 'Dwadashi'
  | 'Trayodashi'
  | 'Chaturdashi'
  | 'Purnima'
  | 'Amavasya';

export type VedicVara =
  | 'Ravivara'
  | 'Somavara'
  | 'Mangalavara'
  | 'Budhavara'
  | 'Guruvara'
  | 'Shukravara'
  | 'Shanivara';

export type VedicNakshatra =
  | 'Ashwini'
  | 'Bharani'
  | 'Krittika'
  | 'Rohini'
  | 'Mrigashira'
  | 'Ardra'
  | 'Punarvasu'
  | 'Pushya'
  | 'Ashlesha'
  | 'Magha'
  | 'Purva Phalguni'
  | 'Uttara Phalguni'
  | 'Hasta'
  | 'Chitra'
  | 'Swati'
  | 'Vishakha'
  | 'Anuradha'
  | 'Jyeshtha'
  | 'Mula'
  | 'Purva Ashadha'
  | 'Uttara Ashadha'
  | 'Shravana'
  | 'Dhanishtha'
  | 'Shatabhisha'
  | 'Purva Bhadrapada'
  | 'Uttara Bhadrapada'
  | 'Revati';

export type VedicAyana = 'Uttarayana' | 'Dakshinayana';

export type VedicRitu =
  | 'Vasanta'
  | 'Grishma'
  | 'Varsha'
  | 'Sharad'
  | 'Hemanta'
  | 'Shishira';

export interface SankalpamParams {
  masa: LunarMasa;
  paksha: LunarPaksha;
  tithi: LunarTithi;
  vara: VedicVara;
  nakshatra: VedicNakshatra;
  samvatsara?: string;
  ayana?: VedicAyana;
  ritu?: VedicRitu;
  /** Geographical/cosmic locus (defaults to Jambudvipa / Bharata-varsha) */
  desha?: string;
  /** Devotee's spiritual purpose (defaults to Dharma-artha-kama-moksha siddhi) */
  purpose?: string;
  date?: Date;
}

export interface SankalpamOutput {
  sanskrit: string;
  transliteration: string;
  englishMeaning: string;
  params: Required<Omit<SankalpamParams, 'date'>>;
}

interface BilingualTerm {
  sa: string;
  iast: string;
}

export const MASA_MAP: Record<LunarMasa, BilingualTerm> = {
  Chaitra: { sa: 'चैत्र', iast: 'Caitra' },
  Vaishakha: { sa: 'वैशाख', iast: 'Vaiśākha' },
  Jyeshtha: { sa: 'ज्येष्ठ', iast: 'Jyeṣṭha' },
  Ashadha: { sa: 'आषाढ', iast: 'Āṣāḍha' },
  Shravana: { sa: 'श्रावण', iast: 'Śrāvaṇa' },
  Bhadrapada: { sa: 'भाद्रपद', iast: 'Bhādrapada' },
  Ashvina: { sa: 'आश्विन', iast: 'Āśvina' },
  Kartika: { sa: 'कार्तिक', iast: 'Kārtika' },
  Margashirsha: { sa: 'मार्गशीर्ष', iast: 'Mārgaśīrṣa' },
  Pausha: { sa: 'पौष', iast: 'Pauṣa' },
  Magha: { sa: 'माघ', iast: 'Māgha' },
  Phalguna: { sa: 'फाल्गुन', iast: 'Phālguna' },
};

export const PAKSHA_MAP: Record<LunarPaksha, BilingualTerm> = {
  Shukla: { sa: 'शुक्ल', iast: 'Śukla' },
  Krishna: { sa: 'कृष्ण', iast: 'Kṛṣṇa' },
};

export const TITHI_MAP: Record<LunarTithi, BilingualTerm> = {
  Pratipada: { sa: 'प्रतिपद्', iast: 'Pratipad' },
  Dvitiya: { sa: 'द्वितीया', iast: 'Dvitīyā' },
  Tritiya: { sa: 'तृतीया', iast: 'Tṛtīyā' },
  Chaturthi: { sa: 'चतुर्थी', iast: 'Caturthī' },
  Panchami: { sa: 'पञ्चमी', iast: 'Pañcamī' },
  Shashthi: { sa: 'षष्ठी', iast: 'Ṣaṣṭhī' },
  Saptami: { sa: 'सप्तमी', iast: 'Saptamī' },
  Ashtami: { sa: 'अष्टमी', iast: 'Aṣṭamī' },
  Navami: { sa: 'नवमी', iast: 'Navamī' },
  Dashami: { sa: 'दशमी', iast: 'Daśamī' },
  Ekadashi: { sa: 'एकादशी', iast: 'Ekādaśī' },
  Dwadashi: { sa: 'द्वादशी', iast: 'Dvādaśī' },
  Trayodashi: { sa: 'त्रयोदशी', iast: 'Trayodaśī' },
  Chaturdashi: { sa: 'चतुर्दशी', iast: 'Caturdaśī' },
  Purnima: { sa: 'पूर्णिमा', iast: 'Pūrṇimā' },
  Amavasya: { sa: 'अमावास्या', iast: 'Amāvāsyā' },
};

export const VARA_LIST: VedicVara[] = [
  'Ravivara',
  'Somavara',
  'Mangalavara',
  'Budhavara',
  'Guruvara',
  'Shukravara',
  'Shanivara',
];

export const VARA_MAP: Record<VedicVara, BilingualTerm & { sanskritVasare: string; iastVasare: string }> = {
  Ravivara: { sa: 'भानु', iast: 'Bhānu', sanskritVasare: 'भानुवासरे', iastVasare: 'Bhānuvāsare' },
  Somavara: { sa: 'इन्दु', iast: 'Indu', sanskritVasare: 'इन्दुवासरे', iastVasare: 'Induvāsare' },
  Mangalavara: { sa: 'भौम', iast: 'Bhauma', sanskritVasare: 'भौमवासरे', iastVasare: 'Bhaumavāsare' },
  Budhavara: { sa: 'सौम्य', iast: 'Saumya', sanskritVasare: 'सौम्यवासरे', iastVasare: 'Saumyavāsare' },
  Guruvara: { sa: 'बृहस्पति', iast: 'Bṛhaspati', sanskritVasare: 'बृहस्पतिवासरे', iastVasare: 'Bṛhaspativāsare' },
  Shukravara: { sa: 'भृगु', iast: 'Bhṛgu', sanskritVasare: 'भृगुवासरे', iastVasare: 'Bhṛguvāsare' },
  Shanivara: { sa: 'स्थिर', iast: 'Sthira', sanskritVasare: 'स्थिरवासरे', iastVasare: 'Sthiravāsare' },
};

export const NAKSHATRA_MAP: Record<VedicNakshatra, BilingualTerm> = {
  Ashwini: { sa: 'अश्विनी', iast: 'Aśvinī' },
  Bharani: { sa: 'भरणी', iast: 'Bharaṇī' },
  Krittika: { sa: 'कृत्तिका', iast: 'Kṛttikā' },
  Rohini: { sa: 'रोहिणी', iast: 'Rohiṇī' },
  Mrigashira: { sa: 'मृगशीर्ष', iast: 'Mṛgaśīrṣa' },
  Ardra: { sa: 'आर्द्रा', iast: 'Ārdrā' },
  Punarvasu: { sa: 'पुनर्वसु', iast: 'Punarvasu' },
  Pushya: { sa: 'पुष्य', iast: 'Puṣya' },
  Ashlesha: { sa: 'आश्लेषा', iast: 'Āśleṣā' },
  Magha: { sa: 'मघा', iast: 'Maghā' },
  'Purva Phalguni': { sa: 'पूर्वफल्गुनी', iast: 'Pūrvaphalgunī' },
  'Uttara Phalguni': { sa: 'उत्तरफल्गुनी', iast: 'Uttaraphalgunī' },
  Hasta: { sa: 'हस्त', iast: 'Hasta' },
  Chitra: { sa: 'चित्रा', iast: 'Citrā' },
  Swati: { sa: 'स्वाती', iast: 'Svātī' },
  Vishakha: { sa: 'विशाखा', iast: 'Viśākhā' },
  Anuradha: { sa: 'अनुराधा', iast: 'Anurādhā' },
  Jyeshtha: { sa: 'ज्येष्ठा', iast: 'Jyeṣṭhā' },
  Mula: { sa: 'मूल', iast: 'Mūla' },
  'Purva Ashadha': { sa: 'पूर्वाषाढा', iast: 'Pūrvāṣāḍhā' },
  'Uttara Ashadha': { sa: 'उत्तराषाढा', iast: 'Uttarāṣāḍhā' },
  Shravana: { sa: 'श्रवण', iast: 'Śravaṇa' },
  Dhanishtha: { sa: 'धनिष्ठा', iast: 'Dhaniṣṭhā' },
  Shatabhisha: { sa: 'शतभिषा', iast: 'Śatabhiṣā' },
  'Purva Bhadrapada': { sa: 'पूर्वभाद्रपदा', iast: 'Pūrvabhādrapadā' },
  'Uttara Bhadrapada': { sa: 'उत्तरभाद्रपदा', iast: 'Uttarabhādrapadā' },
  Revati: { sa: 'रेवती', iast: 'Revatī' },
};

const AYANA_MAP: Record<VedicAyana, BilingualTerm> = {
  Uttarayana: { sa: 'उत्तरायणे', iast: 'Uttarāyaṇe' },
  Dakshinayana: { sa: 'दक्षिणायने', iast: 'Dakṣiṇāyane' },
};

const RITU_MAP: Record<VedicRitu, BilingualTerm> = {
  Vasanta: { sa: 'वसन्त ऋतौ', iast: 'Vasanta ṛtau' },
  Grishma: { sa: 'ग्रीष्म ऋतौ', iast: 'Grīṣma ṛtau' },
  Varsha: { sa: 'वर्षा ऋतौ', iast: 'Varṣā ṛtau' },
  Sharad: { sa: 'शरद् ऋतौ', iast: 'Śarad ṛtau' },
  Hemanta: { sa: 'हेमन्त ऋतौ', iast: 'Hemanta ṛtau' },
  Shishira: { sa: 'शिशिर ऋतौ', iast: 'Śiśira ṛtau' },
};

const MASA_LIST: LunarMasa[] = [
  'Chaitra',
  'Vaishakha',
  'Jyeshtha',
  'Ashadha',
  'Shravana',
  'Bhadrapada',
  'Ashvina',
  'Kartika',
  'Margashirsha',
  'Pausha',
  'Magha',
  'Phalguna',
];

const NAKSHATRA_LIST = Object.keys(NAKSHATRA_MAP) as VedicNakshatra[];

const TITHI_SHUKLA_LIST: LunarTithi[] = [
  'Pratipada', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
];

const TITHI_KRISHNA_LIST: LunarTithi[] = [
  'Pratipada', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
];

/**
 * Derives approximate lunar Panchanga defaults for a given Gregorian date.
 * Computes exact Vara from day-of-week, Ayana from solstice months,
 * Ritu from solar season, and an approximate synodic lunar day (Tithi/Paksha/Nakshatra)
 * using a known New Moon epoch (2024-01-11 11:57 UTC) for offline use.
 */
export function getDefaultLunarParamsForDate(date: Date = new Date()): SankalpamParams {
  const vara = VARA_LIST[date.getDay()];
  const month = date.getMonth(); // 0-11

  // Ayana: Makara Sankranti (mid-Jan) to Karkataka Sankranti (mid-Jul) = Uttarayana
  const ayana: VedicAyana = month >= 0 && month <= 5 ? 'Uttarayana' : 'Dakshinayana';

  // Approximate 6 Vedic Ritus by Gregorian month
  const rituByMonth: VedicRitu[] = [
    'Shishira', 'Shishira', // Jan, Feb
    'Vasanta', 'Vasanta',   // Mar, Apr
    'Grishma', 'Grishma',   // May, Jun
    'Varsha', 'Varsha',     // Jul, Aug
    'Sharad', 'Sharad',     // Sep, Oct
    'Hemanta', 'Hemanta',   // Nov, Dec
  ];
  const ritu = rituByMonth[month];

  // Approximate lunar Masa aligned with traditional Indian calendar
  const masaByMonth: LunarMasa[] = [
    'Pausha', 'Magha', 'Phalguna', 'Chaitra',
    'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana',
    'Bhadrapada', 'Ashvina', 'Kartika', 'Margashirsha',
  ];
  const masa = masaByMonth[month];

  // Synodic lunar cycle (~29.53059 days) from New Moon epoch (2024-01-11T11:57:00Z)
  const epochMs = Date.UTC(2024, 0, 11, 11, 57, 0);
  const synodicDays = 29.53058867;
  const elapsedDays = (date.getTime() - epochMs) / (1000 * 60 * 60 * 24);
  const lunarAge = ((elapsedDays % synodicDays) + synodicDays) % synodicDays;
  const lunarDayIndex = Math.floor((lunarAge / synodicDays) * 30); // 0..29

  const paksha: LunarPaksha = lunarDayIndex < 15 ? 'Shukla' : 'Krishna';
  const tithi =
    paksha === 'Shukla'
      ? TITHI_SHUKLA_LIST[lunarDayIndex]
      : TITHI_KRISHNA_LIST[lunarDayIndex - 15];

  // Sidereal nakshatra cycle (~27.32166 days)
  const siderealDays = 27.321661;
  const nakshatraAge = ((elapsedDays % siderealDays) + siderealDays) % siderealDays;
  const nakshatraIndex = Math.floor((nakshatraAge / siderealDays) * 27) % 27;
  const nakshatra = NAKSHATRA_LIST[nakshatraIndex];

  return {
    masa,
    paksha,
    tithi,
    vara,
    nakshatra,
    samvatsara: 'Parabhava',
    ayana,
    ritu,
    desha: 'Jambudvipe Bharata-varshe Bharata-khande',
    purpose: 'Dharma-artha-kama-moksha chaturvidha purushartha siddhyartham',
    date,
  };
}

/**
 * Generates a formal Vedic Daily Sankalpam from the supplied lunar parameters.
 */
export function generateSankalpam(input: SankalpamParams): SankalpamOutput {
  const defaults = getDefaultLunarParamsForDate(input.date);

  const masa = input.masa || defaults.masa;
  const paksha = input.paksha || defaults.paksha;
  const tithi = input.tithi || defaults.tithi;
  const vara = input.vara || defaults.vara;
  const nakshatra = input.nakshatra || defaults.nakshatra;
  const samvatsara = input.samvatsara || defaults.samvatsara || 'Parabhava';
  const ayana = input.ayana || defaults.ayana || 'Uttarayana';
  const ritu = input.ritu || defaults.ritu || 'Sharad';
  const desha = input.desha || defaults.desha || 'Jambudvipe Bharata-varshe Bharata-khande';
  const purpose =
    input.purpose ||
    defaults.purpose ||
    'Dharma-artha-kama-moksha chaturvidha purushartha siddhyartham';

  const m = MASA_MAP[masa];
  const p = PAKSHA_MAP[paksha];
  const t = TITHI_MAP[tithi];
  const v = VARA_MAP[vara];
  const n = NAKSHATRA_MAP[nakshatra];
  const ay = AYANA_MAP[ayana];
  const ri = RITU_MAP[ritu];

  const sanskrit = [
    'ॐ श्रीमद्भगवतो महापुरुषस्य विष्णोराज्ञया प्रवर्तमानस्य अद्य ब्रह्मणः द्वितीयपरार्धे श्रीश्वेतवराहकल्पे वैवस्वतमन्वन्तरे अष्टाविंशतितमे कलियुगे प्रथमपादे',
    `जम्बूद्वीपे भरतवर्षे भरतखण्डे मेरोः दक्षिणपार्श्वे शकाब्दे अस्मिन् वर्तमाने व्यावहारिके ${samvatsara} नाम संवत्सरे,`,
    `${ay.sa}, ${ri.sa}, ${m.sa}मासे, ${p.sa}पक्षे, ${t.sa}यां शुभतिथौ, ${v.sanskritVasare}, ${n.sa} नक्षत्रयुक्तायां,`,
    `सर्वग्रहेषु यथा-राशि-स्थान-स्थितेषु सत्सु एवं गुण-विशेषण-विशिष्टायां शुभपुण्यतिथौ,`,
    `मम आत्मनः श्रुति-स्मृति-पुराणोक्त फलप्राप्त्यर्थं धर्म-अर्थ-काम-मोक्ष चतुर्विध पुरुषार्थ सिद्ध्यर्थं श्रीपरमेश्वर प्रीत्यर्थं च शास्त्र-पारायणं ध्यानं च अहं करिष्ये ॥`,
  ].join('\n');

  const transliteration = [
    'Oṁ śrīmad-bhagavato mahāpuruṣasya viṣṇor-ājñayā pravartamānasya adya brahmaṇaḥ dvitīya-parārdhe śrī-śvetavarāha-kalpe vaivasvata-manvantare aṣṭāviṁśatitame kaliyuge prathama-pāde,',
    `${desha}, Meroḥ dakṣiṇa-pārśve, śakābde asmin vartamāne vyāvahārike ${samvatsara} nāma saṁvatsare,`,
    `${ay.iast}, ${ri.iast}, ${m.iast} māse, ${p.iast} pakṣe, ${t.iast}yāṁ śubha-tithau, ${v.iastVasare}, ${n.iast} nakṣatra-yuktāyāṁ,`,
    `evaṁ guṇa-viśeṣaṇa-viśiṣṭāyāṁ śubha-puṇya-tithau,`,
    `mama ātmanaḥ śruti-smṛti-purāṇokta phala-prāptyarthaṁ ${purpose}, śrī-parameśvara prītyarthaṁ ca śāstra-pārāyaṇaṁ dhyānaṁ ca ahaṁ kariṣye ||`,
  ].join('\n');

  const englishMeaning = `In the sacred order of the Supreme Being, during the ${samvatsara} Samvatsara, in ${ayana} (${ritu} Ritu), in the lunar month of ${masa}, ${paksha} Paksha, on the auspicious ${tithi} Tithi, ${vara} (${v.iast}vāsara), under the ${nakshatra} Nakshatra — I resolve to undertake today's sacred scripture study, contemplation, and righteous duty (${purpose}) for inner clarity and universal harmony.`;

  return {
    sanskrit,
    transliteration,
    englishMeaning,
    params: {
      masa,
      paksha,
      tithi,
      vara,
      nakshatra,
      samvatsara,
      ayana,
      ritu,
      desha,
      purpose,
    },
  };
}

export { MASA_LIST, NAKSHATRA_LIST, TITHI_SHUKLA_LIST, TITHI_KRISHNA_LIST };
