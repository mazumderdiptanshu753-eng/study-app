import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please add it in the Secrets panel.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// 1. Solve Academic Doubt
app.post("/api/solve-doubt", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { question, subject, grade } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }

    const ai = getGeminiClient();
    const prompt = `You are a warm, extremely clear, and engaging academic tutor. 
Subject: ${subject || "General Science & Arts"}
Target Grade Level: ${grade || "High School"}

Doubt/Question:
"${question}"

Explain the answer thoroughly. Follow this strict schema:
- explanation: A clear direct answer, simplified but accurate. Use standard markdown for formatting.
- steps: Break down the explanation or calculation step-by-step into a list of logical points.
- coreConcept: The absolute main takeaway or fundamental formula/rule that governs this topic.
- analogy: A creative and memorable everyday analogy/metaphor to help the student visualize and remember the concept.
- challenge: A multiple-choice review question related to this concept so the student can test their knowledge.
  - question: The review question.
  - options: Four distinct multiple-choice options (A, B, C, D).
  - correctOptionIndex: The 0-based index of the correct option (0 to 3).
  - explanation: A brief 1-2 sentence explanation of why this option is correct.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["explanation", "steps", "coreConcept", "analogy", "challenge"],
          properties: {
            explanation: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            coreConcept: { type: Type.STRING },
            analogy: { type: Type.STRING },
            challenge: {
              type: Type.OBJECT,
              required: ["question", "options", "correctOptionIndex", "explanation"],
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correctOptionIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
            },
          },
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Error solving doubt:", error);
    res.status(500).json({ error: error.message || "Failed to solve doubt using Gemini." });
  }
});

// 2. Summarize Study Note
app.post("/api/summarize-note", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { title, content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Content is required." });
    }

    const ai = getGeminiClient();
    const prompt = `You are an expert study guide creator. Take the following note titled "${title || "Untitled"}" and summarize it.

Note Content:
"${content}"

Provide a structured response:
- summaryPoints: An array of key summary bullet points (clear, informative, and concise).
- tags: An array of 2-4 short, relevant tags/labels for categorizing this note.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["summaryPoints", "tags"],
          properties: {
            summaryPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Error summarizing note:", error);
    res.status(500).json({ error: error.message || "Failed to summarize note." });
  }
});

