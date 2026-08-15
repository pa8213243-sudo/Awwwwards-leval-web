import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Target, 
  ArrowRight,
  Maximize2,
  Grid
} from 'lucide-react';
import { StripedTypography } from './StripedTypography';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
import { SectionBackgroundLayer } from './SectionBackgroundLayer';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { soundFx } from '../lib/sound';

export interface ValueItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  tags: string[];
  description: string;
  deliverable: string;
  accentColor: string;
  image: string;
  metric: string;
}

const CORE_VALUES: ValueItem[] = [
  {
    id: 'val-1',
    number: '01',
    title: 'PRECISION',
    subtitle: 'Zero-Tolerance Reconciliation',
    tags: ['WACC SENSITIVITY', '3-STATEMENT LINKAGE', 'FORMULA INTEGRITY', '100% RECONCILED'],
    description:
      'We sweat the numbers — a lot. Every calculation from WACC sensitivity to 3-statement linkage is deliberate. If something is on the financial model, it is verified. If it lacks integrity, it is eliminated.',
    deliverable: 'VERIFIED STANDARD // IMA CMA-GRADE RECONCILIATION',
    accentColor: '#E0533C',
    image: '/values/precision.jpg',
    metric: '100% AUDIT RECONCILED',
  },
  {
    id: 'val-2',
    number: '02',
    title: 'RIGOR',
    subtitle: 'Data-Backed Honesty',
    tags: ['STRESS-TESTING', 'MONTE CARLO RISK', 'VARIANCE ANALYSIS', 'BIAS ELIMINATION'],
    description:
      'We are not yes-analysts. If a business model or valuation assumption fails stress-testing, we say so — clearly and quantitatively. We would rather have a hard conversation early than present flawed executive forecasts.',
    deliverable: 'VERIFIED STANDARD // INDEPENDENT STRESS-TESTING PROTOCOL',
    accentColor: '#10B981',
    image: '/values/rigor.jpg',
    metric: 'INDEPENDENT STRESS TESTS',
  },
  {
    id: 'val-3',
    number: '03',
    title: 'STRATEGY',
    subtitle: 'C-Suite Partnership',
    tags: ['CAPITAL ALLOCATION', 'BOARDROOM TELEMETRY', 'FP&A ADVISORY', 'EXECUTIVE ROI'],
    description:
      'We do not just crunch data for you. We partner with leadership. The best capital allocation decisions come from collaborative modeling — translating raw ledgers into actionable executive telemetry.',
    deliverable: 'VERIFIED STANDARD // ACTIONABLE C-SUITE TELEMETRY',
    accentColor: '#3B82F6',
    image: '/values/strategy.jpg',
    metric: 'ACTIONABLE C-SUITE ROI',
  },
];

