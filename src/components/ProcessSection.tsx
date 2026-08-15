import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles, 
  Workflow, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Target,
  Wrench
} from 'lucide-react';
import { PROCESS_STAGES } from '../data/portfolioData';
import { StripedTypography } from './StripedTypography';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
import { SectionBackgroundLayer } from './SectionBackgroundLayer';
import { LazyRenderMedia } from './LazyRenderMedia';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { soundFx } from '../lib/sound';

export const ProcessSection: React.FC = () => {
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<globalThis.ScrollTrigger | null>(null);

  const totalStages = PROCESS_STAGES.length;

  const handleSelectStage = (idx: number) => {
    soundFx.playNav();
    setActiveStageIdx(idx);

    const st = scrollTriggerRef.current;
    if (st) {
      const targetProgress = (idx + 0.1) / totalStages;
      const targetScrollY = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isTouch = typeof window !== 'undefined' && window.innerWidth <= 768;

    const ctx = gsap.context(() => {
      if (!isTouch) {
        // Desktop Pinned Process Execution - Lock section firmly in place
        const pinSpan = `${totalStages * 85}vh`;

        let lastAnnouncedStage = -1;
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
            setScrollProgress(Math.round(prog * 100) / 100);

            const rawIdx = Math.floor(prog * totalStages);
            const safeIdx = Math.min(totalStages - 1, Math.max(0, rawIdx));

            if (safeIdx !== lastAnnouncedStage) {
              lastAnnouncedStage = safeIdx;
              soundFx.playMilestone(440 + safeIdx * 60);
              setActiveStageIdx(safeIdx);
            }
          },
        });

        scrollTriggerRef.current = st;
      } else {
        // Mobile viewport progress tracker
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

  const currentStage = PROCESS_STAGES[activeStageIdx] || PROCESS_STAGES[0];

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-label="5-Stage Advisory Execution Matrix"
      className="relative w-full min-h-screen lg:h-screen bg-[#F3F2EE] text-[#111116] border-b border-black/10 select-none overflow-hidden"
    >
      {/* CONTEXTUAL PROFESSIONAL BACKGROUND PHOTO */}
      <SectionBackgroundLayer sectionKey="process" opacity={0.18} />

      {/* ELEGANT FIXED VERTICAL PROGRESS BAR ON RIGHT EDGE */}
      <VerticalSectionProgressBar
        targetId="process"
        accentColor="#E0533C"
        label="PROCESS"
        sectionCode="11"
        isLightBg={true}
      />

      {/* Background Graphic Grid */}
      <div className="absolute inset-0 brutalist-grid opacity-15 pointer-events-none" />

      {/* PINNED VIEWPORT CONTAINER (COMPACT HEADER + RAISED CONTENT) */}
      <div className="w-full min-h-screen lg:h-screen relative flex flex-col justify-between pt-4 sm:pt-6 md:pt-8 pb-10 sm:pb-14 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        
        {/* TOP STATUS HUD */}
        <div className="flex items-center justify-between border-b border-black/15 pb-2 w-full flex-shrink-0">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#E0533C] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#E0533C] animate-pulse" />
            <span>[SCENE 11 // 5-STAGE ADVISORY EXECUTION MATRIX]</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase text-[#666666] font-bold">
              PHASE 0{activeStageIdx + 1} / 0{totalStages}
            </span>
            <div className="w-20 sm:w-24 h-1.5 bg-black/10 rounded-none overflow-hidden border border-black/20">
              <div
                className="h-full bg-[#E0533C] transition-all duration-150"
                style={{ width: `${Math.max(10, ((activeStageIdx + 1) / totalStages) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── TOP HEADER BAR: COMPACT & POSITIONED HIGH ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center border-b border-black/15 pb-2 w-full flex-shrink-0 mt-1">
          <div className="lg:col-span-6 flex items-center gap-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight uppercase text-[#111116]">
              EXECUTION PROCESS
            </h2>
            <span className="px-2 py-0.5 bg-[#E0533C] text-white font-mono text-[9.5px] font-bold uppercase shadow-2xs">
              0{activeStageIdx + 1} // {currentStage.title}
            </span>
          </div>

          <div className="lg:col-span-6">
            <div className="border border-dashed border-black/25 p-2 bg-white rounded-none text-left shadow-xs">
              <p className="text-[10.5px] font-mono text-[#222222] font-bold leading-relaxed uppercase">
                FROM STRATEGIC SCOPE DISCOVERY TO FINANCIAL ENGINE PROTOTYPING & C-SUITE STAKEHOLDER HANDOFF.
              </p>
            </div>
          </div>
        </div>

        {/* ── STAGE SELECTOR TABS ── */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1.5 flex-shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {PROCESS_STAGES.map((stage, idx) => {
              const isActive = activeStageIdx === idx;
              return (
                <button
                  key={stage.number}
                  onClick={() => handleSelectStage(idx)}
                  className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider border transition-all rounded-none cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#E0533C] text-white font-bold border-[#E0533C] shadow-xs'
                      : 'border-black/15 text-[#444444] bg-white hover:text-black hover:bg-black/5'
                  }`}
                >
                  <span>0{stage.number}.</span>
                  <span>{stage.title}</span>
                  <span className={isActive ? 'text-white/80' : 'text-[#777777]'}>
                    ({stage.timeframe})
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2.5 text-[10px] font-mono text-[#555555] bg-white px-2.5 py-1 border border-black/10">
            <span className="text-emerald-700 font-bold">ZERO ASSUMPTION AUDIT</span>
            <span>•</span>
            <span className="text-[#E0533C] font-bold">100% RECONCILED</span>
          </div>
        </div>

        {/* ── MAIN STAGE: SPACIOUS LEFT VERTICAL SPINE + ACTIVE PROCESS CARD ── */}
        <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-6 md:gap-8 my-auto py-2 w-full">
          
          {/* LEFT VERTICAL STRIPED TYPOGRAPHY SPINE */}
          <div className="hidden lg:flex flex-col items-center justify-center py-4 px-2 bg-transparent min-h-[460px] max-h-[580px] flex-shrink-0 z-20 w-24 md:w-28 relative">
            <div className="flex-1 w-full flex items-center justify-center overflow-visible py-1 my-2">
              <StripedTypography
                text="process"
                progress={0}
                color="#E0533C"
                isVertical={true}
                isLightBg={true}
                className="w-full h-full min-h-[400px]"
              />
            </div>

            {/* Static clean phase counter */}
            <div className="flex flex-col items-center gap-1 pt-2 font-mono text-[9px] w-full border-t border-black/15">
              <span className="font-bold text-[#E0533C]">
                0{activeStageIdx + 1} / 0{totalStages}
              </span>
            </div>
          </div>

          {/* RIGHT EDITORIAL CARD STAGE (WITH INTEGRATED MEDIA PHOTO + ALL DELIVERABLES) */}
          <div className="flex-1 h-full min-h-[480px] lg:min-h-[560px] relative flex items-stretch">
            <div className="w-full h-full bg-white border-2 border-dashed border-black/25 p-5 sm:p-6 md:p-7 shadow-md relative text-[#111116] flex flex-col justify-between overflow-y-auto">
              <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#E0533C]" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#E0533C]" />
              <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#E0533C]" />
              <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#E0533C]" />

              {/* CARD TOP BAR */}
              <div className="flex items-center justify-between border-b border-black/10 pb-2.5 mb-2.5 flex-shrink-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-1 bg-[#E0533C] text-white font-mono text-[10px] font-bold uppercase rounded-none shadow-2xs">
                    PHASE 0{currentStage.number} // {currentStage.timeframe}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#111116] font-bold uppercase tracking-tight">
                    {currentStage.title}: {currentStage.subtitle}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 border border-emerald-500/30">
                    DELIVERABLE: {currentStage.deliverable.split(' ')[0]}
                  </span>
                  <button
                    onClick={() => handleSelectStage(Math.max(0, activeStageIdx - 1))}
                    disabled={activeStageIdx === 0}
                    className="px-2.5 py-1 bg-[#F4F4F0] border border-black/15 text-[10px] font-mono text-[#333333] hover:bg-black/5 disabled:opacity-20 transition-all rounded-none cursor-pointer flex items-center gap-1 font-bold"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>PREV</span>
                  </button>
                  <button
                    onClick={() => handleSelectStage(Math.min(totalStages - 1, activeStageIdx + 1))}
                    disabled={activeStageIdx === totalStages - 1}
                    className="px-2.5 py-1 bg-[#E0533C] hover:bg-red-700 border border-[#E0533C] text-[10px] font-mono font-bold text-white disabled:opacity-20 transition-all rounded-none cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <span>NEXT</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ── ANIMATED CARD CONTENT BODY (WITH PHOTO FRAME ON RIGHT) ── */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentStage.number}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 flex flex-col justify-between my-auto py-1 transform-gpu"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center flex-1">
                    
                    {/* LEFT CONTENT COLUMN (7 COLS): DESCRIPTION & DUAL-COLUMN DELIVERABLES */}
                    <div className="lg:col-span-7 space-y-3">
                      <p className="text-xs sm:text-[13px] font-sans font-normal text-[#333333] leading-relaxed border-l-4 border-[#E0533C] pl-3.5 py-1 bg-[#F9F9F7]">
                        {currentStage.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
                        {/* ADVISORY DELIVERABLES (OUR PART) */}
                        <div className="p-3 border border-black/15 bg-[#FAF9F5] shadow-xs">
                          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#E0533C] uppercase mb-2 border-b border-black/10 pb-1">
                            <Target className="w-3.5 h-3.5 text-[#E0533C]" />
                            <span>OUR PART (DELIVERABLES)</span>
                          </div>
                          <div className="space-y-1.5">
                            {currentStage.ourPart.map((item, dIdx) => (
                              <div key={dIdx} className="flex items-start gap-1.5 text-[11px] font-mono text-[#222222]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span className="leading-snug">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* CLIENT COLLABORATION & INPUTS (YOUR PART) */}
                        <div className="p-3 border border-black/15 bg-[#FAF9F5] shadow-xs">
                          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-800 uppercase mb-2 border-b border-black/10 pb-1">
                            <Workflow className="w-3.5 h-3.5 text-emerald-600" />
                            <span>YOUR PART (INPUTS)</span>
                          </div>
                          <div className="space-y-1.5">
                            {currentStage.yourPart.map((act, aIdx) => (
                              <div key={aIdx} className="flex items-start gap-1.5 text-[11px] font-mono text-[#222222]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E0533C] flex-shrink-0 mt-1.5" />
                                <span className="leading-snug">{act}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT PHOTO FRAME (5 COLS) */}
                    <div className="lg:col-span-5 space-y-2">
                      {currentStage.image && (
                        <div className="relative aspect-[4/3] w-full rounded-none overflow-hidden border-2 border-dashed border-black/25 bg-white group shadow-sm">
                          <LazyRenderMedia
                            src={currentStage.image}
                            alt={currentStage.title}
                            aspectRatio="aspect-[4/3]"
                            accentColor="#E0533C"
                            mediaClassName="group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />
                          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between font-mono text-[9px] text-white z-20 pointer-events-none">
                            <span className="bg-black/85 px-2 py-0.5 border border-white/15 font-bold">
                              STAGE 0{currentStage.number} PROTOCOL
                            </span>
                            <span className="bg-[#E0533C] text-white font-bold px-2 py-0.5">
                              {currentStage.timeframe}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Tool Stack Tags */}
                      {currentStage.tools && currentStage.tools.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 pt-1">
                          <span className="text-[9px] font-mono text-black/50 font-bold uppercase mr-1">TOOLS:</span>
                          {currentStage.tools.map((t, tIdx) => (
                            <span key={tIdx} className="px-2 py-0.5 bg-white border border-black/15 text-[9.5px] font-mono text-[#333333] font-bold">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>

              {/* FOOTER STRIP */}
              <div className="pt-2 mt-2 border-t border-black/10 flex items-center justify-between font-mono text-[10px] text-[#555555] flex-shrink-0">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E0533C]" />
                  <span className="text-[#333333] font-semibold">
                    ZERO ASSUMPTION AUDIT & FULL RECONCILIATION GUARANTEE
                  </span>
                </div>
                <div className="text-[#E0533C] font-bold">
                  STAGE 0{activeStageIdx + 1} OF 0{totalStages}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM HUD */}
        <div className="flex items-center justify-between border-t border-black/15 pt-2 w-full flex-shrink-0 font-mono text-[9px] text-[#666666] uppercase">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#E0533C]">ALL 5 ADVISORY STAGES RECONCILED</span>
            <span>•</span>
            <span>USE SCROLL OR TABS TO PROGRESS</span>
          </div>
          <div className="flex items-center gap-2">
            <span>EXECUTION // 0{activeStageIdx + 1} OF 0{totalStages}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
