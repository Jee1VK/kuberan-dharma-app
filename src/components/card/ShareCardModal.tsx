'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { DharmaCardUnit, LanguageCode } from '../../lib/types/scripture';

interface ShareCardModalProps {
  card: DharmaCardUnit;
  language: LanguageCode;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ card, language, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const title = card.cardTitle[language] || card.cardTitle.en;
  const translation = card.translation[language] || card.translation.en;
  const essence = card.essence.philosophicalMeaning[language] || card.essence.philosophicalMeaning.en;
  const lifeApplication = card.essence.modernLifeApplication[language] || card.essence.modernLifeApplication.en;

  const formattedShareText = `🌟 *KUBERAN DHARMA APP* 🌟\n\n📖 *${card.corpusId.toUpperCase()}* (${card.unitNumber})\n\n*"${title}"*\n\n${card.sanskrit.devanagari}\n\n📜 *Meaning:* ${translation}\n\n🪔 *Essence:* ${essence}\n\n💡 *Daily Practice:* ${lifeApplication}\n\n✨ Discover sacred scriptures in bite-sized cards: https://kuberansilks.com/`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWebShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: title,
        text: formattedShareText,
        url: window.location.href,
      }).catch(() => {});
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stitch-slate/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-stitch-ivory rounded-2xl max-w-lg w-full border border-stitch-sand shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-card-title"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stitch-sand">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-stitch-deepGold" />
            <h3 id="share-card-title" className="font-serif font-bold text-lg text-stitch-slate">
              Share Dharma Card
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

        {/* Visual Preview Graphic Card */}
        <div className="my-4 p-5 rounded-xl bg-gradient-to-br from-stitch-parchment to-stitch-ivory border-2 border-stitch-gold/40 shadow-inner relative overflow-hidden">
          {/* Subtle gold watermark emblem */}
          <div className="absolute top-2 right-2 opacity-15 pointer-events-none">
            <img src="/images/kuberan_logo_transparent.png" alt="" className="w-20 h-20" />
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-serif font-bold uppercase tracking-widest text-stitch-maroon">
              {card.corpusId.replace('-', ' ')} · {card.unitNumber}
            </span>
            <span className="text-[10px] text-stitch-stone font-mono">
              KUBERAN DHARMA
            </span>
          </div>

          <h4 className="font-serif font-bold text-base text-stitch-slate leading-snug mb-3">
            {title}
          </h4>

          <div className="p-3 bg-stitch-ivory/90 rounded-lg border border-stitch-sand/80 mb-3 text-center">
            <p className="font-serif text-sm font-semibold text-stitch-maroon whitespace-pre-line leading-relaxed">
              {card.sanskrit.devanagari}
            </p>
          </div>

          <p className="text-xs text-stitch-slate leading-relaxed mb-2">
            <strong className="text-stitch-maroon">Essence: </strong>
            {essence}
          </p>

          <div className="mt-3 pt-2 border-t border-stitch-sand/60 flex items-center justify-between text-[10px] text-stitch-stone">
            <span>Learn & Stash on Kuberan Dharma</span>
            <span className="font-semibold text-stitch-deepGold">kuberansilks.com</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-stitch-sand">
          <button
            type="button"
            onClick={copyToClipboard}
            className="px-4 py-2 rounded-lg border border-stitch-sand bg-stitch-parchment hover:border-stitch-gold text-stitch-slate text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
          </button>

          <button
            type="button"
            onClick={shareViaWebShare}
            className="px-4 py-2 rounded-lg bg-stitch-maroon hover:bg-stitch-maroonHover text-stitch-ivory text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share via WhatsApp / Social</span>
          </button>
        </div>
      </div>
    </div>
  );
};
