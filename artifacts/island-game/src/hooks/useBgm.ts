import { useEffect, useRef, useState } from 'react';

const MUTE_KEY = 'paradise-bgm-muted';

/**
 * Background music hook.
 * - Starts playing on the first user interaction (browser autoplay policy).
 * - Loops the track infinitely at 40% volume.
 * - Persists mute preference to localStorage.
 */
export function useBgm(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState<boolean>(() => {
    try { return localStorage.getItem(MUTE_KEY) === '1'; } catch { return false; }
  });
  const startedRef = useRef(false);

  // Create the audio element once
  useEffect(() => {
    const audio = new Audio(src);
    audio.loop   = true;
    audio.volume = 0.40;
    audio.muted  = muted;
    audioRef.current = audio;

    // Try autoplay immediately; browser may block until interaction
    audio.play().then(() => { startedRef.current = true; }).catch(() => {});

    // Fallback: start on first user gesture if autoplay was blocked
    const unlock = () => {
      if (!startedRef.current && audioRef.current) {
        audioRef.current.play().then(() => { startedRef.current = true; }).catch(() => {});
      }
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('pointerdown', unlock);
    document.addEventListener('keydown', unlock);

    return () => {
      audio.pause();
      audio.src = '';
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('keydown', unlock);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Sync mute state → audio element + localStorage
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
    try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch { /* noop */ }
  }, [muted]);

  const toggle = () => setMuted(m => !m);

  return { muted, toggle };
}
