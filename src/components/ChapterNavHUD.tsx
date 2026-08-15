import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Compass, ChevronDown, Sparkles } from 'lucide-react';
import { soundFx } from '../lib/sound';

interface ChapterNavHUDProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const SCENES = [
  { id: 'home', number: '01', label: 'HERO // ENTRANCE' },
  { id: 'chapters', number: '02', label: 'CHAPTER TIMELINE' },
  { id: 'work', number: '03', label: 'PORTFOLIO DECK' },
  { id: 'sandbox', number: '04', label: 'FINANCIAL LAB' },
  { id: 'pricing', number: '05', label: 'ENGAGEMENT RATES' },
  { id: 'dashboards', number: '06', label: 'POWER BI TELEMETRY' },
  { id: 'about', number: '07', label: 'CORE PRINCIPLES' },
  { id: 'experience', number: '08', label: 'CAREER CHRONOLOGY' },
  { id: 'skills', number: '09', label: 'SKILL ARCHITECTURE' },
  { id: 'certs', number: '10', label: 'VERIFIED CREDENTIALS' },
  { id: 'process', number: '11', label: '5-STAGE METHODOLOGY' },
  { id: 'contact', number: '12', label: 'EXECUTIVE INQUIRY' },
];

export const ChapterNavHUD: React.FC<ChapterNavHUDProps> = ({
  activeSection,
  onNavigate,
}) => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const current = (window.scrollY / totalScroll) * 100;
      setScrollPercent(Math.min(100, Math.max(0, Math.round(current))));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentSceneIndex = SCENES.findIndex((s) => s.id === activeSection);
  const currentScene = SCENES[currentSceneIndex >= 0 ? currentSceneIndex : 0];

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center select-none pointer-events-auto">
      {/* VERTICAL CHAPTER TRACKER */}
      <div className="p-2.5 bg-white/90 backdrop-blur-md border border-black/15 rounded-full flex flex-col items-center gap-3 shadow-md">
        
        {/* Top Mini Index */}
        <div className="text-[9px] font-mono font-bold text-[#E0533C]">
          {currentScene.number}
        </div>

        {/* Vertical Nodes */}
        <div className="flex flex-col items-center gap-1.5 py-1">
          {SCENES.map((scene) => {
            const isActive = activeSection === scene.id;
            return (
              <button
                key={scene.id}
                onClick={() => {
                  soundFx.playNav();
                  onNavigate(scene.id);
                }}
                className="group relative flex items-center justify-center p-1 cursor-pointer"
                title={scene.label}
                data-cursor={scene.number}
              >
                {/* Node Pill */}
                <div
                  className={`transition-all duration-300 rounded-full ${
                    isActive
                      ? 'w-2 h-4 bg-[#E0533C] shadow-xs'
                      : 'w-1.5 h-1.5 bg-black/25 group-hover:bg-black/70 group-hover:scale-150'
                  }`}
                />

                {/* Hover Tooltip */}
                <div className="absolute left-7 px-2.5 py-1 bg-white border border-black/15 text-[#111116] font-mono text-[9px] uppercase tracking-widest whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-md rounded-xs flex items-center gap-1.5 z-50">
                  <span className="text-[#E0533C] font-bold">{scene.number}</span>
                  <span>{scene.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Percent Dial */}
        <div className="text-[8px] font-mono text-[#555555] font-bold pt-1 border-t border-black/10">
          {scrollPercent}%
        </div>
      </div>
    </div>
  );
};
