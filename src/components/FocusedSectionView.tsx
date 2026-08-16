import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Home,
  TrendingUp,
  Target,
  BarChart3,
  Shield,
  BookOpen,
  Award,
  Clock,
  Code2,
  Mail,
  DollarSign,
  Lightbulb,
  Briefcase,
  LineChart,
  Sparkles
} from 'lucide-react';
import { soundFx } from '../lib/sound';
import { ScrollTrigger } from '../lib/gsap';

// Section components
import { KineticTypographySection } from './KineticTypographySection';
import { ChapterTimeline } from './ChapterTimeline';
import { WorkSection } from './WorkSection';
import { FinancialSandbox } from './FinancialSandbox';
import { PricingSection } from './PricingSection';
import { AnalyticsShowcase } from './AnalyticsShowcase';
import { CoreValuesSection } from './CoreValuesSection';
import { AboutSection } from './AboutSection';
import { ExperienceTimeline } from './ExperienceTimeline';
import { SkillsSection } from './SkillsSection';
import { CertificateGallery } from './CertificateGallery';
import { ProcessSection } from './ProcessSection';
import { ContactSection } from './ContactSection';

export interface FocusedSectionMeta {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  accentColor: string;
  icon: React.ReactNode;
  motionQuote: string;
  category: string;
}

export const FOCUSED_SECTIONS: FocusedSectionMeta[] = [
  { id: 'manifesto', number: '02', title: 'EXECUTIVE MANIFESTO', subtitle: 'FINANCIAL PRECISION OVER VOLUME', accentColor: '#E0533C', icon: <Lightbulb className="w-8 h-8" />, motionQuote: 'Every number earns its place.', category: 'CORE PHILOSOPHY' },
  { id: 'chapters', number: '03', title: 'CHRONOLOGY TIMELINE', subtitle: 'CAREER EVOLUTION & MILESTONES', accentColor: '#E0533C', icon: <Clock className="w-8 h-8" />, motionQuote: 'Time reveals the trajectory.', category: 'CAREER ROADMAP' },
  { id: 'work', number: '04', title: 'SELECTED WORK', subtitle: 'HIGH-STAKES FINANCIAL MODELS & DECKS', accentColor: '#1D4ED8', icon: <Briefcase className="w-8 h-8" />, motionQuote: 'Models that move markets.', category: 'PORTFOLIO ARTIFACTS' },
  { id: 'sandbox', number: '05', title: 'VALUATION LAB', subtitle: 'DCF & MARGINAL COSTING SANDBOX', accentColor: '#E0533C', icon: <LineChart className="w-8 h-8" />, motionQuote: 'Stress-test every assumption.', category: 'FINANCIAL SIMULATION' },
  { id: 'pricing', number: '06', title: 'PRICING & ENGAGEMENT', subtitle: 'CONTRACT & CONSULTING FRAMEWORKS', accentColor: '#E0533C', icon: <DollarSign className="w-8 h-8" />, motionQuote: 'Value defined, delivered.', category: 'ENGAGEMENT MODELS' },
  { id: 'dashboards', number: '07', title: 'TELEMETRY & DAX', subtitle: 'POWER BI STAR SCHEMA ARCHITECTURE', accentColor: '#3B82F6', icon: <BarChart3 className="w-8 h-8" />, motionQuote: 'Data speaks in patterns.', category: 'DATA INTELLIGENCE' },
  { id: 'values', number: '08', title: 'CORE VALUES & FRAMEWORK', subtitle: 'IMA ETHICAL & ANALYTICAL INTEGRITY', accentColor: '#10B981', icon: <Shield className="w-8 h-8" />, motionQuote: 'Integrity is non-negotiable.', category: 'ETHICAL FOUNDATION' },
  { id: 'about', number: '09', title: 'PHILOSOPHY & ABOUT', subtitle: 'LEADERSHIP, ADVISORY & BACKGROUND', accentColor: '#E0533C', icon: <BookOpen className="w-8 h-8" />, motionQuote: 'The mind behind the models.', category: 'EXECUTIVE PROFILE' },
  { id: 'experience', number: '10', title: 'CAREER CHRONOLOGY', subtitle: 'CMA USA & FP&A EXPERTISE', accentColor: '#10B981', icon: <TrendingUp className="w-8 h-8" />, motionQuote: 'Growth compounding over time.', category: 'PROFESSIONAL TRACK' },
  { id: 'skills', number: '11', title: 'SKILL ARCHITECTURE', subtitle: 'FINANCIAL TOOLS & CODE TELEMETRY', accentColor: '#10B981', icon: <Code2 className="w-8 h-8" />, motionQuote: 'Precision-engineered competencies.', category: 'COMPETENCY MATRIX' },
  { id: 'certs', number: '12', title: 'CREDENTIALS & CERTS', subtitle: 'VERIFIED LICENSES & EXAMS', accentColor: '#F59E0B', icon: <Award className="w-8 h-8" />, motionQuote: 'Earned. Verified. Trusted.', category: 'ACCREDITATIONS' },
  { id: 'process', number: '13', title: '5-STAGE METHODOLOGY', subtitle: 'SYSTEMATIC EXECUTION BLUEPRINT', accentColor: '#E0533C', icon: <Target className="w-8 h-8" />, motionQuote: 'From chaos to clarity.', category: 'EXECUTION PROTOCOL' },
  { id: 'contact', number: '14', title: 'CONTACT & INITIATION', subtitle: 'DIRECT EXECUTIVE COMMUNICATIONS', accentColor: '#10B981', icon: <Mail className="w-8 h-8" />, motionQuote: 'The conversation starts now.', category: 'DIRECT INITIATION' },
];

