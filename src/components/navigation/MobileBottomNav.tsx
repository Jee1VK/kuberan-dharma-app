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
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-stitch-ivory/95 backdrop-blur-md border-t border-stitch-sand/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-4 h-16 max-w-lg mx-auto px-2">
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
              className="flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all group active:scale-95"
            >
              <div
                className={`flex items-center justify-center w-10 h-8 rounded-xl transition-all ${
                  isActive
                    ? 'bg-stitch-maroon text-stitch-ivory shadow-sm'
                    : 'text-stitch-stone group-hover:text-stitch-slate'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'fill-current scale-105' : 'group-hover:scale-110'
                  }`}
                />
              </div>
              <span
                className={`text-[11px] font-sans tracking-tight mt-0.5 font-semibold transition-colors ${
                  isActive ? 'text-stitch-maroon font-bold' : 'text-stitch-stone'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
