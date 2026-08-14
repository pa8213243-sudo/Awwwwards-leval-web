import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown, 
  FolderCheck, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Layers,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Database,
  Briefcase
} from 'lucide-react';
import { StripedTypography } from './StripedTypography';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
import { SectionBackgroundLayer } from './SectionBackgroundLayer';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { soundFx } from '../lib/sound';

export interface ChapterItem {
  id: string;
  chapterNumber: string;
  title: string;
  subtitle: string;
  period: string;
  shortLabel: string;
  description: string;
  highlights: string[];
  tools: string[];
  primaryDeliverable: string;
  accentColor: string;
}

const CHAPTERS: ChapterItem[] = [
  {
    id: 'chap-1',
    chapterNumber: '01',
    title: 'FOUNDATION & CMA',
    subtitle: 'Academic Merit & Accounting Rigor',
    period: 'CHAPTER 01 // FOUNDATION',
    shortLabel: 'FOUNDATION',
    description: 'Cleared CMA USA Part 1 on 1st attempt with a score of 380/500. Formed foundational mastery across financial reporting, planning, performance management, variance analysis, and internal controls under global IMA standards.',
    highlights: [
      'CMA USA Part 1 Cleared (Merit Score: 380/500)',
      'US GAAP & IFRS Financial Statement Synthesis',
      'Cost Accounting & Activity-Based Costing (ABC)',
      'Internal Controls & Governance Framework'
    ],
    tools: ['US GAAP', 'IFRS', 'IMA Standards', 'Variance Analysis', 'Internal Audit'],
    primaryDeliverable: 'CMA USA Part 1 Score Report (380/500) & Financial Reporting SOP',
    accentColor: '#10B981',
  },
  {
    id: 'chap-2',
    chapterNumber: '02',
    title: 'FINANCIAL MODELING',
    subtitle: '3-Statement Projections & DCF Valuation',
    period: 'CHAPTER 02 // FINANCIAL MODELING',
    shortLabel: 'MODELING',
    description: 'Engineered 25+ integrated 3-statement financial models, venture capital cash flow schedules, Capex sensitivity workbooks, and Monte Carlo risk simulations for corporate valuation and investment committee review.',
    highlights: [
      'Integrated 3-Statement Dynamic Excel Models',
      'DCF Cash Flow Valuation & WACC Derivation',
      'Scenario Managers (Bull / Base / Bear)',
      'Venture Capital Cap Table Dilution Schedules'
    ],
    tools: ['Advanced Excel', 'Financial Modeling', 'WACC & CAPM', 'Monte Carlo', 'Sensitivity Matrices'],
    primaryDeliverable: 'VC & Corporate Financial Valuation Models (.xlsx)',
    accentColor: '#E0533C',
  },
  {
    id: 'chap-3',
    chapterNumber: '03',
    title: 'DATA ANALYTICS & DAX',
    subtitle: 'Power BI Telemetry & Power Query M',
    period: 'CHAPTER 03 // ANALYTICS & DAX',
    shortLabel: 'ANALYTICS',
    description: 'Architected enterprise Power BI dashboards processing 1M+ transactions using Star Schema data modeling, custom DAX time-intelligence calculations, and automated Power Query M ingestion scripts.',
    highlights: [
      'Star Schema Relational Data Architecture',
      'Advanced DAX Time Intelligence & Dynamic Measures',
      'Power Query M Data Cleaning Pipelines',
      'Row-Level Security (RLS) & Telemetry Governance'
    ],
    tools: ['Power BI', 'DAX', 'Power Query M', 'SQL Server', 'Star Schema'],
    primaryDeliverable: 'Multi-Entity Executive P&L Telemetry Suite',
    accentColor: '#3B82F6',
  },
  {
    id: 'chap-4',
    chapterNumber: '04',
    title: 'EXECUTED CASE STUDIES',
    subtitle: 'Corporate Decks & Android Release',
    period: 'CHAPTER 04 // EXECUTED PROJECTS',
    shortLabel: 'CASE STUDIES',
    description: 'Delivered executive board presentations for BMW Group, Tesla, Apple, and M&A valuation advisory, alongside building and deploying a native Android app release (v1.0.0 APK) for mobile financial calculations.',
    highlights: [
      'BMW & Tesla Corporate Strategy Presentations',
      'Latham & Watkins M&A Deal Valuation Simulation',
      'Parvej Portfolio Android Mobile App (APK v1.0.0)',
      'Netlify Deployed Interactive Web Platforms'
    ],
    tools: ['PowerPoint', 'Android APK', 'React / TypeScript', 'Forage M&A'],
    primaryDeliverable: 'BMW Strategy Deck (.pptx) & Native Android App (.apk)',
    accentColor: '#8B5CF6',
  },
  {
    id: 'chap-5',
    chapterNumber: '05',
    title: 'STRATEGIC DIRECTION',
    subtitle: 'FP&A Advisory & Executive Telemetry',
    period: 'CHAPTER 05 // STRATEGIC DIRECTION',
    shortLabel: 'STRATEGY',
    description: 'Bridging financial precision with executive decision-making. Providing C-suite leaders with real-time rolling forecasts, variance alerts, and strategic capital allocation insights.',
    highlights: [
      'Rolling Forecast & Variance Alert Systems',
      'C-Suite Strategy Presentations & Board Briefings',
      'Cost Center Overhead Allocation Frameworks',
      'Automated Data Workflows & Executive SOPs'
    ],
    tools: ['FP&A Advisory', 'Executive SOPs', 'Rolling Forecasts', 'Capital Allocation'],
    primaryDeliverable: 'C-Suite Strategy Deck & Automated Variance SOP',
    accentColor: '#F59E0B',
  },
];

