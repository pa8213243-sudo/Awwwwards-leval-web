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
import { ThreeCanvas } from './ThreeCanvas';
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
  const touchStartXRef = useRef<number | null>(null);

  // Highly optimized Scroll-driven pinned vertical timeline animation on desktop
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isTouch = typeof window !== 'undefined' && window.innerWidth <= 768;

    const ctx = gsap.context(() => {
      if (!isTouch) {
        const pinSpan = `${totalChapters * 70}vh`;

        let lastReportedProg = -1;
        const st = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: `+=${pinSpan}`,
          pin: true,
          pinSpacing: true,
          pinType: 'fixed',
          scrub: 0.35,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const prog = Math.min(1, Math.max(0, self.progress));
            const roundedProg = Math.round(prog * 100) / 100;
            if (roundedProg !== lastReportedProg) {
              lastReportedProg = roundedProg;
              setScrollProgress(roundedProg);
            }

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
      } else {
        // On mobile, use standard viewport progress tracker
        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 0.2,
          onUpdate: (self) => {
            setScrollProgress(Math.round(self.progress * 100) / 100);
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [totalChapters]);

  const currentChapter = CHAPTERS[activeChapterIdx];

  // Smoothly scroll or jump to a specific chapter marker's position
  const handleScrollToChapter = (idx: number) => {
    soundFx.playNav();
    setActiveChapterIdx(idx);

    const st = scrollTriggerRef.current;
    if (st) {
      const targetProgress = (idx + 0.1) / totalChapters;
      const targetScrollY = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        // Swiped left -> Next chapter
        if (activeChapterIdx < totalChapters - 1) {
          handleScrollToChapter(activeChapterIdx + 1);
        }
      } else {
        // Swiped right -> Prev chapter
        if (activeChapterIdx > 0) {
          handleScrollToChapter(activeChapterIdx - 1);
        }
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <section 
      ref={sectionRef} 
      id="chapters" 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full min-h-screen lg:h-screen bg-[#F3F2EE] text-[#111116] border-b border-black/10 select-none overflow-hidden transform-gpu"
    >
      {/* CONTEXTUAL PROFESSIONAL BACKGROUND PHOTO */}
      <SectionBackgroundLayer sectionKey="chapters" opacity={0.2} />

      {/* 3D DARK HIGH-CONTRAST CHRONOLOGY MATRIX WIREFRAME */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-45">
        <ThreeCanvas variant="timeline" />
      </div>

      {/* ELEGANT FIXED VERTICAL PROGRESS BAR ON RIGHT EDGE */}
      <VerticalSectionProgressBar targetId="chapters" accentColor="#E0533C" label="TIMELINE" sectionCode="02" isLightBg={true} />

      {/* Background Graphic Grid */}
      <div className="absolute inset-0 brutalist-grid opacity-15 pointer-events-none" />

      {/* TOP SCROLL-LOCK STATUS HUD */}
      <div className="sticky lg:absolute top-0 left-0 right-0 z-30 bg-[#F3F2EE]/95 border-b border-black/10 px-4 sm:px-8 py-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#444444]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[#111116] font-bold">TIMELINE // CHAPTER 0{activeChapterIdx + 1} OF 0{totalChapters}</span>
          <span className="hidden md:inline text-black/40">• SWIPE OR SELECT STAGE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-700 font-bold">{Math.round(scrollProgress * 100)}% COMPLETE</span>
          <div className="w-20 sm:w-24 h-1.5 bg-black/10 rounded-none overflow-hidden border border-black/20">
            <div 
              className="h-full bg-emerald-600 transition-all duration-100"
              style={{ width: `${Math.max(8, scrollProgress * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── STICKY CONTROLLED VIEWPORT STAGE ───────────────────────────── */}
      <div className="min-h-full w-full flex flex-col justify-between pt-6 lg:pt-12 pb-16 lg:pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        
        {/* ── TOP HEADER BAR: SCENE INFO & EDITORIAL DASHED QUOTE ──────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center border-b border-black/15 pb-2.5 w-full flex-shrink-0 mt-1">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="text-[10px] font-mono tracking-widest uppercase text-emerald-700 flex items-center gap-2 mb-0.5 font-bold">
              <span>[SCENE 02 // CAREER TIMELINE & CHRONOLOGY]</span>
              <span className="w-12 h-[1px] bg-emerald-600/40" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight uppercase text-[#111116]">
                FINANCIAL CAREER TIMELINE
              </span>
              <motion.span 
                layoutId="topStageIndicatorBadge"
                className="text-[9.5px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider text-white transition-colors shadow-xs"
                style={{ backgroundColor: currentChapter.accentColor }}
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              >
                STAGE 0{activeChapterIdx + 1} / 0{totalChapters}
              </motion.span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="border border-dashed border-black/25 p-2.5 bg-white rounded-none text-left shadow-xs">
              <p className="text-[10.5px] font-mono text-[#222222] font-bold leading-relaxed uppercase">
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
                      ? 'text-white font-bold border-transparent'
                      : 'border-black/15 text-[#444444] bg-white hover:text-black hover:bg-black/5'
                  }`}
                  title={chap.title}
                >
                  {/* MORPHING ACTIVE PILL BACKGROUND */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTimelineTabMorphPill"
                      className="absolute inset-0 bg-[#E0533C] z-[-1] shadow-xs"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span>0{idx + 1}.</span>
                  <span>{chap.shortLabel}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2.5 text-[10px] font-mono text-[#555555] bg-white px-2.5 py-1 border border-black/10">
            <span className="text-emerald-700 font-bold">100% RECONCILED</span>
            <span>•</span>
            <span className="text-[#E0533C] font-bold">IMA / CMA-GRADE</span>
          </div>
        </div>

        {/* ── MAIN STACK CONTAINER WITH VERTICAL SECTION SPINE ─────────── */}
        <div className="relative flex-1 w-full my-auto flex items-center justify-between gap-3 sm:gap-6 overflow-hidden py-1">
          
          {/* ── LEFT VERTICAL SECTION SPINE (Standing Striped Typography Masthead) ── */}
          <div className="hidden md:flex flex-col items-center justify-between py-4 px-2 bg-transparent min-h-[480px] max-h-[620px] flex-shrink-0 z-20 w-24 md:w-28 relative">
            
            {/* Vertical Striped Typography with dynamic top-to-bottom scroll fill */}
            <div className="flex-1 w-full flex items-center justify-center overflow-visible py-1 my-2">
              <StripedTypography
                text="chapters"
                progress={Math.round(scrollProgress * 100)}
                color="#E0533C"
                isVertical={true}
                isLightBg={true}
                className="w-full h-full min-h-[420px]"
              />
            </div>

            {/* Vertical live percentage progress bar */}
            <div className="flex flex-col items-center gap-1.5 pt-3 border-t border-black/10 font-mono text-[9px] w-full mt-2">
              <div className="w-1.5 h-12 bg-black/10 overflow-hidden relative">
                <div
                  className="w-full transition-all duration-150 absolute bottom-0 left-0 right-0"
                  style={{
                    height: `${Math.max(4, Math.round(scrollProgress * 100))}%`,
                    backgroundColor: '#E0533C',
                    boxShadow: '0 0 6px rgba(224,83,60,0.6)',
                  }}
                />
              </div>
              <span className="font-bold text-[9px] text-[#E0533C]">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>
          </div>

          {/* ── RIGHT COLUMN: SPACIOUS 2D MORPHING STORY CARD (HEIGHT-MATCHED TO SPINE) ── */}
          <div className="flex-1 h-full min-h-[500px] lg:min-h-[600px] relative flex items-stretch">
            
            {/* Stable GPU-accelerated Outer Card Shell */}
            <div className="w-full h-full bg-white border-2 border-dashed border-black/25 p-5 sm:p-7 md:p-8 shadow-md relative text-[#111116] flex flex-col justify-between overflow-y-auto overflow-x-hidden">
              <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-black" />
              <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-black" />
              
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
              <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-3 flex-shrink-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <motion.span
                    layoutId="activeChapterPeriodPill"
                    className="px-2.5 py-1 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-none transition-colors shadow-xs"
                    style={{ backgroundColor: currentChapter.accentColor }}
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  >
                    {currentChapter.period}
                  </motion.span>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 border border-emerald-500/30">
                    STAGE 0{activeChapterIdx + 1} OF 0{totalChapters}
                  </span>
                </div>

                {/* Prev / Next Quick Stepper */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleScrollToChapter(Math.max(0, activeChapterIdx - 1))}
                    disabled={activeChapterIdx === 0}
                    className="px-3 py-1 bg-[#F4F4F0] border border-black/15 text-[10.5px] font-mono text-[#333333] hover:bg-black/5 disabled:opacity-20 transition-all rounded-none cursor-pointer flex items-center gap-1 font-bold"
                    title="Previous Chapter"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>PREV</span>
                  </button>
                  <button
                    onClick={() => handleScrollToChapter(Math.min(totalChapters - 1, activeChapterIdx + 1))}
                    disabled={activeChapterIdx === totalChapters - 1}
                    className="px-3 py-1 bg-[#E0533C] hover:bg-[#c94530] border border-[#E0533C] text-[10.5px] font-mono font-bold text-white disabled:opacity-20 transition-all rounded-none cursor-pointer flex items-center gap-1 shadow-xs"
                    title="Next Chapter"
                  >
                    <span>NEXT</span>
                    <ChevronRight className="w-3.5 h-3.5" />
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
                  className="flex-1 flex flex-col justify-between overflow-hidden my-auto py-2"
                >
                  {/* Main Chapter Title & Subtitle */}
                  <div className="mb-3">
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111116] tracking-tight uppercase leading-tight">
                      {currentChapter.title}
                    </h3>
                    <p 
                      className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider mt-1"
                      style={{ color: currentChapter.accentColor }}
                    >
                      {currentChapter.subtitle}
                    </p>
                  </div>

                  {/* Narrative Description with Accent Spine */}
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <p 
                      className="text-xs sm:text-[14px] md:text-[14.5px] font-sans font-normal text-[#222222] leading-relaxed border-l-4 pl-4 bg-[#F9F9F7] p-3.5 rounded-none border-black/10 shadow-xs"
                      style={{ borderColor: currentChapter.accentColor }}
                    >
                      {currentChapter.description}
                    </p>

                    {/* 2-Column Details: Highlights & Primary Artifact */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-1">
                      
                      {/* Left: 4 Verified Competency Chips */}
                      <div className="md:col-span-7 space-y-2">
                        <div className="text-[10px] font-mono text-emerald-800 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>VERIFIED COMPETENCIES & MILESTONES</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {currentChapter.highlights.map((h, hIdx) => (
                            <div 
                              key={hIdx} 
                              className="px-2.5 py-2 bg-[#F5F5F2] border border-black/10 text-[11px] font-mono text-[#222222] flex items-start gap-2"
                            >
                              <span 
                                className="w-2 h-2 rounded-full mt-1 shrink-0" 
                                style={{ backgroundColor: currentChapter.accentColor }} 
                              />
                              <span className="leading-snug">{h}</span>
                            </div>
                          ))}
                        </div>

                        {/* Tool Stack Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                          <span className="text-[9px] font-mono text-[#666666] uppercase mr-1 font-bold">TECH STACK:</span>
                          {currentChapter.tools.map((tool, tIdx) => (
                            <span key={tIdx} className="px-2 py-0.5 bg-[#EAE8E2] text-[#111116] font-mono text-[10px] font-bold border border-black/10">
                              #{tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Primary Artifact & Governance Box */}
                      <div className="md:col-span-5 bg-[#F9F9F7] border-2 border-dashed border-black/20 p-4 space-y-3 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#444444] font-bold uppercase tracking-wider">
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                          <span>PRIMARY DELIVERABLE</span>
                        </div>
                        
                        <p className="font-mono text-xs sm:text-[14px] text-[#111116] font-extrabold uppercase leading-snug">
                          {currentChapter.primaryDeliverable}
                        </p>

                        <div className="pt-2 border-t border-black/10 flex items-center justify-between text-[10px] font-mono text-[#666666]">
                          <span>AUTHENTICATION:</span>
                          <span className="text-emerald-700 font-bold">VERIFIED 100%</span>
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


