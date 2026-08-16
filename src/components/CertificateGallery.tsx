import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  ExternalLink, 
  CheckCircle2, 
  Eye, 
  X, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight,
  RotateCcw,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { CERTIFICATIONS } from '../data/portfolioData';
import { Certification } from '../types';
import { SectionProgressHeader } from './SectionProgressHeader';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
import { StripedTypography } from './StripedTypography';
import { LazyRenderMedia } from './LazyRenderMedia';
import { SectionBackgroundLayer } from './SectionBackgroundLayer';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { soundFx } from '../lib/sound';

export const CertificateGallery: React.FC = () => {
  const [activeCertIdx, setActiveCertIdx] = useState<number>(0);
  const [modalCert, setModalCert] = useState<Certification | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const scrollTriggerRef = useRef<globalThis.ScrollTrigger | null>(null);

  const totalCerts = CERTIFICATIONS.length;
  const activeCert = CERTIFICATIONS[activeCertIdx] || CERTIFICATIONS[0];

  const handleNext = useCallback(() => {
    soundFx.playNav();
    setActiveCertIdx((prev) => (prev + 1) % totalCerts);
  }, [totalCerts]);

  const handlePrev = useCallback(() => {
    soundFx.playNav();
    setActiveCertIdx((prev) => (prev - 1 + totalCerts) % totalCerts);
  }, [totalCerts]);

  const handleSelectCert = (idx: number) => {
    soundFx.playNav();
    setActiveCertIdx(idx);

    const st = scrollTriggerRef.current;
    if (st) {
      const targetProgress = (idx + 0.15) / totalCerts;
      const targetScrollY = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      });
    }
  };

  const [dragOffset, setDragOffset] = useState<number>(0);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Pointer drag for 3D Orbit
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartXRef.current = e.clientX;
    isDraggingRef.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || dragStartXRef.current === null) return;
    const deltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 35) deltaX > 0 ? handlePrev() : handleNext();
    isDraggingRef.current = false;
    dragStartXRef.current = null;
    setDragOffset(0);
  };

  // Dedicated Mobile Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      dragStartXRef.current = e.touches[0].clientX;
      isDraggingRef.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDraggingRef.current && dragStartXRef.current !== null && e.touches.length > 0) {
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - dragStartXRef.current;
      setDragOffset(deltaX * 0.35);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || dragStartXRef.current === null) return;
    const touchEndX = e.changedTouches.length > 0 ? e.changedTouches[0].clientX : dragStartXRef.current;
    const deltaX = touchEndX - dragStartXRef.current;
    if (Math.abs(deltaX) > 35) {
      deltaX > 0 ? handlePrev() : handleNext();
    }
    isDraggingRef.current = false;
    dragStartXRef.current = null;
    setDragOffset(0);
  };

  // Pinned section ScrollTrigger
  useEffect(() => {
    const section = sectionRef.current;
    const pinContainer = pinContainerRef.current;
    if (!section || !pinContainer) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    const ctx = gsap.context(() => {
      if (!isMobile) {
        const pinSpan = `${totalCerts * 85}vh`;

        const st = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: `+=${pinSpan}`,
          pin: pinContainer,
          pinSpacing: true,
          pinType: 'fixed',
          scrub: 0.35,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const prog = Math.min(1, Math.max(0, self.progress));
            setScrollProgress(Math.round(prog * 100));

            const rawIdx = Math.floor(prog * totalCerts);
            const safeIdx = Math.min(totalCerts - 1, Math.max(0, rawIdx));

            setActiveCertIdx((prev) => {
              if (safeIdx !== prev) {
                soundFx.triggerSectionMilestone('certs', safeIdx, 480 + safeIdx * 50);
                return safeIdx;
              }
              return prev;
            });
          },
        });

        scrollTriggerRef.current = st;
      } else {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 0.2,
          onUpdate: (self) => {
            setScrollProgress(Math.round(self.progress * 100));
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [totalCerts]);

  return (
    <section
      ref={sectionRef}
      id="certs"
      aria-label="Verified Credentials and Licenses"
      className="relative w-full min-h-screen bg-[#F3F2EE] text-[#111116] border-b border-black/10 select-none overflow-hidden"
    >
      {/* CONTEXTUAL PROFESSIONAL BACKGROUND PHOTO */}
      <SectionBackgroundLayer sectionKey="certs" opacity={0.18} />

      {/* SECTION-LOCAL STICKY PROGRESS INDICATOR (FIX 7: Sticks ONLY inside this section) */}
      <VerticalSectionProgressBar
        targetId="certs"
        accentColor="#10B981"
        label="CERTS"
        sectionCode="10"
        isLightBg={true}
      />

      {/* PINNED VIEWPORT CONTAINER */}
      <div
        ref={pinContainerRef}
        className="w-full min-h-screen lg:h-screen relative flex flex-col justify-between pt-6 sm:pt-8 md:pt-10 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
      >
        {/* TOP STATUS HUD */}
        <div className="flex items-center justify-between border-b border-black/15 pb-2.5 w-full flex-shrink-0">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>[SCENE 10 // VERIFIED CREDENTIALS & 3D ORBIT]</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase text-[#666666] font-bold">
              CREDENTIAL 0{activeCertIdx + 1} OF 0{totalCerts}
            </span>
            <div className="w-20 sm:w-24 h-1.5 bg-black/10 rounded-none overflow-hidden border border-black/20">
              <div
                className="h-full bg-emerald-600 transition-all duration-150"
                style={{ width: `${Math.max(10, ((activeCertIdx + 1) / totalCerts) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── MAIN STAGE: VERTICAL SPINE + 3D ORBIT CAROUSEL + ACTIVE DETAIL PANEL ── */}
        <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-6 md:gap-8 my-auto py-2 w-full">
          
          {/* LEFT VERTICAL SECTION SPINE */}
          <div className="hidden lg:flex flex-col items-center justify-between py-4 px-2 bg-transparent min-h-[480px] max-h-[620px] flex-shrink-0 z-20 w-24 md:w-28 relative">
            <div className="flex-1 w-full flex items-center justify-center overflow-visible py-1 my-2">
              <StripedTypography
                text="credentials"
                progress={Math.round(((activeCertIdx + 1) / totalCerts) * 100)}
                color="#10B981"
                isVertical={true}
                isLightBg={true}
                className="w-full h-full min-h-[420px]"
              />
            </div>

            <div className="flex flex-col items-center gap-1.5 pt-3 border-t border-black/15 font-mono text-[9px] w-full mt-2">
              <div className="w-1.5 h-12 bg-black/10 overflow-hidden relative">
                <div
                  className="w-full transition-all duration-150 absolute bottom-0 left-0 right-0"
                  style={{
                    height: `${Math.max(10, ((activeCertIdx + 1) / totalCerts) * 100)}%`,
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 6px rgba(16,185,129,0.6)',
                  }}
                />
              </div>
              <span className="font-bold text-[9px] text-emerald-800">
                {Math.round(((activeCertIdx + 1) / totalCerts) * 100)}%
              </span>
            </div>
          </div>

          {/* RIGHT 3D ORBIT CAROUSEL & DETAIL CARD STAGE */}
          <div className="flex-1 flex flex-col justify-between w-full h-full min-h-[520px]">
            
            {/* ── 3D CREDENTIAL ORBIT VIEWPORT ─────────────────────────── */}
            <div
              className="relative w-full h-[220px] sm:h-[250px] md:h-[270px] flex items-center justify-center [perspective:1400px] overflow-hidden select-none cursor-grab active:cursor-grabbing border-b border-black/10 pb-2 touch-pan-y"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
            >
              {/* Elliptical Orbit Wireframe Guide */}
              <div className="absolute w-[450px] sm:w-[700px] h-[100px] border border-black/10 rounded-[100%] [transform:rotateX(72deg)_translateZ(-60px)] pointer-events-none opacity-40" />

              {CERTIFICATIONS.map((cert, idx) => {
                const offset = (idx - activeCertIdx + totalCerts) % totalCerts;
                let relativePos = offset;
                if (relativePos > totalCerts / 2) relativePos = relativePos - totalCerts;

                const isActive = relativePos === 0;
                const isAdjacent = Math.abs(relativePos) === 1;
                const isVisible = Math.abs(relativePos) <= 2;

                if (!isVisible) return null;

                const baseSpacing = typeof window !== 'undefined' && window.innerWidth < 640 ? 115 : 220;
                const translateX = relativePos * baseSpacing + (isActive ? dragOffset : dragOffset * 0.4);
                const translateZ = isActive ? 90 : isAdjacent ? -40 : -160;
                const rotateY = -relativePos * 22;
                const scale = isActive ? 1 : isAdjacent ? 0.82 : 0.65;
                const opacity = isActive ? 1 : isAdjacent ? 0.65 : 0.25;
                const zIndex = 20 - Math.abs(relativePos);

                return (
                  <motion.div
                    key={cert.id}
                    className="absolute w-[75%] max-w-[280px] sm:max-w-[340px] h-[170px] sm:h-[200px] rounded-none cursor-pointer [transform-style:preserve-3d] group"
                    style={{ zIndex, willChange: 'transform, opacity' }}
                    animate={{ x: translateX, z: translateZ, rotateY, scale, opacity }}
                    transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.8 }}
                    onClick={() => {
                      if (!isActive) {
                        handleSelectCert(idx);
                      } else {
                        soundFx.playClick();
                        setModalCert(cert);
                      }
                    }}
                  >
                    <div
                      className={`relative w-full h-full rounded-none flex flex-col overflow-hidden bg-white transition-all duration-300 ${
                        isActive
                          ? 'border-2 border-emerald-600 shadow-[0_15px_35px_rgba(0,0,0,0.15),0_0_20px_rgba(16,185,129,0.2)]'
                          : 'border-2 border-dashed border-black/20 shadow-md'
                      }`}
                    >
                      <img
                        src={cert.badgeImage}
                        alt={cert.title}
                        className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                      
                      {/* Badge Ribbon */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600 text-white font-mono text-[8.5px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>0{idx + 1}. VERIFIED</span>
                      </div>

                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between font-mono text-[9px] text-white">
                        <span className="bg-black/80 px-2 py-0.5 font-bold truncate max-w-[140px]">{cert.issuer}</span>
                        <span className="bg-emerald-700 px-2 py-0.5 font-bold">{cert.date}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ── ACTIVE CREDENTIAL DETAIL CONTAINER (Matching Work 3D Design) ── */}
            <div className="flex-1 mt-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCert.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full bg-white border-2 border-dashed border-black/25 p-4 sm:p-6 shadow-md relative text-[#111116] flex flex-col justify-between"
                >
                  <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-emerald-600" />
                  <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-emerald-600" />

                  {/* Top Meta Bar */}
                  <div className="flex items-start justify-between border-b border-black/10 pb-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono text-[9.5px] font-bold uppercase">
                          CREDENTIAL 0{activeCertIdx + 1}
                        </span>
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-800">
                          {activeCert.issuer}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#111116] mt-1">
                        {activeCert.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => setModalCert(activeCert)}
                      className="px-3 py-1 bg-emerald-50 border border-emerald-500/40 text-emerald-800 font-mono text-[10px] font-bold uppercase hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>INSPECT PROOF</span>
                    </button>
                  </div>

                  {/* Skills Verified Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 my-2">
                    {activeCert.skillsVerified.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className="px-3 py-2 bg-[#F7F7F4] border border-black/10 font-mono text-[11px] text-[#222222] font-semibold flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{skill}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Navigation & Authentication */}
                  <div className="pt-3 border-t border-black/10 mt-2 flex items-center justify-between font-mono text-[10px] uppercase">
                    <span className="text-[#666666] truncate max-w-[180px] sm:max-w-none">
                      {activeCert.credentialId ? `ID: ${activeCert.credentialId}` : 'IMA / MS VERIFIED AUDIT'}
                    </span>
                    
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePrev}
                          className="px-3 py-1 bg-white hover:bg-black hover:text-white border border-black/20 font-bold uppercase transition-all cursor-pointer flex items-center gap-1"
                        >
                          <ArrowLeft className="w-3 h-3" />
                          <span>PREV</span>
                        </button>
                        <button
                          onClick={handleNext}
                          className="px-3 py-1 bg-emerald-600 text-white hover:bg-black border border-emerald-600 font-bold uppercase transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <span>NEXT</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Direct LinkedIn Certificate Verification Link */}
                      <a
                        href="https://www.linkedin.com/in/parvej-alam-sulemanali-ansari-14808928b/details/certifications/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9.5px] font-mono text-emerald-800 hover:text-black font-bold uppercase flex items-center gap-1 hover:underline transition-all mt-0.5"
                        title="Verify certifications on LinkedIn"
                      >
                        <span>VERIFY ON LINKEDIN</span>
                        <ExternalLink className="w-3 h-3 text-emerald-600" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* BOTTOM HUD */}
        <div className="flex items-center justify-between border-t border-black/15 pt-2.5 w-full flex-shrink-0 font-mono text-[9px] text-[#666666] uppercase">
          <div className="flex items-center gap-3">
            <span className="font-bold text-emerald-800">IMA USA & MICROSOFT PL-300 RECONCILED</span>
            <span>•</span>
            <span>DRAG OR SCROLL 3D ORBIT CAROUSEL</span>
          </div>
          <div className="flex items-center gap-2">
            <span>SHOWING 0{activeCertIdx + 1} / 0{totalCerts} LICENSES</span>
          </div>
        </div>
      </div>

      {/* ── FULL INSPECTION MODAL ─────────────────────────────────────── */}
      <AnimatePresence>
        {modalCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setModalCert(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border-2 border-black max-w-2xl w-full p-6 relative shadow-2xl"
            >
              <button
                onClick={() => setModalCert(null)}
                className="absolute top-4 right-4 p-1.5 bg-black/5 hover:bg-black hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase text-emerald-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>OFFICIAL VERIFIED CREDENTIAL</span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#111116] uppercase mb-1">
                {modalCert.title}
              </h3>
              <p className="font-mono text-xs uppercase text-emerald-800 font-bold mb-4">
                {modalCert.issuer} // {modalCert.date}
              </p>

              <div className="w-full h-64 border border-black/20 overflow-hidden mb-4 bg-neutral-100">
                <img
                  src={modalCert.badgeImage}
                  alt={modalCert.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 mb-4">
                <span className="font-mono text-[10px] uppercase text-[#666666] font-bold block">
                  VERIFIED COMPETENCIES:
                </span>
                <div className="flex flex-wrap gap-2">
                  {modalCert.skillsVerified.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-[#F4F1EA] text-[#222222] border border-black/15 font-mono text-[10px] font-bold"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-black/15 flex items-center justify-between font-mono text-xs">
                <span className="text-[#666666]">
                  {modalCert.credentialId ? `ID: ${modalCert.credentialId}` : 'IMA / MS CERTIFIED'}
                </span>
                {modalCert.credentialUrl && (
                  <a
                    href={modalCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 text-white font-bold uppercase hover:bg-black transition-colors flex items-center gap-1.5"
                  >
                    <span>EXTERNAL VERIFY</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
