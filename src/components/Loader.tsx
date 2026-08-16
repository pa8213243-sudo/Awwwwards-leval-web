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
    // Smooth percentage counter 0 to 100 (approx 2.4 seconds)
    const duration = 2400;
    const intervalTime = 24;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextVal = Math.min(100, Math.floor((currentStep / steps) * 100));
      setProgress(nextVal);

      if (currentStep >= steps) {
        clearInterval(timer);
        setIs100Percent(true);

        // Sequence: Reaches 100% -> Smoothly shrinks into dashed architectural frame -> Opens Home section seamlessly
        setTimeout(() => {
          setIsFinished(true);
          setTimeout(() => {
            onComplete();
          }, 450);
        }, 900);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence mode="wait">
      {!isFinished && (
        <motion.div
          key="preloader-outer"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999] bg-[#0E0E12] flex flex-col items-center justify-center overflow-hidden select-none cursor-wait p-4 sm:p-8"
        >
          {/* ARCHITECTURAL DOTTED / DASHED BOUNDING FRAME (Exact A-lign reference) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative w-full max-w-5xl h-[82vh] max-h-[640px] border border-dashed border-white/20 p-3 sm:p-6 md:p-8 flex flex-col justify-between items-center"
          >
            {/* INNER WHITE CANVASS THAT SHRINKS AT 100% */}
            <motion.div
              initial={{
                width: '100%',
                height: '100%',
                borderRadius: '0px',
                scale: 1,
              }}
              animate={
                is100Percent
                  ? {
                      width: '94%',
                      height: '84%',
                      borderRadius: '4px',
                      scale: 0.98,
                    }
                  : {
                      width: '100%',
                      height: '100%',
                      borderRadius: '0px',
                      scale: 1,
                    }
              }
              transition={{
                duration: 0.8,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="relative w-full h-full bg-[#F3F2EE] text-[#111116] border border-black/15 shadow-[0_25px_60px_rgba(0,0,0,0.45)] flex flex-col justify-between p-5 sm:p-8 md:p-12 overflow-hidden"
            >
              {/* TOP STATUS BAR */}
              <div className="relative z-10 flex items-center justify-between text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#666666] border-b border-black/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E0533C] animate-pulse" />
                  <span className="text-[#111116] font-bold">LOADING</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[#E0533C] font-extrabold text-sm sm:text-base">
                    {progress}%
                  </span>
                </div>
              </div>

              {/* ── CENTER STAGE: CLEAN SINGLE "parvej Alam" ORANGE STRIPED PROGRESS BAR ── */}
              <div className="relative z-10 my-auto w-full flex flex-col items-center justify-center text-center py-4">
                <div className="w-full max-w-3xl sm:max-w-4xl mx-auto flex items-center justify-center overflow-hidden py-2 select-none">
                  <svg
                    viewBox="0 0 1000 200"
                    className="w-full h-auto max-h-[120px] sm:max-h-[170px] md:max-h-[210px]"
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
                        <rect x="0" y="0" width="100%" height="6" fill="rgba(0, 0, 0, 0.12)" />
                        <rect x="0" y="6" width="100%" height="6" fill="transparent" />
                      </pattern>

                      {/* ACTIVE ORANGE (#E0533C) STRIPES */}
                      <pattern
                        id="loader-stripes-active"
                        width="100%"
                        height="12"
                        patternUnits="userSpaceOnUse"
                      >
                        <rect x="0" y="0" width="100%" height="6" fill="#E0533C" />
                        <rect x="0" y="6" width="100%" height="6" fill="transparent" />
                      </pattern>

                      {/* SINGLE CLEAN "parvej Alam" TEXT MASK */}
                      <mask id="loader-parvej-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="black" />
                        <text
                          x="50%"
                          y="58%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="135"
                          fontWeight="900"
                          fontFamily="'Space Grotesk', 'Playfair Display', Georgia, sans-serif"
                          letterSpacing="0.02em"
                        >
                          parvej Alam
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

                    {/* PROGRESSIVELY FILLED ORANGE STRIPED TEXT (0% -> 100%) */}
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

                {/* Sub-label telemetry */}
                <div className="font-mono text-[10px] sm:text-xs text-[#666666] tracking-widest uppercase mt-3 font-semibold">
                  {progress < 30 && "INITIALIZING CMA & ACCOUNTING ENGINE..."}
                  {progress >= 30 && progress < 70 && "COMPILING 3-STATEMENT VALUATION MODELS..."}
                  {progress >= 70 && progress < 100 && "CALIBRATING ENTERPRISE DAX TELEMETRY..."}
                  {progress === 100 && "100% RECONCILED // OPENING STUDIO"}
                </div>
              </div>

              {/* BOTTOM STATUS BAR */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-[#777777] uppercase tracking-widest border-t border-black/10 pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">CMA USA (380/500)</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">FINANCE & DATA STRATEGY</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#E0533C] font-bold">PORTFOLIO OS</span>
                </div>
              </div>
            </motion.div>

            {/* FLOATING SIGNATURE BOTTOM NAV BAR PILLS (Exact reference from user) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute -bottom-6 sm:-bottom-7 z-20 flex items-center gap-2 sm:gap-4 bg-transparent select-none pointer-events-none"
            >
              <div className="flex items-center bg-white text-black border border-black/20 shadow-xl px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider">
                <span>MENU</span>
                <span className="ml-2.5 text-black/50 font-normal">+</span>
              </div>

              <div className="font-mono text-xs sm:text-sm text-white/70 font-semibold tracking-wider px-2">
                &lt;parvej-alam&gt;
              </div>

              <div className="bg-[#E0533C] text-white border border-[#E0533C] shadow-xl px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider">
                CONTACT
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
