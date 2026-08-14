import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Smooth springs for cursor positioning
  const mouseX = useSpring(-100, { damping: 25, stiffness: 300, mass: 0.2 });
  const mouseY = useSpring(-100, { damping: 25, stiffness: 300, mass: 0.2 });

  const hoverRef = React.useRef(false);
  const textRef = React.useRef('');

  useEffect(() => {
    const checkTouch = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      );
    };

    if (checkTouch()) {
      setIsTouchDevice(true);
      return;
    }

    const updateCursorState = (nextHover: boolean, nextText: string) => {
      if (hoverRef.current !== nextHover) {
        hoverRef.current = nextHover;
        setIsHovered(nextHover);
      }
      if (textRef.current !== nextText) {
        textRef.current = nextText;
        setCursorText(nextText);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) {
        updateCursorState(false, '');
        return;
      }

      // 1. Check for explicit data-cursor
      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const text = cursorTarget.getAttribute('data-cursor') || '';
        updateCursorState(true, text);
        return;
      }

      // 2. Check for image hover
      const imgTarget = target.closest('img, [data-cursor-image]');
      if (imgTarget) {
        updateCursorState(true, 'VIEW');
        return;
      }

      // 3. Check for general interactive elements
      const interactiveTarget = target.closest('a, button, input, textarea, select, [role="button"]');
      if (interactiveTarget) {
        const defaultText = interactiveTarget.tagName === 'A' ? 'OPEN' : '';
        updateCursorState(true, defaultText);
        return;
      }

      // Default state when over non-interactive elements
      updateCursorState(false, '');
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouchDevice || !isVisible) return null;

  const hasText = cursorText.trim().length > 0;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Cursor Badge / Ring */}
      <motion.div
        className={`fixed top-0 left-0 rounded-full flex items-center justify-center transition-colors duration-150 border ${
          hasText
            ? 'bg-white text-black border-white shadow-2xl px-3 py-1.5'
            : isHovered
            ? 'bg-white/20 border-white text-white backdrop-blur-sm'
            : 'bg-transparent border-white/40 text-transparent'
        }`}
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.85 : isHovered ? (hasText ? 1.15 : 1.4) : 1,
          width: hasText ? 'auto' : isHovered ? 40 : 20,
          height: hasText ? 28 : isHovered ? 40 : 20,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 28,
        }}
      >
        {hasText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-[10px] font-mono tracking-widest font-bold uppercase whitespace-nowrap leading-none px-1"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      {/* Tiny Precision Dot */}
      {!hasText && (
        <motion.div
          className={`fixed top-0 left-0 rounded-full transition-all duration-100 ${
            isHovered ? 'bg-emerald-400 w-1.5 h-1.5' : 'bg-white w-1 h-1'
          }`}
          style={{
            x: mouseX,
            y: mouseY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          animate={{
            scale: isClicking ? 1.5 : 1,
          }}
        />
      )}
    </div>
  );
};
