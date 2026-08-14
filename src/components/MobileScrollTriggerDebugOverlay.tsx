import React, { useEffect, useState } from 'react';
import { ScrollTrigger, isTouchMobileDevice } from '../lib/gsap';
import { Terminal, Shield, Zap, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

interface DebugSectionState {
  id: string;
  progress: number;
  isActive: boolean;
  isPinned: boolean;
  pinStatus: 'PIN_ACTIVE' | 'PIN_RELEASED' | 'INERTIA_TOUCH' | 'IDLE';
  start: number;
  end: number;
}

export const MobileScrollTriggerDebugOverlay: React.FC = () => {
  const [isTouch, setIsTouch] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [globalProgress, setGlobalProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [sections, setSections] = useState<DebugSectionState[]>([]);

  useEffect(() => {
    const checkTouch = () => {
      const touch = isTouchMobileDevice() || (typeof window !== 'undefined' && window.innerWidth <= 1024);
      setIsTouch(touch);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const updateTelemetry = () => {
      const currentScrollY = window.scrollY || window.pageYOffset || 0;
      setScrollY(Math.round(currentScrollY));

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((currentScrollY / docHeight) * 100))) : 0;
      setGlobalProgress(progress);

      const allTriggers = ScrollTrigger.getAll();
      const currentSections: DebugSectionState[] = [];
      let currentActiveId = 'home';

      allTriggers.forEach((st) => {
        const triggerEl = st.trigger as HTMLElement | null;
        if (!triggerEl) return;
        const id = triggerEl.id || triggerEl.getAttribute('data-section') || triggerEl.className.slice(0, 15);
        if (!id || id === 'screen-portfolio-main') return;

        const isPinned = Boolean(st.pin);
        const isActive = st.isActive;
        let pinStatus: DebugSectionState['pinStatus'] = 'IDLE';

        if (isPinned && isActive && st.progress > 0 && st.progress < 1) {
          pinStatus = isTouch ? 'INERTIA_TOUCH' : 'PIN_ACTIVE';
        } else if (st.progress >= 1) {
          pinStatus = 'PIN_RELEASED';
        } else if (isActive) {
          pinStatus = isTouch ? 'INERTIA_TOUCH' : 'PIN_ACTIVE';
        }

        if (isActive && st.progress >= 0 && st.progress <= 1) {
          currentActiveId = id;
        }

        currentSections.push({
          id,
          progress: Math.round(st.progress * 100),
          isActive,
          isPinned,
          pinStatus,
          start: Math.round(st.start),
          end: Math.round(st.end),
        });
      });

      setActiveSection(currentActiveId);
      setSections(currentSections.slice(0, 8)); // keep top 8 active sections

      animationFrameId = requestAnimationFrame(updateTelemetry);
    };

    animationFrameId = requestAnimationFrame(updateTelemetry);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isTouch]);

  // Render on touch/mobile or whenever toggled
  return (
    <aside
      aria-label="ScrollTrigger Mobile Telemetry Debugger"
      className="fixed bottom-20 left-3 z-50 pointer-events-auto select-none max-w-[280px] sm:max-w-[320px]"
    >
      <div className="bg-[#0B0B0E]/90 backdrop-blur-md border border-emerald-500/30 rounded shadow-2xl p-2.5 text-emerald-400 font-mono text-[10px] leading-tight">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-emerald-500/20">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-wider text-white">SCROLL_CLAMP // HUD</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] px-1 py-0.2 bg-emerald-500/20 text-emerald-300 rounded">
              {isTouch ? 'TOUCH_MODE' : 'DESKTOP'}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white/70 hover:text-white p-0.5"
              title={isExpanded ? 'Collapse Telemetry' : 'Expand Telemetry'}
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Core Live Stats (Always Visible) */}
        <div className="grid grid-cols-2 gap-1.5 pt-1.5 text-[9.5px]">
          <div>
            <span className="text-white/50 block text-[8.5px]">ACTIVE_SCENE</span>
            <span className="text-white font-bold truncate block">{activeSection.toUpperCase()}</span>
          </div>
          <div>
            <span className="text-white/50 block text-[8.5px]">GLOBAL_SCROLL</span>
            <span className="text-emerald-300 font-bold">{globalProgress}% ({scrollY}px)</span>
          </div>
        </div>

        {/* Detailed Section Status when Expanded */}
        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-emerald-500/20 space-y-1.5 max-h-48 overflow-y-auto pr-1">
            <div className="text-[8.5px] text-white/50 flex justify-between uppercase">
              <span>Section</span>
              <span>Prog / Pin Status</span>
            </div>
            {sections.map((sec) => (
              <div
                key={sec.id}
                className={`p-1 rounded flex items-center justify-between text-[9px] ${
                  sec.isActive ? 'bg-emerald-500/20 text-white font-semibold' : 'bg-black/30 text-white/70'
                }`}
              >
                <span className="truncate max-w-[100px]">{sec.id}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-300">{sec.progress}%</span>
                  <span
                    className={`px-1 py-0.2 rounded text-[7.5px] font-bold ${
                      sec.pinStatus === 'PIN_ACTIVE'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : sec.pinStatus === 'INERTIA_TOUCH'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {sec.pinStatus === 'INERTIA_TOUCH' ? 'INERTIA' : sec.pinStatus === 'PIN_ACTIVE' ? 'LOCKED' : 'RELEASED'}
                  </span>
                </div>
              </div>
            ))}
            <div className="pt-1 text-[8px] text-white/40 text-center">
              Touch clamping prevents mobile viewport lockups
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
