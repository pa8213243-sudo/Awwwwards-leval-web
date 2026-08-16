import { PERSONAL_INFO, PROJECTS } from '../data/portfolioData';

export interface AIMessagePart {
  text: string;
}

export interface AIHistoryItem {
  role: 'user' | 'model';
  parts: AIMessagePart[];
}

export interface AIRequestPayload {
  prompt: string;
  history?: AIHistoryItem[];
  deviceId?: string;
  deviceCode?: string;
  deviceType?: string;
  os?: string;
  browser?: string;
  honeypot?: string;
}

export interface AIResponse {
  reply: string;
  source: 'gemini' | 'backend' | 'knowledge-engine';
  remainingQueries?: number;
}

// System Instruction for Parwej's AI Copilot
const SYSTEM_INSTRUCTION = `You are AI Sara, the official AI Executive Strategy & Finance Assistant for Parwej Alam (Parvej Alam Sulemanali Ansari)'s personal portfolio website.

ABOUT PARWEJ:
- Identity: Finance Specialist, Strategic Data Analyst, and Certified Management Accountant (CMA USA) Aspirant.
- CMA USA Credential: Cleared CMA USA Part 1 on the 1st attempt with a high merit score of 380/500 (Financial Planning, Performance, Analytics, Internal Controls, and Cost Management).
- Core Skills:
  * 3-Statement Financial Modeling (Integrated P&L, Balance Sheet, Cash Flow, Scenario & Sensitivity Analysis).
  * Valuation & Corporate Finance: Discounted Cash Flow (DCF), Leveraged Buyout (LBO), Comparable Company Analysis (CCA), WACC, Cap Table & Dilution Schedules.
  * Cost & Management Accounting: Activity-Based Costing (ABC), Marginal Costing, Standard Costing, Variance Analysis (Direct Material, Labor, Overhead).
  * Business Intelligence: Power BI, Advanced DAX (CALCULATE, FILTER, Time Intelligence, Star Schema design handling 1.25M+ rows), Power Query ETL.
  * Technical Tools: Advanced Excel (Power Query M, VBA Macros, Financial Modeling), Python (Pandas, NumPy for financial modeling), SQL.
- Flagship Projects:
  1. H2 Ventures: Institutional VC Valuation & Cap Table Dilution Model with dynamic IRR waterfall.
  2. Huskie Motor: Corporate 3-Statement & Capex Amortization Manufacturing Model.
  3. Apex Logistics: Power BI Freight Variance & Star Schema Analytics Dashboard.
  4. Enterprise FP&A: 12-Month Rolling Cash Flow & Capital Budgeting Suite.
- Contact: Email: bhaiparwej70@gmail.com | Location: India / Global Remote Consulting.

RESPONSE GUIDELINES:
1. Provide articulate, executive-ready, highly informative responses.
2. Structure answers with clear bullet points, quantifiable metrics, and bold highlights where appropriate.
3. Keep responses concise yet thorough (approx 80-160 words).
4. Emphasize Parwej's unique ability to bridge strategic finance precision with advanced business intelligence data analytics.
5. If the user asks how to contact, hire, or interview Parwej, provide his direct email: bhaiparwej70@gmail.com and suggest checking out his project models.`;

// Get available Gemini API key from various environments
export function getGeminiApiKey(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  if (typeof process !== 'undefined') {
    if (process.env?.VITE_GEMINI_API_KEY) return process.env.VITE_GEMINI_API_KEY;
    if (process.env?.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  }
  return "";
}

/**
 * Direct Gemini REST API caller (Universal: Works on GitHub Pages, Netlify, Vercel, Localhost)
 */
async function callGeminiRestAPI(prompt: string, history: AIHistoryItem[] = []): Promise<string | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey || apiKey.length < 10) return null;

  // Format contents array according to Google Generative Language REST API format
  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

  // Add relevant history items (alternating user/model)
  let lastRole = '';
  for (const item of history.slice(-6)) {
    if (item && item.parts && item.parts[0]?.text) {
      const role = item.role === 'model' ? 'model' : 'user';
      if (role !== lastRole) {
        contents.push({ role, parts: [{ text: item.parts[0].text }] });
        lastRole = role;
      }
    }
  }

  // Remove trailing user message if already present
  if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
    contents.pop();
  }

  // Append current user prompt
  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  const models = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-flash-latest'
  ];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents,
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        generationConfig: {
          temperature: 0.65,
          maxOutputTokens: 350,
          topP: 0.95
        }
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText && typeof candidateText === 'string' && candidateText.trim().length > 0) {
          return candidateText.trim();
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        console.warn(`[Gemini API] Model ${model} returned error ${res.status}:`, errJson?.error?.message || res.statusText);
      }
    } catch (err) {
      console.warn(`[Gemini API] Fetch failed for ${model}:`, err);
    }
  }

  return null;
}

