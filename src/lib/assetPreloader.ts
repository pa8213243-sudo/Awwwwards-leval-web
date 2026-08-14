/**
 * Architectural Asset Pre-caching & Predictive Loading Engine
 * Uses IntersectionObserver + Priority Pre-caching to prioritize media loading
 * for the *next* upcoming section, ensuring images and videos are buffered
 * before the user reaches the trigger threshold.
 */

export type AssetLoadState = 'idle' | 'intersecting' | 'caching' | 'loaded' | 'error';
type AssetCacheCallback = (loaded: boolean, progress: number, state?: AssetLoadState) => void;

interface MediaSource {
  image?: string;
  video?: string;
}

interface StaggerQueueItem {
  element: HTMLElement;
  mediaSrc: MediaSource;
  onProgress?: AssetCacheCallback;
  delayMs: number;
}

const SECTION_ORDER = [
  'home',
  'chapters',
  'work',
  'sandbox',
  'pricing',
  'dashboards',
  'about',
  'experience',
  'skills',
  'certs',
  'process',
  'contact',
];

class AssetPreloader {
  private cachedImages = new Set<string>();
  private cachedVideos = new Set<string>();
  private activeObservers = new Map<Element, IntersectionObserver>();
  private sectionAssetRegistry = new Map<string, MediaSource[]>();
  private preloadedSections = new Set<string>();
  private staggerQueue: StaggerQueueItem[] = [];
  private isProcessingQueue = false;
  private queueIndex = 0;

  /**
   * Register assets belonging to a section for predictive pre-caching
   */
  public registerSectionAssets(sectionId: string, assets: MediaSource[]): void {
    const existing = this.sectionAssetRegistry.get(sectionId) || [];
    this.sectionAssetRegistry.set(sectionId, [...existing, ...assets]);
  }

  /**
   * Predictively pre-cache media for the NEXT TWO upcoming sections
   * using a low-priority 'idle-state' prefetcher (requestIdleCallback).
   * Caches assets from currentIndex + 1 AND currentIndex + 2 ahead of time.
   */
  public preloadUpcomingSection(currentSectionId: string): void {
    const currentIndex = SECTION_ORDER.indexOf(currentSectionId);
    if (currentIndex === -1) return;

    // Prioritize next two sections ahead
    const nextSectionIds = [
      SECTION_ORDER[currentIndex + 1],
      SECTION_ORDER[currentIndex + 2],
    ].filter(Boolean);

    const scheduleIdlePrefetch = (fn: () => void) => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number })
          .requestIdleCallback(fn, { timeout: 2500 });
      } else {
        setTimeout(fn, 100);
      }
    };

    scheduleIdlePrefetch(() => {
      nextSectionIds.forEach((nextId) => {
        if (this.preloadedSections.has(nextId)) return;
        this.preloadedSections.add(nextId);

        const assets = this.sectionAssetRegistry.get(nextId) || [];
        assets.forEach((asset, idx) => {
          setTimeout(() => {
            if (asset.image) this.preloadImage(asset.image);
            if (asset.video) this.preloadVideo(asset.video);
          }, idx * 40); // 40ms stagger to prevent thread blocking
        });
      });
    });
  }

  /**
   * Preload an image asset using native Image() buffer with async decoding pipeline
   */
  public preloadImage(src: string): Promise<boolean> {
    if (!src) return Promise.resolve(false);
    if (this.cachedImages.has(src)) {
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;

      const handleSuccess = () => {
        if ('decode' in img) {
          img.decode().then(() => {
            this.cachedImages.add(src);
            resolve(true);
          }).catch(() => {
            this.cachedImages.add(src);
            resolve(true);
          });
        } else {
          this.cachedImages.add(src);
          resolve(true);
        }
      };

      img.onload = handleSuccess;
      img.onerror = () => {
        resolve(false);
      };
    });
  }

  /**
   * Preload a video asset by creating a memory-buffered video pipeline
   */
  public preloadVideo(src: string): Promise<boolean> {
    if (!src) return Promise.resolve(false);
    if (this.cachedVideos.has(src)) {
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.src = src;
      video.muted = true;
      video.playsInline = true;

      const handleCanPlay = () => {
        this.cachedVideos.add(src);
        cleanup();
        resolve(true);
      };

      const handleError = () => {
        cleanup();
        resolve(false);
      };

      const cleanup = () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('loadeddata', handleCanPlay);
        video.removeEventListener('error', handleError);
      };

      video.addEventListener('canplay', handleCanPlay, { once: true });
      video.addEventListener('loadeddata', handleCanPlay, { once: true });
      video.addEventListener('error', handleError, { once: true });
      video.load();
    });
  }

  /**
   * Staggered media pre-loader using the Intersection Observer API.
   * Explicitly manages 'idle' | 'intersecting' | 'caching' | 'loaded' states
   * with smooth staggered buffer resolution.
   */
  public observeMediaElement(
    element: HTMLElement,
    mediaSrc: MediaSource,
    onProgress?: AssetCacheCallback
  ): () => void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      if (mediaSrc.image) this.preloadImage(mediaSrc.image);
      if (mediaSrc.video) this.preloadVideo(mediaSrc.video);
      onProgress?.(true, 100, 'loaded');
      return () => {};
    }

    // If already fully cached in memory, signal loaded immediately
    const imgCached = !mediaSrc.image || this.cachedImages.has(mediaSrc.image);
    const vidCached = !mediaSrc.video || this.cachedVideos.has(mediaSrc.video);
    if (imgCached && vidCached) {
      onProgress?.(true, 100, 'loaded');
      return () => {};
    }

    onProgress?.(false, 15, 'idle');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onProgress?.(false, 40, 'intersecting');
            
            // Stagger load execution
            this.queueIndex++;
            const staggerDelay = (this.queueIndex % 6) * 50; // 0-250ms stagger window

            setTimeout(() => {
              onProgress?.(false, 65, 'caching');
              const promises: Promise<boolean>[] = [];

              if (mediaSrc.image) {
                promises.push(this.preloadImage(mediaSrc.image));
              }
              if (mediaSrc.video) {
                promises.push(this.preloadVideo(mediaSrc.video));
              }

              Promise.all(promises).then((results) => {
                const allSucceeded = results.every(Boolean);
                onProgress?.(true, 100, allSucceeded ? 'loaded' : 'error');
              });
            }, staggerDelay);

            observer.unobserve(element);
          }
        });
      },
      {
        root: null,
        rootMargin: '850px 0px 850px 0px', // Expansive 850px lookahead
        threshold: 0.01,
      }
    );

    observer.observe(element);
    this.activeObservers.set(element, observer);

    return () => {
      observer.unobserve(element);
      this.activeObservers.delete(element);
    };
  }

  public isCached(src: string): boolean {
    return this.cachedImages.has(src) || this.cachedVideos.has(src);
  }
}

export const assetPreloader = new AssetPreloader();
