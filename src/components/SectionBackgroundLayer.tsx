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
      {/* Low-Fidelity Dark Base Placeholder (Prevents Layout Shifts) */}
      <div className="absolute inset-0 bg-[#08080C]" />

      {/* High-Resolution Professional Context Image with Lazy Proximity Render */}
      {isVisible && (
        <img
          src={imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover filter saturate-125 brightness-95 scale-105 transition-all duration-1000 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0 blur-md'
          }`}
          style={{ opacity: isLoaded ? opacity : 0 }}
        />
      )}

      {/* Atmospheric Vignette and Seamless Section Blend Gradient */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: config.overlayGradient || 'radial-gradient(circle at 50% 50%, rgba(10,10,14,0.78) 0%, rgba(10,10,14,0.96) 85%)',
        }}
      />

      {/* Subtle Fine-Grain / Architectural Mesh Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};

