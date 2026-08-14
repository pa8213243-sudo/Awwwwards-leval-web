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
    // Smooth percentage counter 0 to 100
    const duration = 2000; // 2 seconds
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextVal = Math.min(100, Math.floor((currentStep / steps) * 100));
      setProgress(nextVal);

      if (currentStep >= steps) {
        clearInterval(timer);
        setIs100Percent(true);

        // Sequence: 
        // 1. Reaches 100%
        // 2. Shrinks canvas into central framed box (0.6s)
        // 3. Fades out & triggers onComplete (0.4s)
        setTimeout(() => {
          setIsFinished(true);
          setTimeout(() => {
            onComplete();
          }, 600);
        }, 800);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Large ASCII Art for background watermark
  const asciiLogo = `
   ██████╗  █████╗ ██████╗ ██╗   ██╗███████╗██╗    █████╗ ██╗      █████╗ ███╗   ███╗
  ██╔══██╗██╔══██╗██╔══██╗██║   ██║██╔════╝██║   ██╔══██╗██║     ██╔══██╗████╗ ████║
  ██████╔╝███████║██████╔╝██║   ██║█████╗  ██║   ███████║██║     ███████║██╔████╔██║
  ██╔═══╝ ██╔══██║██╔══██╗╚██╗ ██╔╝██╔══╝  ██║   ██╔══██║██║     ██╔══██║██║╚██╔╝██║
  ██║     ██║  ██║██║  ██║ ╚████╔╝ ███████╗██║██╗██║  ██║███████╗██║  ██║██║ ╚═╝ ██║
  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
  < p a r v e j - a l a m . s t u d i o >
  `;

  return (
    <AnimatePresence mode="wait">
      {!isFinished && (
        <motion.div
          key="preloader-outer"
          className="fixed inset-0 z-50 bg-[#0A0A0E] flex items-center justify-center overflow-hidden select-none cursor-wait"
        >
          {/* Central White Canvas Container that shrinks at 100% */}
          <motion.div
            initial={{
              inset: '0px',
              borderRadius: '0px',
              scale: 1,
            }}
            animate={
              is100Percent
                ? {
                    inset: 'clamp(12px, 3vw, 36px)',
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
              duration: 0.85,
              ease: [0.76, 0, 0.24, 1], // Smooth custom cubic-bezier
            }}
            className="absolute bg-[#F3F2EE] text-[#111111] border border-black/15 shadow-2xl flex flex-col justify-between p-8 sm:p-12 md:p-16 overflow-hidden"
          >
            {/* BACKGROUND ASCII TYPOGRAPHIC WATERMARK */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-10 select-none">
              <pre className="font-mono text-[9px] sm:text-[11px] md:text-xs leading-none text-black whitespace-pre tracking-tighter text-center">
                {asciiLogo}
              </pre>
            </div>

            {/* TOP BRAND BAR */}
            <div className="relative z-10 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#666666]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                <span>PARVEJ ALAM STUDIO</span>
              </div>
              <div className="hidden sm:block">2026 // EDITION</div>
            </div>

            {/* MIDDLE ROW: 'LOADING' ON LEFT, PERCENTAGE ON RIGHT */}
            <div className="relative z-10 my-auto w-full flex items-center justify-between font-mono">
              {/* Left Label */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#111111]"
              >
                LOADING
              </motion.div>

              {/* Right Counter */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xs sm:text-sm font-bold tracking-wider text-[#111111]"
              >
                {progress}%
              </motion.div>
            </div>

            {/* BOTTOM DOTTED GRID & PROGRESS STRIP */}
            <div className="relative z-10 flex flex-col gap-3">
              <div className="w-full h-[2px] bg-black/10 relative overflow-hidden rounded-full">
                <motion.div
                  className="absolute top-0 left-0 bottom-0 bg-black"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#888888] uppercase tracking-widest">
                <span>CMA USA PART 1 CLEARED</span>
                <span>STRATEGIC FINANCE & POWER BI</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

