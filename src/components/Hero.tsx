import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowDownRight, 
  Calculator, 
  ChevronRight, 
  ChevronLeft,
  Award, 
  TrendingUp, 
  CheckCircle2, 
  ChevronDown,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Database,
  ExternalLink,
  ShieldCheck,
  Compass,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react';
import { PERSONAL_INFO, PROJECTS } from '../data/portfolioData';
import { PixelTypography } from './PixelTypography';
import { ThreeCanvas } from './ThreeCanvas';
import { ParvejAvatar } from './ParvejAvatar';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
import { gsap } from '../lib/gsap';
import { soundFx } from '../lib/sound';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  onOpenCalculator: () => void;
}

interface WorkSlide {
  id: string;
  tag: string;
  headline: string;
  subtext: string;
  type: 'video' | 'interactive' | 'image';
  videoUrl?: string;
  imageUrl?: string;
  badge: string;
  projectTargetId: string;
}

const WORK_SLIDES: WorkSlide[] = [
  {
    id: 'slide-1',
    tag: 'Webflow & Financial Motion',
    headline: 'The future of financial modeling is being composed.',
    subtext: '3-statement dynamic model linked to real-time EBITDA and automated debt schedules.',
    type: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1728-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    badge: 'CMA VERIFIED',
    projectTargetId: 'work',
  },
  {
    id: 'slide-2',
    tag: 'Power BI Telemetry',
    headline: 'Meet your instrument. Real-time DAX for execution.',
    subtext: 'Processing 1.24M+ records with sub-second star-schema query latency.',
    type: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-charts-and-data-31913-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    badge: '1.24M ROWS',
    projectTargetId: 'dashboards',
  },
  {
    id: 'slide-3',
    tag: 'M&A Cap Table Engine',
    headline: 'Fine-tune your waterfall & sensitivity matrix.',
    subtext: 'Multi-tiered liquidity preference with anti-dilution convertible debt simulations.',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    badge: 'VALUATION',
    projectTargetId: 'sandbox',
  },
  {
    id: 'slide-4',
    tag: 'Institutional FP&A',
    headline: 'From strategy to capital with zero ambiguity.',
    subtext: 'Autonomous variance reconciliation and rolling 12-month zero-based budgeting.',
    type: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-lines-41221-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop',
    badge: '380/500 MERIT',
    projectTargetId: 'experience',
  },
];

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenCalculator }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [timeString, setTimeString] = useState('');
  
  // Work Box Slide State
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeHoverCard, setActiveHoverCard] = useState<string | null>(null);

  // Mouse position relative to container for magnetic tag floating
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Real-time IST clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istTime = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setTimeString(`${istTime} IST (UTC+05:30)`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Slide autoplay timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % WORK_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick();
    setActiveSlideIdx((prev) => (prev + 1) % WORK_SLIDES.length);
  };

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick();
    setActiveSlideIdx((prev) => (prev - 1 + WORK_SLIDES.length) % WORK_SLIDES.length);
  };

  const handleSelectSlide = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick();
    setActiveSlideIdx(idx);
  };

  const currentSlide = WORK_SLIDES[activeSlideIdx];

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen w-full bg-[#F5F5F2] text-[#111116] pt-20 pb-12 px-4 sm:px-6 md:px-10 flex flex-col justify-between select-none overflow-hidden"
    >
      {/* ELEGANT FIXED VERTICAL PROGRESS BAR ON RIGHT EDGE */}
      <VerticalSectionProgressBar targetId="home" accentColor="#E0533C" label="ENTRANCE" sectionCode="01" isLightBg={true} />

      {/* ARCHITECTURAL DASHED GRID LINES */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            backgroundPosition: 'center center',
          }}
        />
      </div>

      {/* 3D AMBIENT PARTICLES (LIGHT MODE OPTIMIZED) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
        <ThreeCanvas variant="hero" />
      </div>

      {/* MAIN HUD STRIP */}
      <div className="max-w-7xl mx-auto w-full relative z-10 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/15 pb-3 text-xs font-mono uppercase tracking-widest text-black/75 bg-[#F5F5F2]/90 backdrop-blur-md p-3">
          <div className="flex items-center gap-3">
            <ParvejAvatar size="xs" showOnlinePing />
            <span className="text-black font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>PARVEJ ALAM // FINANCIAL ARCHITECT & BI ENGINEER</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2 bg-emerald-100 border border-emerald-600/40 px-3 py-1 text-emerald-900 font-semibold shadow-xs">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>CMA USA PART 1 (SCORE: 380/500)</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-black/60 font-medium">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>{timeString}</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CENTER STAGE WITH 4 INTERACTIVE ZOOMABLE BOXES               */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto w-full relative z-10 flex-1 flex items-center justify-center my-6 min-h-[580px] sm:min-h-[640px] lg:min-h-[680px]">
        
        {/* ---------------------------------------------------------- */}
        {/* 1. TOP-LEFT DASHED BOX: [ ABOUT ]                          */}
        {/* ---------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, x: -30, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          whileHover={{ scale: 1.08, y: -6 }}
          transition={{ type: "spring", stiffness: 450, damping: 28, mass: 0.6 }}
          onClick={() => {
            soundFx.playClick();
            onNavigate('about');
          }}
          onMouseEnter={() => {
            soundFx.playHover();
            setActiveHoverCard('about');
          }}
          onMouseLeave={() => setActiveHoverCard(null)}
          className="absolute left-0 xl:-left-2 top-0 w-28 sm:w-36 md:w-44 lg:w-48 h-36 sm:h-48 md:h-56 lg:h-64 p-2 border-2 border-dashed border-black/25 hover:border-black bg-white shadow-lg hover:shadow-2xl cursor-pointer group transition-shadow duration-200 z-10 hover:z-50 will-change-transform"
        >
          <div className="relative w-full h-full overflow-hidden bg-neutral-100">
            {/* Image with zoom effect on hover */}
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
              alt="About Parvej Alam"
              className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:scale-130 group-hover:grayscale-0"
            />
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out will-change-transform scale-100 group-hover:scale-120"
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-businesswoman-talking-with-a-colleague-in-an-office-42867-large.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            
            {/* Floating Pill Tag */}
            <div className="absolute bottom-2 right-2 bg-black text-white font-mono text-[9px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 uppercase tracking-wider shadow-lg group-hover:bg-[#E0533C] group-hover:scale-110 transition-transform duration-200 will-change-transform">
              ABOUT
            </div>
          </div>
          {/* Corner Markers */}
          <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-black group-hover:scale-110 transition-transform duration-200" />
          <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-black group-hover:scale-110 transition-transform duration-200" />
        </motion.div>

        {/* ---------------------------------------------------------- */}
        {/* 2. BOTTOM-LEFT DASHED BOX: [ PRICING ]                     */}
        {/* ---------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, x: -30, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          whileHover={{ scale: 1.08, y: -6 }}
          transition={{ type: "spring", stiffness: 450, damping: 28, mass: 0.6 }}
          onClick={() => {
            soundFx.playClick();
            onNavigate('pricing');
          }}
          onMouseEnter={() => {
            soundFx.playHover();
            setActiveHoverCard('pricing');
          }}
          onMouseLeave={() => setActiveHoverCard(null)}
          className="absolute left-0 xl:-left-2 bottom-0 w-28 sm:w-36 md:w-44 lg:w-48 h-36 sm:h-48 md:h-56 lg:h-64 p-2 border-2 border-dashed border-black/25 hover:border-[#E0533C] bg-white shadow-lg hover:shadow-2xl cursor-pointer group transition-shadow duration-200 z-10 hover:z-50 will-change-transform"
        >
          <div className="relative w-full h-full overflow-hidden bg-neutral-100">
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop"
              alt="Pricing & Advisory Engagements"
              className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:scale-130 group-hover:grayscale-0"
            />
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out will-change-transform scale-100 group-hover:scale-120"
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-businessman-walking-in-a-building-corridor-42858-large.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            
            {/* Floating Pill Tag */}
            <div className="absolute bottom-2 right-2 bg-black text-white font-mono text-[9px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 uppercase tracking-wider shadow-lg group-hover:bg-[#E0533C] group-hover:scale-110 transition-transform duration-200 will-change-transform">
              PRICING
            </div>
          </div>
          <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#E0533C] group-hover:scale-110 transition-transform duration-200" />
          <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#E0533C] group-hover:scale-110 transition-transform duration-200" />
        </motion.div>

        {/* ---------------------------------------------------------- */}
        {/* 3. TOP-RIGHT DASHED BOX: [ PROCESS ]                       */}
        {/* ---------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, x: 30, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          whileHover={{ scale: 1.08, y: -6 }}
          transition={{ type: "spring", stiffness: 450, damping: 28, mass: 0.6 }}
          onClick={() => {
            soundFx.playClick();
            onNavigate('process');
          }}
          onMouseEnter={() => {
            soundFx.playHover();
            setActiveHoverCard('process');
          }}
          onMouseLeave={() => setActiveHoverCard(null)}
          className="absolute right-0 xl:-right-2 top-0 w-28 sm:w-36 md:w-40 lg:w-44 h-32 sm:h-40 md:h-48 lg:h-52 p-2 border-2 border-dashed border-black/25 hover:border-emerald-600 bg-white shadow-lg hover:shadow-2xl cursor-pointer group transition-shadow duration-200 z-10 hover:z-50 hidden sm:block will-change-transform"
        >
          <div className="relative w-full h-full overflow-hidden bg-neutral-100">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop"
              alt="Process & Execution"
              className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:scale-130 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            
            {/* Floating Pill Tag */}
            <div className="absolute bottom-2 right-2 bg-black text-white font-mono text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider shadow-lg group-hover:bg-emerald-600 group-hover:scale-110 transition-transform duration-200 will-change-transform">
              PROCESS
            </div>
          </div>
          <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-emerald-600 group-hover:scale-110 transition-transform duration-200" />
          <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-emerald-600 group-hover:scale-110 transition-transform duration-200" />
        </motion.div>

        {/* ---------------------------------------------------------- */}
        {/* 4. CENTER-RIGHT LARGE INTERACTIVE BOX: [ WORK SHOWCASE ]    */}
        {/* (Vibrant Blue Backdrop with Live Video & Slide Player)     */}
        {/* ---------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, y: -6 }}
          transition={{ type: "spring", stiffness: 450, damping: 28, mass: 0.6 }}
          className="absolute right-0 xl:-right-2 bottom-0 w-[240px] sm:w-[300px] md:w-[360px] lg:w-[400px] h-[190px] sm:h-[240px] md:h-[280px] p-2 sm:p-2.5 border-2 border-dashed border-blue-500/70 hover:border-blue-600 bg-gradient-to-br from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] shadow-[0_16px_40px_rgba(30,64,175,0.35)] transition-shadow duration-200 z-10 hover:z-50 group will-change-transform"
        >
          <div 
            onClick={() => {
              soundFx.playClick();
              onNavigate(currentSlide.projectTargetId);
            }}
            className="relative w-full h-full bg-[#0A0A10] border border-white/20 overflow-hidden flex flex-col justify-between cursor-pointer"
          >
            {/* TOP BAR OF THE INTERACTIVE WORK SCREEN */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 bg-black/60 text-[10px] font-mono text-white/70">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="ml-2 font-bold text-white uppercase">{currentSlide.tag}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white px-1.5 py-0.5 text-[9px] font-semibold">
                  {currentSlide.badge}
                </span>
              </div>
            </div>

            {/* CENTER SLIDE CONTENT WITH VIDEO & ABSTRACT MOTION */}
            <div className="relative flex-1 w-full overflow-hidden p-3 sm:p-4 flex flex-col justify-center">
              
              {/* Embedded Video Player with Zoom on Hover */}
              {currentSlide.type === 'video' && currentSlide.videoUrl && (
                <video
                  key={currentSlide.id}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-45 filter contrast-125 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:scale-125"
                >
                  <source src={currentSlide.videoUrl} type="video/mp4" />
                </video>
              )}

              {/* Fallback Image */}
              {currentSlide.imageUrl && currentSlide.type !== 'video' && (
                <img
                  src={currentSlide.imageUrl}
                  alt={currentSlide.headline}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 filter contrast-125 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:scale-125"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

              {/* Slide Text Content */}
              <div className="relative z-10 max-w-xs space-y-1">
                <span className="text-[9px] sm:text-[10px] font-mono text-blue-300 uppercase tracking-widest font-semibold">
                  [PROJECT 0{activeSlideIdx + 1} / 0{WORK_SLIDES.length}]
                </span>
                <h3 className="font-serif text-xs sm:text-sm md:text-base font-bold text-white leading-snug">
                  {currentSlide.headline}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-white/80 font-sans line-clamp-2">
                  {currentSlide.subtext}
                </p>
              </div>

              {/* Floating WORK pill */}
              <div className="absolute bottom-2.5 right-2.5 bg-white text-black font-mono text-[9px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 uppercase tracking-wider shadow-2xl flex items-center gap-1 group-hover:scale-110 group-hover:bg-[#E0533C] group-hover:text-white transition-transform duration-200 will-change-transform z-20">
                <span>WORK</span>
                <ChevronRight className="w-3 h-3 text-[#E0533C] group-hover:text-white" />
              </div>
            </div>

            {/* BOTTOM SLIDE CONTROLLER RAIL */}
            <div className="flex items-center justify-between px-3 py-1.5 border-t border-white/10 bg-black/70 text-[10px] font-mono">
              <div className="flex items-center gap-1">
                {WORK_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => handleSelectSlide(idx, e)}
                    className={`h-1.5 transition-all rounded-full cursor-pointer ${
                      activeSlideIdx === idx
                        ? 'w-6 bg-blue-400'
                        : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 text-white">
                <button
                  onClick={handlePrevSlide}
                  className="p-1 hover:text-blue-400 transition-colors cursor-pointer"
                  title="Previous Slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleNextSlide}
                  className="p-1 hover:text-blue-400 transition-colors cursor-pointer"
                  title="Next Slide"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-blue-600 group-hover:scale-110 transition-transform duration-200" />
          <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-blue-600 group-hover:scale-110 transition-transform duration-200" />
        </motion.div>

        {/* ---------------------------------------------------------- */}
        {/* 5. CENTER FOCAL HEADLINE (UNOBSTRUCTED, HIGH Z-INDEX & CONTRAST) */}
        {/* ---------------------------------------------------------- */}
        <div className="relative z-30 text-center max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-5 sm:space-y-6 pointer-events-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-3 sm:space-y-4"
          >
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-[#111116] leading-[1.08] drop-shadow-xs">
              Financial Models that <br />
              <span className="font-sans font-light italic text-[#111116] relative inline-block">
                make sense
                <span className="absolute left-0 bottom-1 w-full h-[2px] bg-[#E0533C]/40 border-b border-dashed border-[#E0533C]" />
              </span>
            </h1>

            <p className="text-xs sm:text-sm font-mono tracking-widest uppercase text-black/80 max-w-lg mx-auto leading-relaxed pt-1 font-semibold">
              WE TAKE YOU FROM STRATEGY TO SUCCESS <br />
              WITH EVERY NUMBER EARNING ITS PLACE
            </p>
          </motion.div>

          {/* Centered Dashed [ GET ALIGNED ] CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            <button
              onClick={() => {
                soundFx.playClick();
                onNavigate('work');
              }}
              className="px-8 py-3.5 bg-white hover:bg-black text-black hover:text-white border-2 border-dashed border-black/80 hover:border-black font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer"
            >
              GET ALIGNED
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onOpenCalculator();
              }}
              className="px-6 py-3.5 bg-black hover:bg-neutral-800 text-white border border-black font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md hover:shadow-xl cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>VALUATION LAB</span>
            </button>
          </motion.div>

        </div>

      </div>

      {/* ------------------------------------------------------------ */}
      {/* PROFILE CREDENTIAL BAR & STATS (BOTTOM SECTION OF HERO)     */}
      {/* ------------------------------------------------------------ */}
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-white border-2 border-black/15 p-4 sm:p-5 shadow-lg">
          
          <div className="lg:col-span-5 flex items-center gap-3.5 p-3 bg-neutral-50 border border-black/10">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500 flex-shrink-0 shadow-md">
              <img
                src="/parvej_profile.png"
                alt="Parvej Alam Profile"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src.includes('.png')) {
                    target.src = '/parvej_profile.svg';
                  }
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-serif text-sm font-bold text-black uppercase">
                  {PERSONAL_INFO.fullName}
                </span>
              </div>
              <p className="font-mono text-xs text-emerald-700 font-bold mt-0.5">
                {PERSONAL_INFO.role}
              </p>
              <div className="text-[10px] font-mono text-black/60 mt-0.5 font-semibold">
                CMA USA Part 1 (380/500) • FP&A & BI Engineering
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PERSONAL_INFO.stats.map((st, i) => (
              <div key={i} className="p-2.5 bg-neutral-50 border border-black/10 text-left">
                <div className="font-serif text-lg sm:text-xl font-bold text-[#E0533C]">{st.value}</div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-black/60 font-semibold mt-0.5">{st.label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* CONTINUOUS MOVING FINANCIAL TICKER STRIP AT BOTTOM */}
      <div className="w-full mt-4 pt-2 border-t border-black/10 overflow-hidden relative">
        <div className="flex gap-8 whitespace-nowrap animate-marquee font-mono text-xs uppercase tracking-widest text-black/70 font-semibold">
          <span className="text-emerald-800 font-bold">• CMA PART 1: 380/500 MERIT</span>
          <span>• 3-STATEMENT FINANCIAL MODELING</span>
          <span className="text-[#E0533C] font-bold">• 1,240,000+ ROWS POWER BI TELEMETRY</span>
          <span>• MONTE CARLO & DCF VALUATION</span>
          <span className="text-blue-800 font-bold">• POWER QUERY M & DAX SCRIPTING</span>
          <span>• CAP TABLE DILUTION SCHEDULES</span>
          <span className="text-amber-800 font-bold">• VARIANCE ANALYSIS & RECONCILIATION</span>
          <span className="text-emerald-800 font-bold">• CMA PART 1: 380/500 MERIT</span>
          <span>• 3-STATEMENT FINANCIAL MODELING</span>
          <span className="text-[#E0533C] font-bold">• 1,240,000+ ROWS POWER BI TELEMETRY</span>
        </div>
      </div>

    </section>
  );
};

