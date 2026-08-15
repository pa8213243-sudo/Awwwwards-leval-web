import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoaderProps {
  onComplete: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [is100Percent, setIs100Percent] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Smooth percentage counter 0 to 100 (approx 2.2 seconds)
    const duration = 2200;
    const intervalTime = 22;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextVal = Math.min(100, Math.floor((currentStep / steps) * 100));
      setProgress(nextVal);

      if (currentStep >= steps) {
        clearInterval(timer);
        setIs100Percent(true);

        // Sequence: Reaches 100% -> Shrinks canvas frame (0.6s) -> Fades out & triggers onComplete
        setTimeout(() => {
          setIsFinished(true);
          setTimeout(() => {
            onComplete();
          }, 500);
        }, 750);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Large ASCII Art for subtle background watermark
  const asciiLogo = `
   ██████╗  █████╗ ██████╗ ██╗   ██╗███████╗██╗    █████╗ ██╗      █████╗ ███╗   ███╗
  ██╔══██╗██╔══██╗██╔══██╗██║   ██║██╔════╝██║   ██╔══██╗██║     ██╔══██╗████╗ ████║
  ██████╔╝███████║██████╔╝██║   ██║█████╗  ██║   ███████║██║     ███████║██╔████╔██║
  ██╔═══╝ ██╔══██║██╔══██╗╚██╗ ██╔╝██╔══╝  ██║   ██╔══██║██║     ██╔══██║██║╚██╔╝██║
  ██║     ██║  ██║██║  ██║ ╚████╔╝ ███████╗██║██╗██║  ██║███████╗██║  ██║██║ ╚═╝ ██║
  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
  < p a r v e j - a l a m . s t u d i o >
  `;

  // Dynamic letter reveal calculation
  const fullName = "PARVEJ";
  const revealedLength = Math.max(1, Math.ceil((progress / 100) * fullName.length));
  const currentRevealed = fullName.slice(0, revealedLength);

  return (
    <AnimatePresence mode="wait">
      {!isFinished && (
        <motion.div
          key="preloader-outer"
          className="fixed inset-0 z-50 bg-[#0A0A0E] flex items-center justify-center overflow-hidden select-none cursor-wait"
        >
          {/* Central Canvas Container that shrinks at 100% */}
          <motion.div
            initial={{
              inset: '0px',
              borderRadius: '0px',
              scale: 1,
            }}
            animate={
              is100Percent
                ? {
                    inset: 'clamp(14px, 3vw, 36px)',
                    borderRadius: '8px',
                    scale: 0.96,
                  }
                : {
                    inset: '0px',
                    borderRadius: '0px',
                    scale: 1,
                  }
            }
            transition={{
              duration: 0.75,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute bg-[#F3F2EE] text-[#111111] border border-black/15 shadow-2xl flex flex-col justify-between p-6 sm:p-10 md:p-14 overflow-hidden"
          >
            {/* BACKGROUND ASCII TYPOGRAPHIC WATERMARK */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.07] select-none">
              <pre className="font-mono text-[8px] sm:text-[10px] md:text-xs leading-none text-black whitespace-pre tracking-tighter text-center">
                {asciiLogo}
              </pre>
            </div>

            {/* TOP BRAND BAR */}
            <div className="relative z-10 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#666666] border-b border-black/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E0533C] animate-pulse" />
                <span className="text-[#111116] font-bold">PARVEJ ALAM // PORTFOLIO OS</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-black/40">[INITIALIZING SYSTEM]</span>
                <span className="text-[#E0533C] font-bold">2026 EDITION</span>
              </div>
            </div>

            {/* ── MIDDLE STAGE: PERCENTAGE ON TOP + 1.5X BIGGER ORANGE STRIPED PARVEJ BELOW ── */}
            <div className="relative z-10 my-auto w-full flex flex-col items-center justify-center text-center py-6">
              
              {/* TOP PERCENTAGE COUNTER & STATUS TELEMETRY (Sits right above Parvej) */}
              <div className="flex flex-col items-center gap-1.5 mb-2 sm:mb-4">
                <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-[#666666]">
                  <span>LOADING ENVIRONMENT</span>
                  <span className="text-[#E0533C] font-extrabold">•</span>
                  <span className="text-emerald-700 font-bold">{currentRevealed}</span>
                </div>

                <div className="font-mono text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#111116] flex items-baseline gap-1">
                  <span>{progress < 10 ? `0${progress}` : progress}</span>
                  <span className="text-[#E0533C] text-2xl sm:text-3xl font-bold">%</span>
                </div>
              </div>

              {/* MASSIVE 1.5X PARVEJ NAME ACTING AS PROGRESSIVE STRIPED FILL BAR */}
              <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto flex items-center justify-center overflow-hidden py-2 select-none">
                <svg
                  viewBox="0 0 900 220"
                  className="w-full h-auto max-h-[140px] sm:max-h-[180px] md:max-h-[220px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    {/* BASE MUTED STRIPES */}
                    <pattern
                      id="loader-stripes-base"
                      width="100%"
                      height="12"
                      patternUnits="userSpaceOnUse"
                    >
                      <rect x="0" y="0" width="100%" height="6" fill="rgba(0, 0, 0, 0.15)" />
                      <rect x="0" y="6" width="100%" height="6" fill="transparent" />
                    </pattern>

                    {/* ACTIVE ORANGE (#E0533C) STRIPES - EXACT SAME AS WORK SECTION */}
                    <pattern
                      id="loader-stripes-active"
                      width="100%"
                      height="12"
                      patternUnits="userSpaceOnUse"
                    >
                      <rect x="0" y="0" width="100%" height="6" fill="#E0533C" />
                      <rect x="0" y="6" width="100%" height="6" fill="transparent" />
                    </pattern>

                    {/* HORIZONTAL 1.5X BIGGER PARVEJ TEXT MASK */}
                    <mask id="loader-parvej-mask">
                      <rect x="0" y="0" width="100%" height="100%" fill="black" />
                      <text
                        x="50%"
                        y="64%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="175"
                        fontWeight="900"
                        fontFamily="'Space Grotesk', 'Playfair Display', Georgia, sans-serif"
                        letterSpacing="0.04em"
                      >
                        parvej
                      </text>
                    </mask>
                  </defs>

                  {/* BASE UNFILLED STRIPED TEXT */}
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#loader-stripes-base)"
                    mask="url(#loader-parvej-mask)"
                  />

                  {/* PROGRESSIVELY FILLED ORANGE STRIPED TEXT (from 0% to 100% left to right) */}
                  <rect
                    x="0"
                    y="0"
                    width={`${progress}%`}
                    height="100%"
                    fill="url(#loader-stripes-active)"
                    mask="url(#loader-parvej-mask)"
                    className="transition-all duration-75 ease-out"
                  />
                </svg>
              </div>

              {/* Sub-label showing live loaded modules */}
              <div className="font-mono text-[10.5px] sm:text-xs text-[#555555] tracking-widest uppercase mt-2 font-bold">
                {progress < 25 && "INITIALIZING CMA & ACCOUNTING ENGINE..."}
                {progress >= 25 && progress < 55 && "COMPILING 3-STATEMENT VALUATION MODELS..."}
                {progress >= 55 && progress < 85 && "CALIBRATING ENTERPRISE DAX TELEMETRY..."}
                {progress >= 85 && "SYSTEM READY // 100% AUDIT RECONCILED"}
              </div>
            </div>

            {/* BOTTOM STATUS & RECONCILIATION BAR */}
            <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-[#777777] uppercase tracking-widest border-t border-black/10 pt-3">
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold">CMA USA PART 1 (380/500)</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">US GAAP / IFRS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#E0533C] font-bold">{progress}% LOADED</span>
                <span>•</span>
                <span>SECURE HOSTING</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

