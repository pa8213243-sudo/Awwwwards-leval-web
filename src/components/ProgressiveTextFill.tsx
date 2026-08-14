import React from 'react';

interface ProgressiveTextFillProps {
  text: string;
  progress: number; // 0 to 100
  accentColor?: string;
  isVertical?: boolean;
  className?: string;
  textClassName?: string;
}

export const ProgressiveTextFill: React.FC<ProgressiveTextFillProps> = ({
  text,
  progress,
  accentColor = '#E0533C',
  isVertical = false,
  className = '',
  textClassName = 'font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest',
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  if (isVertical) {
    return (
      <div className={`relative inline-block overflow-hidden [writing-mode:vertical-rl] rotate-180 select-none ${className}`}>
        {/* Base unfilled/ghost text */}
        <span className={`${textClassName} text-white/20 select-none`}>
          {text}
        </span>
        {/* Progressively filled overlay text from bottom to top */}
        <span
          className={`absolute bottom-0 left-0 right-0 overflow-hidden ${textClassName} select-none whitespace-nowrap transition-all duration-100 ease-out`}
          style={{
            height: `${clampedProgress}%`,
            color: accentColor,
            textShadow: `0 0 14px ${accentColor}99, 0 0 4px ${accentColor}`,
          }}
          aria-hidden="true"
        >
          {text}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative inline-block overflow-hidden select-none ${className}`}>
      {/* Base unfilled/ghost text */}
      <span className={`${textClassName} text-white/25 select-none`}>
        {text}
      </span>
      {/* Progressively filled overlay text from left to right */}
      <span
        className={`absolute top-0 left-0 bottom-0 overflow-hidden ${textClassName} select-none whitespace-nowrap transition-all duration-100 ease-out`}
        style={{
          width: `${clampedProgress}%`,
          color: accentColor,
          textShadow: `0 0 14px ${accentColor}99, 0 0 4px ${accentColor}`,
        }}
        aria-hidden="true"
      >
        {text}
      </span>
    </div>
  );
};
