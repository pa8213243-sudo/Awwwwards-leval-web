import React, { useState, useEffect, useRef } from 'react';
import { assetPreloader, AssetLoadState } from '../lib/assetPreloader';
import { EditorialSkeleton } from './EditorialSkeleton';

export interface LazyRenderMediaProps {
  src?: string;
  videoSrc?: string;
  posterSrc?: string;
  alt?: string;
  aspectRatio?: string;
  className?: string;
  mediaClassName?: string;
  accentColor?: string;
  pillTag?: string;
  blurColor?: string;
  thresholdMargin?: string;
  autoPlayVideo?: boolean;
  loopVideo?: boolean;
  mutedVideo?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

/**
 * High-Performance Dynamic Lazy-Render Buffer:
 * 1. ZERO layout shifts (CLS = 0) with strict aspect-ratio containment.
 * 2. Only mounts high-resolution <img> / <video> elements when container enters
 *    near-proximity viewport threshold (e.g. 300px lookahead).
 * 3. Renders a low-fidelity blurred placeholder (LQIP) with architectural gridlines
 *    and cross-fades into decoded media smoothly.
 */
export const LazyRenderMedia: React.FC<LazyRenderMediaProps> = ({
  src,
  videoSrc,
  posterSrc,
  alt = 'Visual asset',
  aspectRatio = 'aspect-[16/10]',
  className = '',
  mediaClassName = '',
  accentColor = '#E0533C',
  pillTag,
  blurColor = 'rgba(20, 20, 28, 0.95)',
  thresholdMargin = '300px 0px 300px 0px',
  autoPlayVideo = true,
  loopVideo = true,
  mutedVideo = true,
  onClick,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Viewport proximity & mount state
  const [isNearProximity, setIsNearProximity] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadState, setLoadState] = useState<AssetLoadState>('idle');
  const [loadProgress, setLoadProgress] = useState(20);
  const [hasError, setHasError] = useState(false);

  // Near-proximity viewport detection (Lazy Render Gate)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if media is already pre-cached in memory
    const isImageCached = src ? assetPreloader.isCached(src) : true;
    const isVideoCached = videoSrc ? assetPreloader.isCached(videoSrc) : true;

    if (isImageCached && isVideoCached && (src || videoSrc)) {
      setIsNearProximity(true);
      setIsLoaded(true);
      setLoadState('loaded');
      setLoadProgress(100);
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsNearProximity(true);
      return;
    }

    const proximityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsNearProximity(true);
            setLoadState('intersecting');
            proximityObserver.disconnect();
          }
        });
      },
      {
        root: null,
        rootMargin: thresholdMargin,
        threshold: 0.01,
      }
    );

    proximityObserver.observe(container);

    return () => {
      proximityObserver.disconnect();
    };
  }, [src, videoSrc, thresholdMargin]);

  // Handle active asset loading once near proximity is unlocked
  useEffect(() => {
    if (!isNearProximity) return;

    const container = containerRef.current;
    if (!container) return;

    const cleanup = assetPreloader.observeMediaElement(
      container,
      { image: posterSrc || src, video: videoSrc },
      (loaded, progress, state) => {
        setLoadProgress(progress);
        if (state) setLoadState(state);
        if (loaded) {
          setIsLoaded(true);
        }
      }
    );

    return () => cleanup();
  }, [isNearProximity, src, videoSrc, posterSrc]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative w-full overflow-hidden select-none bg-[#0c0c10] border border-white/10 ${aspectRatio} ${className}`}
      style={{ minHeight: '100%' }}
    >
      {/* 1. LOW-FIDELITY BLURRED PLACEHOLDER (LQIP) + SKELETON WIREFRAME */}
      <div
        className={`absolute inset-0 z-10 transition-opacity duration-700 pointer-events-none ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundColor: blurColor }}
      >
        {/* Ambient Blurred Color Aura */}
        <div
          className="absolute inset-0 filter blur-xl opacity-30 pointer-events-none transform scale-110"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, transparent 70%)`,
          }}
        />

        {/* Low-Poly Editorial Grid Wireframe */}
        <EditorialSkeleton
          aspectRatio=""
          className="h-full"
          loadProgress={loadProgress}
          label={isNearProximity ? 'DECODING_MEDIA' : 'BUFFER_STANDBY'}
          state={loadState}
        />
      </div>

      {/* 2. DYNAMIC HIGH-RESOLUTION MEDIA RENDERER (Mounted strictly upon near-proximity) */}
      {isNearProximity && (
        <div
          className={`w-full h-full relative will-change-transform transform-gpu transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {videoSrc ? (
            <video
              ref={videoRef}
              autoPlay={autoPlayVideo}
              loop={loopVideo}
              muted={mutedVideo}
              playsInline
              poster={posterSrc || src}
              onLoadedData={() => {
                setLoadProgress(100);
                setIsLoaded(true);
                setLoadState('loaded');
              }}
              onError={() => {
                setHasError(true);
                setLoadState('error');
              }}
              className={`w-full h-full object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-500 ${mediaClassName}`}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : src ? (
            <img
              src={src}
              alt={alt}
              decoding="async"
              loading="lazy"
              onLoad={() => {
                setLoadProgress(100);
                setIsLoaded(true);
                setLoadState('loaded');
              }}
              onError={() => {
                setHasError(true);
                setLoadState('error');
              }}
              className={`w-full h-full object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-500 ${mediaClassName}`}
            />
          ) : null}
        </div>
      )}

      {/* 3. OPTIONAL PILL TAG & OVERLAYS */}
      {pillTag && (
        <div
          className="absolute bottom-2.5 right-2.5 z-20 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-xl pointer-events-none transition-transform duration-200"
          style={{ backgroundColor: accentColor }}
        >
          {pillTag}
        </div>
      )}

      {/* 4. PASS-THROUGH CHILDREN (Overlays, Badges, etc.) */}
      {children}
    </div>
  );
};
