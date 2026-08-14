import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Printer, 
  FileDown, 
  FileText, 
  Check, 
  X, 
  Sparkles, 
  Eye, 
  Download, 
  Settings, 
  CheckCircle2,
  Sliders,
  Layers,
  Award,
  FileSpreadsheet,
  Database
} from 'lucide-react';
import { PrintOptions, PrintDossier } from './PrintDossier';

interface ExportPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: PrintOptions;
  setOptions: React.Dispatch<React.SetStateAction<PrintOptions>>;
}

export const ExportPDFModal: React.FC<ExportPDFModalProps> = ({
  isOpen,
  onClose,
  options,
  setOptions,
}) => {
  const [activePreset, setActivePreset] = useState<'full' | 'models' | 'resume'>('full');
  const [isPreviewActive, setIsPreviewActive] = useState(false);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: 'full' | 'models' | 'resume') => {
    setActivePreset(preset);
    if (preset === 'full') {
      setOptions({
        includeModels: true,
        includeTelemetry: true,
        includeTimeline: true,
        includeCerts: true,
        includeSkills: true,
        includeProcess: true,
        includePricing: true,
        theme: options.theme,
      });
    } else if (preset === 'models') {
      setOptions({
        includeModels: true,
        includeTelemetry: true,
        includeTimeline: false,
        includeCerts: true,
        includeSkills: true,
        includeProcess: false,
        includePricing: true,
        theme: options.theme,
      });
    } else if (preset === 'resume') {
      setOptions({
        includeModels: true,
        includeTelemetry: false,
        includeTimeline: true,
        includeCerts: true,
        includeSkills: true,
        includeProcess: false,
        includePricing: false,
        theme: options.theme,
      });
    }
  };

  const handlePrint = () => {
    // Open print dialog
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-[#121217] border border-white/20 text-white rounded-sm w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#E0533C]/20 border border-[#E0533C]/40 text-[#E0533C] rounded-sm">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-[#E0533C] uppercase font-bold">
                EXECUTIVE EXPORT SUITE
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-white uppercase tracking-tight">
                Export Portfolio as Professional PDF
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 border border-white/15 hover:border-white bg-white/5 hover:bg-white/10 text-white rounded-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs font-sans">
          
          {/* Preset Selector */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-2">
              1. SELECT DOSSIER TEMPLATE
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleApplyPreset('full')}
                className={`p-4 border text-left rounded-sm transition-all cursor-pointer ${
                  activePreset === 'full'
                    ? 'border-[#E0533C] bg-[#E0533C]/10 text-white shadow-md ring-1 ring-[#E0533C]/50'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif text-sm font-bold">Full Executive Dossier</span>
                  {activePreset === 'full' && <Check className="w-4 h-4 text-[#E0533C]" />}
                </div>
                <p className="text-[11px] text-gray-400">
                  Comprehensive 7-section document including all models, DAX telemetry, and verified CMA credentials.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('models')}
                className={`p-4 border text-left rounded-sm transition-all cursor-pointer ${
                  activePreset === 'models'
                    ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-white shadow-md ring-1 ring-[#3B82F6]/50'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif text-sm font-bold">Financial Models & DAX</span>
                  {activePreset === 'models' && <Check className="w-4 h-4 text-[#3B82F6]" />}
                </div>
                <p className="text-[11px] text-gray-400">
                  Focused on 3-statement models, DCF valuations, DAX code scripts, and pricing engagements.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('resume')}
                className={`p-4 border text-left rounded-sm transition-all cursor-pointer ${
                  activePreset === 'resume'
                    ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-md ring-1 ring-emerald-500/50'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif text-sm font-bold">CMA Resume & Skills</span>
                  {activePreset === 'resume' && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-gray-400">
                  Curated resume spec with career chronology, 10 verified certifications, and core competencies.
                </p>
              </button>
            </div>
          </div>

          {/* Section Inclusions Grid */}
          <div className="border border-white/10 bg-black/40 p-4 rounded-sm">
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 font-semibold">
                2. CUSTOMIZE INCLUDED SECTIONS
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                {Object.values(options).filter(v => v === true).length} Sections Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
              <label className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xs cursor-pointer hover:bg-white/10">
                <input
                  type="checkbox"
                  checked={options.includeTimeline}
                  onChange={(e) => setOptions({ ...options, includeTimeline: e.target.checked })}
                  className="rounded text-[#E0533C] focus:ring-0 cursor-pointer"
                />
                <span>Career & Academic History</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xs cursor-pointer hover:bg-white/10">
                <input
                  type="checkbox"
                  checked={options.includeModels}
                  onChange={(e) => setOptions({ ...options, includeModels: e.target.checked })}
                  className="rounded text-[#E0533C] focus:ring-0 cursor-pointer"
                />
                <span>Financial Models & Case Studies</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xs cursor-pointer hover:bg-white/10">
                <input
                  type="checkbox"
                  checked={options.includeTelemetry}
                  onChange={(e) => setOptions({ ...options, includeTelemetry: e.target.checked })}
                  className="rounded text-[#E0533C] focus:ring-0 cursor-pointer"
                />
                <span>Power BI DAX Telemetry</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xs cursor-pointer hover:bg-white/10">
                <input
                  type="checkbox"
                  checked={options.includeSkills}
                  onChange={(e) => setOptions({ ...options, includeSkills: e.target.checked })}
                  className="rounded text-[#E0533C] focus:ring-0 cursor-pointer"
                />
                <span>Competencies & Skill Matrix</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xs cursor-pointer hover:bg-white/10">
                <input
                  type="checkbox"
                  checked={options.includeCerts}
                  onChange={(e) => setOptions({ ...options, includeCerts: e.target.checked })}
                  className="rounded text-[#E0533C] focus:ring-0 cursor-pointer"
                />
                <span>Verified Certifications ({10})</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xs cursor-pointer hover:bg-white/10">
                <input
                  type="checkbox"
                  checked={options.includeProcess}
                  onChange={(e) => setOptions({ ...options, includeProcess: e.target.checked })}
                  className="rounded text-[#E0533C] focus:ring-0 cursor-pointer"
                />
                <span>5-Stage Methodology</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xs cursor-pointer hover:bg-white/10">
                <input
                  type="checkbox"
                  checked={options.includePricing}
                  onChange={(e) => setOptions({ ...options, includePricing: e.target.checked })}
                  className="rounded text-[#E0533C] focus:ring-0 cursor-pointer"
                />
                <span>Engagement Models & Rates</span>
              </label>
            </div>
          </div>

          {/* Style & Theme Selection */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-white/10 bg-white/5 rounded-sm">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-300 font-bold block mb-1">
                DOCUMENT PALETTE & INK OPTIMIZATION
              </span>
              <p className="text-[11px] text-gray-400">
                Executive Clean (White) produces high-contrast printouts and saves toner. Obsidian creates a dark mode digital PDF.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
              <button
                type="button"
                onClick={() => setOptions({ ...options, theme: 'light' })}
                className={`px-3 py-1.5 border rounded-xs transition-colors cursor-pointer ${
                  options.theme === 'light'
                    ? 'bg-white text-black font-bold border-white'
                    : 'bg-black/40 text-gray-300 border-white/20 hover:bg-white/10'
                }`}
              >
                Executive Clean (White)
              </button>
              <button
                type="button"
                onClick={() => setOptions({ ...options, theme: 'dark' })}
                className={`px-3 py-1.5 border rounded-xs transition-colors cursor-pointer ${
                  options.theme === 'dark'
                    ? 'bg-emerald-600 text-white font-bold border-emerald-500'
                    : 'bg-black/40 text-gray-300 border-white/20 hover:bg-white/10'
                }`}
              >
                Obsidian Dark
              </button>
            </div>
          </div>

          {/* Quick PDF Export Instructions */}
          <div className="p-3.5 bg-blue-950/40 border border-blue-500/30 rounded-sm text-[11px] font-mono text-blue-200 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">PDF EXPORT INSTRUCTIONS:</span>
              <span>
                In the print window, set <strong className="text-white">Destination</strong> to <em className="text-white">"Save as PDF"</em> and ensure <strong className="text-white">"Background graphics"</strong> is checked under More settings to preserve styling.
              </span>
            </div>
          </div>

          {/* Inline Live A4 Print Format Preview */}
          {isPreviewActive && (
            <div className="border-2 border-emerald-500/40 rounded-sm overflow-hidden mt-4 bg-black/90 shadow-2xl">
              <div className="p-3 bg-[#16161D] border-b border-white/15 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-bold uppercase tracking-wider">
                    LIVE PRINT-READY A4 DOSSIER PREVIEW
                  </span>
                  <span className="text-white/40">• 210mm × 297mm FORMAT</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreviewActive(false)}
                  className="text-xs text-white/60 hover:text-white underline cursor-pointer"
                >
                  Hide A4 Preview
                </button>
              </div>
              <div className="p-4 bg-[#26262B] max-h-[500px] overflow-y-auto flex justify-center">
                <div className="w-full max-w-[210mm] bg-white text-black shadow-2xl p-6 border border-gray-300 font-sans transform scale-[0.98] transition-transform origin-top">
                  <div className="border-b-2 border-[#111116] pb-2 mb-4 flex justify-between items-end font-mono text-[10px]">
                    <span className="font-bold text-[#E0533C]">PARVEJ ALAM SULEMANALI ANSARI // DOSSIER PREVIEW</span>
                    <span className="text-gray-500">FORMAT: A4 PORTRAIT</span>
                  </div>
                  <PrintDossier options={options} />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/60 shrink-0">
          <button
            type="button"
            onClick={() => setIsPreviewActive(!isPreviewActive)}
            className={`w-full sm:w-auto px-4 py-2.5 border font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-xs cursor-pointer ${
              isPreviewActive
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                : 'border-white/20 hover:border-white text-gray-300 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>{isPreviewActive ? 'EXIT A4 PREVIEW MODE' : 'A4 PREVIEW MODE'}</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 border border-white/15 hover:border-white/30 font-mono text-xs uppercase tracking-wider text-gray-400 hover:text-white transition-colors rounded-xs cursor-pointer"
            >
              CANCEL
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#E0533C] hover:bg-[#c94530] text-white font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg rounded-xs cursor-pointer transition-all hover:scale-[1.02]"
            >
              <Printer className="w-4 h-4" />
              <span>PRINT / SAVE AS PDF</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
