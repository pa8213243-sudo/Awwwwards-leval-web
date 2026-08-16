import React, { useState, useEffect } from 'react';
import { Loader } from './components/Loader';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { KineticTypographySection } from './components/KineticTypographySection';
import { ChapterTimeline } from './components/ChapterTimeline';
import { WorkSection } from './components/WorkSection';
import { FinancialSandbox } from './components/FinancialSandbox';
import { PricingSection } from './components/PricingSection';
import { AnalyticsShowcase } from './components/AnalyticsShowcase';
import { CoreValuesSection } from './components/CoreValuesSection';
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
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { GuideRulerOverlay } from './components/GuideRulerOverlay';
import { FocusedSectionView } from './components/FocusedSectionView';
import { PERSONAL_INFO } from './data/portfolioData';
import { initSmoothScroll, ScrollTrigger, isTouchMobileDevice } from './lib/gsap';
import { assetPreloader } from './lib/assetPreloader';
import { audioManager } from './lib/audio';
import { getDeviceCapabilities } from './lib/performanceTier';

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

  // Run hardware capability analysis on initial mount
  useEffect(() => {
    getDeviceCapabilities();
  }, []);

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

  // Initialize Lenis smooth inertia scroll
  useEffect(() => {
    if (isLoading) return;

    const lenis = initSmoothScroll();

    // Trigger initial pre-cache for first upcoming sections
    assetPreloader.preloadUpcomingSection('home');

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(timer);
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

  const [focusedSection, setFocusedSection] = useState<string | null>(null);
  const previousScrollYRef = React.useRef<number>(0);

  // Check URL hash on initial load (e.g. #/work or #/pricing)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#/')) {
      const initialSection = window.location.hash.replace('#/', '').trim();
      if (initialSection && initialSection !== 'home') {
        setFocusedSection(initialSection);
      }
    }
  }, []);

  // Listen to browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.sectionId) {
        setFocusedSection(e.state.sectionId);
      } else {
        setFocusedSection(null);
        const restoreY = previousScrollYRef.current || 0;
        setTimeout(() => {
          window.scrollTo({ top: restoreY, behavior: 'instant' });
          ScrollTrigger.refresh(true);
        }, 60);
        setTimeout(() => {
          ScrollTrigger.refresh(true);
        }, 500);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    assetPreloader.preloadUpcomingSection(sectionId);

    // If selecting 'home', return to full homepage at top
    if (sectionId === 'home') {
      if (focusedSection !== null) {
        setFocusedSection(null);
        window.history.pushState(null, '', window.location.pathname);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Entering isolated section view mode
    if (focusedSection === null) {
      previousScrollYRef.current = window.scrollY;
    }

    setFocusedSection(sectionId);
    window.history.pushState({ sectionId }, '', `/#/${sectionId}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleExitFocusedView = () => {
    setFocusedSection(null);
    window.history.pushState(null, '', window.location.pathname);
    const restoreY = previousScrollYRef.current || 0;
    setTimeout(() => {
      window.scrollTo({ top: restoreY, behavior: 'instant' });
      ScrollTrigger.refresh(true);
    }, 60);
    // Second refresh after layout fully settles
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 500);
  };

  const handleCopyEmail = () => {
    window.open(PERSONAL_INFO.socials.email, '_self');
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-[#E0533C] selection:text-white overflow-x-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#F3F2EE] text-[#111116]' : 'theme-light bg-[#F3F2EE] text-[#111116]'
    }`}>
      {/* THIN ANIMATED TOP SCROLL-PROGRESS INDICATOR BAR */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-black/10 pointer-events-none">
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
          {/* IF FOCUSED SECTION IS ACTIVE: RENDER ONLY THAT ISOLATED SECTION */}
          {focusedSection ? (
            <FocusedSectionView
              sectionId={focusedSection}
              onBackToPortfolio={handleExitFocusedView}
              onNavigateSection={handleNavigate}
              onCopyEmail={handleCopyEmail}
              theme={theme}
            />
          ) : (
            /* FULL CONNECTED MAIN PORTFOLIO (100% UNCHANGED) */
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

                <SectionTransitionDivider sceneNumber="02" label="MANIFESTO" accentColor="#E0533C" />

                {/* Scene 02: Scroll-Driven Kinetic Typography Manifesto */}
                <KineticTypographySection />

                <SectionTransitionDivider sceneNumber="03" label="CHRONOLOGY" accentColor="#E0533C" />

                {/* Scene 03: A-Lign Inspired Interactive Chapter Timeline Strip */}
                <ChapterTimeline />

                <SectionTransitionDivider sceneNumber="04" label="WORK" accentColor="#E0533C" />

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

                <SectionTransitionDivider sceneNumber="07" label="CORE VALUES & FRAMEWORK" accentColor="#E0533C" />

                {/* Scene 07: Standalone Progressive Core Values & Operating Framework Section */}
                <CoreValuesSection />

                <SectionTransitionDivider sceneNumber="08" label="PHILOSOPHY" accentColor="#E0533C" />

                {/* Scene 08: About & Executive Magazine Scene */}
                <AboutSection />

                <SectionTransitionDivider sceneNumber="09" label="CHRONOLOGY" accentColor="#10B981" />

                {/* Scene 09: Career Chronology (CMA & Experience - Pinned Scroll) */}
                <ExperienceTimeline />

                <SectionTransitionDivider sceneNumber="10" label="SKILL ARCHITECTURE" accentColor="#10B981" />

                {/* Scene 10: Typographic Skill Architecture (Pinned Scroll) */}
                <SkillsSection />

                <SectionTransitionDivider sceneNumber="11" label="CREDENTIALS" accentColor="#10B981" />

                {/* Scene 11: Verified Certifications Gallery */}
                <CertificateGallery />

                <SectionTransitionDivider sceneNumber="12" label="METHODOLOGY" accentColor="#E0533C" />

                {/* Scene 12: 5-Stage Execution Methodology Scene */}
                <ProcessSection />

                <SectionTransitionDivider sceneNumber="13" label="CONTACT & INITIATION" accentColor="#10B981" />

                {/* Scene 13: Contact CTA & Inquiry Form */}
                <ContactSection onCopyEmail={handleCopyEmail} />
              </main>


              {/* Visual Guide Ruler Overlay (25%, 50%, 75% Alignment Verification) */}
              <GuideRulerOverlay
                isOpen={isGuideRulerOpen}
                onToggle={() => setIsGuideRulerOpen(!isGuideRulerOpen)}
              />

              {/* Editorial Footer */}
              <Footer 
                onNavigate={handleNavigate} 
                onOpenPrint={() => setIsPrintModalOpen(true)}
              />
            </div>
          )}

          {/* Floating Dock Navigation — Always visible in both focused & full views */}
          <FloatingNavDock
            activeSection={focusedSection || activeSection}
            onNavigate={handleNavigate}
            onOpenCommand={() => setIsCommandOpen(true)}
            onOpenCopilot={() => setIsCopilotOpen(true)}
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

          {/* Device Telemetry & Cookie Security Banner */}
          <CookieConsentBanner />
        </>
      )}
    </div>
  );
}
