import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ExternalLink, CheckCircle2, Eye, X, ShieldCheck } from 'lucide-react';
import { CERTIFICATIONS } from '../data/portfolioData';
import { Certification } from '../types';
import { SectionProgressHeader } from './SectionProgressHeader';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
import { ProgressiveTextFill } from './ProgressiveTextFill';
import { StripedTypography } from './StripedTypography';
import { ScrollReveal } from './KineticTypography';
import { LazyRenderMedia } from './LazyRenderMedia';
import { SectionBackgroundLayer } from './SectionBackgroundLayer';
import { gsap, ScrollTrigger } from '../lib/gsap';

export const CertificateGallery: React.FC = () => {
  const [activeCert, setActiveCert] = useState<Certification | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        end: 'bottom 15%',
        scrub: 0.2,
        onUpdate: (self) => {
          setScrollProgress(Math.round(self.progress * 100));
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="certs" 
      className="relative py-12 md:py-16 border-b border-white/10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 bg-[#0A0A0E] text-white select-none space-y-6 overflow-hidden"
    >
      {/* CONTEXTUAL PROFESSIONAL BACKGROUND PHOTO */}
      <SectionBackgroundLayer sectionKey="certs" opacity={0.4} />

      {/* ELEGANT FIXED VERTICAL PROGRESS BAR ON RIGHT EDGE */}
      <VerticalSectionProgressBar targetId="certs" accentColor="#10B981" label="CERTS" sectionCode="10" />

      {/* SECTION PROGRESS HEADER */}
      <SectionProgressHeader
        sceneCode="[SCENE 10 // VERIFIED CREDENTIALS & CERTIFICATIONS]"
        title="CREDENTIALS"
        subtitle="Institutional Licenses, Merit Badges & Professional IMA / Corporate Authentications"
        badge="CMA USA VERIFIED"
        accentColor="#10B981"
        sectionId="certs"
        isSticky={true}
      />

      <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-6">
        
        {/* LEFT VERTICAL SECTION SPINE (Vertical Typography) */}
        <div className="hidden md:flex flex-col items-center justify-between py-4 px-2.5 bg-black/85 border border-emerald-500/35 backdrop-blur-md flex-shrink-0 z-20 shadow-2xl">
          {/* Vertical Striped Typography */}
          <div className="w-12 h-44 flex items-center justify-center overflow-hidden">
            <StripedTypography
              text="licenses"
              progress={scrollProgress}
              color="#10B981"
              isVertical={true}
              className="w-full h-full"
            />
          </div>

          <div className="flex flex-col items-center gap-2 my-auto py-2">
            <div className="w-[1px] h-6 bg-gradient-to-b from-transparent via-emerald-500/50 to-emerald-500" />
            <div className="w-6 h-6 flex items-center justify-center font-mono text-[10px] font-bold border border-emerald-400 bg-emerald-950/80 text-emerald-300">
              04
            </div>
            <div className="w-[1px] h-6 bg-gradient-to-b from-emerald-500 via-emerald-500/50 to-transparent" />
          </div>

          <div className="flex flex-col items-center gap-1 pt-1.5 border-t border-white/10 font-mono text-[9px]">
            <div className="w-1.5 h-10 bg-white/15 overflow-hidden relative">
              <div
                className="w-full transition-all duration-150 absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.max(4, scrollProgress)}%`,
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 6px #10B981',
                }}
              />
            </div>
            <span className="font-bold text-[9px] text-emerald-400">
              {scrollProgress}%
            </span>
          </div>
        </div>

        {/* MAIN CERTIFICATES GRID */}
        <div className="flex-1 space-y-6">
          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {CERTIFICATIONS.map((cert, idx) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  onClick={() => setActiveCert(cert)}
                  className="p-4 sm:p-5 border border-white/15 bg-[#111116] hover:border-emerald-400 transition-all cursor-pointer group flex flex-col justify-between rounded-none overflow-hidden shadow-xl"
                  data-cursor="INSPECT"
                >
                  <div>
                    {/* CERTIFICATE PHOTO BADGE */}
                    <div className="relative aspect-[16/9] w-full mb-3.5 rounded-none overflow-hidden border border-white/15 bg-black">
                      <LazyRenderMedia
                        src={cert.badgeImage}
                        alt={cert.title}
                        aspectRatio="aspect-[16/9]"
                        accentColor="#10B981"
                        mediaClassName="group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-15" />
                      <div className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-[9px] font-bold uppercase rounded-none flex items-center gap-1 backdrop-blur-md pointer-events-none">
                        <ShieldCheck className="w-3 h-3" />
                        <span>VERIFIED</span>
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between font-mono text-[9px] text-white/90 pointer-events-none">
                        <span className="bg-black/80 px-2 py-0.5 rounded-none border border-white/20 font-bold">{cert.issuer}</span>
                        <span className="bg-black/80 px-2 py-0.5 rounded-none border border-white/20 font-bold">{cert.date}</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl text-white font-bold group-hover:text-emerald-400 transition-colors">
                      {cert.title}
                    </h3>
                    <div className="text-[11px] font-mono uppercase text-emerald-400 font-bold mt-0.5 mb-3">
                      {cert.issuer}
                    </div>

                    <div className="space-y-1 mb-4">
                      {cert.skillsVerified.map((skill, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] font-mono text-white/80 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[11px]">
                    <span className="text-white/50">
                      {cert.credentialId ? `ID: ${cert.credentialId.slice(0, 14)}...` : 'IMA / MS VERIFIED'}
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>INSPECT</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          {/* LinkedIn Certifications Global Button */}
          <div className="p-4 sm:p-5 border border-white/15 bg-[#111116] shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="font-serif text-base sm:text-lg text-white font-bold">VIEW FULL LINKEDIN CERTIFICATIONS PROFILE</h4>
              <p className="text-[11px] font-mono text-white/60 font-medium mt-0.5">
                Access complete verified credential history on Parvej Alam's official LinkedIn profile
              </p>
            </div>
            <a
              href="https://www.linkedin.com/in/parvej-alam-sulemanali-ansari-14808928/details/certifications/"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[11px] uppercase tracking-widest font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer shadow-xs"
              data-cursor="OPEN"
            >
              <span>VIEW ALL CERTIFICATIONS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeCert && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-2xl bg-[#FFFFFF] border-2 border-black text-[#111116] rounded-none overflow-hidden p-5 md:p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-black/15 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-mono text-emerald-800 font-bold uppercase">OFFICIAL CREDENTIAL VERIFICATION</span>
                </div>
                <button
                  onClick={() => setActiveCert(null)}
                  className="p-1 border border-black/20 hover:border-black text-[#111116] rounded-none transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative aspect-[16/9] overflow-hidden border border-black/15 rounded-none bg-[#111116]">
                <LazyRenderMedia
                  src={activeCert.badgeImage}
                  alt={activeCert.title}
                  aspectRatio="aspect-[16/9]"
                  accentColor="#10B981"
                />
              </div>

              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-[#111116] font-bold">{activeCert.title}</h3>
                <p className="text-xs font-mono uppercase text-[#555562] font-semibold mt-0.5">
                  ISSUED BY: {activeCert.issuer} • DATE: {activeCert.date}
                </p>
                {activeCert.credentialId && (
                  <p className="text-[11px] font-mono text-emerald-800 font-bold mt-0.5">
                    CREDENTIAL ID: {activeCert.credentialId}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-black/15 pt-3">
                <a
                  href={activeCert.verifiedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-2.5 px-5 bg-[#111116] text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-black transition-all cursor-pointer shadow-md"
                >
                  <span>VERIFY ON INSTITUTION WEBSITE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setActiveCert(null)}
                  className="w-full sm:w-auto py-2.5 px-5 border border-black/20 text-[#111116] font-mono text-xs uppercase tracking-widest font-bold hover:bg-[#F8F6F0] transition-all text-center cursor-pointer"
                >
                  CLOSE PREVIEW
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};


