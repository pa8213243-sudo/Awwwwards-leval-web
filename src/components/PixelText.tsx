import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

interface PixelTextProps {
  text: string;
  subtitle?: string;
  sceneCode?: string;
  accentColor?: string; // e.g. "#E0533C", "#10B981", "#3B82F6", "#F59E0B"
  manualProgress?: number;
  className?: string;
}

// Pixel block definitions for 5x7 dot matrix
const MATRIX_FONT: Record<string, number[][]> = {
  W: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,1,0,1],
    [1,0,1,0,1],
    [1,1,0,1,1],
    [1,0,0,0,1],
  ],
  O: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  R: [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1],
  ],
  K: [
    [1,0,0,0,1],
    [1,0,0,1,0],
    [1,0,1,0,0],
    [1,1,0,0,0],
    [1,0,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1],
  ],
  P: [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
  ],
  I: [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [1,1,1,1,1],
  ],
  C: [
    [0,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [0,1,1,1,1],
  ],
  N: [
    [1,0,0,0,1],
    [1,1,0,0,1],
    [1,0,1,0,1],
    [1,0,1,0,1],
    [1,0,0,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  G: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,0],
    [1,0,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  E: [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  S: [
    [0,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [0,1,1,1,0],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,1,1,1,0],
  ],
  A: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  B: [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
  ],
  U: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  T: [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  L: [
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  M: [
    [1,0,0,0,1],
    [1,1,0,1,1],
    [1,0,1,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  Y: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  ' ': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
  ],
};

export const PixelText: React.FC<PixelTextProps> = ({
  text,
  subtitle,
  sceneCode = '[CANVAS ARCHITECTURE]',
  accentColor = '#E0533C',
  manualProgress,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState<number>(manualProgress ?? 0);

  useEffect(() => {
    if (manualProgress !== undefined) {
      setProgress(manualProgress);
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
          setProgress(self.progress);
        },
      });
    }, container);

    return () => ctx.revert();
  }, [manualProgress]);

  // HTML5 Canvas Pixel Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cleanText = text.toUpperCase().trim();
    const chars = cleanText.split('');

    // Canvas size configuration
    const cols = 5;
    const rows = 7;
    const blockSize = 6;
    const blockGap = 2;
    const charGap = 16;
    const startX = 16;
    const startY = 16;

    const totalCharWidth = cols * (blockSize + blockGap);
    const canvasWidth = startX * 2 + chars.length * totalCharWidth + (chars.length - 1) * charGap;
    const canvasHeight = startY * 2 + rows * (blockSize + blockGap);

    canvas.width = canvasWidth * 2; // HiDPI retina scaling
    canvas.height = canvasHeight * 2;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.scale(2, 2);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background reticle dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let x = 8; x < canvasWidth; x += 12) {
      for (let y = 8; y < canvasHeight; y += 12) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }

    let totalActiveBlocks = 0;
    chars.forEach((char) => {
      const grid = MATRIX_FONT[char] || MATRIX_FONT[' '];
      grid.forEach((row) =>
        row.forEach((val) => {
          if (val === 1) totalActiveBlocks++;
        })
      );
    });

    const blocksToReveal = Math.floor(totalActiveBlocks * Math.min(1, Math.max(0, progress)));
    let currentBlockCount = 0;

    chars.forEach((char, charIdx) => {
      const grid = MATRIX_FONT[char] || MATRIX_FONT[' '];
      const charX = startX + charIdx * (totalCharWidth + charGap);

      grid.forEach((row, rIdx) => {
        row.forEach((val, cIdx) => {
          if (val !== 1) {
            // Draw empty cell placeholder dot
            const px = charX + cIdx * (blockSize + blockGap);
            const py = startY + rIdx * (blockSize + blockGap);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.fillRect(px + 1.5, py + 1.5, blockSize - 3, blockSize - 3);
            return;
          }

          currentBlockCount++;
          const px = charX + cIdx * (blockSize + blockGap);
          const py = startY + rIdx * (blockSize + blockGap);

          if (currentBlockCount <= blocksToReveal) {
            // Active revealed pixel block
            ctx.shadowColor = accentColor;
            ctx.shadowBlur = 8;
            ctx.fillStyle = accentColor;
            ctx.fillRect(px, py, blockSize, blockSize);

            // Inner highlight
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(px + 1, py + 1, blockSize - 2, blockSize - 2);
          } else {
            // Unrevealed muted block
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
            ctx.fillRect(px, py, blockSize, blockSize);
          }
        });
      });
    });
  }, [text, progress, accentColor]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full border border-white/10 bg-[#0C0C0F]/90 backdrop-blur-md p-5 sm:p-6 rounded-sm select-none overflow-hidden ${className}`}
    >
      {/* Top Telemetry HUD */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: accentColor }}
          />
          <span className="font-bold tracking-wider uppercase text-white/90">{sceneCode}</span>
        </div>
        <div className="flex items-center gap-3 text-white/50">
          <span>CANVAS 2D ENGINE</span>
          <span className="text-emerald-400 font-bold">
            PROGRESS: {Math.round(progress * 100).toString().padStart(3, '0')}%
          </span>
        </div>
      </div>

      {/* HTML5 Canvas Rendering Area */}
      <div className="overflow-x-auto py-2 scrollbar-none flex justify-start">
        <canvas ref={canvasRef} className="block max-w-full" />
      </div>

      {/* Subtitle & Bottom Bar */}
      {subtitle && (
        <div className="border-t border-white/10 pt-3 mt-2 flex items-center justify-between">
          <h2 className="font-serif text-2xl sm:text-4xl text-white uppercase tracking-tight">
            {subtitle}
          </h2>
          <span className="font-mono text-[10px] text-white/40 uppercase">DASH MATRIX REVEAL</span>
        </div>
      )}
    </div>
  );
};
