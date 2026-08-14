import React, { useRef, useEffect } from 'react';
import { gsap } from '../lib/gsap';

interface MagazineRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  triggerHook?: string;
}

export const MagazineReveal: React.FC<MagazineRevealProps> = ({
  children,
  delay = 0,
  duration = 0.85,
  yOffset = 40,
  className = '',
  triggerHook = 'top 88%',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: yOffset,
          scale: 0.98,
          transformOrigin: '50% 100%',
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: duration,
          delay: delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: triggerHook,
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay, duration, yOffset, triggerHook]);

  return (
    <div
      ref={containerRef}
      className={`will-change-[transform,opacity] ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
};
