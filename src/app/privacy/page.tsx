'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Trash2, CheckCircle2 } from 'lucide-react';
import { clearLocalUser } from '../../lib/storage/userStore';

export default function PrivacyPolicyPage() {
  const [cleared, setCleared] = useState(false);

  const handleResetData = () => {
    clearLocalUser();
    setCleared(true);
  };

  return (
    <main className="min-h-screen bg-stitch-ivory px-4 py-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,16px))] md:pb-12">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stitch-stone hover:text-stitch-maroon transition-colors py-1.5 px-3 rounded-lg bg-stitch-parchment border border-stitch-sand min-h-[36px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <article className="bg-stitch-ivory rounded-3xl border border-stitch-sand/80 shadow-card p-6 md:p-8 flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-4 border-b border-stitch-sand">
            <div className="w-10 h-10 rounded-xl bg-stitch-maroon/10 border border-stitch-maroon/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-stitch-maroon" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-stitch-deepGold">
                Kuberan Dharma App · Privacy Policy
              </span>
              <h1 className="font-serif font-bold text-2xl md:text-3xl text-stitch-maroon">
                Zero-Telemetry &amp; Offline Privacy Pledge
              </h1>
            </div>
          </div>

          <section className="space-y-2 text-sm text-stitch-slate leading-relaxed">
            <h2 className="font-serif font-bold text-lg text-stitch-slate">
              1. Zero Personal Data Collection
            </h2>
            <p className="text-stitch-stone">
              <strong>Kuberan Dharma</strong> (<code>com.kuberansilks.dharma</code>) is designed as a 100% offline, distraction-free educational sanctuary. We do <strong>not</strong> require user accounts, logins, phone numbers, email addresses, or personal identifiers. We do <strong>not</strong> collect, log, sell, or transmit any personal or behavioral telemetry to external servers.
            </p>
          </section>

          <section className="space-y-2 text-sm text-stitch-slate leading-relaxed">
            <h2 className="font-serif font-bold text-lg text-stitch-slate">
              2. On-Device Local Storage Only
            </h2>
            <p className="text-stitch-stone">
              Your preferred scripture language, saved Stashes, and daily reading streaks are stored exclusively on your own device via standard local storage (<code>localStorage</code> / iOS <code>NSUserDefaults</code> reason <code>CA92.1</code>). This data never leaves your device.
            </p>
          </section>

          <section className="space-y-2 text-sm text-stitch-slate leading-relaxed">
            <h2 className="font-serif font-bold text-lg text-stitch-slate">
              3. No Advertisements or Third-Party Trackers
            </h2>
            <p className="text-stitch-stone">
              This application contains <strong>zero advertisements</strong>, zero third-party analytics SDKs, and zero cross-app tracking.
            </p>
          </section>

          <section className="space-y-2 text-sm text-stitch-slate leading-relaxed">
            <h2 className="font-serif font-bold text-lg text-stitch-slate">
              4. Instant On-Device Data Deletion
            </h2>
            <p className="text-stitch-stone">
              You have full control over your local reading history and saved stashes. You may clear all locally stored app data at any time below:
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetData}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-stitch-parchment border border-stitch-sand hover:border-stitch-maroon text-xs font-bold text-stitch-maroon flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                {cleared ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>All Local Data Cleared</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All Local Reading History &amp; Stashes</span>
                  </>
                )}
              </button>
            </div>
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
