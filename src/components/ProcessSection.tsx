import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, CheckCircle2, ArrowUpRight, Sparkles, Workflow, Check } from 'lucide-react';
import { PROCESS_STAGES } from '../data/portfolioData';
import { StripedTypography } from './StripedTypography';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
import { ProgressiveTextFill } from './ProgressiveTextFill';
import { SectionBackgroundLayer } from './SectionBackgroundLayer';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { soundFx } from '../lib/sound';

export const ProcessSection: React.FC = () => {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const totalStages = PROCESS_STAGES.length;

  const handleSelectStage = (idx: number) => {
    soundFx.playClick();
    setActiveStageIdx(idx);
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

      const pinDistance = `${totalStages * 100}vh`;

      let lastAnnouncedStage = -1;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.5,
          start: 'top top',
          end: `+=${pinDistance}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
            const rawIdx = Math.floor(self.progress * totalStages);
            const safeIdx = Math.min(totalStages - 1, Math.max(0, rawIdx));
            if (safeIdx !== lastAnnouncedStage) {
              lastAnnouncedStage = safeIdx;
              soundFx.playMilestone(440 + safeIdx * 70);
            }
            setActiveStageIdx(safeIdx);
          },
        },
      });

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

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [totalStages]);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative w-full h-screen bg-[#09090D] text-white border-b border-white/15 select-none overflow-hidden"
    >
      {/* CONTEXTUAL PROFESSIONAL BACKGROUND PHOTO */}
      <SectionBackgroundLayer sectionKey="process" opacity={0.42} />

      {/* ELEGANT FIXED VERTICAL PROGRESS BAR ON RIGHT EDGE */}
      <VerticalSectionProgressBar targetId="process" accentColor="#E0533C" label="PROCESS" sectionCode="11" />

      {/* Background Graphic Grid to fill empty space */}
      <div className="absolute inset-0 brutalist-grid opacity-35 pointer-events-none" />

      {/* Top Scroll Lock HUD */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-black/90 border-b border-white/10 px-4 sm:px-8 py-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/70">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-bold">SCROLL-LOCK ACTIVE // STAGE 0{activeStageIdx + 1} OF 0{totalStages}</span>
          <span className="hidden md:inline text-white/40">• SCROLL TO ADVANCE METHODOLOGY PHASES</span>
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
              <span>[SCENE 11 // 5-STAGE ADVISORY EXECUTION MATRIX]</span>
              <span className="w-12 h-[1px] bg-emerald-500/40" />
            </div>
            <StripedTypography 
              text="process" 
              progress={Math.round(scrollProgress * 100)} 
              color="#E0533C" 
              className="py-0" 
            />
          </div>

          <div className="lg:col-span-6">
            <div className="border border-dashed border-white/30 p-3 bg-black/80 rounded-none text-left shadow-lg">
              <p className="text-[11px] font-mono text-white/90 font-bold leading-relaxed uppercase">
                FROM STRATEGIC SCOPE DISCOVERY TO FINANCIAL ENGINE PROTOTYPING & C-SUITE STAKEHOLDER HANDOFF.
              </p>
            </div>
          </div>
        </div>

        {/* STAGE SELECTOR TABS */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 flex-shrink-0">
          <div className="flex flex-wrap gap-2">
            {PROCESS_STAGES.map((stage, idx) => (
              <button
                key={stage.number}
                onClick={() => handleSelectStage(idx)}
                className={`px-3.5 py-1 text-[10px] font-mono uppercase tracking-widest border transition-all rounded-none cursor-pointer flex items-center gap-1.5 ${
                  activeStageIdx === idx
                    ? 'bg-emerald-500 text-black font-bold border-emerald-400 shadow-lg'
                    : 'border-white/20 text-white/70 bg-white/5 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{stage.number}.</span>
                <span>{stage.title}</span>
                <span className="text-white/40">({stage.timeframe})</span>
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono text-white/50 bg-white/5 px-3 py-1 border border-white/10">
            <span className="text-emerald-400 font-bold">ZERO ASSUMPTION AUDIT</span>
            <span>•</span>
            <span className="text-[#E0533C] font-bold">100% RECONCILED</span>
          </div>
        </div>

        {/* MAIN STACK CONTAINER WITH VERTICAL SECTION SPINE */}
        <div className="relative flex-1 w-full my-auto flex items-center justify-between gap-3 sm:gap-5 overflow-hidden py-2">
          
          {/* LEFT VERTICAL SECTION SPINE (Vertical Typography & 5-Phase Pipeline) */}
          <div className="hidden md:flex flex-col items-center justify-between py-3 px-2 bg-black/85 border border-[#E0533C]/35 h-full max-h-[480px] flex-shrink-0 z-20 shadow-xl">
            {/* Vertical Striped Typography with dynamic top-to-bottom scroll fill */}
            <div className="w-12 h-44 flex items-center justify-center overflow-hidden">
              <StripedTypography
                text="process"
                progress={Math.round(scrollProgress * 100)}
                color="#E0533C"
                isVertical={true}
                className="w-full h-full"
              />
            </div>

            {/* Vertical Stage Step Nodes (01 -> 05) */}
            <div className="flex flex-col items-center gap-2 my-auto py-1">
              <div className="w-[1px] h-6 bg-gradient-to-b from-transparent via-[#E0533C]/50 to-[#E0533C]" />
              {PROCESS_STAGES.map((stage, idx) => (
                <button
                  key={stage.number}
                  onClick={() => handleSelectStage(idx)}
                  className={`w-6 h-6 flex items-center justify-center font-mono text-[10px] font-bold border transition-all cursor-pointer ${
                    activeStageIdx === idx
                      ? 'bg-[#E0533C] text-white border-[#E0533C] shadow-[0_0_12px_rgba(224,83,60,0.6)] scale-110'
                      : 'bg-black/60 text-white/50 border-white/20 hover:border-[#E0533C]/50 hover:text-white'
                  }`}
                  title={stage.title}
                >
                  {stage.number}
                </button>
              ))}
              <div className="w-[1px] h-6 bg-gradient-to-b from-[#E0533C] via-[#E0533C]/50 to-transparent" />
            </div>

            {/* Vertical live percentage progress bar */}
            <div className="flex flex-col items-center gap-1 pt-1 border-t border-white/10 font-mono text-[9px]">
              <div className="w-1.5 h-10 bg-white/15 overflow-hidden relative">
                <div
                  className="w-full transition-all duration-150 absolute bottom-0 left-0 right-0"
                  style={{
                    height: `${Math.max(4, Math.round(scrollProgress * 100))}%`,
                    backgroundColor: '#E0533C',
                    boxShadow: '0 0 6px #E0533C',
                  }}
                />
              </div>
              <span className="font-bold text-[9px] text-[#E0533C]">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>
          </div>

          {/* MAIN PINNED CARD STACK CONTAINER */}
          <div 
            ref={pinContainerRef}
            className="relative flex-1 w-full h-[480px] sm:h-[510px] md:h-[530px]"
          >
            {PROCESS_STAGES.map((stage, idx) => (
              <div
                key={stage.number}
                ref={(el) => (cardsRef.current[idx] = el)}
                className="absolute inset-0 w-full h-full bg-[#111116] border-2 border-white/25 rounded-none p-4 sm:p-6 md:p-7 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-y-auto text-white"
              >
                {/* RIGHT VERTICAL BADGES */}
                <div className="absolute right-3 top-4 flex flex-col gap-1.5 z-20 pointer-events-none hidden lg:flex">
                  <div className="bg-[#E0533C] text-black text-[8px] font-mono font-bold tracking-widest uppercase px-1.5 py-2.5 [writing-mode:vertical-rl] rotate-180 border border-black/20 shadow-md">
                    (01) STAGE {stage.number}
                  </div>
                  <div className="bg-emerald-400 text-black text-[8px] font-mono font-bold tracking-widest uppercase px-1.5 py-2.5 [writing-mode:vertical-rl] rotate-180 border border-black/20 shadow-md">
                    (02) {stage.title}
                  </div>
                </div>

                <div>
                  {/* CARD TOP BAR */}
                  <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-emerald-400 text-black font-mono text-[10px] font-bold uppercase rounded-none">
                        PHASE {stage.number} // {stage.timeframe}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl text-white font-bold uppercase tracking-tight">
                        {stage.title}: {stage.subtitle}
                      </h3>
                    </div>

                    <div className="font-mono text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 border border-emerald-500/30">
                      DELIVERABLE: {stage.deliverable.split(' ')[0]}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    
                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-7 space-y-3">
                      <p className="text-xs sm:text-sm font-sans font-normal text-white/80 leading-relaxed border-l-2 border-emerald-400 pl-3">
                        {stage.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {/* Our Part */}
                        <div className="p-3 bg-black/60 border border-white/15">
                          <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold mb-2">
                            ADVISOR DELIVERABLES:
                          </div>
                          <div className="space-y-1.5">
                            {stage.ourPart.map((p, pIdx) => (
                              <div key={pIdx} className="flex items-center gap-1.5 text-xs font-mono text-white/90">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                <span>{p}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Client Input */}
                        <div className="p-3 bg-black/60 border border-white/15">
                          <div className="text-[10px] font-mono uppercase text-amber-400 font-bold mb-2">
                            CLIENT INPUTS:
                          </div>
                          <div className="space-y-1.5">
                            {stage.yourPart.map((p, pIdx) => (
                              <div key={pIdx} className="flex items-center gap-1.5 text-xs font-mono text-white/90">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                                <span>{p}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT PHOTO FRAME */}
                    <div className="lg:col-span-5">
                      {stage.image && (
                        <div className="relative aspect-[4/3] w-full rounded-none overflow-hidden border border-dashed border-white/30 bg-black group shadow-xl">
                          <img
                            src={stage.image}
                            alt={stage.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between font-mono text-[9px] text-white">
                            <span className="bg-black/80 px-2 py-0.5 border border-white/15 font-bold">DELIVERABLE</span>
                            <span className="bg-emerald-500 text-black font-bold px-2 py-0.5">{stage.deliverable}</span>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* FOOTER STRIP */}
                <div className="pt-3 mt-3 border-t border-white/15 flex items-center justify-between font-mono text-[10px] text-white/90">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    STANDARD OPERATING METHODOLOGY
                  </span>
                  <span className="font-semibold text-white/60">PHASE 0{idx + 1} OF 0{totalStages}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM PROGRESS CUE */}
        <div className="flex items-center justify-between border-t border-white/15 pt-2 font-mono text-xs text-white/80 font-medium flex-shrink-0">
          <span>SCROLL TO ADVANCE METHODOLOGY</span>
          <span className="text-emerald-400 font-bold">ACTIVE: 0{activeStageIdx + 1} / 0{totalStages}</span>
        </div>

      </div>
    </section>
  );
};
