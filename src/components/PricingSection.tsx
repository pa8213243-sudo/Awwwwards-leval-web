import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, ArrowUpRight, DollarSign, Euro, Clock, Target, ShieldCheck, Layers, ChevronDown } from 'lucide-react';
import { PRICING_CONFIG } from '../data/pricingConfig';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
import { ProgressiveTextFill } from './ProgressiveTextFill';
import { StripedTypography } from './StripedTypography';
import { SectionBackgroundLayer } from './SectionBackgroundLayer';
import { gsap, ScrollTrigger, Flip, setupSectionViewportClamping } from '../lib/gsap';
import { soundFx } from '../lib/sound';

interface PricingSectionProps {
  onContact: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onContact }) => {
  const [currency, setCurrency] = useState<'EUR' | 'USD'>('USD');
  const [activePlanIdx, setActivePlanIdx] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let lastStage = -1;
    const isTouch = typeof window !== 'undefined' && (window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: isTouch ? 'top 80%' : 'top top',
        end: isTouch ? 'bottom 20%' : '+=180%',
        pin: !isTouch,
        pinSpacing: !isTouch,
        pinType: isTouch ? 'transform' : 'fixed',
        scrub: isTouch ? 0.25 : 0.5,
        anticipatePin: isTouch ? 0 : 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = Math.round(self.progress * 100);
          setProgressPercent(p);
          const totalPlans = PRICING_CONFIG.length;
          const current = Math.min(totalPlans - 1, Math.floor(self.progress * totalPlans));
          if (current !== lastStage) {
            lastStage = current;
            soundFx.triggerSectionMilestone('pricing', current, 460 + current * 75);
          }
          setActivePlanIdx(current);
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const activePlan = PRICING_CONFIG[activePlanIdx];

  const handleSelectTier = (idx: number) => {
    soundFx.playClick();
    if (cardsRef.current) {
      const state = Flip.getState(cardsRef.current.children, { props: 'transform,opacity,width,height' });
      setActivePlanIdx(idx);
      requestAnimationFrame(() => {
        if (cardsRef.current) {
          Flip.from(state, {
            duration: 0.4,
            ease: 'power3.out',
            stagger: 0.02,
            absolute: true,
            onComplete: () => {
              // Ensure container layout shifts are calculated after media reaches target scale
              ScrollTrigger.refresh();
              requestAnimationFrame(() => {
                ScrollTrigger.refresh();
                setTimeout(() => ScrollTrigger.refresh(), 100);
              });
            },
            onInterrupt: () => {
              ScrollTrigger.refresh();
            },
          });
        }
      });
    } else {
      setActivePlanIdx(idx);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative w-full min-h-screen bg-[#0A0A0E] text-white border-b border-white/10 select-none overflow-hidden flex flex-col justify-between py-6 md:py-8 px-4 sm:px-6 md:px-12"
    >
      {/* CONTEXTUAL PROFESSIONAL BACKGROUND PHOTO */}
      <SectionBackgroundLayer sectionKey="pricing" opacity={0.42} />

      {/* ELEGANT FIXED VERTICAL PROGRESS BAR ON RIGHT EDGE */}
      <VerticalSectionProgressBar targetId="pricing" accentColor="#E0533C" label="PRICING" sectionCode="05" />

      <div className="max-w-7xl mx-auto w-full my-auto flex flex-col lg:flex-row items-stretch gap-4 lg:gap-6 relative z-10 pt-4">
        
        {/* LEFT VERTICAL SECTION SPINE (Vertical Typography & Tier Rail) */}
        <div className="hidden md:flex flex-col items-center justify-between py-4 px-2.5 bg-black/85 border border-[#E0533C]/35 backdrop-blur-md flex-shrink-0 z-20 shadow-2xl">
          {/* Vertical Striped Typography */}
          <div className="w-12 h-44 flex items-center justify-center overflow-hidden">
            <StripedTypography
              text="pricing"
              progress={progressPercent}
              color="#E0533C"
              isVertical={true}
              className="w-full h-full"
            />
          </div>

          {/* Vertical Tier Stepper Nodes (01 -> 04) with Vertical Animation */}
          <div className="flex flex-col items-center gap-2 my-auto py-2">
            <div className="w-[1px] h-6 bg-gradient-to-b from-transparent via-[#E0533C]/50 to-[#E0533C]" />
            {PRICING_CONFIG.map((plan, idx) => (
              <button
                key={plan.id}
                onClick={() => handleSelectTier(idx)}
                className={`w-6 h-6 flex items-center justify-center font-mono text-[10px] font-bold border transition-all cursor-pointer ${
                  activePlanIdx === idx
                    ? 'bg-[#E0533C] text-white border-[#E0533C] shadow-[0_0_12px_rgba(224,83,60,0.7)] scale-110'
                    : 'bg-black/60 text-white/50 border-white/20 hover:border-[#E0533C]/50 hover:text-white'
                }`}
                title={plan.title}
              >
                0{idx + 1}
              </button>
            ))}
            <div className="w-[1px] h-6 bg-gradient-to-b from-[#E0533C] via-[#E0533C]/50 to-transparent" />
          </div>

          {/* Vertical Progress Meter */}
          <div className="flex flex-col items-center gap-1 pt-1.5 border-t border-white/10 font-mono text-[9px]">
            <div className="w-1.5 h-10 bg-white/15 overflow-hidden relative">
              <div
                className="w-full transition-all duration-150 absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.max(4, progressPercent)}%`,
                  backgroundColor: '#E0533C',
                  boxShadow: '0 0 6px #E0533C',
                }}
              />
            </div>
            <span className="font-bold text-[9px] text-[#E0533C]">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* MAIN PRICING CONTENT STAGE */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          
          {/* Top Bar with Currency Toggle & Tier Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <div className="text-[10px] font-mono text-[#E0533C] font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E0533C] animate-pulse" />
                <span>ADVISORY RATES & INSTITUTIONAL DELIVERABLES</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mt-0.5">
                ENGAGEMENT TIERS
              </h2>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-center">
              <div className="font-mono text-xs text-emerald-400 font-bold px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/30">
                TIER 0{activePlanIdx + 1} / 0{PRICING_CONFIG.length} ACTIVE
              </div>

              <div className="flex items-center gap-1 bg-black/60 border border-white/20 p-0.5 font-mono text-xs">
                <button
                  onClick={() => { soundFx.playClick(); setCurrency('USD'); }}
                  className={`py-1 px-2.5 transition-all flex items-center gap-1 cursor-pointer ${
                    currency === 'USD' ? 'bg-[#E0533C] text-white font-bold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <DollarSign className="w-3 h-3" />
                  <span>USD</span>
                </button>
                <button
                  onClick={() => { soundFx.playClick(); setCurrency('EUR'); }}
                  className={`py-1 px-2.5 transition-all flex items-center gap-1 cursor-pointer ${
                    currency === 'EUR' ? 'bg-[#E0533C] text-white font-bold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Euro className="w-3 h-3" />
                  <span>EUR</span>
                </button>
              </div>
            </div>
          </div>

          {/* FOUR ENGAGEMENT TIER CARDS (Horizontal on desktop, clickable) */}
          <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-shrink-0">
            {PRICING_CONFIG.map((plan, idx) => {
              const isActive = activePlanIdx === idx;
              const displayPrice = currency === 'USD' 
                ? `$${plan.startingPriceUsd.toLocaleString()}+` 
                : `€${plan.startingPriceEur.toLocaleString()}+`;

              return (
                <div
                  key={plan.id}
                  onClick={() => handleSelectTier(idx)}
                  className={`p-3.5 sm:p-4 transition-all duration-200 cursor-pointer border flex flex-col justify-between gap-2.5 ${
                    isActive
                      ? 'bg-[#121218] border-2 border-emerald-400 text-white shadow-xl ring-1 ring-emerald-500/30 scale-[1.02]'
                      : 'bg-black/60 border-white/15 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-[11px] font-bold uppercase ${isActive ? 'text-emerald-400' : 'text-white/50'}`}>
                      TIER 0{idx + 1} // {plan.timeline}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-base font-bold uppercase tracking-tight mb-0.5 text-white">
                      {plan.title}
                    </h3>
                    <div className={`font-mono text-lg sm:text-xl font-bold my-0.5 ${isActive ? 'text-emerald-400' : 'text-white'}`}>
                      {displayPrice}
                    </div>
                    <p className="text-[11px] font-sans font-normal text-white/80 leading-relaxed">
                      {plan.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                    <span className="font-medium text-white/80">{plan.deliverables.length} DELIVERABLES</span>
                    <span className={isActive ? 'text-emerald-400 font-bold' : 'text-white/50'}>
                      {isActive ? 'ACTIVE TIER ✓' : 'SELECT →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTIVE TIER DETAILED BREAKDOWN & ACTION */}
          {activePlan && (
            <div className="bg-[#111116] border border-dashed border-white/30 p-4 sm:p-5 shadow-2xl space-y-4 flex-grow flex flex-col justify-between transition-all duration-200 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-2.5">
                <div>
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest mb-0.5">
                    SELECTED ADVISORY SCOPE (SCROLL TO SWITCH):
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-white font-bold">
                    {activePlan.title} — {currency === 'USD' ? `$${activePlan.startingPriceUsd.toLocaleString()}+` : `€${activePlan.startingPriceEur.toLocaleString()}+`}
                  </h3>
                </div>

                <button
                  onClick={onContact}
                  className="py-2.5 px-5 bg-[#E0533C] hover:bg-[#c94530] text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer self-start sm:self-auto"
                >
                  <span>BOOK INITIATION CALL</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start my-auto">
                {/* Deliverables List */}
                <div className="lg:col-span-7 space-y-2">
                  <div className="text-[11px] font-mono text-white/70 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                    <span>INCLUDED DELIVERABLES & SOPs:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activePlan.deliverables.map((item, dIdx) => (
                      <div key={dIdx} className="p-2.5 bg-black/60 border border-white/15 text-[11px] font-mono text-white font-medium flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Engagement Impact Box */}
                <div className="lg:col-span-5 bg-black/60 border border-white/15 p-3.5 space-y-2.5">
                  <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ESTIMATED IMPACT & TIMELINE</span>
                  </div>

                  <div className="space-y-2 text-[11px] font-mono text-white/80 font-medium">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                      <span>TIMELINE:</span>
                      <span className="text-white font-bold">{activePlan.timeline}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                      <span>AUDIT STANDARDS:</span>
                      <span className="text-emerald-400 font-bold">CMA / IMA USA GRADE</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>COMMUNICATION:</span>
                      <span className="text-white font-bold">DIRECT SLACK & ASANA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};