// ─── CINEMATIC SECTION ENTRANCE INTRO OVERLAY (Optimized for Mobile & Desktop) ───
const SectionEntranceCurtain: React.FC<{
  meta: FocusedSectionMeta;
  onComplete: () => void;
}> = ({ meta, onComplete }) => {
  useEffect(() => {
    soundFx.playMilestone(520);
    const timer = setTimeout(() => {
      onComplete();
    }, 1250);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0C0C11] text-white select-none pointer-events-none px-4 overflow-hidden gpu-layer"
    >
      {/* Background radial glow */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          background: `radial-gradient(circle at center, ${meta.accentColor} 0%, transparent 65%)`
        }}
      />

      {/* Grid line pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Ultra-large chapter watermark (responsive font size) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute font-mono font-black text-[150px] sm:text-[240px] md:text-[320px] tracking-tighter select-none pointer-events-none leading-none"
        style={{ color: meta.accentColor }}
      >
        {meta.number}
      </motion.div>

      {/* Center Cinematic Card */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-xl space-y-3 sm:space-y-4">
        {/* Animated Glowing Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
          className="inline-flex items-center justify-center p-3 sm:p-4 rounded-xl shadow-2xl border border-white/20"
          style={{ backgroundColor: `${meta.accentColor}22`, borderColor: `${meta.accentColor}66`, color: meta.accentColor }}
        >
          {meta.icon}
        </motion.div>

        {/* Chapter Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
          className="flex items-center justify-center gap-2"
        >
          <span 
            className="text-[9px] sm:text-xs font-mono font-bold px-2.5 py-1 tracking-widest uppercase text-white rounded-xs shadow-sm"
            style={{ backgroundColor: meta.accentColor }}
          >
            CHAPTER {meta.number} // {meta.category}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
          className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight uppercase"
        >
          {meta.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="text-[11px] sm:text-sm font-mono tracking-widest text-neutral-400 uppercase"
        >
          {meta.subtitle}
        </motion.p>

        {/* Animated Divider */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "70px" }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="h-[2px] mx-auto rounded-full"
          style={{ backgroundColor: meta.accentColor }}
        />

        {/* Motion Quote */}
        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.38 }}
          className="font-sans italic text-xs sm:text-sm text-neutral-300 pt-0.5 line-clamp-2"
        >
          "{meta.motionQuote}"
        </motion.p>

        {/* Loading Pip Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex items-center justify-center gap-1.5 pt-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: meta.accentColor }} />
          <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-neutral-500 uppercase">INITIALIZING CHAPTER</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

interface FocusedSectionViewProps {
  sectionId: string;
  onBackToPortfolio: () => void;
  onNavigateSection: (nextSectionId: string) => void;
  onCopyEmail?: () => void;
  theme?: 'dark' | 'light';
}

export const FocusedSectionView: React.FC<FocusedSectionViewProps> = ({
  sectionId,
  onBackToPortfolio,
  onNavigateSection,
  onCopyEmail,
  theme = 'dark'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showEntranceIntro, setShowEntranceIntro] = useState(true);

  const currentIndex = FOCUSED_SECTIONS.findIndex((s) => s.id === sectionId);
  const currentMeta = currentIndex >= 0 ? FOCUSED_SECTIONS[currentIndex] : FOCUSED_SECTIONS[0];
  const prevMeta = currentIndex > 0 ? FOCUSED_SECTIONS[currentIndex - 1] : null;
  const nextMeta = currentIndex < FOCUSED_SECTIONS.length - 1 ? FOCUSED_SECTIONS[currentIndex + 1] : null;

  // On every section change (or first open), show entrance animation
  useEffect(() => {
    setShowEntranceIntro(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [sectionId]);

  // When entrance intro completes, refresh ScrollTrigger for exact pinning
  const handleIntroComplete = () => {
    setShowEntranceIntro(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 40);
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 250);
  };

  // Keyboard shortcut listener (ESC to go back, Alt+Left/Right arrow for prev/next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        soundFx.playToggle(false);
        onBackToPortfolio();
      } else if (e.altKey && e.key === 'ArrowLeft' && prevMeta) {
        e.preventDefault();
        soundFx.playNav();
        onNavigateSection(prevMeta.id);
      } else if (e.altKey && e.key === 'ArrowRight' && nextMeta) {
        e.preventDefault();
        soundFx.playNav();
        onNavigateSection(nextMeta.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBackToPortfolio, onNavigateSection, prevMeta, nextMeta]);

  // Render the selected isolated section component
  const renderSectionComponent = () => {
    switch (sectionId) {
      case 'manifesto':
        return <KineticTypographySection />;
      case 'chapters':
        return <ChapterTimeline />;
      case 'work':
        return <WorkSection onContact={() => onNavigateSection('contact')} />;
      case 'sandbox':
        return <FinancialSandbox />;
      case 'pricing':
        return <PricingSection onContact={() => onNavigateSection('contact')} />;
      case 'dashboards':
        return <AnalyticsShowcase />;
      case 'values':
        return <CoreValuesSection />;
      case 'about':
        return <AboutSection />;
      case 'experience':
        return <ExperienceTimeline />;
      case 'skills':
        return <SkillsSection />;
      case 'certs':
        return <CertificateGallery />;
      case 'process':
        return <ProcessSection />;
      case 'contact':
        return <ContactSection onCopyEmail={onCopyEmail || (() => {})} />;
      default:
        return (
          <div className="py-32 text-center text-[#111116]">
            <h2 className="font-serif text-3xl font-bold mb-4">SECTION STANDALONE VIEW</h2>
            <p className="font-mono text-sm text-gray-600 mb-8">Selected chapter is loaded in focused mode.</p>
            <button
              onClick={onBackToPortfolio}
              className="px-6 py-3 bg-[#E0533C] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-lg"
            >
              ← RETURN TO FULL PORTFOLIO
            </button>
          </div>
        );
    }
  };

  return (
    <>
      {/* ─── FULLSCREEN CINEMATIC ENTRANCE OVERLAY (Runs on every section entry & switch) ─── */}
      <AnimatePresence>
        {showEntranceIntro && (
          <SectionEntranceCurtain
            key={`entrance-${sectionId}`}
            meta={currentMeta}
            onComplete={handleIntroComplete}
          />
        )}
      </AnimatePresence>

      <div 
        ref={containerRef}
        className="min-h-screen bg-[#F3F2EE] text-[#111116] relative selection:bg-[#E0533C] selection:text-white overflow-x-hidden"
      >
        {/* STICKY TOP CHAPTER HUD HEADER (Mobile Optimized) */}
        <header
          className="sticky top-0 left-0 right-0 z-50 backdrop-blur-md border-b shadow-xs transition-all select-none bg-[#F3F2EE]/95 border-black/15"
        >
          <div className="max-w-7xl mx-auto px-2.5 sm:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-3">
            
            {/* Back Button (Touch friendly tap area) */}
            <button
              onClick={() => {
                soundFx.playToggle(false);
                onBackToPortfolio();
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-black text-white hover:bg-[#E0533C] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xs transition-all shadow-xs active:scale-95 cursor-pointer group shrink-0 min-h-[34px]"
              title="Return to full homepage (Press ESC)"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span className="hidden sm:inline">BACK</span>
              <span className="sm:hidden">PORTFOLIO</span>
              <span className="hidden md:inline-block text-[9px] px-1 py-0.2 bg-white/20 rounded-2xs text-gray-300 font-normal">
                ESC
              </span>
            </button>

            {/* Center Chapter Title with accent badge */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 text-center min-w-0 overflow-hidden">
              <div
                className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-xs text-white shrink-0"
                style={{ backgroundColor: currentMeta.accentColor }}
              >
                {currentMeta.icon}
              </div>
              <span
                className="text-[9px] sm:text-[10px] font-mono font-bold px-1 sm:px-1.5 py-0.5 text-white rounded-none shrink-0"
                style={{ backgroundColor: currentMeta.accentColor }}
              >
                CH. {currentMeta.number}
              </span>
              <div className="text-left truncate min-w-0">
                <h2 className="font-serif text-[11px] sm:text-xs md:text-sm font-bold text-[#111116] uppercase tracking-wide leading-tight truncate">
                  {currentMeta.title}
                </h2>
                <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest hidden md:block truncate">
                  {currentMeta.subtitle}
                </p>
              </div>
            </div>

            {/* Chapter Step Controls (Prev / Next - Touch friendly) */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {prevMeta ? (
                <button
                  onClick={() => {
                    soundFx.playNav();
                    onNavigateSection(prevMeta.id);
                  }}
                  className="px-2 sm:px-2.5 py-1.5 border border-black/20 hover:border-black bg-white/80 hover:bg-white text-black font-mono text-[10px] sm:text-[11px] font-bold rounded-xs flex items-center gap-0.5 sm:gap-1 transition-all cursor-pointer min-h-[34px]"
                  title={`Previous: ${prevMeta.title}`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{prevMeta.number}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    soundFx.playNav();
                    onBackToPortfolio();
                  }}
                  className="px-2 sm:px-2.5 py-1.5 border border-black/10 text-gray-400 font-mono text-[10px] sm:text-[11px] rounded-xs flex items-center gap-1 cursor-pointer min-h-[34px]"
                  title="Home"
                >
                  <Home className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="font-mono text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-1 bg-black/5 rounded-xs text-black/80 shrink-0">
                {currentIndex + 1}/{FOCUSED_SECTIONS.length}
              </div>

              {nextMeta ? (
                <button
                  onClick={() => {
                    soundFx.playNav();
                    onNavigateSection(nextMeta.id);
                  }}
                  className="px-2 sm:px-2.5 py-1.5 border border-black/20 hover:border-black bg-white/80 hover:bg-white text-black font-mono text-[10px] sm:text-[11px] font-bold rounded-xs flex items-center gap-0.5 sm:gap-1 transition-all cursor-pointer min-h-[34px]"
                  title={`Next: ${nextMeta.title}`}
                >
                  <span className="hidden md:inline">{nextMeta.number}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    soundFx.playToggle(false);
                    onBackToPortfolio();
                  }}
                  className="px-2 sm:px-2.5 py-1.5 border bg-emerald-600 text-white font-mono text-[10px] sm:text-[11px] font-bold rounded-xs flex items-center gap-1 cursor-pointer min-h-[34px]"
                  style={{ borderColor: '#10B981' }}
                  title="Finish & Return"
                >
                  <span>DONE</span>
                </button>
              )}
            </div>

          </div>

          {/* Top Progress bar */}
          <div className="h-[2px] bg-black/10 w-full">
            <div 
              className="h-full transition-all duration-300"
              style={{ 
                backgroundColor: currentMeta.accentColor,
                width: `${((currentIndex + 1) / FOCUSED_SECTIONS.length) * 100}%` 
              }}
            />
          </div>
        </header>

        {/* FOCUSED SECTION MAIN VIEWPORT — Clean container with firm GSAP pinning */}
        <main className="relative z-10 w-full overflow-x-hidden">
          {renderSectionComponent()}
        </main>

        {/* FOCUSED VIEW BOTTOM CALLOUT — with generous bottom padding so buttons scroll well above the Floating Nav Dock */}
        <footer
          className="border-t-2 border-dashed bg-white/80 pt-12 sm:pt-16 pb-36 sm:pb-44 px-4 sm:px-6 text-center select-none relative overflow-hidden"
          style={{ borderColor: `${currentMeta.accentColor}30` }}
        >
          <div className="max-w-xl mx-auto space-y-3 sm:space-y-4 relative z-10">
            <span
              className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase inline-block"
              style={{ color: currentMeta.accentColor }}
            >
              END OF CHAPTER {currentMeta.number} // {currentMeta.title}
            </span>

            <h4 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#111116]">
              Explore the Complete Interactive Portfolio
            </h4>

            <p className="text-xs font-mono text-gray-600 leading-relaxed max-w-md mx-auto">
              Return to the full single-scroll homepage to experience the connected 3D WebGL orbit, live telemetry charts, and continuous financial narrative.
            </p>

            <div className="pt-3 sm:pt-4 flex flex-col xs:flex-row items-center justify-center gap-2.5 sm:gap-3">
              <button
                onClick={() => {
                  soundFx.playToggle(false);
                  onBackToPortfolio();
                }}
                className="w-full xs:w-auto px-5 sm:px-6 py-3 bg-black text-white hover:bg-[#E0533C] font-mono text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-md hover:shadow-xl cursor-pointer active:scale-95"
              >
                ← RETURN TO FULL HOMEPAGE
              </button>
              {nextMeta && (
                <button
                  onClick={() => {
                    soundFx.playNav();
                    onNavigateSection(nextMeta.id);
                  }}
                  className="w-full xs:w-auto px-5 sm:px-6 py-3 bg-white border border-black/30 hover:border-black text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xs transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-95"
                  style={{ borderColor: `${currentMeta.accentColor}50` }}
                >
                  PROCEED TO CH. {nextMeta.number} →
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

