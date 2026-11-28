'use client';

import React from 'react';
import Link from 'next/link';
import { ShlokaOfTheDay } from '../components/home/ShlokaOfTheDay';
import { DailySankalpamCard } from '../components/home/DailySankalpamCard';
import { CorpusGrid } from '../components/home/CorpusGrid';
import { getCuratedStashes } from '../lib/data';
import { StashCard } from '../components/stashes/StashCard';
import { useUserStore } from '../lib/storage/userStore';
import { getAssetUrl } from '../lib/utils/basePath';
import { ArrowRight, Bookmark, Compass, Smartphone, BookOpen } from 'lucide-react';
import { DownloadAppButton } from '../components/pwa/DownloadAppButton';
import { useIsStandalone } from '../lib/hooks/useIsStandalone';

export default function HomePage() {
  const { preferences } = useUserStore();
  const curatedStashes = getCuratedStashes();
  const isStandalone = useIsStandalone();

  const intentPaths = [
    { label: 'Inner Peace', tag: 'Inner Peace' },
    { label: 'Duty & Karma', tag: 'Dharma & Ethics' },
    { label: 'Leadership', tag: 'Leadership' },
    { label: 'Mindset', tag: 'Mindset' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stitch-ivory">
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 md:py-8 flex flex-col gap-10">
        {/* Asymmetric Editorial Sanctum Hero (Korvai Zari Accent + 60/40 Rhythm) */}
        <section className="relative rounded-3xl bg-gradient-to-br from-stitch-parchment/90 via-stitch-ivory to-stitch-parchment/70 border border-stitch-sand shadow-stitch-layered overflow-hidden">
          {/* Woven Korvai Zari Top & Left Edge */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-stitch-maroon via-stitch-gold to-stitch-maroon" />
          <div className="hidden md:block absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-stitch-maroon via-stitch-gold to-stitch-maroon" />

          {/* Subtle Centered Kuberan Heritage Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
            <img
              src={getAssetUrl('/images/kuberan_watermark_full.png')}
              alt=""
              aria-hidden="true"
              className="w-full max-w-[240px] sm:max-w-[320px] md:max-w-[380px] max-h-[65%] object-contain opacity-[0.04]"
            />
          </div>

          <div className="relative z-10 p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
            {/* Left 7 Columns: Editorial Headline & Primary Action */}
            <div className="md:col-span-7 flex flex-col items-start text-left gap-3">
              <span className="text-[11px] font-cinzel font-bold uppercase tracking-[0.18em] text-stitch-deepGold">
                Kuberan Silks · Chickpet Heritage
              </span>

              <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-[2.65rem] text-stitch-maroon tracking-tight leading-[1.15]">
                Timeless Wisdom from Ramayana to the Gita, in Bite-Sized Cards
              </h1>

              <div className="w-24 zari-divider my-0.5" aria-hidden="true" />

              <p className="text-sm md:text-base text-stitch-stone leading-relaxed max-w-xl">
                Original Sanskrit shlokas, syllable chanting guides, and practical everyday reflections across 6 Indian languages — 100% offline.
              </p>

              {/* Single Primary CTA (Zari Sheen) + Quiet Secondary */}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <Link
                  href="/feed"
                  className="btn-zari min-h-[44px] px-6 py-2.5 rounded-2xl font-serif font-bold text-sm flex items-center gap-2 shadow-sm border border-stitch-gold/50"
                >
                  <Compass className="w-4 h-4 text-stitch-gold" />
                  <span>Explore Wisdom Feed</span>
                </Link>

                <Link
                  href="/stashes"
                  className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-stitch-ivory/90 border border-stitch-gold/60 text-stitch-maroon hover:bg-stitch-parchment font-serif font-bold text-sm flex items-center gap-2 transition-colors active:scale-[0.97]"
                >
                  <Bookmark className="w-4 h-4 text-stitch-deepGold" />
                  <span>Browse Stashes</span>
                </Link>

                <DownloadAppButton variant="hero" />
              </div>
            </div>

            {/* Right 5 Columns: Contemplative Intent Panel */}
            <div className="md:col-span-5 bg-stitch-ivory/85 backdrop-blur-sm rounded-2xl border border-stitch-sand/90 p-5 flex flex-col gap-3.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-stitch-sand/70 pb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-stitch-deepGold">
                  Seek Wisdom For
                </span>
                <span className="text-[11px] font-mono text-stitch-stone tabular-nums">
                  6 Languages
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {intentPaths.map((item) => (
                  <Link
                    key={item.label}
                    href={`/feed?filter=${encodeURIComponent(item.tag)}`}
                    className="min-h-[44px] px-3 py-2 rounded-xl bg-stitch-parchment/80 border border-stitch-sand/90 text-xs font-semibold text-stitch-slate hover:border-stitch-gold hover:text-stitch-maroon transition-colors flex items-center justify-between gap-1 active:scale-[0.97]"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stitch-deepGold flex-shrink-0" />
                  </Link>
                ))}
              </div>

              <Link
                href="/read/bhagavad-gita/1"
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-stitch-maroon/5 border border-stitch-maroon/20 text-xs font-semibold text-stitch-maroon hover:bg-stitch-maroon/10 transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-stitch-maroon" />
                  <span>Open Bhagavad Gita Reader</span>
                </span>
                <span className="font-mono text-[11px] text-stitch-deepGold tabular-nums">18 Ch.</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Daily Sacred Sankalpam */}
        <DailySankalpamCard />

        {/* Shloka of the Day */}
        <ShlokaOfTheDay />

        {/* Featured Curated Stashes */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-stitch-maroon fill-current" />
              <h2 className="font-serif font-bold text-lg md:text-xl text-stitch-slate">
                Featured Curated Stashes
              </h2>
            </div>
            <Link
              href="/stashes"
              className="text-xs font-semibold text-stitch-maroon hover:underline flex items-center gap-1 min-h-[44px]"
            >
              <span>View All Stashes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {curatedStashes.slice(0, 2).map((stash) => (
              <StashCard
                key={stash.id}
                stash={stash}
                currentLanguage={preferences.language}
              />
            ))}
          </div>
        </section>

        {/* The 5 Sacred Corpuses Grid */}
        <CorpusGrid />

        {/* Download Mobile App Showcase Banner (Hidden when running inside installed app) */}
        {!isStandalone && (
          <section className="relative rounded-3xl bg-gradient-to-r from-stitch-parchment via-stitch-ivory to-stitch-parchment border border-stitch-sand shadow-stitch-layered p-6 md:p-8 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={getAssetUrl('/images/app-icon-192.png')}
                alt="Kuberan Dharma App Icon"
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-md border border-stitch-gold/50 object-cover flex-shrink-0"
              />
              <div className="text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stitch-gold/15 border border-stitch-gold/30 text-stitch-deepGold text-[11px] font-bold uppercase tracking-wider mb-1">
                  <Smartphone className="w-3 h-3 text-stitch-deepGold" />
                  <span>Offline App</span>
                </div>
                <h3 className="font-serif font-bold text-xl md:text-2xl text-stitch-maroon">
                  Take Dharma Anywhere, 100% Offline
                </h3>
                <p className="text-xs md:text-sm text-stitch-stone max-w-lg mt-1">
                  Install on Android, iPhone, iPad, or Desktop. Enjoy distraction-free scripture reading, daily shloka chants, and offline access anytime.
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 w-full md:w-auto">
              <DownloadAppButton variant="hero" className="w-full md:w-auto" />
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stitch-sand bg-stitch-parchment/60 py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <a
            href="https://kuberansilks.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 group min-h-[44px]"
          >
            <img
              src={getAssetUrl('/images/kuberan_logo_transparent.png')}
              alt="Kuberan Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="font-serif font-bold text-sm text-stitch-maroon group-hover:underline">
              Kuberan Silks Chickpet · Bengaluru
            </span>
          </a>

          <DownloadAppButton variant="footer" />

          <p className="text-xs text-stitch-stone max-w-md">
            Dedicated to bringing the timeless wisdom of the Gita, Ramayana, Mahabharata, Vedas, and Puranas into everyday modern life.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-stitch-stone">
            <span>© {new Date().getFullYear()} KUBERAN DHARMA APP.</span>
            <Link href="/privacy" className="text-stitch-maroon hover:underline font-semibold min-h-[44px] inline-flex items-center">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-stitch-maroon hover:underline font-semibold min-h-[44px] inline-flex items-center">
              Terms of Use
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
