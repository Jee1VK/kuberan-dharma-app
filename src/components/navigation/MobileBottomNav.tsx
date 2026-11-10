'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Sparkles, Bookmark, BookOpen } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Compass },
    { href: '/feed', label: 'Daily Feed', icon: Sparkles },
    { href: '/stashes', label: 'Stashes', icon: Bookmark },
    { href: '/read/bhagavad-gita/1', label: 'Read Gita', icon: BookOpen },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-stitch-ivory/95 backdrop-blur-xl border-t border-stitch-sand/80 shadow-[0_-4px_24px_rgba(28,25,23,0.06)] pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-1.5"
    >
      <div className="grid grid-cols-4 h-14 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center min-h-[44px] py-1 px-1 rounded-xl transition-all group active:scale-95"
            >
              <div
                className={`relative flex items-center justify-center transition-all ${
                  isActive ? 'text-stitch-maroon' : 'text-stitch-stone group-hover:text-stitch-slate'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-105 stroke-[2.2]' : 'group-hover:scale-110'
                  }`}
                />
              </div>
              <span
                className={`text-[11px] font-sans tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-stitch-maroon font-bold' : 'text-stitch-stone font-medium'
                }`}
              >
                {item.label}
              </span>
              {/* Subtle gold indicator dot for active tab */}
              <span
                className={`w-1 h-1 rounded-full mt-0.5 transition-all ${
                  isActive ? 'bg-stitch-gold shadow-[0_0_6px_rgba(197,160,89,0.8)]' : 'bg-transparent'
                }`}
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
