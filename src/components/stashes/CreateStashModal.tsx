'use client';

import React, { useState } from 'react';
import { X, Plus, FolderPlus } from 'lucide-react';
import { useUserStore } from '../../lib/storage/userStore';

interface CreateStashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateStashModal: React.FC<CreateStashModalProps> = ({ isOpen, onClose }) => {
  const { createStash } = useUserStore();
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      createStash(title.trim());
      setTitle('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stitch-slate/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-stitch-ivory rounded-2xl max-w-sm w-full border border-stitch-sand shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-stash-title"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stitch-sand">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-stitch-maroon" />
            <h3 id="create-stash-title" className="font-serif font-bold text-lg text-stitch-slate">
              Create New Stash
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

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-stitch-stone uppercase tracking-wider mb-1.5">
              Stash Collection Name
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My Morning Reflection, Gita for Anxiety"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-stitch-parchment border border-stitch-sand focus:outline-none focus:ring-1 focus:ring-stitch-maroon text-stitch-slate"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stitch-sand">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-stitch-stone hover:bg-stitch-parchment"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 bg-stitch-maroon hover:bg-stitch-maroonHover text-stitch-ivory text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50"
            >
              Create Stash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
