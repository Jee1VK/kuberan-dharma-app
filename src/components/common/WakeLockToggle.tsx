'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useWakeLock } from '../../lib/hooks/useWakeLock';

interface WakeLockToggleProps {
  /** Whether continuous reading mode starts enabled (default: true) */
  defaultEnabled?: boolean;
  className?: string;
}

/**
 * Continuous Reading Mode toggle & indicator powered by the Screen Wake Lock API.
 * Automatically keeps the screen awake during parayanam/reading and re-acquires
 * the lock on visibilitychange when switching back to the app.
 */
export const WakeLockToggle: React.FC<WakeLockToggleProps> = ({
  defaultEnabled = true,
  className = '',
}) => {
  const { isSupported, isActive, enabled, toggle } = useWakeLock({
    enabled: defaultEnabled,
  });

  if (!isSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      title={
        enabled
          ? 'Continuous Reading Mode: Screen stays awake during reading'
          : 'Continuous Reading Mode paused: Screen sleeps normally'
      }
      className={`min-h-[36px] px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 border transition-all cursor-pointer active:scale-95 ${
        enabled && isActive
          ? 'bg-stitch-gold/15 border-stitch-gold text-stitch-maroon shadow-xs'
          : enabled
            ? 'bg-stitch-parchment border-stitch-sand text-stitch-deepGold'
            : 'bg-stitch-parchment/60 border-stitch-sand/80 text-stitch-stone'
      } ${className}`}
    >
      {enabled ? (
        <Sun className={`w-3.5 h-3.5 ${isActive ? 'text-stitch-gold fill-stitch-gold/40' : 'text-stitch-deepGold'}`} />
      ) : (
        <Moon className="w-3.5 h-3.5 text-stitch-stone" />
      )}
      <span className="hidden sm:inline">
        {enabled ? 'Screen On' : 'Auto Sleep'}
      </span>
    </button>
  );
};
