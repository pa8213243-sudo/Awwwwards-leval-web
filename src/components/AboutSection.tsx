import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ChevronRight, User, Shield, Target, Compass, Sparkles } from 'lucide-react';
import { SectionProgressHeader } from './SectionProgressHeader';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
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

  /**
   * Refined ScrollTrigger Pin Logic with Sequential Vertical Reveal:
   * 
   * 1. Section is pinned so that fast or slow scrolling cannot skip the animation.
   * 2. The GSAP Timeline controls the exact unveiling sequence:
   *    - Step 1 (Header) is visible early or from the top.
   *    - Scrolling DOWN: items fade in and slide up from the bottom one-by-one in staggered magazine steps.
   *    - Scrolling UP: elements hide sequentially in reverse order.
   * 3. Consistent across desktop and mobile with adaptive pin distance (1200px - 1600px).
   * 4. Synchronizes with the Vertical Reading Rail using sample-accurate onUpdate progress.
   */
  useEffect(() => {
    const section = sectionRef.current;
    const pinContainer = pinContainerRef.current;
    if (!section || !pinContainer) return;

    const isTouch = isTouchMobileDevice();
    const pinDistance = isTouch ? 1200 : 1600;

    const ctx = gsap.context(() => {
      // Find all sequential reveal step elements
      const steps = section.querySelectorAll<HTMLElement>('.about-seq-step');
      if (!steps || steps.length === 0) return;

      // Set initial zeroed state: hidden, shifted down, scaled subtly (except first header item which starts ready)
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
            y: 45,
            scale: 0.97,
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

      // Step-by-step sequential reveal for remaining items
      steps.forEach((step, index) => {
        if (index > 0) {
          tl.to(
            step,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: 'power2.out',
            },
            (index - 1) * 0.35 // Clean staggered timeline cues
          );
        }
      });

      // Pinning ScrollTrigger ensuring full animation completes before pin releases
      ScrollTrigger.create({
        trigger: section,
        pin: pinContainer,
        start: 'top top',
        end: `+=${pinDistance}`,
        scrub: isTouch ? 0.35 : 0.65,
        anticipatePin: 1,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Drive timeline directly by scroll progress
          tl.progress(self.progress);
          setScrollProgress(self.progress);

          // Trigger audio tick milestones
          const milestone = Math.min(4, Math.floor(self.progress * 4));
          if (self.progress >= 0.02 && self.progress <= 0.98) {
            soundFx.triggerSectionMilestone('about', milestone, 420 + milestone * 55);
          }
        },
        onEnter: () => {
          soundFx.playUiHum(130, 0.4);
          soundFx.playScrollClick();
        },
        onLeave: () => {
          soundFx.playScrollClick();
        },
        onEnterBack: () => {
          soundFx.playScrollClick();
        },
      });
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
      className="relative w-full bg-[#F3F2EE] text-[#111111] border-b border-black/10 select-none"
    >
      {/* PINNED CONTAINER WRAPPER */}
      <div
        ref={pinContainerRef}
        className="w-full min-h-screen relative flex flex-col justify-center py-8 sm:py-12 md:py-16 overflow-hidden"
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full space-y-6 sm:space-y-8">
          
          {/* STEP 1: SECTION PROGRESS HEADER */}
          <div className="about-seq-step">
            <SectionProgressHeader
              sceneCode="[SCENE 07 // PROFILE & PHILOSOPHY]"
              title="ABOUT"
              subtitle="Operating Principles, Quantitative Philosophy & Strategic Rigor"
              badge="CMA USA (380/500)"
              accentColor="#E0533C"
              sectionId="about"
              isSticky={false}
            />
          </div>

          {/* ASYMMETRIC CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            
            {/* LEFT BIO COLUMN */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-5">
              {/* STEP 2: STATEMENT OF INTENT */}
              <div className="about-seq-step p-4 sm:p-5 md:p-6 bg-white border border-black/10 rounded-none shadow-sm space-y-2.5 font-mono text-xs leading-relaxed text-[#333333]">
                <div className="text-[10px] text-[#E0533C] font-bold tracking-widest uppercase flex items-center justify-between">
                  <span>STATEMENT OF INTENT</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-xs sm:text-sm font-sans font-light leading-relaxed text-[#222222]">
                  PARVEJ ALAM IS A FINANCIAL MODELING AND DATA ANALYTICS SPECIALIST BASED IN JAIPUR, INDIA, WORKING WITH GLOBAL CORPORATE FINANCE & CAPITAL MARKETS CLIENTS.
                </p>
                <div className="pt-2.5 border-t border-black/10 flex items-center justify-between text-[11px] text-[#666666]">
                  <span>DEGREE: B.COM (HONS)</span>
                  <span className="text-emerald-700 font-bold">MERIT 1ST ATTEMPT</span>
                </div>
              </div>

              {/* STEP 3: TACTILE MEDIA FRAME WITH PHOTOGRAPH */}
              <div className="about-seq-step relative rounded-none overflow-hidden border border-black/15 shadow-xl bg-white p-2">
                <TactileMediaFrame
                  src={parvejProfileImg || '/parvej_profile.png'}
                  alt="Parvej Alam Headshot"
                  aspectRatio="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]"
                  zoomScale={1.12}
                  enableParallax={true}
                  pillTag="CMA CANDIDATE (380/500)"
                  accentColor="#E0533C"
                />
              </div>
            </div>

            {/* RIGHT ASYMMETRIC COLUMN */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              
              {/* STEP 4: LARGE EDITORIAL HEADLINE */}
              <div className="about-seq-step">
                <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-normal leading-[1.1] tracking-tight text-[#111111] uppercase">
                  The numbers <span className="italic text-[#E0533C]">aren't</span> a coincidence. They're the whole strategy.
                </h2>
              </div>

              {/* STEPS 5 & 6: FEATURE CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="about-seq-step p-4 sm:p-5 bg-white border border-black/10 rounded-none space-y-1.5">
                  <div className="text-xs font-mono font-bold text-[#E0533C]">01 / FINANCIAL INTEGRITY</div>
                  <h3 className="font-serif text-base sm:text-lg text-[#111111]">Focused & Executive-Driven</h3>
                  <p className="text-xs font-light leading-relaxed text-[#555555]">
                    We build financial models because we care about structural precision. Every forecast is grounded in verified accounting principles and real-time operational telemetry.
                  </p>
                </div>

                <div className="about-seq-step p-4 sm:p-5 bg-white border border-black/10 rounded-none space-y-1.5">
                  <div className="text-xs font-mono font-bold text-emerald-700">02 / DATA ARCHITECTURE</div>
                  <h3 className="font-serif text-base sm:text-lg text-[#111111]">Power BI & SQL Pipelines</h3>
                  <p className="text-xs font-light leading-relaxed text-[#555555]">
                    Connecting transactional databases to interactive C-suite dashboards for automated variance tracking, budgeting, and capital allocation decision support.
                  </p>
                </div>
              </div>

              {/* STEP 7: CORAL RED ACCENTED MANIFESTO */}
              <div className="about-seq-step p-4 sm:p-5 border-l-4 border-[#E0533C] bg-white border border-black/10 rounded-none space-y-1.5">
                <p className="text-xs sm:text-sm font-light leading-relaxed text-[#222222]">
                  Not because we are just getting started, but because precision is the only way we work. We have seen what happens when financial models get passed between analysts who were not in the room for strategic discussions. We keep models robust so nothing gets lost in translation.
                </p>
              </div>

            </div>

          </div>

          {/* CORE VALUES SECTION */}
          <div className="pt-2 sm:pt-4 space-y-4">
            {/* STEP 8: VALUES HEADER */}
            <div className="about-seq-step text-xs font-mono uppercase tracking-widest text-[#666666] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>[CORE VALUES & OPERATING FRAMEWORK]</span>
                <span className="w-12 h-[1px] bg-black/20" />
              </div>
              <span className="text-[10px] text-[#E0533C] font-bold">CLICK CARD TO EXPAND FOCUS</span>
            </div>

            {/* STEPS 9, 10, 11: DYNAMIC VALUE PROPOSITION CARDS */}
            <div ref={cardsGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
              {valueCards.map((card, idx) => {
                const isExpanded = expandedCardIdx === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleCard(idx)}
                    className={`about-seq-step bg-[#121217] text-white p-4 sm:p-5 rounded-none border transition-all duration-300 flex flex-col justify-between gap-3.5 shadow-xl cursor-pointer group ${
                      isExpanded
                        ? 'border-[#E0533C] bg-[#1a1a24] ring-2 ring-[#E0533C]/40 md:col-span-3'
                        : 'border-white/10 hover:border-[#E0533C]'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                        <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-[#E0533C] transition-colors">
                          {card.title}
                        </span>
                        <span className="font-mono text-xs text-emerald-400">0{idx + 1}</span>
                      </div>
                      <div className="font-mono text-[11px] uppercase text-emerald-400/90 tracking-wider">
                        {card.subtitle}
                      </div>
                      <p className="text-xs font-light text-white/70 leading-relaxed">
                        {card.text}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/40">
                      <span>{isExpanded ? '[ FOCUSED ]' : 'VERIFIED STANDARD'}</span>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isExpanded ? 'text-[#E0533C]' : 'text-emerald-400'}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* STEP 12: BOTTOM CORAL RED MANIFESTO NOTICE */}
            <div className="about-seq-step p-3 sm:p-3.5 bg-[#E0533C]/10 border border-[#E0533C]/30 text-[#E0533C] font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-center rounded-none font-semibold leading-relaxed">
              THESE AREN'T ON THE WALL FOR DECORATION. THEY SHOW UP IN EVERY FINANCIAL MODEL, EVERY DECISION, AND EVERY STRATEGY WE MAKE.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
