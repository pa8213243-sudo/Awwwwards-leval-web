import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

interface PixelLineHeadingProps {
  title: string;
  subtitle?: string;
  sceneCode?: string;
  accentColor?: 'emerald' | 'vermilion' | 'blue' | 'amber';
  manualProgress?: number; // Optional override 0-1
  className?: string;
}

// Map characters to geometric stroke path coordinates & pixel matrix blocks
const CHAR_MAP: Record<string, { lines: Array<[number, number, number, number]>; pixels: Array<[number, number]> }> = {
  W: {
    lines: [[0,0, 0,10], [0,10, 5,5], [5,5, 10,10], [10,10, 10,0]],
    pixels: [[0,0],[0,2],[0,4],[0,6],[0,8],[0,10],[1,9],[2,8],[3,7],[4,6],[5,5],[6,6],[7,7],[8,8],[9,9],[10,10],[10,8],[10,6],[10,4],[10,2],[10,0]],
  },
  O: {
    lines: [[0,0, 10,0], [10,0, 10,10], [10,10, 0,10], [0,10, 0,0]],
    pixels: [[0,0],[2,0],[4,0],[6,0],[8,0],[10,0],[10,2],[10,4],[10,6],[10,8],[10,10],[8,10],[6,10],[4,10],[2,10],[0,10],[0,8],[0,6],[0,4],[0,2]],
  },
  R: {
    lines: [[0,0, 0,10], [0,0, 8,0], [8,0, 10,3], [10,3, 8,5], [8,5, 0,5], [4,5, 10,10]],
    pixels: [[0,0],[0,2],[0,4],[0,6],[0,8],[0,10],[2,0],[4,0],[6,0],[8,0],[10,2],[8,5],[6,5],[4,5],[2,5],[6,7],[8,9],[10,10]],
  },
  K: {
    lines: [[0,0, 0,10], [10,0, 0,5], [0,5, 10,10]],
    pixels: [[0,0],[0,2],[0,4],[0,6],[0,8],[0,10],[10,0],[8,2],[6,3.5],[4,4.5],[2,5],[4,6],[6,7.5],[8,8.8],[10,10]],
  },
  P: {
    lines: [[0,0, 0,10], [0,0, 8,0], [8,0, 10,2.5], [10,2.5, 8,5], [8,5, 0,5]],
    pixels: [[0,0],[0,2],[0,4],[0,6],[0,8],[0,10],[2,0],[4,0],[6,0],[8,0],[10,2.5],[8,5],[6,5],[4,5],[2,5]],
  },
  I: {
    lines: [[2,0, 8,0], [5,0, 5,10], [2,10, 8,10]],
    pixels: [[2,0],[5,0],[8,0],[5,2],[5,4],[5,6],[5,8],[2,10],[5,10],[8,10]],
  },
  C: {
    lines: [[10,0, 2,0], [2,0, 0,2], [0,2, 0,8], [0,8, 2,10], [2,10, 10,10]],
    pixels: [[10,0],[8,0],[6,0],[4,0],[2,0],[0,2],[0,4],[0,6],[0,8],[2,10],[4,10],[6,10],[8,10],[10,10]],
  },
  N: {
    lines: [[0,0, 0,10], [0,0, 10,10], [10,10, 10,0]],
    pixels: [[0,0],[0,2],[0,4],[0,6],[0,8],[0,10],[2,2],[4,4],[6,6],[8,8],[10,10],[10,8],[10,6],[10,4],[10,2],[10,0]],
  },
  G: {
    lines: [[10,0, 2,0], [2,0, 0,2], [0,2, 0,8], [0,8, 2,10], [2,10, 10,10], [10,10, 10,5], [10,5, 5,5]],
    pixels: [[10,0],[6,0],[2,0],[0,2],[0,5],[0,8],[2,10],[6,10],[10,10],[10,7.5],[10,5],[7.5,5],[5,5]],
  },
  E: {
    lines: [[10,0, 0,0], [0,0, 0,10], [0,10, 10,10], [0,5, 7,5]],
    pixels: [[10,0],[6,0],[2,0],[0,0],[0,2.5],[0,5],[0,7.5],[0,10],[2.5,10],[5,10],[7.5,10],[10,10],[2.5,5],[5,5],[7,5]],
  },
  S: {
    lines: [[10,0, 2,0], [2,0, 0,2], [0,2, 0,4], [0,4, 2,5], [2,5, 8,5], [8,5, 10,6], [10,6, 10,8], [10,8, 8,10], [8,10, 0,10]],
    pixels: [[10,0],[6,0],[2,0],[0,2],[0,4],[2,5],[5,5],[8,5],[10,6],[10,8],[8,10],[4,10],[0,10]],
  },
  A: {
    lines: [[0,10, 5,0], [5,0, 10,10], [2.5,5, 7.5,5]],
    pixels: [[0,10],[1.25,7.5],[2.5,5],[3.75,2.5],[5,0],[6.25,2.5],[7.5,5],[8.75,7.5],[10,10],[3.75,5],[5,5],[6.25,5]],
  },
  B: {
    lines: [[0,0, 0,10], [0,0, 7,0], [7,0, 9,2.5], [9,2.5, 7,5], [7,5, 0,5], [7,5, 10,7.5], [10,7.5, 7,10], [7,10, 0,10]],
    pixels: [[0,0],[0,2.5],[0,5],[0,7.5],[0,10],[3.5,0],[7,0],[9,2.5],[7,5],[3.5,5],[8.5,6.25],[10,7.5],[8.5,8.75],[7,10],[3.5,10]],
  },
  U: {
    lines: [[0,0, 0,8], [0,8, 2,10], [2,10, 8,10], [8,10, 10,8], [10,8, 10,0]],
    pixels: [[0,0],[0,2.5],[0,5],[0,7.5],[0,8],[2,10],[5,10],[8,10],[10,8],[10,6],[10,4],[10,2],[10,0]],
  },
  T: {
    lines: [[0,0, 10,0], [5,0, 5,10]],
    pixels: [[0,0],[2.5,0],[5,0],[7.5,0],[10,0],[5,2.5],[5,5],[5,7.5],[5,10]],
  },
  L: {
    lines: [[0,0, 0,10], [0,10, 10,10]],
    pixels: [[0,0],[0,2.5],[0,5],[0,7.5],[0,10],[2.5,10],[5,10],[7.5,10],[10,10]],
  },
  Y: {
    lines: [[0,0, 5,5], [10,0, 5,5], [5,5, 5,10]],
    pixels: [[0,0],[2.5,2.5],[5,5],[7.5,2.5],[10,0],[5,6.5],[5,8],[5,10]],
  },
  D: {
    lines: [[0,0, 0,10], [0,0, 6,0], [6,0, 10,4], [10,4, 10,6], [10,6, 6,10], [6,10, 0,10]],
    pixels: [[0,0],[0,2.5],[0,5],[0,7.5],[0,10],[3,0],[6,0],[10,4],[10,6],[6,10],[3,10]],
  },
  ' ': {
    lines: [],
    pixels: [],
  },
};

