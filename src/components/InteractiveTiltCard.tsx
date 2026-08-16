import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { gsap } from '../lib/gsap';

interface InteractiveTiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  magneticStrength?: number;
  glareOpacity?: number;
  onClick?: () => void;
}

export const InteractiveTiltCard: React.FC<InteractiveTiltCardProps> = ({
  children,
  className = '',
  maxTilt = 12,
  magneticStrength = 0.25,
  glareOpacity = 0.25,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const rafIdRef = useRef<number | null>(null);

  const applyTilt = (clientX: number, clientY: number, isTouch = false) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const effectiveTilt = isTouch ? maxTilt * 0.85 : maxTilt;
    const rotateX = ((y - centerY) / centerY) * -effectiveTilt;
    const rotateY = ((x - centerX) / centerX) * effectiveTilt;

    const magX = (x - centerX) * (isTouch ? magneticStrength * 0.5 : magneticStrength);
    const magY = (y - centerY) * (isTouch ? magneticStrength * 0.5 : magneticStrength);

    if (rafIdRef.current !== null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;

      if (wrapperRef.current && !isTouch) {
        gsap.to(wrapperRef.current, {
          x: magX,
          y: magY,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }

      setTilt({ x: rotateX, y: rotateY });
      setGlarePosition({
        x: Math.max(0, Math.min(100, (x / rect.width) * 100)),
        y: Math.max(0, Math.min(100, (y / rect.height) * 100)),
        opacity: glareOpacity,
      });
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    applyTilt(e.clientX, e.clientY, false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      applyTilt(e.touches[0].clientX, e.touches[0].clientY, true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      applyTilt(e.touches[0].clientX, e.touches[0].clientY, true);
    }
  };

  const resetTilt = () => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    if (wrapperRef.current) {
      gsap.to(wrapperRef.current, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      });
    }
    setTilt({ x: 0, y: 0 });
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleMouseLeave = () => {
    resetTilt();
  };

  const handleTouchEnd = () => {
    resetTilt();
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative gpu-layer ${className}`}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onClick={onClick}
        className="relative [perspective:1000px] w-full h-full cursor-pointer touch-pan-y"
      >
        <motion.div
          animate={{
            rotateX: tilt.x,
            rotateY: tilt.y,
          }}
          transition={{
            type: 'spring',
            stiffness: 350,
            damping: 25,
            mass: 0.5,
          }}
          className="relative w-full h-full [transform-style:preserve-3d] rounded-sm overflow-hidden"
        >
          {/* Child Content */}
          <div className="relative z-10 w-full h-full [transform:translateZ(20px)] flex flex-col">
            {children}
          </div>

          {/* Dynamic Specular Glare Reflection Layer */}
          <div
            className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300 rounded-sm"
            style={{
              opacity: glarePosition.opacity,
              background: `radial-gradient(circle 300px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.35), transparent 70%)`,
              mixBlendMode: 'overlay',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