// 3. Generate Flashcards from Note
app.post("/api/generate-flashcards", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { title, content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Content is required to generate flashcards." });
    }

    const ai = getGeminiClient();
    const prompt = `Analyze the following note content titled "${title || "Untitled"}" and extract 4 to 6 core concepts. 
Turn each concept into an interactive study flashcard (question/term on the front, clear and concise definition/answer on the back).

Note Content:
"${content}"

Return a list of flashcards.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["flashcards"],
          properties: {
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["front", "back"],
                properties: {
                  front: { type: Type.STRING, description: "The front of the flashcard containing a term, question, or problem." },
                  back: { type: Type.STRING, description: "The back of the flashcard containing the definition, explanation, or answer." },
                },
              },
            },
          },
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Error generating flashcards:", error);
    res.status(500).json({ error: error.message || "Failed to generate flashcards." });
  }
});


// 5. Solve Math with AI
app.post("/api/solve-math", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { problem, file, lang } = req.body;
    if (!problem && !file) {
      return res.status(400).json({ error: "Please provide a mathematical problem statement or upload an image/PDF." });
    }

    const ai = getGeminiClient();
    const isBengali = lang === "bn";
    
    const prompt = `You are an expert mathematical tutor and solver. 
${file ? "We have provided a document or image containing the problem. Please analyze the file carefully, extract the math problem, and solve it." : ""}
Please solve the mathematical problem in a step-by-step, pedagogical, and extremely clear manner.

${problem ? `Math Problem/Context provided by user: "${problem}"` : "Please extract and solve the math problem shown in the provided document."}

Language of explanation: ${isBengali ? "Bengali (বাংলা)" : "English"}

Please provide a highly detailed response. Follow this strict schema:
- problem: The extracted or original mathematical problem statement.
- coreConcept: The primary mathematical rule, theorem, formula, or concept involved (e.g., "Quadratic Formula: x = (-b ± √(b² - 4ac)) / 2a").
- steps: A sequential array of step-by-step mathematical operations and logical explanations showing how to solve the problem. Keep the steps clear, mathematically sound, and easy to follow.
- finalAnswer: The final, simplified answer (e.g., "x = 2 or x = 3").`;

    const contents: any[] = [prompt];
    if (file && file.data && file.mimeType) {
      contents.push({
        inlineData: {
          data: file.data,
          mimeType: file.mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["problem", "coreConcept", "steps", "finalAnswer"],
          properties: {
            problem: { type: Type.STRING },
            coreConcept: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            finalAnswer: { type: Type.STRING }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Error solving math with AI:", error);
    res.status(500).json({ error: error.message || "Failed to solve math problem using AI." });
  }
});

// --- Chat Application APIs ---
interface ChatMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  senderRole: "Admin" | "Student";
  message: string;
  timestamp: string;
  studentEmail: string;
  studentName: string;
}

const chatMessages: ChatMessage[] = [
  {
    id: "welcome-demo",
    senderName: "Admin (Diptanshu)",
    senderEmail: "mazumderdiptanshu753@gmail.com",
    senderRole: "Admin",
    message: "Welcome to STUDY HUB Support! Feel free to ask any questions about your Mathematics study notes, or platform features.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    studentEmail: "demo@studyhub.com",
    studentName: "Demo Student"
  }
];

// Get Chat Messages
app.get("/api/chat/messages", (req: express.Request, res: express.Response) => {
  const { email, role, name } = req.query;
  
  if (role === "Admin") {
    return res.json(chatMessages);
  }

  if (!email) {
    return res.status(400).json({ error: "Email is required for students." });
  }

  const studentEmail = (email as string).trim().toLowerCase();
  const studentMessages = chatMessages.filter(m => m.studentEmail.toLowerCase() === studentEmail);

  // If new student, insert an auto-welcome message so they don't see a blank chat
  if (studentMessages.length === 0 && name) {
    const welcomeMsg: ChatMessage = {
      id: `welcome-${Date.now()}`,
      senderName: "Admin (Diptanshu)",
      senderEmail: "mazumderdiptanshu753@gmail.com",
      senderRole: "Admin",
      message: `Hello ${name}! Welcome to STUDY HUB. I am the administrator of this workspace. How can I assist you with your Mathematics study notes today?`,
      timestamp: new Date().toISOString(),
      studentEmail: studentEmail,
      studentName: name as string
    };
    chatMessages.push(welcomeMsg);
    return res.json([welcomeMsg]);
  }

  res.json(studentMessages);
});

// Post a new Chat Message
app.post("/api/chat/messages", (req: express.Request, res: express.Response) => {
  const { senderName, senderEmail, senderRole, message, studentEmail, studentName } = req.body;

  if (!message || !studentEmail || !studentName) {
    return res.status(400).json({ error: "Missing required message details." });
  }

  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    senderName,
    senderEmail,
    senderRole,
    message,
    timestamp: new Date().toISOString(),
    studentEmail: studentEmail.trim().toLowerCase(),
    studentName
  };

  chatMessages.push(newMsg);
  res.status(201).json(newMsg);
});

// AI Simulated Admin Auto-Response endpoint using Gemini
app.post("/api/chat/ai-reply", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { studentName, studentEmail, lastMessage } = req.body;
    if (!studentEmail || !lastMessage) {
      return res.status(400).json({ error: "Missing message details for AI reply." });
    }

    const ai = getGeminiClient();
    const prompt = `You are Diptanshu, the Admin of STUDY HUB. You are responding to a student named ${studentName} who just sent you this message in the support chat:
"${lastMessage}"

Since you are the administrator, write a helpful, friendly, and brief response (1 to 3 sentences max) answering them, giving them guidance on Mathematics, or explaining how to use STUDY HUB features (such as making notes or summarizing). Keep it very human, conversational, and direct. Do not use AI jargon.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const aiMessageText = response.text?.trim() || "Let me know if you need any help with your math studies!";

    const aiMsg: ChatMessage = {
      id: `ai-msg-${Date.now()}`,
      senderName: "Admin (Diptanshu - AI)",
      senderEmail: "mazumderdiptanshu753@gmail.com",
      senderRole: "Admin",
      message: aiMessageText,
      timestamp: new Date().toISOString(),
      studentEmail: studentEmail.trim().toLowerCase(),
      studentName
    };

    chatMessages.push(aiMsg);
    res.json(aiMsg);
  } catch (error: any) {
    console.error("Error generating Admin AI reply:", error);
    // Fallback message
    const fallbackMsg: ChatMessage = {
      id: `fallback-${Date.now()}`,
      senderName: "Admin (Diptanshu)",
      senderEmail: "mazumderdiptanshu753@gmail.com",
      senderRole: "Admin",
      message: "Thanks for your message! I'll look into this and get back to you. Make sure to check out the Notes Workspace for your math studies!",
      timestamp: new Date().toISOString(),
      studentEmail: req.body.studentEmail.trim().toLowerCase(),
      studentName: req.body.studentName
    };
    chatMessages.push(fallbackMsg);
    res.json(fallbackMsg);
  }
});

// --- App Updates API ---
app.get("/api/updates/check", (req: express.Request, res: express.Response) => {
  try {
    const currentVersion = (req.query.currentVersion as string) || "1.0.0";
    
    // Always provide a newer version for demonstration purposes
    const parts = currentVersion.split('.').map(Number);
    const major = parts[0] || 1;
    const minor = parts[1] || 0;
    const patch = parts[2] || 0;
    const nextVersion = `${major}.${minor}.${patch + 1}`;
    
    res.json({
      latestVersion: nextVersion,
      changelog: "New feature updates, performance improvements, and bug fixes."
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to read server version" });
  }
});

app.post("/api/updates/install", (req: express.Request, res: express.Response) => {
  // Client handles storing the updated version
  res.json({ success: true });
});

// Start express server and integrate Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
