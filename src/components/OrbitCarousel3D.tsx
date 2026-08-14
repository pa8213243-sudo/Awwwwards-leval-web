import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  ExternalLink, 
  Layers, 
  Maximize2, 
  Sparkles, 
  FileSpreadsheet, 
  Presentation, 
  Database, 
  Play, 
  CheckCircle2,
  TrendingUp,
  Info,
  Code2,
  ChevronRight
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
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'model' | 'impact'>('overview');

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  const total = projects.length;
  const activeProject = projects[activeIndex] || projects[0];

  const handleNext = useCallback(() => {
    soundFx.playNav();
    setIsFlipped(false);
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    soundFx.playNav();
    setIsFlipped(false);
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Auto rotation timer if enabled
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoRotating, handleNext]);

  // Mouse / Touch Drag handlers for 3D swipe
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartXRef.current = e.clientX;
    isDraggingRef.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || dragStartXRef.current === null) return;
    const deltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    isDraggingRef.current = false;
    dragStartXRef.current = null;
  };

  const getCategoryBadge = (category: string) => {
    if (category.includes('Power BI') || category.includes('Analytics')) {
      return { icon: <Database className="w-3 h-3 text-blue-400" />, color: 'bg-blue-500/20 text-blue-300 border-blue-400/40' };
    }
    if (category.includes('Excel')) {
      return { icon: <FileSpreadsheet className="w-3 h-3 text-emerald-400" />, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' };
    }
    return { icon: <Presentation className="w-3 h-3 text-amber-400" />, color: 'bg-amber-500/20 text-amber-300 border-amber-400/40' };
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-[580px] sm:min-h-[640px] flex flex-col justify-between select-none overflow-hidden py-4"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* 3D ORBIT CYLINDER STAGE */}
      <div className="relative w-full h-[400px] sm:h-[460px] flex items-center justify-center [perspective:1400px]">
        {/* Orbit track ring backdrop */}
        <div className="absolute w-[600px] sm:w-[850px] h-[160px] border border-white/10 rounded-[100%] [transform:rotateX(72deg)_translateZ(-80px)] pointer-events-none opacity-40 shadow-[0_0_50px_rgba(224,83,60,0.1)]" />

        {/* 3D CARDS ARRAY */}
        {projects.map((project, idx) => {
          const offset = (idx - activeIndex + total) % total;
          // Calculate relative position around circle: -2, -1, 0, 1, 2...
          let relativePos = offset;
          if (relativePos > total / 2) {
            relativePos = relativePos - total;
          }

          const isActive = relativePos === 0;
          const isAdjacent = Math.abs(relativePos) === 1;
          const isVisible = Math.abs(relativePos) <= 2;

          if (!isVisible) return null;

          // 3D positioning coordinates
          const angle = relativePos * 34; // degrees
          const translateZ = isActive ? 120 : isAdjacent ? -60 : -220;
          const translateX = relativePos * (window.innerWidth < 640 ? 140 : 260);
          const rotateY = -relativePos * 28;
          const scale = isActive ? 1 : isAdjacent ? 0.85 : 0.7;
          const opacity = isActive ? 1 : isAdjacent ? 0.65 : 0.25;
          const zIndex = 20 - Math.abs(relativePos);

          const badge = getCategoryBadge(project.category);

          return (
            <motion.div
              key={project.id}
              className="absolute w-[90%] max-w-[360px] sm:max-w-[440px] h-[360px] sm:h-[420px] rounded-none cursor-pointer [transform-style:preserve-3d] group"
              style={{
                zIndex,
              }}
              animate={{
                x: translateX,
                z: translateZ,
                rotateY: rotateY,
                scale: scale,
                opacity: opacity,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 28,
                mass: 0.8,
              }}
              onClick={() => {
                if (!isActive) {
                  soundFx.playNav();
                  setActiveIndex(idx);
                } else {
                  soundFx.playClick();
                  onSelectProject(project);
                }
              }}
            >
              {/* CARD ENVELOPE WITH 3D TILT & PHYSICAL CARD BORDER */}
              <div 
                className={`relative w-full h-full p-5 sm:p-6 rounded-none flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                  isActive
                    ? 'bg-[#121218] border-2 border-white/35 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(224,83,60,0.2)] ring-1 ring-white/25'
                    : 'bg-[#0E0E13]/95 border border-white/15 shadow-xl backdrop-blur-md'
                }`}
              >
                {/* CONTEXTUAL TRANSPARENT BACKGROUND PHOTO */}
                {project.image && (
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-55 group-hover:opacity-70 transition-all duration-700 filter brightness-105 saturate-125 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E14] via-[#0E0E14]/70 to-[#0E0E14]/60" />
                  </div>
                )}

                {/* CARD TOP META BAR (FOREGROUND) */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2 border-b border-white/15 pb-2.5 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono px-2 py-0.5 border rounded-xs font-bold uppercase flex items-center gap-1.5 shadow-sm ${badge.color}`}>
                        {badge.icon}
                        <span>{project.category}</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 border border-emerald-500/30">
                        {project.impactMetric}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-mono text-[10px] text-white/60 bg-black/60 px-2 py-0.5 border border-white/10">
                      <span>CH.{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                      <span>/</span>
                      <span>{total < 10 ? `0${total}` : total}</span>
                    </div>
                  </div>

                  {/* PROJECT TITLE & CLIENT */}
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight leading-snug mb-1 drop-shadow-sm">
                    {project.title}
                  </h3>
                  <div className="text-[10px] font-mono text-emerald-300/90 font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>SCOPE: {project.client} • {project.year}</span>
                  </div>

                  {/* PROJECT SUMMARY / TAGLINE */}
                  <p className="text-xs text-white/90 line-clamp-3 leading-relaxed font-sans mb-3 font-normal bg-black/40 p-2 border border-white/10 rounded-xs backdrop-blur-xs">
                    {project.summary}
                  </p>

                  {/* DELIVERABLES LIST */}
                  <div className="space-y-1 pl-2 border-l-2 border-emerald-400/80 bg-black/30 py-1.5 pr-2">
                    {project.deliverables.slice(0, 2).map((del, i) => (
                      <div key={i} className="text-[11px] font-mono text-white/90 font-medium flex items-center gap-1.5 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CARD BOTTOM ACTION BAR (FOREGROUND) */}
                <div className="relative z-10 pt-2.5 border-t border-white/15 flex items-center justify-between gap-2 bg-black/50 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 p-3 sm:px-6">
                  <div className="flex flex-wrap gap-1">
                    {project.tools.slice(0, 3).map((tool, i) => (
                      <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 bg-white/10 border border-white/15 text-white/80 font-medium">
                        #{tool}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {project.externalUrl && (
                      <a
                        href={project.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundFx.playClick();
                        }}
                        className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xs transition-colors"
                        title="Open Live Model Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                      </a>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.playClick();
                        onSelectProject(project);
                      }}
                      className="px-3 py-1.5 bg-[#E0533C] hover:bg-[#c94530] text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 rounded-xs transition-all shadow-md cursor-pointer"
                    >
                      <span>INSPECT</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* ACTIVE CARD CORNER ACCENT */}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-[#E0533C] z-20 pointer-events-none" />
                )}
                {isActive && (
                  <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400 z-20 pointer-events-none" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3D CAROUSEL CONTROLLER HUD */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 pt-4 border-t border-white/10 bg-black/40 backdrop-blur-md rounded-sm mt-2">
        
        {/* Left: Active Project Indicator */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-[#E0533C] font-bold">
            [{activeIndex + 1 < 10 ? `0${activeIndex + 1}` : activeIndex + 1} / {total < 10 ? `0${total}` : total}]
          </span>
          <span className="text-white font-serif font-bold truncate max-w-[200px] sm:max-w-xs">
            {activeProject.title}
          </span>
        </div>

        {/* Center: Pagination Dots */}
        <div className="flex items-center gap-1.5">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                soundFx.playNav();
                setActiveIndex(i);
              }}
              className={`transition-all cursor-pointer ${
                i === activeIndex
                  ? 'w-6 h-1.5 bg-[#E0533C]'
                  : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Right: Controller Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFx.playClick();
              setIsAutoRotating(!isAutoRotating);
            }}
            className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider border rounded-xs transition-colors flex items-center gap-1 cursor-pointer ${
              isAutoRotating
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-white/5 border-white/15 text-white/60 hover:text-white'
            }`}
          >
            <RotateCcw className={`w-3 h-3 ${isAutoRotating ? 'animate-spin' : ''}`} />
            <span>AUTO ORBIT</span>
          </button>

          <button
            onClick={handlePrev}
            className="p-2 bg-white/5 hover:bg-white/15 border border-white/20 text-white rounded-xs transition-colors cursor-pointer"
            aria-label="Previous Project"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            className="p-2 bg-[#E0533C] hover:bg-[#c94530] text-white border border-[#E0533C] rounded-xs transition-colors shadow-md cursor-pointer"
            aria-label="Next Project"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
