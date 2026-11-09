'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Sparkles, Bookmark, BookOpen, ExternalLink } from 'lucide-react';
import { useUserStore } from '../../lib/storage/userStore';

export const AppNavbar: React.FC = () => {
  const pathname = usePathname();
  const { streak } = useUserStore();

  const navLinks = [
    { href: '/', label: 'Home', icon: Compass },
    { href: '/feed', label: 'Daily Feed', icon: Sparkles },
    { href: '/stashes', label: 'Stashes', icon: Bookmark },
    { href: '/read/bhagavad-gita/1', label: 'Read Gita', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-stitch-ivory/95 backdrop-blur-md border-b border-stitch-sand/80 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand & Kuberan Logo wrapped in clickable link to kuberansilks.com */}
        <div className="flex items-center gap-3">
          <a
            href="https://kuberansilks.com/"
            target="_blank"
            rel="noopener noreferrer"
            title="Visit Kuberan Silks (Opens in new tab)"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stitch-gold rounded-lg p-0.5"
          >
            <img
              src="/images/kuberan_logo_transparent.png"
              alt="Kuberan Logo"
              className="w-9 h-9 md:w-10 md:h-10 object-contain group-hover:scale-105 transition-transform"
            />
          </a>

          <Link href="/" className="flex flex-col">
            <span className="font-serif font-black text-base md:text-lg tracking-wide text-stitch-maroon leading-none">
              KUBERAN DHARMA
            </span>
            <span className="text-[10px] uppercase font-sans font-semibold tracking-widest text-stitch-deepGold flex items-center gap-1">
              <span>Sacred Micro-Wisdom</span>
              <span className="hidden sm:inline text-stitch-stone">· by Kuberan Silks</span>
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-stitch-maroon text-stitch-ivory shadow-sm'
                    : 'text-stitch-stone hover:text-stitch-slate hover:bg-stitch-parchment'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'fill-current' : ''}`} />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            );
          })}

          {/* Daily Streak Indicator */}
          {streak.currentStreak > 0 && (
            <div
              className="ml-2 px-2.5 py-1 rounded-full bg-stitch-parchment border border-stitch-sand flex items-center gap-1 text-xs font-bold text-stitch-maroon"
              title={`${streak.currentStreak} day learning streak!`}
            >
              <Sparkles className="w-3.5 h-3.5 text-stitch-gold fill-stitch-gold" />
              <span>{streak.currentStreak}d</span>
            </div>
          )}

          {/* Direct Link to Kuberan Store */}
          <a
            href="https://kuberansilks.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1 ml-2 text-[11px] font-semibold text-stitch-deepGold hover:text-stitch-maroon transition-colors py-1 px-2 rounded-lg border border-stitch-sand/80 bg-stitch-parchment"
          >
            <span>kuberansilks.com</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </nav>
      </div>
    </header>
  );
};
