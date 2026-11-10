# Kuberan Dharma App — Official App Store & Google Play Store Metadata Specification

---

## 1. Store Positioning & Categorization

| Field | Google Play Store | Apple App Store |
| :--- | :--- | :--- |
| **App Name / Title** | `Kuberan Dharma: Gita & Vedas` *(29/30 chars)* | `Kuberan Dharma: Gita & Vedas` *(29/30 chars)* |
| **Subtitle / Short Description** | `Learn Bhagavad Gita, Ramayana, Vedas & Epics in bite-sized offline cards.` *(74/80 chars)* | `Sacred Wisdom in Daily Cards` *(28/30 chars)* |
| **Primary Category** | Education | Education |
| **Secondary Category** | Books & Reference | Books |
| **Content Rating** | Everyone (IARC Rating: All ages) | 4+ (No objectionable content) |
| **Pricing** | Free (No In-App Purchases, No Subscriptions) | Free (No In-App Purchases, No Subscriptions) |
| **Advertisements** | Contains NO Ads | Contains NO Ads |
| **App ID / Bundle ID** | `com.kuberansilks.dharma` | `com.kuberansilks.dharma` |

---

## 2. Apple App Store Listing Details

### Promotional Text (168/170 characters)
> Discover timeless wisdom from Ramayana to the Gita. 100% offline cards with audio chanting, philosophical meanings, and daily workplace applications across 6 languages.

### Keywords (99/100 characters)
```
gita,bhagavad gita,ramayana,vedas,upanishads,shloka,sanskrit,meditation,dharma,hindu scriptures,wisdom
```

### Support & Marketing URLs
- **Support URL:** `https://kuberansilks.com/`
- **Marketing URL:** `https://jee1vk.github.io/kuberan-dharma-app/`
- **Privacy Policy URL:** `https://kuberansilks.com/policies/privacy-policy`
- **Terms of Service URL:** `https://kuberansilks.com/policies/terms-of-service`
- **Copyright Statement:** `© 2026 Kuberan Silks Chickpet. All Rights Reserved.`

---

## 3. Full App Store & Google Play Description (Markdown / Plain Text)

```markdown
Immerse yourself in the sacred wisdom of Indian civilization. KUBERAN DHARMA transforms the timeless teachings of the Bhagavad Gita, Valmiki Ramayana, Mahabharata, Vedas, Upanishads, and Puranas into beautiful, bite-sized daily reflection cards designed for modern life.

Curated with reverence under the 100-year cultural heritage of Kuberan Silks Chickpet, Bengaluru, this app brings authentic Sanatana Dharma to your pocket — 100% free, completely offline, and without ads.

══════════════════════════════════════
✨ WHY KUBERAN DHARMA?
══════════════════════════════════════

📖 THE FIVE SACRED CORPUSES
Explore five foundational pillars of Vedic and epic literature in one unified sanctuary:
• Srimad Bhagavad Gita: Complete 18 chapters and key shlokas on karma, duty, and spiritual equanimity.
• Valmiki Ramayana: Adi Kavya narratives of Maryada Purushottam Rama, devotion, and ethical leadership.
• Mahabharata: Complex moral dilemmas, Vidur Niti, and righteous action in times of crisis.
• Vedas & Upanishads: Universal mantras, Purusha Sukta, Isha Upanishad, and Vedic non-dual philosophy.
• Puranas & Parables: Inspiring tales of patience, faith, and cosmic balance.

🪔 3-LAYER WISDOM ARCHITECTURE
Every sacred verse is structured into three intuitive learning layers:
1. Sacred Sanskrit & Word Meanings: Original Devanagari text with romanized transliteration, syllable-by-syllable pronunciation guide, and root breakdown.
2. Philosophical Essence: The timeless spiritual core explained in lucid, scholarly language.
3. Everyday Workplace & Life Application: Practical insights for stress management, overcoming imposter syndrome, ethical decision-making, and emotional balance at work and home.

🔊 SACRED SHLOKA CHANTING & JAPA COUNTER
• Listen to clear Sanskrit recitations with adjustable playback speeds (0.8x, 1.0x, 1.25x).
• Practice mindful repetition with built-in Japa counters: 1x, 3x, 11x, or full 108x chanting cycles.
• Syllable-by-syllable pronunciation breakdown helps children and adults chant with correct Vedic meter (chhandas).

🌐 6 INDIAN LANGUAGES IN ONE TAP
Switch scriptures effortlessly between 6 languages from any screen:
• English
• हिन्दी (Hindi)
• ಕನ್ನಡ (Kannada)
• संस्कृतम् (Sanskrit)
• தமிழ் (Tamil)
• తెలుగు (Telugu)

🔖 CURATED STASHES & OFFLINE SEARCH
• Themed collections tailored to real-life situations: "Krishna Mental Models for Decision Making", "Moral Dilemmas: The Mahabharata Guide", "Duty, Leadership & Governance", and "Inner Peace in Times of Chaos".
• Instant full-text offline search powered by MiniSearch: find verses by situation, Sanskrit root, deity, or philosophical concept without internet.

🔥 DAILY REFLECTION HABIT & STREAK TRACKER
• Shloka of the Day: An auspicious morning darshan delivered to your screen.
• "Mark Reflected": Track your daily contemplation practice with a glowing diya streak counter.
• Save favorite verses to personal custom stashes for quick meditation.

🛡️ 100% OFFLINE, PRIVATE, & DISTRACTION-FREE
• Zero account creation required: No phone numbers, no emails, no tracking.
• No advertisements: Clean, peaceful reading canvas honoring sacred literature.
• Works anywhere: Trains, flights, temples, and offline retreats.

══════════════════════════════════════
ABOUT KUBERAN SILKS
══════════════════════════════════════
For over a century, Kuberan Silks has stood at the historic heart of Chickpet, Bengaluru, as a custodian of authentic Indian heritage, pure silk weaving, and dharmic traditions. Kuberan Dharma is our humble spiritual seva to seekers and families worldwide.

Begin your journey into timeless clarity today.
```

