'use client';

import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

/**
 * Hook to detect whether the user is running inside an installed app:
 * - Native Android/iOS Capacitor wrapper (`Capacitor.isNativePlatform()`)
 * - Installed PWA (standalone, fullscreen, minimal-ui, iOS home screen, or TWA)
 */
export function useIsStandalone(): boolean {
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  useEffect(() => {
    const checkStandalone = () => {
      if (typeof window === 'undefined') return;

      const isCapacitorNative =
        Capacitor.isNativePlatform() || window.location.protocol === 'capacitor:';
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isFullscreenMedia = window.matchMedia('(display-mode: fullscreen)').matches;
      const isMinimalUiMedia = window.matchMedia('(display-mode: minimal-ui)').matches;
      const isIosStandalone =
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      const isAndroidAppReferrer = document.referrer.includes('android-app://');

      let isStoredInstalled = false;
      try {
        isStoredInstalled = localStorage.getItem('kuberan_dharma_installed') === 'true';
      } catch {
        // Ignore storage restrictions
      }

      const installed = Boolean(
        isCapacitorNative ||
          isStandaloneMedia ||
          isFullscreenMedia ||
          isMinimalUiMedia ||
          isIosStandalone ||
          isAndroidAppReferrer ||
          isStoredInstalled
      );

      setIsStandalone(installed);
    };

    checkStandalone();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsStandalone(true);
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    const handleAppInstalled = () => {
      setIsStandalone(true);
      try {
        localStorage.setItem('kuberan_dharma_installed', 'true');
      } catch {
        // Ignore localStorage restrictions
      }
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return isStandalone;
}
