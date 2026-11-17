import { describe, it, expect } from 'vitest';
import { generateSankalpam, getDefaultLunarParamsForDate } from '@/lib/panchanga/sankalpam';

describe('Dynamic Daily Sankalpam Generator', () => {
  it('generates formal Sanskrit, IAST, and English Sankalpam from explicit lunar parameters', () => {
    const result = generateSankalpam({
      masa: 'Kartika',
      paksha: 'Shukla',
      tithi: 'Ashtami',
      vara: 'Mangalavara',
      nakshatra: 'Dhanishtha',
      samvatsara: 'Parabhava',
    });

    expect(result.sanskrit).toContain('कार्तिकमासे');
    expect(result.sanskrit).toContain('शुक्लपक्षे');
    expect(result.sanskrit).toContain('अष्टमीयां शुभतिथौ');
    expect(result.sanskrit).toContain('भौमवासरे');
    expect(result.sanskrit).toContain('धनिष्ठा नक्षत्रयुक्तायां');

    expect(result.transliteration).toContain('Kārtika māse');
    expect(result.transliteration).toContain('Śukla pakṣe');
    expect(result.englishMeaning).toContain('Kartika');
    expect(result.englishMeaning).toContain('Dhanishtha');
  });

  it('derives sensible lunar defaults for any given Gregorian date', () => {
    const date = new Date('2026-11-17T07:00:00Z'); // Tuesday -> Mangalavara
    const defaults = getDefaultLunarParamsForDate(date);

    expect(defaults.vara).toBe('Mangalavara');
    expect(defaults.masa).toBe('Kartika');
    expect(defaults.ayana).toBe('Dakshinayana');
    expect(defaults.ritu).toBe('Hemanta');

    const output = generateSankalpam(defaults);
    expect(output.sanskrit.length).toBeGreaterThan(100);
  });
});
