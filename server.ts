import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

import {
  initDatabase,
  getUsers,
  saveUser,
  deleteUser,
  getChatMessages,
  saveChatMessage,
  getForumPosts,
  saveForumPost,
  addForumReply,
  getLiveClasses,
  saveLiveClass,
  updateLiveClassStatus,
  deleteLiveClass,
  getActivityLogs,
  saveActivityLog,
  getGovtJobNotes,
  saveGovtJobNote,
  addGovtJobNoteComment,
  deleteGovtJobNote,
  getAiPdfNotes,
  saveAiPdfNote,
  deleteAiPdfNote,
  getAiPdfNotesCount,
  seedAiPdfNotes,
  getStudyNotes,
  saveStudyNote,
  deleteStudyNote
} from "./server/db.js";

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

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

interface StudentProfile {
  fullName: string;
  email: string;
  grade: string;
  preferredSubject: string;
  registeredAt: string;
  avatarUrl?: string;
  role: "Admin" | "Student";
}

interface ForumReply {
  id: string;
  authorEmail: string;
  authorName: string;
  content: string;
  timestamp: string;
}

interface ForumPost {
  id: string;
  authorEmail: string;
  authorName: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: ForumReply[];
}

interface LiveClass {
  id: string;
  title: string;
  subject: string;
  instructor: string;
  scheduledTime: string;
  link: string;
  status: "Scheduled" | "Live" | "Completed";
  createdAt: string;
}

// Global firestore mock variable to keep types/code happy or clean
let firestore: any = null;


async function withRetry(operation: any, maxRetries = 3) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      const status = error?.status || error?.statusCode || error?.response?.status;
      const errorMessage = error?.message || "";
      const isTransient = !status || // If status is undefined, treat as transient network issue
                          status === 429 || status === 503 || status === 500 || status === 502 || status === 504 ||
                          errorMessage.includes("429") || errorMessage.includes("503") || errorMessage.includes("500") ||
                          errorMessage.toLowerCase().includes("too many requests") || 
                          errorMessage.toLowerCase().includes("resource exhausted") ||
                          errorMessage.toLowerCase().includes("rate limit") || 
                          errorMessage.toLowerCase().includes("overloaded");
      
      if (isTransient && i < maxRetries - 1) {
        const delay = 1000 * (i + 1) * 1.5; // Exponential backoff: 1.5s, 3s, 4.5s
        console.warn(`Gemini API transient error (${status || errorMessage}). Retrying ${i + 1}/${maxRetries} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw lastError;
}

const app = express();
// Add global no-cache headers to prevent mobile browsers from caching the app
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});
app.use(express.json());

const PORT = (process.env.RENDER || !process.env.APPLET_ID) && process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Lazy initialization of Gemini client
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please add it in the Secrets panel.");
    }
    const rawClient = new GoogleGenAI({
      apiKey,
    });

    // Decorate generateContent to automatically use retry logic for transient errors
    const originalGenerateContent = rawClient.models.generateContent.bind(rawClient.models);
    rawClient.models.generateContent = async function(this: any, ...args: any[]) {
      return withRetry(() => originalGenerateContent(...args));
    } as any;

    aiInstance = rawClient;
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
      model: "gemini-flash-latest",
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
      model: "gemini-flash-latest",
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
      model: "gemini-flash-latest",
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



// --- AI Study Assistant ---
app.post("/api/study-assistant/chat", async (req, res) => {
  try {
    const { messages, lang } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGeminiClient();
    const isBengali = lang === "bn";
    
    let chatHistory = "You are a helpful and intelligent AI Study Assistant designed to help students understand their academic subjects. Be encouraging, clear, and educational.\n\n";
    chatHistory += "Language of explanation: " + (isBengali ? "Bengali (বাংলা)" : "English") + "\n\n";
    
    // Format previous messages
    for (const msg of messages) {
      chatHistory += `${msg.role === 'user' ? 'Student' : 'Assistant'}: ${msg.content}\n`;
    }
    
    chatHistory += "Assistant:";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: chatHistory,
    });
    
    if (response.text) {
      res.json({ text: response.text });
    } else {
      res.status(500).json({ error: "Failed to generate response." });
    }
  } catch (error) {
    console.error("AI Assistant Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- Notes Summarizer ---
app.post("/api/summarize-note", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { title, content: noteContent } = req.body;
    if (!noteContent) {
      return res.status(400).json({ error: "Content is required." });
    }

    const ai = getGeminiClient();
    
    const prompt = `You are an expert AI Study Assistant. Please summarize the following academic notes into a short, concise, and easy-to-understand summary. 
    Highlight key points and important takeaways.
    
    Notes Title: ${title}
    Notes content:
    """
    ${noteContent}
    """
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    if (response.text) {
      res.json({ summary: response.text });
    } else {
      res.status(500).json({ error: "Failed to generate summary." });
    }
  } catch (error: any) {
    console.error("Summarizer Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- AI Flashcards Generator ---
app.post("/api/generate-flashcards", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { title, content: noteContent } = req.body;
    const ai = getGeminiClient();
    
    const prompt = `Create 3-5 study flashcards based on these notes. Return ONLY a JSON array of objects with "question" and "answer" string keys.
    Notes Title: ${title}
    Notes content: ${noteContent}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    let text = response.text;
    text = text.replace(/```json/g, "").replace(/```/g, "");
    
    res.json({ flashcards: JSON.parse(text) });
  } catch (error: any) {
    console.error("Flashcard Error:", error);
    res.status(500).json({ error: error.message });
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
      model: "gemini-flash-latest",
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

// --- General Knowledge API ---
app.get("/api/gk-questions", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const ai = getGeminiClient();
    
    // We want the questions to change every 7 days.
    // Calculate a seed based on the current week number.
    const now = new Date();
    const oneJan = new Date(now.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((now.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((now.getDay() + 1 + numberOfDays) / 7);
    const seed = `${now.getFullYear()}-W${weekNumber}`;

    const prompt = `Generate 5 multiple-choice General Knowledge questions suitable for government exam preparation.
Use the following seed to ensure variety but consistency for this week: ${seed}.
Make sure the topics are relevant for competitive government exams (History, Geography, Polity, Science, Current Events).
Format the output strictly as JSON following this schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["questions"],
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["question", "options", "correctOptionIndex", "explanation"],
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctOptionIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{"questions": []}');
    res.json(data);
  } catch (error: any) {
    console.warn("Using fallback for GK questions due to API limit.");
    const fallbackData = {
      questions: [
        {
          question: "Which of the following planets is known as the Red Planet?",
          options: ["Venus", "Mars", "Jupiter", "Saturn"],
          correctOptionIndex: 1,
          explanation: "Mars is often called the 'Red Planet' due to the iron oxide prevalent on its surface."
        },
        {
          question: "Who was the first President of independent India?",
          options: ["Jawaharlal Nehru", "Dr. Rajendra Prasad", "Sardar Vallabhbhai Patel", "B.R. Ambedkar"],
          correctOptionIndex: 1,
          explanation: "Dr. Rajendra Prasad was the first President of India, serving from 1950 to 1962."
        },
        {
          question: "What is the capital of Australia?",
          options: ["Sydney", "Melbourne", "Canberra", "Perth"],
          correctOptionIndex: 2,
          explanation: "Canberra is the capital city of Australia."
        },
        {
          question: "The Indus Valley Civilization was primarily located in which present-day regions?",
          options: ["India and Nepal", "Pakistan and Northwest India", "Afghanistan and Iran", "Bangladesh and East India"],
          correctOptionIndex: 1,
          explanation: "The Indus Valley Civilization flourished in the basins of the Indus River, largely in present-day Pakistan and northwest India."
        },
        {
          question: "What is the chemical symbol for gold?",
          options: ["Ag", "Au", "Pb", "Fe"],
          correctOptionIndex: 1,
          explanation: "The symbol 'Au' comes from the Latin word for gold, 'aurum'."
        }
      ]
    };
    res.json(fallbackData);
  }
});

// --- Important Questions API ---
app.get("/api/important-questions", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const ai = getGeminiClient();
    
    const now = new Date();
    const oneJan = new Date(now.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((now.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((now.getDay() + 1 + numberOfDays) / 7);
    const seed = `${now.getFullYear()}-W${weekNumber}-Important`;

    const prompt = `Generate 100 important, frequently asked one-liner questions and their direct answers for Indian government competitive exams (like UPSC, SSC, Railways, State PSC). 
Make sure to include a good mix of subjects, including some Mathematics/Quantitative Aptitude questions.
Use the following seed to ensure variety but consistency for this week: ${seed}.
Format the output strictly as JSON following this schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["qnaList"],
          properties: {
            qnaList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["question", "answer", "subject"],
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                  subject: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{"qnaList": []}');
    res.json(data);
  } catch (error: any) {
    console.warn("Using fallback for important questions due to API limit.");
    const fallbackData = {
      qnaList: [
        {
          question: "Who is known as the 'Father of the Indian Constitution'?",
          answer: "Dr. B.R. Ambedkar",
          subject: "Polity"
        },
        {
          question: "What is the SI unit of electric current?",
          answer: "Ampere (A)",
          subject: "Science"
        },
        {
          question: "Which article of the Indian Constitution deals with the 'Right to Equality'?",
          answer: "Article 14 to Article 18",
          subject: "Polity"
        },
        {
          question: "Who was the founder of the Maurya Empire?",
          answer: "Chandragupta Maurya",
          "subject": "History"
        },
        {
          question: "What is the largest river in the world by volume of water?",
          answer: "Amazon River",
          subject: "Geography"
        },
        {
          question: "If the sum of two numbers is 14 and their difference is 4, what is the product of the two numbers?",
          answer: "45 (The numbers are 9 and 5)",
          subject: "Mathematics"
        }
      ]
    };
    res.json(fallbackData);
  }
});


// --- Current Affairs API ---
app.get("/api/current-affairs", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const ai = getGeminiClient();
    
    // We want current affairs to change daily.
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];
    const seed = `CurrentAffairs-${dateString}`;

    const prompt = `Generate 5 important daily current affairs headlines and brief descriptions for Indian government competitive exams (like UPSC, SSC, Railways, State PSC) for today.
Use the following seed to ensure variety but consistency for today: ${seed}.
Format the output strictly as JSON following this schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["news"],
          properties: {
            news: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["headline", "description", "category", "date"],
                properties: {
                  headline: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING },
                  date: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{"news": []}');
    res.json(data);
  } catch (error: any) {
    console.warn("Using fallback for current affairs due to API limit.");
    const fallbackData = {
      news: [
        {
          headline: "India's space agency successfully launches new communication satellite",
          description: "ISRO has successfully placed a new advanced communication satellite into geostationary orbit, boosting the country's telecommunication infrastructure.",
          category: "Science & Technology",
          date: new Date().toISOString().split('T')[0]
        },
        {
          headline: "Government announces new economic package for MSMEs",
          description: "The Finance Ministry has rolled out a comprehensive stimulus package aimed at revitalizing Micro, Small, and Medium Enterprises.",
          category: "Economy",
          date: new Date().toISOString().split('T')[0]
        },
        {
          headline: "International summit on climate change begins in New Delhi",
          description: "Delegates from over 50 countries have convened to discuss actionable strategies for reducing global carbon emissions.",
          category: "Environment",
          date: new Date().toISOString().split('T')[0]
        },
        {
          headline: "Prominent sportsperson wins gold at international championship",
          description: "Bringing laurels to the nation, an Indian athlete secured the gold medal in the 100m sprint at the World Athletics Championship.",
          category: "Sports",
          date: new Date().toISOString().split('T')[0]
        },
        {
          headline: "Parliament passes new bill on data privacy",
          description: "A landmark bill aiming to secure user data and establish guidelines for tech companies has been passed by both houses of Parliament.",
          category: "Polity",
          date: new Date().toISOString().split('T')[0]
        }
      ]
    };
    res.json(fallbackData);
  }
});


// --- Job Alerts API ---
app.get("/api/job-alerts", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const ai = getGeminiClient();
    
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];
    const seed = `JobAlerts-${dateString}`;

    const prompt = `Generate 5 latest Indian government job alerts, admit card releases, or exam result announcements for the current year ${now.getFullYear()} (e.g., SSC, UPSC, Railway, State PSC, Police).
Use the following seed to ensure variety but consistency for today: ${seed}.
Format the output strictly as JSON following this schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["alerts"],
          properties: {
            alerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["title", "organization", "type", "lastDateOrStatus", "link"],
                properties: {
                  title: { type: Type.STRING, description: "Job title or alert name" },
                  organization: { type: Type.STRING, description: "Organization name like SSC, UPSC" },
                  type: { type: Type.STRING, description: "Type of alert: 'New Job', 'Admit Card', 'Result'" },
                  lastDateOrStatus: { type: Type.STRING, description: "Last date to apply or current status" },
                  link: { type: Type.STRING, description: "A placeholder link, e.g., 'https://ssc.nic.in'" }
                }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{"alerts": []}');
    res.json(data);
  } catch (error: any) {
    console.warn("Using fallback for job alerts due to API limit.");
    const fallbackData = {
      alerts: [
        {
          title: `SSC CGL ${new Date().getFullYear()} Notification Released`,
          organization: "Staff Selection Commission (SSC)",
          type: "New Job",
          lastDateOrStatus: `Last Date: 24-07-${new Date().getFullYear()}`,
          link: "https://ssc.nic.in"
        },
        {
          title: `Railway ALP Admit Card ${new Date().getFullYear()}`,
          organization: "Railway Recruitment Board (RRB)",
          type: "Admit Card",
          lastDateOrStatus: "Available Now",
          link: "https://indianrailways.gov.in"
        },
        {
          title: "UPSC Civil Services Prelims Result",
          organization: "Union Public Service Commission (UPSC)",
          type: "Result",
          lastDateOrStatus: "Declared",
          link: "https://upsc.gov.in"
        }
      ]
    };
    res.json(fallbackData);
  }
});

// --- Previous Year Questions (PYQ) API ---
app.get("/api/pyq", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const ai = getGeminiClient();
    const exam = req.query.exam || "SSC CGL";
    const seed = `PYQ-${exam}`;

    const prompt = `Generate 5 authentic-looking Previous Year Questions (PYQ) for the ${exam} exam.
Include the year it was asked. Make sure the questions are relevant to the exam.
Format the output strictly as JSON following this schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["questions"],
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["question", "options", "correctAnswer", "year", "subject"],
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswer: { type: Type.STRING },
                  year: { type: Type.STRING },
                  subject: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{"questions": []}');
    res.json(data);
  } catch (error: any) {
    console.warn("Using fallback for PYQ due to API limit.");
    const fallbackData = {
      questions: [
        {
          question: "Which article of the Indian Constitution deals with the abolition of untouchability?",
          options: ["Article 14", "Article 15", "Article 16", "Article 17"],
          correctAnswer: "Article 17",
          year: "2021",
          subject: "Polity"
        },
        {
          question: "What is the chemical name of baking soda?",
          options: ["Sodium Carbonate", "Sodium Bicarbonate", "Calcium Carbonate", "Calcium Hydroxide"],
          correctAnswer: "Sodium Bicarbonate",
          year: "2020",
          subject: "Science"
        },
        {
          question: "The first battle of Panipat was fought in which year?",
          options: ["1526", "1556", "1761", "1857"],
          correctAnswer: "1526",
          year: "2019",
          subject: "History"
        }
      ]
    };
    res.json(fallbackData);
  }
});

