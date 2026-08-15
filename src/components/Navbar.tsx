import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Command, Sparkles, FolderGit2, Menu, X, ArrowUpRight, Printer, FileDown, Play, Pause } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { ParvejAvatar } from './ParvejAvatar';
import { useMotionControl } from '../lib/motionControl';
import { soundFx } from '../lib/sound';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenCommand: () => void;
  onOpenCopilot: () => void;
  onOpenDrive: () => void;
  onOpenPrint: () => void;
  isDriveConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenCommand,
  onOpenCopilot,
  onOpenDrive,
  onOpenPrint,
  isDriveConnected = false
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isPaused: isMotionPaused, toggle: toggleMotion } = useMotionControl();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'chapters', label: 'CHAPTERS' },
    { id: 'work', label: 'WORK' },
    { id: 'pricing', label: 'PRICING' },
    { id: 'dashboards', label: 'TELEMETRY' },
    { id: 'about', label: 'ABOUT' },
    { id: 'process', label: 'PROCESS' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <>
      <header
        className="absolute top-0 left-0 right-0 z-40 py-4 text-[#111116] border-b border-black/10 bg-[#F3F2EE]/90 backdrop-blur-xs transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Personal Brand Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <ParvejAvatar size="sm" showOnlinePing />
            <div>
              <span className="font-serif text-base tracking-tight font-bold text-[#111116] block leading-none">
                PARVEJ ALAM
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#555562] font-semibold uppercase block mt-1">
                CMA USA PART 1 CLEARED
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`text-xs font-mono tracking-widest uppercase transition-all duration-200 relative py-1 cursor-pointer ${
                    isActive ? 'text-[#111116] font-bold' : 'text-[#44444F] hover:text-[#111116] font-medium'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E0533C]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Quiet Controls */}
          <div className="hidden md:flex items-center gap-2">
            {/* GLOBAL MOTION CONTROL TOGGLE */}
            <button
              onClick={() => toggleMotion()}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 border text-[11px] font-mono font-bold transition-all rounded-none cursor-pointer shadow-xs ${
                isMotionPaused
                  ? 'border-amber-500/60 bg-amber-500/15 text-amber-900'
                  : 'border-black/20 bg-white hover:bg-[#F8F6F0] text-[#111116]'
              }`}
              title={
                isMotionPaused
                  ? 'Global Motion Paused: Click to resume animations'
                  : 'Global Motion Active: Click to pause animations for accessibility/focus'
              }
              data-cursor={isMotionPaused ? 'RESUME MOTION' : 'PAUSE MOTION'}
            >
              {isMotionPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
                  <span className="uppercase tracking-wider">MOTION PAUSED</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#555562]" />
                  <span className="uppercase tracking-wider hidden xl:inline">MOTION</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenPrint}
              className="flex items-center gap-1.5 px-2.5 py-1.5 border border-[#E0533C]/40 bg-[#E0533C]/10 hover:bg-[#E0533C]/20 text-[#E0533C] text-[11px] font-mono font-bold transition-all rounded-none cursor-pointer shadow-xs"
              title="Export Portfolio as PDF / Print Dossier (⌘ P)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider">EXPORT PDF</span>
            </button>

            <button
              onClick={onOpenCommand}
              className="flex items-center gap-1.5 px-2.5 py-1.5 border border-black/20 bg-white hover:bg-[#F8F6F0] text-[#111116] text-[11px] font-mono font-semibold transition-all rounded-none cursor-pointer shadow-xs"
              title="Open Command Palette (⌘ K)"
            >
              <Command className="w-3.5 h-3.5 text-[#555562]" />
              <span className="uppercase tracking-wider hidden xl:inline">COMMAND</span>
              <kbd className="px-1 py-0.5 bg-black/10 text-[9px] text-[#111116] font-bold border border-black/15 rounded-xs">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={onOpenDrive}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 border text-[11px] font-mono font-semibold tracking-wider transition-all rounded-none cursor-pointer ${
                isDriveConnected
                  ? 'border-emerald-600/40 bg-emerald-500/15 text-emerald-800'
                  : 'border-black/20 bg-white text-[#22222A] hover:bg-[#F8F6F0]'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider hidden xl:inline">
                {isDriveConnected ? 'DRIVE CONNECTED' : 'DRIVE ASSETS'}
              </span>
            </button>

            <MagneticButton
              onClick={onOpenCopilot}
              dataCursorText="AI CHAT"
              className="px-3.5 py-1.5 bg-[#111116] text-white text-[11px] font-mono font-bold tracking-wider hover:bg-black transition-all rounded-none shadow-sm"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="uppercase tracking-wider">AI SARA</span>
              </div>
            </MagneticButton>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => toggleMotion()}
              className={`p-2 border rounded-sm cursor-pointer ${
                isMotionPaused
                  ? 'bg-amber-500/20 text-amber-900 border-amber-500/40'
                  : 'bg-black/5 text-[#111116] border-black/15'
              }`}
              title={isMotionPaused ? 'Resume Motion' : 'Pause Motion'}
              aria-label="Toggle Motion"
            >
              {isMotionPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenPrint}
              className="p-2 bg-[#E0533C]/20 text-[#E0533C] border border-[#E0533C]/30 rounded-sm cursor-pointer"
              aria-label="Export PDF"
              title="Export PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenCopilot}
              className="p-2 bg-white/10 text-white rounded-sm cursor-pointer"
              aria-label="AI Sara"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-white/20 text-white rounded-sm cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#0A0A0E] pt-24 px-8 pb-12 flex flex-col justify-between md:hidden"
          >
            <div className="flex flex-col gap-6">
              <div className="text-xs font-mono uppercase tracking-widest text-white/40 border-b border-white/10 pb-2">
                NAVIGATION
              </div>
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left font-serif text-2xl text-white hover:text-emerald-400 flex items-center justify-between cursor-pointer"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-5 h-5 text-white/40" />
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
              <button
                onClick={() => {
                  onOpenPrint();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-[#E0533C] text-white text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 rounded-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                EXPORT PORTFOLIO AS PDF
              </button>
              <button
                onClick={() => {
                  onOpenDrive();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 border border-white/20 text-xs font-mono uppercase tracking-widest text-white flex items-center justify-center gap-2 rounded-sm cursor-pointer"
              >
                <FolderGit2 className="w-4 h-4" />
                GOOGLE DRIVE ASSETS
              </button>
              <button
                onClick={() => {
                  onOpenCommand();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-white text-black text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 rounded-sm cursor-pointer"
              >
                <Command className="w-4 h-4" />
                COMMAND PALETTE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
