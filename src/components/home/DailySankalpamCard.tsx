'use client';

import React, { useState, useMemo } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import {
  generateSankalpam,
  getDefaultLunarParamsForDate,
  MASA_LIST,
  NAKSHATRA_LIST,
  TITHI_SHUKLA_LIST,
  TITHI_KRISHNA_LIST,
  VARA_LIST,
  LunarMasa,
  LunarPaksha,
  LunarTithi,
  VedicVara,
  VedicNakshatra,
} from '../../lib/panchanga/sankalpam';

/**
 * Interactive Daily Sankalpam Card displaying the formal Sanskrit Sankalpam
 * generated from lunar Panchanga parameters (Masa, Paksha, Tithi, Vara, Nakshatra).
 */
export const DailySankalpamCard: React.FC = () => {
  const initialDefaults = useMemo(() => getDefaultLunarParamsForDate(new Date()), []);
  const [masa, setMasa] = useState<LunarMasa>(initialDefaults.masa);
  const [paksha, setPaksha] = useState<LunarPaksha>(initialDefaults.paksha);
  const [tithi, setTithi] = useState<LunarTithi>(initialDefaults.tithi);
  const [vara, setVara] = useState<VedicVara>(initialDefaults.vara);
  const [nakshatra, setNakshatra] = useState<VedicNakshatra>(initialDefaults.nakshatra);
  const [isExpanded, setIsExpanded] = useState(false);

  const sankalpam = useMemo(
    () =>
      generateSankalpam({
        masa,
        paksha,
        tithi,
        vara,
        nakshatra,
        samvatsara: initialDefaults.samvatsara,
        ayana: initialDefaults.ayana,
        ritu: initialDefaults.ritu,
      }),
    [masa, paksha, tithi, vara, nakshatra, initialDefaults.samvatsara, initialDefaults.ayana, initialDefaults.ritu]
  );

  const tithiOptions = paksha === 'Shukla' ? TITHI_SHUKLA_LIST : TITHI_KRISHNA_LIST;

  return (
    <section
      aria-label="Daily Sacred Sankalpam"
      className="w-full bg-gradient-to-br from-stitch-parchment/80 via-stitch-ivory to-stitch-parchment/70 rounded-2xl border border-stitch-gold/40 shadow-sm p-4 md:p-5"
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-stitch-maroon/10 border border-stitch-maroon/20 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-stitch-maroon" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stitch-deepGold">
                Daily Sankalpam
              </span>
              <Sparkles className="w-3 h-3 text-stitch-gold" />
            </div>
            <p className="text-xs sm:text-sm font-serif font-bold text-stitch-slate">
              {masa} · {paksha} {tithi} · {vara} · {nakshatra}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          className="min-h-[36px] px-3 py-1.5 rounded-xl bg-stitch-ivory border border-stitch-sand hover:border-stitch-gold text-xs font-semibold text-stitch-maroon flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
        >
          <span>{isExpanded ? 'Hide Sankalpam' : 'Recite Sankalpam'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-stitch-sand/70 flex flex-col gap-4">
          {/* Adjustable Lunar Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider text-stitch-stone">
              <span>Masa</span>
              <select
                value={masa}
                onChange={(e) => setMasa(e.target.value as LunarMasa)}
                className="min-h-[36px] px-2 py-1 rounded-lg bg-stitch-ivory border border-stitch-sand text-xs font-medium text-stitch-slate"
              >
                {MASA_LIST.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider text-stitch-stone">
              <span>Paksha</span>
              <select
                value={paksha}
                onChange={(e) => {
                  const nextPaksha = e.target.value as LunarPaksha;
                  setPaksha(nextPaksha);
                  if (nextPaksha === 'Shukla' && tithi === 'Amavasya') setTithi('Purnima');
                  if (nextPaksha === 'Krishna' && tithi === 'Purnima') setTithi('Amavasya');
                }}
                className="min-h-[36px] px-2 py-1 rounded-lg bg-stitch-ivory border border-stitch-sand text-xs font-medium text-stitch-slate"
              >
                <option value="Shukla">Shukla</option>
                <option value="Krishna">Krishna</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider text-stitch-stone">
              <span>Tithi</span>
              <select
                value={tithi}
                onChange={(e) => setTithi(e.target.value as LunarTithi)}
                className="min-h-[36px] px-2 py-1 rounded-lg bg-stitch-ivory border border-stitch-sand text-xs font-medium text-stitch-slate"
              >
                {tithiOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider text-stitch-stone">
              <span>Vara</span>
              <select
                value={vara}
                onChange={(e) => setVara(e.target.value as VedicVara)}
                className="min-h-[36px] px-2 py-1 rounded-lg bg-stitch-ivory border border-stitch-sand text-xs font-medium text-stitch-slate"
              >
                {VARA_LIST.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider text-stitch-stone col-span-2 sm:col-span-1">
              <span>Nakshatra</span>
              <select
                value={nakshatra}
                onChange={(e) => setNakshatra(e.target.value as VedicNakshatra)}
                className="min-h-[36px] px-2 py-1 rounded-lg bg-stitch-ivory border border-stitch-sand text-xs font-medium text-stitch-slate"
              >
                {NAKSHATRA_LIST.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Formal Sanskrit Sankalpam */}
          <div className="bg-stitch-ivory rounded-xl p-4 border border-stitch-sand/80 flex flex-col gap-2.5">
            <p className="font-devanagari text-sm md:text-base font-semibold text-stitch-maroon whitespace-pre-line leading-[1.9]">
              {sankalpam.sanskrit}
            </p>
            <p className="text-xs font-mono text-stitch-stone italic whitespace-pre-line leading-relaxed">
              {sankalpam.transliteration}
            </p>
            <p className="text-xs text-stitch-slate leading-relaxed pt-2 border-t border-stitch-sand/60">
              {sankalpam.englishMeaning}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
