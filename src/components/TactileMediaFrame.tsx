import React, { useState, useRef, useEffect } from 'react';
import { soundFx } from '../lib/sound';
import { assetPreloader } from '../lib/assetPreloader';
import { gsap } from '../lib/gsap';
import { EditorialSkeleton } from './EditorialSkeleton';

interface TactileMediaFrameProps {
  src?: string;
  videoSrc?: string;
  alt?: string;
  className?: string;
  aspectRatio?: string;
  zoomScale?: number;
  enableParallax?: boolean;
  pillTag?: string;
  accentColor?: string;
  onClick?: () => void;
}

export const TactileMediaFrame: React.FC<TactileMediaFrameProps> = ({
  src,
  videoSrc,
  alt = 'Media asset',
  className = '',
  aspectRatio = 'aspect-[16/10]',
  zoomScale = 1.14,
  enableParallax = true,
  pillTag,
  accentColor = '#E0533C',
  onClick,
}) => {
  const [isNearProximity, setIsNearProximity] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadState, setLoadState] = useState<'idle' | 'intersecting' | 'caching' | 'loaded' | 'error'>('idle');
  const [loadProgress, setLoadProgress] = useState(20);
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  // Near-proximity viewport detection (Lazy Render Buffer)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsNearProximity(true);
      return;
    }

    const isImageCached = src ? assetPreloader.isCached(src) : true;
    const isVideoCached = videoSrc ? assetPreloader.isCached(videoSrc) : true;
    if (isImageCached && isVideoCached && (src || videoSrc)) {
      setIsNearProximity(true);
      setIsLoaded(true);
      setLoadState('loaded');
      setLoadProgress(100);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsNearProximity(true);
            setLoadState('intersecting');
            observer.disconnect();
          }
        });
      },
      {
        root: null,
        rootMargin: '350px 0px 350px 0px',
        threshold: 0.01,
      }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [src, videoSrc]);

  // Staggered IntersectionObserver pre-loader once near proximity is achieved
  useEffect(() => {
    if (!isNearProximity) return;

    const container = containerRef.current;
    if (!container) return;

    const cleanup = assetPreloader.observeMediaElement(
      container,
      { image: src, video: videoSrc },
      (loaded, progress, state) => {
        setLoadProgress(progress);
        if (state) setLoadState(state);
        if (loaded) {
          setIsLoaded(true);
        }
      }
    );

    return () => cleanup();
  }, [isNearProximity, src, videoSrc]);

  // GSAP Mouse-following Parallax & Tactile Hover
  useEffect(() => {
    const container = containerRef.current;
    const media = mediaRef.current;
    if (!container || !media || !enableParallax) return;

    const xTo = gsap.quickTo(media, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(media, 'y', { duration: 0.35, ease: 'power3.out' });
    const scaleTo = gsap.quickTo(media, 'scale', { duration: 0.4, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;

      xTo(normX * 24); // max 24px parallax shift
      yTo(normY * 24);
    };

    const handleMouseEnter = () => {
      scaleTo(zoomScale);
      soundFx.playHover();
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      scaleTo(1.0);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enableParallax, zoomScale]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative overflow-hidden bg-[#0e0e12] border border-black/10 group cursor-pointer ${aspectRatio} ${className}`}
    >
      {/* LOW-FIDELITY BLURRED PLACEHOLDER & SKELETON WITH CSS CROSS-FADE */}
      <div
        className={`absolute inset-0 z-20 transition-opacity duration-700 pointer-events-none ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Subtle Ambient Radial Aura to prevent jarring gaps */}
        <div
          className="absolute inset-0 filter blur-xl opacity-25 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, transparent 70%)`,
          }}
        />

        <EditorialSkeleton
          aspectRatio=""
          className="h-full"
          loadProgress={loadProgress}
          label={isNearProximity ? "BUFFER_RESOLVING" : "EDITORIAL_BUFFER"}
          state={loadState}
        />
      </div>

      {/* GSAP TACTILE PARALLAX TARGET CONTAINER (Only dynamically mounted on proximity) */}
      {isNearProximity && (
        <div
          ref={mediaRef}
          className={`w-full h-full relative will-change-transform transform-gpu transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {videoSrc ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => {
                setLoadProgress(100);
                setIsLoaded(true);
                setLoadState('loaded');
              }}
              className={`w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
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
              className={`w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : null}
        </div>
      )}

      {/* EDITORIAL GRADIENT SHIELD */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

      {/* FLOATING PILL TAG */}
      {pillTag && (
        <div
          className="absolute bottom-2.5 right-2.5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-xl transition-transform duration-200 group-hover:scale-105"
          style={{ backgroundColor: accentColor }}
        >
          {pillTag}
        </div>
      )}

      {/* CORNER BRACKETS */}
      <span className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-white/60 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-white/60 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-white/60 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-white/60 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
