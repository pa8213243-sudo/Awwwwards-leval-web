import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowUpRight, 
  Sparkles, 
  ChevronRight,
  ChevronLeft,
  Calendar,
  Building2
} from 'lucide-react';
import { TIMELINE } from '../data/portfolioData';
import { StripedTypography } from './StripedTypography';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
import { SectionBackgroundLayer } from './SectionBackgroundLayer';
import { LazyRenderMedia } from './LazyRenderMedia';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { soundFx } from '../lib/sound';

export const ExperienceTimeline: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<globalThis.ScrollTrigger | null>(null);

  const totalMilestones = TIMELINE.length;

  const handleSelectMilestone = (idx: number) => {
    soundFx.playNav();
    setActiveIdx(idx);

    const st = scrollTriggerRef.current;
    if (st) {
      const targetProgress = (idx + 0.15) / totalMilestones;
      const targetScrollY = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    const pinContainer = pinContainerRef.current;
    if (!section || !pinContainer) return;

    const isTouch = typeof window !== 'undefined' && window.innerWidth <= 768;

    const ctx = gsap.context(() => {
      if (!isTouch) {
        // Desktop Pinned Timeline Scrubbing - Lock section in place until 100% is reached
        const pinSpan = `${totalMilestones * 100}vh`;

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

            const rawIdx = Math.floor(prog * totalMilestones);
            const safeIdx = Math.min(totalMilestones - 1, Math.max(0, rawIdx));

            setActiveIdx((prev) => {
              if (safeIdx !== prev) {
                soundFx.triggerSectionMilestone('experience', safeIdx, 460 + safeIdx * 60);
                return safeIdx;
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
  }, [totalMilestones]);

  const currentItem = TIMELINE[activeIdx] || TIMELINE[0];

  return (
    <section
      ref={sectionRef}
      id="experience"
      aria-label="Career and Academic Chronology"
      className="relative w-full min-h-screen lg:h-screen bg-[#F3F2EE] text-[#111116] border-b border-black/10 select-none overflow-hidden"
    >
      {/* CONTEXTUAL PROFESSIONAL BACKGROUND PHOTO */}
      <SectionBackgroundLayer sectionKey="experience" opacity={0.18} />

      {/* ELEGANT FIXED VERTICAL PROGRESS BAR ON RIGHT EDGE */}
      <VerticalSectionProgressBar
        targetId="experience"
        accentColor="#10B981"
        label="JOURNEY"
        sectionCode="08"
        isLightBg={true}
      />

      {/* Background Graphic Grid */}
      <div className="absolute inset-0 brutalist-grid opacity-15 pointer-events-none" />

      {/* PINNED VIEWPORT CONTAINER (COMPACT HEADER + RAISED CONTENT) */}
      <div
        ref={pinContainerRef}
        className="w-full min-h-screen lg:h-screen relative flex flex-col justify-between pt-4 sm:pt-6 md:pt-8 pb-10 sm:pb-14 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
      >
        {/* TOP STATUS HUD */}
        <div className="flex items-center justify-between border-b border-black/15 pb-2 w-full flex-shrink-0">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>[SCENE 08 // CAREER & ACADEMIC CHRONOLOGY]</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase text-[#666666] font-bold">
              MILESTONE 0{activeIdx + 1} / 0{totalMilestones}
            </span>
            <div className="w-20 sm:w-24 h-1.5 bg-black/10 rounded-none overflow-hidden border border-black/20">
              <div
                className="h-full bg-emerald-600 transition-all duration-150"
                style={{ width: `${Math.max(10, ((activeIdx + 1) / totalMilestones) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── TOP HEADER BAR: COMPACT & POSITIONED HIGH (NO PUSH-DOWN) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center border-b border-black/15 pb-2 w-full flex-shrink-0 mt-1">
          <div className="lg:col-span-6 flex items-center gap-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight uppercase text-[#111116]">
              CAREER JOURNEY
            </h2>
            <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono text-[9.5px] font-bold uppercase shadow-2xs">
              0{activeIdx + 1} // {currentItem.type}
            </span>
          </div>

          <div className="lg:col-span-6">
            <div className="border border-dashed border-black/25 p-2 bg-white rounded-none text-left shadow-xs">
              <p className="text-[10.5px] font-mono text-[#222222] font-bold leading-relaxed uppercase">
                ACADEMIC EXCELLENCE, CMA USA MERIT DISTINCTION & QUANTITATIVE ADVISORY MILESTONES.
              </p>
            </div>
          </div>
        </div>

        {/* ── MILESTONE SELECTOR TABS ── */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1.5 flex-shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {TIMELINE.map((item, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectMilestone(idx)}
                  className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider border transition-all rounded-none cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-xs'
                      : 'border-black/15 text-[#444444] bg-white hover:text-black hover:bg-black/5'
                  }`}
                >
                  <span>0{idx + 1}.</span>
                  <span>{item.roleOrDegree.split(' ')[0]}</span>
                  <span className={isActive ? 'text-white/80' : 'text-[#777777]'}>
                    ({item.period.split(' ')[0]})
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2.5 text-[10px] font-mono text-[#555555] bg-white px-2.5 py-1 border border-black/10">
            <span className="text-emerald-700 font-bold">1ST ATTEMPT CLEARED</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">380/500 SCORE</span>
          </div>
        </div>

        {/* ── MAIN STAGE: SPACIOUS LEFT VERTICAL SPINE + ACTIVE STORY CARD ── */}
        <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-6 md:gap-8 my-auto py-2 w-full">
          
          {/* LEFT VERTICAL STRIPED TYPOGRAPHY SPINE (CLEANLY PROPORTIONED & NOT CRAMPED) */}
          <div className="hidden lg:flex flex-col items-center justify-between py-4 px-2 bg-transparent min-h-[460px] max-h-[580px] flex-shrink-0 z-20 w-24 md:w-28 relative">
            <div className="flex-1 w-full flex items-center justify-center overflow-visible py-1 my-2">
              <StripedTypography
                text="experience"
                progress={Math.round(((activeIdx + 1) / totalMilestones) * 100)}
                color="#10B981"
                isVertical={true}
                isLightBg={true}
                className="w-full h-full min-h-[400px]"
              />
            </div>

            {/* Vertical live percentage progress bar */}
            <div className="flex flex-col items-center gap-1.5 pt-3 border-t border-black/15 font-mono text-[9px] w-full mt-2">
              <div className="w-1.5 h-12 bg-black/10 overflow-hidden relative">
                <div
                  className="w-full transition-all duration-150 absolute bottom-0 left-0 right-0"
                  style={{
                    height: `${Math.max(10, ((activeIdx + 1) / totalMilestones) * 100)}%`,
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 6px rgba(16,185,129,0.6)',
                  }}
                />
              </div>
              <span className="font-bold text-[9px] text-emerald-800">
                {Math.round(((activeIdx + 1) / totalMilestones) * 100)}%
              </span>
            </div>
          </div>

          {/* RIGHT EDITORIAL CARD STAGE (ALWAYS 100% VISIBLE WITH NO BLANK GAPS) */}
          <div className="flex-1 h-full min-h-[480px] lg:min-h-[560px] relative flex items-stretch">
            <div className="w-full h-full bg-white border-2 border-dashed border-black/25 p-5 sm:p-7 md:p-8 shadow-md relative text-[#111116] flex flex-col justify-between overflow-y-auto">
              <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-emerald-600" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-emerald-600" />
              <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-emerald-600" />
              <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-emerald-600" />

              {/* CARD TOP BAR */}
              <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-3 flex-shrink-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-1 bg-emerald-600 text-white font-mono text-[10px] font-bold uppercase rounded-none shadow-2xs">
                    MILESTONE 0{activeIdx + 1} OF 0{totalMilestones}
                  </span>
                  <span className="text-xs font-mono text-[#555555] font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{currentItem.period}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 border border-emerald-500/30">
                    VERIFIED MERIT
                  </span>
                  <button
                    onClick={() => handleSelectMilestone(Math.max(0, activeIdx - 1))}
                    disabled={activeIdx === 0}
                    className="px-2.5 py-1 bg-[#F4F4F0] border border-black/15 text-[10px] font-mono text-[#333333] hover:bg-black/5 disabled:opacity-20 transition-all rounded-none cursor-pointer flex items-center gap-1 font-bold"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>PREV</span>
                  </button>
                  <button
                    onClick={() => handleSelectMilestone(Math.min(totalMilestones - 1, activeIdx + 1))}
                    disabled={activeIdx === totalMilestones - 1}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 border border-emerald-600 text-[10px] font-mono font-bold text-white disabled:opacity-20 transition-all rounded-none cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <span>NEXT</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ── ANIMATED CARD CONTENT BODY ───────────────────────── */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentItem.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                  className="flex-1 flex flex-col justify-between my-auto py-1"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center flex-1">
                    
                    {/* LEFT CONTENT COLUMN */}
                    <div className="lg:col-span-7 space-y-3">
                      <h3 className="font-serif text-2xl sm:text-3xl text-[#111116] font-bold uppercase tracking-tight leading-tight">
                        {currentItem.roleOrDegree}
                      </h3>

                      <div className="text-xs font-mono uppercase text-[#E0533C] font-bold flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-[#E0533C]" />
                        <span>{currentItem.organization}</span>
                      </div>

                      <p className="text-xs sm:text-[13.5px] font-sans font-normal text-[#333333] leading-relaxed border-l-4 border-emerald-600 pl-3.5 py-1 bg-[#F9F9F7]">
                        {currentItem.description}
                      </p>

                      <div className="space-y-1.5 pt-2 border-t border-black/10">
                        <span className="text-[9.5px] font-mono text-emerald-800 uppercase font-bold tracking-wider block">
                          VERIFIED MILESTONE EVIDENCE:
                        </span>
                        {currentItem.highlights.map((h, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2 text-xs font-mono text-[#222222] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* RIGHT PHOTO FRAME */}
                    <div className="lg:col-span-5">
                      {currentItem.image && (
                        <div className="relative aspect-[4/3] w-full rounded-none overflow-hidden border-2 border-dashed border-black/25 bg-white group shadow-sm">
                          <LazyRenderMedia
                            src={currentItem.image}
                            alt={currentItem.roleOrDegree}
                            aspectRatio="aspect-[4/3]"
                            accentColor="#10B981"
                            mediaClassName="group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-10" />
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between font-mono text-[9px] text-white z-20 pointer-events-none">
                            <span className="bg-black/85 px-2 py-0.5 border border-white/15 font-bold">VERIFIED EVIDENCE</span>
                            <span className="bg-emerald-600 text-white font-bold px-2 py-0.5">{currentItem.period}</span>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>

              {/* FOOTER STRIP */}
              <div className="pt-2.5 mt-2 border-t border-black/10 flex items-center justify-between font-mono text-[10px] text-[#555555] flex-shrink-0">
                <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  INSTITUTE OF MANAGEMENT ACCOUNTANTS (IMA) & GUJARAT UNIVERSITY
                </span>
                <span className="text-[#888888] hidden sm:inline font-semibold">
                  STAGE 0{activeIdx + 1} OF 0{totalMilestones}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM HUD */}
        <div className="flex items-center justify-between border-t border-black/15 pt-2 w-full flex-shrink-0 font-mono text-[9px] text-[#666666] uppercase">
          <div className="flex items-center gap-3">
            <span className="font-bold text-emerald-800">ALL CAREER MILESTONES VERIFIED</span>
            <span>•</span>
            <span>USE SCROLL OR TABS TO PROGRESS</span>
          </div>
          <div className="flex items-center gap-2">
            <span>CHRONOLOGY // 0{activeIdx + 1} OF 0{totalMilestones}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
