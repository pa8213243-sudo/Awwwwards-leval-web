import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Sliders,
  DollarSign,
  Percent,
  BarChart3,
  Layers,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Calculator,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { soundFx } from '../lib/sound';
import { SectionProgressHeader } from './SectionProgressHeader';
import { VerticalSectionProgressBar } from './VerticalSectionProgressBar';
import { ScrollReveal } from './KineticTypography';
import { SectionBackgroundLayer } from './SectionBackgroundLayer';

import { StripedTypography } from './StripedTypography';

export const FinancialSandbox: React.FC = () => {
  // Live sensitivity parameters
  const [revenueBase, setRevenueBase] = useState(50); // $50M Base Revenue
  const [growthRate, setGrowthRate] = useState(18); // 18% CAGR
  const [ebitdaMargin, setEbitdaMargin] = useState(24); // 24% EBITDA Margin
  const [waccDiscount, setWaccDiscount] = useState(9.5); // 9.5% WACC
  const [exitMultiple, setExitMultiple] = useState(14); // 14x EV/EBITDA
  const [taxRate, setTaxRate] = useState(21); // 21% US Corp Tax Rate

  // Recalculate 5-Year Forecast & DCF Valuation in real-time
  const valuation = useMemo(() => {
    const years = [1, 2, 3, 4, 5];
    let currentRev = revenueBase;
    let totalPvFcf = 0;
    const forecasts = [];

    for (let yr of years) {
      currentRev = currentRev * (1 + growthRate / 100);
      const ebitda = currentRev * (ebitdaMargin / 100);
      const ebit = ebitda * 0.85; // after D&A
      const nopat = ebit * (1 - taxRate / 100);
      const fcf = nopat + ebitda * 0.15 - currentRev * 0.05; // FCF approximation
      const discountFactor = 1 / Math.pow(1 + waccDiscount / 100, yr);
      const pvFcf = fcf * discountFactor;
      totalPvFcf += pvFcf;

      forecasts.push({
        year: `FY${2025 + yr}`,
        revenue: Math.round(currentRev * 10) / 10,
        ebitda: Math.round(ebitda * 10) / 10,
        fcf: Math.round(fcf * 10) / 10,
        pvFcf: Math.round(pvFcf * 10) / 10,
      });
    }

    const terminalYearEbitda = forecasts[4].ebitda;
    const terminalValue = terminalYearEbitda * exitMultiple;
    const pvTerminalValue = terminalValue / Math.pow(1 + waccDiscount / 100, 5);
    const enterpriseValue = totalPvFcf + pvTerminalValue;
    const netDebt = 12; // $12M assumed net debt
    const equityValue = enterpriseValue - netDebt;
    const sharesOutstanding = 10; // 10M shares
    const impliedSharePrice = Math.max(1, equityValue / sharesOutstanding);

    return {
      forecasts,
      totalPvFcf: Math.round(totalPvFcf * 10) / 10,
      terminalValue: Math.round(terminalValue * 10) / 10,
      pvTerminalValue: Math.round(pvTerminalValue * 10) / 10,
      enterpriseValue: Math.round(enterpriseValue * 10) / 10,
      equityValue: Math.round(equityValue * 10) / 10,
      impliedSharePrice: Math.round(impliedSharePrice * 100) / 100,
    };
  }, [revenueBase, growthRate, ebitdaMargin, waccDiscount, exitMultiple, taxRate]);

  const handleReset = () => {
    soundFx.playClick();
    setRevenueBase(50);
    setGrowthRate(18);
    setEbitdaMargin(24);
    setWaccDiscount(9.5);
    setExitMultiple(14);
    setTaxRate(21);
  };

  return (
    <div id="sandbox" className="relative space-y-6 w-full py-8 md:py-12 border-b border-black/10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 bg-[#F3F2EE] overflow-hidden">
      {/* CONTEXTUAL PROFESSIONAL BACKGROUND PHOTO */}
      <SectionBackgroundLayer sectionKey="sandbox" opacity={0.2} />

      {/* ELEGANT FIXED VERTICAL PROGRESS BAR ON RIGHT EDGE */}
      <VerticalSectionProgressBar targetId="sandbox" accentColor="#E0533C" label="LAB" sectionCode="04" isLightBg={true} />

      {/* SECTION PROGRESS HEADER WITH LIVE PROGRESS BAR */}
      <SectionProgressHeader
        sceneCode="[SCENE 04 // VALUATION SANDBOX & LAB]"
        title="VALUATION"
        subtitle="Live DCF Sensitivity, Pro-Forma Forecasts & Implied Share Price Simulation"
        badge="100% RECONCILED"
        accentColor="#E0533C"
        sectionId="sandbox"
        isSticky={true}
      />

      <ScrollReveal delay={0.1}>
        <div className="w-full bg-white border-2 border-dashed border-black/25 p-5 md:p-6 rounded-none shadow-md relative overflow-hidden text-[#111116] select-none">
          <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-black" />
          <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-black" />
            {/* Background Graphic Grid */}
            <div className="absolute inset-0 brutalist-grid opacity-10 pointer-events-none" />

            {/* HEADER BAR */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-black/10 pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#E0533C] uppercase font-bold mb-0.5">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>INTERACTIVE FINANCIAL LAB // REAL-TIME VALUATION ENGINE</span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-bold tracking-tight uppercase text-[#111116]">
                  Live DCF Sensitivity & Enterprise Valuation Sandbox
                </h3>
                <p className="text-xs text-[#555555] max-w-xl font-sans mt-0.5">
                  Adjust the fundamental strategic drivers below to simulate live 5-year pro-forma cash flows, discount factors, and implied enterprise valuation.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-[#F9F9F7] hover:bg-black/5 border border-black/15 font-mono text-[11px] uppercase tracking-wider text-[#444444] hover:text-black flex items-center gap-1.5 rounded-none transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>RESET MODEL</span>
                </button>

                <div className="px-3 py-1 bg-emerald-50 border border-emerald-500/40 text-emerald-800 font-mono text-[10px] font-bold uppercase rounded-none">
                  IMA COMPLIANT
                </div>
              </div>
            </div>

            {/* 2-COLUMN LAB GRID: CONTROLS & LIVE OUTPUTS */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* LEFT 5 COLS: INTERACTIVE STRATEGIC SLIDERS */}
              <div className="lg:col-span-5 space-y-4 bg-[#F9F9F7] border border-black/10 p-4 rounded-none">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#555555] font-bold border-b border-black/10 pb-2 flex items-center justify-between">
                  <span>STRATEGIC MODEL DRIVERS</span>
                  <Sliders className="w-3.5 h-3.5 text-[#E0533C]" />
                </div>

                {/* Slider 1: Base Revenue */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#555555]">Base Revenue (LTM)</span>
                    <span className="font-bold text-[#111116]">${revenueBase}M USD</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={200}
                    step={5}
                    value={revenueBase}
                    onChange={(e) => {
                      soundFx.playButton(500, 0.01);
                      setRevenueBase(Number(e.target.value));
                    }}
                    className="w-full accent-[#E0533C] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#777777]">
                    <span>$10M</span>
                    <span>$200M</span>
                  </div>
                </div>

                {/* Slider 2: Revenue Growth CAGR */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#555555]">5-Yr Revenue CAGR</span>
                    <span className="font-bold text-emerald-700">+{growthRate}% YoY</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={45}
                    step={1}
                    value={growthRate}
                    onChange={(e) => {
                      soundFx.playButton(550, 0.01);
                      setGrowthRate(Number(e.target.value));
                    }}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#777777]">
                    <span>2% (Mature)</span>
                    <span>45% (Hyper-growth)</span>
                  </div>
                </div>

                {/* Slider 3: Target EBITDA Margin */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#555555]">Target EBITDA Margin</span>
                    <span className="font-bold text-blue-700">{ebitdaMargin}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={1}
                    value={ebitdaMargin}
                    onChange={(e) => {
                      soundFx.playButton(600, 0.01);
                      setEbitdaMargin(Number(e.target.value));
                    }}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#777777]">
                    <span>5%</span>
                    <span>50%</span>
                  </div>
                </div>

                {/* Slider 4: WACC Hurdle Rate */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#555555]">WACC Discount Rate</span>
                    <span className="font-bold text-amber-700">{waccDiscount}%</span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={18}
                    step={0.5}
                    value={waccDiscount}
                    onChange={(e) => {
                      soundFx.playButton(650, 0.01);
                      setWaccDiscount(Number(e.target.value));
                    }}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#777777]">
                    <span>6.0% (Low Risk)</span>
                    <span>18.0% (High Beta)</span>
                  </div>
                </div>

                {/* Slider 5: Exit EV/EBITDA Multiple */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#555555]">Exit Multiple (EV/EBITDA)</span>
                    <span className="font-bold text-purple-700">{exitMultiple}x</span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={28}
                    step={1}
                    value={exitMultiple}
                    onChange={(e) => {
                      soundFx.playButton(700, 0.01);
                      setExitMultiple(Number(e.target.value));
                    }}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#777777]">
                    <span>6x (Industrial)</span>
                    <span>28x (SaaS / High-Tech)</span>
                  </div>
                </div>
              </div>

              {/* RIGHT 7 COLS: REAL-TIME VALUATION & PRO-FORMA TELEMETRY */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-5">

                {/* TOP 3 EXECUTIVE KPI METRIC CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3.5 bg-white border border-[#E0533C]/40 rounded-none shadow-xs">
                    <div className="text-[9px] font-mono text-[#666666] uppercase font-bold mb-0.5">
                      ENTERPRISE VALUE (EV)
                    </div>
                    <div className="font-serif text-xl sm:text-2xl font-bold text-[#E0533C]">
                      ${valuation.enterpriseValue}M
                    </div>
                    <div className="text-[9px] font-mono text-[#888888] mt-0.5">
                      PV FCF + PV Terminal Val
                    </div>
                  </div>

                  <div className="p-3.5 bg-white border border-emerald-500/40 rounded-none shadow-xs">
                    <div className="text-[9px] font-mono text-[#666666] uppercase font-bold mb-0.5">
                      IMPLIED SHARE PRICE
                    </div>
                    <div className="font-serif text-xl sm:text-2xl font-bold text-emerald-700">
                      ${valuation.impliedSharePrice}
                    </div>
                    <div className="text-[9px] font-mono text-[#888888] mt-0.5">
                      10M Shares Outstanding
                    </div>
                  </div>

                  <div className="p-3.5 bg-white border border-blue-500/40 rounded-none shadow-xs">
                    <div className="text-[9px] font-mono text-[#666666] uppercase font-bold mb-0.5">
                      PV OF TERMINAL VALUE
                    </div>
                    <div className="font-serif text-xl sm:text-2xl font-bold text-blue-700">
                      ${valuation.pvTerminalValue}M
                    </div>
                    <div className="text-[9px] font-mono text-[#888888] mt-0.5">
                      {exitMultiple}x FY2030 EBITDA
                    </div>
                  </div>
                </div>

                {/* 5-YEAR PRO-FORMA FINANCIAL STATEMENT LEDGER */}
                <div className="border border-black/10 bg-[#F9F9F7] rounded-none p-3.5 overflow-x-auto">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#333333] font-bold mb-2.5 flex items-center justify-between">
                    <span>5-YEAR PRO-FORMA CASH FLOW PROJECTIONS ($M USD)</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">DYNAMIC RECALCULATION</span>
                  </div>

                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-black/10 text-[10px] text-[#666666]">
                        <th className="pb-2 font-bold">METRIC / LINE ITEM</th>
                        {valuation.forecasts.map((f, i) => (
                          <th key={i} className="pb-2 text-right font-bold text-[#111116]">{f.year}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 text-[11px]">
                      <tr>
                        <td className="py-1.5 text-[#444444] font-medium">Revenue</td>
                        {valuation.forecasts.map((f, i) => (
                          <td key={i} className="py-1.5 text-right font-bold text-[#111116]">${f.revenue}M</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-1.5 text-[#444444] font-medium">EBITDA ({ebitdaMargin}%)</td>
                        {valuation.forecasts.map((f, i) => (
                          <td key={i} className="py-1.5 text-right text-blue-700 font-semibold">${f.ebitda}M</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-1.5 text-[#444444] font-medium">Free Cash Flow (FCF)</td>
                        {valuation.forecasts.map((f, i) => (
                          <td key={i} className="py-1.5 text-right text-emerald-700 font-semibold">${f.fcf}M</td>
                        ))}
                      </tr>
                      <tr className="bg-white font-bold">
                        <td className="py-1.5 text-[#111116]">Discounted PV @ {waccDiscount}%</td>
                        {valuation.forecasts.map((f, i) => (
                          <td key={i} className="py-1.5 text-right text-[#E0533C]">${f.pvFcf}M</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* SENSITIVITY MATRIX SUMMARY */}
                <div className="p-3 bg-white border border-black/10 rounded-none font-mono text-[11px] text-[#444444] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      <strong>Strategic Takeaway:</strong> A 100 bps expansion in EBITDA margin adds <strong>+${(revenueBase * 0.01 * exitMultiple / Math.pow(1 + waccDiscount / 100, 5)).toFixed(1)}M</strong> to Enterprise Value.
                    </span>
                  </div>
                  <span className="text-[#E0533C] font-bold shrink-0">WACC: {waccDiscount}%</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    );
  };
