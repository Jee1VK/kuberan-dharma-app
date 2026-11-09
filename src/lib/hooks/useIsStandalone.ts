'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect whether the user is running inside the installed PWA
 * (standalone display mode, iOS home screen webapp, or fullscreen PWA).
 */
export function useIsStandalone(): boolean {
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  useEffect(() => {
    const checkStandalone = () => {
      if (typeof window === 'undefined') return;

      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isFullscreenMedia = window.matchMedia('(display-mode: fullscreen)').matches;
      const isMinimalUiMedia = window.matchMedia('(display-mode: minimal-ui)').matches;
      const isIosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      const isAndroidAppReferrer = document.referrer.includes('android-app://');
      const isStoredInstalled = localStorage.getItem('kuberan_dharma_installed') === 'true';

      const installed = Boolean(
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

    // Listen for media query changes (e.g. if display mode changes)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsStandalone(true);
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    // Listen for the appinstalled event triggered by Chromium browsers
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
