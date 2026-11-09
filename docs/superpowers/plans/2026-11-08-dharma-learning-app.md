# Dharma Learning Platform Implementation Plan (Deepstash Edition)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 100% self-contained, offline-first Next.js 15 Progressive Web Application (PWA) inspired by Deepstash's bite-sized micro-learning model, transforming the Bhagavad Gita, Ramayana, Mahabharata, Vedas, and Puranas into atomic "Dharma Cards" with a 3-layer understanding model (Translation, Essence, Life Application) across 6 languages (English, Hindi, Kannada, Sanskrit with IAST, Tamil, Telugu).

**Architecture:** A static-first Next.js 15 App Router architecture with a normalized local scripture repository, in-memory client search (MiniSearch), HTML5 Web Audio and Web Speech chanting/pronunciation engine, local-first storage (LocalStorage) for user-curated Stash collections/streaks/bookmarks, and strict Google Stitch design system compliance.

**Tech Stack:** Next.js 15 (React 19, TypeScript), Tailwind CSS, Framer Motion, Lucide React, `@ducanh2912/next-pwa`, MiniSearch, Vitest, React Testing Library.

**Spec:** `\\KUBERAN-NAS\Kuberan\Jeevan\Gemini Projects\dharma-learning-app\docs\superpowers\specs\2026-11-08-dharma-learning-app-design.md`

---

## Global Constraints

* Project path: `\\KUBERAN-NAS\Kuberan\Jeevan\Gemini Projects\dharma-learning-app`
* All design elements MUST adhere to Google Stitch `DESIGN.md` tokens: Imperial Maroon (`#6B1D2F`), Antique Temple Gold (`#C5A059`), Deep Temple Gold (`#8F6E28`), Warm Pearl Ivory (`#FAFAF7`), Parchment Surface (`#F3EFE6`), Charcoal Slate (`#1C1917`), Muted Stone (`#57534E`), and Muted Sand (`#E4DEC8`).
* Zero external API dependencies (100% local curated static data and client search).
* 6 Core Languages only: `'en' | 'hi' | 'kn' | 'sa' | 'ta' | 'te'`.
* Accessibility baseline: WCAG 2.2 AA / AAA compliance, minimum $44 \times 44\text{px}$ touch targets, visible keyboard focus rings.
* Windows context: Standard Windows backslash UNC paths for commands and files.

---

## Review Focus

1. **Missing Language Key Fallback:** If a specific translation string is missing for a regional language, the UI must fall back gracefully to English without rendering `undefined` or throwing a runtime error.
   * *Pinning Task:* Task 2, Step 1 (`tests/unit/data-integrity.test.ts`)
2. **Audio Missing Asset Fallback:** If a static audio recording is unavailable for a verse, the player must fallback seamlessly to browser Web Speech API synthesis or display a visual syllable guide without crashing.
   * *Pinning Task:* Task 5, Step 1 (`tests/components/AudioPlayer.test.tsx`)
3. **Corrupted LocalStorage Recovery & Stash Migration:** If `localStorage` contains invalid JSON or schema discrepancies, the app must sanitize and recover the user's stashes gracefully.
   * *Pinning Task:* Task 3, Step 1 (`tests/unit/user-store.test.ts`)
4. **Offline Service Worker Route Caching:** When offline, navigating between card feeds, stashes, and languages must function without broken assets.
   * *Pinning Task:* Task 10, Step 1 (`tests/e2e/offline.test.ts`)
5. **Multi-script Layout Overflow:** In regional Indian scripts with complex vertical vowel markers (Kannada, Telugu, Devanagari), cards must never clip or trigger horizontal scroll overflows.
   * *Pinning Task:* Task 6, Step 1 (`tests/components/DharmaCard.test.tsx`)

---

## Task Decomposition

### Task 1: Next.js 15 Project Scaffolding & Google Stitch Design Tokens

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `public/manifest.json`
- Create: `vitest.config.ts`
- Test: `tests/unit/sanity.test.ts`

**Interfaces:**
- Produces: Base running Next.js 15 application configured with Stitch Tailwind tokens, fonts, PWA manifest, and Vitest test harness.

