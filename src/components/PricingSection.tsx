import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ArrowUpRight, DollarSign, Euro, Clock, Target, ArrowRight, ChevronRight } from 'lucide-react';
import { PRICING_CONFIG } from '../data/pricingConfig';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
import { SectionBackgroundLayer } from './SectionBackgroundLayer';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { soundFx } from '../lib/sound';

interface PricingSectionProps {
  onContact: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onContact }) => {
  const [currency, setCurrency] = useState<'EUR' | 'USD'>('USD');
  const [activePlanIdx, setActivePlanIdx] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const totalPlans = PRICING_CONFIG.length;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    let lastStage = -1;

    const ctx = gsap.context(() => {
      if (!isMobile) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: `+=${totalPlans * 100}vh`,
          pin: true,
          pinSpacing: true,
          scrub: 0.4,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const prog = Math.min(1, Math.max(0, self.progress));
            setScrollProgress(Math.round(prog * 100));

            const rawStage = Math.floor(prog * totalPlans);
            const safeStage = Math.min(totalPlans - 1, Math.max(0, rawStage));

            if (safeStage !== lastStage) {
              lastStage = safeStage;
              soundFx.triggerSectionMilestone('pricing', safeStage, 460 + safeStage * 75);
              setActivePlanIdx(safeStage);
            }
          },
        });
      } else {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 0.2,
          onUpdate: (self) => {
            const prog = Math.min(1, Math.max(0, self.progress));
            setScrollProgress(Math.round(prog * 100));
            const rawStage = Math.floor(prog * totalPlans);
            const safeStage = Math.min(totalPlans - 1, Math.max(0, rawStage));
            if (safeStage !== lastStage) {
              lastStage = safeStage;
              setActivePlanIdx(safeStage);
            }
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [totalPlans]);

  const activePlan = PRICING_CONFIG[activePlanIdx];
  const displayPrice = currency === 'USD'
    ? `$${activePlan.startingPriceUsd.toLocaleString()}+`
    : `€${activePlan.startingPriceEur.toLocaleString()}+`;

  // Fill percentage for the large display text based on current tier progress
  const tierFillPercent = ((activePlanIdx + 1) / totalPlans) * 100;

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative w-full min-h-screen lg:h-screen bg-[#F3F2EE] text-[#111116] border-b border-black/10 select-none overflow-hidden"
    >
      {/* Background layer */}
      <SectionBackgroundLayer sectionKey="pricing" opacity={0.12} />

      {/* Vertical progress bar */}
      <VerticalSectionProgressBar targetId="pricing" accentColor="#E0533C" label="PRICING" sectionCode="05" isLightBg={true} />

      {/* Main content container */}
      <div className="w-full h-full flex flex-col justify-between px-4 sm:px-6 md:px-10 lg:px-14 py-6 sm:py-8 max-w-[1400px] mx-auto relative z-10">

        {/* TOP: Section Label */}
        <div className="flex items-center justify-between border-b border-black/15 pb-2.5 flex-shrink-0">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#E0533C] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#E0533C] animate-pulse" />
            <span>[SCENE 05 // ADVISORY ENGAGEMENT TIERS]</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase text-[#666] font-bold hidden sm:block">
              {String(activePlanIdx + 1).padStart(2, '0')} / {String(totalPlans).padStart(2, '0')}
            </span>
            {/* Currency Toggle */}
            <div className="flex items-center gap-0.5 bg-white border border-black/15 p-0.5 font-mono text-[10px] shadow-xs">
              <button
                onClick={() => { soundFx.playClick(); setCurrency('USD'); }}
                className={`py-0.5 px-2 transition-all flex items-center gap-0.5 cursor-pointer ${
                  currency === 'USD' ? 'bg-[#E0533C] text-white font-bold' : 'text-[#555] hover:text-black'
                }`}
              >
                <DollarSign className="w-3 h-3" />
                <span>USD</span>
              </button>
              <button
                onClick={() => { soundFx.playClick(); setCurrency('EUR'); }}
                className={`py-0.5 px-2 transition-all flex items-center gap-0.5 cursor-pointer ${
                  currency === 'EUR' ? 'bg-[#E0533C] text-white font-bold' : 'text-[#555] hover:text-black'
                }`}
              >
                <Euro className="w-3 h-3" />
                <span>EUR</span>
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE: Main Content — Display Title Left + Active Tier Card Right */}
        <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-6 lg:gap-10 my-auto py-4 lg:py-6">

          {/* LEFT: Large Display Title with progressive fill */}
          <div className="lg:w-[38%] xl:w-[35%] flex flex-col justify-between flex-shrink-0">
            {/* Display Title */}
            <div className="relative">
              <div className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] font-black uppercase leading-[0.92] tracking-tighter text-transparent relative"
                style={{
                  WebkitTextStroke: '1.5px rgba(0,0,0,0.15)',
                }}
              >
                <span className="block">Engage</span>
                <span className="block">ment</span>
                <span className="block">Tiers</span>

                {/* Fill overlay — clips based on scroll progress */}
                <div
                  className="absolute inset-0 font-serif text-[clamp(2.5rem,6vw,5.5rem)] font-black uppercase leading-[0.92] tracking-tighter text-[#111116] overflow-hidden transition-all duration-500 ease-out"
                  style={{ clipPath: `inset(0 0 ${100 - tierFillPercent}% 0)` }}
                >
                  <span className="block">Engage</span>
                  <span className="block">ment</span>
                  <span className="block">Tiers</span>
                </div>
              </div>

              {/* Subtitle below title */}
              <p className="font-mono text-[11px] sm:text-xs text-[#666] font-semibold uppercase tracking-wider mt-4 max-w-xs leading-relaxed">
                Advisory rates & institutional deliverables. Scroll to explore each engagement tier.
              </p>
            </div>

            {/* Tier Navigation Dots (desktop only) */}
            <div className="hidden lg:flex flex-col gap-2.5 mt-8">
              <span className="text-[9px] font-mono text-[#999] font-bold uppercase tracking-widest">
                TIERS:
              </span>
              {PRICING_CONFIG.map((plan, idx) => {
                const isActive = activePlanIdx === idx;
                const isPast = idx < activePlanIdx;
                return (
                  <button
                    key={plan.id}
                    onClick={() => { soundFx.playClick(); setActivePlanIdx(idx); }}
                    className={`flex items-center gap-3 text-left transition-all duration-300 cursor-pointer group py-1 ${
                      isActive ? 'opacity-100' : 'opacity-50 hover:opacity-80'
                    }`}
                  >
                    <div className={`w-8 h-[2px] transition-all duration-500 ${
                      isActive ? 'bg-[#E0533C] w-12' : isPast ? 'bg-[#111]' : 'bg-black/20'
                    }`} />
                    <span className={`font-mono text-[10px] uppercase font-bold transition-colors ${
                      isActive ? 'text-[#E0533C]' : 'text-[#666] group-hover:text-[#333]'
                    }`}>
                      0{idx + 1}. {plan.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Active Tier Card */}
          <div className="flex-1 flex items-stretch">
            <AnimatePresence mode="wait">
              <motion.div
                key={`tier-card-${activePlan.id}`}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="w-full bg-white border-2 border-dashed border-black/25 p-5 sm:p-6 md:p-8 flex flex-col justify-between shadow-md relative"
              >
                {/* Corner ticks */}
                <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#E0533C]" />
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#E0533C]" />
                <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#E0533C]" />
                <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#E0533C]" />

                {/* Card Top: Number + Title */}
                <div>
                  {/* Tier number badge + category */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 uppercase tracking-wider text-white bg-[#E0533C] shadow-xs">
                        TIER 0{activePlanIdx + 1}
                      </span>
                      <span className="font-mono text-[10px] text-[#999] font-bold uppercase">
                        {activePlan.timeline}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-300/40 hidden sm:block">
                      CMA / IMA GRADE
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight uppercase text-[#111] leading-tight">
                    {activePlan.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="font-mono text-xs sm:text-sm font-semibold text-[#E0533C] uppercase tracking-wider mt-1.5">
                    {activePlan.subtitle}
                  </p>

                  {/* Price */}
                  <div className="font-mono text-3xl sm:text-4xl md:text-5xl font-black text-[#111] mt-3 tracking-tight">
                    {displayPrice}
                  </div>

                  {/* Tags — "Best For" */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {activePlan.bestFor.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 bg-[#F4F1EA] text-[#333] border border-black/12 font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Center: Deliverables Grid */}
                <div className="my-5 sm:my-6">
                  <div className="text-[10px] font-mono text-[#666] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-3">
                    <Target className="w-3.5 h-3.5 text-emerald-600" />
                    <span>INCLUDED DELIVERABLES & SOPs</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activePlan.deliverables.map((item, dIdx) => (
                      <div key={dIdx} className="p-2.5 bg-[#FAFAF8] border border-black/8 text-[11px] font-mono text-[#222] font-medium flex items-start gap-2 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom: Timeline + CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-black/10">
                  <div className="flex items-center gap-4 font-mono text-[11px] text-[#444]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#888]" />
                      <span className="font-bold uppercase">{activePlan.timeline}</span>
                    </div>
                    <span className="text-black/20">|</span>
                    <span className="font-bold uppercase text-emerald-700">AUDIT-RECONCILED</span>
                    <span className="text-black/20 hidden sm:inline">|</span>
                    <span className="font-bold uppercase hidden sm:inline">DIRECT SLACK & ASANA</span>
                  </div>

                  <button
                    onClick={onContact}
                    className="py-2.5 px-5 bg-[#E0533C] hover:bg-[#c94530] text-white font-mono text-[11px] uppercase tracking-widest font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer hover:shadow-md active:scale-[0.98]"
                  >
                    <span>BOOK INITIATION CALL</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* BOTTOM: Progress Bar + Tier Indicators */}
        <div className="flex items-center justify-between border-t border-black/15 pt-2.5 flex-shrink-0">
          {/* Left: Progress */}
          <div className="flex items-center gap-3">
            {/* Tier dots */}
            <div className="flex items-center gap-1.5">
              {PRICING_CONFIG.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => { soundFx.playClick(); setActivePlanIdx(idx); }}
                  className={`transition-all duration-300 cursor-pointer ${
                    idx === activePlanIdx
                      ? 'w-6 h-1.5 bg-[#E0533C]'
                      : idx < activePlanIdx
                        ? 'w-3 h-1.5 bg-[#111]'
                        : 'w-3 h-1.5 bg-black/15'
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-[9px] text-[#999] font-bold uppercase">
              TIER {activePlanIdx + 1} OF {totalPlans}
            </span>
          </div>

          {/* Right: Info */}
          <div className="flex items-center gap-3 font-mono text-[9px] text-[#666] uppercase">
            <span className="font-bold text-emerald-700 hidden sm:inline">IMA / CMA-USA CERTIFIED</span>
            <span className="hidden sm:inline">•</span>
            <span>SCROLL TO EXPLORE TIERS</span>
          </div>
        </div>
      </div>
    </section>
  );
};
