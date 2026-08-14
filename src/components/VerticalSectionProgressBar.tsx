import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { soundFx } from '../lib/sound';

export interface SubAnchor {
  id: string;
  label: string;
  pct: number; // 0 to 100
  code?: string;
}

interface VerticalSectionProgressBarProps {
  /** The DOM element id of the section container to track */
  targetId?: string;
  /** Direct ref to the section container element */
  targetRef?: React.RefObject<HTMLElement | null>;
  /** External progress override (0 to 1) when driven directly by a parent pinned timeline */
  externalProgress?: number;
  /** Custom accent color for the progress bar (e.g. #E0533C, #3B82F6, #10B981) */
  accentColor?: string;
  /** Optional micro label / section index (e.g. "01 // WORK", "02 // ABOUT") */
  label?: string;
  /** Optional section numerical code (e.g. "01", "02") */
  sectionCode?: string;
  /** Explicit sub-anchors for interactive quick-jump dots */
  subAnchors?: SubAnchor[];
  /** Whether the parent section has a light background */
  isLightBg?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const DEFAULT_SUB_ANCHORS: Record<string, SubAnchor[]> = {
  work: [
    { id: 'work', label: 'PROJECT DECK', pct: 10, code: '01' },
    { id: 'work', label: 'FINANCIAL MODEL LOGIC', pct: 50, code: '02' },
    { id: 'work', label: 'FINANCIAL MATRIX', pct: 90, code: '03' },
  ],
  dashboards: [
    { id: 'dashboards', label: 'ETL & POWER QUERY M', pct: 15, code: 'M1' },
    { id: 'dashboards', label: 'BI DAX MEASURES', pct: 50, code: 'M2' },
    { id: 'dashboards', label: 'RLS & GOVERNANCE', pct: 85, code: 'M3' },
  ],
  skills: [
    { id: 'skills', label: 'FINANCIAL MODEL LOGIC', pct: 15, code: 'S1' },
    { id: 'skills', label: 'BI DAX MEASURES', pct: 50, code: 'S2' },
    { id: 'skills', label: 'CMA GOVERNANCE', pct: 85, code: 'S3' },
  ],
  sandbox: [
    { id: 'sandbox', label: 'FINANCIAL MODEL LOGIC', pct: 15, code: 'P1' },
    { id: 'sandbox', label: 'SCENARIO LAB', pct: 50, code: 'P2' },
    { id: 'sandbox', label: 'EBITDA WATERFALL', pct: 85, code: 'P3' },
  ],
  about: [
    { id: 'about', label: 'EXECUTIVE PROFILE', pct: 15, code: 'A1' },
    { id: 'about', label: 'ACTIVITY-BASED COSTING', pct: 50, code: 'A2' },
    { id: 'about', label: 'VERIFIED METRICS', pct: 85, code: 'A3' },
  ],
  experience: [
    { id: 'experience', label: 'CAREER MILESTONES', pct: 15, code: 'E1' },
    { id: 'experience', label: 'B.COM HONORS', pct: 55, code: 'E2' },
    { id: 'experience', label: 'CMA CREDENTIALS', pct: 85, code: 'E3' },
  ],
  pricing: [
    { id: 'pricing', label: 'ENGAGEMENT TIERS', pct: 15, code: 'R1' },
    { id: 'pricing', label: 'ROI CALCULATOR', pct: 50, code: 'R2' },
    { id: 'pricing', label: 'CMA GOVERNANCE FAQ', pct: 85, code: 'R3' },
  ],
};

export const VerticalSectionProgressBar: React.FC<VerticalSectionProgressBarProps> = ({
  targetId,
  targetRef,
  externalProgress,
  accentColor = '#E0533C',
  label,
  sectionCode,
  subAnchors,
  isLightBg = false,
  className = '',
}) => {
  const [internalProgress, setInternalProgress] = useState(0);
  const [activeSegment, setActiveSegment] = useState(0);
  const [hoveredAnchor, setHoveredAnchor] = useState<SubAnchor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMilestoneRef = useRef(-1);

  // Derive sub-anchors from prop or defaults
  const activeAnchors = subAnchors || (targetId ? DEFAULT_SUB_ANCHORS[targetId] : undefined) || [];

  // If externalProgress is provided, use it directly as the source of truth for high-precision timeline sync
  const displayProgress = externalProgress !== undefined 
    ? Math.min(100, Math.max(0, Math.round(externalProgress * 100))) 
    : internalProgress;

  useEffect(() => {
    if (externalProgress !== undefined) {
      const segment = Math.min(4, Math.floor(externalProgress * 4));
      setActiveSegment(segment);
      if (segment !== lastMilestoneRef.current && externalProgress >= 0.05 && externalProgress <= 0.98) {
        lastMilestoneRef.current = segment;
        soundFx.playProgressThresholdTick(segment, Math.round(externalProgress * 100));
      }
    }
  }, [externalProgress]);

  useEffect(() => {
    // If externally driven, skip internal ScrollTrigger to avoid duplicate listeners
    if (externalProgress !== undefined) return;

    let targetEl: HTMLElement | null = null;
    if (targetRef && targetRef.current) {
      targetEl = targetRef.current;
    } else if (targetId) {
      targetEl = document.getElementById(targetId);
    } else if (containerRef.current && containerRef.current.closest('section')) {
      targetEl = containerRef.current.closest('section');
    }

    if (!targetEl) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: targetEl,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.1,
        onUpdate: (self) => {
          const raw = Math.round(self.progress * 100);
          setInternalProgress(raw);
          const segment = Math.min(4, Math.floor(self.progress * 4));
          setActiveSegment(segment);

          // Subtle low-volume tactile mechanical audio feedback on major segment thresholds (0, 25, 50, 75, 100%)
          if (segment !== lastMilestoneRef.current && self.progress >= 0.05 && self.progress <= 0.98) {
            lastMilestoneRef.current = segment;
            soundFx.playProgressThresholdTick(segment, raw);
          }
        },
      });
    }, targetEl);

    return () => ctx.revert();
  }, [targetId, targetRef, externalProgress]);

  const handleAnchorClick = (anchor: SubAnchor, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick();

    let targetEl: HTMLElement | null = null;
    if (targetRef && targetRef.current) {
      targetEl = targetRef.current;
    } else if (targetId) {
      targetEl = document.getElementById(targetId);
    } else if (anchor.id) {
      targetEl = document.getElementById(anchor.id);
    }

    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetTop = rect.top + scrollTop;
      const sectionHeight = targetEl.offsetHeight || window.innerHeight;
      const targetScroll = targetTop + (sectionHeight * (anchor.pct / 100)) - (window.innerHeight * 0.15);

      window.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
    }
  };

  const milestones = [
    { label: '00', pct: 0 },
    { label: '25', pct: 25 },
    { label: '50', pct: 50 },
    { label: '75', pct: 75 },
    { label: '100', pct: 100 },
  ];

  return (
    <aside
      ref={containerRef}
      aria-label={`Reading rail and section progress for ${label || targetId || 'section'}`}
      className={`absolute right-2 sm:right-3 md:right-5 top-8 bottom-8 z-30 flex flex-col items-center justify-between pointer-events-none select-none ${className}`}
    >
      {/* Top Header Tag */}
      <div className="flex flex-col items-center gap-1">
        <div 
          className="font-mono text-[9px] font-bold px-1.5 py-0.5 border shadow-sm backdrop-blur-md transition-colors duration-200 pointer-events-auto"
          style={{
            borderColor: displayProgress > 5 ? accentColor : isLightBg ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.15)',
            backgroundColor: isLightBg ? 'rgba(255, 255, 255, 0.92)' : (displayProgress > 5 ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.6)'),
            color: displayProgress > 5 ? accentColor : isLightBg ? '#111116' : 'rgba(255, 255, 255, 0.6)',
          }}
        >
          {sectionCode || (label ? label.slice(0, 2) : 'SEC')}
        </div>
        <div className={`w-[1px] h-3 ${isLightBg ? 'bg-black/20' : 'bg-white/10'}`} />
      </div>

      {/* Main Center Vertical Rail & Milestone Pips & Anchor Jumps */}
      <div className="flex-1 my-3 flex items-center justify-center relative w-8">
        
        {/* Track Line */}
        <div className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] ${isLightBg ? 'bg-black/15' : 'bg-white/10'} overflow-hidden`}>
          {/* Active Liquid Fill */}
          <div
            className="w-full transition-all duration-75 ease-out relative"
            style={{
              height: `${Math.max(2, displayProgress)}%`,
              backgroundColor: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          >
            {/* Leading Glow Pip */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white blur-[0.5px]"
              style={{ boxShadow: `0 0 6px ${accentColor}` }}
            />
          </div>
        </div>

        {/* Milestone Tick Marks */}
        <div className="absolute top-0 bottom-0 flex flex-col justify-between items-center py-1 pointer-events-none">
          {milestones.map((m, idx) => {
            const isPassed = displayProgress >= m.pct;
            return (
              <div
                key={idx}
                className="flex items-center gap-1.5 group"
                title={`${m.pct}%`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-none border transition-all duration-200 ${
                    isPassed
                      ? 'scale-110'
                      : isLightBg ? 'border-black/30 bg-white' : 'border-white/20 bg-black/70'
                  }`}
                  style={{
                    backgroundColor: isPassed ? accentColor : isLightBg ? '#FFFFFF' : 'rgba(0,0,0,0.6)',
                    borderColor: isPassed ? accentColor : isLightBg ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.25)',
                    boxShadow: isPassed ? `0 0 6px ${accentColor}` : 'none',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* INTERACTIVE ANCHOR JUMP DOT INDICATORS */}
        {activeAnchors.length > 0 && (
          <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none">
            {activeAnchors.map((anchor, aIdx) => {
              const isActive = Math.abs(displayProgress - anchor.pct) < 15;
              const isPast = displayProgress >= anchor.pct;
              return (
                <div
                  key={anchor.label + aIdx}
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                  style={{ top: `${anchor.pct}%` }}
                  onMouseEnter={() => {
                    setHoveredAnchor(anchor);
                    soundFx.playHover();
                  }}
                  onMouseLeave={() => setHoveredAnchor(null)}
                >
                  <button
                    onClick={(e) => handleAnchorClick(anchor, e)}
                    className={`relative w-4 h-4 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'scale-125'
                        : 'scale-90 hover:scale-110'
                    }`}
                    title={`Jump to: ${anchor.label}`}
                    aria-label={`Jump to sub-section: ${anchor.label}`}
                  >
                    {/* Pulsing ring if active */}
                    {isActive && (
                      <span
                        className="absolute inset-0 rounded-full animate-ping opacity-75"
                        style={{ backgroundColor: accentColor }}
                      />
                    )}
                    {/* Inner core dot */}
                    <span
                      className="w-2 h-2 rounded-full border shadow-sm transition-all duration-200"
                      style={{
                        backgroundColor: isActive || isPast ? accentColor : isLightBg ? '#FFFFFF' : '#111116',
                        borderColor: isActive || isPast ? '#FFFFFF' : isLightBg ? '#888' : '#666',
                        boxShadow: isActive ? `0 0 10px ${accentColor}` : 'none',
                      }}
                    />
                  </button>

                  {/* Floating Editorial Tooltip on Hover */}
                  {hoveredAnchor === anchor && (
                    <div
                      className="absolute right-6 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap px-2.5 py-1 bg-black/95 text-white border font-mono text-[9px] font-bold tracking-wider shadow-2xl backdrop-blur-md flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150"
                      style={{ borderColor: accentColor }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: accentColor }}
                      />
                      <span className="text-white/60">{anchor.code || `0${aIdx + 1}`} //</span>
                      <span className="text-white uppercase">{anchor.label}</span>
                      <span className="text-emerald-400 text-[8px] pl-1 font-mono">JUMP ↵</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Vertical Editorial Label */}
        {label && (
          <div 
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.25em] font-semibold transition-opacity duration-200 pointer-events-none"
            style={{
              writingMode: 'vertical-rl',
              transform: 'translateX(-50%) rotate(180deg)',
              color: displayProgress > 10 
                ? (isLightBg ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.7)') 
                : (isLightBg ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.3)'),
            }}
          >
            {label}
          </div>
        )}
      </div>

      {/* Bottom Percentage Readout */}
      <div className="flex flex-col items-center gap-1 pointer-events-auto">
        <div className={`w-[1px] h-3 ${isLightBg ? 'bg-black/20' : 'bg-white/10'}`} />
        <div
          className="font-mono text-[9px] font-bold px-1 py-0.5 border shadow-sm backdrop-blur-md text-center min-w-[28px]"
          style={{
            borderColor: isLightBg ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.15)',
            backgroundColor: isLightBg ? 'rgba(255, 255, 255, 0.92)' : 'rgba(0, 0, 0, 0.85)',
            color: isLightBg && displayProgress <= 5 ? '#111116' : accentColor,
          }}
        >
          {displayProgress}%
        </div>
      </div>
    </aside>
  );
};

