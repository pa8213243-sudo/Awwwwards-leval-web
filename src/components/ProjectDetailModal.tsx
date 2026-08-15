import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  Code2, 
  ArrowUpRight, 
  Download, 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Calendar, 
  Building2, 
  Target, 
  AlertCircle,
  Cpu
} from 'lucide-react';
import { Project } from '../types';
import { soundFx } from '../lib/sound';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onContact: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onContact
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundFx.playClick();
        onClose();
      }
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);

      // Bulletproof body scroll lock — freeze page at current position
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = `-${scrollX}px`;
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';
      document.documentElement.style.overflow = 'hidden';

      // Auto-focus scroll container so wheel/arrows scroll instantly
      setTimeout(() => {
        scrollContainerRef.current?.focus();
      }, 50);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);

        // Restore body scroll position exactly where user left off
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        document.body.style.width = '';
        document.documentElement.style.overflow = '';
        window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });
      };
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  /** Block wheel events from leaking through to the page behind the modal */
  const handleOverlayWheel = (e: React.WheelEvent) => {
    // Let the inner scroll container handle scrolling; stop propagation so page doesn't move
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[99999] bg-black/92 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 overscroll-none"
        onWheel={handleOverlayWheel}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            soundFx.playClick();
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl h-[88vh] max-h-[88vh] bg-[#111116] border-2 border-white/20 text-[#F8F9FA] rounded-none overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col min-h-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── STICKY MODAL HEADER BAR ── */}
          <div className="sticky top-0 z-30 bg-[#15151C]/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-white/15 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="px-2.5 py-0.5 bg-emerald-500 text-black font-mono text-[10px] font-bold uppercase tracking-wider rounded-none">
                {project.category}
              </span>
              <span className="text-[10px] font-mono text-white/80 font-bold bg-white/10 px-2 py-0.5 border border-white/15">
                YEAR: {project.year}
              </span>
              <span className="text-[10.5px] font-mono text-emerald-400 font-bold hidden sm:inline flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>{project.impactMetric}</span>
              </span>
            </div>
            
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="px-3 py-1 bg-white/10 hover:bg-[#E0533C] text-white border border-white/20 rounded-none transition-colors cursor-pointer flex items-center gap-1.5 font-mono text-xs uppercase font-bold"
              aria-label="Close modal"
            >
              <span>CLOSE</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ── DEDICATED INDEPENDENT SCROLLABLE CONTAINER ── */}
          <div 
            ref={scrollContainerRef}
            tabIndex={0}
            className="p-4 sm:p-6 md:p-8 overflow-y-auto overscroll-contain space-y-6 font-sans flex-1 min-h-0 modal-case-scroll focus:outline-none"
          >
            
            {/* TOP HEADER SECTION */}
            <div className="border-b border-white/15 pb-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-1.5 font-bold flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>CLIENT / SCOPE: {project.client} • VERIFIED FINANCIAL CASE STUDY</span>
              </div>
              
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-tight font-bold">
                {project.title}
              </h2>
              
              <p className="mt-2 text-xs sm:text-sm md:text-base font-normal text-white/80 leading-relaxed border-l-3 border-emerald-400 pl-3 bg-white/5 py-1">
                {project.tagline || project.summary}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 mt-3.5">
                {project.externalUrl && (
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFx.playClick()}
                    className="py-2 px-4 bg-[#E0533C] hover:bg-red-700 text-white font-mono text-[10.5px] uppercase tracking-wider font-bold flex items-center gap-1.5 rounded-none transition-all shadow-xs cursor-pointer"
                  >
                    <span>OPEN LIVE WORKBOOK / PBIX</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {project.downloadUrl && (
                  <a
                    href={project.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFx.playClick()}
                    className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10.5px] uppercase tracking-wider font-bold flex items-center gap-1.5 rounded-none transition-all shadow-xs cursor-pointer"
                  >
                    <span>DOWNLOAD ASSET FILE</span>
                    <Download className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* ── TWO-COLUMN MAIN BODY: LEFT CASE NARRATIVE + RIGHT SQUARE PHOTO & TELEMETRY ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: DETAILED CASE STUDY NARRATIVE (7 COLS) */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* 1. Executive Summary */}
                <div className="space-y-1.5 bg-black/40 p-4 border border-white/10">
                  <h3 className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>EXECUTIVE CASE SUMMARY</span>
                  </h3>
                  <p className="text-xs sm:text-[13px] font-sans text-white/90 leading-relaxed font-normal">
                    {project.summary}
                  </p>
                </div>

                {/* 2. Objective & Bottleneck Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-3.5 bg-black/40 border border-white/10 space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                      <Target className="w-3 h-3 text-emerald-400" />
                      <span>THE OBJECTIVE</span>
                    </div>
                    <p className="text-xs font-sans text-white/80 leading-relaxed">
                      {project.objective}
                    </p>
                  </div>

                  <div className="p-3.5 bg-black/40 border border-white/10 space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#E0533C] font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-[#E0533C]" />
                      <span>THE CHALLENGE</span>
                    </div>
                    <p className="text-xs font-sans text-white/80 leading-relaxed">
                      {project.problem}
                    </p>
                  </div>
                </div>

                {/* 3. Technical Methodology & Approach */}
                <div className="space-y-2.5">
                  <h3 className="text-[11px] font-mono uppercase tracking-wider text-white/70 font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-white/70" />
                    <span>QUANTITATIVE METHODOLOGY & ARCHITECTURE</span>
                  </h3>
                  <div className="space-y-2">
                    {project.approach.map((step, idx) => (
                      <div key={idx} className="p-3 border border-white/10 bg-white/5 flex gap-2.5 items-start">
                        <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 border border-emerald-500/30 flex-shrink-0">
                          0{idx + 1}
                        </span>
                        <p className="text-xs font-sans text-white/90 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Deliverables & Results */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Deliverables */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-white/60 font-bold">
                      DELIVERABLES & ARTIFACTS:
                    </div>
                    <ul className="space-y-1.5">
                      {project.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-white/90 bg-black/40 p-2 border border-white/10">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quantified Impact */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                      VERIFIED IMPACT & ROI:
                    </div>
                    <ul className="space-y-1.5">
                      {project.results.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-emerald-300 bg-emerald-950/30 p-2 border border-emerald-500/25">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: SQUARE PHOTO + TELEMETRY CARD + CODE ENGINE (5 COLS) */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* SQUARE PHOTO FRAME (CLEAN & PROPORTIONATE) */}
                <div className="relative aspect-square w-full rounded-none overflow-hidden border-2 border-white/20 bg-black group shadow-xl">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between font-mono text-[9px] text-white">
                    <span className="bg-emerald-600 px-2 py-0.5 font-bold uppercase shadow-xs">
                      {project.category}
                    </span>
                    <span className="bg-black/80 px-2 py-0.5 border border-white/20 font-bold">
                      {project.year}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between font-mono text-[9px] text-white">
                    <span className="bg-black/90 px-2 py-0.5 border border-white/15 font-bold truncate max-w-[180px]">
                      {project.client}
                    </span>
                    <span className="bg-emerald-700 text-white font-bold px-2 py-0.5">
                      VERIFIED AUDIT
                    </span>
                  </div>
                </div>

                {/* KEY FINANCIAL TELEMETRY SUMMARY BOX */}
                <div className="p-3.5 bg-black/60 border border-white/15 space-y-2 text-xs font-mono">
                  <div className="text-[10px] text-white/50 uppercase font-bold border-b border-white/10 pb-1 flex items-center justify-between">
                    <span>CASE TELEMETRY METRICS</span>
                    <span className="text-emerald-400 font-bold">{project.impactMetric}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-white/40 block text-[9.5px]">DISCIPLINE:</span>
                      <span className="text-white font-bold">{project.category}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[9.5px]">DELIVERY YEAR:</span>
                      <span className="text-white font-bold">{project.year}</span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px]">
                    <span className="text-white/60">AUDIT STATUS:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      RECONCILED & ACTIVE
                    </span>
                  </div>
                </div>

                {/* CODE / FORMULA ENGINE SNIPPET */}
                {project.formulaOrCodeSnippet && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                      <div className="flex items-center gap-1">
                        <Code2 className="w-3 h-3" />
                        <span>QUANTITATIVE FORMULA ENGINE</span>
                      </div>
                      <span className="text-[9px] text-white/60 bg-white/10 px-1.5 py-0.5">
                        {project.formulaOrCodeSnippet.language}
                      </span>
                    </div>
                    <div className="p-3 bg-black border border-white/15 rounded-none font-mono text-[11px] text-emerald-300 overflow-x-auto shadow-inner">
                      <div className="text-[9px] text-white/50 mb-1 border-b border-white/10 pb-0.5">
                        // {project.formulaOrCodeSnippet.description}
                      </div>
                      <pre className="leading-relaxed whitespace-pre-wrap">{project.formulaOrCodeSnippet.code}</pre>
                    </div>
                  </div>
                )}

                {/* TECH STACK TAGS */}
                <div className="pt-1 flex flex-wrap items-center gap-1.5">
                  {project.tools.map((tool, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-white/10 text-white/90 font-mono text-[9.5px] font-bold border border-white/15">
                      #{tool}
                    </span>
                  ))}
                </div>

              </div>

            </div>

            {/* ── MODAL BOTTOM ACTION STRIP ── */}
            <div className="border-t border-white/15 pt-4 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => {
                  soundFx.playClick();
                  onContact();
                  onClose();
                }}
                className="w-full sm:w-auto py-2.5 px-5 bg-white text-black font-mono text-[11px] uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 hover:bg-[#E5E5EA] transition-all cursor-pointer shadow-md"
              >
                <span>DISCUSS FINANCIAL / ANALYTICS ADVISORY</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onClose();
                }}
                className="w-full sm:w-auto py-2.5 px-5 border border-white/25 text-white font-mono text-[11px] uppercase tracking-wider hover:bg-white/10 transition-all text-center cursor-pointer font-bold"
              >
                RETURN TO PORTFOLIO
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
