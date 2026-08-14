import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, ArrowUpRight, Award, CheckCircle2, ChevronRight, Layers, Sparkles, FolderCheck, ShieldCheck } from 'lucide-react';
import { SectionProgressHeader } from './SectionProgressHeader';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { soundFx } from '../lib/sound';

export interface ChapterItem {
  id: string;
  chapterNumber: string;
  title: string;
  subtitle: string;
  period: string;
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
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const totalChapters = CHAPTERS.length;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isTouch = typeof window !== 'undefined' && (window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: isTouch ? 'top 80%' : 'top top',
        end: isTouch ? 'bottom 20%' : `+=${totalChapters * 110}%`,
        pin: !isTouch,
        pinSpacing: !isTouch,
        scrub: isTouch ? 0.3 : 0.6,
        anticipatePin: isTouch ? 0 : 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
          const rawIdx = Math.floor(self.progress * totalChapters);
          const safeIdx = Math.min(totalChapters - 1, Math.max(0, rawIdx));
          setActiveChapterIdx(safeIdx);
        },
      });
    }, section);

    return () => ctx.revert();
  }, [totalChapters]);

  const currentChapter = CHAPTERS[activeChapterIdx];

  const handleSelectChapter = (idx: number) => {
    soundFx.playClick();
    setActiveChapterIdx(idx);
    setIsExpanded(true);
  };

  return (
    <section 
      ref={sectionRef} 
      id="chapters" 
      className="relative w-full min-h-screen bg-[#08080C] text-white border-b border-white/10 select-none overflow-hidden flex flex-col justify-between py-6 md:py-8 px-4 sm:px-6 md:px-12"
    >
      {/* ELEGANT FIXED VERTICAL PROGRESS BAR ON RIGHT EDGE */}
      <VerticalSectionProgressBar targetId="chapters" accentColor="#E0533C" label="CHAPTERS" sectionCode="02" />

      {/* Background Graphic Grid */}
      <div className="absolute inset-0 brutalist-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full space-y-4 my-auto relative z-10 flex flex-col justify-between h-full">
        
        {/* HEADER SECTION WITH STICKY LIVE PROGRESS BAR */}
        <SectionProgressHeader
          sceneCode="[SCENE 02 // CAREER TIMELINE & CHAPTERS]"
          title="TIMELINE"
          subtitle="Interactive Chapter Composition & Financial Engineering Architecture"
          badge={`CHAPTER 0${activeChapterIdx + 1} / 0${totalChapters}`}
          accentColor="#E0533C"
          sectionId="chapters"
          isSticky={true}
        />

        {/* A-LIGN INSPIRED DASHED BOUNDING FRAME & CHAPTER STRIP */}
        <div className="relative p-3 sm:p-5 border border-dashed border-white/20 rounded-none bg-black/40 space-y-4 shadow-2xl backdrop-blur-md">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-2 font-mono text-[10px] sm:text-xs tracking-widest text-white/50 uppercase">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PINNED TIMELINE // SCROLL TO ADVANCE (OR CLICK CHAPTER)</span>
            </div>
            <span>STAGE 0{activeChapterIdx + 1} OF 0{totalChapters}</span>
          </div>

          {/* CHAPTER STRIP CONTROLLER CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {CHAPTERS.map((chap, idx) => {
              const isActive = activeChapterIdx === idx;
              return (
                <div
                  key={chap.id}
                  onClick={() => handleSelectChapter(idx)}
                  className={`p-3 sm:p-4 rounded-none transition-all duration-300 cursor-pointer flex flex-col justify-between border shadow-lg relative min-h-[90px] sm:min-h-[110px] ${
                    isActive
                      ? 'bg-[#14141A] border-2 border-emerald-400 text-white shadow-emerald-950/40 scale-[1.02] ring-1 ring-emerald-500/30'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-none"
                      style={{
                        backgroundColor: isActive ? chap.accentColor : 'rgba(255,255,255,0.1)',
                        color: '#FFFFFF',
                      }}
                    >
                      CH 0{idx + 1}
                    </span>

                    <div
                      className={`w-5 h-5 rounded-none flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-emerald-500 text-black font-bold shadow-xs'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {isActive ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-white/50" />
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs sm:text-sm font-bold tracking-tight uppercase line-clamp-1">
                      {chap.title}
                    </h4>
                    <p className="text-[10px] font-sans text-white/50 truncate">
                      {chap.subtitle}
                    </p>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="activeChapterBar"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-400"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* ACTIVE CHAPTER DETAIL SCENE DISPLAY */}
          <AnimatePresence mode="wait">
            {isExpanded && currentChapter && (
              <motion.div
                key={currentChapter.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-[#121217] border border-white/20 p-4 sm:p-6 rounded-none shadow-2xl relative text-white"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className="px-2.5 py-0.5 text-white font-mono text-[10px] font-bold rounded-none"
                      style={{ backgroundColor: currentChapter.accentColor }}
                    >
                      {currentChapter.period}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-white tracking-tight uppercase">
                      {currentChapter.title} — <span className="text-white/60 text-base">{currentChapter.subtitle}</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <button
                      onClick={() => handleSelectChapter(Math.max(0, activeChapterIdx - 1))}
                      disabled={activeChapterIdx === 0}
                      className="px-2.5 py-1 bg-white/5 border border-white/10 text-[10px] font-mono text-white/80 hover:bg-white/10 disabled:opacity-30 rounded-none cursor-pointer"
                    >
                      ← PREV
                    </button>
                    <button
                      onClick={() => handleSelectChapter(Math.min(CHAPTERS.length - 1, activeChapterIdx + 1))}
                      disabled={activeChapterIdx === CHAPTERS.length - 1}
                      className="px-2.5 py-1 bg-white/5 border border-white/10 text-[10px] font-mono text-white/80 hover:bg-white/10 disabled:opacity-30 rounded-none cursor-pointer"
                    >
                      NEXT →
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  
                  {/* Left Column: Description & Highlights */}
                  <div className="md:col-span-7 space-y-4">
                    <p className="text-xs sm:text-sm font-light text-white/80 leading-relaxed border-l-2 border-emerald-500 pl-3 bg-white/[0.02] p-3 rounded-none">
                      {currentChapter.description}
                    </p>

                    <div className="space-y-2">
                      <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-2 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>VERIFIED COMPETENCIES & HIGHLIGHTS</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentChapter.highlights.map((h, hIdx) => (
                          <div key={hIdx} className="px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-none text-[11px] font-mono text-white/80 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 flex-shrink-0" />
                            <span className="line-clamp-2">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[9px] font-mono text-white/40 uppercase mr-1">TOOL STACK:</span>
                      {currentChapter.tools.map((tool, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 bg-white/10 text-white font-mono text-[10px] rounded-none border border-white/15">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Artifact & Deliverable Box */}
                  <div className="md:col-span-5 bg-black/60 border border-white/15 p-4 rounded-none space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                      <FolderCheck className="w-3.5 h-3.5" />
                      <span>PRIMARY ARTIFACT / DELIVERABLE</span>
                    </div>
                    
                    <div className="text-sm font-mono text-white font-semibold leading-snug bg-black/80 p-3 rounded-none border border-white/10">
                      {currentChapter.primaryDeliverable}
                    </div>

                    <div className="pt-1 text-[10px] font-mono text-white/50 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>GOVERNANCE:</span>
                        <span className="text-emerald-300 font-semibold">IMA / CMA-GRADE</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>VERIFICATION:</span>
                        <span className="text-white">AUTHENTICATED</span>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
};

