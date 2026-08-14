import React, { useState, useEffect, useRef } from 'react';
import { 
  ExternalLink, 
  Download, 
  ArrowUpRight, 
  CheckCircle2, 
  ChevronDown,
  Layers,
  RotateCcw,
  LayoutGrid,
  Table,
  Sparkles,
  Maximize2,
  FileSpreadsheet,
  Presentation,
  Database,
  Eye,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Briefcase
} from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import { Project } from '../types';
import { ProjectDetailModal } from './ProjectDetailModal';
import { ProjectMediaFrame } from './ProjectMediaFrame';
import { StripedTypography } from './StripedTypography';
import { OrbitCarousel3D } from './OrbitCarousel3D';
import { InteractiveTiltCard } from './InteractiveTiltCard';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
import { ProgressiveTextFill } from './ProgressiveTextFill';
import { ScrollReveal } from './KineticTypography';
import { TactileMediaFrame } from './TactileMediaFrame';
import { SectionBackgroundLayer } from './SectionBackgroundLayer';
import { gsap, ScrollTrigger, Flip, setupSectionViewportClamping } from '../lib/gsap';
import { soundFx } from '../lib/sound';

interface WorkSectionProps {
  onContact: () => void;
}

export type WorkLayoutMode = 'orbit' | 'stack' | 'grid' | 'table';

