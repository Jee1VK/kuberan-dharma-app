'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

/**
 * Handles Android hardware back button navigation inside Capacitor native builds.
 * - Navigates back in router/browser history when not on the home route (`/`).
 * - Exits the app cleanly only when the user presses back from the root `/` screen.
 */
export const CapacitorBackHandler: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let listenerHandle: { remove: () => Promise<void> } | null = null;

    const setupListener = async () => {
      listenerHandle = await App.addListener('backButton', ({ canGoBack }) => {
        if (pathname && pathname !== '/' && pathname !== '/index.html') {
          if (canGoBack && window.history.length > 1) {
            window.history.back();
          } else {
            router.push('/');
          }
        } else {
          void App.exitApp();
        }
      });
    };

    void setupListener();

    return () => {
      if (listenerHandle) {
        void listenerHandle.remove();
      }
    };
  }, [pathname, router]);

  return null;
};
