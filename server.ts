var __defProp = Object.defineProperty;
var __name = (target, value) =>
  __defProp(target, "name", { value, configurable: true });
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
  deleteStudyNote,
  getAppVersion,
  saveAppVersion,
  getUserByEmail,
  getVideoLectures,
  saveVideoLecture,
  deleteVideoLecture,
  getNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "./server/db.js";
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
let firestore = null;
async function withRetry(operation, maxRetries = 10) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const status =
        error?.status || error?.statusCode || error?.response?.status;
      const errorMessage = error?.message || "";
      const isTransient =
        !status ||
        status === 429 ||
        status === 503 ||
        status === 500 ||
        status === 502 ||
        status === 504 ||
        errorMessage.includes("429") ||
        errorMessage.includes("503") ||
        errorMessage.includes("500") ||
        errorMessage.toLowerCase().includes("too many requests") ||
        errorMessage.toLowerCase().includes("resource exhausted") ||
        errorMessage.toLowerCase().includes("rate limit") ||
        errorMessage.toLowerCase().includes("overloaded");
      if (isTransient && i < maxRetries - 1) {
        // Exponential backoff with jitter
        const delay = Math.pow(2, i) * 2000 + Math.random() * 2000;
        console.warn(
          `Gemini API transient error (${status || errorMessage}). Retrying ${i + 1}/${maxRetries} in ${Math.round(delay)}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw lastError;
}
__name(withRetry, "withRetry");
const app = express();
app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
const PORT =
  (process.env.RENDER || !process.env.APPLET_ID) && process.env.PORT
    ? parseInt(process.env.PORT)
    : 3e3;
let aiInstance = null;
function getGeminiClient() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY environment variable is missing. Please add it in the Secrets panel.",
      );
    }
    const rawClient = new GoogleGenAI({ apiKey });
    const originalGenerateContent = rawClient.models.generateContent.bind(
      rawClient.models,
    );
    rawClient.models.generateContent = async function (...args) {
      return withRetry(() => originalGenerateContent(...args));
    };
    aiInstance = rawClient;
  }
  return aiInstance;
}
__name(getGeminiClient, "getGeminiClient");
app.post("/api/solve-doubt", async (req, res) => {
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
          required: [
            "explanation",
            "steps",
            "coreConcept",
            "analogy",
            "challenge",
          ],
          properties: {
            explanation: { type: Type.STRING },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            coreConcept: { type: Type.STRING },
            analogy: { type: Type.STRING },
            challenge: {
              type: Type.OBJECT,
              required: [
                "question",
                "options",
                "correctOptionIndex",
                "explanation",
              ],
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
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
  } catch (error) {
    console.error("Error solving doubt:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to solve doubt using Gemini." });
  }
});
app.post("/api/summarize-note", async (req, res) => {
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
            summaryPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    });
    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error) {
    console.error("Error summarizing note:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to summarize note." });
  }
});
app.post("/api/generate-flashcards", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!content) {
      return res
        .status(400)
        .json({ error: "Content is required to generate flashcards." });
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
                  front: {
                    type: Type.STRING,
                    description:
                      "The front of the flashcard containing a term, question, or problem.",
                  },
                  back: {
                    type: Type.STRING,
                    description:
                      "The back of the flashcard containing the definition, explanation, or answer.",
                  },
                },
              },
            },
          },
        },
      },
    });
    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error) {
    console.error("Error generating flashcards:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to generate flashcards." });
  }
});
app.post("/api/study-assistant/chat", async (req, res) => {
  try {
    const { messages, lang } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }
    const ai = getGeminiClient();
    const isBengali = lang === "bn";
    let chatHistory =
      "You are a helpful and intelligent AI Study Assistant designed to help students understand their academic subjects. Be encouraging, clear, and educational.\n\n";
    chatHistory +=
      "Language of explanation: " +
      (isBengali ? "Bengali (\u09AC\u09BE\u0982\u09B2\u09BE)" : "English") +
      "\n\n";
    for (const msg of messages) {
      chatHistory += `${msg.role === "user" ? "Student" : "Assistant"}: ${msg.content}
`;
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
app.post("/api/summarize-note", async (req, res) => {
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
  } catch (error) {
    console.error("Summarizer Error:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/generate-flashcards", async (req, res) => {
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
  } catch (error) {
    console.error("Flashcard Error:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/solve-math", async (req, res) => {
  try {
    const { problem, file, lang } = req.body;
    if (!problem && !file) {
      return res
        .status(400)
        .json({
          error: "Please provide a problem statement or upload an image/PDF.",
        });
    }
    const ai = getGeminiClient();
    const isBengali = lang === "bn";
    const prompt = `You are an expert universal tutor and solver across all subjects (Math, Science, History, Literature, etc.). 
${file ? "We have provided a document or image containing the problem. Please analyze the file carefully, extract the problem, and solve it." : ""}
Please solve the problem or answer the question in a step-by-step, pedagogical, 100% correct, and extremely clear manner.

${problem ? `Problem/Context provided by user: "${problem}"` : "Please extract and solve the problem shown in the provided document."}

Language of explanation: ${isBengali ? "Bengali (\u09AC\u09BE\u0982\u09B2\u09BE)" : "English"}

Please provide a highly detailed response. Follow this strict schema:
- problem: The extracted or original problem statement/question.
- coreConcept: The primary rule, theorem, formula, or concept involved.
- steps: A sequential array of step-by-step operations and logical explanations showing how to solve the problem. Keep the steps clear, accurate, and easy to follow.
- finalAnswer: The final, simplified answer (e.g., "x = 2 or x = 3").`;
    const contents: any[] = [prompt];
    if (file && file.data && file.mimeType) {
      contents.push({
        inlineData: { data: file.data, mimeType: file.mimeType },
      });
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["problem", "coreConcept", "steps", "finalAnswer"],
          properties: {
            problem: { type: Type.STRING },
            coreConcept: { type: Type.STRING },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            finalAnswer: { type: Type.STRING },
          },
        },
      },
    });
    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error) {
    console.error("Error solving math with AI:", error);
    res
      .status(500)
      .json({
        error: error.message || "Failed to solve math problem using AI.",
      });
  }
});
app.get("/api/app-version", async (req, res) => {
  try {
    const versionInfo = await getAppVersion();
    res.json(versionInfo);
  } catch (error) {
    console.error("Error getting app version:", error);
    res.status(500).json({ error: "Failed to get app version settings." });
  }
});
app.post("/api/app-version", async (req, res) => {
  try {
    const { latestVersion, changelogEn, changelogBn, adminEmail } = req.body;
    const headerAdminEmail = req.headers["x-admin-email"];
    const emailToVerify = (adminEmail || headerAdminEmail || "").trim();
    if (!emailToVerify) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Admin verification email is missing." });
    }
    const user = await getUserByEmail(emailToVerify);
    const isRootAdmin =
      emailToVerify.toLowerCase() === "mazumderdiptanshu753@gmail.com";
    const isAdmin = isRootAdmin || (user && user.role === "Admin");
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Forbidden: Only administrators can release updates." });
    }
    if (!latestVersion) {
      return res.status(400).json({ error: "latestVersion is required." });
    }
    const versionInfo = {
      latestVersion,
      changelogEn: changelogEn || "",
      changelogBn: changelogBn || "",
    };
    const saved = await saveAppVersion(versionInfo);
    try {
      await createNotification({
        title:
          "\u09A8\u09A4\u09C1\u09A8 \u0985\u09CD\u09AF\u09BE\u09AA \u0986\u09AA\u09A1\u09C7\u099F \u0989\u09AA\u09B2\u09AC\u09CD\u09A7! \u{1F680}",
        message: `\u09B8\u09CD\u099F\u09BE\u09A1\u09BF \u09B9\u09BE\u09AC\u09C7\u09B0 \u09A8\u09A4\u09C1\u09A8 \u09B8\u0982\u09B8\u09CD\u0995\u09B0\u09A3 v${latestVersion} \u09AA\u09CD\u09B0\u0995\u09BE\u09B6 \u0995\u09B0\u09BE \u09B9\u09DF\u09C7\u099B\u09C7\u0964 \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8\u09B8\u09AE\u09C2\u09B9: ${changelogBn || changelogEn || "\u09AC\u09BE\u0997 \u09AB\u09BF\u0995\u09CD\u09B8 \u098F\u09AC\u0982 \u0989\u09A8\u09CD\u09A8\u09A4 \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09CD\u09B7\u09AE\u09A4\u09BE\u0964"}`,
        type: "info",
      });
    } catch (notifErr) {
      console.error("Failed to create update release notification:", notifErr);
    }
    res.json(saved);
  } catch (error) {
    console.error("Error saving app version:", error);
    res.status(500).json({ error: "Failed to release update." });
  }
});
app.get("/api/gk-questions", async (req, res) => {
  try {
    const ai = getGeminiClient();
    const now = new Date();
    const oneJan = new Date(now.getFullYear(), 0, 1);
    const numberOfDays = Math.floor(
      (now.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1e3),
    );
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
                required: [
                  "question",
                  "options",
                  "correctOptionIndex",
                  "explanation",
                ],
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctOptionIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });
    const data = JSON.parse(response.text || '{"questions": []}');
    res.json(data);
  } catch (error) {
    console.warn("Using fallback for GK questions due to API limit.");
    const fallbackData = {
      questions: [
        {
          question:
            "Which of the following planets is known as the Red Planet?",
          options: ["Venus", "Mars", "Jupiter", "Saturn"],
          correctOptionIndex: 1,
          explanation:
            "Mars is often called the 'Red Planet' due to the iron oxide prevalent on its surface.",
        },
        {
          question: "Who was the first President of independent India?",
          options: [
            "Jawaharlal Nehru",
            "Dr. Rajendra Prasad",
            "Sardar Vallabhbhai Patel",
            "B.R. Ambedkar",
          ],
          correctOptionIndex: 1,
          explanation:
            "Dr. Rajendra Prasad was the first President of India, serving from 1950 to 1962.",
        },
        {
          question: "What is the capital of Australia?",
          options: ["Sydney", "Melbourne", "Canberra", "Perth"],
          correctOptionIndex: 2,
          explanation: "Canberra is the capital city of Australia.",
        },
        {
          question:
            "The Indus Valley Civilization was primarily located in which present-day regions?",
          options: [
            "India and Nepal",
            "Pakistan and Northwest India",
            "Afghanistan and Iran",
            "Bangladesh and East India",
          ],
          correctOptionIndex: 1,
          explanation:
            "The Indus Valley Civilization flourished in the basins of the Indus River, largely in present-day Pakistan and northwest India.",
        },
        {
          question: "What is the chemical symbol for gold?",
          options: ["Ag", "Au", "Pb", "Fe"],
          correctOptionIndex: 1,
          explanation:
            "The symbol 'Au' comes from the Latin word for gold, 'aurum'.",
        },
      ],
    };
    res.json(fallbackData);
  }
});
app.get("/api/important-questions", async (req, res) => {
  try {
    const ai = getGeminiClient();
    const now = new Date();
    const oneJan = new Date(now.getFullYear(), 0, 1);
    const numberOfDays = Math.floor(
      (now.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1e3),
    );
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
                  subject: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });
    const data = JSON.parse(response.text || '{"qnaList": []}');
    res.json(data);
  } catch (error) {
    console.warn("Using fallback for important questions due to API limit.");
    const fallbackData = {
      qnaList: [
        {
          question: "Who is known as the 'Father of the Indian Constitution'?",
          answer: "Dr. B.R. Ambedkar",
          subject: "Polity",
        },
        {
          question: "What is the SI unit of electric current?",
          answer: "Ampere (A)",
          subject: "Science",
        },
        {
          question:
            "Which article of the Indian Constitution deals with the 'Right to Equality'?",
          answer: "Article 14 to Article 18",
          subject: "Polity",
        },
        {
          question: "Who was the founder of the Maurya Empire?",
          answer: "Chandragupta Maurya",
          subject: "History",
        },
        {
          question:
            "What is the largest river in the world by volume of water?",
          answer: "Amazon River",
          subject: "Geography",
        },
        {
          question:
            "If the sum of two numbers is 14 and their difference is 4, what is the product of the two numbers?",
          answer: "45 (The numbers are 9 and 5)",
          subject: "Mathematics",
        },
      ],
    };
    res.json(fallbackData);
  }
});
app.get("/api/current-affairs", async (req, res) => {
  try {
    const ai = getGeminiClient();
    const now = new Date();
    const dateString = now.toISOString().split("T")[0];
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
                  date: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });
    const data = JSON.parse(response.text || '{"news": []}');
    res.json(data);
  } catch (error) {
    console.warn("Using fallback for current affairs due to API limit.");
    const fallbackData = {
      news: [
        {
          headline:
            "India's space agency successfully launches new communication satellite",
          description:
            "ISRO has successfully placed a new advanced communication satellite into geostationary orbit, boosting the country's telecommunication infrastructure.",
          category: "Science & Technology",
          date: new Date().toISOString().split("T")[0],
        },
        {
          headline: "Government announces new economic package for MSMEs",
          description:
            "The Finance Ministry has rolled out a comprehensive stimulus package aimed at revitalizing Micro, Small, and Medium Enterprises.",
          category: "Economy",
          date: new Date().toISOString().split("T")[0],
        },
        {
          headline:
            "International summit on climate change begins in New Delhi",
          description:
            "Delegates from over 50 countries have convened to discuss actionable strategies for reducing global carbon emissions.",
          category: "Environment",
          date: new Date().toISOString().split("T")[0],
        },
        {
          headline:
            "Prominent sportsperson wins gold at international championship",
          description:
            "Bringing laurels to the nation, an Indian athlete secured the gold medal in the 100m sprint at the World Athletics Championship.",
          category: "Sports",
          date: new Date().toISOString().split("T")[0],
        },
        {
          headline: "Parliament passes new bill on data privacy",
          description:
            "A landmark bill aiming to secure user data and establish guidelines for tech companies has been passed by both houses of Parliament.",
          category: "Polity",
          date: new Date().toISOString().split("T")[0],
        },
      ],
    };
    res.json(fallbackData);
  }
});
app.get("/api/job-alerts", async (req, res) => {
  try {
    const ai = getGeminiClient();
    const now = new Date();
    const dateString = now.toISOString().split("T")[0];
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
                required: [
                  "title",
                  "organization",
                  "type",
                  "lastDateOrStatus",
                  "link",
                ],
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "Job title or alert name",
                  },
                  organization: {
                    type: Type.STRING,
                    description: "Organization name like SSC, UPSC",
                  },
                  type: {
                    type: Type.STRING,
                    description:
                      "Type of alert: 'New Job', 'Admit Card', 'Result'",
                  },
                  lastDateOrStatus: {
                    type: Type.STRING,
                    description: "Last date to apply or current status",
                  },
                  link: {
                    type: Type.STRING,
                    description:
                      "A placeholder link, e.g., 'https://ssc.nic.in'",
                  },
                },
              },
            },
          },
        },
      },
    });
    const data = JSON.parse(response.text || '{"alerts": []}');
    res.json(data);
  } catch (error) {
    console.warn("Using fallback for job alerts due to API limit.");
    const fallbackData = {
      alerts: [
        {
          title: `SSC CGL ${new Date().getFullYear()} Notification Released`,
          organization: "Staff Selection Commission (SSC)",
          type: "New Job",
          lastDateOrStatus: `Last Date: 24-07-${new Date().getFullYear()}`,
          link: "https://ssc.nic.in",
        },
        {
          title: `Railway ALP Admit Card ${new Date().getFullYear()}`,
          organization: "Railway Recruitment Board (RRB)",
          type: "Admit Card",
          lastDateOrStatus: "Available Now",
          link: "https://indianrailways.gov.in",
        },
        {
          title: "UPSC Civil Services Prelims Result",
          organization: "Union Public Service Commission (UPSC)",
          type: "Result",
          lastDateOrStatus: "Declared",
          link: "https://upsc.gov.in",
        },
      ],
    };
    res.json(fallbackData);
  }
});
app.get("/api/pyq", async (req, res) => {
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
                required: [
                  "question",
                  "options",
                  "correctAnswer",
                  "year",
                  "subject",
                ],
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING },
                  year: { type: Type.STRING },
                  subject: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });
    const data = JSON.parse(response.text || '{"questions": []}');
    res.json(data);
  } catch (error) {
    console.warn("Using fallback for PYQ due to API limit.");
    const fallbackData = {
      questions: [
        {
          question:
            "Which article of the Indian Constitution deals with the abolition of untouchability?",
          options: ["Article 14", "Article 15", "Article 16", "Article 17"],
          correctAnswer: "Article 17",
          year: "2021",
          subject: "Polity",
        },
        {
          question: "What is the chemical name of baking soda?",
          options: [
            "Sodium Carbonate",
            "Sodium Bicarbonate",
            "Calcium Carbonate",
            "Calcium Hydroxide",
          ],
          correctAnswer: "Sodium Bicarbonate",
          year: "2020",
          subject: "Science",
        },
        {
          question: "The first battle of Panipat was fought in which year?",
          options: ["1526", "1556", "1761", "1857"],
          correctAnswer: "1526",
          year: "2019",
          subject: "History",
        },
      ],
    };
    res.json(fallbackData);
  }
});
app.get("/api/chat/messages", async (req, res) => {
  const { email, role, name } = req.query;
  try {
    let messages = await getChatMessages();
    if (role !== "Admin") {
      if (!email) {
        return res
          .status(400)
          .json({ error: "Email is required for students." });
      }
      const studentEmail = (email as string).trim().toLowerCase();
      messages = messages.filter(
        (m) => m.studentEmail.toLowerCase() === studentEmail,
      );
    }
    messages.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
    if (role !== "Admin" && messages.length === 0 && name && email) {
      const studentEmail = (email as string).trim().toLowerCase();
      const welcomeMsg = {
        id: `welcome-${Date.now()}`,
        senderName: "Admin (Diptanshu)",
        senderEmail: "mazumderdiptanshu753@gmail.com",
        senderRole: "Admin",
        message: `Hello ${name}! Welcome to STUDY HUB. I am the administrator of this workspace. How can I assist you with your Mathematics study notes today?`,
        timestamp: new Date().toISOString(),
        studentEmail,
        studentName: name,
      };
      await saveChatMessage(welcomeMsg);
      return res.json([welcomeMsg]);
    }
    return res.json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/chat/messages", async (req, res) => {
  const {
    senderName,
    senderEmail,
    senderRole,
    message,
    studentEmail,
    studentName,
  } = req.body;
  if (!message || !studentEmail || !studentName) {
    return res.status(400).json({ error: "Missing required message details." });
  }
  const normStudentEmail = studentEmail.trim().toLowerCase();
  const newMsg = {
    id: `msg-${Date.now()}`,
    senderName,
    senderEmail,
    senderRole,
    message,
    timestamp: new Date().toISOString(),
    studentEmail: normStudentEmail,
    studentName,
  };
  try {
    await saveChatMessage(newMsg);
    if (senderRole === "Admin") {
      try {
        await createNotification({
          title: "সহায়তা চ্যাট থেকে নতুন বার্তা 💬",
          message: `প্রশাসক দীপ্তাংশু আপনাকে একটি বার্তা পাঠিয়েছেন: "${message}"`,
          type: "info",
          userEmail: normStudentEmail,
        });
      } catch (notifErr) {
        console.error("Failed to trigger admin chat reply notification:", notifErr);
      }
    } else {
      try {
        const allUsers = await getUsers();
        const admins = allUsers.filter(u => u.role === "Admin" || u.email.toLowerCase() === "mazumderdiptanshu753@gmail.com");
        // Remove duplicates by email
        const uniqueAdmins = Array.from(new Map(admins.map(a => [a.email.toLowerCase(), a])).values());
        
        for (const admin of uniqueAdmins) {
          await createNotification({
            title: "সহায়তা চ্যাটে নতুন বার্তা 💬",
            message: `শিক্ষার্থী ${senderName} একটি প্রশ্ন করেছেন: "${message}"`,
            type: "info",
            userEmail: admin.email,
          });
        }
      } catch (notifErr) {
        console.error("Failed to trigger admin chat notification:", notifErr);
      }
    }
    res.status(201).json(newMsg);
  } catch (error) {
    console.error("Error posting chat message:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/forum/posts", async (req, res) => {
  try {
    const postsList = await getForumPosts();
    postsList.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    res.json(postsList);
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/forum/posts", async (req, res) => {
  const post = req.body;
  if (!post.authorEmail || !post.title || !post.content)
    return res.status(400).json({ error: "Missing fields" });
  post.id = `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  post.timestamp = new Date().toISOString();
  post.likes = 0;
  post.replies = [];
  try {
    await saveForumPost(post);
    try {
      await createNotification({
        title: "ফোরামে নতুন পোস্ট করা হয়েছে 💬",
        message: `"${post.authorName || 'একজন শিক্ষার্থী'}" একটি নতুন পোস্ট করেছেন: "${post.title}"। আলোচনায় অংশ নিন!`,
        type: "info",
      });
    } catch (notifErr) {
      console.error("Failed to trigger forum post notification:", notifErr);
    }
    res.status(201).json(post);
  } catch (error) {
    console.error("Error saving forum post:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/forum/posts/:postId/replies", async (req, res) => {
  const { postId } = req.params;
  const reply = req.body;
  if (!reply.authorEmail || !reply.content)
    return res.status(400).json({ error: "Missing fields" });
  reply.id = `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  reply.timestamp = new Date().toISOString();
  try {
    const success = await addForumReply(postId, reply);
    if (success) {
      try {
        const posts = await getForumPosts();
        const originalPost = posts.find((p: any) => p.id === postId);
        if (originalPost && originalPost.authorEmail && originalPost.authorEmail.trim().toLowerCase() !== reply.authorEmail.trim().toLowerCase()) {
          await createNotification({
            title: "আপনার পোস্টে নতুন উত্তর এসেছে 💬",
            message: `"${reply.authorName || 'একজন শিক্ষার্থী'}" আপনার "${originalPost.title}" পোস্টে একটি মন্তব্য করেছেন।`,
            type: "info",
            userEmail: originalPost.authorEmail,
          });
        }
      } catch (notifErr) {
        console.error("Failed to trigger forum reply notification:", notifErr);
      }
      res.status(201).json(reply);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    console.error("Error saving forum reply:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/live-classes", async (req, res) => {
  try {
    const classesList = await getLiveClasses();
    classesList.sort(
      (a, b) =>
        new Date(a.scheduledTime).getTime() -
        new Date(b.scheduledTime).getTime(),
    );
    res.json(classesList);
  } catch (error) {
    console.error("Error fetching live classes:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/live-classes", async (req, res) => {
  const cls = req.body;
  if (!cls.title || !cls.link || !cls.scheduledTime)
    return res.status(400).json({ error: "Missing fields" });
  cls.id = `class-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  cls.createdAt = new Date().toISOString();
  cls.status = cls.status || "Scheduled";
  try {
    await saveLiveClass(cls);
    try {
      await createNotification({
        title: "নতুন লাইভ ক্লাস শিডিউল করা হয়েছে 🎥",
        message: `একটি নতুন লাইভ ক্লাস শুরু হতে যাচ্ছে: "${cls.title}"। প্রস্তুতি নিন!`,
        type: "video"
      });
    } catch (notifErr) {
      console.error("Failed to trigger live class created notification:", notifErr);
    }
    res.status(201).json(cls);
  } catch (error) {
    console.error("Error saving live class:", error);
    res.status(500).json({ error: error.message });
  }
});
app.patch("/api/live-classes/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updated = await updateLiveClassStatus(id, status);
    if (updated) {
      try {
        if (status === "Live") {
          await createNotification({
            title: "লাইভ ক্লাস এখন চলমান! 🔴",
            message: `লাইভ ক্লাসটি শুরু হয়েছে: "${updated.title}"। এখনই যুক্ত হন!`,
            type: "video"
          });
        } else if (status === "Cancelled") {
          await createNotification({
            title: "লাইভ ক্লাস বাতিল করা হয়েছে ⚠️",
            message: `লাইভ ক্লাসটি বাতিল করা হয়েছে: "${updated.title}"`,
            type: "info"
          });
        }
      } catch (notifErr) {
        console.error("Failed to trigger live class status notification:", notifErr);
      }
      res.json(updated);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (error) {
    console.error("Error updating live class:", error);
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/live-classes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteLiveClass(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting live class:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/users", async (req, res) => {
  try {
    const usersList = await getUsers();
    res.json(usersList);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/users", async (req, res) => {
  const user = req.body;
  if (!user.email) return res.status(400).json({ error: "Email is required" });
  const normEmail = user.email.trim().toLowerCase();
  try {
    const existingUser = await getUserByEmail(normEmail);
    await saveUser(user);
    if (!existingUser) {
      try {
        await createNotification({
          title: "স্টাডি হাবে স্বাগতম! 🎉",
          message: `প্রিয় ${user.name || 'শিক্ষার্থী'}, স্টাডি হাব পোর্টালে আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। আপনার পড়াশোনা সহজ করতে আমরা আছি আপনার পাশে!`,
          type: "info",
          userEmail: normEmail,
        });
      } catch (notifErr) {
        console.error("Failed to trigger welcome notification:", notifErr);
      }
    }
    const usersList = await getUsers();
    res.json(usersList);
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/users", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });
  try {
    await deleteUser(email);
    const usersList = await getUsers();
    res.json(usersList);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/activity-logs", async (req, res) => {
  try {
    const logsList = await getActivityLogs();
    logsList.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    res.json(logsList);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/activity-logs", async (req, res) => {
  const log = req.body;
  if (!log.userEmail || !log.action)
    return res.status(400).json({ error: "Missing required fields" });
  log.id = `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  if (!log.timestamp) log.timestamp = new Date().toISOString();
  try {
    await saveActivityLog(log);
    res.status(201).json(log);
  } catch (error) {
    console.error("Error saving activity log:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/study-notes", async (req, res) => {
  const { email } = req.query;
  if (!email)
    return res.status(400).json({ error: "Email query param is required" });
  try {
    const notes = await getStudyNotes(email as string);
    res.json(notes);
  } catch (error) {
    console.error("Error fetching study notes:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/study-notes", async (req, res) => {
  const note = req.body;
  if (!note.id || !note.title || !note.userEmail) {
    return res
      .status(400)
      .json({ error: "Missing required fields (id, title, userEmail)" });
  }
  try {
    const saved = await saveStudyNote(note);
    await createNotification({
      title:
        "\u09A8\u09A4\u09C1\u09A8 \u09B8\u09CD\u099F\u09BE\u09A1\u09BF \u09A8\u09CB\u099F \u09A4\u09C8\u09B0\u09BF \u09B9\u09DF\u09C7\u099B\u09C7",
      message: `\u0986\u09AA\u09A8\u09BF "${note.title}" \u09A8\u09BE\u09AE\u09C7 \u098F\u0995\u099F\u09BF \u09A8\u09A4\u09C1\u09A8 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u09B8\u09CD\u099F\u09BE\u09A1\u09BF \u09A8\u09CB\u099F \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09C7\u099B\u09C7\u09A8\u0964`,
      type: "note",
      userEmail: note.userEmail,
    });
    res.json(saved);
  } catch (error) {
    console.error("Error saving study note:", error);
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/study-notes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const success = await deleteStudyNote(id);
    res.json({ success });
  } catch (error) {
    console.error("Error deleting study note:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/recover-firestore", async (req, res) => {
  const {
    users,
    studyNotes,
    chatMessages,
    forumPosts,
    liveClasses,
    activityLogs,
    govtJobNotes,
    aiPdfNotes,
  } = req.body;
  console.log("Processing bulk firestore recovery payload...");
  const results = {
    users: 0,
    studyNotes: 0,
    chatMessages: 0,
    forumPosts: 0,
    liveClasses: 0,
    activityLogs: 0,
    govtJobNotes: 0,
    aiPdfNotes: 0,
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
          const logItem = {
            ...item,
            id:
              item.id ||
              `log-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          };
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
  } catch (error) {
    console.error("Error performing firestore recovery:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/govt-job-notes", async (req, res) => {
  try {
    const { subject } = req.query;
    let notes = await getGovtJobNotes(subject as string);
    notes.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    res.json(notes);
  } catch (error) {
    console.error("Error fetching govt job notes:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/govt-job-notes", async (req, res) => {
  const note = req.body;
  if (!note.title || !note.content || !note.subject)
    return res.status(400).json({ error: "Missing fields" });
  note.id = `gjn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  note.timestamp = new Date().toISOString();
  note.comments = [];
  try {
    await saveGovtJobNote(note);
    await createNotification({
      title:
        "\u09A8\u09A4\u09C1\u09A8 \u09B8\u09B0\u0995\u09BE\u09B0\u09BF \u099A\u09BE\u0995\u09B0\u09BF\u09B0 \u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09C1\u09A4\u09BF \u09A8\u09CB\u099F \u09AA\u09CD\u09B0\u0995\u09BE\u09B6\u09BF\u09A4 \u09B9\u09DF\u09C7\u099B\u09C7",
      message: `\u098F\u0995\u099F\u09BF \u09A8\u09A4\u09C1\u09A8 \u09B8\u09B0\u0995\u09BE\u09B0\u09BF \u099A\u09BE\u0995\u09B0\u09BF\u09B0 \u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09C1\u09A4\u09BF\u09B0 \u09A8\u09CB\u099F \u09AA\u09CD\u09B0\u0995\u09BE\u09B6\u09BF\u09A4 \u09B9\u09DF\u09C7\u099B\u09C7: "${note.title}"`,
      type: "note",
    });
    res.status(201).json(note);
  } catch (error) {
    console.error("Error saving govt job note:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/govt-job-notes/:id/comments", async (req, res) => {
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
      try {
        const notes = await getGovtJobNotes();
        const originalNote = notes.find((n: any) => n.id === id);
        if (originalNote && originalNote.authorEmail && originalNote.authorEmail.trim().toLowerCase() !== comment.authorEmail.trim().toLowerCase()) {
          await createNotification({
            title: "আপনার জবসাইট নোটে নতুন মন্তব্য 💬",
            message: `"${comment.authorName}" আপনার "${originalNote.title}" নোটে মন্তব্য করেছেন।`,
            type: "info",
            userEmail: originalNote.authorEmail,
          });
        }
      } catch (notifErr) {
        console.error("Failed to trigger govt job note comment notification:", notifErr);
      }
      res.status(201).json(comment);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    console.error("Error adding comment to govt job note:", error);
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/govt-job-notes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteGovtJobNote(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting govt job note:", error);
    res.status(500).json({ error: error.message });
  }
});
function getNextMonthName(existingNotes) {
  if (existingNotes.length === 0) {
    return "July 2026";
  }
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let latestYear = 2026;
  let latestMonthIndex = 6;
  for (const note of existingNotes) {
    if (note.month) {
      const parts = note.month.split(" ");
      if (parts.length === 2) {
        const mIndex = months.indexOf(parts[0]);
        const year = parseInt(parts[1], 10);
        if (mIndex !== -1 && !isNaN(year)) {
          if (
            year > latestYear ||
            (year === latestYear && mIndex > latestMonthIndex)
          ) {
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
__name(getNextMonthName, "getNextMonthName");
app.get("/api/ai-pdf-notes", async (req, res) => {
  try {
    const { subject } = req.query;
    let notesList = await getAiPdfNotes(subject as string);
    notesList.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    res.json(notesList);
  } catch (error) {
    console.error("Error fetching AI PDF notes:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/ai-pdf-notes/generate", async (req, res) => {
  try {
    const { subject } = req.body;
    if (!subject) {
      return res.status(400).json({ error: "Subject is required." });
    }
    const existingNotes = await getAiPdfNotes(subject);
    const nextMonth = getNextMonthName(existingNotes);
    const subjectNameMap = {
      math: "Mathematics & Quantitative Aptitude (Shortcuts, Formulas, and MCQs)",
      reasoning: "Reasoning & Mental Ability",
      english: "English Grammar & Comprehension",
      science: "General Science (Physics, Chemistry, Biology)",
      history: "History (Indian Subcontinent History, BCS & WB specific)",
      geography: "Geography, Environment & Disaster Management",
      polity: "Constitution & Government Policy (Polity)",
      economics: "Economics & Development Planning",
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
            keyTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
            theoryContent: { type: Type.STRING },
            mcqs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: [
                  "question",
                  "options",
                  "correctAnswer",
                  "explanation",
                ],
              },
            },
          },
          required: [
            "title",
            "introduction",
            "keyTopics",
            "theoryContent",
            "mcqs",
          ],
        },
      },
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
      timestamp: new Date().toISOString(),
    };
    await saveAiPdfNote(newPdfNote);
    await createNotification({
      title:
        "\u09A8\u09A4\u09C1\u09A8 \u098F\u0986\u0987 \u09AA\u09BF\u09A1\u09BF\u098F\u09AB \u09B8\u09CD\u099F\u09BE\u09A1\u09BF \u0997\u09BE\u0987\u09A1 \u09A4\u09C8\u09B0\u09BF \u09B9\u09DF\u09C7\u099B\u09C7",
      message: `\u098F\u0986\u0987 \u09B8\u09B9\u0995\u09BE\u09B0\u09C0 \u09A6\u09CD\u09AC\u09BE\u09B0\u09BE \u098F\u0995\u099F\u09BF \u09A8\u09A4\u09C1\u09A8 \u09AE\u09BE\u09B8\u09BF\u0995 \u0997\u09BE\u0987\u09A1 \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09BE \u09B9\u09DF\u09C7\u099B\u09C7: "${newPdfNote.title}"`,
      type: "note",
    });
    res.status(201).json(newPdfNote);
  } catch (error) {
    console.error("Error generating AI PDF note:", error);
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/ai-pdf-notes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteAiPdfNote(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting AI PDF note:", error);
    res.status(500).json({ error: error.message });
  }
});
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
        title:
          "July 2026 - Quantitative Aptitude: Magic Shortcut Tricks for Percentage & Ratio",
        introduction:
          "\u098F\u0987 \u0997\u09BE\u0987\u09A1\u099F\u09BF\u09A4\u09C7 \u09B6\u09A4\u0995\u09B0\u09BE \u0993 \u0985\u09A8\u09C1\u09AA\u09BE\u09A4\u09C7\u09B0 \u099C\u099F\u09BF\u09B2 \u0985\u0982\u0995\u0997\u09C1\u09B2\u09CB \u09AE\u09BE\u09A4\u09CD\u09B0 \u09EB-\u09E7\u09E6 \u09B8\u09C7\u0995\u09C7\u09A8\u09CD\u09A1\u09C7 \u09B8\u09AE\u09BE\u09A7\u09BE\u09A8 \u0995\u09B0\u09BE\u09B0 \u09B6\u09B0\u09CD\u099F\u0995\u09BE\u099F \u099F\u09C7\u0995\u09A8\u09BF\u0995 \u0993 \u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u0986\u09B2\u09CB\u099A\u09A8\u09BE \u0995\u09B0\u09BE \u09B9\u09DF\u09C7\u099B\u09C7\u0964",
        keyTopics: ["Percentage Rules", "Ratio & Proportion", "BCS Prep Hacks"],
        theoryContent:
          "### \u09E7. \u09B6\u09A4\u0995\u09B0\u09BE \u09A8\u09BF\u09B0\u09CD\u09A8\u09DF\u09C7\u09B0 \u09AE\u09CD\u09AF\u09BE\u099C\u09BF\u0995 \u099F\u09CD\u09B0\u09BF\u0995 (Percentage Shortcuts):\n\u09B6\u09A4\u0995\u09B0\u09BE \u0985\u0982\u0995\u0997\u09C1\u09B2\u09CB \u09B8\u09B9\u099C\u09C7 \u0995\u09B0\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09AD\u0997\u09CD\u09A8\u09BE\u0982\u09B6\u09C7 \u09B0\u09C2\u09AA\u09BE\u09A8\u09CD\u09A4\u09B0 \u0995\u09B0\u09BE \u09B6\u09BF\u0996\u09A4\u09C7 \u09B9\u09AC\u09C7\u0964\n* \u09E8\u09E6% = \u09E7/\u09EB\n* \u09E8\u09EB% = \u09E7/\u09EA\n* \u09EB\u09E6% = \u09E7/\u09E8\n\n**\u0989\u09A6\u09BE\u09B9\u09B0\u09A3 \u09E7:** \u099A\u09BE\u09B2\u09C7\u09B0 \u09AE\u09C2\u09B2\u09CD\u09AF \u09E8\u09E6% \u09AC\u09C3\u09A6\u09CD\u09A7\u09BF \u09AA\u09C7\u09B2\u09C7 \u099A\u09BE\u09B2\u09C7\u09B0 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u09B6\u09A4\u0995\u09B0\u09BE \u0995\u09A4 \u0995\u09AE\u09BE\u09B2\u09C7 \u0996\u09B0\u099A\u09C7\u09B0 \u0995\u09CB\u09A8\u09CB \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8 \u09B9\u09AC\u09C7 \u09A8\u09BE?\n* **\u09B6\u09B0\u09CD\u099F\u0995\u09BE\u099F \u09B8\u09C2\u09A4\u09CD\u09B0:** (R / (100 + R)) * 100\n* \u09B8\u09AE\u09BE\u09A7\u09BE\u09A8: (\u09E8\u09E6 / \u09E7\u09E8\u09E6) * \u09E7\u09E6\u09E6 = \u09E7\u09EC.\u09EC\u09ED%\n\n### \u09E8. \u0985\u09A8\u09C1\u09AA\u09BE\u09A4 \u0993 \u0985\u0982\u09B6\u09C0\u09A6\u09BE\u09B0\u09BF\u09A4\u09CD\u09AC (Ratio & Proportion Hacks):\n\u09AF\u09A6\u09BF A:B = 2:3 \u098F\u09AC\u0982 B:C = 4:5 \u09B9\u09DF, \u09A4\u09AC\u09C7 A:B:C = ?\n* **\u09B6\u09B0\u09CD\u099F\u0995\u09BE\u099F '\u09A6' \u09AA\u09A6\u09CD\u09A7\u09A4\u09BF:**\n  * A = 2 * 4 = 8\n  * B = 3 * 4 = 12\n  * C = 3 * 5 = 15\n  * \u0989\u09A4\u09CD\u09A4\u09B0: 8:12:15",
        mcqs: [
          {
            question:
              "\u099A\u09BE\u09B2\u09C7\u09B0 \u09AE\u09C2\u09B2\u09CD\u09AF \u09E8\u09EB% \u09AC\u09C3\u09A6\u09CD\u09A7\u09BF \u09AA\u09C7\u09B2\u09C7 \u099A\u09BE\u09B2\u09C7\u09B0 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u09B6\u09A4\u0995\u09B0\u09BE \u0995\u09A4 \u0995\u09AE\u09BE\u09B2\u09C7 \u0996\u09B0\u099A \u0985\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09A5\u09BE\u0995\u09AC\u09C7?",
            options: [
              "\u09E8\u09E6%",
              "\u09E8\u09EB%",
              "\u09E7\u09EC.\u09EC\u09ED%",
              "\u09E7\u09EB%",
            ],
            correctAnswer: "\u09E8\u09E6%",
            explanation:
              "\u09B8\u09C2\u09A4\u09CD\u09B0: (R / (100+R)) * 100 => (25/125)*100 = 20%.",
          },
          {
            question:
              "\u09AF\u09A6\u09BF A:B = 3:4 \u098F\u09AC\u0982 B:C = 5:6 \u09B9\u09DF, \u09A4\u09AC\u09C7 A:B:C \u0995\u09A4?",
            options: ["15:20:24", "15:24:20", "3:5:6", "9:12:16"],
            correctAnswer: "15:20:24",
            explanation:
              "A = 3*5 = 15, B = 4*5 = 20, C = 4*6 = 24. \u09B8\u09C1\u09A4\u09B0\u09BE\u0982 \u0985\u09A8\u09C1\u09AA\u09BE\u09A4\u099F\u09BF \u09E7\u09EB:\u09E8\u09E6:\u09E8\u09EA\u0964",
          },
        ],
        month: "July 2026",
        timestamp: new Date().toISOString(),
      },
      {
        id: "pdfn-seed-reasoning",
        subject: "reasoning",
        title:
          "July 2026 - Mental Ability: Master Coding-Decoding & Direction Sense",
        introduction:
          "\u098F\u0987 \u0997\u09BE\u0987\u09A1\u099F\u09BF\u09A4\u09C7 \u09B0\u09BF\u099C\u09A8\u09BF\u0982 \u09AC\u09BE \u09AE\u09BE\u09A8\u09B8\u09BF\u0995 \u09A6\u0995\u09CD\u09B7\u09A4\u09BE\u09B0 \u09B8\u09AC\u099A\u09C7\u09DF\u09C7 \u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC\u09AA\u09C2\u09B0\u09CD\u09A3 \u099F\u09AA\u09BF\u0995 \u0995\u09CB\u09A1\u09BF\u0982-\u09A1\u09BF\u0995\u09CB\u09A1\u09BF\u0982 \u098F\u09AC\u0982 \u09A6\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09A3\u09DF \u09B8\u0982\u0995\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4 \u09B6\u09B0\u09CD\u099F\u0995\u09BE\u099F \u099F\u09CD\u09B0\u09BF\u0995\u09CD\u09B8 \u09A6\u09C7\u0993\u09DF\u09BE \u09B9\u09B2\u09CB\u0964",
        keyTopics: [
          "Alphabet Series Codes",
          "Direction & Distances",
          "Visual Analogy",
        ],
        theoryContent:
          "### \u09E7. \u0995\u09CB\u09A1\u09BF\u0982-\u09A1\u09BF\u0995\u09CB\u09A1\u09BF\u0982 \u09B8\u09B9\u099C \u0995\u09B0\u09BE\u09B0 \u09A8\u09BF\u09DF\u09AE:\n\u0987\u0982\u09B0\u09C7\u099C\u09BF \u09AC\u09B0\u09CD\u09A3\u09AE\u09BE\u09B2\u09BE\u09B0 \u0985\u09AC\u09B8\u09CD\u09A5\u09BE\u09A8 \u09B8\u09B9\u099C\u09C7 \u09AE\u09A8\u09C7 \u09B0\u09BE\u0996\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF **EJOTY** \u09B8\u09C2\u09A4\u09CD\u09B0 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8:\n* E = 5, J = 10, O = 15, T = 20, Y = 25\n\n**\u0989\u09A6\u09BE\u09B9\u09B0\u09A3:** \u09AF\u09A6\u09BF CAT \u0995\u09C7 \u09E8\u09EB \u09B2\u09C7\u0996\u09BE \u09B9\u09DF, \u09A4\u09AC\u09C7 DOG \u0995\u09C7 \u0995\u09A4 \u09B2\u09C7\u0996\u09BE \u09B9\u09AC\u09C7?\n* CAT = C(3) + A(1) + T(20) + 1 = 25\n* DOG = D(4) + O(15) + G(7) + 1 = 27\n\n### \u09E8. \u09A6\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09A3\u09DF (Direction Sense):\n\u09B8\u09AC \u09B8\u09AE\u09DF \u09A8\u09BF\u099C\u09C7\u09B0 \u09A1\u09BE\u09A8\u09A6\u09BF\u0995\u0995\u09C7 \u09AA\u09C2\u09B0\u09CD\u09AC (East), \u09AC\u09BE\u09AE\u09A6\u09BF\u0995\u0995\u09C7 \u09AA\u09B6\u09CD\u099A\u09BF\u09AE (West), \u09B8\u09BE\u09AE\u09A8\u09C7\u09B0 \u09A6\u09BF\u0995\u0995\u09C7 \u0989\u09A4\u09CD\u09A4\u09B0 (North), \u098F\u09AC\u0982 \u09AA\u09BF\u099B\u09A8\u09C7\u09B0 \u09A6\u09BF\u0995\u0995\u09C7 \u09A6\u0995\u09CD\u09B7\u09BF\u09A3 (South) \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 \u09A7\u09B0\u09C7 \u09A8\u09BF\u09A8\u0964 \u09AA\u09BF\u09A5\u09BE\u0997\u09CB\u09B0\u09BE\u09B8\u09C7\u09B0 \u0989\u09AA\u09AA\u09BE\u09A6\u09CD\u09AF ( can be applied: \u0985\u09A4\u09BF\u09AD\u09C1\u099C\xB2 = \u09B2\u09AE\u09CD\u09AC\xB2 + \u09AD\u09C2\u09AE\u09BF\xB2) \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7 \u09A6\u09C2\u09B0\u09A4\u09CD\u09AC \u09AC\u09C7\u09B0 \u0995\u09B0\u09C1\u09A8\u0964",
        mcqs: [
          {
            question:
              "\u098F\u0995 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF \u0989\u09A4\u09CD\u09A4\u09B0 \u09A6\u09BF\u0995\u09C7 \u09EA \u0995\u09BF\u09AE\u09BF \u09B9\u09BE\u0981\u099F\u09BE\u09B0 \u09AA\u09B0 \u09A1\u09BE\u09A8\u09A6\u09BF\u0995\u09C7 \u0998\u09C1\u09B0\u09C7 \u09E9 \u0995\u09BF\u09AE\u09BF \u09B9\u09BE\u0981\u099F\u09B2\u09CB\u0964 \u09B8\u09C7 \u09B6\u09C1\u09B0\u09C1\u09B0 \u09B8\u09CD\u09A5\u09BE\u09A8 \u09A5\u09C7\u0995\u09C7 \u098F\u0996\u09A8 \u0995\u09A4 \u09A6\u09C2\u09B0\u09C7 \u0986\u099B\u09C7?",
            options: [
              "\u09EB \u0995\u09BF\u09AE\u09BF",
              "\u09ED \u0995\u09BF\u09AE\u09BF",
              "\u09E7 \u0995\u09BF\u09AE\u09BF",
              "\u09E7\u09E8 \u0995\u09BF\u09AE\u09BF",
            ],
            correctAnswer: "\u09EB \u0995\u09BF\u09AE\u09BF",
            explanation:
              "\u09AA\u09BF\u09A5\u09BE\u0997\u09CB\u09B0\u09BE\u09B8\u09C7\u09B0 \u0989\u09AA\u09AA\u09BE\u09A6\u09CD\u09AF \u0985\u09A8\u09C1\u09B8\u09BE\u09B0\u09C7, \u09A6\u09C2\u09B0\u09A4\u09CD\u09AC = \u221A(\u09EA\xB2 + \u09E9\xB2) = \u221A(\u09E7\u09EC + \u09EF) = \u221A\u09E8\u09EB = \u09EB \u0995\u09BF\u09AE\u09BF\u0964",
          },
        ],
        month: "July 2026",
        timestamp: new Date().toISOString(),
      },
      {
        id: "pdfn-seed-english",
        subject: "english",
        title:
          "July 2026 - English Grammar: Subject-Verb Agreement Rules & Common Errors",
        introduction:
          "\u099A\u09BE\u0995\u09B0\u09BF\u09B0 \u09AA\u09B0\u09C0\u0995\u09CD\u09B7\u09BE\u09DF \u0987\u0982\u09B0\u09C7\u099C\u09BF\u09A4\u09C7 \u09B8\u09AC\u099A\u09C7\u09DF\u09C7 \u09AC\u09C7\u09B6\u09BF \u0986\u09B8\u09BE Subject-Verb Agreement \u098F\u09B0 \u099C\u099F\u09BF\u09B2 \u09A8\u09BF\u09DF\u09AE\u0997\u09C1\u09B2\u09CB \u09AC\u09BE\u0982\u09B2\u09BE\u09DF \u09B8\u09B9\u099C \u09AC\u09CD\u09AF\u09BE\u0996\u09CD\u09AF\u09BE\u09B8\u09B9 \u09B6\u09BF\u0996\u09C1\u09A8\u0964",
        keyTopics: [
          "Collective Noun Rules",
          "Either/Or, Neither/Nor Cases",
          "Prepositional Phrases",
        ],
        theoryContent:
          "### Rule 1: Collective Nouns\nCollective Noun \u09B8\u09BE\u09A7\u09BE\u09B0\u09A3\u09A4 singular verb \u0997\u09CD\u09B0\u09B9\u09A3 \u0995\u09B0\u09C7\u0964 \u0995\u09BF\u09A8\u09CD\u09A4\u09C1 \u09A4\u09BE\u09B0\u09BE \u09AF\u09A6\u09BF \u09AC\u09BF\u09AD\u0995\u09CD\u09A4 \u09AE\u09A4\u09AC\u09BE\u09A6 \u09AA\u09CD\u09B0\u0995\u09BE\u09B6 \u0995\u09B0\u09C7, \u09A4\u09AC\u09C7 plural verb \u09B9\u09DF\u0964\n* *Example:* The jury **is** unanimous in its decision. (Singular)\n* *Example:* The jury **are** divided in their opinions. (Plural)\n\n### Rule 2: Either/Or & Neither/Nor\nEither... or \u09AC\u09BE Neither... nor \u09A6\u09CD\u09AC\u09BE\u09B0\u09BE \u09A6\u09C1\u099F\u09BF Subject \u09AF\u09C1\u0995\u09CD\u09A4 \u09A5\u09BE\u0995\u09B2\u09C7, verb \u09B8\u09B0\u09CD\u09AC\u09A6\u09BE \u09A6\u09CD\u09AC\u09BF\u09A4\u09C0\u09DF/\u09A8\u09BF\u0995\u099F\u09AC\u09B0\u09CD\u09A4\u09C0 Subject \u0985\u09A8\u09C1\u09DF\u09BE\u09DF\u09C0 \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09B9\u09DF\u0964\n* *Example:* Neither the teacher nor the **students** **are** present. (students plural, \u09A4\u09BE\u0987 are \u09B9\u09AF\u09BC\u09C7\u099B\u09C7)\n* *Example:* Either the students or the **teacher** **is** present. (teacher singular, \u09A4\u09BE\u0987 is \u09B9\u09AF\u09BC\u09C7\u099B\u09C7)",
        mcqs: [
          {
            question: "Identify the correct sentence:",
            options: [
              "Many a boy has done his homework.",
              "Many a boy have done their homework.",
              "Many a boys have done his homework.",
              "Many boys has done their homework.",
            ],
            correctAnswer: "Many a boy has done his homework.",
            explanation:
              "'Many a' \u098F\u09B0 \u09AA\u09B0 singular noun \u098F\u09AC\u0982 singular verb \u09AC\u09B8\u09C7\u0964 \u09A4\u09BE\u0987 'Many a boy has' \u09B8\u09A0\u09BF\u0995\u0964",
          },
        ],
        month: "July 2026",
        timestamp: new Date().toISOString(),
      },
      {
        id: "pdfn-seed-science",
        subject: "science",
        title:
          "July 2026 - General Science: Physics Laws & Human Physiology Basics",
        introduction:
          "\u09AA\u09A6\u09BE\u09B0\u09CD\u09A5\u09AC\u09BF\u099C\u09CD\u099E\u09BE\u09A8\u09C7\u09B0 \u09AA\u09CD\u09B0\u09A7\u09BE\u09A8 \u09B8\u09C2\u09A4\u09CD\u09B0\u09BE\u09AC\u09B2\u09C0 \u098F\u09AC\u0982 \u099C\u09C0\u09AC\u09AC\u09BF\u099C\u09CD\u099E\u09BE\u09A8\u09C7\u09B0 \u09AE\u09BE\u09A8\u09AC\u09A6\u09C7\u09B9 \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995\u09BF\u09A4 \u0985\u09A4\u09BF \u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u0993 \u0989\u09A4\u09CD\u09A4\u09B0\u0964",
        keyTopics: [
          "Newton's Laws of Motion",
          "Human Blood & Circulation",
          "Optical Instruments",
        ],
        theoryContent:
          "### \u09E7. \u09A8\u09BF\u0989\u099F\u09A8\u09C7\u09B0 \u0997\u09A4\u09BF\u09B8\u09C2\u09A4\u09CD\u09B0 (Newton's Laws of Motion):\n* **\u09AA\u09CD\u09B0\u09A5\u09AE \u09B8\u09C2\u09A4\u09CD\u09B0:** \u09AC\u09BE\u09B9\u09CD\u09AF\u09BF\u0995 \u09AC\u09B2 \u09AA\u09CD\u09B0\u09DF\u09CB\u0997 \u09A8\u09BE \u0995\u09B0\u09B2\u09C7 \u09B8\u09CD\u09A5\u09BF\u09B0 \u09AC\u09B8\u09CD\u09A4\u09C1 \u099A\u09BF\u09B0\u0995\u09BE\u09B2 \u09B8\u09CD\u09A5\u09BF\u09B0 \u098F\u09AC\u0982 \u0997\u09A4\u09BF\u09B6\u09C0\u09B2 \u09AC\u09B8\u09CD\u09A4\u09C1 \u099A\u09BF\u09B0\u0995\u09BE\u09B2 \u09B8\u09C1\u09B7\u09AE \u0997\u09A4\u09BF\u09A4\u09C7 \u099A\u09B2\u09A4\u09C7 \u09A5\u09BE\u0995\u09AC\u09C7 (\u099C\u09DC\u09A4\u09BE\u09B0 \u09A7\u09BE\u09B0\u09A3\u09BE)\u0964\n* **\u09A6\u09CD\u09AC\u09BF\u09A4\u09C0\u09DF \u09B8\u09C2\u09A4\u09CD\u09B0:** \u09AC\u09B8\u09CD\u09A4\u09C1\u09B0 \u09AD\u09B0\u09AC\u09C7\u0997\u09C7\u09B0 \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8\u09C7\u09B0 \u09B9\u09BE\u09B0 \u09A4\u09BE\u09B0 \u0989\u09AA\u09B0 \u09AA\u09CD\u09B0\u09AF\u09C1\u0995\u09CD\u09A4 \u09AC\u09B2\u09C7\u09B0 \u09B8\u09AE\u09BE\u09A8\u09C1\u09AA\u09BE\u09A4\u09BF\u0995 (F = ma)\u0964\n* **\u09A4\u09C3\u09A4\u09C0\u09DF \u09B8\u09C2\u09A4\u09CD\u09B0:** \u09AA\u09CD\u09B0\u09A4\u09CD\u09AF\u09C7\u0995 \u0995\u09CD\u09B0\u09BF\u09DF\u09BE\u09B0\u0987 \u098F\u0995\u099F\u09BF \u09B8\u09AE\u09BE\u09A8 \u0993 \u09AC\u09BF\u09AA\u09B0\u09C0\u09A4 \u09AA\u09CD\u09B0\u09A4\u09BF\u0995\u09CD\u09B0\u09BF\u09DF\u09BE \u0986\u099B\u09C7\u0964\n\n### \u09E8. \u09AE\u09BE\u09A8\u09AC \u09B0\u0995\u09CD\u09A4 \u09B8\u0982\u09AC\u09B9\u09A8 (Human Blood Group):\n* **\u09B8\u09B0\u09CD\u09AC\u099C\u09A8\u09C0\u09A8 \u09A6\u09BE\u09A4\u09BE (Universal Donor):** O Negative (O-)\n* **\u09B8\u09B0\u09CD\u09AC\u099C\u09A8\u09C0\u09A8 \u0997\u09CD\u09B0\u09B9\u09C0\u09A4\u09BE (Universal Recipient):** AB Positive (AB+)",
        mcqs: [
          {
            question:
              "\u0995\u09CB\u09A8 \u09B0\u0995\u09CD\u09A4 \u0997\u09CD\u09B0\u09C1\u09AA\u0995\u09C7 \u09B8\u09B0\u09CD\u09AC\u099C\u09A8\u09C0\u09A8 \u09A6\u09BE\u09A4\u09BE \u09AC\u09B2\u09BE \u09B9\u09DF?",
            options: ["O-", "O+", "AB+", "A-"],
            correctAnswer: "O-",
            explanation:
              "O Negative \u09B0\u0995\u09CD\u09A4\u09C7\u09B0 \u0997\u09CD\u09B0\u09C1\u09AA\u09C7 \u0995\u09CB\u09A8\u09CB \u0985\u09CD\u09AF\u09BE\u09A8\u09CD\u099F\u09BF\u099C\u09C7\u09A8 \u09A5\u09BE\u0995\u09C7 \u09A8\u09BE, \u09A4\u09BE\u0987 \u098F\u099F\u09BF \u09AF\u09C7\u0995\u09CB\u09A8\u09CB \u09B0\u09CB\u0997\u09C0\u0995\u09C7 \u09A6\u09C7\u0993\u09DF\u09BE \u09AF\u09BE\u09DF\u0964",
          },
        ],
        month: "July 2026",
        timestamp: new Date().toISOString(),
      },
      {
        id: "pdfn-seed-history",
        subject: "history",
        title:
          "July 2026 - History: Ancient Bengal & Indian Freedom Movement Guide",
        introduction:
          "\u09AA\u09CD\u09B0\u09BE\u099A\u09C0\u09A8 \u09AC\u09BE\u0982\u09B2\u09BE\u09B0 \u09B6\u09BE\u09B8\u09A8 \u09AC\u09CD\u09AF\u09AC\u09B8\u09CD\u09A5\u09BE \u098F\u09AC\u0982 \u09B8\u09BF\u09AA\u09BE\u09B9\u09C0 \u09AC\u09BF\u09A6\u09CD\u09B0\u09CB\u09B9 \u09A5\u09C7\u0995\u09C7 \u09B6\u09C1\u09B0\u09C1 \u0995\u09B0\u09C7 \u09E7\u09EF\u09EA\u09ED \u09B8\u09BE\u09B2 \u09AA\u09B0\u09CD\u09AF\u09A8\u09CD\u09A4 \u09B8\u09CD\u09AC\u09BE\u09A7\u09C0\u09A8\u09A4\u09BE \u09B8\u0982\u0997\u09CD\u09B0\u09BE\u09AE\u09C7\u09B0 \u09B8\u09BE\u09B2\u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u09B8\u09BE\u09B0\u09B8\u0982\u0995\u09CD\u09B7\u09C7\u09AA\u0964",
        keyTopics: [
          "Mauryan & Gupta Rule",
          "Mughal Bengal",
          "Indian Independence Movement",
        ],
        theoryContent:
          "### \u09E7. \u09AA\u09CD\u09B0\u09BE\u099A\u09C0\u09A8 \u09AC\u09BE\u0982\u09B2\u09BE\u09B0 \u0987\u09A4\u09BF\u09B9\u09BE\u09B8:\n* \u09AA\u09CD\u09B0\u09A5\u09AE \u09B8\u09CD\u09AC\u09BE\u09A7\u09C0\u09A8 \u09A8\u09B0\u09AA\u09A4\u09BF \u09AC\u09BE \u09B0\u09BE\u099C\u09BE \u099B\u09BF\u09B2\u09C7\u09A8 **\u09B6\u09B6\u09BE\u0999\u09CD\u0995** (\u09AF\u09BE\u09B0 \u09B0\u09BE\u099C\u09A7\u09BE\u09A8\u09C0 \u099B\u09BF\u09B2 \u0995\u09B0\u09CD\u09A3\u09B8\u09C1\u09AC\u09B0\u09CD\u09A3)\u0964\n* \u09AA\u09BE\u09B2 \u09AC\u0982\u09B6\u09C7\u09B0 \u09AA\u09CD\u09B0\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A4\u09BE \u099B\u09BF\u09B2\u09C7\u09A8 **\u0997\u09CB\u09AA\u09BE\u09B2**, \u09AF\u09BF\u09A8\u09BF \u09AC\u09BE\u0982\u09B2\u09BE\u09DF \u09AA\u09CD\u09B0\u09A5\u09AE \u0997\u09A3\u09A4\u09BE\u09A8\u09CD\u09A4\u09CD\u09B0\u09BF\u0995 \u09AA\u09A6\u09CD\u09A7\u09A4\u09BF\u09A4\u09C7 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u09B0\u09BE\u099C\u09BE \u099B\u09BF\u09B2\u09C7\u09A8\u0964\n\n### \u09E8. \u09AD\u09BE\u09B0\u09A4\u09C7\u09B0 \u09B8\u09CD\u09AC\u09BE\u09A7\u09C0\u09A8\u09A4\u09BE \u09B8\u0982\u0997\u09CD\u09B0\u09BE\u09AE (\u09E7\u09EE\u09EB\u09ED - \u09E7\u09EF\u09EA\u09ED):\n* **\u09E7\u09EE\u09EB\u09ED:** \u09B8\u09BF\u09AA\u09BE\u09B9\u09C0 \u09AC\u09BF\u09A6\u09CD\u09B0\u09CB\u09B9 (\u09AE\u0999\u09CD\u0997\u09B2 \u09AA\u09BE\u09A8\u09CD\u09A1\u09C7 \u09AA\u09CD\u09B0\u09A5\u09AE \u09B6\u09B9\u09C0\u09A6 \u09B9\u09A8)\u0964\n* **\u09E7\u09EF\u09E6\u09EB:** \u09AC\u0999\u09CD\u0997\u09AD\u0999\u09CD\u0997 (\u09B2\u09B0\u09CD\u09A1 \u0995\u09BE\u09B0\u09CD\u099C\u09A8 \u09A6\u09CD\u09AC\u09BE\u09B0\u09BE)\u0964\n* **\u09E7\u09EF\u09E7\u09E7:** \u09AC\u0999\u09CD\u0997\u09AD\u0999\u09CD\u0997 \u09B0\u09A6 (\u09B2\u09B0\u09CD\u09A1 \u09B9\u09BE\u09B0\u09CD\u09A1\u09BF\u099E\u09CD\u099C \u09A6\u09CD\u09AC\u09BE\u09B0\u09BE)\u0964\n* **\u09E7\u09EF\u09EA\u09E8:** \u09AD\u09BE\u09B0\u09A4 \u099B\u09BE\u09DC\u09CB \u0986\u09A8\u09CD\u09A6\u09CB\u09B2\u09A8\u0964\n* **\u09E7\u09EF\u09EA\u09ED:** \u09AD\u09BE\u09B0\u09A4 \u0993 \u09AA\u09BE\u0995\u09BF\u09B8\u09CD\u09A4\u09BE\u09A8\u09C7\u09B0 \u09B8\u09CD\u09AC\u09BE\u09A7\u09C0\u09A8\u09A4\u09BE \u09B2\u09BE\u09AD\u0964",
        mcqs: [
          {
            question:
              "\u09AC\u09BE\u0982\u09B2\u09BE\u09B0 \u09AA\u09CD\u09B0\u09A5\u09AE \u09B8\u09CD\u09AC\u09BE\u09A7\u09C0\u09A8 \u0993 \u09B8\u09BE\u09B0\u09CD\u09AC\u09AD\u09CC\u09AE \u09B0\u09BE\u099C\u09BE \u0995\u09C7 \u099B\u09BF\u09B2\u09C7\u09A8?",
            options: [
              "\u09B6\u09B6\u09BE\u0999\u09CD\u0995",
              "\u0997\u09CB\u09AA\u09BE\u09B2",
              "\u09A7\u09B0\u09CD\u09AE\u09AA\u09BE\u09B2",
              "\u09B2\u0995\u09CD\u09B7\u09A3 \u09B8\u09C7\u09A8",
            ],
            correctAnswer: "\u09B6\u09B6\u09BE\u0999\u09CD\u0995",
            explanation:
              "\u09B0\u09BE\u099C\u09BE \u09B6\u09B6\u09BE\u0999\u09CD\u0995 \u09B8\u09AA\u09CD\u09A4\u09AE \u09B6\u09A4\u09BE\u09AC\u09CD\u09A6\u09C0\u09B0 \u09B6\u09C1\u09B0\u09C1\u09A4\u09C7 \u09AA\u09CD\u09B0\u09BE\u099A\u09C0\u09A8 \u09AC\u09BE\u0982\u09B2\u09BE\u09B0 \u0997\u09CC\u09A1\u09BC \u09B0\u09BE\u099C\u09CD\u09AF\u09C7\u09B0 \u09AA\u09CD\u09B0\u09A5\u09AE \u09B8\u09CD\u09AC\u09BE\u09A7\u09C0\u09A8 \u0993 \u09B8\u09BE\u09B0\u09CD\u09AC\u09AD\u09CC\u09AE \u09B6\u09BE\u09B8\u0995 \u099B\u09BF\u09B2\u09C7\u09A8\u0964",
          },
        ],
        month: "July 2026",
        timestamp: new Date().toISOString(),
      },
      {
        id: "pdfn-seed-geography",
        subject: "geography",
        title:
          "July 2026 - Geography: Physical Geography of Bengal & River Systems",
        introduction:
          "\u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6 \u0993 \u09AD\u09BE\u09B0\u09A4\u09C7\u09B0 \u09AD\u09CC\u0997\u09CB\u09B2\u09BF\u0995 \u0985\u09AC\u09B8\u09CD\u09A5\u09BE\u09A8, \u09AD\u09C2\u09AA\u09CD\u09B0\u0995\u09C3\u09A4\u09BF, \u09A8\u09A6\u09A8\u09A6\u09C0 \u098F\u09AC\u0982 \u099C\u09B2\u09AC\u09BE\u09AF\u09BC\u09C1 \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8 \u09B8\u0982\u0995\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4 \u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC\u09AA\u09C2\u09B0\u09CD\u09A3 \u09A4\u09A5\u09CD\u09AF\u09BE\u09AC\u09B2\u09C0\u0964",
        keyTopics: [
          "Geographical Boundaries",
          "River Systems of Bengal",
          "Natural Disasters",
        ],
        theoryContent:
          "### \u09E7. \u09AC\u09BE\u0982\u09B2\u09BE\u09B0 \u09AD\u09CC\u0997\u09CB\u09B2\u09BF\u0995 \u0985\u09AC\u09B8\u09CD\u09A5\u09BE\u09A8 \u0993 \u09B8\u09C0\u09AE\u09BE\u09A8\u09BE:\n* \u09AC\u09BE\u0982\u09B2\u09BE\u09B0 \u0989\u09AA\u09B0 \u09A6\u09BF\u09DF\u09C7 **\u0995\u09B0\u09CD\u0995\u099F\u0995\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4\u09BF \u09B0\u09C7\u0996\u09BE (Tropic of Cancer)** \u0985\u09A4\u09BF\u09AC\u09BE\u09B9\u09BF\u09A4 \u09B9\u09DF\u09C7\u099B\u09C7\u0964\n* \u09AA\u09C3\u09A5\u09BF\u09AC\u09C0\u09B0 \u09A6\u09C0\u09B0\u09CD\u0998\u09A4\u09AE \u09B8\u09AE\u09C1\u09A6\u09CD\u09B0 \u09B8\u09C8\u0995\u09A4 **\u0995\u0995\u09CD\u09B8\u09AC\u09BE\u099C\u09BE\u09B0** \u098F\u09AC\u0982 \u09AC\u09C3\u09B9\u09A4\u09CD\u09A4\u09AE \u09AE\u09CD\u09AF\u09BE\u09A8\u0997\u09CD\u09B0\u09CB\u09AD \u09AC\u09A8 **\u09B8\u09C1\u09A8\u09CD\u09A6\u09B0\u09AC\u09A8** \u09AC\u09BE\u0982\u09B2\u09BE\u09DF \u0985\u09AC\u09B8\u09CD\u09A5\u09BF\u09A4\u0964\n\n### \u09E8. \u09A8\u09A6\u09A8\u09A6\u09C0 \u0993 \u0989\u09AA\u09A8\u09A6\u09C0:\n* \u09AA\u09A6\u09CD\u09AE\u09BE \u09A8\u09A6\u09C0 \u09AD\u09BE\u09B0\u09A4\u09C7 **\u0997\u0999\u09CD\u0997\u09BE** \u09A8\u09BE\u09AE\u09C7 \u09AA\u09B0\u09BF\u099A\u09BF\u09A4\u0964 \u098F\u099F\u09BF \u099A\u09BE\u0981\u09AA\u09BE\u0987\u09A8\u09AC\u09BE\u09AC\u0997\u099E\u09CD\u099C \u09A6\u09BF\u09DF\u09C7 \u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6\u09C7 \u09AA\u09CD\u09B0\u09AC\u09C7\u09B6 \u0995\u09B0\u09C7\u099B\u09C7\u0964\n* \u09AC\u09CD\u09B0\u09B9\u09CD\u09AE\u09AA\u09C1\u09A4\u09CD\u09B0 \u09A8\u09A6 \u0995\u09C1\u09DC\u09BF\u0997\u09CD\u09B0\u09BE\u09AE \u099C\u09C7\u09B2\u09BE\u09B0 \u09AE\u09A7\u09CD\u09AF \u09A6\u09BF\u09DF\u09C7 \u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6\u09C7 \u09AA\u09CD\u09B0\u09AC\u09C7\u09B6 \u0995\u09B0\u09C7 \u09AA\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0\u09A4\u09C7 \u09AF\u09AE\u09C1\u09A8\u09BE \u09A8\u09BE\u09AE\u09C7 \u09AA\u09CD\u09B0\u09AC\u09BE\u09B9\u09BF\u09A4 \u09B9\u09DF\u09C7\u099B\u09C7\u0964",
        mcqs: [
          {
            question:
              "\u0995\u09B0\u09CD\u0995\u099F\u0995\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4\u09BF \u09B0\u09C7\u0996\u09BE \u09AC\u09BE\u0982\u09B2\u09BE\u09B0 \u0995\u09CB\u09A8 \u0985\u0982\u09B6\u09C7\u09B0 \u0989\u09AA\u09B0 \u09A6\u09BF\u09DF\u09C7 \u0997\u09BF\u09DF\u09C7\u099B\u09C7?",
            options: [
              "\u09A0\u09BF\u0995 \u09AE\u09BE\u099D\u0996\u09BE\u09A8 \u09A6\u09BF\u09DF\u09C7",
              "\u0989\u09A4\u09CD\u09A4\u09B0\u09BE\u099E\u09CD\u099A\u09B2 \u09A6\u09BF\u09DF\u09C7",
              "\u09A6\u0995\u09CD\u09B7\u09BF\u09A3\u09BE\u099E\u09CD\u099A\u09B2 \u09A6\u09BF\u09DF\u09C7",
              "\u09B8\u09C0\u09AE\u09BE\u09A8\u09CD\u09A4\u09AC\u09B0\u09CD\u09A4\u09C0 \u098F\u09B2\u09BE\u0995\u09BE \u09A6\u09BF\u09DF\u09C7",
            ],
            correctAnswer:
              "\u09A0\u09BF\u0995 \u09AE\u09BE\u099D\u0996\u09BE\u09A8 \u09A6\u09BF\u09DF\u09C7",
            explanation:
              "\u09E8\u09E9.\u09EB \u09A1\u09BF\u0997\u09CD\u09B0\u09BF \u0989\u09A4\u09CD\u09A4\u09B0 \u0985\u0995\u09CD\u09B7\u09BE\u0982\u09B6 \u09AC\u09BE \u0995\u09B0\u09CD\u0995\u099F\u0995\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4\u09BF \u09B0\u09C7\u0996\u09BE \u09AC\u09BE\u0982\u09B2\u09BE\u09B0 (\u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6 \u0993 \u09AA\u09B6\u09CD\u099A\u09BF\u09AE\u09AC\u0999\u09CD\u0997) \u09AA\u09CD\u09B0\u09BE\u09DF \u09AE\u09BE\u099D\u0996\u09BE\u09A8 \u09A6\u09BF\u09DF\u09C7 \u09AA\u09CD\u09B0\u09AC\u09BE\u09B9\u09BF\u09A4 \u09B9\u09DF\u09C7\u099B\u09C7\u0964",
          },
        ],
        month: "July 2026",
        timestamp: new Date().toISOString(),
      },
      {
        id: "pdfn-seed-polity",
        subject: "polity",
        title:
          "July 2026 - Constitution & Polity: Fundamental Rights & Judicial Review",
        introduction:
          "\u09B8\u0982\u09AC\u09BF\u09A7\u09BE\u09A8\u09C7\u09B0 \u09AA\u09CD\u09B0\u09A7\u09BE\u09A8 \u09AC\u09C8\u09B6\u09BF\u09B7\u09CD\u099F\u09CD\u09AF\u09B8\u09AE\u09C2\u09B9, \u09AE\u09CC\u09B2\u09BF\u0995 \u0985\u09A7\u09BF\u0995\u09BE\u09B0, \u098F\u09AC\u0982 \u09B8\u09B0\u0995\u09BE\u09B0\u09BF \u09A8\u09C0\u09A4\u09BF \u09A8\u09BF\u09B0\u09CD\u09A7\u09BE\u09B0\u09A3\u09C7\u09B0 \u09AE\u09C2\u09B2 \u0989\u09CE\u09B8\u09B8\u09AE\u09C2\u09B9 \u09B8\u09B9\u099C \u09AD\u09BE\u09B7\u09BE\u09DF \u0986\u09B2\u09CB\u099A\u09A8\u09BE\u0964",
        keyTopics: [
          "Preamble & Structure",
          "Fundamental Rights",
          "Directive Principles",
        ],
        theoryContent:
          "### \u09E7. \u09B8\u0982\u09AC\u09BF\u09A7\u09BE\u09A8\u09C7\u09B0 \u0995\u09BE\u09A0\u09BE\u09AE\u09CB:\n* \u09B8\u0982\u09AC\u09BF\u09A7\u09BE\u09A8 \u09B9\u09B2\u09CB \u09B0\u09BE\u09B7\u09CD\u099F\u09CD\u09B0\u09C7\u09B0 \u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u0986\u0987\u09A8\u0964\n* \u09AE\u09C2\u09B2 \u09B8\u0982\u09AC\u09BF\u09A7\u09BE\u09A8\u09C7 \u09A8\u09BE\u0997\u09B0\u09BF\u0995\u09A6\u09C7\u09B0 \u09AE\u09CC\u09B2\u09BF\u0995 \u0985\u09A7\u09BF\u0995\u09BE\u09B0\u0997\u09C1\u09B2\u09CB \u09B8\u09C1\u09A8\u09BF\u09B0\u09CD\u09A6\u09BF\u09B7\u09CD\u099F\u09AD\u09BE\u09AC\u09C7 \u09AC\u09B0\u09CD\u09A3\u09A8\u09BE \u0995\u09B0\u09BE \u09A5\u09BE\u0995\u09C7\u0964\n\n### \u09E8. \u09AE\u09CC\u09B2\u09BF\u0995 \u0985\u09A7\u09BF\u0995\u09BE\u09B0\u09B8\u09AE\u09C2\u09B9 (Fundamental Rights):\n* \u0986\u0987\u09A8 \u09AC\u09BE \u0986\u09A6\u09BE\u09B2\u09A4\u09C7\u09B0 \u09AE\u09BE\u09A7\u09CD\u09AF\u09AE\u09C7 \u09AE\u09CC\u09B2\u09BF\u0995 \u0985\u09A7\u09BF\u0995\u09BE\u09B0 \u09AA\u09CD\u09B0\u09DF\u09CB\u0997 \u0995\u09B0\u09BE \u09AF\u09BE\u09DF\u0964\n* \u09B0\u09BE\u09B7\u09CD\u099F\u09CD\u09B0\u09C7\u09B0 \u099C\u09B0\u09C1\u09B0\u09BF \u0985\u09AC\u09B8\u09CD\u09A5\u09BE\u09DF \u09A8\u09BE\u0997\u09B0\u09BF\u0995 \u0985\u09A7\u09BF\u0995\u09BE\u09B0 \u09B8\u09BE\u09AE\u09DF\u09BF\u0995\u09AD\u09BE\u09AC\u09C7 \u09B8\u09CD\u09A5\u0997\u09BF\u09A4 \u0995\u09B0\u09BE \u09B9\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u0964",
        mcqs: [
          {
            question:
              "\u0995\u09CB\u09A8\u09CB \u09A6\u09C7\u09B6\u09C7\u09B0 \u09B8\u0982\u09AC\u09BF\u09A7\u09BE\u09A8\u09C7\u09B0 \u09AA\u09CD\u09B0\u09A7\u09BE\u09A8 \u0995\u09BE\u099C \u0995\u09C0?",
            options: [
              "\u09B8\u09B0\u0995\u09BE\u09B0 \u0993 \u099C\u09A8\u0997\u09A3\u09C7\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u0995\u09CD\u09B7\u09AE\u09A4\u09BE\u09B0 \u09AD\u09BE\u09B0\u09B8\u09BE\u09AE\u09CD\u09AF \u09AC\u099C\u09BE\u09DF \u09B0\u09BE\u0996\u09BE \u0993 \u09B0\u09BE\u09B7\u09CD\u099F\u09CD\u09B0 \u09AA\u09B0\u09BF\u099A\u09BE\u09B2\u09A8\u09BE \u0995\u09B0\u09BE",
              " his/her basic tax",
              "\u09AC\u09BF\u09A6\u09C7\u09B6\u09BF \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995 \u09A8\u09BF\u09DF\u09A8\u09CD\u09A4\u09CD\u09B0\u09A3 \u0995\u09B0\u09BE",
              "\u09AC\u09BF\u099A\u09BE\u09B0\u0995\u09A6\u09C7\u09B0 \u09AC\u09C7\u09A4\u09A8 \u09A8\u09BF\u09B0\u09CD\u09A7\u09BE\u09B0\u09A3 \u0995\u09B0\u09BE",
            ],
            correctAnswer:
              "\u09B8\u09B0\u0995\u09BE\u09B0 \u0993 \u099C\u09A8\u0997\u09A3\u09C7\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u0995\u09CD\u09B7\u09AE\u09A4\u09BE\u09B0 \u09AD\u09BE\u09B0\u09B8\u09BE\u09AE\u09CD\u09AF \u09AC\u099C\u09BE\u09DF \u09B0\u09BE\u0996\u09BE \u0993 \u09B0\u09BE\u09B7\u09CD\u099F\u09CD\u09B0 \u09AA\u09B0\u09BF\u099A\u09BE\u09B2\u09A8\u09BE \u0995\u09B0\u09BE",
            explanation:
              "\u09B8\u0982\u09AC\u09BF\u09A7\u09BE\u09A8 \u09B0\u09BE\u09B7\u09CD\u099F\u09CD\u09B0\u09C7\u09B0 \u09AE\u09CC\u09B2\u09BF\u0995 \u0986\u0987\u09A8 \u09AF\u09BE \u09B8\u09B0\u0995\u09BE\u09B0\u09C7\u09B0 \u0995\u09BE\u09A0\u09BE\u09AE\u09CB \u0993 \u09A8\u09BE\u0997\u09B0\u09BF\u0995\u09A6\u09C7\u09B0 \u0985\u09A7\u09BF\u0995\u09BE\u09B0\u09C7\u09B0 \u0997\u09CD\u09AF\u09BE\u09B0\u09BE\u09A8\u09CD\u099F\u09BF \u09A6\u09C7\u09DF\u0964",
          },
        ],
        month: "July 2026",
        timestamp: new Date().toISOString(),
      },
      {
        id: "pdfn-seed-economics",
        subject: "economics",
        title:
          "July 2026 - Economics: National Income & Five-Year Planning Analysis",
        introduction:
          "\u099C\u09BF\u09A1\u09BF\u09AA\u09BF, \u099C\u09BF\u098F\u09A8\u09AA\u09BF \u098F\u09AC\u0982 \u09AA\u099E\u09CD\u099A\u09AC\u09BE\u09B0\u09CD\u09B7\u09BF\u0995 \u09AA\u09B0\u09BF\u0995\u09B2\u09CD\u09AA\u09A8\u09BE \u0993 \u09AC\u09BE\u099C\u09C7\u099F \u09B8\u0982\u0995\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4 \u0985\u09B0\u09CD\u09A5\u09A8\u09C8\u09A4\u09BF\u0995 \u099C\u099F\u09BF\u09B2 \u09B6\u09AC\u09CD\u09A6\u09B8\u09AE\u09C2\u09B9\u09C7\u09B0 \u09B8\u09B9\u099C \u09AC\u09BF\u09B6\u09CD\u09B2\u09C7\u09B7\u09A3\u0964",
        keyTopics: [
          "National Income (GDP, GNP)",
          "Inflation & Banking",
          "Five-Year Plans",
        ],
        theoryContent:
          "### \u09E7. \u099C\u09BE\u09A4\u09C0\u09DF \u0986\u09DF \u09AA\u09B0\u09BF\u09AE\u09BE\u09AA\u09C7\u09B0 \u0989\u09AA\u09BE\u09A6\u09BE\u09A8:\n* **GDP (Gross Domestic Product):** \u098F\u0995\u099F\u09BF \u09A6\u09C7\u09B6\u09C7\u09B0 \u09AD\u09CC\u0997\u09CB\u09B2\u09BF\u0995 \u09B8\u09C0\u09AE\u09BE\u09A8\u09BE\u09B0 \u09AD\u09BF\u09A4\u09B0\u09C7 \u0989\u09CE\u09AA\u09BE\u09A6\u09BF\u09A4 \u09AE\u09CB\u099F \u09AA\u09A3\u09CD\u09AF \u0993 \u09B8\u09C7\u09AC\u09BE\u09B0 \u09AE\u09C2\u09B2\u09CD\u09AF\u0964\n* **GNP (Gross National Product):** \u09A6\u09C7\u09B6\u09C7\u09B0 \u09A8\u09BE\u0997\u09B0\u09BF\u0995\u09A6\u09C7\u09B0 \u0989\u09CE\u09AA\u09BE\u09A6\u09BF\u09A4 \u09AE\u09CB\u099F \u09AA\u09A3\u09CD\u09AF \u0993 \u09B8\u09C7\u09AC\u09BE (\u09A6\u09C7\u09B6 \u098F\u09AC\u0982 \u09AC\u09BF\u09A6\u09C7\u09B6\u09C7)\u0964\n\n### \u09E8. \u09AE\u09C1\u09A6\u09CD\u09B0\u09BE\u09B8\u09CD\u09AB\u09C0\u09A4\u09BF (Inflation):\n* \u09AC\u09BE\u099C\u09BE\u09B0\u09C7 \u09AE\u09C1\u09A6\u09CD\u09B0\u09BE\u09B0 \u09B8\u09B0\u09AC\u09B0\u09BE\u09B9 \u09AC\u09C7\u09DC\u09C7 \u0997\u09C7\u09B2\u09C7 \u09AA\u09A3\u09CD\u09AF\u09C7\u09B0 \u09A6\u09BE\u09AE \u09AC\u09BE\u09DC\u09C7 \u098F\u09AC\u0982 \u099F\u09BE\u0995\u09BE\u09B0 \u09AE\u09BE\u09A8 \u0995\u09AE\u09C7 \u09AF\u09BE\u09DF, \u098F\u0995\u09C7 \u09AE\u09C1\u09A6\u09CD\u09B0\u09BE\u09B8\u09CD\u09AB\u09C0\u09A4\u09BF \u09AC\u09B2\u09C7\u0964",
        mcqs: [
          {
            question:
              "GDP \u098F\u09AC\u0982 GNP \u098F\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u09AA\u09CD\u09B0\u09A7\u09BE\u09A8 \u09AA\u09BE\u09B0\u09CD\u09A5\u0995\u09CD\u09AF \u0995\u09C0?",
            options: [
              "\u09AD\u09CC\u0997\u09CB\u09B2\u09BF\u0995 \u09B8\u09C0\u09AE\u09BE\u09A8\u09BE \u09AC\u09A8\u09BE\u09AE \u09A8\u09BE\u0997\u09B0\u09BF\u0995\u09A4\u09CD\u09AC \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u0989\u09CE\u09AA\u09BE\u09A6\u09A8",
              "\u099F\u09CD\u09AF\u09BE\u0995\u09CD\u09B8 \u0993 \u09AD\u09CD\u09AF\u09BE\u099F \u09B8\u0982\u0995\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4 \u09B9\u09BF\u09B8\u09BE\u09AC",
              "\u0986\u09AE\u09A6\u09BE\u09A8\u09BF \u0993 \u09B0\u09AA\u09CD\u09A4\u09BE\u09A8\u09BF\u09B0 \u0985\u09A8\u09C1\u09AA\u09BE\u09A4",
              "\u0995\u09CB\u09A8\u09CB \u09AA\u09BE\u09B0\u09CD\u09A5\u0995\u09CD\u09AF \u09A8\u09C7\u0987",
            ],
            correctAnswer:
              "\u09AD\u09CC\u0997\u09CB\u09B2\u09BF\u0995 \u09B8\u09C0\u09AE\u09BE\u09A8\u09BE \u09AC\u09A8\u09BE\u09AE \u09A8\u09BE\u0997\u09B0\u09BF\u0995\u09A4\u09CD\u09AC \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u0989\u09CE\u09AA\u09BE\u09A6\u09A8",
            explanation:
              "GDP \u0997\u09A3\u09A8\u09BE \u0995\u09B0\u09BE \u09B9\u09DF \u09AD\u09CC\u0997\u09CB\u09B2\u09BF\u0995 \u09B8\u09C0\u09AE\u09BE\u09A8\u09BE\u09B0 \u09AD\u09C7\u09A4\u09B0\u09C7\u09B0 \u0989\u09CE\u09AA\u09BE\u09A6\u09A8\u09C7\u09B0 \u0993\u09AA\u09B0 \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF \u0995\u09B0\u09C7, \u0986\u09B0 GNP \u09A6\u09C7\u09B6\u09C7\u09B0 \u09B8\u0995\u09B2 \u09A8\u09BE\u0997\u09B0\u09BF\u0995\u09C7\u09B0 \u09AE\u09CB\u099F \u0986\u09DF\u09C7\u09B0 \u0993\u09AA\u09B0 \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF \u0995\u09B0\u09C7\u0964",
          },
        ],
        month: "July 2026",
        timestamp: new Date().toISOString(),
      },
    ];
    if (firestore) {
      for (const note of seedData) {
        await firestore.collection("aiPdfNotes").doc(note.id).set(note);
      }
    } else {
    }
    console.log("AI PDF Notes successfully seeded in database!");
  } catch (error) {
    console.error("Error seeding AI PDF notes:", error);
  }
}
__name(deprecatedSeedAiPdfNotes, "deprecatedSeedAiPdfNotes");
app.get("/api/updates/check", (req, res) => {
  try {
    const currentVersion = (req.query.currentVersion as string) || "1.0.0";
    const parts = currentVersion.split(".").map(Number);
    const major = parts[0] || 1;
    const minor = parts[1] || 0;
    const patch = parts[2] || 0;
    const nextVersion = `${major}.${minor}.${patch + 1}`;
    res.json({
      latestVersion: nextVersion,
      changelog:
        "New feature updates, performance improvements, and bug fixes.",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to read server version" });
  }
});
app.post("/api/updates/install", (req, res) => {
  res.json({ success: true });
});
app.get("/api/videos", async (req, res) => {
  try {
    const videosList = await getVideoLectures();
    res.json(videosList);
  } catch (error) {
    console.error("Error fetching video lectures:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/videos", async (req, res) => {
  const video = req.body;
  if (!video.id || !video.title || !video.videoUrl) {
    return res
      .status(400)
      .json({ error: "Missing required fields (id, title, videoUrl)" });
  }
  try {
    const saved = await saveVideoLecture(video);
    await createNotification({
      title:
        "\u09A8\u09A4\u09C1\u09A8 \u09AD\u09BF\u09A1\u09BF\u0993 \u09B2\u09C7\u0995\u099A\u09BE\u09B0 \u09AF\u09C1\u0995\u09CD\u09A4 \u0995\u09B0\u09BE \u09B9\u09DF\u09C7\u099B\u09C7",
      message: `\u09AA\u09CD\u09B0\u09B6\u09BE\u09B8\u0995 \u09A6\u09CD\u09AC\u09BE\u09B0\u09BE \u098F\u0995\u099F\u09BF \u09A8\u09A4\u09C1\u09A8 \u09AD\u09BF\u09A1\u09BF\u0993 \u09B2\u09C7\u0995\u099A\u09BE\u09B0 \u0986\u09AA\u09B2\u09CB\u09A1 \u0995\u09B0\u09BE \u09B9\u09DF\u09C7\u099B\u09C7: "${video.title}"`,
      type: "video",
    });
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error saving video lecture:", error);
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/videos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const success = await deleteVideoLecture(id);
    res.json({ success });
  } catch (error) {
    console.error("Error deleting video lecture:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/videos/:id/comments", async (req, res) => {
  const { id } = req.params;
  const comment = req.body;
  if (!comment.senderEmail || !comment.comment) {
    return res.status(400).json({ error: "Missing comment fields" });
  }
  try {
    const videosList = await getVideoLectures();
    const video = videosList.find((v) => v.id === id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    if (!video.comments) video.comments = [];
    video.comments.push(comment);
    await saveVideoLecture(video);
    try {
      await createNotification({
        title: "ভিডিও লেকচারে নতুন মন্তব্য 💬",
        message: `"${comment.senderName || 'একজন শিক্ষার্থী'}" "${video.title}" লেকচারে মন্তব্য করেছেন।`,
        type: "video"
      });
    } catch (notifErr) {
      console.error("Failed to trigger video lecture comment notification:", notifErr);
    }
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment to video:", error);
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/videos/:id/comments/:commentId", async (req, res) => {
  const { id, commentId } = req.params;
  try {
    const videosList = await getVideoLectures();
    const video = videosList.find((v) => v.id === id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    if (video.comments) {
      video.comments = video.comments.filter((c) => c.id !== commentId);
    }
    await saveVideoLecture(video);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment from video:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/notifications", async (req, res) => {
  console.log("Fetching notifications, query:", req.query);
  const { userEmail } = req.query;
  try {
    const notificationsList = await getNotifications(userEmail as string);
    res.json(notificationsList);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/notifications", async (req, res) => {
  try {
    const notification = req.body;
    const saved = await createNotification(notification);
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating custom notification:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/notifications/:id/read", async (req, res) => {
  const { id } = req.params;
  try {
    const success = await markNotificationAsRead(id);
    res.json({ success });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/notifications/read-all", async (req, res) => {
  const { userEmail } = req.body;
  try {
    const success = await markAllNotificationsAsRead(userEmail);
    res.json({ success });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/notifications/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const success = await deleteNotification(id);
    res.json({ success });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: error.message });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    app.use((req, res, next) => {
      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      next();
    });
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(
      express.static(distPath, {
        setHeaders: __name((res, filePath) => {
          if (
            filePath.endsWith(".html") ||
            filePath.endsWith(".js") ||
            filePath.endsWith(".webmanifest") ||
            filePath.endsWith(".json")
          ) {
            res.setHeader(
              "Cache-Control",
              "no-cache, no-store, must-revalidate",
            );
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
          } else {
            res.setHeader(
              "Cache-Control",
              "public, max-age=31536000, immutable",
            );
          }
        }, "setHeaders"),
      }),
    );
    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  try {
    await initDatabase();
  } catch (err) {
    console.error("Database initialization failed:", err);
  }
  try {
    const count = await getAiPdfNotesCount();
    if (count === 0) {
      const seedData = [
        {
          id: "pdfn-seed-math",
          subject: "math",
          title:
            "July 2026 - Quantitative Aptitude: Magic Shortcut Tricks for Percentage & Ratio",
          introduction:
            "\u098F\u0987 \u0997\u09BE\u0987\u09A1\u099F\u09BF\u09A4\u09C7 \u09B6\u09A4\u0995\u09B0\u09BE \u0993 \u0985\u09A8\u09C1\u09AA\u09BE\u09A4\u09C7\u09B0 \u099C\u099F\u09BF\u09B2 \u0985\u0982\u0995\u0997\u09C1\u09B2\u09CB \u09AE\u09BE\u09A4\u09CD\u09B0 \u09EB-\u09E7\u09E6 \u09B8\u09C7\u0995\u09C7\u09A8\u09CD\u09A1\u09C7 \u09B8\u09AE\u09BE\u09A7\u09BE\u09A8 \u0995\u09B0\u09BE\u09B0 \u09B6\u09B0\u09CD\u099F\u0995\u09BE\u099F \u099F\u09C7\u0995\u09A8\u09BF\u0995 \u0993 \u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u0986\u09B2\u09CB\u099A\u09A8\u09BE \u0995\u09B0\u09BE \u09B9\u09DF\u09C7\u099B\u09C7\u0964",
          keyTopics: [
            "Percentage Rules",
            "Ratio & Proportion",
            "BCS Prep Hacks",
          ],
          theoryContent:
            "### \u09E7. \u09B6\u09A4\u0995\u09B0\u09BE \u09A8\u09BF\u09B0\u09CD\u09A8\u09DF\u09C7\u09B0 \u09AE\u09CD\u09AF\u09BE\u099C\u09BF\u0995 \u099F\u09CD\u09B0\u09BF\u0995 (Percentage Shortcuts):\n\u09B6\u09A4\u0995\u09B0\u09BE \u0985\u0982\u0995\u0997\u09C1\u09B2\u09CB \u09B8\u09B9\u099C\u09C7 \u0995\u09B0\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09AD\u0997\u09CD\u09A8\u09BE\u0982\u09B6\u09C7 \u09B0\u09C2\u09AA\u09BE\u09A8\u09CD\u09A4\u09B0 \u0995\u09B0\u09BE \u09B6\u09BF\u0996\u09A4\u09C7 \u09B9\u09AC\u09C7\u0964\n* \u09E8\u09E6% = \u09E7/\u09EB\n* \u09E8\u09EB% = \u09E7/\u09EA\n* \u09EB\u09E6% = \u09E7/\u09E8\n\n** can_be_applied:** \u099A\u09BE\u09B2\u09C7\u09B0 \u09AE\u09C2\u09B2\u09CD\u09AF \u09E8\u09E6% \u09AC\u09C3\u09A6\u09CD\u09A7\u09BF \u09AA\u09C7\u09B2\u09C7 \u099A\u09BE\u09B2\u09C7\u09B0 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u09B6\u09A4\u0995\u09B0\u09BE \u0995\u09A4 \u0995\u09AE\u09BE\u09B2\u09C7 \u0996\u09B0\u099A\u09C7\u09B0 \u0995\u09CB\u09A8\u09CB \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8 \u09B9\u09AC\u09C7 \u09A8\u09BE?\n* **\u09B6\u09B0\u09CD\u099F\u0995\u09BE\u099F \u09B8\u09C2\u09A4\u09CD\u09B0:** (R / (100 + R)) * 100\n* \u09B8\u09AE\u09BE\u09A7\u09BE\u09A8: (\u09E8\u09E6 / \u09E7\u09E8\u09E6) * \u09E7\u09E6\u09E6 = \u09E7\u09EC.\u09EC\u09ED%\n\n### \u09E8. \u0985\u09A8\u09C1\u09AA\u09BE\u09A4 \u0993 \u0985\u0982\u09B6\u09C0\u09A6\u09BE\u09B0\u09BF\u09A4\u09CD\u09AC (Ratio & Proportion Hacks):\n\u09AF\u09A6\u09BF A:B = 2:3 \u098F\u09AC\u0982 B:C = 4:5 \u09B9\u09DF, \u09A4\u09AC\u09C7 A:B:C = ?\n* **\u09B6\u09B0\u09CD\u099F\u0995\u09BE\u099F '\u09A6' \u09AA\u09A6\u09CD\u09A7\u09A4\u09BF:**\n  * A = 2 * 4 = 8\n  * B = 3 * 4 = 12\n  * C = 3 * 5 = 15\n  * \u0989\u09A4\u09CD\u09A4\u09B0: 8:12:15",
          mcqs: [
            {
              question:
                "\u099A\u09BE\u09B2\u09C7\u09B0 \u09AE\u09C2\u09B2\u09CD\u09AF \u09E8\u09EB% \u09AC\u09C3\u09A6\u09CD\u09A7\u09BF \u09AA\u09C7\u09B2\u09C7 \u099A\u09BE\u09B2\u09C7\u09B0 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u09B6\u09A4\u0995\u09B0\u09BE \u0995\u09A4 \u0995\u09AE\u09BE\u09B2\u09C7 \u0996\u09B0\u099A \u0985\u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09A5\u09BE\u0995\u09AC\u09C7?",
              options: [
                "\u09E8\u09E6%",
                "\u09E8\u09EB%",
                "\u09E7\u09EC.\u09EC\u09ED%",
                "\u09E7\u09EB%",
              ],
              correctAnswer: "\u09E8\u09E6%",
              explanation:
                "\u09B8\u09C2\u09A4\u09CD\u09B0: (R / (100+R)) * 100 => (25/125)*100 = 20%.",
            },
            {
              question:
                "\u09AF\u09A6\u09BF A:B = 3:4 \u098F\u09AC\u0982 B:C = 5:6 \u09B9\u09DF, \u09A4\u09AC\u09C7 A:B:C \u0995\u09A4?",
              options: ["15:20:24", "15:24:20", "3:5:6", "9:12:16"],
              correctAnswer: "15:20:24",
              explanation:
                "A = 3*5 = 15, B = 4*5 = 20, C = 4*6 = 24. \u09B8\u09C1\u09A4\u09B0\u09BE\u0982 \u0985\u09A8\u09C1\u09AA\u09BE\u09A4\u099F\u09BF \u09E7\u09EB:\u09E8\u09E6:\u09E8\u09EA\u0964",
            },
          ],
          month: "July 2026",
          timestamp: new Date().toISOString(),
        },
        {
          id: "pdfn-seed-reasoning",
          subject: "reasoning",
          title:
            "July 2026 - Mental Ability: Master Coding-Decoding & Direction Sense",
          introduction:
            "\u098F\u0987 \u0997\u09BE\u0987\u09A1\u099F\u09BF\u09A4\u09C7 \u09B0\u09BF\u099C\u09A8\u09BF\u0982 \u09AC\u09BE \u09AE\u09BE\u09A8\u09B8\u09BF\u0995 \u09A6\u0995\u09CD\u09B7\u09A4\u09BE\u09B0 \u09B8\u09AC\u099A\u09C7\u09DF\u09C7 \u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC\u09AA\u09C2\u09B0\u09CD\u09A3 \u099F\u09AA\u09BF\u0995 \u0995\u09CB\u09A1\u09BF\u0982-\u09A1\u09BF\u0995\u09CB\u09A1\u09BF\u0982 \u098F\u09AC\u0982 \u09A6\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09A3\u09DF \u09B8\u0982\u0995\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4 \u09B6\u09B0\u09CD\u099F\u0995\u09BE\u099F \u099F\u09CD\u09B0\u09BF\u0995\u09CD\u09B8 \u09A6\u09C7\u0993\u09DF\u09BE \u09B9\u09B2\u09CB\u0964",
          keyTopics: [
            "Alphabet Series Codes",
            "Direction & Distances",
            "Visual Analogy",
          ],
          theoryContent:
            "### \u09E7. \u0995\u09CB\u09A1\u09BF\u0982-\u09A1\u09BF\u0995\u09CB\u09A1\u09BF\u0982 \u09B8\u09B9\u099C \u0995\u09B0\u09BE\u09B0 \u09A8\u09BF\u09DF\u09AE:\n\u0987\u0982\u09B0\u09C7\u099C\u09BF \u09AC\u09B0\u09CD\u09A3\u09AE\u09BE\u09B2\u09BE\u09B0 \u0985\u09AC\u09B8\u09CD\u09A5\u09BE\u09A8 \u09B8\u09B9\u099C\u09C7 \u09AE\u09A8\u09C7 \u09B0\u09BE\u0996\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF **EJOTY** \u09B8\u09C2\u09A4\u09CD\u09B0 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8:\n* E = 5, J = 10, O = 15, T = 20, Y = 25\n\n** can_be_applied:** \u09AF\u09A6\u09BF CAT \u0995\u09C7 \u09E8\u09EB \u09B2\u09C7\u0996\u09BE \u09B9\u09DF, \u09A4\u09AC\u09C7 DOG \u0995\u09C7 \u0995\u09A4 \u09B2\u09C7\u0996\u09BE \u09B9\u09AC\u09C7?\n* CAT = C(3) + A(1) + T(20) + 1 = 25\n* DOG = D(4) + O(15) + G(7) + 1 = 27\n\n### \u09E8. \u09A6\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09A3\u09DF (Direction Sense):\n\u09B8\u09AC \u09B8\u09AE\u09DF \u09A8\u09BF\u099C\u09C7\u09B0 \u09A1\u09BE\u09A8\u09A6\u09BF\u0995\u0995\u09C7 \u09AA\u09C2\u09B0\u09CD\u09AC (East),\u09AC\u09BE\u09AE\u09A6\u09BF\u0995\u0995\u09C7 \u09AA\u09B6\u09CD\u099A\u09BF\u09AE (West), \u09B8\u09BE\u09AE\u09A8\u09C7\u09B0 \u09A6\u09BF\u0995\u0995\u09C7 \u0989\u09A4\u09CD\u09A4\u09B0 (North), \u098F\u09AC\u0982 \u09AA\u09BF\u099B\u09A8\u09C7\u09B0 \u09A6\u09BF\u0995\u0995\u09C7 \u09A6\u0995\u09CD\u09B7\u09BF\u09A3 (South) \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 \u09A7\u09B0\u09C7 \u09A8\u09BF\u09A8\u0964 \u09AA\u09BF\u09A5\u09BE\u0997\u09CB\u09B0\u09BE\u09B8\u09C7\u09B0 \u0989\u09AA\u09AA\u09BE\u09A6\u09CD\u09AF ( can be applied: \u0985\u09A4\u09BF\u09AD\u09C1\u099C\xB2 = \u09B2\u09AE\u09CD\u09AC\xB2 + \u09AD\u09C2\u09AE\u09BF\xB2) \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7 \u09A6\u09C2\u09B0\u09A4\u09CD\u09AC \u09AC\u09C7\u09B0 \u0995\u09B0\u09C1\u09A8\u0964",
          mcqs: [
            {
              question:
                "\u098F\u0995 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF \u0989\u09A4\u09CD\u09A4\u09B0 \u09A6\u09BF\u0995\u09C7 \u09EA \u0995\u09BF\u09AE\u09BF \u09B9\u09BE\u0981\u099F\u09BE\u09B0 \u09AA\u09B0 \u09A1\u09BE\u09A8\u09A6\u09BF\u0995\u09C7 \u0998\u09C1\u09B0\u09C7 \u09E9 \u0995\u09BF\u09AE\u09BF \u09B9\u09BE\u0981\u099F\u09B2\u09CB\u0964 \u09B8\u09C7 \u09B6\u09C1\u09B0\u09C1\u09B0 \u09B8\u09CD\u09A5\u09BE\u09A8 \u09A5\u09C7\u0995\u09C7 \u098F\u0996\u09A8 \u0995\u09A4 \u09A6\u09C2\u09B0\u09C7 \u0986\u099B\u09C7?",
              options: [
                "\u09EB \u0995\u09BF\u09AE\u09BF",
                "\u09ED \u0995\u09BF\u09AE\u09BF",
                "\u09E7 \u0995\u09BF\u09AE\u09BF",
                "\u09E7\u09E8 \u0995\u09BF\u09AE\u09BF",
              ],
              correctAnswer: "\u09EB \u0995\u09BF\u09AE\u09BF",
              explanation:
                "\u09AA\u09BF\u09A5\u09BE\u0997\u09CB\u09B0\u09BE\u09B8\u09C7\u09B0 \u0989\u09AA\u09AA\u09BE\u09A6\u09CD\u09AF \u0985\u09A8\u09C1\u09B8\u09BE\u09B0\u09C7, \u09A6\u09C2\u09B0\u09A4\u09CD\u09AC = \u221A(\u09EA\xB2 + \u09E9\xB2) = \u221A(\u09E7\u09EC + \u09EF) = \u221A\u09E8\u09EB = \u09EB \u0995\u09BF\u09AE\u09BF\u0964",
            },
          ],
          month: "July 2026",
          timestamp: new Date().toISOString(),
        },
        {
          id: "pdfn-seed-english",
          subject: "english",
          title:
            "July 2026 - English Grammar: Subject-Verb Agreement Rules & Common Errors",
          introduction:
            "\u099A\u09BE\u0995\u09B0\u09BF\u09B0 \u09AA\u09B0\u09C0\u0995\u09CD\u09B7\u09BE\u09DF \u0987\u0982\u09B0\u09C7\u099C\u09BF\u09A4\u09C7 \u09B8\u09AC\u099A\u09C7\u09DF\u09C7 \u09AC\u09C7\u09B6\u09BF \u0986\u09B8\u09BE Subject-Verb Agreement \u098F\u09B0 \u099C\u099F\u09BF\u09B2 \u09A8\u09BF\u09DF\u09AE\u0997\u09C1\u09B2\u09CB \u09AC\u09BE\u0982\u09B2\u09BE\u09DF \u09B8\u09B9\u099C \u09AC\u09CD\u09AF\u09BE\u0996\u09CD\u09AF\u09BE\u09B8\u09B9 \u09B6\u09BF\u0996\u09C1\u09A8\u0964",
          keyTopics: [
            "Collective Noun Rules",
            "Either/Or, Neither/Nor Cases",
            "Prepositional Phrases",
          ],
          theoryContent:
            "### Rule 1: Collective Nouns\nCollective Noun \u09B8\u09BE\u09A7\u09BE\u09B0\u09A3\u09A4 singular verb \u0997\u09CD\u09B0\u09B9\u09A3 \u0995\u09B0\u09C7\u0964 \u0995\u09BF\u09A8\u09CD\u09A4\u09C1 \u09A4\u09BE\u09B0\u09BE \u09AF\u09A6\u09BF \u09AC\u09BF\u09AD\u0995\u09CD\u09A4 \u09AE\u09A4\u09AC\u09BE\u09A6 \u09AA\u09CD\u09B0\u0995\u09BE\u09B6 \u0995\u09B0\u09C7, \u09A4\u09AC\u09C7 plural verb \u09B9\u09DF\u0964\n* *Example:* The jury **is** unanimous in its decision. (Singular)\n* *Example:* The jury **are** divided in their opinions. (Plural)\n\n### Rule 2: Either/Or & Neither/Nor\nEither... or \u09AC\u09BE Neither... nor \u09A6\u09CD\u09AC\u09BE\u09B0\u09BE \u09A6\u09C1\u099F\u09BF Subject \u09AF\u09C1\u0995\u09CD\u09A4 \u09A5\u09BE\u0995\u09B2\u09C7, verb \u09B8\u09B0\u09CD\u09AC\u09A6\u09BE \u09A6\u09CD\u09AC\u09BF\u09A4\u09C0\u09DF/\u09A8\u09BF\u0995\u099F\u09AC\u09B0\u09CD\u09A4\u09C0 Subject \u0985\u09A8\u09C1\u09DF\u09BE\u09DF\u09C0 \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09BF\u09A4 \u09B9\u09DF\u0964\n* *Example:* Neither the teacher nor the **students** **are** present. (students plural, \u09A4\u09BE\u0987 are \u09B9\u09AF\u09BC\u09C7\u099B\u09C7)\n* *Example:* Either the students or the **teacher** **is** present. (teacher singular, \u09A4\u09BE\u0987 is \u09B9\u09AF\u09BC\u09C7\u099B\u09C7)",
          mcqs: [
            {
              question: "Identify the correct sentence:",
              options: [
                "Many a boy has done his homework.",
                "Many a boy have done their homework.",
                "Many a boys have done his homework.",
                "Many boys has done their homework.",
              ],
              correctAnswer: "Many a boy has done his homework.",
              explanation:
                "'Many a' \u098F\u09B0 \u09AA\u09B0 singular noun \u098F\u09AC\u0982 singular verb \u09AC\u09B8\u09C7\u0964 \u09A4\u09BE\u0987 'Many a boy has' \u09B8\u09A0\u09BF\u0995\u0964",
            },
          ],
          month: "July 2026",
          timestamp: new Date().toISOString(),
        },
        {
          id: "pdfn-seed-science",
          subject: "science",
          title:
            "July 2026 - General Science: Physics Laws & Human Physiology Basics",
          introduction:
            "\u09AA\u09A6\u09BE\u09B0\u09CD\u09A5\u09AC\u09BF\u099C\u09CD\u099E\u09BE\u09A8\u09C7\u09B0 \u09AA\u09CD\u09B0\u09A7\u09BE\u09A8 \u09B8\u09C2\u09A4\u09CD\u09B0\u09BE\u09AC\u09B2\u09C0 \u098F\u09AC\u0982 \u099C\u09C0\u09AC\u09AC\u09BF\u099C\u09CD\u099E\u09BE\u09A8\u09C7\u09B0 \u09AE\u09BE\u09A8\u09AC\u09A6\u09C7\u09B9 \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995\u09BF\u09A4 \u0985\u09A4\u09BF \u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u0993 \u0989\u09A4\u09CD\u09A4\u09B0\u0964",
          keyTopics: [
            "Newton's Laws of Motion",
            "Human Blood & Circulation",
            "Optical Instruments",
          ],
          theoryContent:
            "### \u09E7. \u09A8\u09BF\u0989\u099F\u09A8\u09C7\u09B0 \u0997\u09A4\u09BF\u09B8\u09C2\u09A4\u09CD\u09B0 (Newton's Laws of Motion):\n* **\u09AA\u09CD\u09B0\u09A5\u09AE \u09B8\u09C2\u09A4\u09CD\u09B0:** \u09AC\u09BE\u09B9\u09CD\u09AF\u09BF\u0995 \u09AC\u09B2 \u09AA\u09CD\u09B0\u09DF\u09CB\u0997 \u09A8\u09BE \u0995\u09B0\u09B2\u09C7 \u09B8\u09CD\u09A5\u09BF\u09B0 \u09AC\u09B8\u09CD\u09A4\u09C1 \u099A\u09BF\u09B0\u0995\u09BE\u09B2 \u09B8\u09CD\u09A5\u09BF\u09B0 \u098F\u09AC\u0982 \u0997\u09A4\u09BF\u09B6\u09C0\u09B2 \u09AC\u09B8\u09CD\u09A4\u09C1 \u099A\u09BF\u09B0\u0995\u09BE\u09B2 \u09B8\u09C1\u09B7\u09AE \u0997\u09A4\u09BF\u09A4\u09C7 \u099A\u09B2\u09A4\u09C7 \u09A5\u09BE\u0995\u09AC\u09C7 (\u099C\u09DC\u09A4\u09BE\u09B0 \u09A7\u09BE\u09B0\u09A3\u09BE)\u0964\n* **\u09A6\u09CD\u09AC\u09BF\u09A4\u09C0\u09DF \u09B8\u09C2\u09A4\u09CD\u09B0:** gymnast-\u098F\u09B0 \u09AD\u09B0\u09AC\u09C7\u0997\u09C7\u09B0 \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8\u09C7\u09B0 \u09B9\u09BE\u09B0 \u09A4\u09BE\u09B0 \u0989\u09AA\u09B0 \u09AA\u09CD\u09B0\u09AF\u09C1\u0995\u09CD\u09A4 \u09AC\u09B2\u09C7\u09B0 \u09B8\u09AE\u09BE\u09A8\u09C1\u09AA\u09BE\u09A4\u09BF\u0995 (F = ma)\u0964\n* ** can_be_applied:** \u09AA\u09CD\u09B0\u09A4\u09CD\u09AF\u09C7\u0995 \u0995\u09CD\u09B0\u09BF\u09DF\u09BE\u09B0\u0987 \u098F\u0995\u099F\u09BF \u09B8\u09AE\u09BE\u09A8 \u0993 \u09AC\u09BF\u09AA\u09B0\u09C0\u09A4 \u09AA\u09CD\u09B0\u09A4\u09BF\u0995\u09CD\u09B0\u09BF\u09DF\u09BE \u0986\u099B\u09C7\u0964\n\n### \u09E8. \u09AE\u09BE\u09A8\u09AC \u09B0\u0995\u09CD\u09A4 \u09B8\u0982\u09AC\u09B9\u09A8 (Human Blood Group):\n* **\u0938\u0930\u094D\u0935\u091C\u0928\u09C0\u09A8 \u0926\u0924\u093E (Universal Donor):** O Negative (O-)\n* **\u0938\u0930\u094D\u0935\u091C\u0928\u09C0\u09A8 \u0917\u094D\u0930\u0939\u0940\u09A4\u09BE (Universal Recipient):** AB Positive (AB+)",
          mcqs: [
            {
              question:
                "\u0995\u09CB\u09A8 \u09B0\u0995\u09CD\u09A4 \u0997\u09CD\u09B0\u09C1\u09AA\u0995\u09C7 \u09B8\u09B0\u09CD\u09AC\u099C\u09A8\u09C0\u09A8 \u09A6\u09BE\u09A4\u09BE \u09AC\u09B2\u09BE \u09B9\u09DF?",
              options: ["O-", "O+", "AB+", "A-"],
              correctAnswer: "O-",
              explanation:
                "O Negative \u09B0\u0995\u09CD\u09A4\u09C7\u09B0 \u0997\u09CD\u09B0\u09C1\u09AA\u09C7 \u0995\u09CB\u09A8\u09CB \u0985\u09CD\u09AF\u09BE\u09A8\u09CD\u099F\u09BF\u099C\u09C7\u09A8 \u09A5\u09BE\u0995\u09C7 \u09A8\u09BE, \u09A4\u09BE\u0987 \u098F\u099F\u09BF \u09AF\u09C7\u0995\u09CB\u09A8\u09CB \u09B0\u09CB\u0997\u09C0\u0995\u09C7 \u09A6\u09C7\u0993\u09DF\u09BE \u09AF\u09BE\u09DF\u0964",
            },
          ],
          month: "July 2026",
          timestamp: new Date().toISOString(),
        },
        {
          id: "pdfn-seed-history",
          subject: "history",
          title:
            "July 2026 - History: Ancient Bengal & Indian Freedom Movement Guide",
          introduction:
            "\u09AA\u09CD\u09B0\u09BE\u099A\u09C0\u09A8 \u09AC\u09BE\u0982\u09B2\u09BE\u09B0 \u09B6\u09BE\u09B8\u09A8 \u09AC\u09CD\u09AF\u09AC\u09B8\u09CD\u09A5\u09BE \u098F\u09AC\u0982 \u09B8\u09BF\u09AA\u09BE\u09B9\u09C0 \u09AC\u09BF\u09A6\u09CD\u09B0\u09CB\u09B9 \u09A5\u09C7\u0995\u09C7 \u09B6\u09C1\u09B0\u09C1 \u0995\u09B0\u09C7 \u09E7\u09EF\u09EA\u09ED \u09B8\u09BE\u09B2 \u09AA\u09B0\u09CD\u09AF\u09A8\u09CD\u09A4 \u09B8\u09CD\u09AC\u09BE\u09A7\u09C0\u09A8\u09A4\u09BE \u09B8\u0982\u0997\u09CD\u09B0\u09BE\u09AE\u09C7\u09B0 \u09B8\u09BE\u09B2\u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u09B8\u09BE\u09B0\u09B8\u0982\u0995\u09CD\u09B7\u09C7\u09AA\u0964",
          keyTopics: [
            "Mauryan & Gupta Rule",
            "Mughal Bengal",
            "Indian Independence Movement",
          ],
          theoryContent:
            "### \u09E7. \u09AA\u09CD\u09B0\u09BE\u099A\u09C0\u09A8 \u09AC\u09BE\u0982\u09B2\u09BE\u09B0 \u0987\u09A4\u09BF\u09B9\u09BE\u09B8:\n* \u09AA\u09CD\u09B0\u09A5\u09AE \u09B8\u09CD\u09AC\u09BE\u09A7\u09C0\u09A8 \u09A8\u09B0\u09AA\u09A4\u09BF \u09AC\u09BE \u09B0\u09BE\u099C\u09BE \u099B\u09BF\u09B2\u09C7\u09A8 **\u09B6\u09B6\u09BE\u0999\u09CD\u0995** (\u09AF\u09BE\u09B0 \u09B0\u09BE\u099C\u09A7\u09BE\u09A8\u09C0 \u099B\u09BF\u09B2 \u0995\u09B0\u09CD\u09A3\u09B8\u09C1\u09AC\u09B0\u09CD\u09A3)\u0964\n* \u09AA\u09BE\u09B2 \u09AC\u0982\u09B6\u09C7\u09B0 \u09AA\u09CD\u09B0\u09A4\u09BF\u09B7\u09CD\u09A0\u09BE\u09A4\u09BE \u099B\u09BF\u09B2\u09C7\u09A8 **\u0997\u09CB\u09AA\u09BE\u09B2**, \u09AF\u09BF\u09A8\u09BF \u09AC\u09BE\u0982\u09B2\u09BE\u09DF \u09AA\u09CD\u09B0\u09A5\u09AE \u0997\u09A3\u09A4\u09BE\u09A8\u09CD\u09A4\u09CD\u09B0\u09BF\u0995 \u09AA\u09A6\u09CD\u09A7\u09A4\u09BF\u09A4\u09C7 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u09B0\u09BE\u099C\u09BE \u099B\u09BF\u09B2\u09C7\u09A8\u0964\n\n### \u09E8. \u09AD\u09BE\u09B0\u09A4\u09C7\u09B0 \u09B8\u09CD\u09AC\u09BE\u09A7\u09C0\u09A8\u09A4\u09BE \u09B8\u0982\u0997\u09CD\u09B0\u09BE\u09AE (\u09E7\u09EE\u09EB\u09ED - \u09E7\u09EF\u09EA\u09ED):\n* **\u09E7\u09EE\u09EB\u09ED:** \u09B8\u09BF\u09AA\u09BE\u09B9\u09C0 \u09AC\u09BF\u09A6\u09CD\u09B0\u09CB\u09B9 (\u09AE\u0999\u09CD\u0997\u09B2 \u09AA\u09BE\u09A8\u09CD\u09A1\u09C7 \u09AA\u09CD\u09B0\u09A5\u09AE \u09B6\u09B9\u09C0\u09A6 \u09B9\u09A8)\u0964\n* **\u09E7\u09EF\u09E6\u09EB:** \u09AC\u0999\u09CD\u0997\u09AD\u0999\u09CD\u0997 (\u09B2\u09B0\u09CD\u09A1 \u0995\u09BE\u09B0\u09CD\u099C\u09A8 \u09A6\u09CD\u09AC\u09BE\u09B0\u09BE)\u0964\n* **\u09E7\u09EF\u09E7\u09E7:** \u09AC\u0999\u09CD\u0997\u09AD\u0999\u09CD\u0997 \u09B0\u09A6 (\u09B2\u09B0\u09CD\u09A1 \u09B9\u09BE\u09B0\u09CD\u09A1\u09BF\u099E\u09CD\u099C \u09A6\u09CD\u09AC\u09BE\u09B0\u09BE)\u0964\n* **\u09E7\u09EF\u09EA\u09E8:** \u09AD\u09BE\u09B0\u09A4 \u099B\u09BE\u09DC\u09CB \u0986\u09A8\u09CD\u09A6\u09CB\u09B2\u09A8\u0964\n* **\u09E7\u09EF\u09EA\u09ED:** \u09AD\u09BE\u09B0\u09A4 \u0993 \u09AA\u09BE\u0995\u09BF\u09B8\u09CD\u09A4\u09BE\u09A8\u09C7\u09B0 \u09B8\u09CD\u09AC\u09BE\u09A7\u09C0\u09A8\u09A4\u09BE \u09B2\u09BE\u09AD\u0964",
          mcqs: [
            {
              question:
                "\u09AC\u09BE\u0982\u09B2\u09BE\u09B0 \u09AA\u09CD\u09B0\u09A5\u09AE \u09B8\u09CD\u09AC\u09BE\u09A7\u09C0\u09A8 \u0993 \u09B8\u09BE\u09B0\u09CD\u09AC\u09AD\u09CC\u09AE \u09B0\u09BE\u099C\u09BE \u0995\u09C7 \u099B\u09BF\u09B2\u09C7\u09A8?",
              options: [
                "\u09B6\u09B6\u09BE\u0999\u09CD\u0995",
                "\u0997\u09CB\u09AA\u09BE\u09B2",
                "\u09A7\u09B0\u09CD\u09AE\u09AA\u09BE\u09B2",
                "\u09B2\u0995\u09CD\u09B7\u09A3 \u09B8\u09C7\u09A8",
              ],
              correctAnswer: "\u09B6\u09B6\u09BE\u0999\u09CD\u0995",
              explanation:
                "\u09B0\u09BE\u099C\u09BE \u09B6\u09B6\u09BE\u0999\u09CD\u0995 \u09B8\u09AA\u09CD\u09A4\u09AE \u09B6\u09A4\u09BE\u09AC\u09CD\u09A6\u09C0\u09B0 \u09B6\u09C1\u09B0\u09C1\u09A4\u09C7 \u09AA\u09CD\u09B0\u09BE\u099A\u09C0\u09A8 \u09AC\u09BE\u0982\u09B2\u09BE\u09B0 \u0997\u09CC\u09A1\u09BC \u09B0\u09BE\u099C\u09CD\u09AF\u09C7\u09B0 \u09AA\u09CD\u09B0\u09A5\u09AE \u09B8\u09CD\u09AC\u09BE\u09A7\u09C0\u09A8 \u0993 \u09B8\u09BE\u09B0\u09CD\u09AC\u09AD\u09CC\u09AE \u09B6\u09BE\u09B8\u0995 \u099B\u09BF\u09B2\u09C7\u09A8\u0964",
            },
          ],
          month: "July 2026",
          timestamp: new Date().toISOString(),
        },
        {
          id: "pdfn-seed-geography",
          subject: "geography",
          title:
            "July 2026 - Geography: Physical Geography of Bengal & River Systems",
          introduction:
            "\u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6 \u0993 \u09AD\u09BE\u09B0\u09A4\u09C7\u09B0 \u09AD\u09CC\u0997\u09CB\u09B2\u09BF\u0995 \u0985\u09AC\u09B8\u09CD\u09A5\u09BE\u09A8, \u09AD\u09C2\u09AA\u09CD\u09B0\u0995\u09C3\u09A4\u09BF, \u09A8\u09A6\u09A8\u09A6\u09C0 \u098F\u09AC\u0982 \u099C\u09B2\u09AC\u09BE\u09AF\u09BC\u09C1 \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8 \u09B8\u0982\u0995\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4 \u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC\u09AA\u09C2\u09B0\u09CD\u09A3 \u09A4\u09A5\u09CD\u09AF\u09BE\u09AC\u09B2\u09C0\u0964",
          keyTopics: [
            "Geographical Boundaries",
            "River Systems of Bengal",
            "Natural Disasters",
          ],
          theoryContent:
            "### \u09E7. \u09AC\u09BE\u0982\u09B2\u09BE\u09B0 \u09AD\u09CC\u0997\u09CB\u09B2\u09BF\u0995 \u0985\u09AC\u09B8\u09CD\u09A5\u09BE\u09A8 \u0993 \u09B8\u09C0\u09AE\u09BE\u09A8\u09BE:\n* \u09AC\u09BE\u0982\u09B2\u09BE\u09B0 \u0989\u09AA\u09B0 \u09A6\u09BF\u09DF\u09C7 **\u0995\u09B0\u09CD\u0995\u099F\u0995\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4\u09BF \u09B0\u09C7\u0996\u09BE (Tropic of Cancer)** \u0985\u09A4\u09BF\u09AC\u09BE\u09B9\u09BF\u09A4 \u09B9\u09DF\u09C7\u099B\u09C7\u0964\n* \u09AA\u09C3\u09A5\u09BF\u09AC\u09C0\u09B0 \u09A6\u09C0\u09B0\u09CD\u0998\u09A4\u09AE \u09B8\u09AE\u09C1\u09A6\u09CD\u09B0 \u09B8\u09C8\u0995\u09A4 **\u0995\u0995\u09CD\u09B8\u09AC\u09BE\u099C\u09BE\u09B0** \u098F\u09AC\u0982 \u09AC\u09C3\u09B9\u09A4\u09CD\u09A4\u09AE \u09AE\u09CD\u09AF\u09BE\u09A8\u0997\u09CD\u09B0\u09CB\u09AD \u09AC\u09A8 **\u09B8\u09C1\u09A8\u09CD\u09A6\u09B0\u09AC\u09A8** \u09AC\u09BE\u0982\u09B2\u09BE\u09DF \u0985\u09AC\u09B8\u09CD\u09A5\u09BF\u09A4\u0964\n\n### \u09E8. \u09A8\u09A6\u09A8\u09A6\u09C0 \u0993 \u0989\u09AA\u09A8\u09A6\u09C0:\n* \u09AA\u09A6\u09CD\u09AE\u09BE \u09A8\u09A6\u09C0 \u09AD\u09BE\u09B0\u09A4\u09C7 **\u0997\u0999\u09CD\u0997\u09BE** \u09A8\u09BE\u09AE\u09C7 \u09AA\u09B0\u09BF\u099A\u09BF\u09A4\u0964 \u098F\u099F\u09BF \u099A\u09BE\u0981\u09AA\u09BE\u0987\u09A8\u09AC\u09BE\u09AC\u0997\u099E\u09CD\u099C \u09A6\u09BF\u09DF\u09C7 \u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6\u09C7 \u09AA\u09CD\u09B0\u09AC\u09C7\u09B6 \u0995\u09B0\u09C7\u099B\u09C7\u0964\n* \u09AC\u09CD\u09B0\u09B9\u09CD\u09AE\u09AA\u09C1\u09A4\u09CD\u09B0 \u09A8\u09A6 \u0995\u09C1\u09DC\u09BF\u0997\u09CD\u09B0\u09BE\u09AE \u099C\u09C7\u09B2\u09BE\u09B0 \u09AE\u09A7\u09CD\u09AF \u09A6\u09BF\u09DF\u09C7 \u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6\u09C7 \u09AA\u09CD\u09B0\u09AC\u09C7\u09B6 \u0995\u09B0\u09C7 \u09AA\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0\u09A4\u09C7 \u09AF\u09AE\u09C1\u09A8\u09BE \u09A8\u09BE\u09AE\u09C7 \u09AA\u09CD\u09B0\u09AC\u09BE\u09B9\u09BF\u09A4 \u09B9\u09DF\u09C7\u099B\u09C7\u0964",
          mcqs: [
            {
              question:
                "\u0995\u09B0\u09CD\u0995\u099F\u0995\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4\u09BF \u09B0\u09C7\u0996\u09BE \u09AC\u09BE\u0982\u09B2\u09BE\u09B0 \u0995\u09CB\u09A8 \u0985\u0982\u09B6\u09C7\u09B0 \u0989\u09AA\u09B0 \u09A6\u09BF\u09DF\u09C7 \u0997\u09BF\u09DF\u09C7\u099B\u09C7?",
              options: [
                "\u09A0\u09BF\u0995 \u09AE\u09BE\u099D\u0996\u09BE\u09A8 \u09A6\u09BF\u09DF\u09C7",
                "\u0989\u09A4\u09CD\u09A4\u09B0\u09BE\u099E\u09CD\u099A\u09B2 \u09A6\u09BF\u09DF\u09C7",
                "\u09A6\u0995\u09CD\u09B7\u09BF\u09A3\u09BE\u099E\u09CD\u099A\u09B2 \u09A6\u09BF\u09DF\u09C7",
                "\u09B8\u09C0\u09AE\u09BE\u09A8\u09CD\u09A4\u09AC\u09B0\u09CD\u09A4\u09C0 \u098F\u09B2\u09BE\u0995\u09BE \u09A6\u09BF\u09DF\u09C7",
              ],
              correctAnswer:
                "\u09A0\u09BF\u0995 \u09AE\u09BE\u099D\u0996\u09BE\u09A8 \u09A6\u09BF\u09DF\u09C7",
              explanation:
                "\u09E8\u09E9.\u09EB \u09A1\u09BF\u0997\u09CD\u09B0\u09BF \u0989\u09A4\u09CD\u09A4\u09B0 \u0985\u0995\u09CD\u09B7\u09BE\u0982\u09B6 \u09AC\u09BE \u0995\u09B0\u09CD\u0995\u099F\u0995\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4\u09BF \u09B0\u09C7\u0996\u09BE \u09AC\u09BE\u0982\u09B2\u09BE\u09B0 (\u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6 \u0993 \u09AA\u09B6\u09CD\u099A\u09BF\u09AE\u09AC\u0999\u09CD\u0997) \u09AA\u09CD\u09B0\u09BE\u09DF \u09AE\u09BE\u099D\u0996\u09BE\u09A8 \u09A6\u09BF\u09DF\u09C7 \u09AA\u09CD\u09B0\u09AC\u09BE\u09B9\u09BF\u09A4 \u09B9\u09DF\u09C7\u099B\u09C7\u0964",
            },
          ],
          month: "July 2026",
          timestamp: new Date().toISOString(),
        },
        {
          id: "pdfn-seed-polity",
          subject: "polity",
          title:
            "July 2026 - Constitution & Polity: Fundamental Rights & Judicial Review",
          introduction:
            "\u09B8\u0982\u09AC\u09BF\u09A7\u09BE\u09A8\u09C7\u09B0 \u09AA\u09CD\u09B0\u09A7\u09BE\u09A8 \u09AC\u09C8\u09B6\u09BF\u09B7\u09CD\u099F\u09CD\u09AF\u09B8\u09AE\u09C2\u09B9, \u09AE\u09CC\u09B2\u09BF\u0995 \u0985\u09A7\u09BF\u0995\u09BE\u09B0, \u098F\u09AC\u0982 \u09B8\u09B0\u0995\u09BE\u09B0\u09BF \u09A8\u09C0\u09A4\u09BF \u09A8\u09BF\u09B0\u09CD\u09A7\u09BE\u09B0\u09A3\u09C7\u09B0 \u09AE\u09C2\u09B2 \u0989\u09CE\u09B8\u09B8\u09AE\u09C2\u09B9 \u09B8\u09B9\u099C \u09AD\u09BE\u09B7\u09BE\u09DF \u0986\u09B2\u09CB\u099A\u09A8\u09BE\u0964",
          keyTopics: [
            "Preamble & Structure",
            "Fundamental Rights",
            "Directive Principles",
          ],
          theoryContent:
            "### \u09E7. \u09B8\u0982\u09AC\u09BF\u09A7\u09BE\u09A8\u09C7\u09B0 \u0995\u09BE\u09A0\u09BE\u09AE\u09CB:\n* \u09B8\u0982\u09AC\u09BF\u09A7\u09BE\u09A8 \u09B9\u09B2\u09CB \u09B0\u09BE\u09B7\u09CD\u099F\u09CD\u09B0\u09C7\u09B0 \u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u0986\u0987\u09A8\u0964\n* \u09AE\u09C2\u09B2 \u09B8\u0982\u09AC\u09BF\u09A7\u09BE\u09A8\u09C7 \u09A8\u09BE\u0997\u09B0\u09BF\u0995\u09A6\u09C7\u09B0 \u09AE\u09CC\u09B2\u09BF\u0995 \u0985\u09A7\u09BF\u0995\u09BE\u09B0\u0997\u09C1\u09B2\u09CB \u09B8\u09C1\u09A8\u09BF\u09B0\u09CD\u09A6\u09BF\u09B7\u09CD\u099F\u09AD\u09BE\u09AC\u09C7 \u09AC\u09B0\u09CD\u09A3\u09A8\u09BE \u0995\u09B0\u09BE \u09A5\u09BE\u0995\u09C7\u0964\n\n### \u09E8. \u09AE\u09CC\u09B2\u09BF\u0995 \u0985\u09A7\u09BF\u0995\u09BE\u09B0\u09B8\u09AE\u09C2\u09B9 (Fundamental Rights):\n* \u0986\u0987\u09A8 \u09AC\u09BE \u0986\u09A6\u09BE\u09B2\u09A4\u09C7\u09B0 \u09AE\u09BE\u09A7\u09CD\u09AF\u09AE\u09C7 \u09AE\u09CC\u09B2\u09BF\u0995 \u0985\u09A7\u09BF\u0995\u09BE\u09B0 \u09AA\u09CD\u09B0\u09DF\u09CB\u0997 \u0995\u09B0\u09BE \u09AF\u09BE\u09DF\u0964\n* \u09B0\u09BE\u09B7\u09CD\u099F\u09CD\u09B0\u09C7\u09B0 \u099C\u09B0\u09C1\u09B0\u09BF \u0985\u09AC\u09B8\u09CD\u09A5\u09BE\u09DF \u09A8\u09BE\u0997\u09B0\u09BF\u0995 \u0985\u09A7\u09BF\u0995\u09BE\u09B0 \u09B8\u09BE\u09AE\u09DF\u09BF\u0995\u09AD\u09BE\u09AC\u09C7 \u09B8\u09CD\u09A5\u0997\u09BF\u09A4 \u0995\u09B0\u09BE \u09B9\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u0964",
          mcqs: [
            {
              question:
                "\u0995\u09CB\u09A8\u09CB \u09A6\u09C7\u09B6\u09C7\u09B0 \u09B8\u0982\u09AC\u09BF\u09A7\u09BE\u09A8\u09C7\u09B0 \u09AA\u09CD\u09B0\u09A7\u09BE\u09A8 \u0995\u09BE\u099C \u0995\u09C0?",
              options: [
                "\u09B8\u09B0\u0995\u09BE\u09B0 \u0993 \u099C\u09A8\u0997\u09A3\u09C7\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u0995\u09CD\u09B7\u09AE\u09A4\u09BE\u09B0 \u09AD\u09BE\u09B0\u09B8\u09BE\u09AE\u09CD\u09AF \u09AC\u099C\u09BE\u09DF \u09B0\u09BE\u0996\u09BE \u0993 \u09B0\u09BE\u09B7\u09CD\u099F\u09CD\u09B0 \u09AA\u09B0\u09BF\u099A\u09BE\u09B2\u09A8\u09BE \u0995\u09B0\u09BE",
                " his/her basic tax",
                " can_be_applied",
                "\u09AC\u09BF\u099A\u09BE\u09B0\u0995\u09A6\u09C7\u09B0 \u09AC\u09C7\u09A4\u09A8 \u09A8\u09BF\u09B0\u09CD\u09A7\u09BE\u09B0\u09A3 \u0995\u09B0\u09BE",
              ],
              correctAnswer:
                "\u09B8\u09B0\u0995\u09BE\u09B0 \u0993 \u099C\u09A8\u0997\u09A3\u09C7\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u0995\u09CD\u09B7\u09AE\u09A4\u09BE\u09B0 \u09AD\u09BE\u09B0\u09B8\u09BE\u09AE\u09CD\u09AF \u09AC\u099C\u09BE\u09DF \u09B0\u09BE\u0996\u09BE \u0993 \u09B0\u09BE\u09B7\u09CD\u099F\u09CD\u09B0 \u09AA\u09B0\u09BF\u099A\u09BE\u09B2\u09A8\u09BE \u0995\u09B0\u09BE",
              explanation:
                "\u09B8\u0982\u09AC\u09BF\u09A7\u09BE\u09A8 \u09B0\u09BE\u09B7\u09CD\u099F\u09CD\u09B0\u09C7\u09B0 \u09AE\u09CC\u09B2\u09BF\u0995 \u0986\u0987\u09A8 \u09AF\u09BE \u09B8\u09B0\u0995\u09BE\u09B0\u09C7\u09B0 \u0995\u09BE\u09A0\u09BE\u09AE\u09CB \u0993 \u09A8\u09BE\u0997\u09B0\u09BF\u0995\u09A6\u09C7\u09B0 \u0985\u09A7\u09BF\u0995\u09BE\u09B0\u09C7\u09B0 \u0997\u09CD\u09AF\u09BE\u09B0\u09BE\u09A8\u09CD\u099F\u09BF \u09A6\u09C7\u09DF\u0964",
            },
          ],
          month: "July 2026",
          timestamp: new Date().toISOString(),
        },
        {
          id: "pdfn-seed-economics",
          subject: "economics",
          title:
            "July 2026 - Economics: National Income & Five-Year Planning Analysis",
          introduction:
            "\u099C\u09BF\u09A1\u09BF\u09AA\u09BF, \u099C\u09BF\u098F\u09A8\u09AA\u09BF \u098F\u09AC\u0982 \u09AA\u099E\u09CD\u099A\u09AC\u09BE\u09B0\u09CD\u09B7\u09BF\u0995 \u09AA\u09B0\u09BF\u0995\u09B2\u09CD\u09AA\u09A8\u09BE \u0993 \u09AC\u09BE\u099C\u09C7\u099F \u09B8\u0982\u0995\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4 \u0985\u09B0\u09CD\u09A5\u09A8\u09C8\u09A4\u09BF\u0995 \u099C\u099F\u09BF\u09B2 \u09B6\u09AC\u09CD\u09A6\u09B8\u09AE\u09C2\u09B9\u09C7\u09B0 \u09B8\u09B9\u099C \u09AC\u09BF\u09B6\u09CD\u09B2\u09C7\u09B7\u09A3\u0964",
          keyTopics: [
            "National Income (GDP, GNP)",
            "Inflation & Banking",
            "Five-Year Plans",
          ],
          theoryContent:
            "### \u09E7. \u099C\u09BE\u09A4\u09C0\u09DF \u0986\u09DF \u09AA\u09B0\u09BF\u09AE\u09BE\u09AA\u09C7\u09B0 \u0989\u09AA\u09BE\u09A6\u09BE\u09A8:\n* **GDP (Gross Domestic Product):** \u098F\u0995\u099F\u09BF \u09A6\u09C7\u09B6\u09C7\u09B0 \u09AD\u09CC\u0997\u09CB\u09B2\u09BF\u0995 \u09B8\u09C0\u09AE\u09BE\u09A8\u09BE\u09B0 \u09AD\u09BF\u09A4\u09B0\u09C7 \u0989\u09CE\u09AA\u09BE\u09A6\u09BF\u09A4 \u09AE\u09CB\u099F \u09AA\u09A3\u09CD\u09AF \u0993 \u09B8\u09C7\u09AC\u09BE\u09B0 \u09AE\u09C2\u09B2\u09CD\u09AF\u0964\n* **GNP (Gross National Product):** \u09A6\u09C7\u09B6\u09C7\u09B0 \u09A8\u09BE\u0997\u09B0\u09BF\u0995\u09A6\u09C7\u09B0 \u0989\u09CE\u09AA\u09BE\u09A6\u09BF\u09A4 \u09AE\u09CB\u099F \u09AA\u09A3\u09CD\u09AF \u0993 \u09B8\u09C7\u09AC\u09BE (\u09A6\u09C7\u09B6 \u098F\u09AC\u0982 \u09AC\u09BF\u09A6\u09C7\u09B6\u09C7)\u0964\n\n### \u09E8. \u09AE\u09C1\u09A6\u09CD\u09B0\u09BE\u09B8\u09CD\u09AB\u09C0\u09A4\u09BF (Inflation):\n* \u09AC\u09BE\u099C\u09BE\u09B0\u09C7 \u09AE\u09C1\u09A6\u09CD\u09B0\u09BE\u09B0 \u09B8\u09B0\u09AC\u09B0\u09BE\u09B9 \u09AC\u09C7\u09DC\u09C7 \u0997\u09C7\u09B2\u09C7 \u09AA\u09A3\u09CD\u09AF\u09C7\u09B0 \u09A6\u09BE\u09AE \u09AC\u09BE\u09DC\u09C7 \u098F\u09AC\u0982 \u099F\u09BE\u0995\u09BE\u09B0 \u09AE\u09BE\u09A8 \u0995\u09AE\u09C7 \u09AF\u09BE\u09DF, \u098F\u0995\u09C7 \u09AE\u09C1\u09A6\u09CD\u09B0\u09BE\u09B8\u09CD\u09AB\u09C0\u09A4\u09BF \u09AC\u09B2\u09C7\u0964",
          mcqs: [
            {
              question:
                "GDP \u098F\u09AC\u0982 GNP \u098F\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u09AA\u09CD\u09B0\u09A7\u09BE\u09A8 \u09AA\u09BE\u09B0\u09CD\u09A5\u0995\u09CD\u09AF \u0995\u09C0?",
              options: [
                "\u09AD\u09CC\u0997\u09CB\u09B2\u09BF\u0995 \u09B8\u09C0\u09AE\u09BE\u09A8\u09BE \u09AC\u09A8\u09BE\u09AE \u09A8\u09BE\u0997\u09B0\u09BF\u0995\u09A4\u09CD\u09AC \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u0989\u09CE\u09AA\u09BE\u09A6\u09A8",
                " can_be_applied",
                "\u0986\u09AE\u09A6\u09BE\u09A8\u09BF \u0993 \u09B0\u09AA\u09CD\u09A4\u09BE\u09A8\u09BF\u09B0 \u0985\u09A8\u09C1\u09AA\u09BE\u09A4",
                "\u0995\u09CB\u09A8\u09CB \u09AA\u09BE\u09B0\u09CD\u09A5\u0995\u09CD\u09AF \u09A8\u09C7\u0987",
              ],
              correctAnswer:
                "\u09AD\u09CC\u0997\u09CB\u09B2\u09BF\u0995 \u09B8\u09C0\u09AE\u09BE\u09A8\u09BE \u09AC\u09A8\u09BE\u09AE \u09A8\u09BE\u0997\u09B0\u09BF\u0995\u09A4\u09CD\u09AC \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u0989\u09CE\u09AA\u09BE\u09A6\u09A8",
              explanation:
                "GDP \u0997\u09A3\u09A8\u09BE \u0995\u09B0\u09BE \u09B9\u09DF \u09AD\u09CC\u0997\u09CB\u09B2\u09BF\u0995 \u09B8\u09C0\u09AE\u09BE\u09A8\u09BE\u09B0 \u09AD\u09C7\u09A4\u09B0\u09C7\u09B0 \u0989\u09CE\u09AA\u09BE\u09A6\u09A8\u09C7\u09B0 \u0993\u09AA\u09B0 \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF \u0995\u09B0\u09C7, \u0986\u09B0 GNP \u09A6\u09C7\u09B6\u09C7\u09B0 \u09B8\u0995\u09B2 \u09A8\u09BE\u0997\u09B0\u09BF\u0995\u09C7\u09B0 \u09AE\u09CB\u099F \u0986\u09DF\u09C7\u09B0 \u0993\u09AA\u09B0 \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF \u0995\u09B0\u09C7\u0964",
            },
          ],
          month: "July 2026",
          timestamp: new Date().toISOString(),
        },
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
__name(startServer, "startServer");
startServer();
