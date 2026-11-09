'use client';

import { useState, useEffect } from 'react';
import { LanguageCode } from '../types/scripture';
import { UserStorageSchema, DEFAULT_USER_STORAGE, sanitizeUserData, calculateStreakLogic } from './streakTracker';

const STORAGE_KEY = 'kuberan_dharma_user_v1';

export function getLocalUser(): UserStorageSchema {
  if (typeof window === 'undefined') return DEFAULT_USER_STORAGE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return sanitizeUserData(raw);
  } catch {
    return DEFAULT_USER_STORAGE;
  }
}

export function saveLocalUser(data: UserStorageSchema): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save user data to localStorage', e);
  }
}

export function useUserStore() {
  const [data, setData] = useState<UserStorageSchema>(DEFAULT_USER_STORAGE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setData(getLocalUser());
    setIsLoaded(true);
  }, []);

  const updatePreferences = (updates: Partial<UserStorageSchema['preferences']>) => {
    setData(prev => {
      const updated: UserStorageSchema = {
        ...prev,
        preferences: { ...prev.preferences, ...updates }
      };
      saveLocalUser(updated);
      return updated;
    });
  };

  const setLanguage = (lang: LanguageCode) => {
    updatePreferences({ language: lang });
  };

  const createStash = (title: string): string => {
    const newId = `stash-${Date.now()}`;
    setData(prev => {
      const newStash = {
        id: newId,
        title,
        createdAt: Date.now(),
        cardIds: [],
        notes: {}
      };
      const updated: UserStorageSchema = {
        ...prev,
        stashes: [...prev.stashes, newStash]
      };
      saveLocalUser(updated);
      return updated;
    });
    return newId;
  };

  const addCardToStash = (stashId: string, cardId: string, note?: string) => {
    setData(prev => {
      const updatedStashes = prev.stashes.map(s => {
        if (s.id === stashId) {
          const cardIds = s.cardIds.includes(cardId) ? s.cardIds : [...s.cardIds, cardId];
          const notes = note ? { ...s.notes, [cardId]: note } : s.notes;
          return { ...s, cardIds, notes };
        }
        return s;
      });
      const updated = { ...prev, stashes: updatedStashes };
      saveLocalUser(updated);
      return updated;
    });
  };

  const removeCardFromStash = (stashId: string, cardId: string) => {
    setData(prev => {
      const updatedStashes = prev.stashes.map(s => {
        if (s.id === stashId) {
          return { ...s, cardIds: s.cardIds.filter(id => id !== cardId) };
        }
        return s;
      });
      const updated = { ...prev, stashes: updatedStashes };
      saveLocalUser(updated);
      return updated;
    });
  };

  const isCardInAnyStash = (cardId: string): boolean => {
    return data.stashes.some(s => s.cardIds.includes(cardId));
  };

  const markCardRead = (cardId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => {
      const completedCardIds = prev.completedCardIds.includes(cardId)
        ? prev.completedCardIds
        : [...prev.completedCardIds, cardId];
      
      const activeDates = prev.activeDates.includes(today)
        ? prev.activeDates
        : [...prev.activeDates, today];
      
      const streak = calculateStreakLogic(activeDates, today);

      const updated: UserStorageSchema = {
        ...prev,
        completedCardIds,
        activeDates,
        streak: {
          currentStreak: streak.currentStreak,
          bestStreak: streak.bestStreak,
          lastActiveDate: today,
        }
      };
      saveLocalUser(updated);
      return updated;
    });
  };

  return {
    isLoaded,
    preferences: data.preferences,
    stashes: data.stashes,
    completedCardIds: data.completedCardIds,
    streak: data.streak,
    setLanguage,
    updatePreferences,
    createStash,
    addCardToStash,
    removeCardFromStash,
    isCardInAnyStash,
    markCardRead
  };
}