---

## 4. Google Play Store Data Safety Declaration

| Questionnaire Item | Declaration | Developer Notes |
| :--- | :--- | :--- |
| **Data Collection** | **No data is collected** | The application does not collect, log, or transmit any user information to any server. |
| **Data Sharing** | **No data is shared with third parties** | Zero third-party SDKs, zero ad networks, zero analytics SDKs. |
| **Security Practices** | **Data is stored locally on device** | User reading history, preferences, and stashes are saved in local browser `localStorage` / SQLite native bridge. |
| **Data Deletion Request** | **Users can clear all data instantly** | A "Reset All Stashes & History" button in Settings immediately purges device memory. |

---

## 5. Apple App Store Privacy Nutrition Labels

| Category | Status | Details |
| :--- | :--- | :--- |
| **Data Used to Track You** | None | The app does not track users across other companies' apps or websites. |
| **Data Linked to You** | None | No accounts, personal identifiers, or emails are collected or linked. |
| **Data Not Linked to You** | None | No diagnostic or usage data collected. |
| **Required Reason API Manifest** | `PrivacyInfo.xcprivacy` configured | Declares `NSPrivacyAccessedAPITypeUserDefaults` under reason `CA92.1` for storing user language preferences, reading streaks, and saved bookmark collections. |

---

## 6. Store Visual Asset Verification

| Asset File | Target Store | Dimensions | Alpha Channel | Status |
| :--- | :--- | :--- | :--- | :--- |
| `store_assets/android/icon-512.png` | Google Play | 512 × 512 px | Flattened RGB | Ready |
| `store_assets/ios/icon-1024.png` | App Store | 1024 × 1024 px | 100% Opaque (No alpha) | Ready |
| `store_assets/android/feature-graphic-1024x500.png` | Google Play | 1024 × 500 px | 24-bit RGB (No alpha) | Ready |
| `store_assets/screenshots/android/01_shloka_of_the_day.png` | Google Play | 1080 × 2400 px | 9:16 Portrait | Ready |
| `store_assets/screenshots/android/02_scripture_corpus_reader.png` | Google Play | 1080 × 2400 px | 9:16 Portrait | Ready |
| `store_assets/screenshots/android/03_curated_stashes_search.png` | Google Play | 1080 × 2400 px | 9:16 Portrait | Ready |
| `store_assets/screenshots/android/04_daily_streak_habit.png` | Google Play | 1080 × 2400 px | 9:16 Portrait | Ready |
| `store_assets/screenshots/ios/01_shloka_of_the_day.png` | App Store | 1290 × 2796 px | 6.7"/6.9" Portrait | Ready |
| `store_assets/screenshots/ios/02_scripture_corpus_reader.png` | App Store | 1290 × 2796 px | 6.7"/6.9" Portrait | Ready |
| `store_assets/screenshots/ios/03_curated_stashes_search.png` | App Store | 1290 × 2796 px | 6.7"/6.9" Portrait | Ready |
| `store_assets/screenshots/ios/04_daily_streak_habit.png` | App Store | 1290 × 2796 px | 6.7"/6.9" Portrait | Ready |
