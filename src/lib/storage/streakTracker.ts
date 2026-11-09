import { LanguageCode } from '../types/scripture';

export interface UserPreferences {
  language: LanguageCode;
  scriptView: 'both' | 'devanagari' | 'transliteration';
  fontSize: 'sm' | 'base' | 'lg';
  audioSpeed: number;
}

export interface UserStashCollection {
  id: string;
  title: string;
  createdAt: number;
  cardIds: string[];
  notes?: Record<string, string>; // cardId -> note
}

export interface UserStorageSchema {
  preferences: UserPreferences;
  stashes: UserStashCollection[];
  completedCardIds: string[];
  activeDates: string[];
  streak: {
    currentStreak: number;
    bestStreak: number;
    lastActiveDate: string;
  };
}

export const DEFAULT_USER_STORAGE: UserStorageSchema = {
  preferences: {
    language: 'en',
    scriptView: 'both',
    fontSize: 'base',
    audioSpeed: 1.0,
  },
  stashes: [
    {
      id: 'my-favorite-wisdom',
      title: 'My Favorite Wisdom',
      createdAt: Date.now(),
      cardIds: ['bg-2-47'],
      notes: {
        'bg-2-47': 'My morning reminder: focus on effort, not worry.'
      }
    }
  ],
  completedCardIds: [],
  activeDates: [],
  streak: {
    currentStreak: 0,
    bestStreak: 0,
    lastActiveDate: '',
  }
};

export function calculateStreakLogic(activeDates: string[], today: string): { currentStreak: number; bestStreak: number } {
  if (!activeDates || activeDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Remove duplicates and sort ascending
  const uniqueDates = Array.from(new Set(activeDates)).sort();
  const todayDate = new Date(today);

  // Check if today or yesterday was active
  const lastDateStr = uniqueDates[uniqueDates.length - 1];
  const lastDate = new Date(lastDateStr);
  const diffDaysFromToday = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDaysFromToday > 1) {
    return { currentStreak: 0, bestStreak: uniqueDates.length };
  }

  // Calculate consecutive days backwards from end
  let currentStreak = 1;
  for (let i = uniqueDates.length - 1; i > 0; i--) {
    const current = new Date(uniqueDates[i]);
    const previous = new Date(uniqueDates[i - 1]);
    const diff = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      currentStreak++;
    } else {
      break;
    }
  }

  return {
    currentStreak,
    bestStreak: Math.max(currentStreak, uniqueDates.length)
  };
}

export function sanitizeUserData(raw: string | null): UserStorageSchema {
  if (!raw) return DEFAULT_USER_STORAGE;

  try {
    const parsed = JSON.parse(raw);
    return {
      preferences: {
        language: ['en', 'hi', 'kn', 'sa', 'ta', 'te'].includes(parsed?.preferences?.language)
          ? parsed.preferences.language
          : DEFAULT_USER_STORAGE.preferences.language,
        scriptView: ['both', 'devanagari', 'transliteration'].includes(parsed?.preferences?.scriptView)
          ? parsed.preferences.scriptView
          : DEFAULT_USER_STORAGE.preferences.scriptView,
        fontSize: ['sm', 'base', 'lg'].includes(parsed?.preferences?.fontSize)
          ? parsed.preferences.fontSize
          : DEFAULT_USER_STORAGE.preferences.fontSize,
        audioSpeed: typeof parsed?.preferences?.audioSpeed === 'number' ? parsed.preferences.audioSpeed : 1.0,
      },
      stashes: Array.isArray(parsed?.stashes) ? parsed.stashes : DEFAULT_USER_STORAGE.stashes,
      completedCardIds: Array.isArray(parsed?.completedCardIds) ? parsed.completedCardIds : [],
      activeDates: Array.isArray(parsed?.activeDates) ? parsed.activeDates : [],
      streak: {
        currentStreak: typeof parsed?.streak?.currentStreak === 'number' ? parsed.streak.currentStreak : 0,
        bestStreak: typeof parsed?.streak?.bestStreak === 'number' ? parsed.streak.bestStreak : 0,
        lastActiveDate: typeof parsed?.streak?.lastActiveDate === 'string' ? parsed.streak.lastActiveDate : '',
      }
    };
  } catch {
    return DEFAULT_USER_STORAGE;
  }
}