/**
 * Call server.ts backend endpoint when running in Node.js environment
 */
async function callBackendEndpoint(payload: AIRequestPayload): Promise<{ reply?: string; remainingQueries?: number } | null> {
  try {
    const res = await fetch('/api/ai/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      return {
        reply: data.reply,
        remainingQueries: data.remainingQueries
      };
    }
  } catch {
    // Backend not running (e.g. GitHub Pages or static host)
  }
  return null;
}

/**
 * Intelligent Local Knowledge Engine for Parwej's Portfolio
 * Provides detailed, highly contextual, facts-backed responses if external AI is unreachable
 */
export function generateKnowledgeEngineResponse(prompt: string): string {
  const p = prompt.toLowerCase().trim();

  // 1. CMA Qualifications & Education
  if (p.includes('cma') || p.includes('qualification') || p.includes('exam') || p.includes('degree') || p.includes('education') || p.includes('score')) {
    return `**Parwej's CMA USA Candidacy & Academic Credentials:**

• **CMA USA Part 1 Cleared:** Passed on the first attempt with a merit score of **380 / 500**.
• **Core Subject Competency:** Financial Planning, Performance, Analytics, Cost Management, and Internal Controls.
• **Academic Foundation:** Solid background in Accounting, Corporate Finance, and Financial Statement Analysis.
• **Applied Edge:** Parwej merges classical managerial accounting with modern automated tools (Power BI, DAX, Python, Advanced Excel).

For academic records or verification, please contact Parwej directly at **bhaiparwej70@gmail.com**.`;
  }

  // 2. Financial Modeling, Valuation, DCF, LBO
  if (p.includes('model') || p.includes('valuation') || p.includes('dcf') || p.includes('lbo') || p.includes('forecast') || p.includes('scenario') || p.includes('wacc')) {
    return `**Parwej's Financial Modeling & Corporate Valuation Expertise:**

• **3-Statement Modeling:** Built fully integrated, dynamic Income Statement, Balance Sheet, and Cash Flow models with revolving credit facilities and working capital schedules.
• **Valuation Frameworks:** Expertise in Discounted Cash Flow (DCF), Leveraged Buyout (LBO), and Comparable Company Multiples (CCA).
• **H2 Ventures VC Model:** Built institutional venture capital fund return waterfall models, dynamic Cap Tables, and multi-stage dilution schedules.
• **Huskie Motor Capex Model:** Modeled automotive manufacturing unit economics, fixed vs. variable overhead allocation, and MACRS depreciation.
• **Scenario & Sensitivity Analysis:** Monte Carlo risk distributions and 2-variable Data Tables.

Explore the live models in the **Work & Projects** section or email Parwej at **bhaiparwej70@gmail.com**.`;
  }

  // 3. Power BI & DAX Telemetry
  if (p.includes('power bi') || p.includes('dax') || p.includes('dashboard') || p.includes('business intelligence') || p.includes('powerbi') || p.includes('etl') || p.includes('data model')) {
    return `**Parwej's Power BI & DAX Engineering Capabilities:**

• **Complex DAX Measures:** Skilled in advanced time intelligence, \`CALCULATE\`, \`FILTER\`, \`ALLSELECTED\`, and dynamic KPI variance matrices.
• **Star Schema Architecture:** Designed optimized dimensional models processing **1.25M+ rows** across multi-subsidiary datasets.
• **Executive Dashboards:** Built real-time C-Suite telemetry for cash runway, EBITDA tracking, and supply chain logistics.
• **Power Query ETL:** Automated end-to-end data pipelines using M-code to cleanse, transform, and normalize disparate enterprise ERP feeds.

Check out the interactive Power BI showcases in the **Analytics & BI** section!`;
  }

  // 4. Activity-Based Costing (ABC) & Cost Management
  if (p.includes('cost') || p.includes('abc') || p.includes('variance') || p.includes('overhead') || p.includes('marginal') || p.includes('break-even') || p.includes('breakeven')) {
    return `**Parwej's Cost Accounting & Variance Management Framework:**

• **Activity-Based Costing (ABC):** Eliminates arbitrary volume allocations by tracing costs directly to resource cost drivers.
• **Variance Analysis:** Disaggregates standard vs. actual variances across Direct Material price/usage, Direct Labor efficiency, and Manufacturing Overhead.
• **Marginal Costing & CVP:** Calculates contribution margins, multi-product break-even unit volumes, and margin-of-safety thresholds.
• **Working Capital Optimization:** Minimizes cash conversion cycles and inventory holding carrying costs.`;
  }

  // 5. Excel Automation & Tools (Python, SQL)
  if (p.includes('excel') || p.includes('python') || p.includes('sql') || p.includes('vba') || p.includes('macro') || p.includes('power query') || p.includes('tool') || p.includes('stack')) {
    return `**Parwej's Technical & Analytical Tool Stack:**

• **Advanced Excel:** Master of Power Query (M code), VBA/Macros, XLOOKUP, INDEX-MATCH-MATCH, Scenario Manager, and Dynamic Arrays.
• **Python for Finance:** Utilizing Pandas and NumPy for financial data wrangling, time-series forecasting, and automated data validation.
• **SQL & Database Queries:** Writing structured queries for joins, aggregations, and subqueries to extract ERP transaction data.
• **Visualization:** Power BI Desktop & Service, DAX Studio, Tabular Editor, and custom charting engines.`;
  }

  // 6. Projects & Case Studies
  if (p.includes('project') || p.includes('h2') || p.includes('huskie') || p.includes('apex') || p.includes('case study') || p.includes('portfolio') || p.includes('work')) {
    return `**Parwej's Featured Portfolio Projects:**

1. **H2 Ventures (VC Valuation Model):** Multi-tier venture capital waterfall distribution and founder equity dilution model (.xlsx).
2. **Huskie Motor (Corporate Financial Model):** Multi-plant automotive manufacturing Capex amortization and unit break-even workbook.
3. **Apex Logistics (Power BI Dashboard):** Dynamic freight variance telemetry and star-schema dimensional model handling 1.2M+ transaction records.
4. **TechNova SaaS (FP&A Rolling Forecast):** 12-month rolling cash flow forecast, ARR cohort churn analysis, and CAC/LTV payback models.

You can inspect detailed interactive previews of all projects directly in the **Work** tab!`;
  }

  // 7. Contact, Hiring, Resume & Availability
  if (p.includes('contact') || p.includes('hire') || p.includes('email') || p.includes('resume') || p.includes('cv') || p.includes('interview') || p.includes('location') || p.includes('available')) {
    return `**Let's Connect with Parwej Alam:**

• **Primary Email:** [bhaiparwej70@gmail.com](mailto:bhaiparwej70@gmail.com)
• **Target Roles:** FP&A Analyst, Financial Modeler, Corporate Finance Specialist, Strategic Data Analyst.
• **Availability:** Immediate / Open for Global Remote, Hybrid, or Consulting engagements.
• **LinkedIn:** [Parwej Alam Profile](${PERSONAL_INFO.socials.linkedin})
• **Direct Portfolio Action:** Use the **Contact Form** at the bottom of the page or send an email to schedule an introductory call.`;
  }

  // 8. Default comprehensive greeting / fallback
  return `Hello! I am **AI Sara**, Parwej's AI Strategy & Finance Assistant.

**Parwej Alam** is a **Finance Specialist, CMA USA Candidate (Part 1 Cleared: 380/500)**, and **Strategic Data Analyst** specializing in:
• **3-Statement Financial Modeling & Valuation** (DCF, LBO, Scenario Planning)
• **Power BI & DAX Telemetry** (Star Schema data modeling, 1.25M+ rows)
• **Activity-Based Costing (ABC) & Variance Analysis**
• **Automated Excel Data Pipelines** (Power Query M, VBA)

Feel free to ask specific questions about his projects, credentials, or email him directly at **bhaiparwej70@gmail.com**!`;
}

