'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Sparkles, Bookmark, BookOpen, ExternalLink, Globe, RefreshCw } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { useUserStore } from '../../lib/storage/userStore';
import { getAssetUrl } from '../../lib/utils/basePath';
import { DownloadAppButton } from '../pwa/DownloadAppButton';
import {
  checkAndDownloadOtaUpdate,
  applyOtaBundleNow,
  getCurrentOtaVersion,
} from '../../lib/ota/otaUpdater';

export const AppNavbar: React.FC = () => {
  const pathname = usePathname();
  const { streak, preferences, setLanguage } = useUserStore();
  const [isNative, setIsNative] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'checking' | 'uptodate' | 'offline' | 'applying'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: Compass },
    { href: '/feed', label: 'Daily Feed', icon: Sparkles },
    { href: '/stashes', label: 'Stashes', icon: Bookmark },
    { href: '/read/bhagavad-gita/1', label: 'Read Gita', icon: BookOpen },
  ];

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'sa', label: 'संस्कृत' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
  ];

  const showTransientStatus = (status: 'uptodate' | 'offline', msg: string) => {
    setUpdateStatus(status);
    setStatusMessage(msg);
    setTimeout(() => {
      setUpdateStatus('idle');
      setStatusMessage('');
    }, 3500);
  };

  const handleManualUpdateCheck = async () => {
    if (updateStatus === 'checking' || updateStatus === 'applying') return;

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      showTransientStatus('offline', 'Connect to internet to check updates');
      return;
    }

    setUpdateStatus('checking');
    setStatusMessage('Checking for updates...');

    if (Capacitor.isNativePlatform()) {
      const downloaded = await checkAndDownloadOtaUpdate({ force: true });
      if (downloaded) {
        setUpdateStatus('applying');
        setStatusMessage(`Applying v${downloaded.version}...`);
        await applyOtaBundleNow(downloaded.bundleId);
      } else {
        const currentVer = await getCurrentOtaVersion();
        showTransientStatus('uptodate', `Up to date (v${currentVer})`);
      }
    } else {
      // Web / PWA: trigger SW update check & reload
      try {
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg) await reg.update();
        }
        window.location.reload();
      } catch {
        window.location.reload();
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-stitch-ivory/95 backdrop-blur-md border-b border-stitch-sand/80 shadow-sm ${
        isNative ? 'pt-[max(2.25rem,env(safe-area-inset-top,36px))]' : 'pt-safe-top'
      }`}
    >
      <div className="max-w-5xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
        {/* Brand & Kuberan Logo wrapped in clickable link to kuberansilks.com */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <a
            href="https://kuberansilks.com/"
            target="_blank"
            rel="noopener noreferrer"
            title="Visit Kuberan Silks (Opens in new tab)"
            className="flex items-center justify-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stitch-gold rounded-lg p-0.5 min-w-[40px] sm:min-w-[44px] min-h-[44px] flex-shrink-0"
          >
            <img
              src={getAssetUrl('/images/kuberan_logo_transparent.png')}
              alt="Kuberan Logo"
              className="w-8 h-8 md:w-10 md:h-10 object-contain group-hover:scale-105 transition-transform"
            />
          </a>

          <Link href="/" className="flex flex-col min-w-0">
            <span className="font-cinzel font-bold text-[13px] sm:text-base md:text-lg tracking-wide text-stitch-maroon leading-none whitespace-nowrap">
              KUBERAN DHARMA
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase font-sans font-semibold tracking-widest text-stitch-deepGold flex items-center gap-1 mt-0.5 whitespace-nowrap">
              <span className="sm:hidden">Sacred Wisdom</span>
              <span className="hidden sm:inline">Sacred Micro-Wisdom</span>
              <span className="hidden md:inline text-stitch-stone">· by Kuberan Silks</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links (Hidden on mobile where MobileBottomNav takes over) */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname === link.href || pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-stitch-maroon text-stitch-ivory shadow-sm'
                    : 'text-stitch-stone hover:text-stitch-slate hover:bg-stitch-parchment'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'fill-current' : ''}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Language, Update App, Streak, and Download */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Global Language Pill */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-stitch-deepGold absolute left-2 pointer-events-none" />
            <select
              value={preferences.language}
              onChange={(e) => setLanguage(e.target.value as any)}
              aria-label="Select Scripture Language"
              className="w-[54px] sm:w-auto pl-6 pr-1 sm:pr-2.5 py-1 text-[11px] sm:text-xs rounded-xl bg-stitch-parchment/90 border border-stitch-sand text-stitch-slate font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-stitch-maroon appearance-none shadow-sm min-h-[44px]"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Manual Check & Apply Update Button */}
          <button
            type="button"
            onClick={handleManualUpdateCheck}
            disabled={updateStatus === 'checking' || updateStatus === 'applying'}
            title="Check for app updates"
            aria-label="Check for app updates"
            className="min-h-[44px] min-w-[40px] sm:min-w-[44px] px-2 sm:px-2.5 py-1 rounded-xl bg-stitch-parchment/90 border border-stitch-sand hover:border-stitch-gold text-stitch-maroon text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.97] transition-all cursor-pointer disabled:opacity-60"
          >
            <RefreshCw
              className={`w-4 h-4 text-stitch-maroon ${
                updateStatus === 'checking' || updateStatus === 'applying' ? 'animate-spin' : ''
              }`}
            />
            <span className="hidden sm:inline">Update</span>
          </button>

          <DownloadAppButton variant="navbar" />

          {/* Daily Streak Counter with Diya/Flame */}
          <div
            className="px-2 sm:px-3 py-1 rounded-full bg-stitch-parchment border border-stitch-sand flex items-center gap-1 text-[11px] sm:text-xs font-bold text-stitch-maroon min-h-[44px] tabular-nums"
            title={`${streak.currentStreak || 1} day learning streak!`}
          >
            <Sparkles className="w-3.5 h-3.5 text-stitch-gold fill-stitch-gold" />
            <span>{streak.currentStreak || 1}d</span>
          </div>

          {/* Direct Link to Kuberan Store on Desktop */}
          <a
            href="https://kuberansilks.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1 text-[11px] font-semibold text-stitch-deepGold hover:text-stitch-maroon transition-colors py-1.5 px-2.5 rounded-lg border border-stitch-sand/80 bg-stitch-parchment min-h-[44px]"
          >
            <span>kuberansilks.com</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Transient Update Check Status Bar */}
      {statusMessage && (
        <div
          role="status"
          aria-live="polite"
          className="w-full bg-stitch-maroon text-stitch-ivory text-[11px] font-semibold text-center py-1.5 px-4 border-t border-stitch-gold/40"
        >
          {statusMessage}
        </div>
      )}
    </header>
  );
};
