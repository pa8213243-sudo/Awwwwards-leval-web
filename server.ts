import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// In-memory rate limiting store: IP -> { count, lastRequestTime, resetTime }
interface RateLimitRecord {
  count: number;
  lastRequestTime: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();
const MAX_QUERIES_PER_SESSION = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MIN_COOLDOWN_MS = 2000; // 2 seconds between requests to prevent bot spam

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50kb" }));
  app.use(express.static(path.join(process.cwd(), "public")));

  // API Health Endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Check persistent AI Quota for a device/IP on page load or refresh
  app.get("/api/ai/quota", (req, res) => {
    const deviceId = (req.query.deviceId as string) || "";
    const clientIp = (
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress ||
      "unknown-ip"
    ).trim();

    const trackKey = (deviceId && deviceId.startsWith("dev_")) ? deviceId : `ip_${clientIp}`;
    const now = Date.now();
    const record = rateLimitMap.get(trackKey);

    if (!record || now > record.resetTime) {
      return res.json({
        remainingQueries: MAX_QUERIES_PER_SESSION,
        maxQueries: MAX_QUERIES_PER_SESSION,
        deviceId: trackKey
      });
    }

    const remaining = Math.max(0, MAX_QUERIES_PER_SESSION - record.count);
    return res.json({
      remainingQueries: remaining,
      maxQueries: MAX_QUERIES_PER_SESSION,
      deviceId: trackKey
    });
  });

