import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const KineticTypographySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);
  const leftBarsRef = useRef<HTMLDivElement>(null);
  const rightBarsRef = useRef<HTMLDivElement>(null);
  const supportingRef = useRef<HTMLDivElement>(null);

  // Individual Word Refs for Multi-Trajectory Scroll Tracking
  const wordPeopleRef = useRef<HTMLSpanElement>(null);
  const wordDeserveRef = useRef<HTMLSpanElement>(null);
  const wordBetter1Ref = useRef<HTMLSpanElement>(null);

  const wordBetter2Ref = useRef<HTMLSpanElement>(null);
  const wordProcessRef = useRef<HTMLSpanElement>(null);

  const wordBetter3Ref = useRef<HTMLSpanElement>(null);
  const wordCollabRef = useRef<HTMLSpanElement>(null);

  const wordBetter4Ref = useRef<HTMLSpanElement>(null);
  const wordResultsRef = useRef<HTMLSpanElement>(null);

  const wordWithoutRef = useRef<HTMLSpanElement>(null);
  const wordNeedingRef = useRef<HTMLSpanElement>(null);

  const wordTeamRef = useRef<HTMLSpanElement>(null);
  const wordThereRef = useRef<HTMLSpanElement>(null);

  const quoteOpenRef = useRef<HTMLSpanElement>(null);
  const quoteCloseRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const pinStage = pinStageRef.current;
    if (!container || !pinStage) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // In reduced-motion mode, show everything in its resting position without animation
      if (supportingRef.current) gsap.set(supportingRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      // Amplitude multipliers based on viewport width to prevent horizontal overflow on mobile
      const amp = isMobile ? 0.22 : isTablet ? 0.55 : 1.0;

      // Main Pin Timeline scrubbing across scroll duration
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=180%',
          pin: pinStage,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // ── LINE 1: “People  deserve  better. ─────────────────────────
      tl.fromTo(
        wordPeopleRef.current,
        { x: -140 * amp, y: -20 * amp, opacity: 0.4, scale: 0.94 },
        { x: 0, y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0
      )
        .fromTo(
          wordDeserveRef.current,
          { x: 20 * amp, y: -45 * amp, opacity: 0.35, scale: 1.06 },
          { x: 0, y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
          0.02
        )
        .fromTo(
          wordBetter1Ref.current,
          { x: 150 * amp, y: -15 * amp, opacity: 0.4, scale: 0.95 },
          { x: 0, y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
          0.04
        )
        .fromTo(
          quoteOpenRef.current,
          { scale: 0.5, opacity: 0.2, rotate: -25 },
          { scale: 1, opacity: 1, rotate: 0, ease: 'back.out(1.5)' },
          0
        );

      // ── LINE 2: Better  process. ─────────────────────────────────
      tl.fromTo(
        wordBetter2Ref.current,
        { x: -100 * amp, y: 15 * amp, opacity: 0.38, scale: 0.95 },
        { x: 0, y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0.05
      ).fromTo(
        wordProcessRef.current,
        { x: 120 * amp, y: -25 * amp, opacity: 0.35, scale: 1.04 },
        { x: 0, y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0.07
      );

      // ── LINE 3: Better  collaboration. ───────────────────────────
      tl.fromTo(
        wordBetter3Ref.current,
        { x: -120 * amp, y: -10 * amp, opacity: 0.35, scale: 0.96 },
        { x: 0, y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0.1
      ).fromTo(
        wordCollabRef.current,
        { x: 180 * amp, y: 20 * amp, opacity: 0.3, scale: 1.05 },
        { x: 0, y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0.12
      );

      // ── LINE 4: Better  results. ─────────────────────────────────
      tl.fromTo(
        wordBetter4Ref.current,
        { x: -80 * amp, y: 25 * amp, opacity: 0.4, scale: 0.97 },
        { x: 0, y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0.15
      ).fromTo(
        wordResultsRef.current,
        { x: 140 * amp, y: -15 * amp, opacity: 0.35, scale: 1.03 },
        { x: 0, y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0.17
      );

      // ── LINE 5: Without  needing a bigger ────────────────────────
      tl.fromTo(
        wordWithoutRef.current,
        { x: -150 * amp, y: 30 * amp, opacity: 0.32, scale: 0.93 },
        { x: 0, y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0.2
      ).fromTo(
        wordNeedingRef.current,
        { x: 110 * amp, y: -20 * amp, opacity: 0.35, scale: 1.02 },
        { x: 0, y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0.23
      );

      // ── LINE 6: team to get  there.” ─────────────────────────────
      tl.fromTo(
        wordTeamRef.current,
        { x: -110 * amp, y: -25 * amp, opacity: 0.35, scale: 0.95 },
        { x: 0, y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
        0.26
      )
        .fromTo(
          wordThereRef.current,
          { x: 160 * amp, y: 25 * amp, opacity: 0.32, scale: 1.04 },
          { x: 0, y: 0, opacity: 1, scale: 1, ease: 'power2.out' },
          0.28
        )
        .fromTo(
          quoteCloseRef.current,
          { scale: 0.5, opacity: 0.2, rotate: 25 },
          { scale: 1, opacity: 1, rotate: 0, ease: 'back.out(1.5)' },
          0.3
        );

      // ── LEFT & RIGHT DECORATIVE ARCHITECTURAL STAGGERED BARS ──────
      if (leftBarsRef.current) {
        const leftBars = leftBarsRef.current.querySelectorAll('.bar-step');
        tl.fromTo(
          leftBars,
          {
            x: (i) => -((i % 4) * 25 + 40) * amp,
            opacity: 0.15,
            scaleX: 0.7,
            transformOrigin: 'left center',
          },
          {
            x: 0,
            opacity: (i) => 0.25 + (i % 3) * 0.15,
            scaleX: 1,
            stagger: 0.02,
            ease: 'power2.out',
          },
          0.05
        );
      }

      if (rightBarsRef.current) {
        const rightBars = rightBarsRef.current.querySelectorAll('.bar-step');
        tl.fromTo(
          rightBars,
          {
            x: (i) => ((i % 4) * 25 + 40) * amp,
            opacity: 0.15,
            scaleX: 0.7,
            transformOrigin: 'right center',
          },
          {
            x: 0,
            opacity: (i) => 0.25 + (i % 3) * 0.15,
            scaleX: 1,
            stagger: 0.02,
            ease: 'power2.out',
          },
          0.08
        );
      }

      // ── FINAL SUPPORTING STATEMENT REVEAL ─────────────────────────
      if (supportingRef.current) {
        tl.fromTo(
          supportingRef.current,
          { opacity: 0, y: 35, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out' },
          0.65
        );
      }
    }, container);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  // Left Architectural Bars Config (Staggered widths like in the reference)
  const leftBarWidths = [
    'w-16 sm:w-24',
    'w-24 sm:w-36',
    'w-20 sm:w-32',
    'w-28 sm:w-44',
    'w-36 sm:w-56',
    'w-32 sm:w-48',
    'w-40 sm:w-60',
    'w-28 sm:w-44',
    'w-36 sm:w-52',
    'w-24 sm:w-36',
    'w-32 sm:w-48',
    'w-20 sm:w-32',
    'w-16 sm:w-24',
  ];

  // Right Architectural Bars Config (Staggered widths)
  const rightBarWidths = [
    'w-20 sm:w-32',
    'w-32 sm:w-48',
    'w-24 sm:w-36',
    'w-40 sm:w-60',
    'w-32 sm:w-48',
    'w-36 sm:w-56',
    'w-28 sm:w-44',
    'w-40 sm:w-64',
    'w-32 sm:w-48',
    'w-36 sm:w-52',
    'w-24 sm:w-36',
    'w-28 sm:w-40',
    'w-16 sm:w-24',
  ];

  return (
    <section
      ref={containerRef}
      id="manifesto"
      aria-label="Executive Finance Manifesto and Core Philosophy"
      className="relative w-full bg-[#F3F2EE] text-[#111116] border-b border-black/10 select-none overflow-hidden"
    >
      {/* FIXED VIEWPORT PIN STAGE */}
      <div
        ref={pinStageRef}
        className="w-full h-screen relative flex flex-col justify-between py-6 sm:py-8 md:py-10 px-4 sm:px-8 md:px-14 overflow-hidden"
      >
        {/* ELEGANT FIXED VERTICAL PROGRESS BAR ON RIGHT EDGE */}
        <VerticalSectionProgressBar
          targetId="manifesto"
          accentColor="#E0533C"
          label="MANIFESTO"
          sectionCode="02"
          isLightBg={true}
        />

        {/* BACKGROUND SUBTLE EDITORIAL GRID & DOT MATRIX */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px)
              `,
              backgroundSize: '72px 72px',
              backgroundPosition: 'center center',
            }}
          />
        </div>

        {/* TOP SECTION HEADER TAG */}
        <div className="relative z-20 flex items-center justify-between border-b border-black/15 pb-2.5 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#E0533C] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#E0533C] animate-pulse" />
            <span>[SCENE 02 // EXECUTIVE MANIFESTO & PHILOSOPHY]</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] uppercase text-[#666666] bg-white px-2.5 py-1 border border-black/10">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>FINANCIAL PRECISION OVER VOLUME</span>
          </div>
        </div>

        {/* ── CENTER STAGE: MASSIVE KINETIC TYPOGRAPHY WITH WINGS ─────── */}
        <div className="relative z-10 flex-1 flex items-center justify-center w-full max-w-7xl mx-auto my-auto overflow-hidden">
          
          {/* LEFT ARCHITECTURAL STAGGERED BARS WING */}
          <div
            ref={leftBarsRef}
            className="absolute -left-4 sm:left-0 md:left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 sm:gap-2.5 pointer-events-none z-0 opacity-80"
          >
            {leftBarWidths.map((widthCls, i) => (
              <div
                key={`left-bar-${i}`}
                className={`bar-step h-2 sm:h-3 md:h-3.5 bg-black/15 border border-black/10 ${widthCls} rounded-none shadow-2xs`}
              />
            ))}
          </div>

          {/* RIGHT ARCHITECTURAL STAGGERED BARS WING */}
          <div
            ref={rightBarsRef}
            className="absolute -right-4 sm:right-0 md:right-4 top-1/2 -translate-y-1/2 flex flex-col items-end gap-1.5 sm:gap-2.5 pointer-events-none z-0 opacity-80"
          >
            {rightBarWidths.map((widthCls, i) => (
              <div
                key={`right-bar-${i}`}
                className={`bar-step h-2 sm:h-3 md:h-3.5 bg-black/15 border border-black/10 ${widthCls} rounded-none shadow-2xs`}
              />
            ))}
          </div>

          {/* ── CORE TYPOGRAPHY STACK (6 Multi-Trajectory Kinetic Lines) ── */}
          <div className="relative z-10 w-full max-w-3xl sm:max-w-4xl md:max-w-5xl mx-auto flex flex-col items-center justify-center text-center font-sans tracking-tight font-extrabold text-[#111116] leading-[0.96] sm:leading-[0.94] md:leading-[0.92] uppercase">
            
            {/* LINE 1: “People  deserve  better. */}
            <div className="flex flex-wrap items-baseline justify-center gap-x-2 sm:gap-x-4 md:gap-x-6 text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-[4.15rem] 2xl:text-7xl w-full">
              <span className="inline-flex items-baseline">
                <span
                  ref={quoteOpenRef}
                  className="text-[#E0533C] font-serif font-bold mr-0.5 sm:mr-1 inline-block select-none"
                >
                  “
                </span>
                <span ref={wordPeopleRef} className="inline-block will-change-transform text-[#111116]">
                  People
                </span>
              </span>
              <span ref={wordDeserveRef} className="inline-block will-change-transform text-[#2A2A30]">
                deserve
              </span>
              <span ref={wordBetter1Ref} className="inline-block will-change-transform text-[#111116]">
                better.
              </span>
            </div>

            {/* LINE 2: Better  process. */}
            <div className="flex flex-wrap items-baseline justify-center gap-x-2.5 sm:gap-x-5 md:gap-x-8 text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-[4.15rem] 2xl:text-7xl w-full mt-0.5 sm:mt-1">
              <span ref={wordBetter2Ref} className="inline-block will-change-transform text-[#111116]">
                Better
              </span>
              <span ref={wordProcessRef} className="inline-block will-change-transform text-[#2A2A30] italic font-serif">
                process.
              </span>
            </div>

            {/* LINE 3: Better  collaboration. */}
            <div className="flex flex-wrap items-baseline justify-center gap-x-2.5 sm:gap-x-5 md:gap-x-8 text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-[4.15rem] 2xl:text-7xl w-full mt-0.5 sm:mt-1">
              <span ref={wordBetter3Ref} className="inline-block will-change-transform text-[#111116]">
                Better
              </span>
              <span ref={wordCollabRef} className="inline-block will-change-transform text-[#2A2A30]">
                collaboration.
              </span>
            </div>

            {/* LINE 4: Better  results. */}
            <div className="flex flex-wrap items-baseline justify-center gap-x-2.5 sm:gap-x-5 md:gap-x-8 text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-[4.15rem] 2xl:text-7xl w-full mt-0.5 sm:mt-1">
              <span ref={wordBetter4Ref} className="inline-block will-change-transform text-[#111116]">
                Better
              </span>
              <span ref={wordResultsRef} className="inline-block will-change-transform text-[#E0533C]">
                results.
              </span>
            </div>

            {/* LINE 5: Without  needing a bigger */}
            <div className="flex flex-wrap items-baseline justify-center gap-x-2 sm:gap-x-4 md:gap-x-6 text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-[3.35rem] 2xl:text-6xl w-full mt-0.5 sm:mt-1">
              <span ref={wordWithoutRef} className="inline-block will-change-transform text-[#111116]">
                Without
              </span>
              <span ref={wordNeedingRef} className="inline-block will-change-transform text-[#2A2A30]">
                needing a bigger
              </span>
            </div>

            {/* LINE 6: team to get  there.” */}
            <div className="flex flex-wrap items-baseline justify-center gap-x-2 sm:gap-x-4 md:gap-x-6 text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-[3.35rem] 2xl:text-6xl w-full mt-0.5 sm:mt-1">
              <span ref={wordTeamRef} className="inline-block will-change-transform text-[#111116]">
                team to get
              </span>
              <span className="inline-flex items-baseline">
                <span ref={wordThereRef} className="inline-block will-change-transform text-[#111116]">
                  there.
                </span>
                <span
                  ref={quoteCloseRef}
                  className="text-[#E0533C] font-serif font-bold ml-0.5 sm:ml-1 inline-block select-none"
                >
                  ”
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* ── BOTTOM STAGE: SUPPORTING STATEMENT REVEAL & TELEMETRY FOOTER */}
        <div className="relative z-20 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 pt-2">
          {/* Left Metadata / Scroll Direction Indicator */}
          <div className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] text-[#666666] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
            <span>SCROLL TO CONVERGE MANIFESTO // 60 FPS INERTIA</span>
          </div>

          {/* Right Supporting Statement (Reveals on Complete Convergence) */}
          <div
            ref={supportingRef}
            className="border-2 border-dashed border-[#E0533C]/60 bg-white p-3 sm:p-4 max-w-md shadow-md rounded-none relative"
          >
            <span className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-[#E0533C]" />
            <span className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-[#E0533C]" />
            
            <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-[#E0533C] uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              <span>THE CORE DISCIPLINE</span>
            </div>
            <p className="font-mono text-[11px] sm:text-xs text-[#111116] font-extrabold uppercase leading-snug tracking-wide">
              A team that stays small on purpose. Because quality over quantity wins every time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
