'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Trash2, CheckCircle2, Download, Scale } from 'lucide-react';
import { clearLocalUser, exportLocalUserJson } from '../../lib/storage/userStore';

export default function PrivacyPolicyPage() {
  const [cleared, setCleared] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExportData = () => {
    try {
      const jsonPayload = exportLocalUserJson();
      const blob = new Blob([jsonPayload], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      const dateStamp = new Date().toISOString().split('T')[0];
      anchor.href = url;
      anchor.download = `kuberan-dharma-export-${dateStamp}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch (err) {
      console.error('Failed to export user data JSON', err);
    }
  };

  const handleResetData = () => {
    clearLocalUser();
    setCleared(true);
  };

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
            href="/terms"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stitch-maroon hover:underline py-1.5 px-3 rounded-lg bg-stitch-parchment/80 border border-stitch-sand min-h-[44px]"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Terms of Use</span>
          </Link>
        </div>

        <article className="bg-stitch-ivory rounded-3xl border border-stitch-sand/80 shadow-card p-6 md:p-8 flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-4 border-b border-stitch-sand">
            <div className="w-10 h-10 rounded-xl bg-stitch-maroon/10 border border-stitch-maroon/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-stitch-maroon" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-stitch-deepGold">
                Kuberan Dharma App · DPDP Act 2023 &amp; Privacy Notice
              </span>
              <h1 className="font-serif font-bold text-2xl md:text-3xl text-stitch-maroon">
                Zero-Telemetry &amp; Local-First Privacy Policy
              </h1>
            </div>
          </div>

          <section className="space-y-2 text-sm text-stitch-slate leading-relaxed">
            <h2 className="font-serif font-bold text-lg text-stitch-slate">
              1. Statutory Compliance &amp; Zero Personal Data Collection
            </h2>
            <p className="text-stitch-stone">
              This Privacy Notice is published in accordance with India&apos;s <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>, the <strong>DPDP Rules, 2025</strong>, the Information Technology Act, 2000, and global data minimization standards (EU GDPR). <strong>Kuberan Dharma</strong> (<code>com.kuberansilks.dharma</code>) operates on a local-first architecture: we do <strong>not</strong> require user accounts, logins, phone numbers, email addresses, location permissions, or personal identifiers, and we do <strong>not</strong> collect, log, sell, or transmit any personal or behavioral telemetry to our servers.
            </p>
          </section>

          <section className="space-y-2 text-sm text-stitch-slate leading-relaxed">
            <h2 className="font-serif font-bold text-lg text-stitch-slate">
              2. On-Device Local Storage &amp; Retention Schedule
            </h2>
            <p className="text-stitch-stone">
              Your preferred scripture language, saved Stashes, notes, and daily reflection streaks are stored exclusively on your own device via standard local storage (<code>localStorage</code> / iOS <code>NSUserDefaults</code> reason <code>CA92.1</code>, with Android cloud backup disabled via <code>android:allowBackup=&quot;false&quot;</code>).
            </p>
            <p className="text-stitch-stone">
              <strong>Retention Limit:</strong> Local records remain strictly on your device until you erase them using the 1-tap purge button below, clear browser/app storage, or uninstall the application.
            </p>
          </section>

          <section className="space-y-2 text-sm text-stitch-slate leading-relaxed">
            <h2 className="font-serif font-bold text-lg text-stitch-slate">
              3. Network Endpoint Disclosure (OTA Integrity Check)
            </h2>
            <p className="text-stitch-stone">
              On native Android/iOS builds when internet connectivity is available, the app performs a read-only HTTPS <code>GET</code> check against our static update manifest hosted on GitHub Pages (<code>https://jee1vk.github.io/kuberan-dharma-app/ota-manifest.json</code>) to download SHA-256 checksum-verified scripture text and UI bug-fix bundles. Updater telemetry is explicitly disabled (<code>statsUrl: &quot;&quot;</code>). No personal data, reading history, or device identifiers are sent by the app; standard HTTPS transport logs (such as IP address) are handled directly by GitHub Pages infrastructure for static file delivery. In Airplane Mode, the app runs 100% offline with zero network calls.
            </p>
          </section>

          <section className="space-y-2 text-sm text-stitch-slate leading-relaxed">
            <h2 className="font-serif font-bold text-lg text-stitch-slate">
              4. Children&apos;s Privacy (Under 18 Years — DPDP Act Section 9)
            </h2>
            <p className="text-stitch-stone">
              Kuberan Dharma presents reverent, family-safe educational scripture content suitable for learners of all ages. In strict compliance with <strong>Section 9 of the DPDP Act, 2023</strong> (which defines a child as any individual under 18 years of age), this application collects <strong>zero personal data</strong> from children or adults, and conducts <strong>zero behavioral monitoring, profiling, or targeted advertising</strong>.
            </p>
          </section>

          <section className="space-y-2 text-sm text-stitch-slate leading-relaxed">
            <h2 className="font-serif font-bold text-lg text-stitch-slate">
              5. No Advertisements or Third-Party Trackers
            </h2>
            <p className="text-stitch-stone">
              This application contains <strong>zero advertisements</strong>, zero third-party analytics SDKs, zero cookies, and sends <code>Referrer-Policy: no-referrer</code> on outbound links.
            </p>
          </section>

          <section className="space-y-2 text-sm text-stitch-slate leading-relaxed">
            <h2 className="font-serif font-bold text-lg text-stitch-slate">
              6. Data Portability (Export) &amp; Complete On-Device Erasure
            </h2>
            <p className="text-stitch-stone">
              You have full self-service control to export a portable JSON copy of your Stashes and reading streak history or permanently purge every local storage and session key stored on this device:
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportData}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-stitch-ivory border border-stitch-gold hover:border-stitch-maroon text-xs font-bold text-stitch-slate flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                {exported ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>JSON Export Downloaded</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-stitch-deepGold" />
                    <span>Export My Stashes &amp; Reading History (.json)</span>
                  </>
                )}
              </button>

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

          <section className="space-y-2 text-sm text-stitch-slate leading-relaxed">
            <h2 className="font-serif font-bold text-lg text-stitch-slate">
              7. Open-Source Software Notices
            </h2>
            <p className="text-stitch-stone">
              Kuberan Dharma gratefully acknowledges the following unmodified open-source libraries distributed under their respective licenses:
            </p>
            <ul className="list-disc pl-5 text-xs text-stitch-stone space-y-1">
              <li>
                <code>@capgo/capacitor-updater</code> — Licensed under the <strong>Mozilla Public License 2.0 (MPL-2.0)</strong>. Source code of this library is available at{' '}
                <a
                  href="https://github.com/Cap-go/capacitor-updater"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stitch-maroon underline"
                >
                  github.com/Cap-go/capacitor-updater
                </a>{' '}
                (used unmodified).
              </li>
              <li>
                <code>Next.js</code> &amp; <code>React</code> — Licensed under the <strong>MIT License</strong>.
              </li>
              <li>
                <code>Ionic Capacitor</code> (<code>@capacitor/core</code>, <code>@capacitor/app</code>, <code>@capacitor/android</code>, <code>@capacitor/ios</code>) — Licensed under the <strong>MIT License</strong>.
              </li>
              <li>
                <code>Lucide Icons</code> (<code>lucide-react</code>) — Licensed under the <strong>ISC License</strong>.
              </li>
              <li>
                <code>MiniSearch</code> — Licensed under the <strong>MIT License</strong>.
              </li>
            </ul>
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
