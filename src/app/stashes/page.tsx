'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getCuratedStashes } from '../../lib/data';
import { useUserStore } from '../../lib/storage/userStore';
import { StashCard } from '../../components/stashes/StashCard';
import { CreateStashModal } from '../../components/stashes/CreateStashModal';
import { Sparkles, FolderPlus, Bookmark, ArrowRight } from 'lucide-react';

export default function StashesPage() {
  const { preferences, stashes } = useUserStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const curatedStashes = getCuratedStashes();

  return (
    <main className="min-h-screen bg-stitch-ivory px-4 py-8 pb-24">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stitch-sand">
          <div>
            <span className="text-xs font-serif font-bold tracking-widest text-stitch-deepGold uppercase">
              Wisdom Collections
            </span>
            <h1 className="font-serif font-bold text-3xl md:text-4xl text-stitch-maroon mt-1">
              Curated & Personal Stashes
            </h1>
            <p className="text-xs md:text-sm text-stitch-stone mt-1">
              Organized packs of wisdom to reflect upon, memorize, and apply in daily life.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="self-start sm:self-auto px-4 py-2.5 bg-stitch-maroon hover:bg-stitch-maroonHover text-stitch-ivory text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <FolderPlus className="w-4 h-4" />
            <span>New Stash</span>
          </button>
        </div>

        {/* Section 1: Curated Editorial Stashes */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-stitch-deepGold" />
            <h2 className="font-serif font-bold text-xl text-stitch-slate">
              Curated Stashes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {curatedStashes.map(stash => (
              <StashCard
                key={stash.id}
                stash={stash}
                currentLanguage={preferences.language}
              />
            ))}
          </div>
        </section>

        {/* Section 2: User's Personal Stashes */}
        <section className="pt-4 border-t border-stitch-sand/60">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-stitch-maroon fill-current" />
              <h2 className="font-serif font-bold text-xl text-stitch-slate">
                My Saved Stashes ({stashes.length})
              </h2>
            </div>
          </div>

          {stashes.length === 0 ? (
            <div className="p-8 text-center bg-stitch-parchment/60 rounded-2xl border border-dashed border-stitch-sand">
              <p className="text-sm font-medium text-stitch-slate mb-1">
                You haven&apos;t created any personal stashes yet.
              </p>
              <p className="text-xs text-stitch-stone mb-3">
                Tap &ldquo;Stash&rdquo; on any Dharma Card in the feed to save it to your own custom collection.
              </p>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 text-xs font-semibold bg-stitch-maroon text-stitch-ivory rounded-lg"
              >
                Create Your First Stash
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stashes.map(userStash => (
                <Link
                  key={userStash.id}
                  href={`/stashes/${userStash.id}`}
                  className="group bg-stitch-ivory rounded-2xl p-5 border border-stitch-sand/80 shadow-card hover:shadow-cardHover hover:border-stitch-gold/60 transition-all flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-stitch-parchment text-stitch-maroon border border-stitch-sand">
                        Personal Collection
                      </span>
                      <span className="text-xs text-stitch-stone font-mono">
                        {userStash.cardIds.length} cards
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-stitch-slate group-hover:text-stitch-maroon transition-colors">
                      {userStash.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stitch-sand/50 text-xs text-stitch-maroon font-semibold">
                    <span>View Stashed Cards</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <CreateStashModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </main>
  );
}