export const ChapterTimeline: React.FC = () => {
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<globalThis.ScrollTrigger | null>(null);
  const lastChapterRef = useRef<number>(0);
  const totalChapters = CHAPTERS.length;

  // Highly optimized Scroll-driven pinned vertical timeline animation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const ctx = gsap.context(() => {
      const pinSpan = isTouch ? `${totalChapters * 70}vh` : `${totalChapters * 60}vh`;

      let lastReportedProg = -1;
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${pinSpan}`,
        pin: true,
        pinSpacing: true,
        pinType: isTouch ? 'transform' : 'fixed',
        scrub: isTouch ? 0.25 : 0.35,
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const prog = Math.min(1, Math.max(0, self.progress));
          // Throttle state update to avoid CPU throttling on budget hardware
          const roundedProg = Math.round(prog * 100) / 100;
          if (roundedProg !== lastReportedProg) {
            lastReportedProg = roundedProg;
            setScrollProgress(roundedProg);
          }

          // Calculate active chapter index based on continuous progress
          const rawIdx = Math.floor(prog * totalChapters);
          const safeIdx = Math.min(totalChapters - 1, Math.max(0, rawIdx));

          if (safeIdx !== lastChapterRef.current) {
            soundFx.triggerSectionMilestone('chapters', safeIdx, 420 + safeIdx * 70);
            lastChapterRef.current = safeIdx;
            setActiveChapterIdx(safeIdx);
          }
        },
      });

      scrollTriggerRef.current = st;
    }, section);

    return () => ctx.revert();
  }, [totalChapters]);

  const currentChapter = CHAPTERS[activeChapterIdx];

  // Smoothly scroll the page to a specific chapter marker's progress position
  const handleScrollToChapter = (idx: number) => {
    soundFx.playNav();
    setActiveChapterIdx(idx);

    const st = scrollTriggerRef.current;
    if (!st) return;

    const targetProgress = (idx + 0.1) / totalChapters;
    const targetScrollY = st.start + targetProgress * (st.end - st.start);

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  };

  return (
    <section 
      ref={sectionRef} 
      id="chapters" 
      className="relative w-full h-screen bg-[#08080C] text-white border-b border-white/10 select-none overflow-hidden transform-gpu"
    >
      {/* CONTEXTUAL PROFESSIONAL BACKGROUND PHOTO (Optimized opacity) */}
      <SectionBackgroundLayer sectionKey="chapters" opacity={0.3} />

      {/* ELEGANT FIXED VERTICAL PROGRESS BAR ON RIGHT EDGE */}
      <VerticalSectionProgressBar targetId="chapters" accentColor="#E0533C" label="TIMELINE" sectionCode="02" />

      {/* Background Graphic Grid */}
      <div className="absolute inset-0 brutalist-grid opacity-20 pointer-events-none" />

      {/* TOP SCROLL-LOCK STATUS HUD */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-[#0A0A0E] border-b border-white/10 px-4 sm:px-8 py-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/70">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-bold">SCROLL TIMELINE // CHAPTER 0{activeChapterIdx + 1} OF 0{totalChapters}</span>
          <span className="hidden md:inline text-white/40">• SCROLL TO ADVANCE NARRATIVE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold">{Math.round(scrollProgress * 100)}% COMPLETE</span>
          <div className="w-20 sm:w-24 h-1.5 bg-white/10 rounded-none overflow-hidden border border-white/20">
            <div 
              className="h-full bg-emerald-400 transition-all duration-100"
              style={{ width: `${Math.max(8, scrollProgress * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── STICKY CONTROLLED VIEWPORT STAGE ───────────────────────────── */}
      <div className="h-full w-full flex flex-col justify-between pt-12 pb-24 sm:pb-28 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        
        {/* ── TOP HEADER BAR: SCENE INFO & EDITORIAL DASHED QUOTE ──────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center border-b border-white/15 pb-2.5 w-full flex-shrink-0 mt-1">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 flex items-center gap-2 mb-0.5 font-bold">
              <span>[SCENE 02 // CAREER TIMELINE & CHRONOLOGY]</span>
              <span className="w-12 h-[1px] bg-emerald-500/40" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight uppercase text-white">
                FINANCIAL CAREER TIMELINE
              </span>
              <motion.span 
                layoutId="topStageIndicatorBadge"
                className="text-[9.5px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider text-black transition-colors"
                style={{ backgroundColor: currentChapter.accentColor }}
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              >
                STAGE 0{activeChapterIdx + 1} / 0{totalChapters}
              </motion.span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="border border-dashed border-white/30 p-2.5 bg-[#0C0C12] rounded-none text-left shadow-lg">
              <p className="text-[10.5px] font-mono text-white/90 font-bold leading-relaxed uppercase">
                FROM CMA RIGOR TO 3-STATEMENT MODELING, ENTERPRISE DAX TELEMETRY & STRATEGIC C-SUITE FP&A ADVISORY.
              </p>
            </div>
          </div>
        </div>

        {/* ── CHAPTER SELECTOR TABS WITH POWERPOINT-STYLE MORPH PILL ───── */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1.5 flex-shrink-0">
          <div className="flex flex-wrap gap-1.5 relative">
            {CHAPTERS.map((chap, idx) => {
              const isActive = activeChapterIdx === idx;
              return (
                <button
                  key={chap.id}
                  onClick={() => handleScrollToChapter(idx)}
                  className={`relative px-3 py-1 text-[10px] font-mono uppercase tracking-wider transition-all rounded-none cursor-pointer flex items-center gap-1.5 border z-10 ${
                    isActive
                      ? 'text-black font-bold border-transparent'
                      : 'border-white/15 text-white/70 bg-white/5 hover:text-white hover:bg-white/10'
                  }`}
                  title={chap.title}
                >
                  {/* MORPHING ACTIVE PILL BACKGROUND */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTimelineTabMorphPill"
                      className="absolute inset-0 bg-emerald-400 z-[-1] shadow-md"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span>0{idx + 1}.</span>
                  <span>{chap.shortLabel}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2.5 text-[10px] font-mono text-white/50 bg-[#0E0E14] px-2.5 py-1 border border-white/10">
            <span className="text-emerald-400 font-bold">100% RECONCILED</span>
            <span>•</span>
            <span className="text-[#E0533C] font-bold">IMA / CMA-GRADE</span>
          </div>
        </div>

        {/* ── MAIN STACK CONTAINER WITH VERTICAL SECTION SPINE ─────────── */}
        <div className="relative flex-1 w-full my-auto flex items-center justify-between gap-3 sm:gap-6 overflow-hidden py-1">
          
          {/* ── LEFT VERTICAL SECTION SPINE (Standing Striped Typography & Nodes) ── */}
          <div className="hidden md:flex flex-col items-center justify-between py-2.5 px-2 bg-[#0C0C12] border border-[#E0533C]/35 h-full max-h-[440px] flex-shrink-0 z-20 shadow-xl w-14">
            
            {/* Vertical Striped Typography with dynamic top-to-bottom scroll fill */}
            <div className="w-10 h-36 flex items-center justify-center overflow-hidden">
              <StripedTypography
                text="timeline"
                progress={Math.round(scrollProgress * 100)}
                color="#E0533C"
                isVertical={true}
                className="w-full h-full"
              />
            </div>

            {/* Vertical Stage Step Nodes (01 -> 05) with Morphing Indicator */}
            <div className="flex flex-col items-center gap-1.5 my-auto py-1 relative">
              <div className="w-[1px] h-5 bg-gradient-to-b from-transparent via-[#E0533C]/50 to-[#E0533C]" />
              {CHAPTERS.map((chap, idx) => {
                const isActive = activeChapterIdx === idx;
                const isPast = idx < activeChapterIdx;

                return (
                  <button
                    key={chap.id}
                    onClick={() => handleScrollToChapter(idx)}
                    className={`relative w-6 h-6 flex items-center justify-center font-mono text-[9.5px] font-bold border transition-all cursor-pointer z-10 ${
                      isActive
                        ? 'text-white border-transparent'
                        : isPast
                        ? 'bg-[#0A1A12] border-emerald-500/40 text-emerald-400'
                        : 'bg-black/60 text-white/50 border-white/20 hover:border-[#E0533C]/50 hover:text-white'
                    }`}
                    title={chap.title}
                  >
                    {/* MORPHING NODE ACTIVE GLOW */}
                    {isActive && (
                      <motion.div
                        layoutId="activeSpineNodeMorphPill"
                        className="absolute inset-0 bg-[#E0533C] z-[-1] shadow-[0_0_10px_rgba(224,83,60,0.8)]"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    {isPast ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <span>0{idx + 1}</span>
                    )}
                  </button>
                );
              })}
              <div className="w-[1px] h-5 bg-gradient-to-b from-[#E0533C] via-[#E0533C]/50 to-transparent" />
            </div>

            {/* Vertical live percentage progress bar */}
            <div className="flex flex-col items-center gap-0.5 pt-1 border-t border-white/10 font-mono text-[9px]">
              <div className="w-1.5 h-8 bg-white/15 overflow-hidden relative">
                <div
                  className="w-full transition-all duration-100 absolute bottom-0 left-0 right-0"
                  style={{
                    height: `${Math.max(6, Math.round(scrollProgress * 100))}%`,
                    backgroundColor: '#E0533C',
                    boxShadow: '0 0 6px #E0533C',
                  }}
                />
              </div>
              <span className="font-bold text-[8.5px] text-[#E0533C]">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>
          </div>

          {/* ── RIGHT COLUMN: SPACIOUS 2D MORPHING STORY CARD ───────────── */}
          <div className="flex-1 h-full max-h-[440px] relative flex items-center">
            
            {/* Stable GPU-accelerated Outer Card Shell */}
            <div className="w-full h-full bg-[#101016] border-2 border-white/20 p-4 sm:p-6 shadow-2xl relative text-white flex flex-col justify-between overflow-hidden">
              
              {/* MORPHING CORNER BRACKETS */}
              <motion.div 
                layoutId="cardCornerBracketTopRight"
                className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 z-20 pointer-events-none transition-colors"
                style={{ borderColor: currentChapter.accentColor }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
              <div 
                className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 z-20 pointer-events-none border-[#10B981]"
              />

              {/* Top Chapter Metadata & Stepper Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2.5 flex-shrink-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <motion.span
                    layoutId="activeChapterPeriodPill"
                    className="px-2 py-0.5 text-black font-mono text-[9.5px] font-bold uppercase tracking-wider rounded-none transition-colors"
                    style={{ backgroundColor: currentChapter.accentColor }}
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  >
                    {currentChapter.period}
                  </motion.span>
                  <span className="text-[9.5px] font-mono text-emerald-400 font-bold bg-[#08080C] px-2 py-0.5 border border-emerald-500/30">
                    STAGE 0{activeChapterIdx + 1} OF 0{totalChapters}
                  </span>
                </div>

                {/* Prev / Next Quick Stepper */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleScrollToChapter(Math.max(0, activeChapterIdx - 1))}
                    disabled={activeChapterIdx === 0}
                    className="px-2.5 py-1 bg-white/5 border border-white/15 text-[10px] font-mono text-white/80 hover:bg-white/15 disabled:opacity-20 transition-all rounded-none cursor-pointer flex items-center gap-1"
                    title="Previous Chapter"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    <span>PREV</span>
                  </button>
                  <button
                    onClick={() => handleScrollToChapter(Math.min(totalChapters - 1, activeChapterIdx + 1))}
                    disabled={activeChapterIdx === totalChapters - 1}
                    className="px-2.5 py-1 bg-[#E0533C] hover:bg-[#c94530] border border-[#E0533C] text-[10px] font-mono font-bold text-white disabled:opacity-20 transition-all rounded-none cursor-pointer flex items-center gap-1 shadow-md"
                    title="Next Chapter"
                  >
                    <span>NEXT</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* ── 2D SLIDE & MORPH CONTENT BODY ───────────────────────── */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentChapter.id}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
                  className="flex-1 flex flex-col justify-between overflow-hidden"
                >
                  {/* Main Chapter Title & Subtitle */}
                  <div className="mb-2">
                    <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight uppercase leading-tight">
                      {currentChapter.title}
                    </h3>
                    <p 
                      className="font-mono text-xs sm:text-[13px] font-semibold uppercase tracking-wider mt-0.5"
                      style={{ color: currentChapter.accentColor }}
                    >
                      {currentChapter.subtitle}
                    </p>
                  </div>

                  {/* Narrative Description with Accent Spine */}
                  <div className="space-y-2.5 flex-1 flex flex-col justify-between">
                    <p 
                      className="text-xs sm:text-[12.5px] font-light text-white/90 leading-relaxed border-l-2 pl-3 bg-[#0A0A10] p-2.5 rounded-none"
                      style={{ borderColor: currentChapter.accentColor }}
                    >
                      {currentChapter.description}
                    </p>

                    {/* 2-Column Details: Highlights & Primary Artifact */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                      
                      {/* Left: 4 Verified Competency Chips */}
                      <div className="md:col-span-7 space-y-1.5">
                        <div className="text-[9.5px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>VERIFIED COMPETENCIES & MILESTONES</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {currentChapter.highlights.map((h, hIdx) => (
                            <div 
                              key={hIdx} 
                              className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] font-mono text-white/90 flex items-start gap-1.5"
                            >
                              <span 
                                className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" 
                                style={{ backgroundColor: currentChapter.accentColor }} 
                              />
                              <span className="leading-snug line-clamp-2">{h}</span>
                            </div>
                          ))}
                        </div>

                        {/* Tool Stack Tags */}
                        <div className="flex flex-wrap items-center gap-1 pt-0.5">
                          <span className="text-[8.5px] font-mono text-white/40 uppercase mr-1">TECH STACK:</span>
                          {currentChapter.tools.map((tool, tIdx) => (
                            <span key={tIdx} className="px-1.5 py-0.5 bg-white/10 text-white font-mono text-[9px] border border-white/15">
                              #{tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Primary Artifact & Governance Box */}
                      <div className="md:col-span-5 bg-[#08080C] border border-white/15 p-2.5 space-y-2">
                        <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                          <FolderCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>PRIMARY ARTIFACT</span>
                        </div>
                        
                        <div className="text-[11px] font-mono text-white font-bold leading-snug bg-[#121218] p-2 border border-white/10">
                          {currentChapter.primaryDeliverable}
                        </div>

                        <div className="pt-0.5 text-[9px] font-mono text-white/60 space-y-0.5">
                          <div className="flex items-center justify-between border-b border-white/10 pb-0.5">
                            <span>GOVERNANCE:</span>
                            <span className="text-emerald-300 font-semibold">IMA / CMA-GRADE</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>AUTHENTICATION:</span>
                            <span className="text-white font-bold">VERIFIED 100%</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};


