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

      const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

      const systemInstruction = `You are AI Sara, Parwej's AI Finance & Strategy Assistant on Parwej's personal portfolio website.
Parwej is a Finance Specialist, Certified Management Accountant (CMA) Aspirant, Financial Modeling Expert, and Data Analyst (Power BI, DAX, Advanced Excel, Python).
He specializes in:
- Discounted Cash Flow (DCF), LBO, and 3-Statement Financial Modeling
- Activity-Based Costing (ABC), Marginal Costing, and Variance Analysis
- Power BI Executive Dashboards, DAX formulas, Power Query ETL pipelines
- Strategic Financial Planning & Analysis (FP&A) and Capital Budgeting

Your goal is to answer questions from recruiters and executives in a concise, articulate, executive tone.
CRITICAL COST OPTIMIZATION: Keep answers strictly under 80 words in 2 crisp, high-impact paragraphs. Highlight Parwej's key strengths, CMA credentials, and email: bhaiparwej70@gmail.com.`;

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
            "gemini-flash-latest",
            "gemini-3.7-flash",
            "gemini-3.5-flash",
            "gemini-2.5-flash-lite",
            "gemini-flash-lite-latest"
          ];
          let aiText = "";

          for (const modelName of modelsToTry) {
            try {
              const chat = ai.chats.create({
                model: modelName,
                config: {
                  systemInstruction,
                  temperature: 0.65,
                  maxOutputTokens: 220, // Strict token limit to keep API bill ultra-low
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
      let fallbackText = "Hello! I am AI Sara, Parwej's Finance & Strategy Assistant. Parwej is a Finance Specialist & CMA Aspirant with expertise in 3-Statement Financial Models, Power BI DAX Telemetry, and Activity-Based Costing. Feel free to contact Parwej directly at bhaiparwej70@gmail.com!";

      if (promptLower.includes("cma") || promptLower.includes("qualification") || promptLower.includes("background")) {
        fallbackText = "Parwej is a Certified Management Accountant (CMA) Aspirant with an in-depth background in Strategic Financial Management, Cost Accounting, Variance Analysis, and Corporate FP&A. He combines rigorous accounting principles with modern data analytics tools.";
      } else if (promptLower.includes("model") || promptLower.includes("valuation") || promptLower.includes("excel")) {
        fallbackText = "Parwej has engineered advanced 3-statement financial models, Venture Capital Cap Table dilution schedules (H2 Ventures), Automotive Capex sensitivity workbooks (Huskie Motor), and DCF/LBO valuation frameworks in Excel and Power Query.";
      } else if (promptLower.includes("power bi") || promptLower.includes("dax") || promptLower.includes("dashboard")) {
        fallbackText = "Parwej is an expert in Power BI & DAX telemetry. He has built multi-subsidiary Star Schema data models processing 1.25M+ rows, automated rolling 12-month cash flow forecasters, freight variance matrixes, and C-Suite executive dashboards.";
      } else if (promptLower.includes("costing") || promptLower.includes("abc") || promptLower.includes("variance")) {
        fallbackText = "Parwej applies Activity-Based Costing (ABC) and Marginal Costing frameworks to eliminate overhead allocation distortions, isolate standard vs actual cost variances, and optimize working capital.";
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
