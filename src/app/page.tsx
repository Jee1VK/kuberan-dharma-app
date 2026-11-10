'use client';

import React from 'react';
import Link from 'next/link';
import { ShlokaOfTheDay } from '../components/home/ShlokaOfTheDay';
import { CorpusGrid } from '../components/home/CorpusGrid';
import { getCuratedStashes } from '../lib/data';
import { StashCard } from '../components/stashes/StashCard';
import { useUserStore } from '../lib/storage/userStore';
import { getAssetUrl } from '../lib/utils/basePath';
import { Sparkles, ArrowRight, Bookmark, Compass, Smartphone } from 'lucide-react';
import { DownloadAppButton } from '../components/pwa/DownloadAppButton';
import { useIsStandalone } from '../lib/hooks/useIsStandalone';

export default function HomePage() {
  const { preferences, setLanguage } = useUserStore();
  const curatedStashes = getCuratedStashes();
  const isStandalone = useIsStandalone();

  const languages: Array<{ code: any; label: string }> = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'sa', label: 'संस्कृतम्' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stitch-ivory">
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 md:py-8 flex flex-col gap-10">
        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-br from-stitch-parchment/90 via-stitch-ivory to-stitch-parchment/80 border-2 border-stitch-sand/90 p-6 md:p-10 shadow-sm overflow-hidden text-center flex flex-col items-center">
          {/* Subtle Centered Kuberan Heritage Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
            <img
              src={getAssetUrl('/images/kuberan_watermark_full.png')}
              alt=""
              aria-hidden="true"
              className="w-full max-w-[240px] sm:max-w-[320px] md:max-w-[400px] max-h-[65%] object-contain opacity-[0.04]"
            />
          </div>

          {/* Sacred Eyebrow Badge */}
          <div className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stitch-gold/15 border border-stitch-gold/30 text-stitch-deepGold text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-stitch-gold" />
            <span>Sacred Daily Wisdom · Kuberan Silks Heritage</span>
          </div>

          <h1 className="relative z-10 font-serif font-bold text-2xl sm:text-3xl md:text-5xl text-stitch-maroon tracking-tight leading-tight max-w-3xl">
            Timeless Wisdom from Ramayana to the Gita, in Bite-Sized Cards
          </h1>

          <p className="relative z-10 text-xs sm:text-sm md:text-base text-stitch-stone max-w-2xl mt-2.5 leading-relaxed">
            Understand the deep spiritual essence, original Sanskrit shlokas, and everyday life applications across 6 Indian languages for peace and clarity.
          </p>

          {/* Life Intent Quick Pills */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-4 max-w-xl">
            <span className="text-[11px] uppercase tracking-wider text-stitch-deepGold font-bold mr-1">Seek Wisdom For:</span>
            {[
              { label: 'Inner Peace', tag: 'Inner Peace' },
              { label: 'Duty & Karma', tag: 'Dharma & Ethics' },
              { label: 'Leadership', tag: 'Leadership' },
              { label: 'Mindset', tag: 'Mindset' },
            ].map((item) => (
              <Link
                key={item.label}
                href={`/feed?filter=${encodeURIComponent(item.tag)}`}
                className="px-2.5 py-1 text-xs font-semibold rounded-full bg-stitch-parchment/90 border border-stitch-sand/80 text-stitch-slate hover:border-stitch-gold hover:text-stitch-maroon transition-all"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Language Fast-Pills */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-1.5 mt-4">
            <span className="text-xs text-stitch-stone font-semibold mr-1">Language:</span>
            {languages.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={`min-h-[36px] px-3 py-1 text-xs font-semibold rounded-full transition-all border cursor-pointer ${
                  preferences.language === l.code
                    ? 'bg-stitch-maroon text-stitch-ivory border-stitch-maroon shadow-sm'
                    : 'bg-stitch-ivory/90 text-stitch-slate border-stitch-sand/80 hover:border-stitch-gold hover:text-stitch-maroon'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Hero CTAs */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 mt-6">
            <DownloadAppButton variant="hero" />

            <Link
              href="/feed"
              className="min-h-[44px] px-6 py-2.5 rounded-2xl bg-stitch-maroon hover:bg-stitch-maroonHover text-stitch-ivory font-serif font-bold text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 border border-stitch-gold/40"
            >
              <Compass className="w-4 h-4 text-stitch-gold" />
              <span>Explore Wisdom Feed</span>
            </Link>

            <Link
              href="/stashes"
              className="min-h-[44px] px-6 py-2.5 rounded-2xl bg-stitch-ivory border-2 border-stitch-gold/60 text-stitch-maroon hover:bg-stitch-parchment font-serif font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <Bookmark className="w-4 h-4 text-stitch-deepGold" />
              <span>Browse Stashes</span>
            </Link>
          </div>
        </div>

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
          <section className="relative rounded-3xl bg-gradient-to-r from-stitch-parchment via-stitch-ivory to-stitch-parchment border-2 border-stitch-sand/80 p-6 md:p-8 overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={getAssetUrl('/images/app-icon-192.png')}
                alt="Kuberan Dharma App Icon"
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-md border border-stitch-gold/50 object-cover flex-shrink-0"
              />
              <div className="text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stitch-gold/15 border border-stitch-gold/30 text-stitch-deepGold text-[11px] font-bold uppercase tracking-wider mb-1">
                  <Smartphone className="w-3 h-3 text-stitch-deepGold" />
                  <span>Downloadable App</span>
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

          <p className="text-[11px] text-stitch-stone">
            © {new Date().getFullYear()} KUBERAN DHARMA APP. Built with Google Stitch Design System.
          </p>
        </div>
      </footer>
    </div>
  );
}
