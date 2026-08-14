import React from 'react';

interface EditorialSkeletonProps {
  aspectRatio?: string;
  className?: string;
  loadProgress?: number;
  label?: string;
  state?: 'idle' | 'intersecting' | 'caching' | 'loaded' | 'error';
}

export const EditorialSkeleton: React.FC<EditorialSkeletonProps> = ({
  aspectRatio = 'aspect-[4/3]',
  className = '',
  loadProgress = 30,
  label = 'EDITORIAL_BUFFER',
  state = 'caching',
}) => {
  return (
    <div
      className={`relative w-full h-full min-h-[160px] bg-[#0E0E14] border border-white/10 overflow-hidden flex flex-col items-center justify-center p-4 select-none ${aspectRatio} ${className}`}
    >
      {/* Precision Wireframe Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff07_1px,transparent_1px),linear-gradient(to_bottom,#ffffff07_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Shimmer Sweep Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />

      {/* Four Corner Alignment Brackets */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/30" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/30" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/30" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/30" />

      {/* Telemetry Core UI */}
      <div className="relative z-10 flex flex-col items-center gap-2 max-w-[220px] text-center">
        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-neutral-300">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E0533C] animate-ping" />
          <span>{label}</span>
          <span className="text-white font-bold">{Math.round(loadProgress)}%</span>
        </div>

        {/* Linear Pre-cache Bar */}
        <div className="w-32 sm:w-40 h-1 bg-white/10 rounded-none overflow-hidden p-[1px] border border-white/15">
          <div
            className="h-full bg-gradient-to-r from-[#E0533C] to-emerald-400 transition-all duration-200 ease-out"
            style={{ width: `${Math.max(10, Math.min(100, loadProgress))}%` }}
          />
        </div>

        <div className="font-mono text-[8px] tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
          <span>STATE: {state.toUpperCase()}</span>
          <span>•</span>
          <span>ASYNC_DECODE</span>
        </div>
      </div>
    </div>
  );
};
