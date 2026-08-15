import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ChevronRight, User, Shield, Target, Compass, Sparkles } from 'lucide-react';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
import { StripedTypography } from './StripedTypography';
import { TactileMediaFrame } from './TactileMediaFrame';
import { gsap, ScrollTrigger, Flip, isTouchMobileDevice } from '../lib/gsap';
import { soundFx } from '../lib/sound';
import parvejProfileImg from './parvej_profile.png';

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  // Real-time timeline progress synced to the reading rail and telemetry
  const [scrollProgress, setScrollProgress] = useState(0);
  const [expandedCardIdx, setExpandedCardIdx] = useState<number | null>(null);

  const valueCards = [
    {
      title: 'PRECISION',
      subtitle: 'Zero-Tolerance Reconciliation',
      text: 'We sweat the numbers — a lot. Every calculation from WACC sensitivity to 3-statement linkage is deliberate. If something is on the financial model, it is verified. If it lacks integrity, it is eliminated.',
    },
    {
      title: 'RIGOR',
      subtitle: 'Data-Backed Honesty',
      text: 'We are not yes-analysts. If a business model or valuation assumption fails stress-testing, we say so — clearly and quantitatively. We would rather have a hard conversation early than present flawed executive forecasts.',
    },
    {
      title: 'STRATEGY',
      subtitle: 'C-Suite Partnership',
      text: 'We do not just crunch data for you. We partner with leadership. The best capital allocation decisions come from collaborative modeling — translating raw ledgers into actionable executive telemetry.',
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const pinContainer = pinContainerRef.current;
    if (!section || !pinContainer) return;

    const isTouch = isTouchMobileDevice();

    const ctx = gsap.context(() => {
      const steps = section.querySelectorAll<HTMLElement>('.about-seq-step');
      if (!steps || steps.length === 0) return;

      if (!isTouch) {
        // Set initial zeroed state on desktop
        steps.forEach((step, index) => {
          if (index === 0) {
            gsap.set(step, {
              opacity: 1,
              y: 0,
              scale: 1,
              transformOrigin: '50% 100%',
              willChange: 'transform, opacity',
            });
          } else {
            gsap.set(step, {
              opacity: 0,
              y: 35,
              scale: 0.98,
              transformOrigin: '50% 100%',
              willChange: 'transform, opacity',
            });
          }
        });

        // Master Timeline scrubbed across the pin span
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: 'power2.out' },
        });

        steps.forEach((step, index) => {
          if (index > 0) {
            tl.to(
              step,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: 'power2.out',
              },
              (index - 1) * 0.3
            );
          }
        });

        ScrollTrigger.create({
          trigger: section,
          pin: pinContainer,
          start: 'top top',
          end: '+=1400',
          scrub: 0.4,
          anticipatePin: 1,
          pinSpacing: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            tl.progress(self.progress);
            setScrollProgress(self.progress);
          },
        });
      } else {
        // On mobile, all steps are visible with fluid entrance animations
        steps.forEach((step) => {
          gsap.set(step, {
            opacity: 1,
            y: 0,
            scale: 1,
          });
        });

        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 0.2,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // GSAP Flip on card expansion / focus with absolute positioning strategy
  const handleToggleCard = (idx: number) => {
    soundFx.playHover();
    if (!cardsGridRef.current) {
      setExpandedCardIdx(expandedCardIdx === idx ? null : idx);
      return;
    }

    const state = Flip.getState(cardsGridRef.current.children, { props: 'transform,opacity,width,height' });
    setExpandedCardIdx(expandedCardIdx === idx ? null : idx);

    requestAnimationFrame(() => {
      if (cardsGridRef.current) {
        Flip.from(state, {
          duration: 0.45,
          ease: 'power3.out',
          stagger: 0.02,
          absolute: true,
          onComplete: () => {
            ScrollTrigger.refresh();
          },
          onInterrupt: () => {
            ScrollTrigger.refresh();
          },
        });
      }
    });
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full bg-[#F3F2EE] text-[#111111] border-b border-black/10 select-none overflow-hidden py-8 sm:py-12 md:py-16"
    >
      {/* PINNED CONTAINER WRAPPER */}
      <div
        ref={pinContainerRef}
        className="w-full min-h-screen relative flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-6 md:px-12"
      >
        {/* ELEGANT FIXED VERTICAL READING RAIL ON RIGHT EDGE */}
        <VerticalSectionProgressBar
          targetId="about"
          externalProgress={scrollProgress}
          accentColor="#E0533C"
          label="ABOUT"
          sectionCode="07"
          isLightBg={true}
        />

        {/* ── TOP HEADER BAR: SCENE INFO & EDITORIAL DASHED QUOTE ──────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center border-b border-black/15 pb-3 w-full flex-shrink-0 mb-4">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="text-[10px] font-mono tracking-widest uppercase text-[#E0533C] flex items-center gap-2 mb-1 font-bold">
              <span>[SCENE 07 // PROFILE & OPERATING PHILOSOPHY]</span>
              <span className="w-12 h-[1px] bg-[#E0533C]/40" />
            </div>
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight uppercase text-[#111116]">
                ABOUT // EXECUTIVE RIGOR
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#E0533C] text-white uppercase tracking-wider">
                CMA USA (380/500)
              </span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="border border-dashed border-black/25 p-2.5 bg-white rounded-none text-left shadow-xs">
              <p className="text-[11px] font-mono text-[#222222] font-bold leading-relaxed uppercase">
                OPERATING PRINCIPLES, QUANTITATIVE RIGOR & C-SUITE CORPORATE FINANCE STRATEGY.
              </p>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT CONTAINER WITH VERTICAL SECTION SPINE (KHADA ABOUT) ── */}
        <div className="relative flex-1 w-full my-auto flex items-stretch justify-between gap-4 sm:gap-6 py-2">

          {/* ── LEFT VERTICAL SECTION SPINE (Standing Striped Typography Masthead) ── */}
          <div className="hidden md:flex flex-col items-center justify-between py-6 px-3 bg-white border-2 border-dashed border-black/25 min-h-[500px] max-h-[660px] flex-shrink-0 z-20 shadow-md w-24 md:w-28 relative">
            <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#E0533C]" />
            <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#E0533C]" />

            {/* Standing Vertical Striped Typography with dynamic top-to-bottom scroll fill */}
            <div className="flex-1 w-full flex items-center justify-center overflow-hidden py-2">
              <StripedTypography
                text="about"
                progress={Math.round(scrollProgress * 100)}
                color="#E0533C"
                isVertical={true}
                isLightBg={true}
                className="w-full h-full min-h-[420px]"
              />
            </div>

            {/* Vertical live percentage progress bar */}
            <div className="flex flex-col items-center gap-1.5 pt-3 border-t border-black/10 font-mono text-[9px] w-full">
              <div className="w-1.5 h-12 bg-black/10 overflow-hidden relative">
                <div
                  className="w-full transition-all duration-150 absolute bottom-0 left-0 right-0"
                  style={{
                    height: `${Math.max(6, Math.round(scrollProgress * 100))}%`,
                    backgroundColor: '#E0533C',
                    boxShadow: '0 0 6px rgba(224,83,60,0.6)',
                  }}
                />
              </div>
              <span className="font-bold text-[9px] text-[#E0533C]">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>
          </div>

          {/* ── RIGHT MAIN MAGAZINE STAGE ───────────────────────────── */}
          <div className="flex-1 space-y-5 flex flex-col justify-between">

            {/* ASYMMETRIC CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">

              {/* LEFT BIO COLUMN */}
              <div className="lg:col-span-5 space-y-3.5 sm:space-y-4">
                {/* STEP 2: STATEMENT OF INTENT */}
                <div className="about-seq-step p-4 sm:p-5 bg-white border-2 border-dashed border-black/25 rounded-none shadow-sm space-y-2 font-mono text-xs leading-relaxed text-[#333333] relative">
                  <span className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-black" />
                  <span className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-black" />
                  <div className="text-[10px] text-[#E0533C] font-bold tracking-widest uppercase flex items-center justify-between">
                    <span>STATEMENT OF INTENT</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-xs sm:text-[12.5px] font-sans font-normal leading-relaxed text-[#222222]">
                    PARVEJ ALAM IS A FINANCIAL MODELING AND DATA ANALYTICS SPECIALIST BASED IN JAIPUR, INDIA, WORKING WITH GLOBAL CORPORATE FINANCE & CAPITAL MARKETS CLIENTS.
                  </p>
                  <div className="pt-2 border-t border-black/10 flex items-center justify-between text-[10.5px] text-[#666666]">
                    <span>DEGREE: B.COM (HONS)</span>
                    <span className="text-emerald-700 font-bold">MERIT 1ST ATTEMPT</span>
                  </div>
                </div>

                {/* STEP 3: TACTILE MEDIA FRAME WITH PHOTOGRAPH */}
                <div className="about-seq-step relative rounded-none overflow-hidden border border-black/15 shadow-sm bg-white p-2">
                  <TactileMediaFrame
                    src={parvejProfileImg || '/parvej_profile.png'}
                    alt="Parvej Alam Headshot"
                    aspectRatio="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]"
                    zoomScale={1.1}
                    enableParallax={true}
                    pillTag="CMA CANDIDATE (380/500)"
                    accentColor="#E0533C"
                  />
                </div>
              </div>

              {/* RIGHT ASYMMETRIC COLUMN */}
              <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">

                {/* STEP 4: LARGE EDITORIAL HEADLINE */}
                <div className="about-seq-step">
                  <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-[28px] font-bold leading-tight tracking-tight text-[#111116] uppercase">
                    The numbers <span className="italic text-[#E0533C]">aren't</span> a coincidence. They're the whole strategy.
                  </h2>
                </div>

                {/* STEPS 5 & 6: FEATURE CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="about-seq-step p-3.5 sm:p-4 bg-white border border-black/15 rounded-none space-y-1 shadow-xs">
                    <div className="text-[10px] font-mono font-bold text-[#E0533C]">01 / FINANCIAL INTEGRITY</div>
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#111116]">Focused & Executive-Driven</h3>
                    <p className="text-[11px] font-sans text-[#555555] leading-relaxed">
                      We build financial models because we care about structural precision. Every forecast is grounded in verified accounting principles.
                    </p>
                  </div>

                  <div className="about-seq-step p-3.5 sm:p-4 bg-white border border-black/15 rounded-none space-y-1 shadow-xs">
                    <div className="text-[10px] font-mono font-bold text-emerald-700">02 / DATA ARCHITECTURE</div>
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#111116]">Power BI & SQL Pipelines</h3>
                    <p className="text-[11px] font-sans text-[#555555] leading-relaxed">
                      Connecting transactional databases to interactive C-suite dashboards for automated variance tracking and capital allocation.
                    </p>
                  </div>
                </div>

                {/* STEP 7: CORAL RED ACCENTED MANIFESTO */}
                <div className="about-seq-step p-3.5 sm:p-4 border-l-4 border-[#E0533C] bg-white border border-black/15 rounded-none space-y-1 shadow-xs">
                  <p className="text-xs sm:text-[12.5px] font-sans font-normal leading-relaxed text-[#222222]">
                    Not because we are just getting started, but because precision is the only way we work. We keep financial models robust so nothing gets lost in translation between data and C-suite strategy.
                  </p>
                </div>

              </div>

            </div>

            {/* EXECUTIVE CREDENTIALS & RIGOR NOTICE */}
            <div className="pt-2 space-y-3">
              <div className="about-seq-step p-4 sm:p-5 bg-white border-2 border-dashed border-black/25 rounded-none shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative">
                <span className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-[#E0533C]" />
                <span className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-[#E0533C]" />
                
                <div className="space-y-1">
                  <div className="text-[10px] font-mono font-bold text-[#E0533C] uppercase tracking-wider">
                    EXECUTIVE PROFILE & ADVISORY STANDARD
                  </div>
                  <p className="font-mono text-xs text-[#222222] font-extrabold uppercase leading-snug">
                    GROUNDED IN CMA USA STANDARDS, 3-STATEMENT INTEGRITY & C-SUITE STRATEGY.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#F4F1EA] px-3 py-1.5 border border-black/15 font-mono text-[10.5px] font-bold text-emerald-800 flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% RECONCILED STANDARD</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