export const WorkSection: React.FC<WorkSectionProps> = ({ onContact }) => {
  const [layoutMode, setLayoutMode] = useState<WorkLayoutMode>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeStackIdx, setActiveStackIdx] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const categories = [
    'All',
    'Power BI & DAX',
    'Excel & Automation',
    'Corporate Presentation',
  ];

  const filteredProjects = selectedCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === selectedCategory);

  const getMediaType = (p: Project) => {
    if (p.videoUrl) return 'video';
    if (p.id.includes('android')) return 'app';
    if (p.category.includes('Presentation')) return 'presentation';
    if (p.category.includes('Excel')) return 'excel';
    if (p.category.includes('Analytics') || p.category.includes('Power BI')) return 'dashboard';
    return 'image';
  };

  // Viewport tracking & Milestone Audio Feedback (Unpinned Natural Vertical Flow)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      setupSectionViewportClamping(section, {
        shouldPin: false,
        onProgress: (prog) => setScrollProgress(prog),
        onMilestone: (m) => {
          soundFx.triggerSectionMilestone('work', m, 480 + m * 60);
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Always recalculate ScrollTrigger positions across the page whenever layout mode or filters change
  useEffect(() => {
    const refreshTriggers = () => {
      ScrollTrigger.refresh();
    };

    const r1 = requestAnimationFrame(refreshTriggers);
    const t1 = setTimeout(refreshTriggers, 60);
    const t2 = setTimeout(refreshTriggers, 200);
    const t3 = setTimeout(refreshTriggers, 450);

    return () => {
      cancelAnimationFrame(r1);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [layoutMode, selectedCategory, activeStackIdx]);

  // Handle switching layout with clean mode state update and trigger refresh
  const handleSwitchLayout = (newMode: WorkLayoutMode) => {
    soundFx.playNav();
    setLayoutMode(newMode);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      setTimeout(() => ScrollTrigger.refresh(), 100);
      setTimeout(() => ScrollTrigger.refresh(), 300);
    });
  };

  const handleNextStack = () => {
    soundFx.playNav();
    setActiveStackIdx((prev) => (prev + 1) % filteredProjects.length);
  };

  const handlePrevStack = () => {
    soundFx.playNav();
    setActiveStackIdx((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };

  // Active stack card
  const currentStackProject = filteredProjects[activeStackIdx] || filteredProjects[0];

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full bg-[#0A0A0E] text-white border-b border-white/10 select-none overflow-hidden pt-16 sm:pt-24 pb-28 sm:pb-36 lg:pb-44"
    >
      {/* CONTEXTUAL PROFESSIONAL BACKGROUND PHOTO */}
      <SectionBackgroundLayer sectionKey="work" opacity={0.48} />

      {/* ELEGANT FIXED VERTICAL PROGRESS BAR ON RIGHT EDGE */}
      <VerticalSectionProgressBar targetId="work" accentColor="#E0533C" label="WORK" sectionCode="03" />

      <div className="w-full flex flex-col justify-between px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* HEADER & TOP DASHED DESCRIPTION BOX WITH LIVE PROGRESS BAR */}
        <ScrollReveal className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center border-b border-white/10 pb-4 w-full flex-shrink-0">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 flex items-center gap-2 mb-1 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#E0533C] animate-pulse" />
                <span>[SCENE 03 // PORTFOLIO ARCHITECTURE]</span>
                <span className="w-12 h-[1px] bg-emerald-500/40" />
              </div>
              <div className="py-1">
                <StripedTypography
                  text="work"
                  progress={Math.round(scrollProgress * 100)}
                  color="#E0533C"
                  className="py-0"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              {/* LIVE SECTION PROGRESS GAUGE */}
              <div className="flex items-center justify-between bg-black/85 border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase backdrop-blur-md">
                <span className="text-white/70 font-bold">SECTION PROGRESS</span>
                <div className="flex items-center gap-2">
                  <div className="w-28 sm:w-40 h-1.5 bg-white/10 overflow-hidden border border-white/20">
                    <div
                      className="h-full bg-[#E0533C] transition-all duration-150 shadow-[0_0_8px_#E0533C]"
                      style={{ width: `${Math.max(4, Math.round(scrollProgress * 100))}%` }}
                    />
                  </div>
                  <span className="text-[#E0533C] font-bold min-w-[32px] text-right">
                    {Math.round(scrollProgress * 100)}%
                  </span>
                </div>
              </div>

              <div className="border border-dashed border-white/30 p-3 bg-black/85 rounded-none text-left shadow-xl backdrop-blur-md">
                <p className="text-[11px] sm:text-xs font-mono text-white/90 font-medium leading-relaxed uppercase">
                  DIFFERENT INDUSTRIES AND SIMILAR CHALLENGES. SAME PROCESS AND UNIQUE SOLUTIONS. HAVE A LOOK AND READ ABOUT IT.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 2-ROW CONTROLLER BAR: CATEGORY FILTER & A-LIGN LAYOUT SWITCHER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2 flex-shrink-0">
          
          {/* CATEGORY FILTER BAR */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedCategory(cat);
                  setActiveStackIdx(0);
                }}
                className={`py-1 px-3 font-mono text-[10px] uppercase tracking-wider transition-all rounded-none cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-black font-bold border border-emerald-400 shadow-md'
                    : 'bg-black/60 border border-white/20 text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* SIGNATURE A-LIGN STUDIO LAYOUT SWITCHER */}
          <div className="flex items-center gap-1 p-1 bg-black/85 border border-white/20 rounded-sm font-mono text-[10px] backdrop-blur-md shadow-lg">
            <button
              onClick={() => handleSwitchLayout('grid')}
              className={`px-2.5 py-1 flex items-center gap-1.5 uppercase transition-all rounded-xs cursor-pointer ${
                layoutMode === 'grid'
                  ? 'bg-[#E0533C] text-white font-bold shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Responsive CSS Grid (Default Unpinned Flow)"
              data-cursor="GRID"
            >
              <LayoutGrid className="w-3 h-3" />
              <span>GRID (DEFAULT)</span>
            </button>

            <button
              onClick={() => handleSwitchLayout('stack')}
              className={`px-2.5 py-1 flex items-center gap-1.5 uppercase transition-all rounded-xs cursor-pointer ${
                layoutMode === 'stack'
                  ? 'bg-[#E0533C] text-white font-bold shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
              title="3D Expansive Interactive Deck"
              data-cursor="STACK"
            >
              <Layers className="w-3 h-3" />
              <span>3D STACK</span>
            </button>

            <button
              onClick={() => handleSwitchLayout('orbit')}
              className={`px-2.5 py-1 flex items-center gap-1.5 uppercase transition-all rounded-xs cursor-pointer ${
                layoutMode === 'orbit'
                  ? 'bg-[#E0533C] text-white font-bold shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
              title="3D Ferris Wheel / Cylindrical Orbit"
              data-cursor="3D ORBIT"
            >
              <RotateCcw className="w-3 h-3" />
              <span>3D ORBIT</span>
            </button>

            <button
              onClick={() => handleSwitchLayout('table')}
              className={`px-2.5 py-1 flex items-center gap-1.5 uppercase transition-all rounded-xs cursor-pointer ${
                layoutMode === 'table'
                  ? 'bg-[#E0533C] text-white font-bold shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Financial Matrix Table"
              data-cursor="MATRIX"
            >
              <Table className="w-3 h-3" />
              <span>MATRIX</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* MODE 1: 3D CYLINDRICAL ORBIT CAROUSEL (A-LIGN SIGNATURE)    */}
        {/* ------------------------------------------------------------ */}
        {layoutMode === 'orbit' && (
          <div className="w-full">
            <OrbitCarousel3D
              projects={filteredProjects}
              onSelectProject={(proj) => setSelectedProject(proj)}
              onContact={onContact}
            />
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* MODE 2: EXPANSIVE SMART 3D CARD DECK STACK                  */}
        {/* ------------------------------------------------------------ */}
        {layoutMode === 'stack' && (
          <div className="w-full space-y-4">
            {/* Top Navigation & Jump Indicator */}
            <div className="flex items-center justify-between border-b border-white/15 pb-2 font-mono text-xs text-white/80">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/50 uppercase font-bold">ACTIVE PROJECT:</span>
                <span className="text-[#E0533C] font-bold">
                  0{activeStackIdx + 1} / 0{filteredProjects.length}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-emerald-400 font-medium truncate max-w-[200px] sm:max-w-none">
                  {currentStackProject.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevStack}
                  className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xs transition-all cursor-pointer flex items-center gap-1 text-[10px] font-mono"
                  title="Previous project"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">PREV</span>
                </button>
                <button
                  onClick={handleNextStack}
                  className="p-1.5 bg-[#E0533C] hover:bg-[#c94530] text-white rounded-xs transition-all cursor-pointer flex items-center gap-1 text-[10px] font-mono font-bold shadow-md"
                  title="Next project"
                >
                  <span className="hidden sm:inline">NEXT</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Smart Expansive Stack Card */}
            <div className="w-full bg-[#121217]/95 border-2 border-white/25 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-300">
              {/* Background Accent Photo */}
              {currentStackProject.image && (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none opacity-40">
                  <img
                    src={currentStackProject.image}
                    alt=""
                    className="w-full h-full object-cover filter saturate-125 scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#121217] via-[#121217]/85 to-[#121217]/90" />
                </div>
              )}

              {/* Card Content Grid */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Left Column: Full Metadata & Deliverables */}
                <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 bg-emerald-500 text-black font-mono text-[10px] font-bold uppercase tracking-wider">
                        {currentStackProject.category}
                      </span>
                      <span className="px-2 py-0.5 bg-white/10 text-white/90 border border-white/20 font-mono text-[10px] font-bold">
                        YEAR: {currentStackProject.year}
                      </span>
                      <span className="text-emerald-400 font-mono text-[10px] font-bold bg-black/60 px-2 py-0.5 border border-emerald-500/30">
                        {currentStackProject.impactMetric}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase tracking-tight leading-tight">
                        {currentStackProject.title}
                      </h3>
                      <p className="text-xs font-mono text-emerald-400 font-semibold mt-1">
                        CLIENT / SCOPE: {currentStackProject.client}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans bg-black/50 p-3.5 border border-white/10 rounded-xs">
                      {currentStackProject.summary}
                    </p>

                    {/* Key Deliverables */}
                    <div className="space-y-2 pl-3 border-l-2 border-[#E0533C] bg-black/30 py-2">
                      <span className="text-[10px] font-mono text-white/50 uppercase font-bold tracking-wider">
                        KEY DELIVERABLES & IMPACT:
                      </span>
                      {currentStackProject.deliverables.map((del, i) => (
                        <div key={i} className="text-xs font-mono text-white/90 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tool Stack Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <span className="text-[9px] font-mono text-white/50 uppercase font-bold">TECH STACK:</span>
                    {currentStackProject.tools.map((t, i) => (
                      <span key={i} className="text-[9px] font-mono text-white/80 bg-white/10 px-2 py-0.5 border border-white/15">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Column: Tactile Media Preview & Actions */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                  <div className="w-full flex-1 min-h-[260px] sm:min-h-[320px] rounded-xs border-2 border-white/20 overflow-hidden shadow-xl bg-black/60 relative">
                    <TactileMediaFrame
                      src={currentStackProject.image}
                      videoSrc={currentStackProject.videoUrl}
                      alt={currentStackProject.title}
                      aspectRatio="h-full w-full"
                      zoomScale={1.1}
                      enableParallax={true}
                      pillTag={currentStackProject.impactMetric}
                      accentColor="#E0533C"
                    />
                  </div>

                  {/* Direct Action Buttons */}
                  <div className="flex items-center gap-2.5 pt-1">
                    {currentStackProject.externalUrl && (
                      <a
                        href={currentStackProject.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-xs transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-emerald-400" />
                        <span>LIVE WORKBOOK</span>
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedProject(currentStackProject)}
                      className="flex-1 py-2.5 px-4 bg-[#E0533C] hover:bg-[#c94530] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xs shadow-lg transition-all cursor-pointer"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span>INSPECT CASE</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Quick Jump Bar */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-[10px] font-mono text-white/50 uppercase font-bold mr-1">QUICK JUMP:</span>
              {filteredProjects.map((p, pIdx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveStackIdx(pIdx);
                  }}
                  className={`px-2.5 py-1 text-[10px] font-mono border transition-all cursor-pointer ${
                    activeStackIdx === pIdx
                      ? 'bg-[#E0533C] text-white border-[#E0533C] font-bold shadow-md'
                      : 'bg-black/60 text-white/70 border-white/20 hover:border-white/50'
                  }`}
                >
                  0{pIdx + 1} {p.client.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* MODE 3: EDITORIAL MAGAZINE GRID (SMART AUTO-HEIGHT)          */}
        {/* ------------------------------------------------------------ */}
        {layoutMode === 'grid' && (
          <div ref={gridContainerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full">
            {filteredProjects.map((project, idx) => {
              const isLastOdd =
                idx === filteredProjects.length - 1 &&
                filteredProjects.length % 2 === 1;

              return (
                <div
                  key={project.id}
                  className={`w-full ${
                    isLastOdd ? 'col-span-1 md:col-span-2 flex justify-center' : ''
                  }`}
                >
                  <div
                    className={`w-full ${
                      isLastOdd
                        ? 'md:max-w-[calc(50%-0.75rem)] lg:max-w-[calc(50%-1rem)]'
                        : ''
                    } h-full`}
                  >
                    <InteractiveTiltCard
                      className="w-full h-full"
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="bg-[#121217]/95 border border-white/20 hover:border-[#E0533C] transition-all p-6 sm:p-7 rounded-none shadow-2xl flex flex-col justify-between h-full group cursor-pointer backdrop-blur-md relative overflow-hidden">
                        
                        {/* Subtle Background Accent Photo */}
                        {project.image && (
                          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none opacity-25 group-hover:opacity-35 transition-opacity duration-300">
                            <img
                              src={project.image}
                              alt=""
                              className="w-full h-full object-cover filter saturate-125 scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-[#121217]/90 to-[#121217]/80" />
                          </div>
                        )}

                        {/* Card Content (Foreground) */}
                        <div className="relative z-10 space-y-4 flex-1 flex flex-col">
                          {/* Top Row: Category & Year */}
                          <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              {project.category}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-black/60 px-1.5 py-0.5 border border-emerald-500/30">
                                {project.impactMetric}
                              </span>
                              <span className="font-mono text-xs text-white/60 bg-white/10 px-2 py-0.5">
                                {project.year}
                              </span>
                            </div>
                          </div>

                          {/* High-Resolution Tactile Media Preview Frame */}
                          <div className="w-full">
                            <TactileMediaFrame
                              src={project.image}
                              videoSrc={project.videoUrl}
                              alt={project.title}
                              aspectRatio="aspect-[16/10]"
                              zoomScale={1.12}
                              enableParallax={true}
                              pillTag={project.impactMetric}
                              accentColor="#E0533C"
                            />
                          </div>

                          {/* Title & Scope */}
                          <div className="pt-1">
                            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-[#E0533C] transition-colors leading-snug">
                              {project.title}
                            </h3>
                            <div className="text-[10px] font-mono text-emerald-400 font-semibold mt-1 tracking-wider uppercase">
                              CLIENT: {project.client}
                            </div>
                          </div>

                          {/* Summary (Full Visibility) */}
                          <p className="text-xs text-white/85 leading-relaxed font-sans bg-black/40 p-3 border border-white/10">
                            {project.summary}
                          </p>

                          {/* Key Deliverables List */}
                          <div className="space-y-1.5 pl-3 border-l-2 border-emerald-400/80 bg-black/20 py-2 mt-auto">
                            {project.deliverables.map((del, i) => (
                              <div key={i} className="text-xs font-mono text-white/90 flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span className="leading-snug">{del}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Action Footer */}
                        <div className="relative z-10 pt-4 mt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap gap-1">
                            {project.tools.map((t, i) => (
                              <span key={i} className="text-[9px] font-mono text-white/70 bg-white/10 px-1.5 py-0.5 border border-white/10">
                                #{t}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            {project.externalUrl && (
                              <a
                                href={project.externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-[10px] uppercase flex items-center gap-1.5 rounded-xs transition-colors"
                                title="Open Live Workbook"
                              >
                                <ExternalLink className="w-3 h-3 text-emerald-400" />
                                <span>LIVE</span>
                              </a>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProject(project);
                              }}
                              className="px-3.5 py-1.5 bg-[#E0533C] hover:bg-[#c94530] text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 rounded-xs shadow-md cursor-pointer transition-all hover:scale-105"
                            >
                              <span>INSPECT</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </InteractiveTiltCard>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* MODE 4: FINANCIAL MATRIX TABLE VIEW                         */}
        {/* ------------------------------------------------------------ */}
        {layoutMode === 'table' && (
          <div className="w-full border border-white/20 bg-[#121217]/95 backdrop-blur-xl rounded-none p-4 sm:p-6 overflow-x-auto shadow-2xl">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/20 text-[10px] text-gray-300 uppercase">
                  <th className="pb-3 font-bold">PROJECT CODE</th>
                  <th className="pb-3 font-bold">DISCIPLINE</th>
                  <th className="pb-3 font-bold">TITLE & CLIENT SCOPE</th>
                  <th className="pb-3 font-bold">KEY IMPACT</th>
                  <th className="pb-3 font-bold">DELIVERABLES PREVIEW</th>
                  <th className="pb-3 font-bold">YEAR</th>
                  <th className="pb-3 text-right font-bold">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs">
                {filteredProjects.map((proj, idx) => (
                  <tr 
                    key={proj.id}
                    onClick={() => setSelectedProject(proj)}
                    className="hover:bg-white/10 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 text-[#E0533C] font-bold whitespace-nowrap">PRJ-0{idx + 1}</td>
                    <td className="py-4 whitespace-nowrap">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 border border-emerald-500/30">
                        {proj.category}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="font-serif text-white font-bold text-sm group-hover:text-[#E0533C] transition-colors">{proj.title}</div>
                      <div className="text-[10px] text-white/60">CLIENT: {proj.client}</div>
                    </td>
                    <td className="py-4 text-blue-300 font-semibold whitespace-nowrap">{proj.impactMetric}</td>
                    <td className="py-4 text-white/80 max-w-xs truncate text-[11px]">
                      {proj.deliverables[0]}
                    </td>
                    <td className="py-4 text-white/60 whitespace-nowrap">{proj.year}</td>
                    <td className="py-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(proj);
                        }}
                        className="px-3.5 py-1.5 bg-[#E0533C]/20 hover:bg-[#E0533C] border border-[#E0533C]/60 text-white rounded-none text-[10px] font-bold uppercase transition-all shadow-sm"
                      >
                        INSPECT CASE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* PROJECT DETAIL MODAL OVERLAY */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onContact={onContact}
        />
      )}
    </section>
  );
};
