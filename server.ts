import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI client lazily or safely
const getGeminiClient = () => {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No Gemini or Google API key found in server environment.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Route: Generate Proposal
app.post("/api/generate-proposal", async (req, res) => {
  try {
    const { clientName, serviceRequested, projectDescription, tone } = req.body;

    if (!clientName || !serviceRequested || !projectDescription) {
      return res.status(400).json({ error: "Missing required fields: clientName, serviceRequested, projectDescription" });
    }

    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      return res.status(500).json({
        error: "Google Gemini API key is missing on the server. Please add GEMINI_API_KEY or GOOGLE_API_KEY in Settings > Secrets or the .env file.",
        details: err.message
      });
    }

    const systemPrompt = `You are an expert agency founder and proposal consultant. Your objective is to write an exceptionally professional, clean, compelling first-draft proposal for a client. 
Use a tone that matches: ${tone || "Professional"}. 

Format the response in beautifully formatted Markdown with the following exact, detailed structure:
# [PROPOSAL TITLE]
[Add a subtitle and agency metadata block here if appropriate]

## Executive Summary
[A concise briefing of the opportunity and objective]

## Understanding of Requirement
[Summarize what the client wants, showing high competence and deep analysis]

## Proposed Solution
[Detail how the agency will deliver this requested service]

## Scope of Work
[Step-by-step deliverable items. Keep it precise, professional, and clear]

## Timeline & Milestones
[Provide realistic milestones: e.g., Phase 1: Planning (Week 1-2), Phase 2: Design/Development (Week 3-6), Phase 3: Testing & Launch (Week 7-8)]

## Assumptions & Exclusions
[Specify typical professional assumptions. NEVER include fake pricing in this section or other sections unless the user has provided specific rate cards or numbers. Do not promise unrealistic timelines or metrics like '100% security' or 'instant infinite scaling'.]

## Next Steps
[Explain precisely how the client can move forward to approve the proposal (e.g., schedule a kickoff, sign a contract)]`;

    const userPrompt = `Client Name: "${clientName}"
Service Requested: "${serviceRequested}"
Project Description: "${projectDescription}"
Selected Tone: "${tone || "Professional"}"

Write a customized and comprehensive first-draft proposal. Highlight collaboration with transparency. Avoid any mock pricing or numbers unless hints are in the description.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const markdownText = response.text;
    if (!markdownText) {
      throw new Error("Empty proposal response text returned from Gemini API.");
    }

    res.json({
      proposalContent: markdownText.trim(),
    });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    res.status(500).json({
      error: "Failed to generate proposal due to an error upstream in the Gemini API.",
      details: error.message || error,
    });
  }
});

// Configure Vite or Static Assets handling
async function setupRouting() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated successfully.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static build from 'dist' folder.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully started and listening on http://localhost:${PORT}`);
  });
}

setupRouting();