export const PixelLineHeading: React.FC<PixelLineHeadingProps> = ({
  title,
  subtitle,
  sceneCode = '[SCENE ARCHITECTURE]',
  accentColor = 'vermilion',
  manualProgress,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(manualProgress ?? 0);

  const colors = {
    vermilion: {
      primary: '#E0533C',
      border: 'border-[#E0533C]/40',
      bg: 'bg-[#E0533C]/10',
      text: 'text-[#E0533C]',
      glow: 'rgba(224,83,60,0.5)',
    },
    emerald: {
      primary: '#10B981',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-950/40',
      text: 'text-emerald-400',
      glow: 'rgba(16,185,129,0.5)',
    },
    blue: {
      primary: '#3B82F6',
      border: 'border-blue-500/40',
      bg: 'bg-blue-950/40',
      text: 'text-blue-400',
      glow: 'rgba(59,130,246,0.5)',
    },
    amber: {
      primary: '#F59E0B',
      border: 'border-amber-500/40',
      bg: 'bg-amber-950/40',
      text: 'text-amber-400',
      glow: 'rgba(245,158,11,0.5)',
    },
  }[accentColor];

  useEffect(() => {
    if (manualProgress !== undefined) {
      setScrollProgress(manualProgress);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top 85%',
        end: 'bottom 25%',
        scrub: 0.5,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, container);

    return () => ctx.revert();
  }, [manualProgress]);

  const cleanTitle = title.toUpperCase().trim();
  const chars = cleanTitle.split('');

  // Calculate layout parameters
  const charWidth = 44;
  const charHeight = 48;
  const gap = 12;
  const totalWidth = chars.length * (charWidth + gap) - gap;
  const progressPercent = Math.round(scrollProgress * 100);

  return (
    <div
      ref={containerRef}
      className={`relative w-full border border-white/10 bg-[#0E0E12]/90 backdrop-blur-md p-5 sm:p-7 rounded-sm select-none overflow-hidden ${className}`}
    >
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:12px_12px] opacity-20 pointer-events-none" />

      {/* Outer Reticle Corners */}
      <span className="absolute top-1.5 left-2 font-mono text-[10px] text-white/30">┌</span>
      <span className="absolute top-1.5 right-2 font-mono text-[10px] text-white/30">┐</span>
      <span className="absolute bottom-1.5 left-2 font-mono text-[10px] text-white/30">└</span>
      <span className="absolute bottom-1.5 right-2 font-mono text-[10px] text-white/30">┘</span>

      {/* Top Header Control Line */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 mb-4 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: colors.primary }} />
          <span className={`${colors.text} font-bold tracking-wider uppercase`}>{sceneCode}</span>
          <span className="text-white/30">|</span>
          <span className="text-white/60 uppercase">GRID 0.25mm</span>
        </div>

        <div className="flex items-center gap-4 text-white/50">
          <span>X: {(scrollProgress * 1024).toFixed(0).padStart(4, '0')}</span>
          <span>Y: {(scrollProgress * 768).toFixed(0).padStart(4, '0')}</span>
          <div className="px-2 py-0.5 bg-white/10 border border-white/15 text-white font-bold rounded-sm">
            PROG: {progressPercent.toString().padStart(3, '0')}%
          </div>
        </div>
      </div>

      {/* Main SVG Vector Architectural Pixel/Line Typographic Render */}
      <div className="relative z-10 my-2 overflow-x-auto pb-2 scrollbar-none">
        <svg
          viewBox={`0 0 ${Math.max(totalWidth + 20, 320)} 64`}
          className="w-full max-w-full h-auto min-h-[56px] overflow-visible"
        >
          <defs>
            {/* Linear gradient clip mask for progressive line drawing */}
            <linearGradient id={`line-grad-${title}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset={`${Math.min(100, scrollProgress * 120)}%`} stopColor="#FFFFFF" />
              <stop offset={`${Math.min(100, scrollProgress * 120 + 10)}%`} stopColor="#000000" />
            </linearGradient>

            <filter id={`glow-${title}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render each character */}
          {chars.map((char, charIdx) => {
            const xOffset = charIdx * (charWidth + gap) + 10;
            const yOffset = 8;
            const charData = CHAR_MAP[char] || CHAR_MAP[' '];

            return (
              <g key={charIdx} transform={`translate(${xOffset}, ${yOffset})`}>
                {/* Character Bounding Box & Grid Crosshairs */}
                <rect
                  x="0"
                  y="0"
                  width={charWidth}
                  height={charHeight}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                />

                {/* Sub-grid 2x2 ticks */}
                <line x1={charWidth / 2} y1="0" x2={charWidth / 2} y2={charHeight} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                <line x1="0" y1={charHeight / 2} x2={charWidth} y2={charHeight / 2} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                {/* Structural Pixel Matrices */}
                {charData.pixels.map(([px, py], pIdx) => {
                  const pixelX = (px / 10) * charWidth;
                  const pixelY = (py / 10) * charHeight;
                  const threshold = (charIdx * 25 + pIdx) / (chars.length * 25);
                  const isFilled = scrollProgress >= threshold * 0.8;

                  return (
                    <rect
                      key={pIdx}
                      x={pixelX - 1.5}
                      y={pixelY - 1.5}
                      width="3"
                      height="3"
                      fill={isFilled ? colors.primary : 'rgba(255,255,255,0.15)'}
                      opacity={isFilled ? 1 : 0.4}
                      className="transition-all duration-200"
                    />
                  );
                })}

                {/* Vector Stroke Lines */}
                {charData.lines.map(([x1, y1, x2, y2], lIdx) => {
                  const sx1 = (x1 / 10) * charWidth;
                  const sy1 = (y1 / 10) * charHeight;
                  const sx2 = (x2 / 10) * charWidth;
                  const sy2 = (y2 / 10) * charHeight;

                  return (
                    <g key={lIdx}>
                      {/* Base outline trace line */}
                      <line
                        x1={sx1}
                        y1={sy1}
                        x2={sx2}
                        y2={sy2}
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1.5"
                      />
                      {/* Active glowing stroke reveal line */}
                      <line
                        x1={sx1}
                        y1={sy1}
                        x2={sx2}
                        y2={sy2}
                        stroke={colors.primary}
                        strokeWidth="3.5"
                        strokeLinecap="square"
                        style={{
                          strokeDasharray: '100',
                          strokeDashoffset: `${Math.max(0, 100 - scrollProgress * 150)}`,
                          filter: scrollProgress > 0.3 ? `drop-shadow(0 0 6px ${colors.glow})` : 'none',
                        }}
                        className="transition-all duration-300"
                      />
                    </g>
                  );
                })}

                {/* Character Tag Label */}
                <text
                  x="2"
                  y={charHeight + 10}
                  fill="rgba(255,255,255,0.3)"
                  fontSize="7"
                  fontFamily="monospace"
                >
                  C0{charIdx + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Subtitle & Scale Ruler Bar */}
      <div className="relative z-10 border-t border-white/10 pt-3 flex flex-wrap items-center justify-between gap-3">
        {subtitle && (
          <h2 className="font-serif text-2xl sm:text-4xl text-white uppercase tracking-tight">
            {subtitle}
          </h2>
        )}

        {/* Dynamic Architectural Scale Ruler */}
        <div className="flex items-center gap-1 font-mono text-[9px] text-white/40">
          <span>|</span>
          <div className="w-24 sm:w-36 h-[2px] bg-white/20 relative overflow-hidden">
            <div
              className="h-full transition-all duration-150"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: colors.primary,
              }}
            />
          </div>
          <span>|</span>
          <span className="hidden sm:inline">SCALE 1:100</span>
        </div>
      </div>
    </div>
  );
};
