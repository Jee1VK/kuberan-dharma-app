# Dharma Learning Platform — System Architecture & Design Specification (Deepstash Edition)

**Document Version:** 1.1.0  
**Date:** 2026-11-09  
**Status:** Approved for Implementation Planning  
**Target Location:** `\\KUBERAN-NAS\Kuberan\Jeevan\Gemini Projects\dharma-learning-app`

---

## 1. Executive Summary & Vision

The **Dharma Learning Platform** is a modern, distraction-free, offline-ready Progressive Web Application (PWA) inspired by **Deepstash's bite-sized micro-learning model**. It transforms the vast, sacred literature of Sanatana Dharma into bite-sized, visual **"Dharma Cards"** that anyone can understand in under two minutes in their native language.

The platform covers five foundational corpuses:
1. **Bhagavad Gita** (Complete 18 Chapters, 700 Verses)
2. **Ramayana** (Key transformative episodes, moral dilemmas, and character ideals)
3. **Mahabharata** (Iconic ethical crossroads, Dharma-sankatas, and philosophical teachings)
4. **Vedas & Upanishads** (Foundational Shanti Mantras, creation hymns, and core spiritual insights)
5. **Puranas** (Symbolic allegories and timeless moral parables)

### Core Guiding Principles
* **Deepstash Micro-Learning Architecture:** Dense scriptures are decomposed into atomic, punchy **Dharma Cards**. Every card features a bold takeaway title, the sacred verse/story, the 1-minute essence, and real-world practical application.
* **Curated & User "Stashing":** Users can browse curated thematic stashes (e.g. *"7 Mental Models of Krishna"*, *"Overcoming Fear with the Upanishads"*) or "stash" (save/organize) cards into their own personal study collections.
* **100% Self-Contained & Zero-Cost:** Offline-first with zero external API dependencies for Phase 1. No subscription fees, no cloud database costs, and instant local response times.
* **Curated 6-Language Multilingual Core:** High-fidelity, scholar-verified translations in **English**, **Hindi (हिन्दी)**, **Kannada (ಕನ್ನಡ)**, **Sanskrit (संस्कृतम् + IAST Transliteration)**, **Tamil (தமிழ்)**, and **Telugu (తెలుగు)**.
* **Audio Chanting (Shruti):** Authentic shloka audio recitation, syllable-by-syllable pronunciation guide, loop memorization mode, and browser-native voice narration.

---

## 2. Technical Stack & Infrastructure

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router, React 19, TypeScript) | Blazingly fast static generation, optimal bundle chunking, and modern web standards. |
| **Styling** | Tailwind CSS + Framer Motion | Smooth swipe animations, card transitions, and Google Stitch heritage design tokens. |
| **PWA & Offline** | `@ducanh2912/next-pwa` + Service Worker | Installable on iOS, Android, and Desktop. Works 100% offline without network access. |
| **Client Search Engine**| MiniSearch (In-Memory) | Instant client-side full-text search across all 6 languages, verses, stashes, and tags in $< 10\text{ms}$. |
| **Audio Engine** | HTML5 Web Audio API + Web Speech API | Seamless shloka playback, speed adjustment ($0.75\times, 1.0\times, 1.25\times$), loop counter ($3\times, 9\times, 21\times, 108\times$), and browser-native voice narration. |
| **Client Storage** | LocalStorage + IndexedDB (Local-First) | Stores user-created Stashes, reading progress, completed cards, and daily streaks without requiring user login. |
| **Icons & Typography**| Lucide React, Noto Sans Devanagari, Cinzel, Inter | Classical sacred typography paired with crisp, accessible UI icons. |

---

## 3. The Dharma Card & Stash Data Model

