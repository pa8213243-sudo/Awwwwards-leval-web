import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

interface SectionTransitionDividerProps {
  accentColor?: string;
  label?: string;
  sceneNumber?: string;
  className?: string;
}

export const SectionTransitionDivider: React.FC<SectionTransitionDividerProps> = ({
  accentColor = '#E0533C',
  label,
  sceneNumber,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const centerGlowRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    const centerGlow = centerGlowRef.current;
    const badge = badgeRef.current;

    if (!container || !line) return;

    const ctx = gsap.context(() => {
      // Set initial center-collapsed state
      gsap.set(line, {
        scaleX: 0,
        transformOrigin: 'center center',
      });

      if (centerGlow) {
        gsap.set(centerGlow, {
          scale: 0,
          opacity: 0,
        });
      }

      if (badge) {
        gsap.set(badge, {
          opacity: 0,
          y: 6,
        });
      }

      // Smooth expansion timeline triggered as user scrolls past
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 92%',
          end: 'bottom 60%',
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      tl.to(line, {
        scaleX: 1,
        duration: 1,
        ease: 'power2.out',
      });

      if (centerGlow) {
        tl.to(
          centerGlow,
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
          },
          0.1
        );
      }

      if (badge) {
        tl.to(
          badge,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          0.3
        );
      }
    }, container);

    return () => ctx.revert();
  }, [accentColor]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full py-6 md:py-8 flex items-center justify-center overflow-hidden select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Background static faint guide line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/[0.04] w-full" />

      {/* GSAP Expandable 1px Line from Center */}
      <div
        ref={lineRef}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] w-full"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.12) 15%, ${accentColor}88 50%, rgba(255, 255, 255, 0.12) 85%, transparent 100%)`,
          boxShadow: `0 0 12px ${accentColor}33`,
        }}
      />

      {/* Center Subtle Diamond & Glow Marker */}
      <div
        ref={centerGlowRef}
        className="relative z-10 flex items-center justify-center"
      >
        <div
          className="w-2.5 h-2.5 rotate-45 border bg-[#0A0A0E] flex items-center justify-center transition-all duration-300 shadow-md"
          style={{
            borderColor: accentColor,
            boxShadow: `0 0 8px ${accentColor}66`,
          }}
        >
          <div
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      </div>

      {/* Optional Editorial Sub-Badge (if label / sceneNumber provided) */}
      {(label || sceneNumber) && (
        <div
          ref={badgeRef}
          className="absolute top-1/2 -translate-y-1/2 bg-[#0A0A0E]/90 px-2.5 py-0.5 border border-white/10 font-mono text-[9px] uppercase tracking-widest text-white/50 flex items-center gap-2 backdrop-blur-sm z-20"
        >
          {sceneNumber && (
            <span className="font-bold" style={{ color: accentColor }}>
              {sceneNumber}
            </span>
          )}
          {label && <span>{label}</span>}
        </div>
      )}
    </div>
  );
};
