import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { ProgressiveTextFill } from './ProgressiveTextFill';

interface ContainerProgressBarProps {
  /** The DOM element id of the container to track */
  targetId?: string;
  /** Direct ref to the container element */
  targetRef?: React.RefObject<HTMLElement | null>;
  /** Custom accent color for the progress bar (e.g. #E0533C, #3B82F6, #10B981) */
  accentColor?: string;
  /** Optional micro label / section name to display with progressive text fill */
  label?: string;
  /** Display label text beside or above the bar (defaults to true) */
  showPercentage?: boolean;
  /** Optional sticky or absolute positioning */
  isSticky?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export const ContainerProgressBar: React.FC<ContainerProgressBarProps> = ({
  targetId,
  targetRef,
  accentColor = '#E0533C',
  label,
  showPercentage = true,
  isSticky = false,
  className = '',
}) => {
  const [progress, setProgress] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let targetEl: HTMLElement | null = null;
    if (targetRef && targetRef.current) {
      targetEl = targetRef.current;
    } else if (targetId) {
      targetEl = document.getElementById(targetId);
    } else if (barRef.current && barRef.current.parentElement) {
      targetEl = barRef.current.parentElement;
    }

    if (!targetEl) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: targetEl,
        start: 'top 90%',
        end: 'bottom 10%',
        scrub: 0.15,
        onUpdate: (self) => {
          const raw = Math.round(self.progress * 100);
          setProgress(raw);
        },
      });
    }, targetEl);

    return () => ctx.revert();
  }, [targetId, targetRef]);

  return (
    <div
      ref={barRef}
      className={`w-full z-30 pointer-events-none select-none ${
        isSticky ? 'sticky top-0 left-0 right-0' : 'absolute top-0 left-0 right-0'
      } ${className}`}
      aria-hidden="true"
    >
      {/* Top Hairline Glowing Progress Track */}
      <div className="w-full h-[2px] bg-white/10 relative overflow-hidden backdrop-blur-xs">
        <div
          className="h-full transition-all duration-100 ease-out relative"
          style={{
            width: `${Math.max(2, progress)}%`,
            backgroundColor: accentColor,
            boxShadow: `0 0 10px ${accentColor}, 0 0 4px ${accentColor}`,
          }}
        >
          {/* Subtle Leading Glow Pip */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full blur-[0.5px]"
            style={{ backgroundColor: '#FFFFFF' }}
          />
        </div>
      </div>

      {/* Elegant Micro-HUD Line: Section Name with PROGRESSIVE LIQUID COLOR FILL + Compact Progress Bar */}
      {label && (
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-12 py-1.5 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
          {/* Section Name that fills with radiant color as the user scrolls */}
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-opacity duration-200"
              style={{ 
                backgroundColor: accentColor, 
                boxShadow: `0 0 8px ${accentColor}`,
                opacity: progress > 0 ? 1 : 0.3
              }}
            />
            <ProgressiveTextFill
              text={label}
              progress={progress}
              accentColor={accentColor}
              textClassName="font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest"
            />
          </div>

          {/* Compact Mini Progress Line & Percentage */}
          {showPercentage && (
            <div className="flex items-center gap-2 font-mono text-[10px] bg-black/80 px-2 py-0.5 border border-white/15 backdrop-blur-md">
              <span className="text-white/40 text-[9px] font-semibold hidden xs:inline">PROGRESS</span>
              <div className="w-12 sm:w-16 h-1 bg-white/15 overflow-hidden rounded-none relative">
                <div
                  className="h-full transition-all duration-150"
                  style={{
                    width: `${Math.max(4, progress)}%`,
                    backgroundColor: accentColor,
                    boxShadow: `0 0 6px ${accentColor}`,
                  }}
                />
              </div>
              <span className="font-bold min-w-[28px] text-right" style={{ color: accentColor }}>
                {progress}%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