```typescript
export type CorpusId = 'bhagavad-gita' | 'ramayana' | 'mahabharata' | 'vedas' | 'puranas';
export type LanguageCode = 'en' | 'hi' | 'kn' | 'sa' | 'ta' | 'te';

// Atomic Dharma Card (Deepstash Unit)
export interface DharmaCardUnit {
  id: string; // e.g. "bg-2-47"
  corpusId: CorpusId;
  sectionNumber: number;
  unitNumber: string; // "2.47"
  readTimeMinutes: number; // e.g. 1 or 2 min

  // Punchy Insight Hook / Deepstash Header
  cardTitle: Record<LanguageCode, string>; // e.g., "Action Without Anxiety: Focus on Effort, Release the Outcome"

  // Classical & Phonetic Text
  sanskrit: {
    devanagari: string;
    transliteration: string; // IAST phonetics (e.g., "karmaṇyevādhikāraste...")
    syllableBreakdown?: string[];
    wordByWord?: Array<{
      sanskrit: string;
      transliteration: string;
      meaning: Record<LanguageCode, string>;
    }>;
  };

  audioUrl?: string;

  // The 3-Layer Understanding Model
  translation: Record<LanguageCode, string>; // Layer 1: Literal meaning
  essence: {
    philosophicalMeaning: Record<LanguageCode, string>; // Layer 2: Core spiritual essence
    modernLifeApplication: Record<LanguageCode, string>; // Layer 3: Practical daily takeaway
  };

  thematicTags: string[]; // ["Karma Yoga", "Duty", "Detachment", "Anxiety", "Action"]
  speaker?: string; // e.g. "Lord Krishna", "Arjuna"
}

// Curated or User-Created Stash Collection
export interface DharmaStash {
  id: string; // e.g. "stash-krishna-mental-models"
  title: Record<LanguageCode, string>;
  description: Record<LanguageCode, string>;
  icon: string; // Lucide icon name
  cardIds: string[]; // Ordered list of DharmaCardUnit IDs
  isCurated: boolean; // true = pre-built editorial stash; false = user-created
  category: 'Mindset' | 'Leadership' | 'Dharma & Ethics' | 'Inner Peace' | 'Chants & Mantras';
}
```

---

## 4. UI Architecture & Feature Modules

### Module 1: The Deepstash-Style Micro-Feed (`/` and `/feed`)
* **Vertical / Swipeable Card Feed:** Users swipe or scroll smoothly through bite-sized Dharma Cards.
* **Card Anatomy:**
  * Top Badge: Scripture Citation (`Bhagavad Gita · 2.47`) + Reading Time (`1 min`).
  * Big Punchy Title: The central life insight (e.g. *"Focus on Action, Not Outcome"*).
  * Shloka Box: Classical Devanagari + IAST transliteration + integrated audio chanting trigger.
  * 3-Layer Insight Pills:
    * 📜 **Translation** (Plain language)
    * 🪔 **Essence** (Tatparya / Spiritual principle)
    * 💡 **Apply Today** (Practical daily mindset)
  * Action Toolbar: **"Stash" Button** (add to custom collection), **Audio Play**, **Copy**, and **Share Quote Card**.

### Module 2: Thematic Stashes & Collections (`/stashes`)
* **Editorial Curated Stashes:**
  1. *The 7 Mental Models of Lord Krishna* (7 cards on emotional mastery, detachment, and duty).
  2. *Facing Moral Dilemmas: Lessons from Mahabharata* (Karna, Bhishma, Yudhishthira).
  3. *Leadership & Duty under Fire: Ramayana Principles* (Rama, Lakshmana, Bharata).
  4. *Ancient Vedic Chants for Inner Stillness* (Shanti Mantras & Meditation).
* **My Stashes (Personal Collections):** Users can create custom collections (e.g. *"My Morning Gita Meditation"*, *"Workplace Dharma"*), add any card with one tap, and write personal reflection notes.

### Module 3: Sequential Scripture Reader (`/read/[corpusId]/[sectionId]`)
* Traditional chapter-by-chapter reader for purists who want to read sequentially from Chapter 1 to Chapter 18 or Kanda by Kanda.
* Seamless toggle: Switch between **Deepstash Card View** and **Continuous Scripture View**.

