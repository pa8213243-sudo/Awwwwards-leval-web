import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

interface KineticStrokeFillProps {
  text: string;
  className?: string;
  highlightColor?: string;
}

export const KineticStrokeFill: React.FC<KineticStrokeFillProps> = ({
  text,
  className = '',
  highlightColor = '#10B981',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll('.kinetic-word');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        {
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.35)',
          opacity: 0.5,
          y: 20,
        },
        {
          color: '#FFFFFF',
          WebkitTextStroke: '0px transparent',
          opacity: 1,
          y: 0,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 35%',
            scrub: 0.8,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [text]);

  const wordsList = text.split(' ');

  return (
    <div
      ref={containerRef}
      className={`font-serif tracking-tight leading-none uppercase select-none ${className}`}
    >
      {wordsList.map((word, i) => (
        <span key={i} className="inline-block mr-[0.25em] kinetic-word transition-all">
          {word}
        </span>
      ))}
    </div>
  );
};

interface BrutalistMarqueeProps {
  items: string[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  bordered?: boolean;
}

export const BrutalistMarquee: React.FC<BrutalistMarqueeProps> = ({
  items,
  speed = 25,
  direction = 'left',
  className = '',
  bordered = true,
}) => {
  return (
    <div
      className={`relative w-full overflow-hidden whitespace-nowrap select-none py-3 ${
        bordered ? 'border-y border-white/10 bg-[#0A0A0E]/80 backdrop-blur-md' : ''
      } ${className}`}
    >
      <div
        className="inline-flex items-center gap-8 animate-marquee"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
        }}
      >
        {[...items, ...items, ...items, ...items].map((item, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-white/80 font-medium">
              {item}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400/80 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let initialRotateX = -20;
    let initialRotateY = 0;
    let initialY = 60;
    let initialX = 0;
    let transformOrigin = 'center bottom';

    if (direction === 'down') {
      initialRotateX = 20;
      initialY = -60;
      transformOrigin = 'center top';
    } else if (direction === 'left') {
      initialRotateX = 0;
      initialRotateY = 20;
      initialY = 0;
      initialX = 60;
      transformOrigin = 'right center';
    } else if (direction === 'right') {
      initialRotateX = 0;
      initialRotateY = -20;
      initialY = 0;
      initialX = -60;
      transformOrigin = 'left center';
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          rotateX: initialRotateX,
          rotateY: initialRotateY,
          x: initialX,
          y: initialY,
          z: -80,
          scale: 0.94,
          transformOrigin: transformOrigin,
        },
        {
          opacity: 1,
          rotateX: 0,
          rotateY: 0,
          x: 0,
          y: 0,
          z: 0,
          scale: 1,
          duration: 0.9,
          delay: delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay, direction]);

  return (
    <div
      ref={ref}
      className={`gpu-layer ${className}`}
      style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
};
