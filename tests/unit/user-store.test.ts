import { describe, it, expect, beforeEach } from 'vitest';
import { calculateStreakLogic, sanitizeUserData } from '@/lib/storage/streakTracker';

describe('User Store & Stash Manager', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  it('calculates continuous daily streaks correctly', () => {
    const result = calculateStreakLogic(['2026-11-07', '2026-11-08', '2026-11-09'], '2026-11-09');
    expect(result.currentStreak).toBe(3);
  });

  it('resets current streak to 0 if gap is more than 1 day', () => {
    const result = calculateStreakLogic(['2026-11-01', '2026-11-02'], '2026-11-09');
    expect(result.currentStreak).toBe(0);
  });

  it('sanitizes and migrates user stashes gracefully from corrupt or old storage', () => {
    const raw = JSON.stringify({
      stashes: [{ id: 's1', title: 'Workplace Dharma', cardIds: ['bg-2-47'] }]
    });
    const sanitized = sanitizeUserData(raw);
    expect(sanitized.stashes.length).toBe(1);
    expect(sanitized.stashes[0].title).toBe('Workplace Dharma');
  });

  it('handles completely malformed json by returning defaults', () => {
    const malformed = 'INVALID_JSON_%%#$';
    const sanitized = sanitizeUserData(malformed);
    expect(sanitized.preferences.language).toBe('en');
    expect(sanitized.stashes.length).toBe(1);
  });
});
