import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.static(path.join(process.cwd(), "public")));

  // API Health Endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Sara for Parwej's Portfolio (Server-side Gemini Integration)
  app.post("/api/ai/copilot", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const { prompt, history } = req.body;

      const systemInstruction = `You are AI Sara, Parwej's AI Finance & Strategy Assistant on Parwej's personal portfolio website.
Parwej is a Finance Specialist, Certified Management Accountant (CMA) Aspirant, Financial Modeling Expert, and Data Analyst (Power BI, DAX, Advanced Excel, Python).
He specializes in:
- Discounted Cash Flow (DCF), LBO, and 3-Statement Financial Modeling
- Activity-Based Costing (ABC), Marginal Costing, and Variance Analysis
- Power BI Executive Dashboards, DAX formulas, Power Query ETL pipelines
- Strategic Financial Planning & Analysis (FP&A) and Capital Budgeting

Your goal is to answer questions from recruiters, executives, and hiring managers in a professional, concise, articulate tone reflecting Parwej's analytical rigor and executive precision.
Keep answers under 3 concise paragraphs. Highlight Parwej's key strengths, CMA candidacy, data analytics capabilities, and email: bhaiparwej70@gmail.com.`;

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              },
            },
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

          const chat = ai.chats.create({
            model: "gemini-3.1-pro",
            config: {
              systemInstruction,
              temperature: 0.7,
            },
            history: formattedHistory,
          });

          // Timeout promise after 6 seconds to prevent frontend hanging
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Gemini request timeout")), 6000)
          );

          const response: any = await Promise.race([
            chat.sendMessage({ message: prompt }),
            timeoutPromise,
          ]);

          if (response && response.text) {
            return res.json({ reply: response.text });
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

      return res.json({ reply: fallbackText });
    } catch (error: any) {
      console.error("AI Sara Handler Error:", error);
      return res.json({
        reply: "Hello! I am AI Sara. Parwej is a Finance Specialist & CMA Candidate skilled in Financial Modeling, Power BI & DAX. Reach out directly at bhaiparwej70@gmail.com!"
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
