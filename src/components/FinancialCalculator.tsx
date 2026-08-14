import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, DollarSign, Percent, TrendingUp, RefreshCw, X } from 'lucide-react';

interface FinancialCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({ isOpen, onClose }) => {
  const [calcTab, setCalcTab] = useState<'WACC' | 'DCF' | 'DUPONT'>('WACC');

  // WACC State
  const [equityValue, setEquityValue] = useState(70); // 70%
  const [costOfEquity, setCostOfEquity] = useState(10.5); // 10.5%
  const [costOfDebt, setCostOfDebt] = useState(6.0); // 6.0%
  const [taxRate, setTaxRate] = useState(25); // 25%

  // DCF State
  const [baseFCF, setBaseFCF] = useState(5.0); // $5M
  const [fcfGrowth, setFcfGrowth] = useState(8.0); // 8%
  const [dcfWacc, setDcfWacc] = useState(9.5); // 9.5%
  const [terminalGrowth, setTerminalGrowth] = useState(2.5); // 2.5%

  // Dupont State
  const [netProfitMargin, setNetProfitMargin] = useState(12.0); // 12%
  const [assetTurnover, setAssetTurnover] = useState(1.4); // 1.4x
  const [financialLeverage, setFinancialLeverage] = useState(2.1); // 2.1x

  // WACC Calculation
  const debtWeight = 100 - equityValue;
  const afterTaxCostOfDebt = costOfDebt * (1 - taxRate / 100);
  const calculatedWACC = (equityValue / 100) * costOfEquity + (debtWeight / 100) * afterTaxCostOfDebt;

  // DCF Calculation (5-Year Forecast + Gordon Growth Terminal Value)
  const forecastYears = 5;
  let totalPVFCF = 0;
  let lastYearFCF = baseFCF;

  for (let year = 1; year <= forecastYears; year++) {
    lastYearFCF = lastYearFCF * (1 + fcfGrowth / 100);
    const pv = lastYearFCF / Math.pow(1 + dcfWacc / 100, year);
    totalPVFCF += pv;
  }

  const terminalValue = (lastYearFCF * (1 + terminalGrowth / 100)) / ((dcfWacc - terminalGrowth) / 100);
  const pvTerminalValue = terminalValue / Math.pow(1 + dcfWacc / 100, forecastYears);
  const calculatedEnterpriseValue = totalPVFCF + pvTerminalValue;

