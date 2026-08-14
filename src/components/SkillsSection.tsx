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
  TrendingUp,
  Sliders,
  Check
} from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { StripedTypography } from './StripedTypography';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
import { ProgressiveTextFill } from './ProgressiveTextFill';
import { SectionBackgroundLayer } from './SectionBackgroundLayer';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { soundFx } from '../lib/sound';

export const SkillsSection: React.FC = () => {
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const totalCategories = SKILL_CATEGORIES.length;

  // Manual tab switch handler with instant GSAP animation
  const handleSelectCategory = (idx: number) => {
    soundFx.playClick();
    setActiveCategoryIdx(idx);
    const cards = cardsRef.current.filter(Boolean) as HTMLElement[];
    cards.forEach((card, index) => {
      if (index === idx) {
        gsap.to(card, {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          rotateX: 0,
          zIndex: 10,
          duration: 0.45,
          ease: 'power2.out',
          pointerEvents: 'auto',
        });
      } else if (index < idx) {
        gsap.to(card, {
          yPercent: -60,
          scale: 0.92,
          opacity: 0,
          rotateX: 8,
          zIndex: index,
          duration: 0.45,
          ease: 'power2.out',
          pointerEvents: 'none',
        });
      } else {
        gsap.to(card, {
          yPercent: 25,
          scale: 0.96,
          opacity: 0,
          rotateX: -6,
          zIndex: index,
          duration: 0.45,
          ease: 'power2.out',
          pointerEvents: 'none',
        });
      }
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    const pinContainer = pinContainerRef.current;
    if (!section || !pinContainer) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLElement[];
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      // Set initial card states
      cards.forEach((card, index) => {
        gsap.set(card, {
          zIndex: cards.length - index,
          x: 0,
          yPercent: index === 0 ? 0 : 25,
          scale: index === 0 ? 1 : 0.96,
          opacity: index === 0 ? 1 : 0,
          rotateX: index === 0 ? 0 : -6,
          transformOrigin: 'center center',
          pointerEvents: index === 0 ? 'auto' : 'none',
        });
      });

      const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

      // Dedicated ScrollTrigger timeline with pinning
      const pinDistance = `${totalCategories * (isTouch ? 125 : 100)}vh`;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          pinSpacing: true,
          pinType: isTouch ? 'transform' : 'fixed',
          scrub: isTouch ? 0.35 : 0.5,
          start: 'top top',
          end: `+=${pinDistance}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
            const rawIdx = Math.floor(self.progress * totalCategories);
            const safeIdx = Math.min(totalCategories - 1, Math.max(0, rawIdx));
            setActiveCategoryIdx(safeIdx);
          },
        },
      });

      // Chain step animations between cards
      for (let i = 1; i < cards.length; i++) {
        const prevCard = cards[i - 1];
        const currCard = cards[i];

        tl.to(
          prevCard,
          {
            yPercent: -60,
            scale: 0.92,
            opacity: 0,
            rotateX: 8,
            duration: 0.8,
            ease: 'power2.inOut',
            pointerEvents: 'none',
          },
          `step-${i}`
        ).fromTo(
          currCard,
          {
            yPercent: 25,
            scale: 0.96,
            opacity: 0,
            rotateX: -6,
            pointerEvents: 'none',
          },
          {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            ease: 'power2.out',
            pointerEvents: 'auto',
          },
          `step-${i}-=0.2`
        );
      }
    }, section);

    // Refresh ScrollTrigger to ensure accurate trigger coordinates
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [totalCategories]);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative w-full h-screen bg-[#09090D] text-white border-b border-white/15 select-none overflow-hidden"
    >
      {/* CONTEXTUAL PROFESSIONAL BACKGROUND PHOTO */}
      <SectionBackgroundLayer sectionKey="skills" opacity={0.42} />

      {/* ELEGANT FIXED VERTICAL PROGRESS BAR ON RIGHT EDGE */}
      <VerticalSectionProgressBar targetId="skills" accentColor="#10B981" label="SKILLS" sectionCode="09" />

      {/* Background Decorative Tech Grid & HUD Overlays to fill empty black spaces */}
      <div className="absolute inset-0 brutalist-grid opacity-35 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E0533C]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Persistent Top Scroll Lock Status Banner */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-black/90 border-b border-white/10 px-4 sm:px-8 py-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/70">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-bold">SCROLL-LOCK ACTIVE // STAGE 0{activeCategoryIdx + 1} OF 0{totalCategories}</span>
          <span className="hidden md:inline text-white/40">• KEEP SCROLLING TO CYCLE SKILL ARCHITECTURE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold">{Math.round(scrollProgress * 100)}% COMPLETE</span>
          <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/20">
            <div 
              className="h-full bg-emerald-400 transition-all duration-150"
              style={{ width: `${Math.max(8, scrollProgress * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="h-full w-full flex flex-col justify-between pt-16 pb-4 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        
        {/* HEADER BAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center border-b border-white/15 pb-3 w-full flex-shrink-0 mt-2">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 flex items-center gap-2 mb-1 font-bold">
              <span>[SCENE 09 // SKILL ARCHITECTURE & TELEMETRY]</span>
              <span className="w-12 h-[1px] bg-emerald-500/40" />
            </div>
            <StripedTypography 
              text="skills" 
              progress={Math.round(scrollProgress * 100)} 
              color="#10B981" 
              className="py-0" 
            />
          </div>

          <div className="lg:col-span-6">
            <div className="border border-dashed border-emerald-500/40 p-3 bg-black/80 rounded-none text-left shadow-lg flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono text-white/90 font-bold leading-relaxed uppercase">
                  QUANTITATIVE FP&A MODELING, POWER BI TELEMETRY & CMA-GRADE FINANCIAL GOVERNANCE.
                </p>
                <div className="text-[9px] font-mono text-emerald-400 mt-1">
                  SCROLL FREELY — SECTION REMAINS LOCKED UNTIL ALL 3 ARCHITECTURES ARE EXPLORED
                </div>
              </div>
              <div className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-mono text-[10px] font-bold uppercase rounded-xs whitespace-nowrap hidden sm:block">
                380/500 CMA
              </div>
            </div>
          </div>
        </div>

        {/* 3 CATEGORY TABS WITH LIVE INDICATOR */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 flex-shrink-0">
          <div className="flex flex-wrap gap-2">
            {SKILL_CATEGORIES.map((cat, idx) => (
              <button
                key={cat.category}
                onClick={() => handleSelectCategory(idx)}
                className={`px-4 py-1.5 text-[11px] font-mono uppercase tracking-wider border transition-all rounded-none cursor-pointer flex items-center gap-2 ${
                  activeCategoryIdx === idx
                    ? 'bg-emerald-500 text-black font-bold border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'border-white/20 text-white/70 bg-white/5 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>0{idx + 1}.</span>
                <span>{cat.category}</span>
                {activeCategoryIdx === idx && (
                  <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                )}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono text-white/50 bg-white/5 px-3 py-1 border border-white/10">
            <span className="text-emerald-400 font-bold">• 16+ MODELS VERIFIED</span>
            <span className="text-[#E0533C] font-bold">• 1.2M+ DAX ROWS</span>
            <span className="text-blue-400 font-bold">• IMA ETHICS CERTIFIED</span>
          </div>
        </div>

        {/* MAIN STACK CONTAINER WITH VERTICAL SECTION SPINE */}
        <div className="relative flex-1 w-full my-auto flex items-center justify-between gap-3 sm:gap-5 overflow-hidden py-2">
          
          {/* LEFT VERTICAL SECTION SPINE (Vertical Typography & Tech Stack Indicator) */}
          <div className="hidden md:flex flex-col items-center justify-between py-3 px-2 bg-black/85 border border-emerald-500/30 h-full max-h-[480px] flex-shrink-0 z-20 shadow-xl">
            {/* Vertical Striped Typography with dynamic top-to-bottom scroll fill */}
            <div className="w-12 h-44 flex items-center justify-center overflow-hidden">
              <StripedTypography
                text="skills"
                progress={Math.round(scrollProgress * 100)}
                color="#10B981"
                isVertical={true}
                className="w-full h-full"
              />
            </div>

            {/* Vertical Category Step Nodes */}
            <div className="flex flex-col items-center gap-2 my-auto py-1">
              <div className="w-[1px] h-6 bg-gradient-to-b from-transparent via-emerald-400/50 to-emerald-400" />
              {SKILL_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.category}
                  onClick={() => handleSelectCategory(idx)}
                  className={`w-6 h-6 flex items-center justify-center font-mono text-[10px] font-bold border transition-all cursor-pointer ${
                    activeCategoryIdx === idx
                      ? 'bg-emerald-400 text-black border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.5)] scale-110'
                      : 'bg-black/60 text-white/50 border-white/20 hover:border-emerald-400/50 hover:text-emerald-300'
                  }`}
                  title={cat.category}
                >
                  0{idx + 1}
                </button>
              ))}
              <div className="w-[1px] h-6 bg-gradient-to-b from-emerald-400 via-emerald-400/50 to-transparent" />
            </div>

            {/* Vertical live percentage progress bar */}
            <div className="flex flex-col items-center gap-1 pt-1 border-t border-white/10 font-mono text-[9px]">
              <div className="w-1.5 h-10 bg-white/15 overflow-hidden relative">
                <div
                  className="w-full transition-all duration-150 absolute bottom-0 left-0 right-0"
                  style={{
                    height: `${Math.max(4, Math.round(scrollProgress * 100))}%`,
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 6px #10B981',
                  }}
                />
              </div>
              <span className="font-bold text-[9px] text-emerald-400">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>
          </div>

          {/* MAIN PINNED CARD STACK STAGE */}
          <div 
            ref={pinContainerRef}
            className="relative flex-1 w-full h-[480px] sm:h-[510px] md:h-[530px]"
          >
            {SKILL_CATEGORIES.map((category, catIdx) => (
              <div
                key={category.category}
                ref={(el) => (cardsRef.current[catIdx] = el)}
                className="absolute inset-0 w-full h-full bg-[#111116] border-2 border-white/25 rounded-none p-4 sm:p-6 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-y-auto text-white"
              >
                {/* RIGHT VERTICAL ACCENT BADGES */}
                <div className="absolute right-3 top-4 flex flex-col gap-1.5 z-20 pointer-events-none hidden lg:flex">
                  <div className="bg-[#E0533C] text-black text-[8px] font-mono font-bold tracking-widest uppercase px-1.5 py-2.5 [writing-mode:vertical-rl] rotate-180 border border-black/20 shadow-md">
                    (01) SKILLS
                  </div>
                  <div className="bg-emerald-400 text-black text-[8px] font-mono font-bold tracking-widest uppercase px-1.5 py-2.5 [writing-mode:vertical-rl] rotate-180 border border-black/20 shadow-md">
                    (02) {category.category.split(' ')[0]}
                  </div>
                  <div className="bg-blue-400 text-black text-[8px] font-mono font-bold tracking-widest uppercase px-1.5 py-2.5 [writing-mode:vertical-rl] rotate-180 border border-black/20 shadow-md">
                    (03) MERIT
                  </div>
                </div>

                <div>
                  {/* TOP CARD HEADER BAR */}
                  <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-emerald-400 text-black font-mono text-[10px] font-bold uppercase rounded-none">
                        ARCHITECTURE 0{catIdx + 1} OF 0{totalCategories}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl text-white font-bold uppercase tracking-tight">
                        {category.category}
                      </h3>
                    </div>

                    <div className="font-mono text-xs text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 border border-emerald-500/40">
                      IMA / CMA CERTIFIED
                    </div>
                  </div>

                  <p className="text-xs font-mono text-white/80 font-normal mb-3 border-l-2 border-emerald-400 pl-3">
                    {category.description}
                  </p>

                  {/* HIGH-DENSITY SKILL TILES GRID WITH HOVER-REVEAL TOOLTIPS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.skills.map((skill, sIdx) => {
                      // Simulated high proficiency meter & experience mapping
                      const profValue = sIdx === 0 ? 98 : sIdx === 1 ? 95 : sIdx === 2 ? 92 : 88;
                      const expYears = sIdx === 0 ? '5+ Years' : sIdx === 1 ? '4+ Years' : '3+ Years';

                      return (
                        <div
                          key={skill.name}
                          className="p-3.5 border border-white/15 bg-black/70 hover:border-emerald-400 transition-all rounded-none group flex flex-col justify-between shadow-md relative overflow-visible cursor-pointer"
                        >
                          {/* HOVER-REVEAL EDITORIAL TOOLTIP */}
                          <div className="absolute -top-3 right-3 z-30 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none">
                            <div className="px-2.5 py-1 bg-emerald-950/95 border border-emerald-400 text-emerald-300 font-mono text-[9px] font-bold uppercase tracking-wider shadow-2xl backdrop-blur-md flex items-center gap-1.5 rounded-none">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              <span>{profValue}% MASTERY</span>
                              <span className="text-white/40">•</span>
                              <span className="text-white">{expYears}</span>
                            </div>
                          </div>

                          <div>
                            {/* Skill Top Meta */}
                            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-emerald-400" />
                                <span>{skill.proficiency}</span>
                              </span>
                              <span className="text-white/60 font-bold">{profValue}%</span>
                            </div>

                            {/* Skill Proficiency Gauge Bar */}
                            <div className="w-full h-1 bg-white/10 rounded-none mb-2 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-400 transition-all duration-1000 group-hover:brightness-125"
                                style={{ width: `${profValue}%` }}
                              />
                            </div>

                            <h4 className="font-serif text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                              {skill.name}
                            </h4>

                            <p className="mt-1 text-[11px] font-sans text-white/80 font-normal leading-relaxed">
                              {skill.detail}
                            </p>
                          </div>

                          <div className="mt-3 pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] font-mono uppercase text-white/50 font-medium">
                            <span className="text-white/70 font-semibold group-hover:text-emerald-300 transition-colors">
                              ENTERPRISE AUDIT READY
                            </span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* BOTTOM FOOTER OF ACTIVE CARD */}
                <div className="pt-3 mt-2 border-t border-white/15 flex items-center justify-between font-mono text-[10px] text-white/80">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-white font-semibold">
                      VERIFIED BY INSTITUTE OF MANAGEMENT ACCOUNTANTS (IMA) & MILES EDUCATION
                    </span>
                  </div>
                  <div className="text-emerald-400 font-bold">
                    DOMAIN 0{catIdx + 1} // 0{totalCategories}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM STEP CONTROLS & CONTINUOUS SCROLL NAVIGATION CUE */}
        <div className="flex items-center justify-between border-t border-white/15 pt-2 font-mono text-xs text-white/80 font-medium flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold animate-pulse">▼</span>
            <span>SCROLL TO ADVANCE SKILL DOMAINS (OR CLICK TABS ABOVE)</span>
          </div>

          <div className="flex items-center gap-2">
            {SKILL_CATEGORIES.map((_, i) => (
              <button
                key={i}
                onClick={() => handleSelectCategory(i)}
                className={`transition-all cursor-pointer ${
                  i === activeCategoryIdx
                    ? 'w-6 h-1.5 bg-emerald-400'
                    : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to domain ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
