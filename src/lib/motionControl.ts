import { useState, useEffect } from 'react';
import { gsap } from './gsap';
import { soundFx } from './sound';

const STORAGE_KEY = 'parvej_portfolio_motion_paused';

let currentMotionPaused = false;
const listeners = new Set<(paused: boolean) => void>();

// Initialize state from storage if available
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      currentMotionPaused = saved === 'true';
      if (currentMotionPaused) {
        document.documentElement.classList.add('motion-paused');
        // Set minimal timescale so animations complete instantly without lockups
        gsap.globalTimeline.timeScale(0);
      }
    }
  } catch (e) {
    console.warn('Could not read motion control preference', e);
  }
}

export const motionControl = {
  isPaused(): boolean {
    return currentMotionPaused;
  },

  setPaused(paused: boolean, playAudioFeedback: boolean = true): void {
    currentMotionPaused = paused;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, String(paused));
        if (paused) {
          document.documentElement.classList.add('motion-paused');
          gsap.globalTimeline.timeScale(0);
        } else {
          document.documentElement.classList.remove('motion-paused');
          gsap.globalTimeline.timeScale(1);
        }
      } catch (e) {
        console.warn('Could not save motion control preference', e);
      }
    }

    if (playAudioFeedback) {
      soundFx.playToggle(!paused);
    }

    listeners.forEach((listener) => listener(paused));
  },

  toggle(playAudioFeedback: boolean = true): boolean {
    const next = !currentMotionPaused;
    this.setPaused(next, playAudioFeedback);
    return next;
  },

  subscribe(listener: (paused: boolean) => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useMotionControl() {
  const [isPaused, setIsPaused] = useState(motionControl.isPaused());

  useEffect(() => {
    setIsPaused(motionControl.isPaused());
    const unsubscribe = motionControl.subscribe((paused) => {
      setIsPaused(paused);
    });
    return unsubscribe;
  }, []);

  const toggle = () => {
    const next = motionControl.toggle();
    setIsPaused(next);
    return next;
  };

  const setPaused = (val: boolean) => {
    motionControl.setPaused(val);
    setIsPaused(val);
  };

  return { isPaused, toggle, setPaused };
}
