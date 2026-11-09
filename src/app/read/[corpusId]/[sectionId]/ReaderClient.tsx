'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSection, getCorpus, getAllCards } from '../../../../lib/data';
import { CorpusId, LanguageCode } from '../../../../lib/types/scripture';
import { useUserStore } from '../../../../lib/storage/userStore';
import { DharmaCard } from '../../../../components/card/DharmaCard';
import { ArrowLeft, ArrowRight, BookOpen, Globe } from 'lucide-react';

interface ReaderClientProps {
  corpusId: CorpusId;
  sectionIdNum: number;
}

export default function ReaderClient({ corpusId, sectionIdNum }: ReaderClientProps) {
  const router = useRouter();
  const { preferences, setLanguage, isCardInAnyStash, completedCardIds, markCardRead } = useUserStore();

  const corpus = getCorpus(corpusId);
  const currentSection = getSection(corpusId, sectionIdNum);

  // Get verses for this chapter
  const allCards = getAllCards();
  const chapterCards = allCards.filter(
    (c) => c.corpusId === corpusId && c.sectionNumber === sectionIdNum
  );

  const title = currentSection
    ? currentSection.title[preferences.language] || currentSection.title.en
    : `Chapter ${sectionIdNum}`;

  const summary = currentSection
    ? currentSection.summary[preferences.language] || currentSection.summary.en
    : '';

  const languages: Array<{ code: LanguageCode; label: string }> = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'sa', label: 'संस्कृतम्' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
  ];

  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/read/${corpusId}/${e.target.value}`);
  };

  return (
    <main className="min-h-screen bg-stitch-ivory px-4 py-6 pb-24">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-stitch-sand">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stitch-stone hover:text-stitch-maroon py-1.5 px-3 rounded-lg bg-stitch-parchment border border-stitch-sand"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-stitch-deepGold" />
            <select
              value={preferences.language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              aria-label="Reader Language"
              className="text-xs font-semibold py-1.5 px-2.5 rounded-lg bg-stitch-parchment border border-stitch-sand text-stitch-slate cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chapter Header Banner */}
        <div className="bg-stitch-parchment/70 rounded-2xl p-6 border border-stitch-sand flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-stitch-maroon/10 text-stitch-maroon border border-stitch-maroon/20">
              {corpus?.title.en || 'Bhagavad Gita'}
            </span>

            {/* Chapter Jumper Dropdown */}
            {corpus && corpus.sections.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span className="text-stitch-stone">Jump to:</span>
                <select
                  value={sectionIdNum}
                  onChange={handleChapterChange}
                  aria-label="Jump to Chapter"
                  className="py-1 px-2 text-xs rounded-lg bg-stitch-ivory border border-stitch-sand font-serif font-bold text-stitch-maroon"
                >
                  {corpus.sections.map((s) => (
                    <option key={s.sectionNumber} value={s.sectionNumber}>
                      Ch. {s.sectionNumber}: {s.sanskritTitle}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <h1 className="font-serif font-bold text-2xl md:text-3xl text-stitch-slate leading-tight">
            {title}
          </h1>

          {currentSection?.sanskritTitle && (
            <p className="font-serif text-sm font-semibold text-stitch-deepGold italic">
              {currentSection.sanskritTitle}
            </p>
          )}

          {summary && (
            <p className="text-xs md:text-sm text-stitch-stone leading-relaxed">
              {summary}
            </p>
          )}
        </div>

        {/* Verses Container */}
        <div className="flex flex-col gap-6">
          {chapterCards.length === 0 ? (
            <div className="p-8 text-center bg-stitch-parchment/60 rounded-2xl border border-dashed border-stitch-sand">
              <BookOpen className="w-8 h-8 text-stitch-stone mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-stitch-slate">
                Verses for this chapter are loading or available in the Daily Feed.
              </p>
              <Link
                href="/read/bhagavad-gita/2"
                className="inline-block mt-3 text-xs font-semibold text-stitch-maroon underline"
              >
                Go to Chapter 2 (Sankhya Yoga &amp; Verse 2.47)
              </Link>
            </div>
          ) : (
            chapterCards.map((card) => {
              const isStashed = isCardInAnyStash(card.id);
              const isRead = completedCardIds.includes(card.id);

              return (
                <DharmaCard
                  key={card.id}
                  unit={card}
                  currentLanguage={preferences.language}
                  isStashed={isStashed}
                  isRead={isRead}
                  onMarkRead={() => markCardRead(card.id)}
                />
              );
            })
          )}
        </div>

        {/* Next / Previous Chapter Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-stitch-sand">
          {sectionIdNum > 1 ? (
            <Link
              href={`/read/${corpusId}/${sectionIdNum - 1}`}
              className="px-4 py-2 rounded-xl bg-stitch-parchment hover:bg-stitch-sand/60 text-xs font-semibold text-stitch-slate flex items-center gap-1.5 border border-stitch-sand"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Chapter {sectionIdNum - 1}</span>
            </Link>
          ) : <div />}

          {sectionIdNum < 18 && (
            <Link
              href={`/read/${corpusId}/${sectionIdNum + 1}`}
              className="px-4 py-2 rounded-xl bg-stitch-maroon hover:bg-stitch-maroonHover text-xs font-semibold text-stitch-ivory flex items-center gap-1.5 shadow"
            >
              <span>Chapter {sectionIdNum + 1}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
