import React from 'react';
import { 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Database, 
  Code2, 
  FileSpreadsheet, 
  Presentation, 
  BarChart3, 
  Mail, 
  Linkedin, 
  Github, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  DollarSign
} from 'lucide-react';
import { 
  PERSONAL_INFO, 
  PROJECTS, 
  TIMELINE, 
  CERTIFICATIONS, 
  SKILL_CATEGORIES, 
  PROCESS_STAGES 
} from '../data/portfolioData';
import { PRICING_CONFIG } from '../data/pricingConfig';

export interface PrintOptions {
  includeModels: boolean;
  includeTelemetry: boolean;
  includeTimeline: boolean;
  includeCerts: boolean;
  includeSkills: boolean;
  includeProcess: boolean;
  includePricing: boolean;
  theme: 'light' | 'dark';
}

export const DEFAULT_PRINT_OPTIONS: PrintOptions = {
  includeModels: true,
  includeTelemetry: true,
  includeTimeline: true,
  includeCerts: true,
  includeSkills: true,
  includeProcess: true,
  includePricing: true,
  theme: 'light',
};

interface PrintDossierProps {
  options: PrintOptions;
}

export const PrintDossier: React.FC<PrintDossierProps> = ({ options }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isDark = options.theme === 'dark';

  return (
    <div
      id="print-portfolio-dossier"
      className={`print-container ${
        isDark ? 'bg-[#0B0B0E] text-[#F3F4F6]' : 'bg-white text-[#111116]'
      } w-full text-left font-sans text-xs leading-relaxed`}
    >
      {/* ============================================================ */}
      {/* 1. EXECUTIVE HEADER & COVER SUMMARY                          */}
      {/* ============================================================ */}
      <header className={`p-8 border-b-2 ${isDark ? 'border-white/20 bg-[#121218]' : 'border-black/20 bg-[#F9FAFB]'}`}>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 bg-[#E0533C] text-white">
                EXECUTIVE DOSSIER
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-emerald-600">
                • VERIFIED PORTFOLIO SPECIFICATION
              </span>
            </div>

            <h1 className={`font-serif text-3xl md:text-4xl font-bold tracking-tight uppercase ${isDark ? 'text-white' : 'text-black'}`}>
              {PERSONAL_INFO.fullName}
            </h1>

            <p className={`font-mono text-sm font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              {PERSONAL_INFO.role} — {PERSONAL_INFO.subRole}
            </p>

            <p className={`text-xs max-w-2xl mt-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {PERSONAL_INFO.aboutBio}
            </p>
          </div>

          {/* Contact & Meta Column */}
          <div className={`p-4 border rounded-sm space-y-1.5 font-mono text-[11px] min-w-[240px] ${
            isDark ? 'bg-black/50 border-white/15 text-gray-300' : 'bg-white border-gray-300 text-gray-800'
          }`}>
            <div className="font-bold border-b pb-1 border-gray-400/30 text-xs uppercase">
              CONTACT & VERIFICATION
            </div>
            <div><strong className="text-gray-500">Email:</strong> {PERSONAL_INFO.email}</div>
            <div><strong className="text-gray-500">Location:</strong> {PERSONAL_INFO.location}</div>
            <div><strong className="text-gray-500">CMA Merit:</strong> 380/500 (1st Attempt)</div>
            <div><strong className="text-gray-500">Export Date:</strong> {currentDate}</div>
            <div><strong className="text-gray-500">LinkedIn:</strong> linkedin.com/in/parvej-alam...</div>
          </div>
        </div>

        {/* Executive KPI Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-300/30">
          {PERSONAL_INFO.stats.map((stat, idx) => (
            <div key={idx} className={`p-3 border rounded-xs ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
              <div className="font-serif text-xl font-bold text-[#E0533C]">{stat.value}</div>
              <div className="text-[10px] font-mono tracking-wider uppercase text-gray-500 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </header>

      <div className="p-8 space-y-10">

        {/* ============================================================ */}
        {/* 2. CAREER & ACADEMIC CHRONOLOGY (TIMELINE)                   */}
        {/* ============================================================ */}
        {options.includeTimeline && (
          <section className="break-inside-avoid space-y-4">
            <div className="flex items-center gap-3 border-b-2 border-[#E0533C] pb-2">
              <Calendar className="w-4 h-4 text-[#E0533C]" />
              <h2 className="font-serif text-lg font-bold uppercase tracking-tight">
                1. Career & Academic Chronology
              </h2>
            </div>

            <div className="space-y-4">
              {TIMELINE.map((item) => (
                <div 
                  key={item.id}
                  className={`p-4 border rounded-sm ${
                    isDark ? 'bg-[#14141C] border-white/15' : 'bg-gray-50/70 border-gray-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <span className="font-serif text-sm font-bold text-[#E0533C]">
                      {item.roleOrDegree}
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 bg-gray-200 text-gray-800 rounded-xs font-bold w-fit">
                      {item.period}
                    </span>
                  </div>

                  <div className="font-mono text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {item.organization} • <span className="text-emerald-600 font-bold">{item.type}</span>
                  </div>

                  <p className="text-xs mb-3 text-gray-700 dark:text-gray-300">{item.description}</p>

                  <div className="space-y-1 pl-3 border-l-2 border-emerald-500/50">
                    {item.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 3. FINANCIAL MODELING & CASE STUDIES                         */}
        {/* ============================================================ */}
        {options.includeModels && (
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b-2 border-[#E0533C] pb-2">
              <FileSpreadsheet className="w-4 h-4 text-[#E0533C]" />
              <h2 className="font-serif text-lg font-bold uppercase tracking-tight">
                2. Financial Modeling, Valuation & Advisory Case Studies
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROJECTS.map((project) => (
                <div
                  key={project.id}
                  className={`p-4 border rounded-sm break-inside-avoid flex flex-col justify-between ${
                    isDark ? 'bg-[#14141C] border-white/15' : 'bg-gray-50/70 border-gray-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 bg-blue-100 text-blue-900 rounded-xs">
                        {project.category}
                      </span>
                      <span className="text-[9px] font-mono text-gray-500 font-semibold">{project.year}</span>
                    </div>

                    <h3 className="font-serif text-sm font-bold text-gray-900 dark:text-white mb-1">
                      {project.title}
                    </h3>
                    <p className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold mb-2">
                      Client / Scope: {project.client} • {project.impactMetric}
                    </p>

                    <p className="text-xs text-gray-700 dark:text-gray-300 mb-3">
                      {project.summary}
                    </p>

                    {/* Approach */}
                    <div className="mb-3 space-y-1">
                      <div className="text-[10px] font-mono font-bold uppercase text-gray-500">Methodology & Approach:</div>
                      {project.approach.map((app, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-gray-600 dark:text-gray-400">
                          <span className="text-[#E0533C] font-bold">›</span>
                          <span>{app}</span>
                        </div>
                      ))}
                    </div>

                    {/* Deliverables */}
                    <div className="mb-3">
                      <div className="text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Deliverables:</div>
                      <div className="flex flex-wrap gap-1">
                        {project.deliverables.map((del, idx) => (
                          <span 
                            key={idx} 
                            className={`text-[9px] font-mono px-1.5 py-0.5 border rounded-xs ${
                              isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-white border-gray-300 text-gray-800'
                            }`}
                          >
                            {del}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tools Stack */}
                  <div className="pt-2 border-t border-gray-300/30 flex flex-wrap gap-1">
                    {project.tools.map((t, idx) => (
                      <span key={idx} className="text-[9px] font-mono text-gray-600 dark:text-gray-400 bg-gray-200/60 dark:bg-white/10 px-1 py-0.5 rounded-xs">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 4. POWER BI, DAX & DATA ENGINEERING TELEMETRY                */}
        {/* ============================================================ */}
        {options.includeTelemetry && (
          <section className="space-y-4 break-inside-avoid">
            <div className="flex items-center gap-3 border-b-2 border-[#3B82F6] pb-2">
              <Database className="w-4 h-4 text-[#3B82F6]" />
              <h2 className="font-serif text-lg font-bold uppercase tracking-tight">
                3. Power BI, Star Schema & DAX Telemetry Architecture
              </h2>
            </div>

            <div className="space-y-4">
              {/* Stage 1 */}
              <div className={`p-4 border rounded-sm ${isDark ? 'bg-[#14141C] border-white/15' : 'bg-gray-50/70 border-gray-300'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-sm font-bold text-blue-600 dark:text-blue-400">
                    STAGE 01 // DATA CLEANING & POWER QUERY M PIPELINES
                  </h3>
                  <span className="text-[9px] font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-xs">
                    1,240,000+ ROWS
                  </span>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                  Power Query M-Code script unifies multi-subsidiary ERP ledgers into a normalized, audit-ready data model with automated data type casting.
                </p>
                <div className="p-3 bg-gray-900 text-emerald-400 font-mono text-[10px] rounded-xs overflow-x-auto">
                  <pre>{`let
  Source = Sql.Database("corp-sql.internal", "ERP_Finance"),
  Filtered = Table.SelectRows(Source, each [Posting_Date] >= #date(2023, 1, 1)),
  CleanCurrency = Table.TransformColumnTypes(Filtered, {{"Amount_USD", Currency.Type}, {"EBITDA_Impact", Percentage.Type}})
in CleanCurrency`}</pre>
                </div>
              </div>

              {/* Stage 2 */}
              <div className={`p-4 border rounded-sm ${isDark ? 'bg-[#14141C] border-white/15' : 'bg-gray-50/70 border-gray-300'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-sm font-bold text-blue-600 dark:text-blue-400">
                    STAGE 02 // DAX TIME INTELLIGENCE & STAR SCHEMA MODELING
                  </h3>
                  <span className="text-[9px] font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-xs">
                    85+ DAX MEASURES
                  </span>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                  Star schema architecture optimized with DAX Time Intelligence delivers sub-second executive drill-down across 12 fiscal periods.
                </p>
                <div className="p-3 bg-gray-900 text-blue-300 font-mono text-[10px] rounded-xs overflow-x-auto">
                  <pre>{`EBITDA_YoY_% = 
VAR CurrentYTD = CALCULATE([Total_EBITDA], DATESYTD('Calendar'[Date]))
VAR PriorYTD   = CALCULATE([Total_EBITDA], SAMEPERIODLASTYEAR('Calendar'[Date]))
RETURN DIVIDE(CurrentYTD - PriorYTD, PriorYTD, 0)`}</pre>
                </div>
              </div>

              {/* Stage 3 */}
              <div className={`p-4 border rounded-sm ${isDark ? 'bg-[#14141C] border-white/15' : 'bg-gray-50/70 border-gray-300'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-sm font-bold text-blue-600 dark:text-blue-400">
                    STAGE 03 // ROW-LEVEL SECURITY (RLS) & GOVERNANCE
                  </h3>
                  <span className="text-[9px] font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-xs">
                    ISO 27001 AUDITED
                  </span>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                  Dynamic Row-Level Security ensures department heads and C-suite executives only view authorized P&L sub-ledgers with zero data leakage.
                </p>
                <div className="p-3 bg-gray-900 text-purple-300 font-mono text-[10px] rounded-xs overflow-x-auto">
                  <pre>{`[User_Group_ID] = USERPRINCIPALNAME() 
&& [Department_Access] IN 
   SELECTCOLUMNS(LOOKUPVALUE(UserRoles, UserRoles[Email], USERPRINCIPALNAME()), "AccessRole")`}</pre>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 5. SKILLS & COMPETENCIES MATRIX                              */}
        {/* ============================================================ */}
        {options.includeSkills && (
          <section className="space-y-4 break-inside-avoid">
            <div className="flex items-center gap-3 border-b-2 border-emerald-600 pb-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h2 className="font-serif text-lg font-bold uppercase tracking-tight">
                4. Core Competencies & Technical Architecture
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SKILL_CATEGORIES.map((cat, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 border rounded-sm ${
                    isDark ? 'bg-[#14141C] border-white/15' : 'bg-gray-50/70 border-gray-300'
                  }`}
                >
                  <h3 className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1 uppercase tracking-wider">
                    {cat.category}
                  </h3>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-3">{cat.description}</p>

                  <div className="space-y-2">
                    {cat.skills.map((s, sIdx) => (
                      <div key={sIdx} className="border-t border-gray-300/30 pt-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>{s.name}</span>
                          <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            {s.proficiency}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5">{s.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 6. VERIFIED CERTIFICATIONS GALLERY                           */}
        {/* ============================================================ */}
        {options.includeCerts && (
          <section className="space-y-4 break-inside-avoid">
            <div className="flex items-center gap-3 border-b-2 border-purple-600 pb-2">
              <Award className="w-4 h-4 text-purple-600" />
              <h2 className="font-serif text-lg font-bold uppercase tracking-tight">
                5. Verified Certifications & Credentials ({CERTIFICATIONS.length} Credentials)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CERTIFICATIONS.map((cert) => (
                <div 
                  key={cert.id}
                  className={`p-3 border rounded-sm flex flex-col justify-between ${
                    isDark ? 'bg-[#14141C] border-white/15' : 'bg-gray-50/70 border-gray-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-serif text-xs font-bold text-gray-900 dark:text-white">
                        {cert.title}
                      </span>
                      <span className="text-[9px] font-mono text-gray-500 shrink-0">{cert.date}</span>
                    </div>

                    <div className="text-[10px] font-mono text-purple-700 dark:text-purple-400 font-semibold mb-2">
                      Issuer: {cert.issuer}
                      {cert.credentialId && ` • ID: ${cert.credentialId}`}
                    </div>

                    <div className="space-y-0.5 pl-2 border-l border-purple-400/40">
                      {cert.skillsVerified.map((sk, i) => (
                        <div key={i} className="text-[10px] text-gray-600 dark:text-gray-400">
                          • {sk}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 7. 5-STAGE METHODOLOGY & PRICING STRUCTURE                   */}
        {/* ============================================================ */}
        {options.includeProcess && (
          <section className="space-y-4 break-inside-avoid">
            <div className="flex items-center gap-3 border-b-2 border-amber-600 pb-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <h2 className="font-serif text-lg font-bold uppercase tracking-tight">
                6. 5-Stage Execution Methodology
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 font-mono text-[10px]">
              {PROCESS_STAGES.map((stage) => (
                <div 
                  key={stage.number}
                  className={`p-3 border rounded-sm ${
                    isDark ? 'bg-[#14141C] border-white/15' : 'bg-gray-50/70 border-gray-300'
                  }`}
                >
                  <div className="font-bold text-amber-600">{stage.number} // {stage.timeframe}</div>
                  <div className="font-serif text-xs font-bold text-gray-900 dark:text-white mt-0.5 mb-1">{stage.title}</div>
                  <p className="text-[9px] text-gray-600 dark:text-gray-400 mb-2">{stage.subtitle}</p>
                  <div className="text-gray-700 dark:text-gray-300 border-t pt-1 border-gray-300/30">
                    <strong className="text-gray-500">Output:</strong> {stage.deliverable}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {options.includePricing && (
          <section className="space-y-4 break-inside-avoid">
            <div className="flex items-center gap-3 border-b-2 border-emerald-600 pb-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <h2 className="font-serif text-lg font-bold uppercase tracking-tight">
                7. Engagement Models & Advisory Rates
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {PRICING_CONFIG.map((plan) => (
                <div 
                  key={plan.id}
                  className={`p-3 border rounded-sm flex flex-col justify-between ${
                    isDark ? 'bg-[#14141C] border-white/15' : 'bg-gray-50/70 border-gray-300'
                  }`}
                >
                  <div>
                    <span className="text-[9px] font-mono text-gray-500 block uppercase font-bold">
                      {plan.category}
                    </span>
                    <h3 className="font-serif text-xs font-bold text-gray-900 dark:text-white mt-1 mb-2">
                      {plan.title}
                    </h3>
                    
                    <div className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                      ${plan.startingPriceUsd.toLocaleString()} USD / €{plan.startingPriceEur.toLocaleString()} EUR
                    </div>

                    <p className="text-[10px] text-gray-500 mb-2 font-mono">
                      Timeline: {plan.timeline}
                    </p>

                    <div className="space-y-1 border-t pt-2 border-gray-300/30 text-[10px] text-gray-600 dark:text-gray-400">
                      {plan.deliverables.map((del, idx) => (
                        <div key={idx}>• {del}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 8. FOOTER ATTESTATION                                        */}
        {/* ============================================================ */}
        <footer className={`p-4 border-t-2 border-gray-400 text-center font-mono text-[10px] text-gray-500 space-y-1 ${
          isDark ? 'bg-black/30' : 'bg-gray-50'
        }`}>
          <div>
            PARVEJ ALAM SULEMANALI ANSARI • CMA USA CANDIDATE (PART 1 CLEARED, SCORE: 380/500)
          </div>
          <div>
            Official Repository: https://github.com/pa8213243-sudo/ParvejPortfolio • Inquiries: {PERSONAL_INFO.email}
          </div>
          <div className="text-[9px] text-gray-400">
            Document generated and formatted for executive review. All models, scores, and credentials verifiable upon request.
          </div>
        </footer>

      </div>
    </div>
  );
};
