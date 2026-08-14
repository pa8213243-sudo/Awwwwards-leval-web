import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../lib/sound';

export interface SectionTrackItem {
  id: string;
  code: string;
  label: string;
  color: string;
}

const TRACKED_SECTIONS: SectionTrackItem[] = [
  { id: 'home', code: '01', label: 'HOME', color: '#E0533C' },
  { id: 'chapters', code: '02', label: 'CHAPTERS', color: '#E0533C' },
  { id: 'work', code: '03', label: 'WORK', color: '#E0533C' },
  { id: 'sandbox', code: '04', label: 'VALUATION', color: '#E0533C' },
  { id: 'pricing', code: '05', label: 'PRICING', color: '#E0533C' },
  { id: 'dashboards', code: '06', label: 'TELEMETRY', color: '#3B82F6' },
  { id: 'about', code: '07', label: 'PHILOSOPHY', color: '#E0533C' },
  { id: 'experience', code: '08', label: 'CAREER', color: '#10B981' },
  { id: 'skills', code: '09', label: 'SKILLS', color: '#10B981' },
  { id: 'certs', code: '10', label: 'CREDENTIALS', color: '#10B981' },
  { id: 'process', code: '11', label: 'PROCESS', color: '#E0533C' },
  { id: 'contact', code: '12', label: 'CONTACT', color: '#10B981' },
];

interface FixedSectionProgressRailProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const FixedSectionProgressRail: React.FC<FixedSectionProgressRailProps> = ({
  activeSection,
  onNavigate,
}) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [intraSectionProgress, setIntraSectionProgress] = useState<number>(0);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const rafRef = useRef<number | null>(null);

  // High-performance, jitter-free scroll calculation without layout thrashing
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY;
        const triggerPoint = scrollY + viewportHeight * 0.4;

        let foundIdx = 0;
        let progressInside = 0;

        for (let i = 0; i < TRACKED_SECTIONS.length; i++) {
          const item = TRACKED_SECTIONS[i];
          const el = document.getElementById(item.id);
          if (!el) continue;

          const top = el.offsetTop;
          const height = el.offsetHeight;

          if (triggerPoint >= top && triggerPoint <= top + height) {
            foundIdx = i;
            progressInside = Math.min(1, Math.max(0, (triggerPoint - top) / Math.max(1, height)));
            break;
          } else if (triggerPoint > top + height && i === TRACKED_SECTIONS.length - 1) {
            foundIdx = i;
            progressInside = 1;
          }
        }

        setActiveIdx(foundIdx);
        setIntraSectionProgress(progressInside);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const currentSection = TRACKED_SECTIONS[activeIdx] || TRACKED_SECTIONS[0];
  const activeColor = currentSection.color;

  return (
    <aside
      aria-label="Fixed Section Navigation Rail"
      className="fixed right-2 sm:right-3.5 md:right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center pointer-events-auto select-none hidden sm:flex"
    >
      {/* Active Section Dynamic Pill Floating Marker */}
      <div className="mb-2 flex flex-col items-center">
        <div
          className="font-mono text-[9px] font-bold px-2 py-0.5 border shadow-lg backdrop-blur-md transition-all duration-300 flex items-center gap-1.5"
          style={{
            borderColor: activeColor,
            backgroundColor: 'rgba(10, 10, 14, 0.92)',
            color: activeColor,
            boxShadow: `0 0 14px ${activeColor}44`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: activeColor }} />
          <span>{currentSection.code}</span>
          <span className="text-white/40">•</span>
          <span className="text-white/90">{Math.round(intraSectionProgress * 100)}%</span>
        </div>
      </div>

      {/* Main Track Rail Container */}
      <div className="relative py-2 flex flex-col items-center gap-1.5">
        
        {/* Background Vertical 1px Rail Line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/10 z-0 pointer-events-none" />

        {/* Dynamic Liquid Active Line Overlay */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] transition-all duration-150 z-0 pointer-events-none rounded-full"
          style={{
            height: `${((activeIdx + intraSectionProgress) / TRACKED_SECTIONS.length) * 100}%`,
            backgroundColor: activeColor,
            boxShadow: `0 0 8px ${activeColor}99`,
          }}
        />

        {/* Individual Section Nodes */}
        {TRACKED_SECTIONS.map((sec, idx) => {
          const isActive = idx === activeIdx;
          const isPassed = idx < activeIdx;
          const isHovered = hoveredSection === sec.id;

          return (
            <div
              key={sec.id}
              className="relative group flex items-center justify-center py-0.5"
              onMouseEnter={() => {
                setHoveredSection(sec.id);
                soundFx.playHover();
              }}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {/* Node Pip Button */}
              <button
                onClick={() => {
                  soundFx.playNav();
                  onNavigate(sec.id);
                }}
                className={`relative z-10 transition-all duration-300 flex items-center justify-center cursor-pointer rounded-xs ${
                  isActive
                    ? 'w-3.5 h-3.5 border-2 shadow-md'
                    : isPassed
                    ? 'w-2 h-2 bg-white/40 border border-white/20 hover:scale-125'
                    : 'w-2 h-2 bg-transparent border border-white/20 hover:border-white/80 hover:scale-125'
                }`}
                style={{
                  borderColor: isActive ? sec.color : isPassed ? sec.color : undefined,
                  backgroundColor: isActive ? '#0A0A0E' : isPassed ? `${sec.color}99` : 'transparent',
                  boxShadow: isActive ? `0 0 10px ${sec.color}88` : undefined,
                }}
                aria-label={`Jump to scene ${sec.code}: ${sec.label}`}
              >
                {isActive && (
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: sec.color }}
                  />
                )}
              </button>

              {/* Hover Tooltip / Floating Label to the Left */}
              <AnimatePresence>
                {(isHovered || (isActive && hoveredSection === null)) && (
                  <motion.div
                    initial={{ opacity: 0, x: 8, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-6 px-2.5 py-1 bg-[#0E0E14]/95 border text-right backdrop-blur-md shadow-xl whitespace-nowrap pointer-events-none z-30 flex items-center gap-2"
                    style={{
                      borderColor: isActive || isHovered ? sec.color : 'rgba(255,255,255,0.15)',
                    }}
                  >
                    <span
                      className="font-mono text-[9px] font-bold uppercase"
                      style={{ color: sec.color }}
                    >
                      {sec.code}
                    </span>
                    <span className="font-mono text-[10px] text-white font-medium uppercase tracking-wider">
                      {sec.label}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