// --- Chat Application APIs ---

// Get Chat Messages
app.get("/api/chat/messages", async (req: express.Request, res: express.Response): Promise<any> => {
  const { email, role, name } = req.query;
  
  try {
    let messages = await getChatMessages();
    
    if (role !== "Admin") {
      if (!email) {
        return res.status(400).json({ error: "Email is required for students." });
      }
      const studentEmail = (email as string).trim().toLowerCase();
      messages = messages.filter(m => m.studentEmail.toLowerCase() === studentEmail);
    }

    // Sort by timestamp ascending
    messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // If new student, insert an auto-welcome message
    if (role !== "Admin" && messages.length === 0 && name && email) {
      const studentEmail = (email as string).trim().toLowerCase();
      const welcomeMsg = {
        id: `welcome-${Date.now()}`,
        senderName: "Admin (Diptanshu)",
        senderEmail: "mazumderdiptanshu753@gmail.com",
        senderRole: "Admin" as const,
        message: `Hello ${name}! Welcome to STUDY HUB. I am the administrator of this workspace. How can I assist you with your Mathematics study notes today?`,
        timestamp: new Date().toISOString(),
        studentEmail: studentEmail,
        studentName: name as string
      };
      await saveChatMessage(welcomeMsg);
      return res.json([welcomeMsg]);
    }

    return res.json(messages);
  } catch (error: any) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: error.message });
  }
});

