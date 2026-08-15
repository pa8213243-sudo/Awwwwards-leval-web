import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowUpRight,
  Layers,
  Cpu,
  BarChart3,
  Database,
  Code2,
  Award,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Sliders,
  Check
} from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { StripedTypography } from './StripedTypography';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
import { SectionBackgroundLayer } from './SectionBackgroundLayer';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { soundFx } from '../lib/sound';

export const SkillsSection: React.FC = () => {
  const [activeCategoryIdx, setActiveCategoryIdx] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<globalThis.ScrollTrigger | null>(null);

  const totalCategories = SKILL_CATEGORIES.length;

  const handleSelectCategory = (idx: number) => {
    soundFx.playNav();
    setActiveCategoryIdx(idx);

    const st = scrollTriggerRef.current;
    if (st) {
      const targetProgress = (idx + 0.15) / totalCategories;
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
        const pinSpan = `${totalCategories * 100}vh`;

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

            const rawIdx = Math.floor(prog * totalCategories);
            const safeIdx = Math.min(totalCategories - 1, Math.max(0, rawIdx));

            setActiveCategoryIdx((prev) => {
              if (safeIdx !== prev) {
                soundFx.triggerSectionMilestone('skills', safeIdx, 460 + safeIdx * 60);
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
  }, [totalCategories]);

  const currentCategory = SKILL_CATEGORIES[activeCategoryIdx] || SKILL_CATEGORIES[0];

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-label="Skill Architecture and Telemetry"
      className="relative w-full min-h-screen lg:h-screen bg-[#F3F2EE] text-[#111116] border-b border-black/10 select-none overflow-hidden"
    >
      {/* CONTEXTUAL PROFESSIONAL BACKGROUND PHOTO */}
      <SectionBackgroundLayer sectionKey="skills" opacity={0.18} />

      {/* ELEGANT FIXED VERTICAL PROGRESS BAR ON RIGHT EDGE */}
      <VerticalSectionProgressBar
        targetId="skills"
        accentColor="#10B981"
        label="SKILLS"
        sectionCode="09"
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
            <span>[SCENE 09 // SKILL ARCHITECTURE & TELEMETRY]</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase text-[#666666] font-bold">
              ARCHITECTURE 0{activeCategoryIdx + 1} / 0{totalCategories}
            </span>
            <div className="w-20 sm:w-24 h-1.5 bg-black/10 rounded-none overflow-hidden border border-black/20">
              <div
                className="h-full bg-emerald-600 transition-all duration-150"
                style={{ width: `${Math.max(10, ((activeCategoryIdx + 1) / totalCategories) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── TOP HEADER BAR: COMPACT & POSITIONED HIGH ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center border-b border-black/15 pb-2 w-full flex-shrink-0 mt-1">
          <div className="lg:col-span-6 flex items-center gap-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight uppercase text-[#111116]">
              SKILLS ARCHITECTURE
            </h2>
            <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono text-[9.5px] font-bold uppercase shadow-2xs">
              0{activeCategoryIdx + 1} // {currentCategory.category.split(' ')[0]}
            </span>
          </div>

          <div className="lg:col-span-6">
            <div className="border border-dashed border-black/25 p-2 bg-white rounded-none text-left shadow-xs flex items-center justify-between gap-3">
              <p className="text-[10.5px] font-mono text-[#222222] font-bold leading-relaxed uppercase">
                QUANTITATIVE FP&A MODELING, POWER BI TELEMETRY & CMA-GRADE FINANCIAL GOVERNANCE.
              </p>
              <div className="px-2 py-0.5 bg-emerald-50 border border-emerald-500/40 text-emerald-800 font-mono text-[9.5px] font-bold uppercase whitespace-nowrap hidden sm:block">
                380/500 CMA
              </div>
            </div>
          </div>
        </div>

        {/* ── CATEGORY SELECTOR TABS ── */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1.5 flex-shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {SKILL_CATEGORIES.map((cat, idx) => {
              const isActive = activeCategoryIdx === idx;
              return (
                <button
                  key={cat.category}
                  onClick={() => handleSelectCategory(idx)}
                  className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider border transition-all rounded-none cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-xs'
                      : 'border-black/15 text-[#444444] bg-white hover:text-black hover:bg-black/5'
                  }`}
                >
                  <span>0{idx + 1}.</span>
                  <span>{cat.category}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2.5 text-[10px] font-mono text-[#555555] bg-white px-2.5 py-1 border border-black/10">
            <span className="text-emerald-700 font-bold">• 16+ MODELS VERIFIED</span>
            <span className="text-[#E0533C] font-bold">• 1.2M+ DAX ROWS</span>
            <span className="text-blue-700 font-bold">• IMA ETHICS CERTIFIED</span>
          </div>
        </div>

        {/* ── MAIN STAGE: SPACIOUS LEFT VERTICAL SPINE + ACTIVE SKILLS CARD ── */}
        <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-6 md:gap-8 my-auto py-2 w-full">
          
          {/* LEFT VERTICAL STRIPED TYPOGRAPHY SPINE */}
          <div className="hidden lg:flex flex-col items-center justify-between py-4 px-2 bg-transparent min-h-[460px] max-h-[580px] flex-shrink-0 z-20 w-24 md:w-28 relative">
            <div className="flex-1 w-full flex items-center justify-center overflow-visible py-1 my-2">
              <StripedTypography
                text="skills"
                progress={Math.round(((activeCategoryIdx + 1) / totalCategories) * 100)}
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
                    height: `${Math.max(10, ((activeCategoryIdx + 1) / totalCategories) * 100)}%`,
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 6px rgba(16,185,129,0.6)',
                  }}
                />
              </div>
              <span className="font-bold text-[9px] text-emerald-800">
                {Math.round(((activeCategoryIdx + 1) / totalCategories) * 100)}%
              </span>
            </div>
          </div>

          {/* RIGHT EDITORIAL CARD STAGE (ALWAYS 100% VISIBLE WITH ZERO EMPTY GAPS) */}
          <div className="flex-1 h-full min-h-[480px] lg:min-h-[560px] relative flex items-stretch">
            <div className="w-full h-full bg-white border-2 border-dashed border-black/25 p-5 sm:p-7 md:p-8 shadow-md relative text-[#111116] flex flex-col justify-between overflow-y-auto">
              <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-emerald-600" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-emerald-600" />
              <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-emerald-600" />
              <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-emerald-600" />

              {/* TOP CARD HEADER BAR */}
              <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-3 flex-shrink-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-1 bg-emerald-600 text-white font-mono text-[10px] font-bold uppercase rounded-none shadow-2xs">
                    ARCHITECTURE 0{activeCategoryIdx + 1} OF 0{totalCategories}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#111116] font-bold uppercase tracking-tight">
                    {currentCategory.category}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 border border-emerald-500/30">
                    IMA / CMA CERTIFIED
                  </span>
                  <button
                    onClick={() => handleSelectCategory(Math.max(0, activeCategoryIdx - 1))}
                    disabled={activeCategoryIdx === 0}
                    className="px-2.5 py-1 bg-[#F4F4F0] border border-black/15 text-[10px] font-mono text-[#333333] hover:bg-black/5 disabled:opacity-20 transition-all rounded-none cursor-pointer flex items-center gap-1 font-bold"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>PREV</span>
                  </button>
                  <button
                    onClick={() => handleSelectCategory(Math.min(totalCategories - 1, activeCategoryIdx + 1))}
                    disabled={activeCategoryIdx === totalCategories - 1}
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
                  key={currentCategory.category}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 flex flex-col justify-between my-auto py-1 transform-gpu"
                >
                  <p className="text-xs sm:text-[13px] font-mono text-[#444444] font-normal mb-3 border-l-4 border-emerald-600 pl-3.5 py-1 bg-[#F9F9F7]">
                    {currentCategory.description}
                  </p>

                  {/* HIGH-DENSITY SKILL TILES GRID WITH HOVER TOOLTIPS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-1">
                    {currentCategory.skills.map((skill, sIdx) => {
                      const profValue = sIdx === 0 ? 98 : sIdx === 1 ? 95 : sIdx === 2 ? 92 : 88;
                      const expYears = sIdx === 0 ? '5+ Years' : sIdx === 1 ? '4+ Years' : '3+ Years';

                      return (
                        <div
                          key={skill.name}
                          className="p-3.5 border border-black/15 bg-[#FAF9F5] hover:border-emerald-600 transition-all rounded-none group flex flex-col justify-between shadow-xs relative overflow-visible cursor-pointer"
                        >
                          {/* HOVER-REVEAL EDITORIAL TOOLTIP */}
                          <div className="absolute -top-3 right-3 z-30 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none">
                            <div className="px-2.5 py-1 bg-emerald-900 border border-emerald-500 text-emerald-100 font-mono text-[9px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5 rounded-none">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              <span>{profValue}% MASTERY</span>
                              <span className="text-white/40">•</span>
                              <span className="text-white">{expYears}</span>
                            </div>
                          </div>

                          <div>
                            {/* Skill Top Meta */}
                            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                              <span className="text-emerald-800 font-bold flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-emerald-600" />
                                <span>{skill.proficiency}</span>
                              </span>
                              <span className="text-[#666666] font-bold">{profValue}%</span>
                            </div>

                            {/* Skill Proficiency Gauge Bar */}
                            <div className="w-full h-1 bg-black/10 rounded-none mb-2 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 transition-all duration-1000"
                                style={{ width: `${profValue}%` }}
                              />
                            </div>

                            <h4 className="font-serif text-sm sm:text-base font-bold text-[#111116] group-hover:text-emerald-700 transition-colors leading-snug">
                              {skill.name}
                            </h4>

                            <p className="mt-1 text-[11px] font-sans text-[#555555] font-normal leading-relaxed">
                              {skill.detail}
                            </p>
                          </div>

                          <div className="mt-3 pt-1.5 border-t border-black/10 flex items-center justify-between text-[9px] font-mono uppercase text-[#666666] font-medium">
                            <span className="text-[#444444] font-semibold group-hover:text-emerald-700 transition-colors">
                              ENTERPRISE AUDIT READY
                            </span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* BOTTOM FOOTER OF ACTIVE CARD */}
              <div className="pt-2.5 mt-2 border-t border-black/10 flex items-center justify-between font-mono text-[10px] text-[#555555] flex-shrink-0">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[#333333] font-semibold">
                    VERIFIED BY INSTITUTE OF MANAGEMENT ACCOUNTANTS (IMA) & MILES EDUCATION
                  </span>
                </div>
                <div className="text-emerald-800 font-bold">
                  DOMAIN 0{activeCategoryIdx + 1} // 0{totalCategories}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM HUD */}
        <div className="flex items-center justify-between border-t border-black/15 pt-2 w-full flex-shrink-0 font-mono text-[9px] text-[#666666] uppercase">
          <div className="flex items-center gap-3">
            <span className="font-bold text-emerald-800">ALL 3 SKILL ARCHITECTURES ACTIVE</span>
            <span>•</span>
            <span>USE SCROLL OR TABS TO NAVIGATE</span>
          </div>
          <div className="flex items-center gap-2">
            <span>DOMAIN // 0{activeCategoryIdx + 1} OF 0{totalCategories}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
