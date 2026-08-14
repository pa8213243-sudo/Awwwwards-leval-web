import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, ArrowRight, FolderGit2, Sparkles, Calculator, Mail, Copy, Check, Printer, FileDown, Ruler, Sun, Moon } from 'lucide-react';
import { PROJECTS, PERSONAL_INFO } from '../data/portfolioData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenCopilot: () => void;
  onOpenCalculator: () => void;
  onOpenDrive: () => void;
  onOpenPrint: () => void;
  onCopyEmail: () => void;
  onToggleGuideRuler?: () => void;
  isGuideRulerOpen?: boolean;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenCopilot,
  onOpenCalculator,
  onOpenDrive,
  onOpenPrint,
  onCopyEmail,
  onToggleGuideRuler,
  isGuideRulerOpen = false,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchingProjects = PROJECTS.filter(
    p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
         p.tools.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sections = [
    { id: 'home', label: 'HOME', desc: 'Opening Statement & Hero View' },
    { id: 'work', label: 'WORK', desc: 'Selected Case Studies & Financial Models' },
    { id: 'dashboards', label: 'DASHBOARDS', desc: 'Power BI Executive Telemetry & DAX' },
    { id: 'journey', label: 'JOURNEY', desc: 'CMA Candidacy & Experience Timeline' },
    { id: 'skills', label: 'SKILLS', desc: 'Finance, Analytics & Strategy Architecture' },
    { id: 'certs', label: 'CERTS', desc: 'Verified Certifications (CMA, Power BI, CFI)' },
    { id: 'process', label: 'PROCESS', desc: '5-Stage Execution Methodology' },
    { id: 'contact', label: 'CONTACT', desc: 'Get in Touch with Parwej' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="w-full max-w-2xl bg-[#121214] border border-white/20 text-white rounded-sm overflow-hidden shadow-2xl"
      >
        {/* Search Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-black/60">
          <Search className="w-5 h-5 text-[#8E8E93]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects, financial models, skills, or navigate..."
            className="w-full bg-transparent text-sm font-mono text-white placeholder-[#8E8E93] focus:outline-none"
            autoFocus
          />
          <kbd className="px-2 py-0.5 bg-white/10 text-[10px] font-mono text-[#8E8E93] border border-white/10 rounded">
            ESC
          </kbd>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-6 font-mono text-xs">
          {/* Quick Action Tools */}
          {!searchTerm && (
            <div className="space-y-2">
              <div className="text-[10px] text-[#8E8E93] uppercase tracking-wider">QUICK ACTIONS</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* THEME SWITCHER TOGGLE */}
                {onToggleTheme && (
                  <button
                    onClick={() => {
                      onToggleTheme();
                    }}
                    className={`p-3 border flex items-center justify-between text-left rounded-sm cursor-pointer sm:col-span-2 transition-all ${
                      theme === 'light'
                        ? 'bg-amber-400/20 hover:bg-amber-400/30 border-amber-400/50 text-amber-300'
                        : 'bg-indigo-500/20 hover:bg-indigo-500/30 border-indigo-500/50 text-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {theme === 'light' ? (
                        <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                      ) : (
                        <Moon className="w-4 h-4 text-indigo-400" />
                      )}
                      <span className="font-bold">
                        {theme === 'light'
                          ? 'SWITCH TO OBSIDIAN DARK AESTHETIC'
                          : 'SWITCH TO HIGH-CONTRAST LIGHT MODE'}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-white/70" />
                  </button>
                )}

                <button
                  onClick={() => {
                    onOpenPrint();
                    onClose();
                  }}
                  className="p-3 bg-[#E0533C]/20 hover:bg-[#E0533C]/30 border border-[#E0533C]/40 flex items-center justify-between text-left rounded-sm cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Printer className="w-4 h-4 text-[#E0533C]" />
                    <span className="font-bold text-white">EXPORT PORTFOLIO AS PDF</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E0533C]" />
                </button>

                <button
                  onClick={() => {
                    onOpenCopilot();
                    onClose();
                  }}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-left rounded-sm cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>LAUNCH AI SARA</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8E8E93]" />
                </button>

                <button
                  onClick={() => {
                    onOpenCalculator();
                    onClose();
                  }}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-left rounded-sm cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-400" />
                    <span>FINANCIAL SIMULATOR</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8E8E93]" />
                </button>

                <button
                  onClick={() => {
                    onOpenDrive();
                    onClose();
                  }}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-left rounded-sm cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-emerald-400" />
                    <span>GOOGLE DRIVE REPOSITORY</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8E8E93]" />
                </button>

                <button
                  onClick={() => {
                    if (onToggleGuideRuler) onToggleGuideRuler();
                    onClose();
                  }}
                  className={`p-3 border flex items-center justify-between text-left rounded-sm cursor-pointer sm:col-span-2 ${
                    isGuideRulerOpen
                      ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/50 text-amber-300'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Ruler className={`w-4 h-4 ${isGuideRulerOpen ? 'text-amber-400' : 'text-cyan-400'}`} />
                    <span className="font-bold">
                      {isGuideRulerOpen ? 'DISABLE GUIDE RULER OVERLAY' : 'TOGGLE GUIDE RULER (25% / 50% / 75% MARKS)'}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8E8E93]" />
                </button>
              </div>
            </div>
          )}

          {/* Search Projects Results */}
          {searchTerm && (
            <>
              {('guide ruler align alignment scrolltrigger marks grid center'.includes(searchTerm.toLowerCase()) || searchTerm.toLowerCase().includes('ruler') || searchTerm.toLowerCase().includes('guide')) && (
                <div className="space-y-2 mb-3">
                  <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">ALIGNMENT & GUIDE COMMANDS</div>
                  <button
                    onClick={() => {
                      if (onToggleGuideRuler) onToggleGuideRuler();
                      onClose();
                    }}
                    className="w-full p-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 flex items-center justify-between text-left rounded-sm cursor-pointer"
                  >
                    <div>
                      <div className="text-white font-serif text-sm font-bold flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-cyan-400" />
                        <span>Toggle Visual Guide Ruler Overlay (25%, 50%, 75% Marks)</span>
                      </div>
                      <div className="text-[10px] text-cyan-200">Visually verify ScrollTrigger clamping alignment against visual content center</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              )}
              {('export pdf print download dossier resume cv document'.includes(searchTerm.toLowerCase()) || searchTerm.toLowerCase().includes('pdf') || searchTerm.toLowerCase().includes('print')) && (
                <div className="space-y-2 mb-3">
                  <div className="text-[10px] text-[#E0533C] uppercase tracking-wider font-bold">EXPORT / PRINT COMMANDS</div>
                  <button
                    onClick={() => {
                      onOpenPrint();
                      onClose();
                    }}
                    className="w-full p-3 bg-[#E0533C]/20 hover:bg-[#E0533C]/30 border border-[#E0533C]/50 flex items-center justify-between text-left rounded-sm cursor-pointer"
                  >
                    <div>
                      <div className="text-white font-serif text-sm font-bold flex items-center gap-2">
                        <Printer className="w-4 h-4 text-[#E0533C]" />
                        <span>Export Portfolio as Professional PDF / Print Dossier</span>
                      </div>
                      <div className="text-[10px] text-gray-300">Generates ink-optimized, publication-ready PDF with financial charts & timelines</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#E0533C]" />
                  </button>
                </div>
              )}

              {matchingProjects.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] text-[#8E8E93] uppercase tracking-wider">PROJECTS MATCHING "{searchTerm}"</div>
                  {matchingProjects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => {
                        onNavigate('work');
                        onClose();
                      }}
                      className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-left rounded-sm cursor-pointer"
                    >
                      <div>
                        <div className="text-white font-serif text-sm">{proj.title}</div>
                        <div className="text-[10px] text-[#8E8E93]">{proj.category} • {proj.impactMetric}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Navigation Items */}
          <div className="space-y-2">
            <div className="text-[10px] text-[#8E8E93] uppercase tracking-wider">NAVIGATE SECTIONS</div>
            <div className="space-y-1">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    onNavigate(sec.id);
                    onClose();
                  }}
                  className="w-full p-2.5 hover:bg-white/10 flex items-center justify-between text-left transition-colors"
                >
                  <div>
                    <span className="text-white font-bold tracking-widest uppercase mr-3">{sec.label}</span>
                    <span className="text-[#8E8E93] font-light hidden sm:inline">{sec.desc}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8E8E93]" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-black/80 border-t border-white/10 text-[10px] font-mono text-[#8E8E93] flex justify-between">
          <span>NAVIGATION OVERLAY</span>
          <span>PARVEJ PORTFOLIO</span>
        </div>
      </motion.div>
    </div>
  );
};
