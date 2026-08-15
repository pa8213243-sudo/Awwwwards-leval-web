import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  ExternalLink, 
  CheckCircle2,
  FileSpreadsheet, 
  Presentation, 
  Database,
  Maximize2,
  TrendingUp
} from 'lucide-react';
import { Project } from '../types';
import { soundFx } from '../lib/sound';

interface OrbitCarousel3DProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onContact: () => void;
}

export const OrbitCarousel3D: React.FC<OrbitCarousel3DProps> = ({
  projects,
  onSelectProject,
  onContact,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  const total = projects.length;
  const activeProject = projects[activeIndex] || projects[0];

  const handleNext = useCallback(() => {
    soundFx.playNav();
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    soundFx.playNav();
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => handleNext(), 4500);
    return () => clearInterval(interval);
  }, [isAutoRotating, handleNext]);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartXRef.current = e.clientX;
    isDraggingRef.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || dragStartXRef.current === null) return;
    const deltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 40) deltaX > 0 ? handlePrev() : handleNext();
    isDraggingRef.current = false;
    dragStartXRef.current = null;
  };

  const getCategoryBadge = (category: string) => {
    if (category.includes('Power BI') || category.includes('Analytics'))
      return { icon: <Database className="w-3 h-3 text-blue-400" />, color: 'bg-blue-500/20 text-blue-300 border-blue-400/40' };
    if (category.includes('Excel'))
      return { icon: <FileSpreadsheet className="w-3 h-3 text-emerald-400" />, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' };
    return { icon: <Presentation className="w-3 h-3 text-amber-400" />, color: 'bg-amber-500/20 text-amber-300 border-amber-400/40' };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* ── 3D ORBIT STAGE ─────────────────────────────────────────── */}
      <div className="relative w-full h-[300px] sm:h-[360px] flex items-center justify-center [perspective:1400px] overflow-hidden">
        <div className="absolute w-[500px] sm:w-[800px] h-[130px] border border-white/10 rounded-[100%] [transform:rotateX(72deg)_translateZ(-80px)] pointer-events-none opacity-25" />

        {projects.map((project, idx) => {
          const offset = (idx - activeIndex + total) % total;
          let relativePos = offset;
          if (relativePos > total / 2) relativePos = relativePos - total;

          const isActive = relativePos === 0;
          const isAdjacent = Math.abs(relativePos) === 1;
          const isVisible = Math.abs(relativePos) <= 2;

          if (!isVisible) return null;

          const translateX = relativePos * (typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 230);
          const translateZ = isActive ? 100 : isAdjacent ? -50 : -190;
          const rotateY = -relativePos * 22;
          const scale = isActive ? 1 : isAdjacent ? 0.80 : 0.62;
          const opacity = isActive ? 1 : isAdjacent ? 0.58 : 0.20;
          const zIndex = 20 - Math.abs(relativePos);
          const badge = getCategoryBadge(project.category);

          return (
            <motion.div
              key={project.id}
              className="absolute w-[80%] max-w-[300px] sm:max-w-[370px] h-[240px] sm:h-[290px] rounded-none cursor-pointer [transform-style:preserve-3d] group"
              style={{ zIndex, willChange: 'transform, opacity' }}
              animate={{ x: translateX, z: translateZ, rotateY, scale, opacity }}
              transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.8 }}
              onClick={() => {
                if (!isActive) { soundFx.playNav(); setActiveIndex(idx); }
                else { soundFx.playClick(); onSelectProject(project); }
              }}
            >
              <div
                className={`relative w-full h-full rounded-none flex flex-col overflow-hidden transition-all duration-300 ${
                  isActive
                    ? 'border-2 border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(224,83,60,0.18)]'
                    : 'border border-white/12 shadow-xl'
                }`}
              >
                <div className="absolute inset-0">
                  <img
                    src={project.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'}
                    alt={project.title}
                    className="w-full h-full object-cover brightness-90 saturate-110 scale-105 group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0e] via-[#0a0a0e]/60 to-transparent" />
                </div>

                <div className="relative z-10 p-3 flex items-center justify-between">
                  <span className={`text-[9px] font-mono px-2 py-0.5 border rounded-xs font-bold uppercase flex items-center gap-1.5 ${badge.color}`}>
                    {badge.icon}
                    <span className="hidden sm:inline">{project.category}</span>
                  </span>
                  <span className="font-mono text-[9px] text-white/60 bg-black/60 px-2 py-0.5 border border-white/10">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}/{total < 10 ? `0${total}` : total}
                  </span>
                </div>

                <div className="relative z-10 mt-auto p-3 sm:p-4">
                  <h3 className="font-serif text-sm sm:text-base font-bold text-white leading-snug drop-shadow-md line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-[10px] font-mono text-emerald-400 mt-0.5 truncate">{project.client}</p>
                </div>

                {isActive && <>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#E0533C] z-20 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400 z-20 pointer-events-none" />
                </>}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── HUD / NAVIGATION BAR ──────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 px-2 sm:px-4 py-2.5 border-t border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => { soundFx.playNav(); setActiveIndex(i); }}
              className={`transition-all cursor-pointer rounded-full ${
                i === activeIndex ? 'w-6 h-1.5 bg-[#E0533C]' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <span className="font-mono text-[10px] text-white/50 hidden sm:block truncate max-w-[200px]">
          <span className="text-[#E0533C] font-bold">
            [{activeIndex + 1 < 10 ? `0${activeIndex + 1}` : activeIndex + 1}/{total < 10 ? `0${total}` : total}]
          </span>{' '}
          {activeProject.title}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { soundFx.playClick(); setIsAutoRotating(!isAutoRotating); }}
            className={`px-2 py-1 text-[10px] font-mono uppercase border rounded-xs transition-colors flex items-center gap-1 cursor-pointer ${
              isAutoRotating
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-white/5 border-white/15 text-white/50 hover:text-white'
            }`}
          >
            <RotateCcw className={`w-3 h-3 ${isAutoRotating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">AUTO</span>
          </button>
          <button onClick={handlePrev} className="p-1.5 bg-white/5 hover:bg-white/15 border border-white/20 text-white rounded-xs transition-colors cursor-pointer" aria-label="Previous">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={handleNext} className="p-1.5 bg-[#E0533C] hover:bg-[#c94530] text-white border border-[#E0533C] rounded-xs transition-colors shadow-md cursor-pointer" aria-label="Next">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── ACTIVE PROJECT DETAIL PANEL (HIGH CONTRAST CRISP CARD) ── */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeProject.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-6 bg-[#0E0E12] border-2 border-dashed border-black/30 p-6 sm:p-8 rounded-none shadow-2xl text-white relative"
        >
          {/* Corner Marker Ticks */}
          <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#E0533C]" />
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#E0533C]" />
          <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#E0533C]" />
          <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#E0533C]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Metadata */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-emerald-500 text-black font-mono text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    {activeProject.category}
                  </span>
                  <span className="px-2 py-0.5 bg-white/10 text-white border border-white/20 font-mono text-[10px] font-bold">
                    YEAR: {activeProject.year}
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold bg-[#18181E] px-2 py-0.5 border border-emerald-500/40">
                    {activeProject.impactMetric}
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase tracking-tight leading-tight">
                  {activeProject.title}
                </h3>
                <p className="text-xs font-mono text-emerald-400 font-bold mt-1 uppercase">
                  CLIENT / SCOPE: {activeProject.client}
                </p>
              </div>

              <p className="text-xs sm:text-[13.5px] text-[#EDEDED] leading-relaxed font-sans bg-[#18181E] p-4 border border-white/10 rounded-none shadow-xs">
                {activeProject.summary}
              </p>

              <div className="space-y-2 pl-3.5 border-l-2 border-[#E0533C] bg-[#18181E] p-3 rounded-none">
                <span className="text-[10px] font-mono text-white/60 uppercase font-bold tracking-wider">
                  KEY DELIVERABLES & IMPACT:
                </span>
                {activeProject.deliverables.map((del, i) => (
                  <div key={i} className="text-xs font-mono text-[#F0F0F0] flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>

              {activeProject.approach && activeProject.approach.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-mono text-white/60 uppercase font-bold tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-[#E0533C]" />
                    STRATEGIC APPROACH:
                  </span>
                  {activeProject.approach.map((step, i) => (
                    <div key={i} className="text-xs font-mono text-[#E0E0E0] flex items-start gap-2">
                      <span className="text-[#E0533C] font-bold shrink-0">{String(i + 1).padStart(2, '0')}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[9px] font-mono text-white/60 uppercase font-bold">TECH STACK:</span>
                {activeProject.tools.map((t, i) => (
                  <span key={i} className="text-[9.5px] font-mono text-white bg-white/10 px-2 py-0.5 border border-white/15">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Media + Results + Actions */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="w-full h-[220px] sm:h-[250px] rounded-none border-2 border-white/20 overflow-hidden shadow-xl relative group bg-[#18181E]">
                <img
                  src={activeProject.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=900&auto=format&fit=crop'}
                  alt={activeProject.title}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=900&auto=format&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 right-2.5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-xl" style={{ backgroundColor: '#E0533C' }}>
                  {activeProject.impactMetric}
                </div>
              </div>

              {activeProject.results && activeProject.results.length > 0 && (
                <div className="bg-emerald-950/50 border border-emerald-500/40 p-4 space-y-1.5">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                    RESULTS ACHIEVED:
                  </span>
                  {activeProject.results.map((r, i) => (
                    <div key={i} className="text-xs font-mono text-[#F0F0F0] flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">→</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2.5 pt-1">
                {activeProject.externalUrl && (
                  <a
                    href={activeProject.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-none transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-emerald-400" />
                    <span>LIVE WORKBOOK</span>
                  </a>
                )}
                <button
                  onClick={() => { soundFx.playClick(); onSelectProject(activeProject); }}
                  className="flex-1 py-2.5 px-4 bg-[#E0533C] hover:bg-[#c94530] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-none shadow-lg transition-all cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>INSPECT CASE</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};


