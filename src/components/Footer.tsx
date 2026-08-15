import React, { useState, useEffect } from 'react';
import { ArrowUp, Printer, FileDown } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { PixelTypography } from './PixelTypography';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenPrint?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPrint }) => {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#EAE8E2] text-[#111116] pt-20 pb-12 border-t border-black/15 select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-black/15 pb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-bold block mb-2">
              PARVEJ ALAM SULEMANALI ANSARI
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#111116] tracking-tight uppercase">
              FINANCE. ANALYTICS. STRATEGY.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-5 py-3 bg-[#E0533C] hover:bg-[#c94530] border border-[#E0533C] font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-white shadow-xs transition-all cursor-pointer hover:scale-[1.02]"
              data-cursor="PDF"
              title="One-click immediate PDF download using default settings"
            >
              <FileDown className="w-4 h-4" />
              <span>DOWNLOAD SUMMARY</span>
            </button>

            <button
              onClick={scrollToTop}
              className="px-5 py-3 border border-black/20 hover:border-black font-mono text-xs uppercase tracking-widest flex items-center gap-2 text-[#111116] bg-white hover:bg-black/5 transition-all group cursor-pointer shadow-xs"
              data-cursor="TOP"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform text-[#E0533C]" />
            </button>
          </div>
        </div>

        {/* Massive Dot-Matrix Display Brand Text */}
        <div className="overflow-hidden py-8 border-b border-black/15 flex justify-center">
          <PixelTypography text="PARVEJ ALAM" size="xl" activeColor="bg-[#E0533C]" progress={1} />
        </div>

        {/* Footer Navigation & Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 font-mono text-xs text-[#555555]">
          <div className="space-y-3">
            <div className="text-[#111116] font-bold uppercase tracking-wider">NAVIGATION</div>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('home')} className="hover:text-black transition-colors cursor-pointer">HOME</button></li>
              <li><button onClick={() => onNavigate('work')} className="hover:text-black transition-colors cursor-pointer">WORK / CASE STUDIES</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="hover:text-black transition-colors cursor-pointer">PRICING ENGAGEMENTS</button></li>
              <li><button onClick={() => onNavigate('dashboards')} className="hover:text-black transition-colors cursor-pointer">POWER BI SHOWCASE</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-black transition-colors cursor-pointer font-mono">ABOUT & PRINCIPLES</button></li>
              <li>
                <button
                  onClick={() => window.print()}
                  className="text-emerald-800 hover:text-emerald-700 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>ONE-CLICK DOWNLOAD SUMMARY</span>
                </button>
              </li>
              {onOpenPrint && (
                <li>
                  <button
                    onClick={onOpenPrint}
                    className="text-[#E0533C] hover:text-[#c94530] font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>CUSTOM PDF DOSSIER</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-[#111116] font-bold uppercase tracking-wider">COMPETENCIES</div>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('skills')} className="hover:text-black transition-colors font-mono cursor-pointer">FINANCIAL MODELING</button></li>
              <li><button onClick={() => onNavigate('skills')} className="hover:text-black transition-colors font-mono cursor-pointer">POWER BI & DAX</button></li>
              <li><button onClick={() => onNavigate('skills')} className="hover:text-black transition-colors font-mono cursor-pointer">CMA STRATEGIC COSTING</button></li>
              <li><button onClick={() => onNavigate('skills')} className="hover:text-black transition-colors font-mono cursor-pointer">EXCEL POWER QUERY M</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-[#111116] font-bold uppercase tracking-wider">CONNECT</div>
            <ul className="space-y-2">
              <li><a href={PERSONAL_INFO.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">LINKEDIN</a></li>
              <li><a href={PERSONAL_INFO.socials.linkedinCerts} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">VERIFIED CERTIFICATIONS</a></li>
              <li><a href={PERSONAL_INFO.socials.email} className="hover:text-black transition-colors">EMAIL DIRECT</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-[#111116] font-bold uppercase tracking-wider">SYSTEM STATUS</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>ONLINE & AVAILABLE</span>
              </div>
              <div>LOCAL TIME: {timeString || '12:00:00'}</div>
              <div>CMA PART 1: CLEARED (380/500)</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-black/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] uppercase text-[#666666]">
          <div>© {new Date().getFullYear()} PARVEJ ALAM SULEMANALI ANSARI. ALL RIGHTS RESERVED.</div>
          <div>CMA USA PART 1 CLEARED • FINANCE & DATA ANALYTICS SPECIALIST</div>
        </div>
      </div>
    </footer>
  );
};
