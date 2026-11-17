import { describe, it, expect, beforeEach, vi } from 'vitest';
import { audioController } from '@/lib/audio/audioController';

describe('Singleton AudioController Lifecycle', () => {
  beforeEach(() => {
    audioController.stop();
  });

  it('stops active track and switches cleanly when a second player initiates playback', () => {
    // Mock window.speechSynthesis so play() can stay active in Node/jsdom
    const speakMock = vi.fn();
    const cancelMock = vi.fn();
    vi.stubGlobal('window', {
      speechSynthesis: {
        speak: speakMock,
        cancel: cancelMock,
      },
      SpeechSynthesisUtterance: function MockUtterance(this: any, text: string) {
        this.text = text;
        this.rate = 1;
        this.lang = 'hi-IN';
      },
    });

    audioController.play({
      playerId: 'card-1',
      shlokaText: 'कर्मण्येवाधिकारस्ते',
      language: 'sa',
      loopTarget: 3,
      playbackSpeed: 1.0,
    });

    expect(audioController.getState().isPlaying).toBe(true);
    expect(audioController.getState().activePlayerId).toBe('card-1');

    // Start second player -> must cancel/stop first player before starting second
    audioController.play({
      playerId: 'card-2',
      shlokaText: 'योगस्थः कुरु कर्माणि',
      language: 'sa',
      loopTarget: 1,
      playbackSpeed: 1.0,
    });

    expect(cancelMock).toHaveBeenCalled();
    expect(audioController.getState().isPlaying).toBe(true);
    expect(audioController.getState().activePlayerId).toBe('card-2');

    // Stopping an inactive playerId must NOT interrupt the active player
    audioController.stop('card-1');
    expect(audioController.getState().isPlaying).toBe(true);
    expect(audioController.getState().activePlayerId).toBe('card-2');

    // Stopping the active playerId stops playback cleanly
    audioController.stop('card-2');
    expect(audioController.getState().isPlaying).toBe(false);
    expect(audioController.getState().activePlayerId).toBeNull();

    vi.unstubAllGlobals();
  });
});
