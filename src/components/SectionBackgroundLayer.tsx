import React, { useState, useEffect, useRef } from 'react';
import { SECTION_BACKGROUNDS } from '../lib/sectionBackgrounds';

interface SectionBackgroundLayerProps {
  sectionKey: string;
  opacity?: number; // Balanced default 0.28 to guarantee high-contrast text legibility
  className?: string;
  customImageUrl?: string;
}

export const SectionBackgroundLayer: React.FC<SectionBackgroundLayerProps> = ({
  sectionKey,
  opacity = 0.28,
  className = '',
  customImageUrl,
}) => {
  const config = SECTION_BACKGROUNDS[sectionKey] || SECTION_BACKGROUNDS.work;
  const imageUrl = customImageUrl || config.imageUrl;
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Near-proximity Lazy-Render buffer for background photos
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '400px 0px 400px 0px',
        threshold: 0.01,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Editorial Light Base Placeholder */}
      <div className="absolute inset-0 bg-[#F3F2EE]" />

      {/* High-Resolution Professional Context Image with Lazy Proximity Render */}
      {isVisible && (
        <img
          src={imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover filter saturate-100 brightness-105 scale-105 transition-all duration-1000 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0 blur-md'
          }`}
          style={{ opacity: isLoaded ? Math.min(0.08, opacity) : 0 }}
        />
      )}

      {/* Atmospheric Vignette and Seamless Editorial Blend Gradient */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(243,242,238,0.82) 0%, rgba(243,242,238,0.97) 85%)',
        }}
      />

      {/* Subtle Architectural Dot Mesh Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.25) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};