  // AI Sara for Parwej's Portfolio (Server-side Gemini Integration with Device Fingerprint & Bot Defense)
  app.post("/api/ai/copilot", async (req, res) => {
    try {
      const { prompt, history, honeypot, deviceId, deviceCode, deviceType, os, browser } = req.body;
      const clientIp = (
        (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
        req.socket.remoteAddress ||
        "unknown-ip"
      ).trim();

      // Track by unique device fingerprint if provided, otherwise fallback to IP
      const trackKey = (deviceId && typeof deviceId === "string" && deviceId.startsWith("dev_"))
        ? deviceId
        : `ip_${clientIp}`;

      const now = Date.now();

      // 1. Anti-Bot Honeypot Trap: automated bots fill invisible form inputs
      if (honeypot && String(honeypot).trim() !== "") {
        console.warn(`[Anti-Bot] Blocked bot scraper from: ${trackKey}`);
        return res.status(400).json({
          reply: "Automated bot traffic is strictly restricted. Please use the direct contact form."
        });
      }

      // 2. Prompt Validation & Length Limit (prevent prompt injection/drain attacks)
      if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
        return res.status(400).json({ reply: "Please enter a valid question." });
      }
      if (prompt.length > 500) {
        return res.status(400).json({
          reply: "Question exceeds maximum character length (500 chars). Please keep your query concise."
        });
      }

      // 3. Persistent Device Quota & Rapid-Fire Burst Prevention
      let record = rateLimitMap.get(trackKey);
      if (!record || now > record.resetTime) {
        record = { count: 0, lastRequestTime: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };
        rateLimitMap.set(trackKey, record);
      }

      // Cooldown between requests
      if (now - record.lastRequestTime < MIN_COOLDOWN_MS) {
        return res.status(429).json({
          reply: "Please wait a moment before sending another message.",
          remainingQueries: Math.max(0, MAX_QUERIES_PER_SESSION - record.count)
        });
      }

      // 4. Maximum 5 Queries Limit (Permanent across refreshes)
      if (record.count >= MAX_QUERIES_PER_SESSION) {
        console.warn(`[RateLimit] Device ${deviceCode || trackKey} exceeded max session limit (${MAX_QUERIES_PER_SESSION}/${MAX_QUERIES_PER_SESSION})`);
        return res.status(429).json({
          reply: "You have reached the maximum limit of 5 questions for this device/session to protect AI resources. To discuss projects or schedule an interview with Parwej, please reach out directly at bhaiparwej70@gmail.com!",
          remainingQueries: 0,
          limitReached: true
        });
      }

      record.count += 1;
      record.lastRequestTime = now;
      const remainingQueries = Math.max(0, MAX_QUERIES_PER_SESSION - record.count);

      console.log(`[AI Telemetry] Device: ${deviceCode || 'DEV-ANON'} | Type: ${deviceType || 'Device'} (${os || 'OS'}, ${browser || 'Browser'}) | Query: "${prompt.slice(0, 45)}..." | Remaining: ${remainingQueries}/5`);

      const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "";

      const systemInstruction = `You are AI Sara, the official AI Executive Strategy & Finance Assistant for Parwej Alam (Parvej Alam Sulemanali Ansari)'s personal portfolio website.

ABOUT PARWEJ:
- Identity: Finance Specialist, Strategic Data Analyst, and Certified Management Accountant (CMA USA) Aspirant.
- CMA USA Credential: Cleared CMA USA Part 1 on the 1st attempt with a merit score of 380/500 (Financial Planning, Performance, Analytics, Internal Controls, and Cost Management).
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

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey,
          });

          // Format and sanitize history to ensure strictly alternating user and model roles
          const formattedHistory: Array<{ role: string; parts: Array<{ text: string }> }> = [];
          if (Array.isArray(history)) {
            let lastRole = "";
            for (const item of history) {
              if (item && item.role && item.parts && item.parts[0]?.text) {
                const role = item.role === "model" ? "model" : "user";
                if (role !== lastRole) {
                  formattedHistory.push({ role, parts: [{ text: item.parts[0].text }] });
                  lastRole = role;
                }
              }
            }
            // Remove trailing user turn if history already ends with user (since prompt is sent next)
            if (lastRole === "user") {
              formattedHistory.pop();
            }
          }

          // Robust multi-model cascade (Fastest & latest official Gemini models)
          const modelsToTry = [
            "gemini-2.5-flash",
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-2.5-flash-lite",
            "gemini-flash-latest"
          ];
          let aiText = "";

          for (const modelName of modelsToTry) {
            try {
              const chat = ai.chats.create({
                model: modelName,
                config: {
                  systemInstruction,
                  temperature: 0.65,
                  maxOutputTokens: 350,
                },
                history: formattedHistory,
              });

              const response: any = await chat.sendMessage({ message: prompt });
              if (response && response.text) {
                aiText = response.text;
                break;
              }
            } catch (modelErr: any) {
              console.warn(`[AI Sara] Attempt with ${modelName} failed, trying next:`, modelErr?.message || modelErr);
            }
          }

          if (aiText) {
            return res.json({ reply: aiText, remainingQueries });
          }
        } catch (err: any) {
          console.warn("[AI Sara] Gemini call warning:", err?.message || err);
        }
      }

      // Smart Fallback if Gemini API key is pending or momentarily unavailable
      const promptLower = (prompt || "").toLowerCase();
      let fallbackText = `Hello! I am **AI Sara**, Parwej's AI Strategy & Finance Assistant.

**Parwej Alam** is a **Finance Specialist, CMA USA Candidate (Part 1 Cleared: 380/500)**, and **Strategic Data Analyst** specializing in:
• **3-Statement Financial Modeling & Valuation** (DCF, LBO, Scenario Planning)
• **Power BI & DAX Telemetry** (Star Schema data modeling, 1.25M+ rows)
• **Activity-Based Costing (ABC) & Variance Analysis**
• **Automated Excel Data Pipelines** (Power Query M, VBA)

Feel free to ask specific questions about his projects, credentials, or email him directly at **bhaiparwej70@gmail.com**!`;

      if (promptLower.includes("cma") || promptLower.includes("qualification") || promptLower.includes("score") || promptLower.includes("education")) {
        fallbackText = `**Parwej's CMA USA Candidacy & Academic Credentials:**

• **CMA USA Part 1 Cleared:** Passed on the first attempt with a merit score of **380 / 500**.
• **Core Subject Competency:** Financial Planning, Performance, Analytics, Cost Management, and Internal Controls.
• **Applied Edge:** Parwej merges classical managerial accounting with modern automated tools (Power BI, DAX, Python, Advanced Excel).

For academic records or verification, please contact Parwej directly at **bhaiparwej70@gmail.com**.`;
      } else if (promptLower.includes("model") || promptLower.includes("valuation") || promptLower.includes("excel") || promptLower.includes("dcf")) {
        fallbackText = `**Parwej's Financial Modeling & Corporate Valuation Expertise:**

• **3-Statement Modeling:** Built fully integrated, dynamic Income Statement, Balance Sheet, and Cash Flow models with revolving credit facilities and working capital schedules.
• **Valuation Frameworks:** Expertise in Discounted Cash Flow (DCF), Leveraged Buyout (LBO), and Comparable Company Multiples (CCA).
• **H2 Ventures VC Model:** Built institutional venture capital fund return waterfall models, dynamic Cap Tables, and multi-stage dilution schedules.
• **Huskie Motor Capex Model:** Modeled automotive manufacturing unit economics, fixed vs. variable overhead allocation, and MACRS depreciation.

Explore the live models in the **Work & Projects** section or email Parwej at **bhaiparwej70@gmail.com**.`;
      } else if (promptLower.includes("power bi") || promptLower.includes("dax") || promptLower.includes("dashboard")) {
        fallbackText = `**Parwej's Power BI & DAX Engineering Capabilities:**

• **Complex DAX Measures:** Skilled in advanced time intelligence, \`CALCULATE\`, \`FILTER\`, \`ALLSELECTED\`, and dynamic KPI variance matrices.
• **Star Schema Architecture:** Designed optimized dimensional models processing **1.25M+ rows** across multi-subsidiary datasets.
• **Executive Dashboards:** Built real-time C-Suite telemetry for cash runway, EBITDA tracking, and supply chain logistics.
• **Power Query ETL:** Automated end-to-end data pipelines using M-code to cleanse, transform, and normalize disparate enterprise ERP feeds.`;
      } else if (promptLower.includes("costing") || promptLower.includes("abc") || promptLower.includes("variance")) {
        fallbackText = `**Parwej's Cost Accounting & Variance Management Framework:**

• **Activity-Based Costing (ABC):** Eliminates arbitrary volume allocations by tracing costs directly to resource cost drivers.
• **Variance Analysis:** Disaggregates standard vs. actual variances across Direct Material price/usage, Direct Labor efficiency, and Manufacturing Overhead.
• **Marginal Costing & CVP:** Calculates contribution margins, multi-product break-even unit volumes, and margin-of-safety thresholds.`;
      } else if (promptLower.includes("contact") || promptLower.includes("hire") || promptLower.includes("email") || promptLower.includes("interview")) {
        fallbackText = `**Let's Connect with Parwej Alam:**

• **Primary Email:** [bhaiparwej70@gmail.com](mailto:bhaiparwej70@gmail.com)
• **Target Roles:** FP&A Analyst, Financial Modeler, Corporate Finance Specialist, Strategic Data Analyst.
• **Availability:** Immediate / Open for Global Remote, Hybrid, or Consulting engagements.
• **Direct Action:** Send an email or use the portfolio contact form to schedule an introductory interview.`;
      }

      return res.json({ reply: fallbackText, remainingQueries });
    } catch (error: any) {
      console.error("AI Sara Handler Error:", error);
      return res.json({
        reply: "Hello! I am AI Sara. Parwej is a Finance Specialist & CMA Candidate skilled in Financial Modeling, Power BI & DAX. Reach out directly at bhaiparwej70@gmail.com!",
        remainingQueries: 0
      });
    }
  });

  // Google Drive Files Proxy (Uses Bearer OAuth Token passed from client)
  app.get("/api/drive/files", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid OAuth Bearer token." });
      }
      const token = authHeader.substring(7);

      const driveRes = await fetch(
        "https://www.googleapis.com/drive/v3/files?pageSize=20&fields=files(id,name,mimeType,thumbnailLink,webViewLink,iconLink,createdTime,size)&q=trashed%3Dfalse",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!driveRes.ok) {
        const errBody = await driveRes.text();
        return res.status(driveRes.status).json({ error: "Google Drive API error", details: errBody });
      }

      const data = await driveRes.json();
      return res.json(data);
    } catch (error: any) {
      console.error("Drive Proxy Error:", error);
      return res.status(500).json({ error: error.message || "Failed to fetch Drive files." });
    }
  });

  // Vite Dev Server or Production Static File Serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Portfolio running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
