'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { InstallAppModal } from './InstallAppModal';
import { useIsStandalone } from '../../lib/hooks/useIsStandalone';

export const DownloadAppButton: React.FC<{
  variant?: 'navbar' | 'hero' | 'footer';
  className?: string;
}> = ({ variant = 'navbar', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isStandalone = useIsStandalone();

  // If the user has already installed the app and is running in standalone mode, hide download buttons
  if (isStandalone) {
    return null;
  }

  if (variant === 'hero') {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={`min-h-[44px] px-5 py-3 rounded-2xl bg-gradient-to-r from-stitch-maroon to-stitch-wine text-stitch-ivory font-bold text-sm tracking-wide shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 border border-stitch-gold/50 cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4 text-stitch-gold" />
          <span>Download App</span>
        </button>
        <InstallAppModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  }

  if (variant === 'footer') {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={`min-h-[44px] text-xs font-semibold text-stitch-deepGold hover:text-stitch-maroon flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Mobile App (PWA)</span>
        </button>
        <InstallAppModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  }

  // Navbar variant
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`min-h-[44px] px-3 py-1.5 rounded-xl bg-stitch-gold/15 text-stitch-maroon border border-stitch-gold/40 hover:bg-stitch-gold/25 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${className}`}
        title="Download / Install Kuberan Dharma App"
      >
        <Download className="w-3.5 h-3.5 text-stitch-maroon" />
        <span className="hidden sm:inline">Download App</span>
      </button>
      <InstallAppModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
