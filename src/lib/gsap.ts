import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';
import { soundFx } from './sound';

gsap.registerPlugin(ScrollTrigger, Flip);

// Ignore transient browser URL bar resize fluctuations on mobile to prevent pin breaking
ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
});

export { gsap, ScrollTrigger, Flip };

/**
 * Detects touch-screen mobile devices to prioritize standard fluid inertia scrolling
 */
export const isTouchMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    window.innerWidth <= 768 ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );
};

/**
 * Diagnostic utility within the ScrollTrigger controller that logs the scroll state
 * and lock status specifically when a user enters the mobile viewport, helping isolate
 * why the pin duration logic is failing to release on smaller screens.
 */
export interface MobileScrollTriggerDiagnosticLog {
  timestamp: number;
  sectionId: string;
  eventType: 'ENTER' | 'LEAVE' | 'ENTER_BACK' | 'LEAVE_BACK' | 'UPDATE' | 'REFRESH';
  scrollY: number;
  viewportHeight: number;
  triggerStart: number;
  triggerEnd: number;
  progress: number;
  isTouchDevice: boolean;
  pinLockStatus: 'PIN_ENGAGED' | 'PIN_RELEASED' | 'INERTIA_BYPASS_MOBILE' | 'UNPINNED';
  pinDurationPx: number;
}

declare global {
  interface Window {
    __SCROLLTRIGGER_MOBILE_LOGS__?: MobileScrollTriggerDiagnosticLog[];
  }
}

export function logMobileScrollTriggerDiagnostics(
  self: globalThis.ScrollTrigger,
  sectionId: string,
  eventType: 'ENTER' | 'LEAVE' | 'ENTER_BACK' | 'LEAVE_BACK' | 'UPDATE' | 'REFRESH',
  pinState: 'PIN_ENGAGED' | 'PIN_RELEASED' | 'INERTIA_BYPASS_MOBILE' | 'UNPINNED'
): void {
  if (typeof window === 'undefined') return;

  const isTouch = isTouchMobileDevice();
  const logEntry: MobileScrollTriggerDiagnosticLog = {
    timestamp: Date.now(),
    sectionId,
    eventType,
    scrollY: window.scrollY || window.pageYOffset || 0,
    viewportHeight: window.innerHeight,
    triggerStart: self.start,
    triggerEnd: self.end,
    progress: Number(self.progress.toFixed(4)),
    isTouchDevice: isTouch,
    pinLockStatus: pinState,
    pinDurationPx: Math.max(0, self.end - self.start),
  };

  if (!window.__SCROLLTRIGGER_MOBILE_LOGS__) {
    window.__SCROLLTRIGGER_MOBILE_LOGS__ = [];
  }
  window.__SCROLLTRIGGER_MOBILE_LOGS__.push(logEntry);
  if (window.__SCROLLTRIGGER_MOBILE_LOGS__.length > 50) {
    window.__SCROLLTRIGGER_MOBILE_LOGS__.shift();
  }

  // Specifically log diagnostics when on mobile viewport for telemetry and debugging
  if (isTouch && (eventType !== 'UPDATE' || (self.progress === 0 || self.progress === 1 || Math.abs(self.progress - 0.5) < 0.05))) {
    console.debug(
      `[Mobile ScrollTrigger Diagnostic] [${sectionId}] [${eventType}] Status: ${pinState} | Progress: ${(self.progress * 100).toFixed(1)}% | Pin Span: ${logEntry.pinDurationPx}px | ScrollY: ${logEntry.scrollY}px / ViewportH: ${logEntry.viewportHeight}px`
    );
  }
}

/**
 * Creates an active viewport clamping trigger for major architectural sections.
 * On desktop: Locks the main scroll position (active pinning) to execute internal timeline sequences.
 * On mobile: Detects touch events and prioritizes standard fluid inertia scrolling, preventing
 * viewport lock conflicts while keeping the vertical progress bar and internal animations fully functional.
 */