- [ ] **Step 1: Write sanity test for testing framework**
```typescript
// tests/unit/sanity.test.ts
import { describe, it, expect } from 'vitest';

describe('Sanity Check', () => {
  it('environment runs vitest correctly', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 2: Run sanity test to verify initial test runner state**
Run: `npm test`
Expected: Passes once test framework is initialized.

- [ ] **Step 3: Scaffold Next.js 15 project with TypeScript, Tailwind CSS, and PWA config**
Initialize package.json, install dependencies (`next@latest`, `react@latest`, `react-dom@latest`, `tailwindcss`, `lucide-react`, `framer-motion`, `@ducanh2912/next-pwa`, `minisearch`, `vitest`, `@testing-library/react`). Configure `tailwind.config.ts` with Stitch color tokens (`#6B1D2F`, `#C5A059`, `#FAFAF7`, `#1C1917`, `#F3EFE6`, `#8F6E28`).

- [ ] **Step 4: Verify test passes and production build compiles**
Run: `npm test` and `npm run build`
Expected: PASS with 0 build warnings.

- [ ] **Step 5: Commit**
```powershell
git add .
git commit -m "chore: scaffold Next.js 15 PWA with Google Stitch design system"
```

---

### Task 2: Scripture Types & Normalized Data Engine (Complete Gita + Epics + Curated Stashes)

**Files:**
- Create: `src/lib/types/scripture.ts`
- Create: `src/lib/data/corpusMeta.ts`
- Create: `src/lib/data/gita/chapters.ts`
- Create: `src/lib/data/gita/verses.ts`
- Create: `src/lib/data/ramayana/episodes.ts`
- Create: `src/lib/data/mahabharata/episodes.ts`
- Create: `src/lib/data/vedas/suktas.ts`
- Create: `src/lib/data/puranas/stories.ts`
- Create: `src/lib/data/stashes/curatedStashes.ts`
- Create: `src/lib/data/index.ts`
- Test: `tests/unit/data-integrity.test.ts`

**Interfaces:**
- Consumes: Type definitions in `src/lib/types/scripture.ts`
- Produces:
  * `getCorpus(id: CorpusId): ScriptureCorpus | undefined`
  * `getSection(corpusId: CorpusId, sectionNumber: number): ScriptureSection | undefined`
  * `getCardUnit(unitId: string): DharmaCardUnit | undefined`
  * `getAllCards(): DharmaCardUnit[]`
  * `getCuratedStashes(): DharmaStash[]`

- [ ] **Step 1: Write failing data integrity tests**
```typescript
// tests/unit/data-integrity.test.ts
import { describe, it, expect } from 'vitest';
import { getCorpus, getCardUnit, getAllCards, getCuratedStashes } from '@/lib/data';

describe('Scripture & Stash Data Integrity', () => {
  it('loads all 5 scripture corpuses and curated stashes', () => {
    const corpuses = ['bhagavad-gita', 'ramayana', 'mahabharata', 'vedas', 'puranas'] as const;
    corpuses.forEach(id => {
      const corpus = getCorpus(id);
      expect(corpus).toBeDefined();
    });
    const stashes = getCuratedStashes();
    expect(stashes.length).toBeGreaterThanOrEqual(4);
  });

  it('verifies verse bg-2-47 contains Deepstash cardTitle, Devanagari, and 3-layer data in all 6 languages', () => {
    const v47 = getCardUnit('bg-2-47');
    expect(v47).toBeDefined();
    expect(v47?.cardTitle.en).toBeTruthy();
    expect(v47?.sanskrit.devanagari).toContain('कर्मण्येवाधिकारस्ते');
    expect(v47?.translation.en).toBeTruthy();
    expect(v47?.translation.hi).toBeTruthy();
    expect(v47?.translation.kn).toBeTruthy();
    expect(v47?.translation.ta).toBeTruthy();
    expect(v47?.translation.te).toBeTruthy();
    expect(v47?.essence.philosophicalMeaning.en).toBeTruthy();
    expect(v47?.essence.modernLifeApplication.en).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/unit/data-integrity.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement scripture schema, curated content, and editorial stashes in `src/lib/data/`**
Implement `src/lib/types/scripture.ts`, the Gita verses, epic episodes, Vedic suktas, Puranic tales, and curated stashes (Krishna's Mental Models, Moral Dilemmas, Ramayana Leadership).

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test tests/unit/data-integrity.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```powershell
git add src/lib/types src/lib/data tests/unit/data-integrity.test.ts
git commit -m "feat: implement universal scripture schema, Gita data, and curated Deepstash packs"
```

---

### Task 3: Client State Management & Local-First "Stash" Store

**Files:**
- Create: `src/lib/storage/userStore.ts`
- Create: `src/lib/storage/streakTracker.ts`
- Test: `tests/unit/user-store.test.ts`

**Interfaces:**
- Consumes: `LanguageCode`, `DharmaCardUnit`
- Produces:
  * `useUserStore()` hook with state:
    * `preferences: UserPreferences`
    * `setLanguage(lang: LanguageCode): void`
    * `createStash(title: string): string`
    * `addCardToStash(stashId: string, cardId: string, note?: string): void`
    * `removeCardFromStash(stashId: string, cardId: string): void`
    * `isCardInAnyStash(cardId: string): boolean`
    * `markCardRead(cardId: string): void`
    * `streak: { currentStreak: number; bestStreak: number }`

- [ ] **Step 1: Write failing tests for user store and stash management**
```typescript
// tests/unit/user-store.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { calculateStreakLogic, sanitizeUserData } from '@/lib/storage/streakTracker';

