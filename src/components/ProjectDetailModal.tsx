import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Code2, ArrowUpRight, Download, FileText, ExternalLink, ShieldCheck, Sparkles, Layers } from 'lucide-react';
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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundFx.playClick();
        onClose();
      }
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[99999] overflow-y-auto bg-black/94 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 md:p-10"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            soundFx.playClick();
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 25 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-[#111116] border-2 border-white/20 text-[#F8F9FA] rounded-none overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95)] my-auto max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Sticky Header Bar */}
          <div className="sticky top-0 z-30 bg-[#14141A]/95 backdrop-blur-md px-5 sm:px-8 py-3.5 border-b border-white/15 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <span className="px-2.5 py-1 bg-emerald-500 text-black font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-none">
                {project.category}
              </span>
              <span className="text-xs font-mono text-white/80 font-bold bg-white/10 px-2 py-0.5 border border-white/15">
                YEAR: {project.year}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold hidden sm:inline">
                • {project.impactMetric}
              </span>
            </div>
            
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-2 bg-white/10 hover:bg-[#E0533C] text-white hover:text-white border border-white/20 rounded-none transition-colors cursor-pointer flex items-center gap-1.5 font-mono text-xs uppercase"
              aria-label="Close modal"
            >
              <span className="hidden sm:inline font-bold">CLOSE</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-5 sm:p-8 md:p-10 overflow-y-auto space-y-8 font-sans flex-1">
            
            {/* Title & Tagline Header */}
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2 font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>CLIENT / SCOPE: {project.client} • VERIFIED FINANCIAL ARTIFACT</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight font-bold">
                {project.title}
              </h2>
              <p className="mt-3 text-sm sm:text-base md:text-lg font-normal text-white/80 leading-relaxed border-l-2 border-emerald-400 pl-3">
                {project.tagline || project.summary}
              </p>

              {/* Direct Link Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-5">
                {project.externalUrl && (
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFx.playClick()}
                    className="py-2.5 px-5 bg-[#E0533C] hover:bg-[#c94530] text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2 rounded-none transition-all shadow-md cursor-pointer"
                  >
                    <span>OPEN LIVE WORKBOOK / PBIX</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {project.downloadUrl && (
                  <a
                    href={project.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFx.playClick()}
                    className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2 rounded-none transition-all shadow-md cursor-pointer"
                  >
                    <span>DOWNLOAD ASSET FILE</span>
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Feature Hero Preview Image Frame */}
            <div className="relative aspect-[16/9] w-full overflow-hidden border-2 border-white/20 bg-black group shadow-2xl">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end justify-between p-4 sm:p-6 pointer-events-none">
                <div className="flex items-center gap-2 bg-black/85 px-3 py-1.5 border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    IMPACT: {project.impactMetric}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-white/70 bg-black/80 px-2 py-1 border border-white/15 font-bold">
                  VERIFIED AUDIT
                </div>
              </div>
            </div>

            {/* Problem & Objective Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/15 pt-6">
              <div className="space-y-2.5 bg-black/50 p-4 border border-white/10">
                <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
                  <span>THE OBJECTIVE</span>
                </h3>
                <p className="text-xs sm:text-sm font-normal text-white/90 leading-relaxed">
                  {project.objective}
                </p>
              </div>

              <div className="space-y-2.5 bg-black/50 p-4 border border-white/10">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#E0533C] font-bold flex items-center gap-1.5">
                  <span>THE CHALLENGE & BOTTLENECK</span>
                </h3>
                <p className="text-xs sm:text-sm font-normal text-white/90 leading-relaxed">
                  {project.problem}
                </p>
              </div>
            </div>

            {/* Technical Approach & Methodology */}
            <div className="space-y-3 border-t border-white/15 pt-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-white/70 font-bold">
                STRATEGIC APPROACH & QUANTITATIVE METHODOLOGY
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {project.approach.map((step, idx) => (
                  <div key={idx} className="p-3.5 border border-white/15 bg-white/5 flex gap-2.5 items-start">
                    <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 border border-emerald-500/30">
                      0{idx + 1}
                    </span>
                    <p className="text-xs font-normal text-white/90 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Snippet / Formula Engine Preview */}
            {project.formulaOrCodeSnippet && (
              <div className="space-y-3 border-t border-white/15 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                    <Code2 className="w-4 h-4" />
                    <span>QUANTITATIVE FORMULA / DAX ENGINE</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/80 font-bold uppercase bg-white/10 px-2 py-0.5">
                    {project.formulaOrCodeSnippet.language}
                  </span>
                </div>
                <div className="p-4 bg-black border border-white/20 rounded-none font-mono text-xs text-emerald-300 overflow-x-auto shadow-inner">
                  <div className="text-[10px] text-white/60 mb-2 border-b border-white/10 pb-1 font-bold">
                    // {project.formulaOrCodeSnippet.description}
                  </div>
                  <pre className="leading-relaxed">{project.formulaOrCodeSnippet.code}</pre>
                </div>
              </div>
            )}

            {/* Deliverables & Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/15 pt-6">
              <div className="space-y-2.5">
                <h3 className="text-xs font-mono uppercase tracking-widest text-white/70 font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-white/70" />
                  <span>INCLUDED DELIVERABLES & ARTIFACTS</span>
                </h3>
                <ul className="space-y-2">
                  {project.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-white font-medium bg-black/40 p-2 border border-white/10">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>VERIFIED RESULTS & BUSINESS IMPACT</span>
                </h3>
                <ul className="space-y-2">
                  {project.results.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-emerald-300 font-medium bg-emerald-950/30 p-2 border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tools Used Tags */}
            <div className="border-t border-white/15 pt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-white/60 font-bold uppercase mr-2">TOOL STACK:</span>
              {project.tools.map((tool, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-white/10 text-white font-mono text-xs font-bold border border-white/15">
                  #{tool}
                </span>
              ))}
            </div>

            {/* Modal Bottom CTAs */}
            <div className="border-t border-white/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => {
                  soundFx.playClick();
                  onContact();
                  onClose();
                }}
                className="w-full sm:w-auto py-3 px-6 bg-white text-black font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-[#E5E5EA] transition-all cursor-pointer shadow-lg"
              >
                <span>DISCUSS FINANCIAL / ANALYTICS PROJECT</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onClose();
                }}
                className="w-full sm:w-auto py-3 px-6 border border-white/25 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-center cursor-pointer font-bold"
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

