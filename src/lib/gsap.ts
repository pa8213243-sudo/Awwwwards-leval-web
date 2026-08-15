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

// Configure standard GSAP lag smoothing to eliminate stutter during long frames
gsap.ticker.lagSmoothing(500, 33);

export { gsap, ScrollTrigger, Flip };

/**
 * Accurately detects mobile / tablet touch-screen viewports
 */
export const isTouchMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  const isSmallScreen = window.innerWidth <= 768;
  const isTouchScreen = ('ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)) && window.innerWidth <= 1024;
  return isSmallScreen || isTouchScreen;
};

/**
 * Diagnostic utility within the ScrollTrigger controller (lightweight, zero lag)
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

export function logMobileScrollTriggerDiagnostics(
  self: globalThis.ScrollTrigger,
  sectionId: string,
  eventType: 'ENTER' | 'LEAVE' | 'ENTER_BACK' | 'LEAVE_BACK' | 'UPDATE' | 'REFRESH',
  pinState: 'PIN_ENGAGED' | 'PIN_RELEASED' | 'INERTIA_BYPASS_MOBILE' | 'UNPINNED'
): void {
  // Silent in production to preserve 60-120fps performance
}

/**
 * Creates an active viewport clamping trigger for major architectural sections.
 * On desktop: Locks the main scroll position (active pinning) to execute internal timeline sequences.
 * On mobile: Prioritizes fluid touch scrolling, keeping all visual milestones and internal animations functional.
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
    : (typeof window !== 'undefined' ? Math.max(window.innerHeight * 1.2, 700) : 700);

  return ScrollTrigger.create({
    trigger: sectionElement,
    start: isTouch ? 'top 85%' : (effectivePin ? 'top top' : 'top 75%'),
    end: effectivePin 
      ? (typeof calculatedPinDistance === 'number' ? `+=${calculatedPinDistance}` : calculatedPinDistance)
      : (isTouch ? 'bottom 15%' : 'bottom 25%'),
    pin: effectivePin,
    pinSpacing: effectivePin,
    anticipatePin: effectivePin ? 1 : 0,
    pinType: isTouch ? 'transform' : 'fixed',
    scrub: isTouch ? 0.2 : 0.35,
    fastScrollEnd: true,
    invalidateOnRefresh: true,
    onEnter: () => {
      options?.onProgress?.(0);
    },
    onLeave: () => {
      options?.onComplete?.();
    },
    onUpdate: (self) => {
      options?.onProgress?.(self.progress);

      // Precise Milestones at 25%, 50%, 75%, 100%
      const currentMilestone = Math.min(4, Math.floor(self.progress * 4));
      if (currentMilestone !== lastMilestone && currentMilestone >= 0 && currentMilestone <= 4) {
        lastMilestone = currentMilestone;
        options?.onMilestone?.(currentMilestone);
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
  if (isTouchMobileDevice()) return () => {};

  const maxOffset = config?.maxOffset || 14;
  const zoomScale = config?.zoomScale || 1.1;

  const xTo = gsap.quickTo(target, 'x', { duration: 0.35, ease: 'power2.out' });
  const yTo = gsap.quickTo(target, 'y', { duration: 0.35, ease: 'power2.out' });
  const scaleTo = gsap.quickTo(target, 'scale', { duration: 0.35, ease: 'power2.out' });

  let isHovering = false;

  const onMouseMove = (e: MouseEvent) => {
    if (!isHovering) return;
    const rect = container.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;

    xTo(normX * maxOffset * 2);
    yTo(normY * maxOffset * 2);
  };

  const onMouseEnter = () => {
    isHovering = true;
    scaleTo(zoomScale);
    soundFx.playHover();
  };

  const onMouseLeave = () => {
    isHovering = false;
    xTo(0);
    yTo(0);
    scaleTo(1.0);
  };

  container.addEventListener('mousemove', onMouseMove, { passive: true });
  container.addEventListener('mouseenter', onMouseEnter, { passive: true });
  container.addEventListener('mouseleave', onMouseLeave, { passive: true });

  return () => {
    container.removeEventListener('mousemove', onMouseMove);
    container.removeEventListener('mouseenter', onMouseEnter);
    container.removeEventListener('mouseleave', onMouseLeave);
  };
}

/**
 * Standardized GSAP Magazine-Reveal Entrance Animation
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
        y: options?.yOffset ?? 35,
        scale: 0.98,
        transformOrigin: '50% 100%',
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: options?.duration ?? 0.75,
        delay: options?.delay ?? 0,
        stagger: options?.stagger ?? 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: options?.trigger || el,
          start: options?.start || 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  return () => ctx.revert();
}

/**
 * Initializes ultra-smooth inertia scrolling via Lenis with optimized tick sync
 */
export function initSmoothScroll(): Lenis {
  const isTouch = isTouchMobileDevice();

  const lenis = new Lenis({
    duration: isTouch ? 0.9 : 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.2,
    infinite: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(500, 33);

  return lenis;
}

