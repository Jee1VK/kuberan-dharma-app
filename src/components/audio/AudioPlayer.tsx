'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, FastForward } from 'lucide-react';
import { LanguageCode } from '../../lib/types/scripture';

interface AudioPlayerProps {
  audioUrl?: string;
  shlokaText: string;
  language: LanguageCode;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, shlokaText, language }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [loopCount, setLoopCount] = useState<number>(1);
  const [loopsRemaining, setLoopsRemaining] = useState<number>(1);
  const [useSpeechFallback, setUseSpeechFallback] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioUrl) {
      setUseSpeechFallback(true);
    } else {
      setUseSpeechFallback(false);
    }
    // Stop any ongoing playback when shloka changes
    stopPlayback();
  }, [audioUrl, shlokaText]);

  const stopPlayback = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleAudioEnded = () => {
    if (loopsRemaining > 1) {
      setLoopsRemaining(prev => prev - 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      setIsPlaying(false);
      setLoopsRemaining(loopCount);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    setIsPlaying(true);
    setLoopsRemaining(loopCount);

    if (audioUrl && !useSpeechFallback) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = handleAudioEnded;
        audioRef.current.onerror = () => {
          // If static audio file fails, fallback gracefully to TTS
          setUseSpeechFallback(true);
          startSpeechSynthesis();
        };
      }
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch(() => {
        setUseSpeechFallback(true);
        startSpeechSynthesis();
      });
    } else {
      startSpeechSynthesis();
    }
  };

  const startSpeechSynthesis = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance !== 'undefined') {
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
        if (loopsRemaining > 1) {
          setLoopsRemaining(prev => prev - 1);
          startSpeechSynthesis();
        } else {
          setIsPlaying(false);
          setLoopsRemaining(loopCount);
        }
      };

      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(false);
    }
  };

  const toggleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleLoop = () => {
    const loops = [1, 3, 9, 21, 108];
    const nextIdx = (loops.indexOf(loopCount) + 1) % loops.length;
    const nextLoop = loops[nextIdx];
    setLoopCount(nextLoop);
    setLoopsRemaining(nextLoop);
  };

  return (
    <div className="flex items-center justify-between gap-3 bg-stitch-parchment px-4 py-2.5 rounded-xl border border-stitch-sand/80 shadow-sm">
      {/* Play/Pause Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause recitation' : (useSpeechFallback ? 'Speak recitation' : 'Play recitation')}
          className="w-10 h-10 rounded-full bg-stitch-maroon hover:bg-stitch-maroonHover text-stitch-ivory flex items-center justify-center transition-transform active:scale-95 shadow"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        <div className="flex flex-col">
          <span className="text-xs font-semibold text-stitch-slate flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-stitch-deepGold" />
            {useSpeechFallback ? 'Pronunciation Audio' : 'Shloka Chanting'}
          </span>
          <span className="text-[11px] text-stitch-stone">
            {isPlaying ? (
              <span className="text-stitch-maroon font-medium animate-pulse">
                Chanting... {loopCount > 1 ? `(Round ${loopCount - loopsRemaining + 1}/${loopCount})` : ''}
              </span>
            ) : (
              'Tap to listen'
            )}
          </span>
        </div>
      </div>

      {/* Speed and Loop Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSpeed}
          title="Toggle recitation speed"
          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-stitch-ivory text-stitch-slate border border-stitch-sand hover:border-stitch-gold transition-colors flex items-center gap-1"
        >
          <FastForward className="w-3 h-3 text-stitch-stone" />
          <span>{playbackSpeed}x speed</span>
        </button>

        <button
          type="button"
          onClick={toggleLoop}
          title="Repeat count for memorization / Japa"
          className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1 ${
            loopCount > 1
              ? 'bg-stitch-maroon text-stitch-ivory border-stitch-maroon'
              : 'bg-stitch-ivory text-stitch-slate border-stitch-sand hover:border-stitch-gold'
          }`}
        >
          <RotateCcw className="w-3 h-3" />
          <span>{loopCount}x</span>
        </button>
      </div>
    </div>
  );
};