### Module 4: Aesthetic Share Card Generator
* Generates a sleek, modern visual card (resembling Deepstash quote graphics or Kuberan heritage cards) formatted for WhatsApp Status, Instagram Stories, or LinkedIn with one tap.

---

## 5. Google Stitch Design System & Tokens

The platform follows Google Stitch design tokens specified in the global Kuberan guidelines:

* **Imperial Maroon** (`#6B1D2F`): Primary branding, header badges, active tabs, and primary action buttons.
* **Antique Temple Gold** (`#C5A059`): Accents, card borders, shloka number emblems, audio controls.
* **Deep Temple Gold** (`#8F6E28`): High-contrast gold accents on light surfaces (passes WCAG AA).
* **Warm Pearl Ivory** (`#FAFAF7`): Default reading canvas background, zero eye-strain parchment tone.
* **Parchment Surface** (`#F3EFE6`): Elevated card surface, card containers, and pill backgrounds.
* **Charcoal Slate** (`#1C1917`): High-contrast primary text, verse Sanskrit rendering, and header typography.
* **Muted Stone** (`#57534E`): Secondary annotations and reading time indicators.
* **Muted Sand Border** (`#E4DEC8`): Card divider rules, card borders, tab borders.

### Typography
* **Sanskrit / Devanagari:** `Noto Sans Devanagari`, serif fallbacks.
* **Display / Headings:** `Cinzel`, serif.
* **Body / Translations:** `Inter`, `system-ui`, sans-serif.

---

## 6. Client Storage Schema (Stashes & Progress)

Stored in `localStorage` under `dharma_stash_user_v1`:

```typescript
export interface UserStorageSchema {
  preferences: {
    language: LanguageCode; // default 'en'
    scriptView: 'both' | 'devanagari' | 'transliteration';
    fontSize: 'sm' | 'base' | 'lg';
    audioSpeed: number;
    feedViewMode: 'card-feed' | 'compact-list';
  };
  stashes: Array<{
    id: string;
    title: string;
    createdAt: number;
    cardIds: string[];
    notes?: Record<string, string>; // cardId -> personal reflection note
  }>;
  progress: {
    completedCardIds: string[];
    lastViewedCardId?: string;
    streak: {
      currentCount: number;
      bestCount: number;
      lastActiveDate: string; // YYYY-MM-DD
    };
  };
}
```

---

## 7. Phased Content Roadmap

* **Phase 1 (Flagship MVP):**
  * **Bhagavad Gita:** Complete 18 Chapters, 700 verses formatted as 700 atomic Dharma Cards with 3-layer insights in English, Hindi, Kannada, Sanskrit, Tamil, and Telugu.
  * **Curated Editorial Stashes:** 6 flagship stashes covering Mindset, Anxiety, Leadership, Moral Dilemmas, Vedic Chants, and Puranic Wisdom.
  * **Epics & Vedas:** 14 pivotal Ramayana cards, 12 iconic Mahabharata dilemma cards, 10 Vedic Shanti cards, 8 Puranic parable cards.
  * **Card Feed & Stash Builder:** Full support for custom user stashes, search, audio recitation, and share cards.
* **Phase 2:** Expanded verse databases for full Valmiki Ramayana, Upanishadic corpus, and community-shared stashes.

---

## 8. Verification & Acceptance Criteria

1. **Compilation:** `npm run build` static compilation succeeds with 0 errors.
2. **Card Feed & Deepstash Stashing:** Users can scroll cards, toggle between 3 layers, and create/save cards into custom stashes with instant LocalStorage sync.
3. **Multilingual Speed:** Instant switching across all 6 languages ($< 50\text{ms}$) with zero network calls.
4. **PWA & Offline:** Works 100% offline via service worker caching.
5. **Accessibility:** WCAG 2.2 AA compliant, minimum $44\text{px}$ touch targets, high contrast.