// Post a new Chat Message
app.post("/api/chat/messages", async (req: express.Request, res: express.Response): Promise<any> => {
  const { senderName, senderEmail, senderRole, message, studentEmail, studentName } = req.body;

  if (!message || !studentEmail || !studentName) {
    return res.status(400).json({ error: "Missing required message details." });
  }

  const newMsg = {
    id: `msg-${Date.now()}`,
    senderName,
    senderEmail,
    senderRole,
    message,
    timestamp: new Date().toISOString(),
    studentEmail: studentEmail.trim().toLowerCase(),
    studentName
  };

  try {
    await saveChatMessage(newMsg);
    res.status(201).json(newMsg);
  } catch (error: any) {
    console.error("Error posting chat message:", error);
    res.status(500).json({ error: error.message });
  }
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
      model: "gemini-flash-latest",
      contents: prompt,
    });

    const aiMessageText = response.text?.trim() || "Let me know if you need any help with your math studies!";

    const aiMsg = {
      id: `ai-msg-${Date.now()}`,
      senderName: "Admin (Diptanshu - AI)",
      senderEmail: "mazumderdiptanshu753@gmail.com",
      senderRole: "Admin" as const,
      message: aiMessageText,
      timestamp: new Date().toISOString(),
      studentEmail: studentEmail.trim().toLowerCase(),
      studentName
    };

    await saveChatMessage(aiMsg);
    res.json(aiMsg);
  } catch (error: any) {
    console.error("Error generating Admin AI reply:", error);
    // Fallback message
    const fallbackMsg = {
      id: `fallback-${Date.now()}`,
      senderName: "Admin (Diptanshu)",
      senderEmail: "mazumderdiptanshu753@gmail.com",
      senderRole: "Admin" as const,
      message: "Thanks for your message! I'll look into this and get back to you. Make sure to check out the Notes Workspace for your math studies!",
      timestamp: new Date().toISOString(),
      studentEmail: req.body.studentEmail.trim().toLowerCase(),
      studentName: req.body.studentName
    };
    
    await saveChatMessage(fallbackMsg);
    res.json(fallbackMsg);
  }
});



