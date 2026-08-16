import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, Database, BarChart3, ShieldCheck, CheckCircle2, Server, ArrowRight, Layers, Activity, Flame } from 'lucide-react';
import { ThreeCanvas } from './ThreeCanvas';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
import { ProgressiveTextFill } from './ProgressiveTextFill';
import { StripedTypography } from './StripedTypography';
import { TactileMediaFrame } from './TactileMediaFrame';
import { LazyRenderMedia } from './LazyRenderMedia';
import { SectionBackgroundLayer } from './SectionBackgroundLayer';
import { gsap, ScrollTrigger, Flip, setupSectionViewportClamping } from '../lib/gsap';
import { soundFx } from '../lib/sound';

export const AnalyticsShowcase: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const stages = [
    {
      id: '01',
      title: 'DATA CLEANING & POWER QUERY M',
      detail: 'Ingesting messy ERP transaction logs, multi-currency GLs & trial balances',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
      badge: 'ETL & M-CODE',
      snippet: `let
  Source = Sql.Database("corp-sql.internal", "ERP_Finance"),
  Filtered = Table.SelectRows(Source, each [Posting_Date] >= #date(2023, 1, 1)),
  CleanCurrency = Table.TransformColumnTypes(Filtered, {{"Amount_USD", Currency.Type}, {"EBITDA_Impact", Percentage.Type}})
in CleanCurrency`,
      kpis: [
        { label: 'ROWS PROCESSED', value: '1,240,000+', delta: '+100% Automated' },
        { label: 'DATA REFRESH', value: '15 MINS', delta: 'Incremental Load' },
        { label: 'ERROR RATE', value: '0.00%', delta: 'Validated M-Code' },
      ],
      insight: 'Power Query M-Code script unifies multi-subsidiary ERP ledgers into a normalized, audit-ready data model in under 15 minutes.'
    },
    {
      id: '02',
      title: 'DAX TIME INTELLIGENCE & STAR SCHEMA',
      detail: 'Complex measures for YTD, YoY Growth, EBITDA Margins & Rolling CAC/LTV',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
      badge: 'STAR SCHEMA BI',
      snippet: `EBITDA_YoY_% = 
VAR CurrentYTD = CALCULATE([Total_EBITDA], DATESYTD('Calendar'[Date]))
VAR PriorYTD   = CALCULATE([Total_EBITDA], SAMEPERIODLASTYEAR('Calendar'[Date]))
RETURN DIVIDE(CurrentYTD - PriorYTD, PriorYTD, 0)`,
      kpis: [
        { label: 'QUERY SPEED', value: '240ms', delta: '99.8% Sub-second' },
        { label: 'MODEL STRUCTURE', value: 'Star Schema', delta: '1:N Relationships' },
        { label: 'CALC MEASURES', value: '85+ DAX', delta: 'CMA Standard' },
      ],
      insight: 'Star schema architecture optimized with DAX Time Intelligence delivers sub-second executive drill-down across 12 fiscal periods.'
    },
    {
      id: '03',
      title: 'EXECUTIVE TELEMETRY & RLS GOVERNANCE',
      detail: 'Dynamic Row-Level Security, multi-tenant governance & executive P&L drill-through',
      image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=600&auto=format&fit=crop',
      badge: 'RLS SECURITY',
      snippet: `[User_Group_ID] = USERPRINCIPALNAME() 
&& [Department_Access] IN 
   SELECTCOLUMNS(LOOKUPVALUE(UserRoles, UserRoles[Email], USERPRINCIPALNAME()), "AccessRole")`,
      kpis: [
        { label: 'ROLE TIERS', value: '4 Tiers', delta: 'Exec / Director / Ops / Reg' },
        { label: 'COMPLIANCE', value: '100% Audit', delta: 'IMA Code of Ethics' },
        { label: 'DRILL-THROUGH', value: 'Sub-GL L3', delta: 'Transaction Line Item' },
      ],
      insight: 'Dynamic DAX RLS ensures granular tenant security with automatic department routing and sub-GL line item drill-through.'
    },
  ];

  const totalStages = stages.length;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let lastStage = -1;
    const isTouch = typeof window !== 'undefined' && window.innerWidth <= 768;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: isTouch ? 'top 80%' : 'top top',
        end: isTouch ? 'bottom 20%' : '+=200%',
        pin: !isTouch,
        pinSpacing: !isTouch,
        pinType: isTouch ? 'transform' : 'fixed',
        scrub: isTouch ? 0.25 : 0.35,
        anticipatePin: isTouch ? 0 : 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setScrollProgress(Math.round(self.progress * 100));
          const current = Math.min(totalStages - 1, Math.floor(self.progress * totalStages));
          if (current !== lastStage) {
            lastStage = current;
            soundFx.triggerSectionMilestone('dashboards', current, 450 + current * 80);
          }
          setActiveStage(current);
        },
      });
    }, section);

    return () => ctx.revert();
  }, [totalStages]);

  const currentStageData = stages[activeStage];

  const handleSelectStage = (idx: number) => {
    soundFx.playClick();
    if (tabsContainerRef.current) {
      const state = Flip.getState(tabsContainerRef.current.children, { props: 'transform,opacity,width,height' });
      setActiveStage(idx);
      requestAnimationFrame(() => {
        if (tabsContainerRef.current) {
          Flip.from(state, {
            duration: 0.45,
            ease: 'power3.out',
            stagger: 0.02,
            absolute: true,
            onComplete: () => {
              // Ensure container layout shifts are calculated after all images and charts reach target scale
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
      setActiveStage(idx);
    }
  };

  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0 && activeStage < totalStages - 1) {
        handleSelectStage(activeStage + 1);
      } else if (deltaX > 0 && activeStage > 0) {
        handleSelectStage(activeStage - 1);
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <section
      ref={sectionRef}
      id="dashboards"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full min-h-screen bg-[#F3F2EE] text-[#111116] border-b border-black/10 select-none overflow-hidden flex flex-col justify-between py-6 md:py-8 px-4 sm:px-6 md:px-12 touch-pan-y"
    >
      {/* CONTEXTUAL PROFESSIONAL BACKGROUND PHOTO */}
      <SectionBackgroundLayer sectionKey="dashboards" opacity={0.2} />

      {/* ELEGANT FIXED VERTICAL PROGRESS BAR ON RIGHT EDGE */}
      <VerticalSectionProgressBar targetId="dashboards" accentColor="#2563EB" label="TELEMETRY" sectionCode="06" isLightBg={true} />

      {/* BACKGROUND 3D TELEMETRY TORUS SHADER */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <ThreeCanvas variant="telemetry" />
      </div>

      <div className="max-w-7xl mx-auto w-full my-auto relative z-10 flex flex-col lg:flex-row items-stretch gap-4 lg:gap-6 pt-4">

        {/* LEFT VERTICAL SECTION SPINE (Standing Striped Typography Masthead) */}
        <div className="hidden md:flex flex-col items-center justify-between py-6 px-3 bg-white border-2 border-dashed border-black/25 flex-shrink-0 z-20 shadow-md w-24 md:w-28 min-h-[500px] max-h-[660px] relative">
          <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-blue-600" />
          <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-blue-600" />

          {/* Vertical Striped Typography */}
          <div className="flex-1 w-full flex items-center justify-center overflow-hidden py-2">
            <StripedTypography
              text="telemetry"
              progress={scrollProgress}
              color="#2563EB"
              isVertical={true}
              isLightBg={true}
              className="w-full h-full min-h-[420px]"
            />
          </div>

          {/* Vertical Progress Meter */}
          <div className="flex flex-col items-center gap-1.5 pt-3 border-t border-black/10 font-mono text-[9px] w-full">
            <div className="w-1.5 h-12 bg-black/10 overflow-hidden relative">
              <div
                className="w-full transition-all duration-150 absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.max(4, scrollProgress)}%`,
                  backgroundColor: '#2563EB',
                  boxShadow: '0 0 6px rgba(37,99,235,0.6)',
                }}
              />
            </div>
            <span className="font-bold text-[9px] text-blue-700">
              {scrollProgress}%
            </span>
          </div>
        </div>

        {/* MAIN DASHBOARD STAGE */}
        <div className="flex-1 flex flex-col justify-between space-y-4">

          {/* Top Bar with Stage Details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/15 pb-3">
            <div>
              <div className="text-[10px] font-mono text-blue-700 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span>MICROSOFT POWER BI & DATA MODELING SYSTEM</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#111116] mt-0.5">
                DAX & POWER QUERY ARCHITECTURE
              </h2>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowHeatmap(!showHeatmap);
                }}
                className={`px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 rounded-none shadow-xs ${showHeatmap
                  ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                  : 'bg-white text-blue-800 border-black/15 hover:bg-blue-50'
                  }`}
                title="Toggle Data Density Heatmap Overlay to view high-engagement metric zones"
                data-cursor="HEATMAP"
              >
                <Flame className={`w-3.5 h-3.5 ${showHeatmap ? 'text-white' : 'text-rose-600'}`} />
                <span>{showHeatmap ? 'HEATMAP ON' : 'DATA DENSITY HEATMAP'}</span>
              </button>

              <div className="font-mono text-xs text-blue-800 font-bold px-2.5 py-1 bg-blue-50 border border-blue-500/30">
                STAGE 0{activeStage + 1} / 0{totalStages} ACTIVE
              </div>
            </div>
          </div>

          {/* 3 INTERACTIVE TELEMETRY STAGE CARDS */}
          <div ref={tabsContainerRef} className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-shrink-0">
            {stages.map((st, idx) => {
              const isActive = activeStage === idx;
              return (
                <div
                  key={st.id}
                  onClick={() => handleSelectStage(idx)}
                  className={`p-3 sm:p-3.5 border-2 border-dashed transition-all duration-300 cursor-pointer flex items-center gap-3 relative shadow-sm ${isActive
                    ? 'bg-white border-blue-600 text-[#111116] shadow-md scale-[1.01]'
                    : 'bg-white/80 border-black/25 text-[#444444] hover:bg-white hover:text-black hover:border-black/40'
                    }`}
                >
                  <span className="absolute -top-1.5 -left-1.5 w-2 h-2 border-t-2 border-l-2 border-black" />
                  <span className="absolute -bottom-1.5 -right-1.5 w-2 h-2 border-b-2 border-r-2 border-black" />

                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 overflow-hidden border border-black/15 bg-white">
                    <LazyRenderMedia
                      src={st.image}
                      alt={st.title}
                      aspectRatio="aspect-square"
                      accentColor="#2563EB"
                      mediaClassName="hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-15" />
                    <span className="absolute bottom-1 left-1 text-[7px] font-mono font-bold bg-blue-600 text-white px-1 py-0.2 uppercase z-20 pointer-events-none">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="flex flex-col justify-between h-full space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between font-mono text-[9px] text-blue-700 font-bold">
                      <span className="truncate">{st.badge}</span>
                      {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                    </div>
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#111116] line-clamp-1">{st.title}</h4>
                    <p className="text-[10px] font-sans text-[#555555] line-clamp-1 leading-tight">{st.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MAIN DASHBOARD PREVIEW & CODE DECK (Animated Vertically) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStageData.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center bg-white border-2 border-dashed border-black/25 p-4 sm:p-6 shadow-md relative"
            >
              <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-black" />
              <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-black" />
              
              {/* LEFT: STAGE SPECIFIC TACTILE MEDIA & KPI METRICS */}
              <div className="lg:col-span-7 space-y-3">
                <div className="relative overflow-hidden border border-black/15 shadow-xs">
                  <TactileMediaFrame
                    src={currentStageData.image}
                    alt={currentStageData.title}
                    aspectRatio="aspect-[16/9]"
                    zoomScale={1.1}
                    enableParallax={true}
                    pillTag={currentStageData.badge}
                    accentColor="#2563EB"
                  />

                  {/* DATA DENSITY HEATMAP OVERLAY LAYER */}
                  <AnimatePresence>
                    {showHeatmap && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 pointer-events-none overflow-hidden"
                      >
                        {/* Radial Density Hotspot 1 (EBITDA KPI - Top Left) */}
                        <div className="absolute top-1/4 left-1/4 w-36 h-36 rounded-full bg-rose-500/40 blur-xl animate-pulse" />
                        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 bg-black/85 border border-rose-400 px-2 py-0.5 font-mono text-[9px] text-rose-300 font-bold shadow-lg">
                          98% INTENSITY // KPI DAX
                        </div>

                        {/* Radial Density Hotspot 2 (DAX Filter Matrix - Center Right) */}
                        <div className="absolute top-1/2 right-1/4 w-44 h-44 rounded-full bg-amber-500/35 blur-2xl" />
                        <div className="absolute top-1/2 right-1/4 transform -translate-x-1/2 -translate-y-1/2 bg-black/85 border border-amber-400 px-2 py-0.5 font-mono text-[9px] text-amber-300 font-bold shadow-lg">
                          92% DENSITY // STAR SCHEMA
                        </div>

                        {/* Radial Density Hotspot 3 (Sub-GL Drilldown - Bottom Center) */}
                        <div className="absolute bottom-1/4 left-1/2 w-32 h-32 rounded-full bg-emerald-500/35 blur-xl" />
                        <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/85 border border-emerald-400 px-2 py-0.5 font-mono text-[9px] text-emerald-300 font-bold shadow-lg">
                          86% DRILLDOWN // RLS
                        </div>

                        {/* Heatmap Grid Mesh Lines Overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-500/20 via-blue-600/10 to-transparent mix-blend-color-dodge" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="p-2.5 bg-white border-t border-black/10 flex items-center justify-between">
                    <h3 className="font-serif text-lg sm:text-xl text-[#111116] font-bold">{currentStageData.title}</h3>
                    {showHeatmap && (
                      <span className="text-[10px] font-mono text-rose-600 font-bold flex items-center gap-1 uppercase">
                        <Flame className="w-3 h-3" />
                        ENGAGEMENT DENSITY ACTIVE
                      </span>
                    )}
                  </div>
                </div>

                {/* KPI METRICS */}
                <div className="grid grid-cols-3 gap-2">
                  {currentStageData.kpis.map((kpi, kIdx) => (
                    <div key={kIdx} className="bg-[#F9F9F7] border border-black/10 p-2.5 font-mono">
                      <div className="text-[9px] text-[#666666] font-bold uppercase">{kpi.label}</div>
                      <div className="text-sm sm:text-base font-bold text-[#111116] mt-0.5">{kpi.value}</div>
                      <div className="text-[9px] text-emerald-700 font-bold">{kpi.delta}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: CODE SNIPPET & INSIGHT */}
              <div className="lg:col-span-5 space-y-3">
                <div className="bg-[#0F172A] text-white border border-blue-500/30 p-3 sm:p-4 space-y-2 font-mono shadow-md">
                  <div className="flex items-center justify-between text-[11px] text-blue-400 font-bold border-b border-white/10 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>ADVANCED TELEMETRY CODE</span>
                    </div>
                    <span className="text-[9px] text-white/50">{currentStageData.badge}</span>
                  </div>

                  <pre className="text-[11px] text-emerald-400 bg-black/80 p-2.5 overflow-x-auto leading-relaxed border border-white/10 font-mono">
                    <code>{currentStageData.snippet}</code>
                  </pre>

                  <div className="text-[10.5px] text-slate-300 font-sans border-t border-white/10 pt-2 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>{currentStageData.insight}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
};

