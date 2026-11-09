# Design System Specification: Dharma Learning Platform

**Standard:** Google Stitch `DESIGN.md` Specification  
**Version:** 1.0.0  
**Project:** Dharma Learning Platform (Sanatana Dharma Sacred Texts)  
**Root Path:** `\\KUBERAN-NAS\Kuberan\Jeevan\Gemini Projects\dharma-learning-app`

---

## 1. Brand Essence & Philosophy

The visual language of the Dharma Learning Platform merges the timeless sanctity of ancient Indian heritage with the clean, distraction-free utility of modern high-performance web applications. The visual identity reflects reverence, clarity, and meditative calm:

* **Sacred Sanctum Feel:** Drawing inspiration from traditional temple architecture, parchment manuscripts (*Taalapatra* / Palm-leaf manuscripts), and classical silk borders.
* **Typographic Rigor:** Equal dignity given to Devanagari, regional Dravidian scripts (Kannada, Tamil, Telugu), and phonetic Latin IAST transliteration.
* **Calm & Non-Distracting:** Zero chaotic banners, zero high-frequency popups, and generous whitespace designed for contemplative reading.

---

## 2. Color Palette & Token Architecture

All UI components, Tailwind classes, and CSS custom properties must adhere strictly to the following tokens:

| Token Name | Hex Code | Role & Usage | Contrast Ratio on Ivory |
| :--- | :--- | :--- | :--- |
| **Imperial Maroon** | `#6B1D2F` | Primary brand color, headers, key CTAs, active tab indicators, and sacred accents. | **9.2:1 (Passes AAA)** |
| **Antique Temple Gold** | `#C5A059` | Secondary accent, borders, shloka number emblems, audio controls, and highlight trims. | **2.8:1 (Used for borders & decorative accents)** |
| **Deep Temple Gold** | `#8F6E28` | Used when gold text is required on ivory backgrounds to ensure WCAG AA readability. | **4.6:1 (Passes AA)** |
| **Warm Pearl Ivory** | `#FAFAF7` | Default reading background canvas, card surfaces, and parchment base. | **Base Canvas** |
| **Parchment Surface**| `#F3EFE6` | Elevated card backgrounds, verse highlight zones, and interactive pill backgrounds. | **Base Surface** |
| **Charcoal Slate** | `#1C1917` | High-contrast primary text, verse Sanskrit rendering, and header typography. | **16.1:1 (Passes AAA)** |
| **Muted Stone** | `#57534E` | Secondary body text, layer subtitles, word-breakdown annotations. | **5.4:1 (Passes AA)** |
| **Muted Sand Border**| `#E4DEC8` | Divider rules, card borders, tab borders. | **Structural Border** |

---

## 3. Typography Hierarchy

### 3.1 Type Families
* **Display / Serifs (Headings & Brand):** `Cinzel`, `serif`
* **Devanagari & Regional Indian Scripts:** `Noto Sans Devanagari`, `Noto Sans Kannada`, `Noto Sans Tamil`, `Noto Sans Telugu`, `sans-serif`
* **Transliteration & Modern Body:** `Inter`, `system-ui`, `-apple-system`, `sans-serif`

### 3.2 Type Scale
* **Display H1 (Corpus Title):** `text-3xl md:text-4xl font-serif font-bold text-[#6B1D2F] tracking-wide`
* **Section H2 (Chapter/Kanda):** `text-xl md:text-2xl font-serif font-semibold text-[#1C1917]`
* **Shloka Sanskrit Verse:** `text-lg md:text-2xl font-serif leading-relaxed text-[#1C1917] tracking-normal`
* **IAST Transliteration:** `text-sm md:text-base font-mono italic text-[#57534E] leading-normal`
* **Layer 1 Translation:** `text-base md:text-lg leading-relaxed text-[#1C1917]`
* **Layer 2 Essence (Tatparya):** `text-base md:text-lg leading-relaxed text-[#6B1D2F] font-medium`
* **Layer 3 Life Application:** `text-base md:text-lg leading-relaxed text-[#1C1917]`
* **Word Breakdown / Syllables:** `text-xs md:text-sm font-sans text-[#57534E]`

---

## 4. Component Standards

### 4.1 Verse Card Component
* **Background:** `bg-[#FAFAF7]` with subtle gold border `border border-[#E4DEC8]`
* **Rounded Corners:** `rounded-2xl`
* **Header:** Embellished with chapter/verse badge in `#6B1D2F` with gold border `#C5A059`.
* **Audio Dock:** Integrated player bar at bottom with play/pause, loop toggle, and audio waveform indicator in `#8F6E28`.
* **Layer Navigation:** 3 distinct pill tabs for *Translation*, *Essence*, and *Life Application*.

### 4.2 Interactive Word-Breakdown Pills
* **Default State:** `bg-[#F3EFE6] text-[#57534E] border border-[#E4DEC8] rounded-full px-3 py-1 text-xs hover:border-[#C5A059]`
* **Active / Selected State:** `bg-[#6B1D2F] text-[#FAFAF7] border-[#6B1D2F] shadow-sm`

### 4.3 Buttons & Interactive Controls
* **Primary CTA:** Background `#6B1D2F`, text `#FAFAF7`, hover `bg-[#521422]`, active scale `active:scale-95`.
* **Secondary / Outline:** Border `border-2 border-[#C5A059]`, text `#6B1D2F`, hover `bg-[#F3EFE6]`.
* **Touch Target:** Minimum dimension of $44 \times 44\text{px}$ on all interactive controls.
* **Focus States:** High-visibility outline `focus-visible:ring-2 focus-visible:ring-[#C5A059] focus-visible:ring-offset-2`.

---

## 5. Accessibility Baseline (WCAG 2.2 AA / AAA)

* **Contrast Ratios:** All body text meets at least **4.5:1** (AA standard) and all headings meet **7:1** (AAA standard) on their respective backgrounds.
* **Touch Targets:** No clickable element is smaller than $44 \times 44\text{px}$.
* **Keyboard Navigation:**
  * Full tab indexing across all interactive elements.
  * Explicit keyboard shortcuts for reader navigation (`ArrowLeft` / `ArrowRight`, `Space` for audio, `1-3` for insight tabs).
* **Motion Preferences:** Respects `prefers-reduced-motion: reduce` across all animations and transitions.