// --- Community Forum API ---
app.get("/api/forum/posts", async (req: express.Request, res: express.Response) => {
  try {
    const postsList = await getForumPosts();
    postsList.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    res.json(postsList);
  } catch (error: any) {
    console.error("Error fetching forum posts:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/forum/posts", async (req: express.Request, res: express.Response): Promise<any> => {
  const post = req.body;
  if (!post.authorEmail || !post.title || !post.content) return res.status(400).json({ error: "Missing fields" });
  
  post.id = `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  post.timestamp = new Date().toISOString();
  post.likes = 0;
  post.replies = [];

  try {
    await saveForumPost(post);
    res.status(201).json(post);
  } catch (error: any) {
    console.error("Error saving forum post:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/forum/posts/:postId/replies", async (req: express.Request, res: express.Response): Promise<any> => {
  const { postId } = req.params;
  const reply = req.body;
  if (!reply.authorEmail || !reply.content) return res.status(400).json({ error: "Missing fields" });
  
  reply.id = `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  reply.timestamp = new Date().toISOString();

  try {
    const success = await addForumReply(postId, reply);
    if (success) {
      res.status(201).json(reply);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error: any) {
    console.error("Error saving forum reply:", error);
    res.status(500).json({ error: error.message });
  }
});


// --- Live Classes API ---
app.get("/api/live-classes", async (req: express.Request, res: express.Response) => {
  try {
    const classesList = await getLiveClasses();
    classesList.sort((a: any, b: any) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
    res.json(classesList);
  } catch (error: any) {
    console.error("Error fetching live classes:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/live-classes", async (req: express.Request, res: express.Response): Promise<any> => {
  const cls = req.body;
  if (!cls.title || !cls.link || !cls.scheduledTime) return res.status(400).json({ error: "Missing fields" });
  
  cls.id = `class-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  cls.createdAt = new Date().toISOString();
  cls.status = cls.status || "Scheduled";

  try {
    await saveLiveClass(cls);
    res.status(201).json(cls);
  } catch (error: any) {
    console.error("Error saving live class:", error);
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/live-classes/:id", async (req: express.Request, res: express.Response): Promise<any> => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const updated = await updateLiveClassStatus(id, status);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (error: any) {
    console.error("Error updating live class:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/live-classes/:id", async (req: express.Request, res: express.Response): Promise<any> => {
  const { id } = req.params;
  
  try {
    await deleteLiveClass(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting live class:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- Users API (Admin Panel Persistence) ---
app.get("/api/users", async (req: express.Request, res: express.Response) => {
  try {
    const usersList = await getUsers();
    res.json(usersList);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/users", async (req: express.Request, res: express.Response): Promise<any> => {
  const user = req.body;
  if (!user.email) return res.status(400).json({ error: "Email is required" });
  
  try {
    await saveUser(user);
    const usersList = await getUsers();
    res.json(usersList);
  } catch (error: any) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/users", async (req: express.Request, res: express.Response): Promise<any> => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    await deleteUser(email);
    const usersList = await getUsers();
    res.json(usersList);
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- Activity Logs API ---
app.get("/api/activity-logs", async (req: express.Request, res: express.Response) => {
  try {
    const logsList = await getActivityLogs();
    logsList.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    res.json(logsList);
  } catch (error: any) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/activity-logs", async (req: express.Request, res: express.Response): Promise<any> => {
  const log = req.body;
  if (!log.userEmail || !log.action) return res.status(400).json({ error: "Missing required fields" });
  
  log.id = `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  if (!log.timestamp) log.timestamp = new Date().toISOString();

  try {
    await saveActivityLog(log);
    res.status(201).json(log);
  } catch (error: any) {
    console.error("Error saving activity log:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- Personal Study Notes API ---
app.get("/api/study-notes", async (req: express.Request, res: express.Response): Promise<any> => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email query param is required" });
  try {
    const notes = await getStudyNotes(email as string);
    res.json(notes);
  } catch (error: any) {
    console.error("Error fetching study notes:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/study-notes", async (req: express.Request, res: express.Response): Promise<any> => {
  const note = req.body;
  if (!note.id || !note.title || !note.userEmail) {
    return res.status(400).json({ error: "Missing required fields (id, title, userEmail)" });
  }
  try {
    const saved = await saveStudyNote(note);
    res.json(saved);
  } catch (error: any) {
    console.error("Error saving study note:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/study-notes/:id", async (req: express.Request, res: express.Response): Promise<any> => {
  const { id } = req.params;
  try {
    const success = await deleteStudyNote(id);
    res.json({ success });
  } catch (error: any) {
    console.error("Error deleting study note:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- Firestore Batch Recovery API ---
app.post("/api/recover-firestore", async (req: express.Request, res: express.Response): Promise<any> => {
  const { users, studyNotes, chatMessages, forumPosts, liveClasses, activityLogs, govtJobNotes, aiPdfNotes } = req.body;
  
  console.log("Processing bulk firestore recovery payload...");
  const results: any = {
    users: 0,
    studyNotes: 0,
    chatMessages: 0,
    forumPosts: 0,
    liveClasses: 0,
    activityLogs: 0,
    govtJobNotes: 0,
    aiPdfNotes: 0
  };

  try {
    if (Array.isArray(users)) {
      for (const item of users) {
        if (item.email) {
          await saveUser(item);
          results.users++;
        }
      }
    }
    if (Array.isArray(studyNotes)) {
      for (const item of studyNotes) {
        if (item.id && item.title && item.userEmail) {
          await saveStudyNote(item);
          results.studyNotes++;
        }
      }
    }
    if (Array.isArray(chatMessages)) {
      for (const item of chatMessages) {
        if (item.id && item.message) {
          await saveChatMessage(item);
          results.chatMessages++;
        }
      }
    }
    if (Array.isArray(forumPosts)) {
      for (const item of forumPosts) {
        if (item.id && item.title && item.authorEmail) {
          await saveForumPost(item);
          results.forumPosts++;
        }
      }
    }
    if (Array.isArray(liveClasses)) {
      for (const item of liveClasses) {
        if (item.id && item.title) {
          await saveLiveClass(item);
          results.liveClasses++;
        }
      }
    }
    if (Array.isArray(activityLogs)) {
      for (const item of activityLogs) {
        if (item.id || (item.userEmail && item.action)) {
          const logItem = { ...item, id: item.id || `log-${Date.now()}-${Math.random().toString(36).substring(2, 11)}` };
          await saveActivityLog(logItem);
          results.activityLogs++;
        }
      }
    }
    if (Array.isArray(govtJobNotes)) {
      for (const item of govtJobNotes) {
        if (item.id && item.title) {
          await saveGovtJobNote(item);
          results.govtJobNotes++;
        }
      }
    }
    if (Array.isArray(aiPdfNotes)) {
      for (const item of aiPdfNotes) {
        if (item.id && item.title) {
          await saveAiPdfNote(item);
          results.aiPdfNotes++;
        }
      }
    }

    console.log("Firestore recovery completed. Results:", results);
    res.json({ success: true, results });
  } catch (error: any) {
    console.error("Error performing firestore recovery:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- Govt Job Notes API ---
app.get("/api/govt-job-notes", async (req: express.Request, res: express.Response) => {
  try {
    const { subject } = req.query;
    let notes = await getGovtJobNotes(subject as string);
    notes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    res.json(notes);
  } catch (error: any) {
    console.error("Error fetching govt job notes:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/govt-job-notes", async (req: express.Request, res: express.Response): Promise<any> => {
  const note = req.body;
  if (!note.title || !note.content || !note.subject) return res.status(400).json({ error: "Missing fields" });
  
  note.id = `gjn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  note.timestamp = new Date().toISOString();
  note.comments = [];

  try {
    await saveGovtJobNote(note);
    res.status(201).json(note);
  } catch (error: any) {
    console.error("Error saving govt job note:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/govt-job-notes/:id/comments", async (req: express.Request, res: express.Response): Promise<any> => {
  const { id } = req.params;
  const comment = req.body;
  if (!comment.authorEmail || !comment.authorName || !comment.text) {
    return res.status(400).json({ error: "Missing comment fields" });
  }
  
  comment.id = `cmt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  comment.timestamp = new Date().toISOString();

  try {
    const success = await addGovtJobNoteComment(id, comment);
    if (success) {
      res.status(201).json(comment);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error: any) {
    console.error("Error adding comment to govt job note:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/govt-job-notes/:id", async (req: express.Request, res: express.Response): Promise<any> => {
  const { id } = req.params;
  try {
    await deleteGovtJobNote(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting govt job note:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- AI PDF Notes Endpoints ---

// Monthly incrementing helper
function getNextMonthName(existingNotes: any[]): string {
  if (existingNotes.length === 0) {
    return "July 2026";
  }
  
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  let latestYear = 2026;
  let latestMonthIndex = 6; // July
  
  for (const note of existingNotes) {
    if (note.month) {
      const parts = note.month.split(" ");
      if (parts.length === 2) {
        const mIndex = months.indexOf(parts[0]);
        const year = parseInt(parts[1], 10);
        if (mIndex !== -1 && !isNaN(year)) {
          if (year > latestYear || (year === latestYear && mIndex > latestMonthIndex)) {
            latestYear = year;
            latestMonthIndex = mIndex;
          }
        }
      }
    }
  }
  
  latestMonthIndex++;
  if (latestMonthIndex >= 12) {
    latestMonthIndex = 0;
    latestYear++;
  }
  
  return `${months[latestMonthIndex]} ${latestYear}`;
}

app.get("/api/ai-pdf-notes", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { subject } = req.query;
    let notesList = await getAiPdfNotes(subject as string);
    notesList.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    res.json(notesList);
  } catch (error: any) {
    console.error("Error fetching AI PDF notes:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/ai-pdf-notes/generate", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { subject } = req.body;
    if (!subject) {
      return res.status(400).json({ error: "Subject is required." });
    }

    const existingNotes = await getAiPdfNotes(subject);
    const nextMonth = getNextMonthName(existingNotes);

    const subjectNameMap: any = {
      math: "Mathematics & Quantitative Aptitude (Shortcuts, Formulas, and MCQs)",
      reasoning: "Reasoning & Mental Ability",
      english: "English Grammar & Comprehension",
      science: "General Science (Physics, Chemistry, Biology)",
      history: "History (Indian Subcontinent History, BCS & WB specific)",
      geography: "Geography, Environment & Disaster Management",
      polity: "Constitution & Government Policy (Polity)",
      economics: "Economics & Development Planning"
    };
    const subjectName = subjectNameMap[subject] || subject;

    const ai = getGeminiClient();
    const prompt = `You are an expert Government Job Preparation Coach and Content Designer for exams like BCS, Bank Exams, Primary, PSC, SSC in West Bengal and Bangladesh. 
Generate a comprehensive, high-yield Monthly Study Guide & Notes in PDF style.

Subject: ${subjectName}
Release Month: ${nextMonth}

Ensure the content is detailed, engaging, and covers extremely important topics, short tricks, formulas, or high-yield facts. 
Write primarily in Bengali, with English translations/terms where appropriate (especially for Math, Science, English, and Economics) so students find it highly practical.

The response MUST match the JSON schema exactly and be comprehensive. Make the 'theoryContent' long and thorough (around 500-1000 words). Include at least 5 high-yield multiple choice questions (MCQs) in the 'mcqs' section with proper explanation of the answers.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            introduction: { type: Type.STRING },
            keyTopics: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            theoryContent: { type: Type.STRING },
            mcqs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["question", "options", "correctAnswer", "explanation"]
              }
            }
          },
          required: ["title", "introduction", "keyTopics", "theoryContent", "mcqs"]
        }
      }
    });

    const parsedData = JSON.parse(response.text.trim());
    
    const newPdfNote = {
      id: `pdfn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      subject,
      title: parsedData.title || `${subjectName} Monthly Study Guide`,
      introduction: parsedData.introduction || "",
      keyTopics: parsedData.keyTopics || [],
      theoryContent: parsedData.theoryContent || "",
      mcqs: parsedData.mcqs || [],
      month: nextMonth,
      timestamp: new Date().toISOString()
    };

    await saveAiPdfNote(newPdfNote);
    res.status(201).json(newPdfNote);
  } catch (error: any) {
    console.error("Error generating AI PDF note:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/ai-pdf-notes/:id", async (req: express.Request, res: express.Response): Promise<any> => {
  const { id } = req.params;
  try {
    await deleteAiPdfNote(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting AI PDF note:", error);
    res.status(500).json({ error: error.message });
  }
});

// Database Seeding Logic for AI PDF Notes (Deprecated local version)
async function deprecatedSeedAiPdfNotes() {
  try {
    let count = 0;
    if (firestore) {
      const snap = await firestore.collection("aiPdfNotes").get();
      count = snap.size;
    } else {
      count = 0;
    }

    if (count > 0) {
      console.log("AI PDF Notes already seeded.");
      return;
    }

    const seedData = [
      {
        id: "pdfn-seed-math",
        subject: "math",
        title: "July 2026 - Quantitative Aptitude: Magic Shortcut Tricks for Percentage & Ratio",
        introduction: "এই গাইডটিতে শতকরা ও অনুপাতের জটিল অংকগুলো মাত্র ৫-১০ সেকেন্ডে সমাধান করার শর্টকাট টেকনিক ও গুরুত্বপূর্ণ প্রশ্ন আলোচনা করা হয়েছে।",
        keyTopics: ["Percentage Rules", "Ratio & Proportion", "BCS Prep Hacks"],
        theoryContent: "### ১. শতকরা নির্নয়ের ম্যাজিক ট্রিক (Percentage Shortcuts):\nশতকরা অংকগুলো সহজে করার জন্য ভগ্নাংশে রূপান্তর করা শিখতে হবে।\n* ২০% = ১/৫\n* ২৫% = ১/৪\n* ৫০% = ১/২\n\n**উদাহরণ ১:** চালের মূল্য ২০% বৃদ্ধি পেলে চালের ব্যবহার শতকরা কত কমালে খরচের কোনো পরিবর্তন হবে না?\n* **শর্টকাট সূত্র:** (R / (100 + R)) * 100\n* সমাধান: (২০ / ১২০) * ১০০ = ১৬.৬৭%\n\n### ২. অনুপাত ও অংশীদারিত্ব (Ratio & Proportion Hacks):\nযদি A:B = 2:3 এবং B:C = 4:5 হয়, তবে A:B:C = ?\n* **শর্টকাট 'দ' পদ্ধতি:**\n  * A = 2 * 4 = 8\n  * B = 3 * 4 = 12\n  * C = 3 * 5 = 15\n  * উত্তর: 8:12:15",
        mcqs: [
          {
            question: "চালের মূল্য ২৫% বৃদ্ধি পেলে চালের ব্যবহার শতকরা কত কমালে খরচ অপরিবর্তিত থাকবে?",
            options: ["২০%", "২৫%", "১৬.৬৭%", "১৫%"],
            correctAnswer: "২০%",
            explanation: "সূত্র: (R / (100+R)) * 100 => (25/125)*100 = 20%."
          },
          {
            question: "যদি A:B = 3:4 এবং B:C = 5:6 হয়, তবে A:B:C কত?",
            options: ["15:20:24", "15:24:20", "3:5:6", "9:12:16"],
            correctAnswer: "15:20:24",
            explanation: "A = 3*5 = 15, B = 4*5 = 20, C = 4*6 = 24. সুতরাং অনুপাতটি ১৫:২০:২৪।"
          }
        ],
        month: "July 2026",
        timestamp: new Date().toISOString()
      },
      {
        id: "pdfn-seed-reasoning",
        subject: "reasoning",
        title: "July 2026 - Mental Ability: Master Coding-Decoding & Direction Sense",
        introduction: "এই গাইডটিতে রিজনিং বা মানসিক দক্ষতার সবচেয়ে গুরুত্বপূর্ণ টপিক কোডিং-ডিকোডিং এবং দিক নির্ণয় সংক্রান্ত শর্টকাট ট্রিক্স দেওয়া হলো।",
        keyTopics: ["Alphabet Series Codes", "Direction & Distances", "Visual Analogy"],
        theoryContent: "### ১. কোডিং-ডিকোডিং সহজ করার নিয়ম:\nইংরেজি বর্ণমালার অবস্থান সহজে মনে রাখার জন্য **EJOTY** সূত্র ব্যবহার করুন:\n* E = 5, J = 10, O = 15, T = 20, Y = 25\n\n**উদাহরণ:** যদি CAT কে ২৫ লেখা হয়, তবে DOG কে কত লেখা হবে?\n* CAT = C(3) + A(1) + T(20) + 1 = 25\n* DOG = D(4) + O(15) + G(7) + 1 = 27\n\n### ২. দিক নির্ণয় (Direction Sense):\nসব সময় নিজের ডানদিককে পূর্ব (East), বামদিককে পশ্চিম (West), সামনের দিককে উত্তর (North), এবং পিছনের দিককে দক্ষিণ (South) হিসেবে ধরে নিন। পিথাগোরাসের উপপাদ্য ( can be applied: অতিভুজ² = লম্ব² + ভূমি²) ব্যবহার করে দূরত্ব বের করুন।",
        mcqs: [
          {
            question: "এক ব্যক্তি উত্তর দিকে ৪ কিমি হাঁটার পর ডানদিকে ঘুরে ৩ কিমি হাঁটলো। সে শুরুর স্থান থেকে এখন কত দূরে আছে?",
            options: ["৫ কিমি", "৭ কিমি", "১ কিমি", "১২ কিমি"],
            correctAnswer: "৫ কিমি",
            explanation: "পিথাগোরাসের উপপাদ্য অনুসারে, দূরত্ব = √(৪² + ৩²) = √(১৬ + ৯) = √২৫ = ৫ কিমি।"
          }
        ],
        month: "July 2026",
        timestamp: new Date().toISOString()
      },
      {
        id: "pdfn-seed-english",
        subject: "english",
        title: "July 2026 - English Grammar: Subject-Verb Agreement Rules & Common Errors",
        introduction: "চাকরির পরীক্ষায় ইংরেজিতে সবচেয়ে বেশি আসা Subject-Verb Agreement এর জটিল নিয়মগুলো বাংলায় সহজ ব্যাখ্যাসহ শিখুন।",
        keyTopics: ["Collective Noun Rules", "Either/Or, Neither/Nor Cases", "Prepositional Phrases"],
        theoryContent: "### Rule 1: Collective Nouns\nCollective Noun সাধারণত singular verb গ্রহণ করে। কিন্তু তারা যদি বিভক্ত মতবাদ প্রকাশ করে, তবে plural verb হয়।\n* *Example:* The jury **is** unanimous in its decision. (Singular)\n* *Example:* The jury **are** divided in their opinions. (Plural)\n\n### Rule 2: Either/Or & Neither/Nor\nEither... or বা Neither... nor দ্বারা দুটি Subject যুক্ত থাকলে, verb সর্বদা দ্বিতীয়/নিকটবর্তী Subject অনুয়ায়ী পরিবর্তিত হয়।\n* *Example:* Neither the teacher nor the **students** **are** present. (students plural, তাই are হয়েছে)\n* *Example:* Either the students or the **teacher** **is** present. (teacher singular, তাই is হয়েছে)",
        mcqs: [
          {
            question: "Identify the correct sentence:",
            options: [
              "Many a boy has done his homework.",
              "Many a boy have done their homework.",
              "Many a boys have done his homework.",
              "Many boys has done their homework."
            ],
            correctAnswer: "Many a boy has done his homework.",
            explanation: "'Many a' এর পর singular noun এবং singular verb বসে। তাই 'Many a boy has' সঠিক।"
          }
        ],
        month: "July 2026",
        timestamp: new Date().toISOString()
      },
      {
        id: "pdfn-seed-science",
        subject: "science",
        title: "July 2026 - General Science: Physics Laws & Human Physiology Basics",
        introduction: "পদার্থবিজ্ঞানের প্রধান সূত্রাবলী এবং জীববিজ্ঞানের মানবদেহ সম্পর্কিত অতি গুরুত্বপূর্ণ প্রশ্ন ও উত্তর।",
        keyTopics: ["Newton's Laws of Motion", "Human Blood & Circulation", "Optical Instruments"],
        theoryContent: "### ১. নিউটনের গতিসূত্র (Newton's Laws of Motion):\n* **প্রথম সূত্র:** বাহ্যিক বল প্রয়োগ না করলে স্থির বস্তু চিরকাল স্থির এবং গতিশীল বস্তু চিরকাল সুষম গতিতে চলতে থাকবে (জড়তার ধারণা)।\n* **দ্বিতীয় সূত্র:** বস্তুর ভরবেগের পরিবর্তনের হার তার উপর প্রযুক্ত বলের সমানুপাতিক (F = ma)।\n* **তৃতীয় সূত্র:** প্রত্যেক ক্রিয়ারই একটি সমান ও বিপরীত প্রতিক্রিয়া আছে।\n\n### ২. মানব রক্ত সংবহন (Human Blood Group):\n* **সর্বজনীন দাতা (Universal Donor):** O Negative (O-)\n* **সর্বজনীন গ্রহীতা (Universal Recipient):** AB Positive (AB+)",
        mcqs: [
          {
            question: "কোন রক্ত গ্রুপকে সর্বজনীন দাতা বলা হয়?",
            options: ["O-", "O+", "AB+", "A-"],
            correctAnswer: "O-",
            explanation: "O Negative রক্তের গ্রুপে কোনো অ্যান্টিজেন থাকে না, তাই এটি যেকোনো রোগীকে দেওয়া যায়।"
          }
        ],
        month: "July 2026",
        timestamp: new Date().toISOString()
      },
      {
        id: "pdfn-seed-history",
        subject: "history",
        title: "July 2026 - History: Ancient Bengal & Indian Freedom Movement Guide",
        introduction: "প্রাচীন বাংলার শাসন ব্যবস্থা এবং সিপাহী বিদ্রোহ থেকে শুরু করে ১৯৪৭ সাল পর্যন্ত স্বাধীনতা সংগ্রামের সালভিত্তিক সারসংক্ষেপ।",
        keyTopics: ["Mauryan & Gupta Rule", "Mughal Bengal", "Indian Independence Movement"],
        theoryContent: "### ১. প্রাচীন বাংলার ইতিহাস:\n* প্রথম স্বাধীন নরপতি বা রাজা ছিলেন **শশাঙ্ক** (যার রাজধানী ছিল কর্ণসুবর্ণ)।\n* পাল বংশের প্রতিষ্ঠাতা ছিলেন **গোপাল**, যিনি বাংলায় প্রথম গণতান্ত্রিক পদ্ধতিতে নির্বাচিত রাজা ছিলেন।\n\n### ২. ভারতের স্বাধীনতা সংগ্রাম (১৮৫৭ - ১৯৪৭):\n* **১৮৫৭:** সিপাহী বিদ্রোহ (মঙ্গল পান্ডে প্রথম শহীদ হন)।\n* **১৯০৫:** বঙ্গভঙ্গ (লর্ড কার্জন দ্বারা)।\n* **১৯১১:** বঙ্গভঙ্গ রদ (লর্ড হার্ডিঞ্জ দ্বারা)।\n* **১৯৪২:** ভারত ছাড়ো আন্দোলন।\n* **১৯৪৭:** ভারত ও পাকিস্তানের স্বাধীনতা লাভ।",
        mcqs: [
          {
            question: "বাংলার প্রথম স্বাধীন ও সার্বভৌম রাজা কে ছিলেন?",
            options: ["শশাঙ্ক", "গোপাল", "ধর্মপাল", "লক্ষণ সেন"],
            correctAnswer: "শশাঙ্ক",
            explanation: "রাজা শশাঙ্ক সপ্তম শতাব্দীর শুরুতে প্রাচীন বাংলার গৌড় রাজ্যের প্রথম স্বাধীন ও সার্বভৌম শাসক ছিলেন।"
          }
        ],
        month: "July 2026",
        timestamp: new Date().toISOString()
      },
      {
        id: "pdfn-seed-geography",
        subject: "geography",
        title: "July 2026 - Geography: Physical Geography of Bengal & River Systems",
        introduction: "বাংলাদেশ ও ভারতের ভৌগোলিক অবস্থান, ভূপ্রকৃতি, নদনদী এবং জলবায়ু পরিবর্তন সংক্রান্ত গুরুত্বপূর্ণ তথ্যাবলী।",
        keyTopics: ["Geographical Boundaries", "River Systems of Bengal", "Natural Disasters"],
        theoryContent: "### ১. বাংলার ভৌগোলিক অবস্থান ও সীমানা:\n* বাংলার উপর দিয়ে **কর্কটক্রান্তি রেখা (Tropic of Cancer)** অতিবাহিত হয়েছে।\n* পৃথিবীর দীর্ঘতম সমুদ্র সৈকত **কক্সবাজার** এবং বৃহত্তম ম্যানগ্রোভ বন **সুন্দরবন** বাংলায় অবস্থিত।\n\n### ২. নদনদী ও উপনদী:\n* পদ্মা নদী ভারতে **গঙ্গা** নামে পরিচিত। এটি চাঁপাইনবাবগঞ্জ দিয়ে বাংলাদেশে প্রবেশ করেছে।\n* ব্রহ্মপুত্র নদ কুড়িগ্রাম জেলার মধ্য দিয়ে বাংলাদেশে প্রবেশ করে পরবর্তীতে যমুনা নামে প্রবাহিত হয়েছে।",
        mcqs: [
          {
            question: "কর্কটক্রান্তি রেখা বাংলার কোন অংশের উপর দিয়ে গিয়েছে?",
            options: ["ঠিক মাঝখান দিয়ে", "উত্তরাঞ্চল দিয়ে", "দক্ষিণাঞ্চল দিয়ে", "সীমান্তবর্তী এলাকা দিয়ে"],
            correctAnswer: "ঠিক মাঝখান দিয়ে",
            explanation: "২৩.৫ ডিগ্রি উত্তর অক্ষাংশ বা কর্কটক্রান্তি রেখা বাংলার (বাংলাদেশ ও পশ্চিমবঙ্গ) প্রায় মাঝখান দিয়ে প্রবাহিত হয়েছে।"
          }
        ],
        month: "July 2026",
        timestamp: new Date().toISOString()
      },
      {
        id: "pdfn-seed-polity",
        subject: "polity",
        title: "July 2026 - Constitution & Polity: Fundamental Rights & Judicial Review",
        introduction: "সংবিধানের প্রধান বৈশিষ্ট্যসমূহ, মৌলিক অধিকার, এবং সরকারি নীতি নির্ধারণের মূল উৎসসমূহ সহজ ভাষায় আলোচনা।",
        keyTopics: ["Preamble & Structure", "Fundamental Rights", "Directive Principles"],
        theoryContent: "### ১. সংবিধানের কাঠামো:\n* সংবিধান হলো রাষ্ট্রের সর্বোচ্চ আইন।\n* মূল সংবিধানে নাগরিকদের মৌলিক অধিকারগুলো সুনির্দিষ্টভাবে বর্ণনা করা থাকে।\n\n### ২. মৌলিক অধিকারসমূহ (Fundamental Rights):\n* আইন বা আদালতের মাধ্যমে মৌলিক অধিকার প্রয়োগ করা যায়।\n* রাষ্ট্রের জরুরি অবস্থায় নাগরিক অধিকার সাময়িকভাবে স্থগিত করা হতে পারে।",
        mcqs: [
          {
            question: "কোনো দেশের সংবিধানের প্রধান কাজ কী?",
            options: [
              "সরকার ও জনগণের মধ্যে ক্ষমতার ভারসাম্য বজায় রাখা ও রাষ্ট্র পরিচালনা করা",
              " his/her basic tax",
              "বিদেশি সম্পর্ক নিয়ন্ত্রণ করা",
              "বিচারকদের বেতন নির্ধারণ করা"
            ],
            correctAnswer: "সরকার ও জনগণের মধ্যে ক্ষমতার ভারসাম্য বজায় রাখা ও রাষ্ট্র পরিচালনা করা",
            explanation: "সংবিধান রাষ্ট্রের মৌলিক আইন যা সরকারের কাঠামো ও নাগরিকদের অধিকারের গ্যারান্টি দেয়।"
          }
        ],
        month: "July 2026",
        timestamp: new Date().toISOString()
      },
      {
        id: "pdfn-seed-economics",
        subject: "economics",
        title: "July 2026 - Economics: National Income & Five-Year Planning Analysis",
        introduction: "জিডিপি, জিএনপি এবং পঞ্চবার্ষিক পরিকল্পনা ও বাজেট সংক্রান্ত অর্থনৈতিক জটিল শব্দসমূহের সহজ বিশ্লেষণ।",
        keyTopics: ["National Income (GDP, GNP)", "Inflation & Banking", "Five-Year Plans"],
        theoryContent: "### ১. জাতীয় আয় পরিমাপের উপাদান:\n* **GDP (Gross Domestic Product):** একটি দেশের ভৌগোলিক সীমানার ভিতরে উৎপাদিত মোট পণ্য ও সেবার মূল্য।\n* **GNP (Gross National Product):** দেশের নাগরিকদের উৎপাদিত মোট পণ্য ও সেবা (দেশ এবং বিদেশে)।\n\n### ২. মুদ্রাস্ফীতি (Inflation):\n* বাজারে মুদ্রার সরবরাহ বেড়ে গেলে পণ্যের দাম বাড়ে এবং টাকার মান কমে যায়, একে মুদ্রাস্ফীতি বলে।",
        mcqs: [
          {
            question: "GDP এবং GNP এর মধ্যে প্রধান পার্থক্য কী?",
            options: [
              "ভৌগোলিক সীমানা বনাম নাগরিকত্ব ভিত্তিক উৎপাদন",
              "ট্যাক্স ও ভ্যাট সংক্রান্ত হিসাব",
              "আমদানি ও রপ্তানির অনুপাত",
              "কোনো পার্থক্য নেই"
            ],
            correctAnswer: "ভৌগোলিক সীমানা বনাম নাগরিকত্ব ভিত্তিক উৎপাদন",
            explanation: "GDP গণনা করা হয় ভৌগোলিক সীমানার ভেতরের উৎপাদনের ওপর ভিত্তি করে, আর GNP দেশের সকল নাগরিকের মোট আয়ের ওপর ভিত্তি করে।"
          }
        ],
        month: "July 2026",
        timestamp: new Date().toISOString()
      }
    ];

    if (firestore) {
      for (const note of seedData) {
        await firestore.collection("aiPdfNotes").doc(note.id).set(note);
      }
    } else {
      // no-op
    }
    console.log("AI PDF Notes successfully seeded in database!");
  } catch (error) {
    console.error("Error seeding AI PDF notes:", error);
  }
}

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
    app.use((req, res, next) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      next();
    });

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.webmanifest') || filePath.endsWith('.json')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));
    
    app.get("*", (req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Initialize Database (Neon or Local fallback)
  try {
    await initDatabase();
  } catch (err) {
    console.error("Database initialization failed:", err);
  }

  // Seed AI PDF Notes
  try {
    const count = await getAiPdfNotesCount();
    if (count === 0) {
      const seedData = [
        {
          id: "pdfn-seed-math",
          subject: "math",
          title: "July 2026 - Quantitative Aptitude: Magic Shortcut Tricks for Percentage & Ratio",
          introduction: "এই গাইডটিতে শতকরা ও অনুপাতের জটিল অংকগুলো মাত্র ৫-১০ সেকেন্ডে সমাধান করার শর্টকাট টেকনিক ও গুরুত্বপূর্ণ প্রশ্ন আলোচনা করা হয়েছে।",
          keyTopics: ["Percentage Rules", "Ratio & Proportion", "BCS Prep Hacks"],
          theoryContent: "### ১. শতকরা নির্নয়ের ম্যাজিক ট্রিক (Percentage Shortcuts):\nশতকরা অংকগুলো সহজে করার জন্য ভগ্নাংশে রূপান্তর করা শিখতে হবে।\n* ২০% = ১/৫\n* ২৫% = ১/৪\n* ৫০% = ১/২\n\n** can_be_applied:** চালের মূল্য ২০% বৃদ্ধি পেলে চালের ব্যবহার শতকরা কত কমালে খরচের কোনো পরিবর্তন হবে না?\n* **শর্টকাট সূত্র:** (R / (100 + R)) * 100\n* সমাধান: (২০ / ১২০) * ১০০ = ১৬.৬৭%\n\n### ২. অনুপাত ও অংশীদারিত্ব (Ratio & Proportion Hacks):\nযদি A:B = 2:3 এবং B:C = 4:5 হয়, তবে A:B:C = ?\n* **শর্টকাট 'দ' পদ্ধতি:**\n  * A = 2 * 4 = 8\n  * B = 3 * 4 = 12\n  * C = 3 * 5 = 15\n  * উত্তর: 8:12:15",
          mcqs: [
            {
              question: "চালের মূল্য ২৫% বৃদ্ধি পেলে চালের ব্যবহার শতকরা কত কমালে খরচ অপরিবর্তিত থাকবে?",
              options: ["২০%", "২৫%", "১৬.৬৭%", "১৫%"],
              correctAnswer: "২০%",
              explanation: "সূত্র: (R / (100+R)) * 100 => (25/125)*100 = 20%."
            },
            {
              question: "যদি A:B = 3:4 এবং B:C = 5:6 হয়, তবে A:B:C কত?",
              options: ["15:20:24", "15:24:20", "3:5:6", "9:12:16"],
              correctAnswer: "15:20:24",
              explanation: "A = 3*5 = 15, B = 4*5 = 20, C = 4*6 = 24. সুতরাং অনুপাতটি ১৫:২০:২৪।"
            }
          ],
          month: "July 2026",
          timestamp: new Date().toISOString()
        },
        {
          id: "pdfn-seed-reasoning",
          subject: "reasoning",
          title: "July 2026 - Mental Ability: Master Coding-Decoding & Direction Sense",
          introduction: "এই গাইডটিতে রিজনিং বা মানসিক দক্ষতার সবচেয়ে গুরুত্বপূর্ণ টপিক কোডিং-ডিকোডিং এবং দিক নির্ণয় সংক্রান্ত শর্টকাট ট্রিক্স দেওয়া হলো।",
          keyTopics: ["Alphabet Series Codes", "Direction & Distances", "Visual Analogy"],
          theoryContent: "### ১. কোডিং-ডিকোডিং সহজ করার নিয়ম:\nইংরেজি বর্ণমালার অবস্থান সহজে মনে রাখার জন্য **EJOTY** সূত্র ব্যবহার করুন:\n* E = 5, J = 10, O = 15, T = 20, Y = 25\n\n** can_be_applied:** যদি CAT কে ২৫ লেখা হয়, তবে DOG কে কত লেখা হবে?\n* CAT = C(3) + A(1) + T(20) + 1 = 25\n* DOG = D(4) + O(15) + G(7) + 1 = 27\n\n### ২. দিক নির্ণয় (Direction Sense):\nসব সময় নিজের ডানদিককে পূর্ব (East),বামদিককে পশ্চিম (West), সামনের দিককে উত্তর (North), এবং পিছনের দিককে দক্ষিণ (South) হিসেবে ধরে নিন। পিথাগোরাসের উপপাদ্য ( can be applied: অতিভুজ² = লম্ব² + ভূমি²) ব্যবহার করে দূরত্ব বের করুন।",
          mcqs: [
            {
              question: "এক ব্যক্তি উত্তর দিকে ৪ কিমি হাঁটার পর ডানদিকে ঘুরে ৩ কিমি হাঁটলো। সে শুরুর স্থান থেকে এখন কত দূরে আছে?",
              options: ["৫ কিমি", "৭ কিমি", "১ কিমি", "১২ কিমি"],
              correctAnswer: "৫ কিমি",
              explanation: "পিথাগোরাসের উপপাদ্য অনুসারে, দূরত্ব = √(৪² + ৩²) = √(১৬ + ৯) = √২৫ = ৫ কিমি।"
            }
          ],
          month: "July 2026",
          timestamp: new Date().toISOString()
        },
        {
          id: "pdfn-seed-english",
          subject: "english",
          title: "July 2026 - English Grammar: Subject-Verb Agreement Rules & Common Errors",
          introduction: "চাকরির পরীক্ষায় ইংরেজিতে সবচেয়ে বেশি আসা Subject-Verb Agreement এর জটিল নিয়মগুলো বাংলায় সহজ ব্যাখ্যাসহ শিখুন।",
          keyTopics: ["Collective Noun Rules", "Either/Or, Neither/Nor Cases", "Prepositional Phrases"],
          theoryContent: "### Rule 1: Collective Nouns\nCollective Noun সাধারণত singular verb গ্রহণ করে। কিন্তু তারা যদি বিভক্ত মতবাদ প্রকাশ করে, তবে plural verb হয়।\n* *Example:* The jury **is** unanimous in its decision. (Singular)\n* *Example:* The jury **are** divided in their opinions. (Plural)\n\n### Rule 2: Either/Or & Neither/Nor\nEither... or বা Neither... nor দ্বারা দুটি Subject যুক্ত থাকলে, verb সর্বদা দ্বিতীয়/নিকটবর্তী Subject অনুয়ায়ী পরিবর্তিত হয়।\n* *Example:* Neither the teacher nor the **students** **are** present. (students plural, তাই are হয়েছে)\n* *Example:* Either the students or the **teacher** **is** present. (teacher singular, তাই is হয়েছে)",
          mcqs: [
            {
              question: "Identify the correct sentence:",
              options: [
                "Many a boy has done his homework.",
                "Many a boy have done their homework.",
                "Many a boys have done his homework.",
                "Many boys has done their homework."
              ],
              correctAnswer: "Many a boy has done his homework.",
              explanation: "'Many a' এর পর singular noun এবং singular verb বসে। তাই 'Many a boy has' সঠিক।"
            }
          ],
          month: "July 2026",
          timestamp: new Date().toISOString()
        },
        {
          id: "pdfn-seed-science",
          subject: "science",
          title: "July 2026 - General Science: Physics Laws & Human Physiology Basics",
          introduction: "পদার্থবিজ্ঞানের প্রধান সূত্রাবলী এবং জীববিজ্ঞানের মানবদেহ সম্পর্কিত অতি গুরুত্বপূর্ণ প্রশ্ন ও উত্তর।",
          keyTopics: ["Newton's Laws of Motion", "Human Blood & Circulation", "Optical Instruments"],
          theoryContent: "### ১. নিউটনের গতিসূত্র (Newton's Laws of Motion):\n* **প্রথম সূত্র:** বাহ্যিক বল প্রয়োগ না করলে স্থির বস্তু চিরকাল স্থির এবং গতিশীল বস্তু চিরকাল সুষম গতিতে চলতে থাকবে (জড়তার ধারণা)।\n* **দ্বিতীয় সূত্র:** gymnast-এর ভরবেগের পরিবর্তনের হার তার উপর প্রযুক্ত বলের সমানুপাতিক (F = ma)।\n* ** can_be_applied:** প্রত্যেক ক্রিয়ারই একটি সমান ও বিপরীত প্রতিক্রিয়া আছে।\n\n### ২. মানব রক্ত সংবহন (Human Blood Group):\n* **सर्वजनীন दता (Universal Donor):** O Negative (O-)\n* **सर्वजनীন ग्रहीতা (Universal Recipient):** AB Positive (AB+)",
          mcqs: [
            {
              question: "কোন রক্ত গ্রুপকে সর্বজনীন দাতা বলা হয়?",
              options: ["O-", "O+", "AB+", "A-"],
              correctAnswer: "O-",
              explanation: "O Negative রক্তের গ্রুপে কোনো অ্যান্টিজেন থাকে না, তাই এটি যেকোনো রোগীকে দেওয়া যায়।"
            }
          ],
          month: "July 2026",
          timestamp: new Date().toISOString()
        },
        {
          id: "pdfn-seed-history",
          subject: "history",
          title: "July 2026 - History: Ancient Bengal & Indian Freedom Movement Guide",
          introduction: "প্রাচীন বাংলার শাসন ব্যবস্থা এবং সিপাহী বিদ্রোহ থেকে শুরু করে ১৯৪৭ সাল পর্যন্ত স্বাধীনতা সংগ্রামের সালভিত্তিক সারসংক্ষেপ।",
          keyTopics: ["Mauryan & Gupta Rule", "Mughal Bengal", "Indian Independence Movement"],
          theoryContent: "### ১. প্রাচীন বাংলার ইতিহাস:\n* প্রথম স্বাধীন নরপতি বা রাজা ছিলেন **শশাঙ্ক** (যার রাজধানী ছিল কর্ণসুবর্ণ)।\n* পাল বংশের প্রতিষ্ঠাতা ছিলেন **গোপাল**, যিনি বাংলায় প্রথম গণতান্ত্রিক পদ্ধতিতে নির্বাচিত রাজা ছিলেন।\n\n### ২. ভারতের স্বাধীনতা সংগ্রাম (১৮৫৭ - ১৯৪৭):\n* **১৮৫৭:** সিপাহী বিদ্রোহ (মঙ্গল পান্ডে প্রথম শহীদ হন)।\n* **১৯০৫:** বঙ্গভঙ্গ (লর্ড কার্জন দ্বারা)।\n* **১৯১১:** বঙ্গভঙ্গ রদ (লর্ড হার্ডিঞ্জ দ্বারা)।\n* **১৯৪২:** ভারত ছাড়ো আন্দোলন।\n* **১৯৪৭:** ভারত ও পাকিস্তানের স্বাধীনতা লাভ।",
          mcqs: [
            {
              question: "বাংলার প্রথম স্বাধীন ও সার্বভৌম রাজা কে ছিলেন?",
              options: ["শশাঙ্ক", "গোপাল", "ধর্মপাল", "লক্ষণ সেন"],
              correctAnswer: "শশাঙ্ক",
              explanation: "রাজা শশাঙ্ক সপ্তম শতাব্দীর শুরুতে প্রাচীন বাংলার গৌড় রাজ্যের প্রথম স্বাধীন ও সার্বভৌম শাসক ছিলেন।"
            }
          ],
          month: "July 2026",
          timestamp: new Date().toISOString()
        },
        {
          id: "pdfn-seed-geography",
          subject: "geography",
          title: "July 2026 - Geography: Physical Geography of Bengal & River Systems",
          introduction: "বাংলাদেশ ও ভারতের ভৌগোলিক অবস্থান, ভূপ্রকৃতি, নদনদী এবং জলবায়ু পরিবর্তন সংক্রান্ত গুরুত্বপূর্ণ তথ্যাবলী।",
          keyTopics: ["Geographical Boundaries", "River Systems of Bengal", "Natural Disasters"],
          theoryContent: "### ১. বাংলার ভৌগোলিক অবস্থান ও সীমানা:\n* বাংলার উপর দিয়ে **কর্কটক্রান্তি রেখা (Tropic of Cancer)** অতিবাহিত হয়েছে।\n* পৃথিবীর দীর্ঘতম সমুদ্র সৈকত **কক্সবাজার** এবং বৃহত্তম ম্যানগ্রোভ বন **সুন্দরবন** বাংলায় অবস্থিত।\n\n### ২. নদনদী ও উপনদী:\n* পদ্মা নদী ভারতে **গঙ্গা** নামে পরিচিত। এটি চাঁপাইনবাবগঞ্জ দিয়ে বাংলাদেশে প্রবেশ করেছে।\n* ব্রহ্মপুত্র নদ কুড়িগ্রাম জেলার মধ্য দিয়ে বাংলাদেশে প্রবেশ করে পরবর্তীতে যমুনা নামে প্রবাহিত হয়েছে।",
          mcqs: [
            {
              question: "কর্কটক্রান্তি রেখা বাংলার কোন অংশের উপর দিয়ে গিয়েছে?",
              options: ["ঠিক মাঝখান দিয়ে", "উত্তরাঞ্চল দিয়ে", "দক্ষিণাঞ্চল দিয়ে", "সীমান্তবর্তী এলাকা দিয়ে"],
              correctAnswer: "ঠিক মাঝখান দিয়ে",
              explanation: "২৩.৫ ডিগ্রি উত্তর অক্ষাংশ বা কর্কটক্রান্তি রেখা বাংলার (বাংলাদেশ ও পশ্চিমবঙ্গ) প্রায় মাঝখান দিয়ে প্রবাহিত হয়েছে।"
            }
          ],
          month: "July 2026",
          timestamp: new Date().toISOString()
        },
        {
          id: "pdfn-seed-polity",
          subject: "polity",
          title: "July 2026 - Constitution & Polity: Fundamental Rights & Judicial Review",
          introduction: "সংবিধানের প্রধান বৈশিষ্ট্যসমূহ, মৌলিক অধিকার, এবং সরকারি নীতি নির্ধারণের মূল উৎসসমূহ সহজ ভাষায় আলোচনা।",
          keyTopics: ["Preamble & Structure", "Fundamental Rights", "Directive Principles"],
          theoryContent: "### ১. সংবিধানের কাঠামো:\n* সংবিধান হলো রাষ্ট্রের সর্বোচ্চ আইন।\n* মূল সংবিধানে নাগরিকদের মৌলিক অধিকারগুলো সুনির্দিষ্টভাবে বর্ণনা করা থাকে।\n\n### ২. মৌলিক অধিকারসমূহ (Fundamental Rights):\n* আইন বা আদালতের মাধ্যমে মৌলিক অধিকার প্রয়োগ করা যায়।\n* রাষ্ট্রের জরুরি অবস্থায় নাগরিক অধিকার সাময়িকভাবে স্থগিত করা হতে পারে।",
          mcqs: [
            {
              question: "কোনো দেশের সংবিধানের প্রধান কাজ কী?",
              options: [
                "সরকার ও জনগণের মধ্যে ক্ষমতার ভারসাম্য বজায় রাখা ও রাষ্ট্র পরিচালনা করা",
                " his/her basic tax",
                " can_be_applied",
                "বিচারকদের বেতন নির্ধারণ করা"
              ],
              correctAnswer: "সরকার ও জনগণের মধ্যে ক্ষমতার ভারসাম্য বজায় রাখা ও রাষ্ট্র পরিচালনা করা",
              explanation: "সংবিধান রাষ্ট্রের মৌলিক আইন যা সরকারের কাঠামো ও নাগরিকদের অধিকারের গ্যারান্টি দেয়।"
            }
          ],
          month: "July 2026",
          timestamp: new Date().toISOString()
        },
        {
          id: "pdfn-seed-economics",
          subject: "economics",
          title: "July 2026 - Economics: National Income & Five-Year Planning Analysis",
          introduction: "জিডিপি, জিএনপি এবং পঞ্চবার্ষিক পরিকল্পনা ও বাজেট সংক্রান্ত অর্থনৈতিক জটিল শব্দসমূহের সহজ বিশ্লেষণ।",
          keyTopics: ["National Income (GDP, GNP)", "Inflation & Banking", "Five-Year Plans"],
          theoryContent: "### ১. জাতীয় আয় পরিমাপের উপাদান:\n* **GDP (Gross Domestic Product):** একটি দেশের ভৌগোলিক সীমানার ভিতরে উৎপাদিত মোট পণ্য ও সেবার মূল্য।\n* **GNP (Gross National Product):** দেশের নাগরিকদের উৎপাদিত মোট পণ্য ও সেবা (দেশ এবং বিদেশে)।\n\n### ২. মুদ্রাস্ফীতি (Inflation):\n* বাজারে মুদ্রার সরবরাহ বেড়ে গেলে পণ্যের দাম বাড়ে এবং টাকার মান কমে যায়, একে মুদ্রাস্ফীতি বলে।",
          mcqs: [
            {
              question: "GDP এবং GNP এর মধ্যে প্রধান পার্থক্য কী?",
              options: [
                "ভৌগোলিক সীমানা বনাম নাগরিকত্ব ভিত্তিক উৎপাদন",
                " can_be_applied",
                "আমদানি ও রপ্তানির অনুপাত",
                "কোনো পার্থক্য নেই"
              ],
              correctAnswer: "ভৌগোলিক সীমানা বনাম নাগরিকত্ব ভিত্তিক উৎপাদন",
              explanation: "GDP গণনা করা হয় ভৌগোলিক সীমানার ভেতরের উৎপাদনের ওপর ভিত্তি করে, আর GNP দেশের সকল নাগরিকের মোট আয়ের ওপর ভিত্তি করে।"
            }
          ],
          month: "July 2026",
          timestamp: new Date().toISOString()
        }
      ];
      await seedAiPdfNotes(seedData);
      console.log("Successfully seeded AI PDF notes in Database!");
    } else {
      console.log("AI PDF notes already exist in Database.");
    }
  } catch (err) {
    console.error("Failed to seed AI PDF notes:", err);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
