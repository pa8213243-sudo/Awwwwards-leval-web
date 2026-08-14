import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

interface FerrisWheelSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export const FerrisWheelSection: React.FC<FerrisWheelSectionProps> = ({
  children,
  id,
  className = '',
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    const section = sectionRef.current;
    if (!el || !section) return;

    const ctx = gsap.context(() => {
      // Set initial 3D perspective
      gsap.set(el, {
        transformStyle: 'preserve-3d',
        perspective: 1200,
      });

      // Ferris Wheel curve-in as section enters from bottom
      gsap.fromTo(
        el,
        {
          opacity: 0,
          rotateX: -26,
          y: 90,
          z: -120,
          scale: 0.92,
          transformOrigin: 'center bottom',
        },
        {
          opacity: 1,
          rotateX: 0,
          y: 0,
          z: 0,
          scale: 1,
          duration: 1.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 88%',
            end: 'top 25%',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }
      );

      // Ferris Wheel curve-out as section exits towards top
      gsap.to(el, {
        opacity: 0.25,
        rotateX: 26,
        y: -90,
        z: -120,
        scale: 0.92,
        transformOrigin: 'center top',
        ease: 'power2.in',
        scrollTrigger: {
          trigger: section,
          start: 'bottom 55%',
          end: 'bottom top',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} id={id} className={`relative overflow-hidden ${className}`}>
      <div
        ref={contentRef}
        className="w-full h-full gpu-layer"
        style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
      >
        {children}
      </div>
    </div>
  );
};
