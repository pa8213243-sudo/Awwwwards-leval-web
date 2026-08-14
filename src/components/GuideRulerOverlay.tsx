import React, { useEffect, useState } from 'react';
import { Ruler, Check, X, Shield, Eye, EyeOff } from 'lucide-react';
import { isTouchMobileDevice } from '../lib/gsap';

interface GuideRulerOverlayProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const GuideRulerOverlay: React.FC<GuideRulerOverlayProps> = ({
  isOpen,
  onToggle,
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>('home');
  const [sectionBounds, setSectionBounds] = useState<{ id: string; top: number; height: number }[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const sections = ['home', 'chapters', 'work', 'dashboards', 'journey', 'skills', 'certs', 'about', 'process', 'pricing', 'contact'];
    
    const updatePositions = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const bounds: { id: string; top: number; height: number }[] = [];
      let currentActive = 'home';

      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const elTop = rect.top + scrollY;
          bounds.push({ id, top: elTop, height: rect.height });

          if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
            currentActive = id;
          }
        }
      });

      setSectionBounds(bounds);
      setActiveSectionId(currentActive);
    };

    updatePositions();
    window.addEventListener('scroll', updatePositions, { passive: true });
    window.addEventListener('resize', updatePositions);

    return () => {
      window.removeEventListener('scroll', updatePositions);
      window.removeEventListener('resize', updatePositions);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      aria-label="Visual Guide Ruler Alignment Overlay"
      className="fixed inset-0 z-40 pointer-events-none select-none overflow-hidden"
    >
      {/* Top Telemetry Floating Badge */}
      <div className="fixed top-20 right-4 sm:right-6 pointer-events-auto bg-[#0B0B0E]/95 backdrop-blur-md border border-[#E0533C]/60 text-white font-mono text-[11px] p-3 shadow-2xl rounded-sm flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-[#E0533C] animate-pulse" />
          <div>
            <span className="font-bold text-white block uppercase">GUIDE RULER ACTIVE</span>
            <span className="text-[9.5px] text-[#E0533C] block">
              ALIGNING: <span className="text-white font-bold">{activeSectionId.toUpperCase()}</span> (25% / 50% / 75%)
            </span>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="px-2 py-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] rounded flex items-center gap-1 cursor-pointer transition-colors"
          title="Dismiss Guide Ruler"
        >
          <X className="w-3 h-3 text-white" />
          <span>CLOSE</span>
        </button>
      </div>

      {/* Screen-Fixed Center Line Anchor */}
      <div className="fixed top-1/2 left-0 right-0 h-[1px] border-b border-dashed border-[#E0533C]/80 z-40 flex items-center justify-between px-4 sm:px-8">
        <span className="bg-[#E0533C] text-black font-mono font-bold text-[9px] px-2 py-0.5 shadow-sm">
          VIEWPORT 50% CENTER
        </span>
        <span className="bg-black/90 text-[#E0533C] font-mono text-[9px] px-2 py-0.5 border border-[#E0533C]/40">
          SCROLLTRIGGER CLAMP AXIS
        </span>
      </div>

      {/* Section-Specific Rendered 25%, 50%, 75% Ruler Lines */}
      {sectionBounds.map((sec) => {
        const p25 = sec.top + sec.height * 0.25;
        const p50 = sec.top + sec.height * 0.5;
        const p75 = sec.top + sec.height * 0.75;
        const scrollY = typeof window !== 'undefined' ? (window.scrollY || window.pageYOffset) : 0;

        return (
          <React.Fragment key={sec.id}>
            {/* 25% Scroll Mark */}
            <div
              style={{ transform: `translateY(${p25 - scrollY}px)` }}
              className="absolute left-0 right-0 h-[1px] border-b border-dashed border-cyan-400/60 flex items-center justify-between px-4 sm:px-12 pointer-events-none"
            >
              <span className="bg-[#0B0B0E]/90 text-cyan-400 border border-cyan-500/40 font-mono text-[9px] px-1.5 py-0.5">
                [{sec.id.toUpperCase()}] 25% CLAMP ENTRY
              </span>
              <span className="text-cyan-400/70 font-mono text-[8px]">
                Y: {Math.round(p25)}px
              </span>
            </div>

            {/* 50% Content Center Mark */}
            <div
              style={{ transform: `translateY(${p50 - scrollY}px)` }}
              className="absolute left-0 right-0 h-[1px] border-b border-dashed border-amber-400/80 flex items-center justify-between px-4 sm:px-12 pointer-events-none"
            >
              <span className="bg-amber-400 text-black font-mono font-bold text-[9px] px-1.5 py-0.5">
                [{sec.id.toUpperCase()}] 50% CONTENT CENTER
              </span>
              <span className="text-amber-300 font-mono text-[8px] bg-black/80 px-1 border border-amber-400/30">
                ANCHOR: PERFECT ALIGNMENT
              </span>
            </div>

            {/* 75% Scroll Mark */}
            <div
              style={{ transform: `translateY(${p75 - scrollY}px)` }}
              className="absolute left-0 right-0 h-[1px] border-b border-dashed border-emerald-400/60 flex items-center justify-between px-4 sm:px-12 pointer-events-none"
            >
              <span className="bg-[#0B0B0E]/90 text-emerald-400 border border-emerald-500/40 font-mono text-[9px] px-1.5 py-0.5">
                [{sec.id.toUpperCase()}] 75% CLAMP EXIT
              </span>
              <span className="text-emerald-400/70 font-mono text-[8px]">
                Y: {Math.round(p75)}px
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
