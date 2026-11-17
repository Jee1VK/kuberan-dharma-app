import { LanguageCode } from '../types/scripture';
import { getAssetUrl } from '../utils/basePath';

export interface AudioPlaybackRequest {
  playerId: string;
  audioUrl?: string;
  shlokaText: string;
  language: LanguageCode;
  loopTarget: number;
  playbackSpeed: number;
}

export interface AudioControllerState {
  activePlayerId: string | null;
  isPlaying: boolean;
  currentChant: number;
  loopTarget: number;
  playbackSpeed: number;
}

type StateListener = (state: AudioControllerState) => void;

const SPEECH_LANG_MAP: Record<LanguageCode, string> = {
  sa: 'hi-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  en: 'en-IN',
};

/**
 * Singleton AudioController managing all shloka chanting and mantra repetition loops.
 *
 * Guarantees that only a single audio track or Web Speech synthesis utterance is
 * active at any time across the entire application. Starting playback on a new
 * DharmaCard automatically stops and unmounts any previously active track,
 * preventing overlapping audio bugs.
 */
class AudioController {
  private static instance: AudioController | null = null;

  private activePlayerId: string | null = null;
  private isPlaying = false;
  private currentChant = 1;
  private loopTarget = 1;
  private playbackSpeed = 1.0;

  private audioEl: HTMLAudioElement | null = null;
  private activeRequest: AudioPlaybackRequest | null = null;
  private listeners = new Set<StateListener>();

  private constructor() {}

  public static getInstance(): AudioController {
    if (!AudioController.instance) {
      AudioController.instance = new AudioController();
    }
    return AudioController.instance;
  }

  public getState(): AudioControllerState {
    return {
      activePlayerId: this.activePlayerId,
      isPlaying: this.isPlaying,
      currentChant: this.currentChant,
      loopTarget: this.loopTarget,
      playbackSpeed: this.playbackSpeed,
    };
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const snapshot = this.getState();
    this.listeners.forEach((listener) => listener(snapshot));
  }

  /**
   * Unmounts any active HTMLAudioElement and cancels Web Speech synthesis.
   */
  private cleanupMedia(): void {
    if (this.audioEl) {
      this.audioEl.onended = null;
      this.audioEl.onerror = null;
      try {
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
        this.audioEl.removeAttribute('src');
        this.audioEl.load();
      } catch {
        // Ignore cleanup errors in non-DOM/mocked environments
      }
      this.audioEl = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore speechSynthesis cancel errors
      }
    }
  }

  /**
   * Stops playback. If `onlyIfPlayerId` is provided, stops only when that
   * specific player currently owns the singleton controller.
   */
  public stop(onlyIfPlayerId?: string): void {
    if (onlyIfPlayerId && this.activePlayerId !== onlyIfPlayerId) {
      return;
    }

    this.cleanupMedia();
    this.activePlayerId = null;
    this.activeRequest = null;
    this.isPlaying = false;
    this.currentChant = 1;
    this.notify();
  }

  /**
   * Starts playback for a specific player, stopping & unmounting any prior track first.
   */
  public play(request: AudioPlaybackRequest): void {
    // Always tear down any existing track before starting a new one
    this.cleanupMedia();

    this.activePlayerId = request.playerId;
    this.activeRequest = request;
    this.isPlaying = true;
    this.currentChant = 1;
    this.loopTarget = request.loopTarget;
    this.playbackSpeed = request.playbackSpeed;
    this.notify();

    if (request.audioUrl && typeof Audio !== 'undefined') {
      const audio = new Audio(getAssetUrl(request.audioUrl));
      audio.playbackRate = this.playbackSpeed;
      this.audioEl = audio;

      audio.onended = () => {
        if (this.activePlayerId !== request.playerId) return;
        if (this.currentChant < this.loopTarget) {
          this.currentChant += 1;
          this.notify();
          audio.currentTime = 0;
          audio.play().catch(() => {
            this.stop(request.playerId);
          });
        } else {
          this.stop(request.playerId);
        }
      };

      audio.onerror = () => {
        if (this.activePlayerId !== request.playerId) return;
        this.cleanupMedia();
        this.startSpeechSynthesis(request, 1);
      };

      audio.play().catch(() => {
        if (this.activePlayerId !== request.playerId) return;
        this.cleanupMedia();
        this.startSpeechSynthesis(request, 1);
      });
    } else {
      this.startSpeechSynthesis(request, 1);
    }
  }

  public setPlaybackSpeed(playerId: string, speed: number): void {
    if (this.activePlayerId !== playerId) return;
    this.playbackSpeed = speed;
    if (this.audioEl) {
      this.audioEl.playbackRate = speed;
    }
    this.notify();
  }

  public setLoopTarget(playerId: string, target: number): void {
    if (this.activePlayerId !== playerId) return;
    this.loopTarget = target;
    this.notify();
  }

  private startSpeechSynthesis(request: AudioPlaybackRequest, chantIteration: number): void {
    if (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof window.SpeechSynthesisUtterance !== 'undefined'
    ) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }

      const utterance = new window.SpeechSynthesisUtterance(request.shlokaText);
      utterance.rate = this.playbackSpeed * 0.85;
      utterance.lang = SPEECH_LANG_MAP[request.language] || 'hi-IN';

      utterance.onend = () => {
        if (this.activePlayerId !== request.playerId) return;
        if (chantIteration < this.loopTarget) {
          this.currentChant = chantIteration + 1;
          this.notify();
          this.startSpeechSynthesis(request, chantIteration + 1);
        } else {
          this.stop(request.playerId);
        }
      };

      utterance.onerror = () => {
        if (this.activePlayerId === request.playerId) {
          this.stop(request.playerId);
        }
      };

      window.speechSynthesis.speak(utterance);
    } else {
      this.stop(request.playerId);
    }
  }
}

export const audioController = AudioController.getInstance();
