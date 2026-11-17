'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseWakeLockOptions {
  /** Whether continuous reading wake lock should be active (default: true) */
  enabled?: boolean;
}

export interface UseWakeLockReturn {
  /** Whether the Screen Wake Lock API is supported by the current browser */
  isSupported: boolean;
  /** Whether the screen wake lock is currently held */
  isActive: boolean;
  /** User-controlled toggle state for continuous reading mode */
  enabled: boolean;
  /** Toggle continuous reading mode on or off */
  toggle: () => void;
  /** Explicitly request wake lock */
  requestWakeLock: () => Promise<void>;
  /** Explicitly release wake lock */
  releaseWakeLock: () => Promise<void>;
}

/**
 * React hook integrating the Screen Wake Lock API (`navigator.wakeLock.request('screen')`)
 * for uninterrupted prayer, parayanam, and scripture reading sessions.
 *
 * Automatically re-acquires the wake lock when the user returns to the app tab/window
 * via `document.visibilitychange`, and cleanly releases it on unmount.
 *
 * @example
 * ```tsx
 * const { isActive, isSupported, enabled, toggle } = useWakeLock({ enabled: true });
 * ```
 */
export function useWakeLock(options: UseWakeLockOptions = {}): UseWakeLockReturn {
  const { enabled: initialEnabled = true } = options;
  const [enabled, setEnabled] = useState<boolean>(initialEnabled);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    setIsSupported(
      typeof navigator !== 'undefined' &&
        'wakeLock' in navigator &&
        typeof navigator.wakeLock?.request === 'function'
    );
  }, []);

  const releaseWakeLock = useCallback(async () => {
    const sentinel = wakeLockRef.current;
    wakeLockRef.current = null;
    if (sentinel) {
      try {
        await sentinel.release();
      } catch {
        // Ignore errors if already released by browser
      }
    }
    setIsActive(false);
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (
      typeof navigator === 'undefined' ||
      !('wakeLock' in navigator) ||
      typeof navigator.wakeLock?.request !== 'function'
    ) {
      return;
    }

    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
      return;
    }

    // Avoid duplicate requests if already active and not released
    if (wakeLockRef.current && !wakeLockRef.current.released) {
      setIsActive(true);
      return;
    }

    try {
      const sentinel = await navigator.wakeLock.request('screen');
      wakeLockRef.current = sentinel;
      setIsActive(true);

      sentinel.addEventListener('release', () => {
        if (wakeLockRef.current === sentinel) {
          wakeLockRef.current = null;
          setIsActive(false);
        }
      });
    } catch {
      // Browser may deny wake lock (e.g., low battery mode or background tab)
      wakeLockRef.current = null;
      setIsActive(false);
    }
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!enabled) {
      void releaseWakeLock();
      return;
    }

    void requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabled) {
        void requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      void releaseWakeLock();
    };
  }, [enabled, requestWakeLock, releaseWakeLock]);

  return {
    isSupported,
    isActive,
    enabled,
    toggle,
    requestWakeLock,
    releaseWakeLock,
  };
}
