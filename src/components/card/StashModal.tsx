'use client';

import React, { useState } from 'react';
import { X, Bookmark, Plus, Check } from 'lucide-react';
import { DharmaCardUnit } from '../../lib/types/scripture';
import { useUserStore } from '../../lib/storage/userStore';

interface StashModalProps {
  card: DharmaCardUnit;
  isOpen: boolean;
  onClose: () => void;
}

export const StashModal: React.FC<StashModalProps> = ({ card, isOpen, onClose }) => {
  const { stashes, createStash, addCardToStash, removeCardFromStash, preferences } = useUserStore();
  const [newStashTitle, setNewStashTitle] = useState('');
  const [personalNote, setPersonalNote] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);

  if (!isOpen) return null;

  const cardTitle = card.cardTitle[preferences.language] || card.cardTitle.en;

  const handleCreateStash = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStashTitle.trim()) {
      const newId = createStash(newStashTitle.trim());
      addCardToStash(newId, card.id, personalNote.trim() || undefined);
      setNewStashTitle('');
      setShowCreateInput(false);
      onClose();
    }
  };

  const toggleStashMembership = (stashId: string, isAlreadyInStash: boolean) => {
    if (isAlreadyInStash) {
      removeCardFromStash(stashId, card.id);
    } else {
      addCardToStash(stashId, card.id, personalNote.trim() || undefined);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stitch-slate/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-stitch-ivory rounded-2xl max-w-md w-full border border-stitch-sand shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stash-modal-title"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stitch-sand">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-stitch-maroon fill-current" />
            <h3 id="stash-modal-title" className="font-serif font-bold text-lg text-stitch-slate">
              Stash this Wisdom
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-stitch-stone hover:text-stitch-slate hover:bg-stitch-parchment"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4">
          <p className="text-xs text-stitch-stone uppercase tracking-wider mb-1 font-semibold">
            Selected Card
          </p>
          <p className="text-sm font-serif font-semibold text-stitch-maroon line-clamp-1">
            {cardTitle}
          </p>
        </div>

        {/* Existing Stashes List */}
        <div className="space-y-2 max-h-56 overflow-y-auto my-3 pr-1">
          <p className="text-xs text-stitch-stone font-medium">Save to collection:</p>
          {stashes.map(stash => {
            const isSaved = stash.cardIds.includes(card.id);
            return (
              <button
                key={stash.id}
                type="button"
                onClick={() => toggleStashMembership(stash.id, isSaved)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isSaved
                    ? 'bg-stitch-maroon/10 border-stitch-maroon text-stitch-maroon font-semibold'
                    : 'bg-stitch-parchment/60 border-stitch-sand hover:border-stitch-gold text-stitch-slate'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${
                    isSaved ? 'bg-stitch-maroon text-stitch-ivory' : 'bg-stitch-sand/80 text-stitch-stone'
                  }`}>
                    {isSaved ? <Check className="w-4 h-4 stroke-[3]" /> : <Bookmark className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-sm">{stash.title}</span>
                </div>
                <span className="text-xs text-stitch-stone font-mono">
                  {stash.cardIds.length} cards
                </span>
              </button>
            );
          })}
        </div>

        {/* Personal Note Input */}
        <div className="my-3">
          <label className="block text-xs font-medium text-stitch-stone mb-1">
            Add a personal reflection / note (optional):
          </label>
          <input
            type="text"
            value={personalNote}
            onChange={(e) => setPersonalNote(e.target.value)}
            placeholder="e.g., My morning reminder when feeling overwhelmed"
            className="w-full text-xs px-3 py-2 rounded-lg bg-stitch-parchment border border-stitch-sand focus:outline-none focus:ring-1 focus:ring-stitch-maroon text-stitch-slate"
          />
        </div>

        {/* Create New Stash Option */}
        {showCreateInput ? (
          <form onSubmit={handleCreateStash} className="mt-3 pt-3 border-t border-stitch-sand flex gap-2">
            <input
              type="text"
              autoFocus
              value={newStashTitle}
              onChange={(e) => setNewStashTitle(e.target.value)}
              placeholder="Collection name (e.g., Leadership)"
              className="flex-1 text-xs px-3 py-2 rounded-lg bg-stitch-parchment border border-stitch-sand focus:outline-none focus:ring-1 focus:ring-stitch-maroon text-stitch-slate"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-stitch-maroon hover:bg-stitch-maroonHover text-stitch-ivory text-xs font-semibold rounded-lg shadow-sm"
            >
              Create
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowCreateInput(true)}
            className="w-full mt-2 py-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-stitch-maroon hover:bg-stitch-parchment rounded-lg border border-dashed border-stitch-gold/60 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Stash Collection</span>
          </button>
        )}

        <div className="mt-5 pt-3 border-t border-stitch-sand flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stitch-maroon text-stitch-ivory text-xs font-semibold rounded-lg hover:bg-stitch-maroonHover transition-colors shadow"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