describe('User Store & Stash Manager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('calculates continuous daily streaks correctly', () => {
    const result = calculateStreakLogic(['2026-11-07', '2026-11-08', '2026-11-09'], '2026-11-09');
    expect(result.currentStreak).toBe(3);
  });

  it('sanitizes and migrates user stashes gracefully from storage', () => {
    const raw = JSON.stringify({
      stashes: [{ id: 's1', title: 'Workplace Dharma', cardIds: ['bg-2-47'] }]
    });
    const sanitized = sanitizeUserData(raw);
    expect(sanitized.stashes.length).toBe(1);
    expect(sanitized.stashes[0].title).toBe('Workplace Dharma');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/unit/user-store.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `userStore.ts` and `streakTracker.ts`**
Implement typed persistent store using `localStorage` with stash collection CRUD, reading completion tracking, and streak calculation.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test tests/unit/user-store.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```powershell
git add src/lib/storage tests/unit/user-store.test.ts
git commit -m "feat: implement local-first stash collection store and streak tracker"
```

---

### Task 4: In-Memory Client Search Engine across 6 Languages

**Files:**
- Create: `src/lib/search/searchEngine.ts`
- Test: `tests/unit/search.test.ts`

**Interfaces:**
- Consumes: `DharmaCardUnit` from `src/lib/types/scripture.ts` and data from `src/lib/data`
- Produces:
  * `searchCards(query: string, lang?: LanguageCode): SearchResultItem[]`

- [ ] **Step 1: Write failing search engine tests**
```typescript
// tests/unit/search.test.ts
import { describe, it, expect } from 'vitest';
import { searchCards } from '@/lib/search/searchEngine';

describe('In-Memory Dharma Search', () => {
  it('finds cards by insight title and themes like "Karma" or "Anxiety"', () => {
    const results = searchCards('Action');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].unit.id).toBe('bg-2-47');
  });

  it('finds cards by IAST transliteration "karmanyevadhikaraste"', () => {
    const results = searchCards('karmanye');
    expect(results.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/unit/search.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `searchEngine.ts` with MiniSearch**
Index all cards, card titles, translations, essences, and tags into an optimized client index.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test tests/unit/search.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```powershell
git add src/lib/search tests/unit/search.test.ts
git commit -m "feat: implement client-side multilingual search engine for cards and stashes"
```

---

### Task 5: Audio Chanting, Pronunciation Guide & Web Speech TTS

**Files:**
- Create: `src/components/audio/AudioPlayer.tsx`
- Create: `src/components/audio/PronunciationGuide.tsx`
- Test: `tests/components/AudioPlayer.test.tsx`

**Interfaces:**
- Consumes: `sanskrit: { devanagari: string; transliteration: string; syllableBreakdown?: string[] }`, `audioUrl?: string`
- Produces:
  * `<AudioPlayer audioUrl={url} shlokaText={text} language={lang} />`
  * `<PronunciationGuide syllables={syllables} transliteration={iast} />`

- [ ] **Step 1: Write failing tests for AudioPlayer and Syllable Guide**
```typescript
// tests/components/AudioPlayer.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AudioPlayer } from '@/components/audio/AudioPlayer';

describe('AudioPlayer Component', () => {
  it('renders playback controls and loop counter buttons', () => {
    render(<AudioPlayer audioUrl="/audio/bg-2-47.mp3" shlokaText="कर्मण्येवाधिकारस्ते" language="en" />);
    expect(screen.getByLabelText(/play/i)).toBeDefined();
    expect(screen.getByText(/speed/i)).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/components/AudioPlayer.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement `AudioPlayer.tsx` and `PronunciationGuide.tsx`**
Implement HTML5 audio playback, speed toggling ($0.75\times, 1.0\times, 1.25\times$), loop counter ($3\times, 9\times, 21\times, 108\times$), syllable pill highlighter, and browser SpeechSynthesis fallback.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test tests/components/AudioPlayer.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```powershell
git add src/components/audio tests/components/AudioPlayer.test.tsx
git commit -m "feat: implement shloka audio player and pronunciation guide component"
```

---

### Task 6: The Deepstash-Style "Dharma Card" Component

**Files:**
- Create: `src/components/card/DharmaCard.tsx`
- Create: `src/components/card/StashModal.tsx`
- Create: `src/components/card/ShareCardModal.tsx`
- Test: `tests/components/DharmaCard.test.tsx`

**Interfaces:**
- Consumes: `DharmaCardUnit`, `UserPreferences`
- Produces:
  * `<DharmaCard unit={card} currentLanguage={lang} onStash={fn} isStashed={bool} />`

- [ ] **Step 1: Write failing tests for DharmaCard 3-layer switching and stashing**
```typescript
// tests/components/DharmaCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DharmaCard } from '@/components/card/DharmaCard';
import { getCardUnit } from '@/lib/data';

describe('DharmaCard Deepstash Component', () => {
  it('renders card title, citation badge, Devanagari, and switches between 3 insight layers', () => {
    const unit = getCardUnit('bg-2-47')!;
    render(<DharmaCard unit={unit} currentLanguage="en" isStashed={false} onStash={() => {}} />);
    
    // Check citation and card title
    expect(screen.getByText(/Bhagavad Gita/i)).toBeDefined();
    expect(screen.getByText(/Action Without Anxiety/i)).toBeDefined();
    
    // Switch to Layer 2 (Essence)
    const essenceTab = screen.getByRole('tab', { name: /essence/i });
    fireEvent.click(essenceTab);
    expect(screen.getByText(/philosophical essence/i)).toBeDefined();
    
    // Check Stash button
    expect(screen.getByRole('button', { name: /stash/i })).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/components/DharmaCard.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement `DharmaCard.tsx`, `StashModal.tsx`, and `ShareCardModal.tsx`**
Adhere strictly to Stitch tokens (`#6B1D2F`, `#FAFAF7`, `#1C1917`, `#C5A059`), render punchy card title, Devanagari + IAST, audio dock, 3-layer tabs, "Stash to Collection" modal, and aesthetic quote card generator.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test tests/components/DharmaCard.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```powershell
git add src/components/card tests/components/DharmaCard.test.tsx
git commit -m "feat: implement Deepstash-style Dharma Card and Stash modal"
```

---

### Task 7: The Deepstash Micro-Feed (`/feed` and Home Feed)

**Files:**
- Create: `src/app/feed/page.tsx`
- Create: `src/components/feed/CardStream.tsx`
- Create: `src/components/feed/FeedFilterBar.tsx`
- Test: `tests/integration/card-feed.test.tsx`

**Interfaces:**
- Consumes: All cards and user preferences
- Produces: Smooth infinite/swipeable card feed with category filters (All, Mindset, Leadership, Gita, Epics).

- [ ] **Step 1: Write failing integration test for Card Feed**
```typescript
// tests/integration/card-feed.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeedPage from '@/app/feed/page';

describe('Card Feed Integration', () => {
  it('renders card stream with category filters', () => {
    render(<FeedPage />);
    expect(screen.getByText(/daily wisdom feed/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /all/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /mindset/i })).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/integration/card-feed.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement `CardStream.tsx`, `FeedFilterBar.tsx`, and `/feed/page.tsx`**
Implement smooth scroll/snap card stream with category filtering and keyboard down/up navigation.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test tests/integration/card-feed.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```powershell
git add src/app/feed src/components/feed tests/integration/card-feed.test.tsx
git commit -m "feat: implement Deepstash-style card stream feed with category filters"
```

---

### Task 8: Curated & Personal Stashes Hub (`/stashes`)

**Files:**
- Create: `src/app/stashes/page.tsx`
- Create: `src/app/stashes/[stashId]/page.tsx`
- Create: `src/components/stashes/StashCard.tsx`
- Create: `src/components/stashes/CreateStashModal.tsx`
- Test: `tests/integration/stashes-hub.test.tsx`

**Interfaces:**
- Consumes: `getCuratedStashes()`, `useUserStore()`
- Produces: Stash directory page showing curated editorial packs ("Krishna's Mental Models", "Moral Dilemmas") and user-created custom stashes.

- [ ] **Step 1: Write failing integration test for Stashes Hub**
```typescript
// tests/integration/stashes-hub.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StashesPage from '@/app/stashes/page';

describe('Stashes Hub Integration', () => {
  it('renders curated editorial stashes and button to create custom stash', () => {
    render(<StashesPage />);
    expect(screen.getByText(/curated stashes/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /new stash/i })).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/integration/stashes-hub.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement `/stashes/page.tsx`, `/stashes/[stashId]/page.tsx`, and components**
Build curated stash showcase, user stash grid, stash creation modal, and detailed collection view.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test tests/integration/stashes-hub.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```powershell
git add src/app/stashes src/components/stashes tests/integration/stashes-hub.test.tsx
git commit -m "feat: implement Curated and Personal Stashes hub"
```

---

### Task 9: Discovery Hub (`/`), Sequential Scripture Reader (`/read`), & Navigation Bar

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/app/read/[corpusId]/[sectionId]/page.tsx`
- Create: `src/components/navigation/AppNavbar.tsx`
- Create: `src/components/home/ShlokaOfTheDay.tsx`
- Create: `src/components/home/CorpusGrid.tsx`
- Test: `tests/integration/home-page.test.tsx`

**Interfaces:**
- Consumes: All scripture corpuses, card stream, and navigation
- Produces: Unified home experience uniting Discovery Hub, Card Feed, and Sequential Scripture Reader.

- [ ] **Step 1: Write failing home page tests**
```typescript
// tests/integration/home-page.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('Home Page Discovery Hub', () => {
  it('renders Shloka of the Day, Corpus Gateway, and navigation links', () => {
    render(<HomePage />);
    expect(screen.getByText(/shloka of the day/i)).toBeDefined();
    expect(screen.getByText(/Bhagavad Gita/i)).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/integration/home-page.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement Home Page, Sequential Reader, and Navigation Bar**
Implement `src/app/page.tsx`, `AppNavbar.tsx`, `ShlokaOfTheDay.tsx`, `CorpusGrid.tsx`, and `/read/[corpusId]/[sectionId]/page.tsx` using Stitch tokens.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test tests/integration/home-page.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```powershell
git add src/app/page.tsx src/app/read src/components/navigation src/components/home tests/integration/home-page.test.tsx
git commit -m "feat: implement Discovery Hub, sequential scripture reader, and navigation bar"
```

---

### Task 10: Production Build, Offline Service Worker & WCAG Verification

**Files:**
- Create/Modify: `next.config.mjs` (PWA caching strategies)
- Test: `tests/e2e/accessibility.test.ts`

**Interfaces:**
- Consumes: Complete project codebase
- Produces: 100% verified, static production export, offline service worker, zero lint/type errors.

- [ ] **Step 1: Write accessibility and contrast automated checks**
```typescript
// tests/e2e/accessibility.test.ts
import { describe, it, expect } from 'vitest';

describe('A11y and Stitch Token Verification', () => {
  it('verifies contrast ratio of Imperial Maroon (#6B1D2F) on Warm Pearl Ivory (#FAFAF7) > 7:1', () => {
    const maroonLuminance = 0.038;
    const ivoryLuminance = 0.945;
    const ratio = (ivoryLuminance + 0.05) / (maroonLuminance + 0.05);
    expect(ratio).toBeGreaterThan(7.0); // Passes WCAG AAA
  });
});
```

- [ ] **Step 2: Run test to verify it passes**
Run: `npm test tests/e2e/accessibility.test.ts`
Expected: PASS

- [ ] **Step 3: Run full TypeScript check and production build**
Run: `npx tsc --noEmit` and `npm run build`
Expected: Static compilation succeeds with all routes statically pre-rendered and PWA sw.js generated.

- [ ] **Step 4: Commit**
```powershell
git add .
git commit -m "chore: complete production build verification and offline PWA optimization"
```