export const CoreValuesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<globalThis.ScrollTrigger | null>(null);

  // Stage 0: 3 Boxes Overview; Stage 1: Precision; Stage 2: Rigor; Stage 3: Strategy
  const [activeStage, setActiveStage] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const totalStages = 4; // 0 (Overview 3 Boxes), 1 (Precision), 2 (Rigor), 3 (Strategy)

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    const ctx = gsap.context(() => {
      if (!isMobile) {
        // Desktop: Pin the SECTION itself directly (like other working sections)
        const pinSpan = `${totalStages * 90}vh`;

        const st = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: `+=${pinSpan}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.4,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const prog = Math.min(1, Math.max(0, self.progress));
            setScrollProgress(Math.round(prog * 100) / 100);

            // 0..0.25 -> stage 0; 0.25..0.50 -> stage 1; 0.50..0.75 -> stage 2; 0.75..1.0 -> stage 3
            const rawStage = Math.floor(prog * totalStages);
            const safeStage = Math.min(totalStages - 1, Math.max(0, rawStage));

            setActiveStage((prev) => {
              if (safeStage !== prev) {
                soundFx.triggerSectionMilestone('values', safeStage, 460 + safeStage * 70);
                return safeStage;
              }
              return prev;
            });
          },
        });

        scrollTriggerRef.current = st;
      } else {
        // Mobile Viewport Tracker
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
  }, [totalStages]);

  const handleSelectStage = (stageIdx: number) => {
    soundFx.playNav();
    setActiveStage(stageIdx);

    const st = scrollTriggerRef.current;
    if (st) {
      const targetProgress = (stageIdx + 0.15) / totalStages;
      const targetScrollY = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      });
    }
  };

  const isOverview = activeStage === 0;
  const currentDetailIdx = Math.max(0, activeStage - 1);
  const currentValue = CORE_VALUES[currentDetailIdx];

  return (
    <section
      ref={sectionRef}
      id="values"
      aria-label="Core Values and Operating Framework"
      className="relative w-full min-h-screen lg:h-screen bg-[#F3F2EE] text-[#111116] border-b border-black/10 select-none overflow-hidden"
    >
      {/* CONTEXTUAL PROFESSIONAL BACKGROUND LAYER */}
      <SectionBackgroundLayer sectionKey="about" opacity={0.15} />

      {/* ELEGANT FIXED VERTICAL PROGRESS BAR ON RIGHT EDGE */}
      <VerticalSectionProgressBar
        targetId="values"
        accentColor="#E0533C"
        label="FRAMEWORK"
        sectionCode="07"
        isLightBg={true}
      />

      {/* VIEWPORT CONTAINER */}
      <div
        className="w-full h-full relative flex flex-col justify-between pt-6 sm:pt-8 md:pt-10 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
      >
        {/* TOP STATUS HUD */}
        <div className="flex items-center justify-between border-b border-black/15 pb-2.5 w-full flex-shrink-0">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#E0533C] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#E0533C] animate-pulse" />
            <span>[SCENE 07 // CORE VALUES & OPERATING FRAMEWORK]</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase text-[#666666] font-bold">
              {isOverview ? '3 PILLARS OVERVIEW' : `PRINCIPLE 0${currentDetailIdx + 1} / 03`}
            </span>
            <div className="w-20 sm:w-24 h-1.5 bg-black/10 rounded-none overflow-hidden border border-black/20">
              <div
                className="h-full bg-[#E0533C] transition-all duration-150"
                style={{ width: `${Math.max(10, (activeStage / (totalStages - 1)) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── MAIN STAGE: VERTICAL STRIPED SPINE + A-LIGN PROGRESSIVE CARDS ── */}
        <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-6 md:gap-10 my-auto py-3 w-full">
          
          {/* LEFT VERTICAL STRIPED TYPOGRAPHY SPINE */}
          <div className="hidden lg:flex flex-col items-center justify-between py-4 px-2 bg-transparent min-h-[480px] max-h-[620px] flex-shrink-0 z-20 w-24 md:w-28 relative">
            <div className="flex-1 w-full flex items-center justify-center overflow-visible py-1 my-2">
              <StripedTypography
                text="values"
                progress={Math.round((activeStage / (totalStages - 1)) * 100)}
                color="#E0533C"
                isVertical={true}
                isLightBg={true}
                className="w-full h-full min-h-[420px]"
              />
            </div>
            {/* Vertical live percentage progress bar */}
            <div className="flex flex-col items-center gap-1.5 pt-3 border-t border-black/15 font-mono text-[9px] w-full mt-2">
              <div className="w-1.5 h-12 bg-black/10 overflow-hidden relative">
                <div
                  className="w-full transition-all duration-150 absolute bottom-0 left-0 right-0"
                  style={{
                    height: `${Math.max(10, (activeStage / (totalStages - 1)) * 100)}%`,
                    backgroundColor: '#E0533C',
                    boxShadow: '0 0 6px rgba(224,83,60,0.6)',
                  }}
                />
              </div>
              <span className="font-bold text-[9px] text-[#E0533C]">
                {Math.round((activeStage / (totalStages - 1)) * 100)}%
              </span>
            </div>
          </div>

          {/* RIGHT EDITORIAL CARD STAGE */}
          <div className="flex-1 flex flex-col justify-between w-full h-full min-h-[520px]">
            
            {/* TOP ARCHITECTURAL SUBTITLE FRAME */}
            <div className="border border-dashed border-black/30 p-3 sm:p-4 bg-white/80 shadow-xs mb-3 flex items-center justify-between">
              <p className="font-mono text-[11px] sm:text-xs text-[#222222] font-extrabold uppercase tracking-wide leading-relaxed">
                {isOverview 
                  ? "WE DON'T JUMP STRAIGHT TO VISUALS. WE START BY GROUNDING YOUR BUSINESS IN 3 PILLARS: PRECISION, RIGOR, AND STRATEGY. SCROLL TO EXPLORE EACH."
                  : "WE SWEAT THE NUMBERS — FROM WACC SENSITIVITY TO 3-STATEMENT LINKAGE, UNCOMPROMISING STRESS-TESTS AND C-SUITE PARTNERSHIP."}
              </p>
              <div className="flex items-center gap-2 font-mono text-[10px] shrink-0 ml-4 hidden sm:flex">
                <button
                  onClick={() => handleSelectStage(0)}
                  className={`px-2 py-1 border transition-all cursor-pointer ${
                    isOverview ? 'bg-[#E0533C] text-white border-[#E0533C] font-bold' : 'bg-white border-black/20 text-[#666] hover:text-black'
                  }`}
                >
                  3-BOX OVERVIEW
                </button>
              </div>
            </div>

            {/* ── STAGE CONTENT: 3-BOXES OVERVIEW (INITIAL STATE) OR EXPANDED VALUE DETAILS ── */}
            <div className="flex-1 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {isOverview ? (
                  /* ── INITIAL 3-BOXES GRID (FIX 5) ───────────────────────── */
                  <motion.div
                    key="stage-3-boxes"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 flex-1 items-stretch"
                  >
                    {CORE_VALUES.map((val, idx) => (
                      <div
                        key={`box-${val.id}`}
                        onClick={() => handleSelectStage(idx + 1)}
                        className="bg-white border-2 border-dashed border-black/25 hover:border-black p-4 sm:p-5 flex flex-col justify-between shadow-md relative group cursor-pointer transition-all hover:shadow-lg"
                      >
                        <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#E0533C]" />
                        <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#E0533C]" />

                        {/* Top Meta */}
                        <div>
                          <div className="flex items-center justify-between border-b border-black/15 pb-2.5 mb-3">
                            <span
                              className="text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider text-white shadow-2xs"
                              style={{ backgroundColor: val.accentColor }}
                            >
                              BOX 0{idx + 1}
                            </span>
                            <span className="font-mono text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-300/40">
                              {val.metric}
                            </span>
                          </div>

                          {/* Image Thumbnail */}
                          <div className="w-full h-36 sm:h-40 border border-dashed border-black/20 overflow-hidden relative mb-3 bg-neutral-100">
                            <img
                              src={val.image}
                              alt={val.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2 left-2 bg-black/80 text-white font-mono text-[8.5px] font-bold px-2 py-0.5 uppercase">
                              {val.number} // {val.title}
                            </div>
                          </div>

                          <h3 className="font-serif text-2xl font-bold tracking-tight uppercase text-[#111116] group-hover:text-[#E0533C] transition-colors">
                            {val.title}
                          </h3>
                          <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#E0533C] mt-0.5">
                            {val.subtitle}
                          </p>
                          <p className="font-mono text-[11px] text-[#444444] line-clamp-2 mt-2 font-medium">
                            {val.description}
                          </p>
                        </div>

                        {/* Expand prompt */}
                        <div className="pt-3 border-t border-black/15 mt-3 flex items-center justify-between font-mono text-[10px] text-[#E0533C] font-bold group-hover:translate-x-0.5 transition-transform">
                          <span>SCROLL OR CLICK TO EXPAND</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  /* ── EXPANDED PRECISION / RIGOR / STRATEGY REVEAL (FIX 5) ── */
                  <motion.div
                    key={`stage-detail-${currentValue.id}`}
                    initial={{ opacity: 0, y: 25, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -25, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1"
                  >
                    {/* ── MAIN EXPANDED ACTIVE CARD (Span 9 Cols) ──────────── */}
                    <div className="lg:col-span-9 relative flex">
                      <div className="w-full bg-white border-2 border-dashed border-black/25 p-5 sm:p-7 md:p-8 flex flex-col justify-between shadow-md relative group">
                        {/* Corner Marker Ticks */}
                        <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#E0533C]" />
                        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#E0533C]" />
                        <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-r-2 border-[#E0533C]" />
                        <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#E0533C]" />

                        {/* TOP HEADER OF ACTIVE CARD */}
                        <div className="flex items-start justify-between border-b border-black/15 pb-3.5 mb-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase text-[#111116]">
                                {currentValue.title}
                              </h3>
                              <span
                                className="text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider text-white shadow-2xs"
                                style={{ backgroundColor: currentValue.accentColor }}
                              >
                                {currentValue.number}
                              </span>
                            </div>
                            <p className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#E0533C] mt-1">
                              {currentValue.subtitle}
                            </p>
                          </div>

                          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-300/40">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{currentValue.metric}</span>
                          </div>
                        </div>

                        {/* CENTER TWO-COLUMN CONTENT */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center flex-1 my-2">
                          {/* Left Text & Tags Column */}
                          <div className="md:col-span-6 space-y-4 flex flex-col justify-center">
                            <div className="flex flex-wrap gap-1.5">
                              {currentValue.tags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2.5 py-1 bg-[#F4F1EA] text-[#222222] border border-black/15 font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-wider"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <p className="font-mono text-xs sm:text-[13px] text-[#333333] leading-relaxed font-semibold">
                              {currentValue.description}
                            </p>

                            <div className="border border-black/15 bg-[#FAF9F5] p-2.5">
                              <span className="text-[9px] font-mono text-[#666666] uppercase block font-semibold">
                                GOVERNANCE & AUTHENTICATION:
                              </span>
                              <span className="text-[10.5px] font-mono text-[#111116] font-extrabold uppercase tracking-wide">
                                {currentValue.deliverable}
                              </span>
                            </div>
                          </div>

                          {/* Right High-Resolution Photo Column */}
                          <div className="md:col-span-6 h-[220px] sm:h-[260px] md:h-[290px] border-2 border-dashed border-black/25 overflow-hidden relative shadow-inner bg-neutral-100">
                            <img
                              src={currentValue.image}
                              alt={currentValue.title}
                              className="w-full h-full object-cover object-center filter contrast-105 hover:scale-105 transition-transform duration-500 ease-out"
                            />
                            <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white font-mono text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest border border-white/20">
                              {currentValue.number} // {currentValue.title}
                            </div>
                          </div>
                        </div>

                        {/* BOTTOM CARD CONTROLS */}
                        <div className="flex items-center justify-between pt-3 border-t border-black/15 mt-2 font-mono text-[10px] uppercase">
                          <button
                            onClick={() => handleSelectStage(0)}
                            className="text-[#E0533C] font-bold hover:underline cursor-pointer flex items-center gap-1"
                          >
                            &larr; BACK TO 3-BOX OVERVIEW
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSelectStage(Math.max(0, activeStage - 1))}
                              className="px-3 py-1 bg-white hover:bg-black hover:text-white border border-black/20 font-bold uppercase transition-all cursor-pointer"
                            >
                              &lt; PREV
                            </button>
                            <button
                              onClick={() => handleSelectStage(Math.min(totalStages - 1, activeStage + 1))}
                              disabled={activeStage === totalStages - 1}
                              className={`px-3 py-1 border border-black/20 font-bold uppercase transition-all ${
                                activeStage === totalStages - 1
                                  ? 'opacity-30 cursor-not-allowed bg-neutral-100'
                                  : 'bg-[#E0533C] text-white hover:bg-black cursor-pointer'
                              }`}
                            >
                              NEXT &gt;
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── RIGHT DOCKED CARDS STACK (Span 3 Cols) ─────────── */}
                    <div className="lg:col-span-3 flex flex-col justify-between gap-3">
                      {/* DOCKED PREVIEW STACK */}
                      <div className="space-y-2">
                        <span className="text-[9.5px] font-mono text-[#666666] font-bold uppercase tracking-widest block">
                          COMPLETED STAGES:
                        </span>
                        <motion.button
                          onClick={() => handleSelectStage(0)}
                          className="w-full p-2.5 bg-white border border-dashed border-black/30 hover:border-black text-left flex items-center justify-between shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#E0533C]" />
                            <span className="font-serif font-bold text-xs text-[#111116] uppercase group-hover:text-[#E0533C]">
                              00. 3-BOX OVERVIEW
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-black/40 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                        </motion.button>
                        {CORE_VALUES.map((val, idx) => {
                          if (idx >= currentDetailIdx) return null;
                          return (
                            <motion.button
                              key={`docked-${val.id}`}
                              onClick={() => handleSelectStage(idx + 1)}
                              className="w-full p-2.5 bg-white border border-dashed border-black/30 hover:border-black text-left flex items-center justify-between shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: val.accentColor }}
                                />
                                <span className="font-serif font-bold text-xs text-[#111116] uppercase group-hover:text-[#E0533C]">
                                  {val.number}. {val.title}
                                </span>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-black/40 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* UPCOMING STAGES STACK */}
                      <div className="space-y-2 pt-2 border-t border-black/15">
                        <span className="text-[9.5px] font-mono text-[#666666] font-bold uppercase tracking-widest block">
                          UPCOMING STAGES:
                        </span>
                        {CORE_VALUES.map((val, idx) => {
                          if (idx <= currentDetailIdx) return null;
                          return (
                            <motion.button
                              key={`upcoming-${val.id}`}
                              onClick={() => handleSelectStage(idx + 1)}
                              className="w-full p-2.5 bg-white/60 hover:bg-white border border-dashed border-black/20 hover:border-black text-left flex items-center justify-between shadow-2xs transition-all cursor-pointer group"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] font-bold text-black/50">
                                  {val.number}
                                </span>
                                <span className="font-serif font-semibold text-xs text-[#444444] uppercase group-hover:text-black">
                                  {val.title}
                                </span>
                              </div>
                              <span className="text-[9px] font-mono uppercase text-[#E0533C] font-bold">
                                EXPAND &gt;
                              </span>
                            </motion.button>
                          );
                        })}
                        {currentDetailIdx === CORE_VALUES.length - 1 && (
                          <div className="p-3 bg-emerald-50 border border-emerald-300/40 text-center font-mono text-[10px] text-emerald-800 uppercase font-bold">
                            ✓ ALL 3 CORE VALUES EXPLORED
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* BOTTOM HUD */}
        <div className="flex items-center justify-between border-t border-black/15 pt-2.5 w-full flex-shrink-0 font-mono text-[9px] text-[#666666] uppercase">
          <div className="flex items-center gap-3">
            <span className="font-bold text-emerald-700">IMA / CMA-USA CERTIFIED STANDARDS</span>
            <span>•</span>
            <span>ALL MODEL CALCULATIONS AUDIT-RECONCILED</span>
          </div>
          <div className="flex items-center gap-2">
            <span>SCROLL OR USE CONTROLS TO REVEAL EACH VALUE</span>
          </div>
        </div>
      </div>
    </section>
  );
};
