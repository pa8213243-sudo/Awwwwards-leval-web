import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Activity, ChevronRight } from 'lucide-react';
import { StripedTypography } from './StripedTypography';
import { ProgressiveTextFill } from './ProgressiveTextFill';
import { gsap, ScrollTrigger } from '../lib/gsap';

interface SectionProgressHeaderProps {
  sceneNumber?: string;
  sceneCode: string;
  title: string;
  subtitle?: string;
  badge?: string;
  accentColor?: string;
  sectionId: string;
  striped?: boolean;
  isSticky?: boolean;
  verticalTitle?: boolean;
  className?: string;
}

export const SectionProgressHeader: React.FC<SectionProgressHeaderProps> = ({
  sceneNumber,
  sceneCode,
  title,
  subtitle,
  badge,
  accentColor = '#E0533C',
  sectionId,
  striped = true,
  isSticky = true,
  verticalTitle = false,
  className = '',
}) => {
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targetElement = document.getElementById(sectionId) || headerRef.current;
    if (!targetElement) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: targetElement,
        start: 'top 85%',
        end: 'bottom 15%',
        scrub: 0.2,
        onUpdate: (self) => {
          const p = Math.round(self.progress * 100);
          setProgress(p);
          setIsActive(self.progress > 0 && self.progress < 1);
        },
      });
    }, targetElement);

    return () => ctx.revert();
  }, [sectionId]);

  if (verticalTitle) {
    return (
      <div ref={headerRef} className={`select-none flex items-stretch gap-4 ${className}`}>
        {/* VERTICAL SECTION SPINE WITH PROGRESSIVE VERTICAL FILL */}
        <div className="flex flex-col items-center justify-between py-4 px-2.5 bg-black/80 border border-white/15 backdrop-blur-md shadow-xl flex-shrink-0 z-20">
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-opacity"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 8px ${accentColor}`,
                opacity: progress > 0 ? 1 : 0.3,
              }}
            />
          </div>

          {/* Vertical Progressive Text Fill Title */}
          <div className="my-auto py-4">
            <ProgressiveTextFill
              text={`${sceneCode} • ${title}`}
              progress={progress}
              accentColor={accentColor}
              isVertical={true}
              textClassName="font-mono text-xs sm:text-sm font-extrabold uppercase tracking-widest"
            />
          </div>

          {/* Compact Vertical Progress Meter */}
          <div className="flex flex-col items-center gap-1.5 pt-2 border-t border-white/10 font-mono text-[9px]">
            <div className="w-1.5 h-14 bg-white/15 overflow-hidden relative">
              <div
                className="w-full transition-all duration-150 absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.max(4, progress)}%`,
                  backgroundColor: accentColor,
                  boxShadow: `0 0 6px ${accentColor}`,
                }}
              />
            </div>
            <span className="font-bold text-[9px]" style={{ color: accentColor }}>
              {progress}%
            </span>
          </div>
        </div>

        {/* Content Column */}
        <div className="flex-1 flex flex-col justify-between">
          {subtitle && (
            <div className="border-l-2 pl-3 py-1 font-mono text-xs text-white/80 mb-3" style={{ borderColor: accentColor }}>
              <p className="font-sans text-xs sm:text-sm text-white/80 font-normal leading-relaxed">
                {subtitle}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={headerRef} className={`w-full select-none ${className}`}>
      {/* STICKY TOP PROGRESS BAR STRIP (Anchors cleanly below navbar) */}
      <div 
        className={`${
          isSticky 
            ? 'sticky top-14 md:top-16 z-30 bg-[#F3F2EE]/95 backdrop-blur-md border-y border-black/15 py-2 px-4 sm:px-6 md:px-8 mb-4 shadow-xs transition-all' 
            : 'border-b border-black/15 pb-2 mb-4'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-[#555555]">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0 transition-opacity"
              style={{ 
                backgroundColor: accentColor, 
                boxShadow: `0 0 6px ${accentColor}`,
                opacity: progress > 0 ? 1 : 0.3
              }}
            />
            <span className="font-bold text-[#111116] tracking-wider truncate max-w-[180px] sm:max-w-none">{sceneCode}</span>
            <span className="text-[#888888] hidden sm:inline">•</span>
            {/* PROGRESSIVE LIQUID COLOR FILL FOR SECTION NAME */}
            <div className="hidden md:inline-flex items-center px-1.5 py-0.5 border border-black/15 bg-white">
              <ProgressiveTextFill
                text={title}
                progress={progress}
                accentColor={accentColor}
                textClassName="font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest"
              />
            </div>
          </div>

          {/* INTEGRATED COMPACT LIVE PROGRESS BAR & BADGE */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {badge && (
              <div 
                className="hidden sm:flex items-center gap-1.5 font-bold px-2 py-0.5 rounded-none border text-[9px] sm:text-[10px]"
                style={{ 
                  borderColor: `${accentColor}55`, 
                  backgroundColor: `${accentColor}15`,
                  color: accentColor 
                }}
              >
                <ShieldCheck className="w-3 h-3" />
                <span className="truncate">{badge}</span>
              </div>
            )}

            {/* COMPACT PROGRESS BAR ON ITS LINE */}
            <div className="flex items-center gap-2 bg-white px-2.5 py-1 border border-black/20 rounded-none shadow-xs">
              <span className="text-[9px] text-[#666666] font-bold hidden xs:inline">PROGRESS</span>
              <div className="w-12 sm:w-20 md:w-28 h-1.5 bg-black/10 overflow-hidden relative border border-black/15">
                <div
                  className="h-full transition-all duration-150"
                  style={{
                    width: `${Math.max(4, progress)}%`,
                    backgroundColor: accentColor,
                    boxShadow: `0 0 6px ${accentColor}`,
                  }}
                />
              </div>
              <span
                className="font-mono text-[10px] sm:text-[11px] font-bold min-w-[28px] text-right"
                style={{ color: accentColor }}
              >
                {progress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION TITLE & TYPOGRAPHY ROW */}
      <div className="space-y-3 px-2 sm:px-0">
        {striped ? (
          <div className="w-full relative">
            <StripedTypography text={title} color={accentColor} progress={progress} isLightBg={true} />
          </div>
        ) : (
          <div className="py-1">
            <ProgressiveTextFill
              text={title}
              progress={progress}
              accentColor={accentColor}
              textClassName="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight uppercase leading-none"
            />
          </div>
        )}

        {/* SUBTITLE IF PROVIDED */}
        {subtitle && (
          <div className="border-l-2 pl-3 py-0.5 font-mono text-xs text-[#444444]" style={{ borderColor: accentColor }}>
            <p className="font-sans text-xs sm:text-sm text-[#444444] font-normal leading-relaxed">
              {subtitle}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


