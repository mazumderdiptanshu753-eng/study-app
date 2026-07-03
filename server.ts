import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  query, 
  where, 
  orderBy 
} from "firebase/firestore";

dotenv.config();

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_FILE = path.join(DATA_DIR, "db.json");

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

interface Database {
  users: StudentProfile[];
  chatMessages: ChatMessage[];
  activityLogs?: any[];
}

// Default DB State
let db: Database = {
  users: [],
  activityLogs: [],
  chatMessages: [
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
  ]
};

// Load DB from file
if (fs.existsSync(DB_FILE)) {
  try {
    const fileData = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(fileData);
    if (parsed.users) db.users = parsed.users;
    if (parsed.chatMessages) db.chatMessages = parsed.chatMessages;
    if (parsed.activityLogs) db.activityLogs = parsed.activityLogs;
  } catch (error) {
    console.error("Error loading db.json:", error);
  }
}

// Save DB to file
function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving db.json:", error);
  }
}

// Initialize Firebase Firestore using the config file
let firestore: any = null;
try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const firebaseApp = initializeApp(firebaseConfig);
    const dbId = firebaseConfig.firestoreDatabaseId || "(default)";
    firestore = getFirestore(firebaseApp, dbId);
    console.log(`Firebase Firestore initialized successfully with database: ${dbId}`);
  } else {
    console.warn("firebase-applet-config.json not found, using local JSON fallback");
  }
} catch (error) {
  console.error("Failed to initialize Firebase Firestore:", error);
}

async function withRetry(operation: any, maxRetries = 3) {

  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if ((error.status === 503 || error.message.includes("503")) && i < maxRetries - 1) {
        console.warn(`Received 503. Retrying ${i + 1}/${maxRetries} in ${1000 * (i + 1)}ms...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
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
    console.error("Error fetching GK questions:", error);
    res.status(500).json({ error: error.message || "Failed to fetch GK questions." });
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
    console.error("Error fetching important questions:", error);
    res.status(500).json({ error: error.message || "Failed to fetch important questions." });
  }
});

// --- Chat Application APIs ---

// Get Chat Messages
app.get("/api/chat/messages", async (req: express.Request, res: express.Response): Promise<any> => {
  const { email, role, name } = req.query;
  
  try {
    if (firestore) {
      const chatCol = collection(firestore, "chatMessages");
      const snapshot = await getDocs(chatCol);
      let messages = snapshot.docs.map(doc => doc.data() as ChatMessage);
      
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
        const msgDocRef = doc(chatCol, welcomeMsg.id);
        await setDoc(msgDocRef, welcomeMsg);
        return res.json([welcomeMsg]);
      }

      return res.json(messages);
    } else {
      if (role === "Admin") {
        return res.json(db.chatMessages);
      }

      if (!email) {
        return res.status(400).json({ error: "Email is required for students." });
      }

      const studentEmail = (email as string).trim().toLowerCase();
      const studentMessages = db.chatMessages.filter(m => m.studentEmail.toLowerCase() === studentEmail);

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
        db.chatMessages.push(welcomeMsg);
        saveDB();
        return res.json([welcomeMsg]);
      }

      res.json(studentMessages);
    }
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

  try {
    if (firestore) {
      const chatCol = collection(firestore, "chatMessages");
      const msgDocRef = doc(chatCol, newMsg.id);
      await setDoc(msgDocRef, newMsg);
      res.status(201).json(newMsg);
    } else {
      db.chatMessages.push(newMsg);
      saveDB();
      res.status(201).json(newMsg);
    }
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

    if (firestore) {
      const chatCol = collection(firestore, "chatMessages");
      const msgDocRef = doc(chatCol, aiMsg.id);
      await setDoc(msgDocRef, aiMsg);
    } else {
      db.chatMessages.push(aiMsg);
      saveDB();
    }
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
    
    if (firestore) {
      const chatCol = collection(firestore, "chatMessages");
      const msgDocRef = doc(chatCol, fallbackMsg.id);
      await setDoc(msgDocRef, fallbackMsg);
    } else {
      db.chatMessages.push(fallbackMsg);
      saveDB();
    }
    res.json(fallbackMsg);
  }
});

// --- Users API (Admin Panel Persistence) ---
app.get("/api/users", async (req: express.Request, res: express.Response) => {
  try {
    if (firestore) {
      const usersCol = collection(firestore, "users");
      const snapshot = await getDocs(usersCol);
      const usersList = snapshot.docs.map(doc => doc.data());
      res.json(usersList);
    } else {
      res.json(db.users);
    }
  } catch (error: any) {
    console.error("Error fetching users from Firestore:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/users", async (req: express.Request, res: express.Response): Promise<any> => {
  const user = req.body;
  if (!user.email) return res.status(400).json({ error: "Email is required" });
  
  try {
    if (firestore) {
      const emailKey = user.email.trim().toLowerCase();
      const userDocRef = doc(firestore, "users", emailKey);
      await setDoc(userDocRef, user, { merge: true });
      
      // Fetch updated list of all users to return
      const usersCol = collection(firestore, "users");
      const snapshot = await getDocs(usersCol);
      const usersList = snapshot.docs.map(doc => doc.data());
      res.json(usersList);
    } else {
      const existing = db.users.find(u => u.email.trim().toLowerCase() === user.email.trim().toLowerCase());
      if (existing) {
        Object.assign(existing, user);
      } else {
        db.users.push(user);
      }
      saveDB();
      res.json(db.users);
    }
  } catch (error: any) {
    console.error("Error saving user to Firestore:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- Activity Logs API ---
app.get("/api/activity-logs", async (req: express.Request, res: express.Response) => {
  try {
    if (firestore) {
      const logsCol = collection(firestore, "activityLogs");
      const snapshot = await getDocs(logsCol);
      let logsList = snapshot.docs.map(doc => doc.data());
      logsList.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      res.json(logsList);
    } else {
      res.json(db.activityLogs || []);
    }
  } catch (error: any) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/activity-logs", async (req: express.Request, res: express.Response): Promise<any> => {
  const log = req.body; // { userEmail, userName, action: "Login" | "Logout", timestamp: ISOString }
  if (!log.userEmail || !log.action) return res.status(400).json({ error: "Missing required fields" });
  
  log.id = `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  if (!log.timestamp) log.timestamp = new Date().toISOString();

  try {
    if (firestore) {
      const logDocRef = doc(firestore, "activityLogs", log.id);
      await setDoc(logDocRef, log);
      res.status(201).json(log);
    } else {
      if (!db.activityLogs) db.activityLogs = [];
      db.activityLogs.unshift(log);
      saveDB();
      res.status(201).json(log);
    }
  } catch (error: any) {
    console.error("Error saving activity log:", error);
    res.status(500).json({ error: error.message });
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