  // Dupont Calculation
  const calculatedROE = (netProfitMargin / 100) * assetTurnover * financialLeverage * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-[#121214] border border-white/20 text-white rounded-sm overflow-hidden shadow-2xl my-auto"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-black/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <h3 className="font-serif text-xl tracking-tight text-white">
              PARVEJ FINANCIAL MODELING SIMULATOR
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-white/20 hover:border-white text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 bg-white/5">
          <button
            onClick={() => setCalcTab('WACC')}
            className={`flex-1 py-3 text-xs font-mono uppercase tracking-widest transition-all ${
              calcTab === 'WACC' ? 'bg-white text-black font-bold' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            WACC CALCULATOR
          </button>
          <button
            onClick={() => setCalcTab('DCF')}
            className={`flex-1 py-3 text-xs font-mono uppercase tracking-widest transition-all ${
              calcTab === 'DCF' ? 'bg-white text-black font-bold' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            DCF VALUATION MINI-ENGINE
          </button>
          <button
            onClick={() => setCalcTab('DUPONT')}
            className={`flex-1 py-3 text-xs font-mono uppercase tracking-widest transition-all ${
              calcTab === 'DUPONT' ? 'bg-white text-black font-bold' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            DUPONT ROE ANALYSIS
          </button>
        </div>

        {/* Tab 1: WACC */}
        {calcTab === 'WACC' && (
          <div className="p-6 space-y-6">
            <div className="text-xs text-[#8E8E93] font-mono">
              Calculates Weighted Average Cost of Capital using Capital Asset Pricing Model (CAPM) debt-equity tax shields.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Equity Weight (E/V)</span>
                  <span className="text-emerald-400 font-bold">{equityValue}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={equityValue}
                  onChange={(e) => setEquityValue(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="text-[10px] text-[#8E8E93] font-mono">
                  Implied Debt Weight (D/V): {debtWeight}%
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Cost of Equity (Ke)</span>
                  <span className="text-emerald-400 font-bold">{costOfEquity}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="0.5"
                  value={costOfEquity}
                  onChange={(e) => setCostOfEquity(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Cost of Debt (Kd)</span>
                  <span className="text-emerald-400 font-bold">{costOfDebt}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="0.5"
                  value={costOfDebt}
                  onChange={(e) => setCostOfDebt(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Corporate Tax Rate (t)</span>
                  <span className="text-emerald-400 font-bold">{taxRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-6 border border-emerald-500/40 bg-emerald-500/10 rounded-sm text-center">
              <div className="text-xs font-mono uppercase text-emerald-300 tracking-widest">
                DERIVED WEIGHTED AVERAGE COST OF CAPITAL (WACC)
              </div>
              <div className="font-serif text-4xl sm:text-5xl font-normal text-white mt-2">
                {calculatedWACC.toFixed(2)}%
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: DCF */}
        {calcTab === 'DCF' && (
          <div className="p-6 space-y-6">
            <div className="text-xs text-[#8E8E93] font-mono">
              Simulates a 5-Year Free Cash Flow to Firm (FCFF) Discounted Cash Flow valuation with Gordon Growth Terminal Value.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Base Free Cash Flow (FCF Y0)</span>
                  <span className="text-emerald-400 font-bold">${baseFCF}M</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={baseFCF}
                  onChange={(e) => setBaseFCF(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>5-Yr FCF Growth Rate (g)</span>
                  <span className="text-emerald-400 font-bold">{fcfGrowth}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="25"
                  step="0.5"
                  value={fcfGrowth}
                  onChange={(e) => setFcfGrowth(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Discount Rate (WACC)</span>
                  <span className="text-emerald-400 font-bold">{dcfWacc}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="18"
                  step="0.5"
                  value={dcfWacc}
                  onChange={(e) => setDcfWacc(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Terminal Growth Rate</span>
                  <span className="text-emerald-400 font-bold">{terminalGrowth}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.1"
                  value={terminalGrowth}
                  onChange={(e) => setTerminalGrowth(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-6 border border-emerald-500/40 bg-emerald-500/10 rounded-sm text-center">
              <div className="text-xs font-mono uppercase text-emerald-300 tracking-widest">
                IMPLIED CORPORATE ENTERPRISE VALUE (EV)
              </div>
              <div className="font-serif text-4xl sm:text-5xl font-normal text-white mt-2">
                ${calculatedEnterpriseValue.toFixed(2)}M
              </div>
              <div className="text-[11px] font-mono text-[#8E8E93] mt-2">
                PV of 5-Yr FCFs: ${totalPVFCF.toFixed(2)}M | PV of Terminal Value: ${pvTerminalValue.toFixed(2)}M
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: DUPONT */}
        {calcTab === 'DUPONT' && (
          <div className="p-6 space-y-6">
            <div className="text-xs text-[#8E8E93] font-mono">
              3-Way Dupont ROE Analysis: Operating Efficiency (Net Margin) × Asset Efficiency (Turnover) × Capital Structure (Leverage).
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Net Profit Margin</span>
                  <span className="text-emerald-400 font-bold">{netProfitMargin}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="30"
                  value={netProfitMargin}
                  onChange={(e) => setNetProfitMargin(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Asset Turnover</span>
                  <span className="text-emerald-400 font-bold">{assetTurnover}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.1"
                  value={assetTurnover}
                  onChange={(e) => setAssetTurnover(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Financial Leverage</span>
                  <span className="text-emerald-400 font-bold">{financialLeverage}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  value={financialLeverage}
                  onChange={(e) => setFinancialLeverage(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-6 border border-emerald-500/40 bg-emerald-500/10 rounded-sm text-center">
              <div className="text-xs font-mono uppercase text-emerald-300 tracking-widest">
                DERIVED RETURN ON EQUITY (ROE)
              </div>
              <div className="font-serif text-4xl sm:text-5xl font-normal text-white mt-2">
                {calculatedROE.toFixed(2)}%
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 bg-black/60 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-6 bg-white text-black font-mono text-xs uppercase tracking-widest font-semibold hover:bg-[#E5E5EA] transition-all"
          >
            CLOSE SIMULATOR
          </button>
        </div>
      </motion.div>
    </div>
  );
};