export function setupSectionViewportClamping(
  sectionElement: HTMLElement,
  options?: {
    pinDistance?: number | string;
    shouldPin?: boolean;
    forcePinOnMobile?: boolean;
    onProgress?: (progress: number) => void;
    onMilestone?: (milestone: number) => void;
    onComplete?: () => void;
  }
) {
  let lastMilestone = -1;
  const isTouch = isTouchMobileDevice();
  const sectionId = sectionElement.id || 'sec';
  
  // On mobile touch, prioritize standard inertia scrolling unless explicitly forced
  const pinAllowed = options?.shouldPin !== undefined ? options.shouldPin : true;
  const effectivePin = isTouch ? (options?.forcePinOnMobile ?? false) : pinAllowed;

  // Dynamic pin distance calculation for desktop
  const calculatedPinDistance = options?.pinDistance !== undefined 
    ? options.pinDistance 
    : (typeof window !== 'undefined' ? Math.max(window.innerHeight * 1.25, 750) : 750);

  const initialStatus = effectivePin ? 'PIN_ENGAGED' : (isTouch ? 'INERTIA_BYPASS_MOBILE' : 'UNPINNED');

  return ScrollTrigger.create({
    trigger: sectionElement,
    start: isTouch ? 'top 85%' : 'top 50%',
    end: effectivePin 
      ? (typeof calculatedPinDistance === 'number' ? `+=${calculatedPinDistance}` : calculatedPinDistance)
      : (isTouch ? 'bottom 15%' : `+=${calculatedPinDistance}`),
    pin: effectivePin,
    pinSpacing: effectivePin,
    anticipatePin: effectivePin ? 1 : 0,
    pinType: isTouch ? 'transform' : 'fixed',
    scrub: isTouch ? 0.25 : 0.6,
    invalidateOnRefresh: true,
    onEnter: (self) => {
      soundFx.playUiHum(130, 0.4);
      soundFx.playScrollClick();
      logMobileScrollTriggerDiagnostics(self, sectionId, 'ENTER', effectivePin ? 'PIN_ENGAGED' : 'INERTIA_BYPASS_MOBILE');
    },
    onLeave: (self) => {
      soundFx.playScrollClick();
      logMobileScrollTriggerDiagnostics(self, sectionId, 'LEAVE', 'PIN_RELEASED');
      options?.onComplete?.();
    },
    onEnterBack: (self) => {
      logMobileScrollTriggerDiagnostics(self, sectionId, 'ENTER_BACK', effectivePin ? 'PIN_ENGAGED' : 'INERTIA_BYPASS_MOBILE');
    },
    onLeaveBack: (self) => {
      logMobileScrollTriggerDiagnostics(self, sectionId, 'LEAVE_BACK', 'PIN_RELEASED');
    },
    onUpdate: (self) => {
      options?.onProgress?.(self.progress);

      // Track mobile diagnostics
      if (isTouch) {
        const lockState = self.progress >= 1 || self.progress <= 0 ? 'PIN_RELEASED' : (effectivePin ? 'PIN_ENGAGED' : 'INERTIA_BYPASS_MOBILE');
        logMobileScrollTriggerDiagnostics(self, sectionId, 'UPDATE', lockState);
      }

      // Precise Milestones at 25%, 50%, 75%, 100% debounced per section
      const currentMilestone = Math.min(4, Math.floor(self.progress * 4));
      if (currentMilestone !== lastMilestone && currentMilestone >= 0 && currentMilestone <= 4) {
        lastMilestone = currentMilestone;
        options?.onMilestone?.(currentMilestone);
        soundFx.triggerSectionMilestone(sectionId, currentMilestone, 400 + currentMilestone * 75);
      }
    },
  });
}

/**
 * Attaches a tactile GSAP mouse-following parallax listener to an element
 */
export function attachMouseParallax(
  container: HTMLElement,
  target: HTMLElement,
  config?: { maxOffset?: number; zoomScale?: number }
): () => void {
  const maxOffset = config?.maxOffset || 16;
  const zoomScale = config?.zoomScale || 1.12;

  const xTo = gsap.quickTo(target, 'x', { duration: 0.4, ease: 'power3.out' });
  const yTo = gsap.quickTo(target, 'y', { duration: 0.4, ease: 'power3.out' });
  const scaleTo = gsap.quickTo(target, 'scale', { duration: 0.4, ease: 'power3.out' });

  const onMouseMove = (e: MouseEvent) => {
    const rect = container.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;

    xTo(normX * maxOffset * 2);
    yTo(normY * maxOffset * 2);
  };

  const onMouseEnter = () => {
    scaleTo(zoomScale);
    soundFx.playHover();
  };

  const onMouseLeave = () => {
    xTo(0);
    yTo(0);
    scaleTo(1.0);
  };

  container.addEventListener('mousemove', onMouseMove);
  container.addEventListener('mouseenter', onMouseEnter);
  container.addEventListener('mouseleave', onMouseLeave);

  return () => {
    container.removeEventListener('mousemove', onMouseMove);
    container.removeEventListener('mouseenter', onMouseEnter);
    container.removeEventListener('mouseleave', onMouseLeave);
  };
}

/**
 * Standardized GSAP Magazine-Reveal Entrance Animation
 * Reveals elements from the bottom with vertical translation, opacity transition, and subtle perspective
 * while preserving layout grids, spacing, and vertical progress bars.
 */
export function initMagazineReveal(
  target: HTMLElement | string,
  options?: {
    delay?: number;
    duration?: number;
    stagger?: number;
    yOffset?: number;
    trigger?: HTMLElement | string;
    start?: string;
  }
): () => void {
  const el = typeof target === 'string' ? document.querySelectorAll(target) : target;
  if (!el) return () => {};

  const ctx = gsap.context(() => {
    gsap.fromTo(
      el,
      {
        opacity: 0,
        y: options?.yOffset ?? 45,
        scale: 0.98,
        transformOrigin: '50% 100%',
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: options?.duration ?? 0.85,
        delay: options?.delay ?? 0,
        stagger: options?.stagger ?? 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: options?.trigger || el,
          start: options?.start || 'top 88%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  return () => ctx.revert();
}

export function initSmoothScroll(): Lenis {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}
