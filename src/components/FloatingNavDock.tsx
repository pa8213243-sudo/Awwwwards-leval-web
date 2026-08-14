import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Sparkles, Code, DollarSign, Briefcase, User, Mail, Home, Volume2, VolumeX, Printer, Layers, Play, Pause } from 'lucide-react';
import { ParvejAvatar } from './ParvejAvatar';
import { useMotionControl } from '../lib/motionControl';
import { soundFx } from '../lib/sound';

interface FloatingNavDockProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenCommand: () => void;
  onOpenCopilot: () => void;
  onOpenPrint: () => void;
}

export const FloatingNavDock: React.FC<FloatingNavDockProps> = ({
  activeSection,
  onNavigate,
  onOpenCommand,
  onOpenCopilot,
  onOpenPrint,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundFx.isMuted());
  const { isPaused: isMotionPaused, toggle: toggleMotion } = useMotionControl();

  const navLinks = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'chapters', label: 'CHAPTERS', icon: Layers },
    { id: 'work', label: 'WORK', icon: Briefcase },
    { id: 'pricing', label: 'PRICING', icon: DollarSign },
    { id: 'about', label: 'ABOUT', icon: User },
    { id: 'process', label: 'PROCESS', icon: Code },
    { id: 'contact', label: 'CONTACT', icon: Mail },
  ];

  const handleNavClick = (id: string) => {
    soundFx.playNav();
    setIsMenuOpen(false);
    onNavigate(id);
  };

  const toggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  const toggleMenu = () => {
    const nextState = !isMenuOpen;
    soundFx.playToggle(nextState);
    setIsMenuOpen(nextState);
  };

  return (
    <>
      {/* Floating Modal Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4 sm:p-6"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#121214] border border-white/20 rounded-sm w-full max-w-md p-6 sm:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase block">
                    NAVIGATION INDEX
                  </span>
                  <h3 className="font-serif text-2xl text-white font-normal uppercase tracking-tight">
                    Quick Navigation
                  </h3>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 border border-white/15 hover:border-white bg-white/5 hover:bg-white/10 text-white rounded-xs transition-colors cursor-pointer"
                  data-cursor="CLOSE"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Links Grid */}
              <div className="space-y-2 mb-6">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = activeSection === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.id)}
                      className={`w-full p-3 border transition-all flex items-center justify-between rounded-xs cursor-pointer ${
                        isActive
                          ? 'border-white bg-white text-black font-semibold'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white'
                      }`}
                      data-cursor={link.label}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-white/40'}`} />
                        <span className="text-xs font-mono tracking-widest uppercase">{link.label}</span>
                      </div>
                      <ArrowRight className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-white/40'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Extra Shortcuts */}
              <div className="pt-4 border-t border-white/10 space-y-2 text-xs font-mono">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenPrint();
                  }}
                  className="w-full py-2.5 px-3 bg-[#E0533C] hover:bg-[#c94530] text-white rounded-xs text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  data-cursor="EXPORT PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  EXPORT PORTFOLIO AS PDF
                </button>

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenCommand();
                    }}
                    className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/15 text-white/70 hover:text-white rounded-xs text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                    data-cursor="CMD"
                  >
                    COMMAND (⌘K)
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenCopilot();
                    }}
                    className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xs text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    data-cursor="AI"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    AI SARA
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Pill Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[#121214]/90 backdrop-blur-xl border border-white/20 p-1.5 rounded-full shadow-2xl flex items-center gap-1.5 sm:gap-2 pointer-events-auto"
        >
          {/* MENU + Toggle */}
          <button
            onClick={toggleMenu}
            onMouseEnter={() => soundFx.playHover()}
            className={`px-4 py-2 text-xs font-mono tracking-widest uppercase transition-all rounded-full flex items-center gap-1.5 cursor-pointer ${
              isMenuOpen
                ? 'bg-white text-black font-semibold'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
            }`}
            data-cursor="MENU"
          >
            <span>MENU</span>
            <span className="text-emerald-400 font-bold">{isMenuOpen ? '×' : '+'}</span>
          </button>

          {/* Central Architectural <a> / Home Logo Button */}
          <button
            onClick={() => {
              soundFx.playNav();
              onNavigate('home');
            }}
            onMouseEnter={() => soundFx.playHover()}
            className="px-3.5 py-1.5 bg-black/60 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white rounded-full font-mono text-xs font-bold tracking-widest transition-all duration-200 cursor-pointer flex items-center gap-1 shadow-md hover:scale-105"
            title="Return to Architectural Home Grid (ESC)"
            data-cursor="<a> HOME"
          >
            <span className="text-[#E0533C]">&lt;</span>
            <span className="tracking-tight">a</span>
            <span className="text-[#E0533C]">&gt;</span>
          </button>

          {/* Direct CONTACT Button */}
          <button
            onClick={() => {
              soundFx.playNav();
              onNavigate('contact');
            }}
            onMouseEnter={() => soundFx.playHover()}
            className="px-4 sm:px-5 py-2 bg-[#E0533C] hover:bg-[#d0432c] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md cursor-pointer hover:scale-105"
            data-cursor="CONTACT"
          >
            CONTACT
          </button>

          {/* GLOBAL MOTION TOGGLE PILL */}
          <button
            onClick={() => toggleMotion()}
            onMouseEnter={() => soundFx.playHover()}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              isMotionPaused
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
            }`}
            title={isMotionPaused ? 'Resume Global Entrance Motion' : 'Pause Global Motion for Focused Reading'}
            data-cursor={isMotionPaused ? 'RESUME MOTION' : 'PAUSE MOTION'}
          >
            {isMotionPaused ? <Play className="w-3.5 h-3.5 fill-amber-300" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* AUDIO FEEDBACK TOGGLE PILL */}
          <button
            onClick={toggleSound}
            onMouseEnter={() => soundFx.playHover()}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              isMuted
                ? 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
            }`}
            title={isMuted ? 'Unmute Audio Feedback' : 'Mute Audio Feedback'}
            data-cursor={isMuted ? 'UNMUTE' : 'SOUND ON'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 animate-pulse" />}
          </button>
        </motion.div>
      </div>
    </>
  );
};
