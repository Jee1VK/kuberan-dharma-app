'use client';

import { useEffect } from 'react';
import { getAssetUrl } from '../../lib/utils/basePath';

export const ServiceWorkerRegister: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      const swUrl = getAssetUrl('/sw.js');
      const swScope = getAssetUrl('/');

      navigator.serviceWorker
        .register(swUrl, { scope: swScope })
        .then((registration) => {
          console.log('[Kuberan Dharma PWA] ServiceWorker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.warn('[Kuberan Dharma PWA] ServiceWorker registration notice:', error);
        });
    }
  }, []);

  return null;
};
