'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, CheckCircle, Share, PlusSquare, ArrowRight, ShieldCheck, WifiOff, Zap, Sparkles } from 'lucide-react';
import { getAssetUrl } from '../../lib/utils/basePath';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallAppModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const isInStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://') ||
      localStorage.getItem('kuberan_dharma_installed') === 'true';
    setIsStandalone(Boolean(isInStandaloneMode));

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    const handleAppInstalled = () => {
      setInstallSuccess(true);
      setIsStandalone(true);
      setDeferredPrompt(null);
      try {
        localStorage.setItem('kuberan_dharma_installed', 'true');
      } catch {}
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setInstallSuccess(true);
        setIsStandalone(true);
        try {
          localStorage.setItem('kuberan_dharma_installed', 'true');
        } catch {}
      }
      setDeferredPrompt(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stitch-slate/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-stitch-ivory rounded-3xl border border-stitch-gold/40 shadow-2xl overflow-hidden p-6 md:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-app-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full text-stitch-stone hover:text-stitch-slate hover:bg-stitch-parchment transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close install modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Icon */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={getAssetUrl('/images/app-icon-192.png')}
            alt="Kuberan Dharma App Icon"
            className="w-16 h-16 rounded-2xl shadow-md border border-stitch-gold/50 object-cover"
          />
          <div>
            <h2 id="install-app-title" className="font-serif font-bold text-xl md:text-2xl text-stitch-maroon leading-tight">
              KUBERAN DHARMA
            </h2>
            <p className="text-xs font-semibold text-stitch-deepGold tracking-wide">
              Official Mobile App · Kuberan Silks Chickpet
            </p>
          </div>
        </div>

        {/* Status: Already installed */}
        {isStandalone ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 mb-6">
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">App is already installed!</p>
              <p className="text-xs text-emerald-700">You are currently enjoying the standalone offline version.</p>
            </div>
          </div>
        ) : installSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 mb-6">
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Successfully Installed!</p>
              <p className="text-xs text-emerald-700">
                Kuberan Dharma is now added to your home screen and available offline anytime.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Value Propositions */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-stitch-parchment border border-stitch-sand/60">
                <div className="w-8 h-8 rounded-lg bg-stitch-maroon/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <WifiOff className="w-4 h-4 text-stitch-maroon" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stitch-slate uppercase tracking-wider">100% Offline Access</h4>
                  <p className="text-xs text-stitch-stone">
                    Read the Bhagavad Gita and all Dharma cards even in airplane mode or temples without internet.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-stitch-parchment border border-stitch-sand/60">
                <div className="w-8 h-8 rounded-lg bg-stitch-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-stitch-deepGold" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stitch-slate uppercase tracking-wider">Instant Native Experience</h4>
                  <p className="text-xs text-stitch-stone">
                    Zero browser URL bar clutter, fast icon launch directly from your home screen or dock.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-stitch-parchment border border-stitch-sand/60">
                <div className="w-8 h-8 rounded-lg bg-stitch-maroon/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-stitch-maroon" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stitch-slate uppercase tracking-wider">Daily Sacred Chanting</h4>
                  <p className="text-xs text-stitch-stone">
                    Listen to Sanskrit shloka audio chanting and track daily streaks across 6 languages.
                  </p>
                </div>
              </div>
            </div>

            {/* Platform-Specific Instructions */}
            {isIOS ? (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 mb-6">
                <h4 className="font-bold text-sm flex items-center gap-2 mb-2 text-amber-950">
                  <Smartphone className="w-4 h-4 text-stitch-maroon" />
                  How to Install on iPhone / iPad (Safari):
                </h4>
                <ol className="text-xs space-y-2 list-decimal list-inside text-amber-900/90 font-medium">
                  <li>
                    Tap the <strong className="text-stitch-maroon">Share</strong> button{' '}
                    <Share className="w-3.5 h-3.5 inline align-text-bottom mx-0.5" /> in Safari.
                  </li>
                  <li>
                    Scroll down and tap <strong className="text-stitch-maroon">Add to Home Screen</strong>{' '}
                    <PlusSquare className="w-3.5 h-3.5 inline align-text-bottom mx-0.5" />.
                  </li>
                  <li>
                    Tap <strong className="text-stitch-maroon">Add</strong> in the top-right corner.
                  </li>
                </ol>
              </div>
            ) : deferredPrompt ? (
              <div className="mb-6">
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3.5 px-6 rounded-2xl bg-stitch-maroon text-stitch-ivory font-bold text-sm tracking-wide shadow-md hover:bg-stitch-maroon/90 active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <Download className="w-5 h-5 text-stitch-gold" />
                  <span>Download & Install App (1-Click)</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 mb-6">
                <h4 className="font-bold text-sm flex items-center gap-2 mb-2 text-amber-950">
                  <Smartphone className="w-4 h-4 text-stitch-maroon" />
                  Install from Browser Menu:
                </h4>
                <p className="text-xs text-amber-900/90 mb-2">
                  Tap your browser menu (<strong className="text-stitch-maroon">⋮</strong> on Android or desktop URL bar icon) and select{' '}
                  <strong className="text-stitch-maroon">&quot;Install app&quot;</strong> or{' '}
                  <strong className="text-stitch-maroon">&quot;Add to Home screen&quot;</strong>.
                </p>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-stitch-sand/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-stitch-stone">
            <ShieldCheck className="w-4 h-4 text-stitch-deepGold" />
            <span>Kuberan Silks Verified PWA</span>
          </div>

          <a
            href="https://github.com/Jee1VK/kuberan-dharma-app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-stitch-maroon hover:text-stitch-deepGold flex items-center gap-1 transition-colors"
          >
            <span>GitHub Repository</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
