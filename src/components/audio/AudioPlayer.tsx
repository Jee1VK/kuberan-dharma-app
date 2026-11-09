'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, FastForward, Repeat } from 'lucide-react';
import { LanguageCode } from '../../lib/types/scripture';
import { getAssetUrl } from '../../lib/utils/basePath';

interface AudioPlayerProps {
  audioUrl?: string;
  shlokaText: string;
  language: LanguageCode;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, shlokaText, language }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [loopTarget, setLoopTarget] = useState<number>(1);
  const [currentChant, setCurrentChant] = useState<number>(1);
  const [useSpeechFallback, setUseSpeechFallback] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const loopOptions = [1, 3, 11, 108];
  const speedOptions = [0.8, 1.0, 1.25];

  useEffect(() => {
    if (!audioUrl) {
      setUseSpeechFallback(true);
    } else {
      setUseSpeechFallback(false);
    }
    stopPlayback();
  }, [audioUrl, shlokaText]);

  const stopPlayback = () => {
    setIsPlaying(false);
    setCurrentChant(1);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleAudioEnded = () => {
    if (currentChant < loopTarget) {
      setCurrentChant((prev) => prev + 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      setIsPlaying(false);
      setCurrentChant(1);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    setIsPlaying(true);
    setCurrentChant(1);

    if (audioUrl && !useSpeechFallback) {
      if (!audioRef.current) {
        audioRef.current = new Audio(getAssetUrl(audioUrl));
        audioRef.current.onended = handleAudioEnded;
        audioRef.current.onerror = () => {
          setUseSpeechFallback(true);
          startSpeechSynthesis(1);
        };
      }
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch(() => {
        setUseSpeechFallback(true);
        startSpeechSynthesis(1);
      });
    } else {
      startSpeechSynthesis(1);
    }
  };

  const startSpeechSynthesis = (chantIteration: number) => {
    if (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof window.SpeechSynthesisUtterance !== 'undefined'
    ) {
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(shlokaText);
      utterance.rate = playbackSpeed * 0.85;

      const langMap: Record<LanguageCode, string> = {
        sa: 'hi-IN',
        hi: 'hi-IN',
        kn: 'kn-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        en: 'en-IN',
      };
      utterance.lang = langMap[language] || 'hi-IN';

      utterance.onend = () => {
        if (chantIteration < loopTarget) {
          setCurrentChant(chantIteration + 1);
          startSpeechSynthesis(chantIteration + 1);
        } else {
          setIsPlaying(false);
          setCurrentChant(1);
        }
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(false);
    }
  };

  const cycleSpeed = () => {
    const nextIdx = (speedOptions.indexOf(playbackSpeed) + 1) % speedOptions.length;
    const newSpeed = speedOptions[nextIdx];
    setPlaybackSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl bg-stitch-ivory/80 border border-stitch-sand/80 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* Play / Pause Primary Button */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause Shloka Chanting' : 'Listen to Sacred Shloka Chanting'}
            className={`min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm ${
              isPlaying
                ? 'bg-amber-600 text-white ring-2 ring-amber-400/40'
                : 'bg-stitch-maroon text-stitch-ivory hover:bg-stitch-maroonHover border border-stitch-gold/40'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-stitch-gold" />
                <span>Shloka Chanting</span>
              </>
            )}
          </button>

          {/* Reset button if playing */}
          {isPlaying && (
            <button
              type="button"
              onClick={stopPlayback}
              aria-label="Restart Chanting"
              className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-stitch-stone hover:text-stitch-slate hover:bg-stitch-parchment transition-all flex items-center justify-center cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Live Japa Chant Counter Pill */}
          {isPlaying && loopTarget > 1 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stitch-gold/20 border border-stitch-gold/50 text-stitch-maroon font-mono text-xs font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-stitch-maroon animate-ping" />
              <span>
                Chant {currentChant} of {loopTarget}
              </span>
            </div>
          )}
        </div>

        {/* Playback Controls: Speed & Sacred Repetition (Japa) */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Speed Pill */}
          <button
            type="button"
            onClick={cycleSpeed}
            title="Adjust chanting speed"
            aria-label="Adjust speed"
            className="min-h-[36px] px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-stitch-parchment border border-stitch-sand hover:border-stitch-gold text-stitch-slate transition-all cursor-pointer flex items-center gap-1"
          >
            <FastForward className="w-3 h-3 text-stitch-deepGold" />
            <span>speed {playbackSpeed}x</span>
          </button>

          {/* Japa Loop Repetition Selector */}
          <div
            className="flex items-center gap-1 bg-stitch-parchment p-0.5 rounded-lg border border-stitch-sand"
            title="Repeat count (Japa)"
            aria-label="Repeat count"
          >
            <span className="text-[10px] uppercase font-bold text-stitch-stone px-1.5 hidden sm:inline flex items-center gap-1">
              <Repeat className="w-3 h-3" />
              <span>Repeat count:</span>
            </span>
            {loopOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setLoopTarget(opt);
                  if (!isPlaying) setCurrentChant(1);
                }}
                className={`min-h-[32px] px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  loopTarget === opt
                    ? 'bg-stitch-maroon text-stitch-ivory shadow-xs'
                    : 'text-stitch-stone hover:text-stitch-slate'
                }`}
              >
                {opt}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
