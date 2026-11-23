'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw, X, Sparkles } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import {
  notifyOtaAppReady,
  checkAndDownloadOtaUpdate,
  applyOtaBundleNow,
  DownloadedOtaUpdate,
} from '../../lib/ota/otaUpdater';

/**
 * Manages PWA-style Over-The-Air (OTA) live updates inside the native Android/iOS app.
 * - Confirms bundle health on startup (enabling automatic crash rollback).
 * - Silently downloads newer web bundles in the background when online.
 * - Shows a subtle, accessible Kuberan Stitch banner to apply immediately,
 *   or automatically activates the update on the next app restart.
 */
export const OtaUpdateManager: React.FC = () => {
  const [readyUpdate, setReadyUpdate] = useState<DownloadedOtaUpdate | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let cancelled = false;

    // 1. Mark current bundle healthy immediately so auto-rollback timer resets
    void notifyOtaAppReady();

    // 2. Check for OTA update shortly after launch (non-blocking)
    const runCheck = async (force = false) => {
      const downloaded = await checkAndDownloadOtaUpdate({ force });
      if (!cancelled && downloaded) {
        setReadyUpdate(downloaded);
      }
    };

    const startupTimer = setTimeout(() => {
      void runCheck(true);
    }, 2500);

    // 3. Re-check when returning to foreground (throttled internally to 5 min)
    let appStateHandle: { remove: () => Promise<void> } | null = null;
    const attachListener = async () => {
      appStateHandle = await App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {
          void runCheck(false);
        }
      });
    };
    void attachListener();

    return () => {
      cancelled = true;
      clearTimeout(startupTimer);
      if (appStateHandle) {
        void appStateHandle.remove();
      }
    };
  }, []);

  if (!readyUpdate) {
    return null;
  }

  const handleApplyNow = async () => {
    setIsApplying(true);
    await applyOtaBundleNow(readyUpdate.bundleId);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-3 right-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom,16px))] md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-50 rounded-2xl bg-stitch-maroon text-stitch-ivory border border-stitch-gold/60 shadow-2xl p-3.5 flex items-center justify-between gap-3"
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-stitch-gold/20 border border-stitch-gold/40 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-stitch-gold" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-serif font-bold text-stitch-ivory leading-snug">
            New Dharma Update Ready (v{readyUpdate.version})
          </p>
          <p className="text-[11px] text-stitch-parchment/85 line-clamp-2 mt-0.5">
            {readyUpdate.notes || 'Fresh sacred cards and improvements downloaded offline.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          type="button"
          onClick={handleApplyNow}
          disabled={isApplying}
          className="min-h-[44px] px-3 py-2 rounded-xl bg-stitch-gold text-stitch-slate font-bold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isApplying ? 'animate-spin' : ''}`} />
          <span>{isApplying ? 'Updating...' : 'Update'}</span>
        </button>

        <button
          type="button"
          onClick={() => setReadyUpdate(null)}
          aria-label="Apply update on next restart"
          className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-stitch-parchment/80 hover:text-stitch-ivory hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
