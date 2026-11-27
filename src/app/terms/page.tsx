'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-stitch-ivory px-4 py-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,16px))] md:pb-12">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stitch-stone hover:text-stitch-maroon transition-colors py-1.5 px-3 rounded-lg bg-stitch-parchment border border-stitch-sand min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/privacy"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stitch-maroon hover:underline py-1.5 px-3 rounded-lg bg-stitch-parchment/80 border border-stitch-sand min-h-[44px]"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </Link>
        </div>

        <article className="bg-stitch-ivory rounded-3xl border border-stitch-sand/80 shadow-card p-6 md:p-8 flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-4 border-b border-stitch-sand">
            <div className="w-10 h-10 rounded-xl bg-stitch-maroon/10 border border-stitch-maroon/20 flex items-center justify-center flex-shrink-0">
              <Scale className="w-5 h-5 text-stitch-maroon" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-stitch-deepGold">
                Kuberan Dharma App · Terms of Use
              </span>
              <h1 className="font-serif font-bold text-2xl md:text-3xl text-stitch-maroon">
                Terms of Service &amp; Cultural Notice
              </h1>
            </div>
          </div>

          <section className="space-y-2 text-sm text-stitch-slate leading-relaxed">
            <h2 className="font-serif font-bold text-lg text-stitch-slate">
              1. Reverent Educational &amp; Literary Purpose (BNS Section 299 Safe)
            </h2>
            <p className="text-stitch-stone">
              <strong>Kuberan Dharma</strong> (<code>com.kuberansilks.dharma</code>) is a free cultural, literary, and philosophical learning resource presenting classical Sanatana Dharma scriptures (including selections from the Bhagavad Gita, Valmiki Ramayana, Mahabharata, Vedas, Upanishads, and Puranas). All translations, transliterations, Panchanga Sankalpam helpers, and modern life reflections are prepared in a neutral, scholarly, non-sectarian spirit of universal harmony and mutual respect, in strict compliance with <strong>Section 299 of the Bharatiya Nyaya Sanhita (BNS)</strong>.
            </p>
          </section>

          <section className="space-y-2 text-sm text-stitch-slate leading-relaxed">
            <h2 className="font-serif font-bold text-lg text-stitch-slate">
              2. Non-Clinical &amp; Non-Advisory Disclaimer
            </h2>
            <p className="text-stitch-stone">
              Content in this application is provided solely for spiritual contemplation, cultural literacy, and philosophical education. Nothing in the app constitutes medical, psychiatric, psychological, legal, financial, or clinical advice, nor does the app claim any miraculous cure, diagnostic capability, or guaranteed material outcome (in compliance with the Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954). For traditional ritual observance, please consult your family acharya or purohit; for health or clinical concerns, always consult a qualified medical professional.
            </p>
          </section>

          <section className="space-y-2 text-sm text-stitch-slate leading-relaxed">
            <h2 className="font-serif font-bold text-lg text-stitch-slate">
              3. Intellectual Property &amp; Public-Domain Texts
            </h2>
            <p className="text-stitch-stone">
              Classical Sanskrit shlokas belong to India&apos;s timeless public-domain heritage. Original English and regional summaries, UI layouts, and Kuberan Silks brand emblems are © Kuberan Silks, Bengaluru, and are licensed for personal, non-commercial study and sharing via the in-app Share feature. Third-party open-source packages remain governed by their respective licenses listed on our{' '}
              <Link href="/privacy" className="text-stitch-maroon underline font-semibold">
                Privacy &amp; Open-Source Notices
              </Link>{' '}
              page.
            </p>
          </section>

          <section className="space-y-2 text-sm text-stitch-slate leading-relaxed">
            <h2 className="font-serif font-bold text-lg text-stitch-slate">
              4. Warranty Disclaimer &amp; Limitation of Liability (₹1,000 Cap)
            </h2>
            <p className="text-stitch-stone">
              The application is provided free of charge on an <strong>&ldquo;AS-IS&rdquo; and &ldquo;AS-AVAILABLE&rdquo;</strong> basis without warranties of any kind, express or implied. To the fullest extent permitted by applicable Indian law, Kuberan Silks and its affiliates shall not be liable for any indirect, incidental, consequential, or punitive damages arising out of your use of or inability to use the application, and our aggregate cumulative liability for any claim shall not exceed the amount paid by you for the application in the preceding twelve (12) months or <strong>₹1,000 INR (Indian Rupees One Thousand only)</strong>, whichever is lower.
            </p>
          </section>

          <section className="space-y-2 text-sm text-stitch-slate leading-relaxed">
            <h2 className="font-serif font-bold text-lg text-stitch-slate">
              5. Governing Law &amp; Exclusive Jurisdiction
            </h2>
            <p className="text-stitch-stone">
              These Terms of Use shall be governed by and construed in accordance with the laws of the Republic of India. Any dispute, claim, or proceeding arising out of or relating to these Terms or the application shall be subject to the <strong>exclusive jurisdiction of the competent courts at Bengaluru, Karnataka, India</strong>.
            </p>
          </section>

          <section className="space-y-1.5 text-xs text-stitch-stone pt-4 border-t border-stitch-sand">
            <p>
              <strong>Publisher:</strong> Kuberan Silks, Chickpet, Bengaluru, Karnataka 560053, India
            </p>
            <p>
              <strong>Support &amp; Grievance Contact:</strong>{' '}
              <a href="mailto:support@kuberansilks.com" className="text-stitch-maroon underline font-semibold">
                support@kuberansilks.com
              </a>
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