/**
 * Master AI Query Handler
 * Calls Gemini REST API -> Fallback to Express Backend -> Fallback to Intelligent Knowledge Engine
 */
export async function sendAIMessage(payload: AIRequestPayload): Promise<AIResponse> {
  // 1. Try direct Gemini AI generation (works 100% on GitHub Pages, Netlify, Vercel & localhost)
  try {
    const geminiReply = await callGeminiRestAPI(payload.prompt, payload.history || []);
    if (geminiReply) {
      return {
        reply: geminiReply,
        source: 'gemini'
      };
    }
  } catch (err) {
    console.warn('[AI Service] Gemini REST API call encountered error:', err);
  }

  // 2. Try Node.js Express backend proxy (when running with server.ts)
  try {
    const backendResult = await callBackendEndpoint(payload);
    if (backendResult && backendResult.reply) {
      return {
        reply: backendResult.reply,
        source: 'backend',
        remainingQueries: backendResult.remainingQueries
      };
    }
  } catch (err) {
    console.warn('[AI Service] Backend call skipped or failed:', err);
  }

  // 3. Ultra-detailed Knowledge Engine Response
  const localReply = generateKnowledgeEngineResponse(payload.prompt);
  return {
    reply: localReply,
    source: 'knowledge-engine'
  };
}
