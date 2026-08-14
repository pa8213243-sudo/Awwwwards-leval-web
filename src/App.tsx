import React, { useState, useEffect } from 'react';
import { Loader } from './components/Loader';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ChapterTimeline } from './components/ChapterTimeline';
import { WorkSection } from './components/WorkSection';
import { FinancialSandbox } from './components/FinancialSandbox';
import { PricingSection } from './components/PricingSection';
import { AnalyticsShowcase } from './components/AnalyticsShowcase';
import { AboutSection } from './components/AboutSection';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { SkillsSection } from './components/SkillsSection';
import { CertificateGallery } from './components/CertificateGallery';
import { ProcessSection } from './components/ProcessSection';
import { SectionTransitionDivider } from './components/SectionTransitionDivider';
import { FinancialCalculator } from './components/FinancialCalculator';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { AICopilotDrawer } from './components/AICopilotDrawer';
import { CommandPalette } from './components/CommandPalette';
import { FloatingNavDock } from './components/FloatingNavDock';
import { ChapterNavHUD } from './components/ChapterNavHUD';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PrintDossier, PrintOptions, DEFAULT_PRINT_OPTIONS } from './components/PrintDossier';
import { ExportPDFModal } from './components/ExportPDFModal';
import { GuideRulerOverlay } from './components/GuideRulerOverlay';
import { PERSONAL_INFO } from './data/portfolioData';
import { initSmoothScroll, ScrollTrigger, isTouchMobileDevice } from './lib/gsap';
import { assetPreloader } from './lib/assetPreloader';
import { audioManager } from './lib/audio';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [topScrollProgress, setTopScrollProgress] = useState(0);

  // Modals & Drawers state
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isDriveOpen, setIsDriveOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isGuideRulerOpen, setIsGuideRulerOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printOptions, setPrintOptions] = useState<PrintOptions>(DEFAULT_PRINT_OPTIONS);
  const [isDriveConnected, setIsDriveConnected] = useState(false);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Global Audio Context Singleton & Pre-loading of mechanical click assets on initial mount
  useEffect(() => {
    const handleInitialUserGesture = () => {
      audioManager.preWarmAudioContext();
      audioManager.preloadMechanicalAssets();
      window.removeEventListener('pointerdown', handleInitialUserGesture);
      window.removeEventListener('keydown', handleInitialUserGesture);
      window.removeEventListener('scroll', handleInitialUserGesture);
    };

    window.addEventListener('pointerdown', handleInitialUserGesture, { passive: true });
    window.addEventListener('keydown', handleInitialUserGesture, { passive: true });
    window.addEventListener('scroll', handleInitialUserGesture, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleInitialUserGesture);
      window.removeEventListener('keydown', handleInitialUserGesture);
      window.removeEventListener('scroll', handleInitialUserGesture);
    };
  }, []);

  // Initialize Lenis smooth inertia scroll & ScrollTrigger Mobile Controller
  useEffect(() => {
    if (isLoading) return;

    const lenis = initSmoothScroll();

    // Trigger initial pre-cache for first upcoming sections
    assetPreloader.preloadUpcomingSection('home');

    // ScrollTrigger Mobile Controller Diagnostic Logger
    const isTouch = isTouchMobileDevice();
    if (isTouch) {
      const allTriggers = ScrollTrigger.getAll();
      allTriggers.forEach((st) => {
        const triggerEl = st.trigger as HTMLElement | null;
        const sectionId = triggerEl?.id || triggerEl?.getAttribute('data-section') || 'unnamed-section';
        
        ScrollTrigger.create({
          trigger: triggerEl || document.body,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            const isPinned = Boolean(st.pin);
            const isLocked = isPinned && self.isActive && self.progress > 0 && self.progress < 1;
            console.debug(
              `[ScrollTrigger Mobile Controller] [Section: ${sectionId}] isActive: ${self.isActive} | isLocked: ${isLocked} | progress: ${(self.progress * 100).toFixed(1)}%`
            );
          },
        });
      });
    }

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      lenis.destroy();
    };
  }, [isLoading]);

  const activeSectionRef = React.useRef(activeSection);
  activeSectionRef.current = activeSection;

  // Scroll section observer with RAF throttling & predictive pre-caching
  useEffect(() => {
    if (isLoading) return;

    let rafId: number | null = null;

    const sections = [
      'home',
      'chapters',
      'work',
      'sandbox',
      'pricing',
      'dashboards',
      'about',
      'experience',
      'skills',
      'certs',
      'process',
      'contact',
    ];

    const handleScroll = () => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          const nextProgress = window.scrollY / totalHeight;
          setTopScrollProgress((prev) => (Math.abs(prev - nextProgress) > 0.002 ? nextProgress : prev));
        }

        const scrollPosition = window.scrollY + 250;

        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              if (activeSectionRef.current !== sectionId) {
                setActiveSection(sectionId);
                assetPreloader.preloadUpcomingSection(sectionId);
              }
              break;
            }
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading]);

  // Global keyboard shortcuts ([G] or ⌘K for command palette, ⌘P for PDF print)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'g' || e.key === 'G') &&
        !isCommandOpen &&
        !isPrintModalOpen &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setIsCommandOpen(true);
      }

      if ((e.metaKey || e.ctrlKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        setIsPrintModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandOpen, isPrintModalOpen]);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    assetPreloader.preloadUpcomingSection(sectionId);

    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyEmail = () => {
    window.open(PERSONAL_INFO.socials.email, '_self');
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-white selection:text-black overflow-x-hidden transition-colors duration-300 ${
      theme === 'light' ? 'theme-light bg-[#F4F4F0] text-[#0D0D11]' : 'bg-[#0A0A0E] text-[#F5F5F4]'
    }`}>
      {/* THIN ANIMATED TOP SCROLL-PROGRESS INDICATOR BAR */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-white/10 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-[#E0533C] to-blue-500 transition-all duration-75 ease-out shadow-[0_0_10px_#E0533C]"
          style={{ width: `${Math.min(100, Math.max(0, topScrollProgress * 100))}%` }}
        />
      </div>

      {/* Initial Editorial Loading Sequence */}
      {isLoading ? (
        <Loader onComplete={() => setIsLoading(false)} />
      ) : (
        <>
          {/* Screen Content Wrapper (hidden when printing) */}
          <div id="screen-portfolio-main" className="screen-only">
            {/* Custom Desktop Mouse Follower */}
            <CustomCursor />

            {/* A-Lign Studio Left Chapter Tracker HUD */}
            <ChapterNavHUD
              activeSection={activeSection}
              onNavigate={handleNavigate}
            />

            {/* Navigation Bar */}
            <Navbar
              activeSection={activeSection}
              onNavigate={handleNavigate}
              onOpenCommand={() => setIsCommandOpen(true)}
              onOpenCopilot={() => setIsCopilotOpen(true)}
              onOpenDrive={() => setIsDriveOpen(true)}
              onOpenPrint={() => setIsPrintModalOpen(true)}
              isDriveConnected={isDriveConnected}
            />

            {/* Main Portfolio Sections - Single Authoritative Layout */}
            <main className="relative">
              {/* Scene 01: Hero Scene */}
              <div id="home">
                <Hero
                  onNavigate={handleNavigate}
                  onOpenCalculator={() => setIsCalculatorOpen(true)}
                />
              </div>

              {/* Scene 02: A-Lign Inspired Interactive Chapter Timeline Strip */}
              <ChapterTimeline />

              <SectionTransitionDivider sceneNumber="03" label="WORK" accentColor="#E0533C" />

              {/* Scene 03: Selected Work Scene (A-Lign 3D Orbit & Stacking Deck) */}
              <WorkSection onContact={() => handleNavigate('contact')} />

              <SectionTransitionDivider sceneNumber="04" label="VALUATION LAB" accentColor="#E0533C" />

              {/* Scene 04: Live Financial Valuation & Sensitivity Sandbox */}
              <FinancialSandbox />

              <SectionTransitionDivider sceneNumber="05" label="PRICING & ENGAGEMENT" accentColor="#E0533C" />

              {/* Scene 05: Engagement & Pricing Models Scene */}
              <PricingSection onContact={() => handleNavigate('contact')} />

              <SectionTransitionDivider sceneNumber="06" label="BI TELEMETRY" accentColor="#3B82F6" />

              {/* Scene 06: Power BI & Executive Data Telemetry Showcase Scene */}
              <AnalyticsShowcase />

              <SectionTransitionDivider sceneNumber="07" label="PHILOSOPHY" accentColor="#E0533C" />

              {/* Scene 07: About & Core Operating Principles Magazine Scene */}
              <AboutSection />

              <SectionTransitionDivider sceneNumber="08" label="CHRONOLOGY" accentColor="#10B981" />

              {/* Scene 08: Career Chronology (CMA & Experience - Pinned Scroll) */}
              <ExperienceTimeline />

              <SectionTransitionDivider sceneNumber="09" label="SKILL ARCHITECTURE" accentColor="#10B981" />

              {/* Scene 09: Typographic Skill Architecture (Pinned Scroll) */}
              <SkillsSection />

              <SectionTransitionDivider sceneNumber="10" label="CREDENTIALS" accentColor="#10B981" />

              {/* Scene 10: Verified Certifications Gallery */}
              <CertificateGallery />

              <SectionTransitionDivider sceneNumber="11" label="METHODOLOGY" accentColor="#E0533C" />

              {/* Scene 11: 5-Stage Execution Methodology Scene */}
              <ProcessSection />

              <SectionTransitionDivider sceneNumber="12" label="CONTACT & INITIATION" accentColor="#10B981" />

              {/* Scene 12: Contact CTA & Inquiry Form */}
              <ContactSection onCopyEmail={handleCopyEmail} />
            </main>


            {/* Visual Guide Ruler Overlay (25%, 50%, 75% Alignment Verification) */}
            <GuideRulerOverlay
              isOpen={isGuideRulerOpen}
              onToggle={() => setIsGuideRulerOpen(!isGuideRulerOpen)}
            />

            {/* Floating Dock Navigation */}
            <FloatingNavDock
              activeSection={activeSection}
              onNavigate={handleNavigate}
              onOpenCommand={() => setIsCommandOpen(true)}
              onOpenCopilot={() => setIsCopilotOpen(true)}
              onOpenPrint={() => setIsPrintModalOpen(true)}
            />

            {/* Editorial Footer */}
            <Footer 
              onNavigate={handleNavigate} 
              onOpenPrint={() => setIsPrintModalOpen(true)}
            />

            {/* Utility Modals & Drawers */}
            <FinancialCalculator
              isOpen={isCalculatorOpen}
              onClose={() => setIsCalculatorOpen(false)}
            />

            <GoogleDriveModal
              isOpen={isDriveOpen}
              onClose={() => setIsDriveOpen(false)}
              isDriveConnected={isDriveConnected}
              setIsDriveConnected={setIsDriveConnected}
            />

            <AICopilotDrawer
              isOpen={isCopilotOpen}
              onClose={() => setIsCopilotOpen(false)}
              onNavigate={handleNavigate}
            />

            <CommandPalette
              isOpen={isCommandOpen}
              onClose={() => setIsCommandOpen(false)}
              onNavigate={handleNavigate}
              onOpenCopilot={() => setIsCopilotOpen(true)}
              onOpenCalculator={() => setIsCalculatorOpen(true)}
              onOpenDrive={() => setIsDriveOpen(true)}
              onOpenPrint={() => setIsPrintModalOpen(true)}
              onCopyEmail={handleCopyEmail}
              onToggleGuideRuler={() => setIsGuideRulerOpen(!isGuideRulerOpen)}
              isGuideRulerOpen={isGuideRulerOpen}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          </div>

          {/* Dedicated Print & PDF Export Layout (renders cleanly during window.print()) */}
          <div id="print-portfolio-dossier" className="hidden print:block">
            <PrintDossier options={printOptions} />
          </div>

          {/* Export PDF Modal Customizer */}
          <ExportPDFModal
            isOpen={isPrintModalOpen}
            onClose={() => setIsPrintModalOpen(false)}
            options={printOptions}
            setOptions={setPrintOptions}
          />
        </>
      )}
    </div>
  );
}
