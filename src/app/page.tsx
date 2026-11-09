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

export default function HomePage() {
  const { preferences, setLanguage } = useUserStore();
  const curatedStashes = getCuratedStashes();

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
        <div className="relative rounded-3xl bg-gradient-to-br from-stitch-parchment via-stitch-ivory to-stitch-parchment border-2 border-stitch-sand p-6 md:p-10 shadow-sm overflow-hidden text-center flex flex-col items-center">
          {/* Subtle gold emblem in background */}
          <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 opacity-10 pointer-events-none">
            <img src={getAssetUrl('/images/kuberan_logo_transparent.png')} alt="" className="w-64 h-64" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stitch-maroon/10 border border-stitch-maroon/20 text-stitch-maroon text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-stitch-gold fill-stitch-gold" />
            <span>Deepstash-Style Micro-Learning for Sacred Scriptures</span>
          </div>

          <h1 className="font-serif font-black text-3xl md:text-5xl text-stitch-maroon tracking-tight leading-tight max-w-3xl">
            Timeless Wisdom from Ramayana to the Gita, in Bite-Sized Cards
          </h1>

          <p className="text-sm md:text-base text-stitch-stone max-w-2xl mt-3 leading-relaxed">
            Understand the deep spiritual essence, word meanings, and practical life applications of the sacred texts — curated across 6 languages for everyday clarity.
          </p>

          {/* Language Fast-Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="text-xs text-stitch-stone font-semibold mr-1">Choose Language:</span>
            {languages.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={`min-h-[44px] px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all border cursor-pointer ${
                  preferences.language === l.code
                    ? 'bg-stitch-maroon text-stitch-ivory border-stitch-maroon shadow-sm'
                    : 'bg-stitch-ivory text-stitch-slate border-stitch-sand hover:border-stitch-gold'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <DownloadAppButton variant="hero" />

            <Link
              href="/feed"
              className="min-h-[44px] px-6 py-3 rounded-2xl bg-stitch-ivory border-2 border-stitch-sand hover:border-stitch-maroon text-stitch-maroon font-serif font-bold text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Compass className="w-4 h-4 text-stitch-deepGold" />
              <span>Explore Wisdom Feed</span>
            </Link>

            <Link
              href="/stashes"
              className="min-h-[44px] px-6 py-3 rounded-2xl bg-stitch-ivory border-2 border-stitch-gold/60 text-stitch-maroon hover:bg-stitch-parchment font-serif font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-sm"
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

        {/* Download Mobile App Showcase Banner */}
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
