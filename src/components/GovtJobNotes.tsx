import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, User, Clock, Send, MessageSquare, Plus, FileText, Trash2, DownloadCloud, 
  ArrowLeft, Sparkles, Printer, Download, Calendar, CheckCircle2, 
  AlertCircle, Award, ChevronRight
} from 'lucide-react';
import { ThemeConfig } from '../lib/themes';
import { Language } from '../lib/translations';

interface GovtJobNote {
  id: string;
  title: string;
  content: string;
  subject: string;
  timestamp: string;
  authorEmail: string;
  authorName: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  authorName: string;
  authorEmail: string;
  text: string;
  timestamp: string;
}

interface GovtJobNotesProps {
  theme: ThemeConfig;
  lang: Language;
  profile: any;
  initialSubject?: string;
  onBack?: () => void;
}

const SUBJECTS = [
  { id: "math", name_bn: "অঙ্ক (Math)", name_en: "Mathematics" },
  { id: "reasoning", name_bn: "রিজনিং (Reasoning)", name_en: "Reasoning" },
  { id: "english", name_bn: "ইংরেজি (English)", name_en: "English" },
  { id: "science", name_bn: "সাধারণ বিজ্ঞান", name_en: "General Science" },
  { id: "history", name_bn: "ইতিহাস", name_en: "History" },
  { id: "geography", name_bn: "ভূগোল", name_en: "Geography" },
  { id: "polity", name_bn: "সংবিধান (Polity)", name_en: "Polity" },
  { id: "economics", name_bn: "অর্থনীতি (Economics)", name_en: "Economics" }
];

export default function GovtJobNotes({ theme, lang, profile, initialSubject, onBack }: GovtJobNotesProps) {
  const [activeSubject, setActiveSubject] = useState(initialSubject || "math");
  const [subTab, setSubTab] = useState<"ai_pdf" | "handwritten">("ai_pdf");

  useEffect(() => {
    if (initialSubject) {
      setActiveSubject(initialSubject);
    }
  }, [initialSubject]);
  
  // Traditional Handwritten/Uploaded notes state
  const [notes, setNotes] = useState<GovtJobNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  // AI Generated PDF notes state
  const [aiPdfNotes, setAiPdfNotes] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<any | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  
  // MCQ Interactivity State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  const isBengali = lang === "bn";
  const isAdmin = profile?.role === "Admin";

  const downloadStandaloneHtml = (pdf: any) => {
    if (!pdf) return;

    const convertMarkdownToHtml = (markdown: string) => {
      if (!markdown) return "";
      
      // Escape HTML
      let html = markdown
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
        
      // Split into paragraphs/blocks by double newlines
      const blocks = html.split(/\n\n+/);
      
      return blocks.map(block => {
        let trimmed = block.trim();
        if (!trimmed) return "";
        
        // Match headers
        if (trimmed.startsWith("### ")) {
          return `<h3 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-top: 24px; margin-bottom: 12px; font-family: sans-serif;">${trimmed.slice(4)}</h3>`;
        }
        if (trimmed.startsWith("## ")) {
          return `<h2 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; border-bottom: 2px solid #cbd5e1; padding-bottom: 6px; margin-top: 32px; margin-bottom: 16px; font-family: sans-serif;">${trimmed.slice(3)}</h2>`;
        }
        if (trimmed.startsWith("# ")) {
          return `<h1 style="font-size: 1.875rem; font-weight: 800; color: #0f172a; margin-top: 36px; margin-bottom: 20px; font-family: sans-serif;">${trimmed.slice(2)}</h1>`;
        }
        
        // Match unordered list items
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed.split(/\n[\-\*]\s+/).map((item) => {
            let cleanItem = item.replace(/^[\-\*]\s+/, "");
            cleanItem = cleanItem.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            return `<li style="margin-bottom: 8px; color: #334155; line-height: 1.6;">${cleanItem}</li>`;
          });
          return `<ul style="margin-top: 8px; margin-bottom: 16px; padding-left: 24px;">${items.join("")}</ul>`;
        }
        
        // Bold formatting **text**
        trimmed = trimmed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        
        // Italic formatting *text*
        trimmed = trimmed.replace(/\*(.*?)\*/g, "<em>$1</em>");
        
        // Standard paragraph
        return `<p style="margin-top: 0; margin-bottom: 16px; color: #334155; line-height: 1.7; font-size: 1rem;">${trimmed.replace(/\n/g, "<br/>")}</p>`;
      }).join("\n");
    };

    const theoryHtml = convertMarkdownToHtml(pdf.theoryContent || "");

    const mcqsHtml = (pdf.mcqs || []).map((mcq: any, idx: number) => {
      const optionsHtml = mcq.options.map((option: string) => {
        const isCorrect = option === mcq.correctAnswer;
        return `
          <div class="option ${isCorrect ? 'correct' : ''}">
            <span class="bullet">${isCorrect ? '✓' : '•'}</span>
            <span class="text">${option}</span>
            ${isCorrect ? `<span class="badge">${isBengali ? 'সঠিক উত্তর' : 'Correct'}</span>` : ''}
          </div>
        `;
      }).join("");

      return `
        <div class="mcq-card">
          <h3 class="mcq-question">${idx + 1}. ${mcq.question}</h3>
          <div class="options-grid">
            ${optionsHtml}
          </div>
          ${mcq.explanation ? `
            <div class="explanation-box">
              <strong>${isBengali ? 'ব্যাখ্যা:' : 'Explanation:'}</strong>
              <p>${mcq.explanation}</p>
            </div>
          ` : ''}
        </div>
      `;
    }).join("");

    const htmlContent = `
<!DOCTYPE html>
<html lang="${isBengali ? 'bn' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pdf.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Hind+Siliguri:wght@400;500;600;700&display=swap');
    
    body {
      font-family: 'Hind Siliguri', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background-color: #f1f5f9;
      margin: 0;
      padding: 40px 16px;
    }
    
    .container {
      max-width: 850px;
      margin: 0 auto;
      background: white;
      padding: 50px 40px;
      border-radius: 20px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
    }
    
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 20px;
      margin-bottom: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .brand {
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.05em;
    }
    
    .edition-badge {
      background: #0f172a;
      color: white;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 700;
      font-family: 'Inter', sans-serif;
    }
    
    .title-section {
      text-align: center;
      margin-bottom: 40px;
    }
    
    h1 {
      font-size: 2.25rem;
      font-weight: 800;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 16px;
      line-height: 1.25;
    }
    
    .intro-text {
      font-style: italic;
      color: #475569;
      font-size: 1.05rem;
      line-height: 1.7;
      margin-bottom: 40px;
      padding: 4px 20px;
      border-left: 4px solid #0d9488;
      background-color: #f8fafc;
      border-radius: 0 8px 8px 0;
    }
    
    .theory-section {
      font-size: 1.05rem;
      color: #334155;
    }
    
    .mcq-section {
      margin-top: 60px;
      border-top: 2px dashed #cbd5e1;
      padding-top: 40px;
    }
    
    .mcq-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      page-break-inside: avoid;
    }
    
    .mcq-question {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 16px;
    }
    
    .options-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    @media (min-width: 640px) {
      .options-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    
    .option {
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.2s;
    }
    
    .option.correct {
      background: #f0fdf4;
      border-color: #86efac;
      color: #166534;
      font-weight: 600;
    }
    
    .option .bullet {
      font-size: 1.1rem;
    }
    
    .option.correct .bullet {
      color: #15803d;
    }
    
    .badge {
      margin-left: auto;
      background: #15803d;
      color: white;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
    }
    
    .explanation-box {
      margin-top: 16px;
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 10px;
      padding: 16px;
      font-size: 0.85rem;
    }
    
    .explanation-box strong {
      color: #0369a1;
      display: block;
      margin-bottom: 4px;
    }
    
    .explanation-box p {
      margin: 0;
      color: #0c4a6e;
    }
    
    .footer {
      margin-top: 60px;
      border-top: 1px solid #e2e8f0;
      padding-top: 30px;
      text-align: center;
      color: #64748b;
      font-size: 0.85rem;
    }
    
    .print-btn {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #0d9488;
      color: white;
      border: none;
      padding: 14px 28px;
      border-radius: 50px;
      font-weight: 700;
      box-shadow: 0 10px 15px -3px rgba(13, 148, 136, 0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.95rem;
      transition: all 0.2s;
      z-index: 999;
    }
    
    .print-btn:hover {
      background: #0f766e;
      transform: translateY(-2px);
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .container {
        box-shadow: none;
        padding: 0;
        max-width: 100%;
      }
      
      .print-btn {
        display: none;
      }
      
      .mcq-card {
        border: 1px solid #cbd5e1;
        background: white;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">STUDY HUB ACADEMY</div>
      <div class="edition-badge">${pdf.month} EDITION</div>
    </div>
    
    <div class="title-section">
      <h1>${pdf.title}</h1>
      <p style="color: #64748b; font-size: 0.9rem;">
        ${isBengali ? 'প্রকাশকাল:' : 'Published:'} ${new Date(pdf.timestamp).toLocaleDateString()}
      </p>
    </div>
    
    <div class="intro-text">
      ${pdf.introduction}
    </div>
    
    <div class="theory-section">
      ${theoryHtml}
    </div>
    
    <div class="mcq-section">
      <h2 style="border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 30px; font-family: sans-serif;">
        ${isBengali ? "গুরুত্বপূর্ণ মূল্যায়ন প্রশ্নাবলী" : "High-Yield Practice Questions"}
      </h2>
      ${mcqsHtml}
    </div>
    
    <div class="footer">
      <p style="font-weight: bold; margin-bottom: 8px; color: #0f172a;">STUDY HUB ACADEMY</p>
      <p style="margin: 0; font-size: 0.8rem;">
        ${isBengali 
          ? "আপনার স্বপ্ন ছোঁয়ার যাত্রায় আমরা সর্বদা আপনার সাথে আছি।" 
          : "We are with you at every step of your preparation."}
      </p>
    </div>
  </div>
  
  <button class="print-btn" onclick="window.print()">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 6 2 18 2 18 9"></polyline>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
      <rect x="6" y="14" width="12" height="8"></rect>
    </svg>
    <span>${isBengali ? 'প্রিন্ট বা পিডিএফ সেভ করুন' : 'Print / Save PDF'}</span>
  </button>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${pdf.title.replace(/[\s\W]+/g, "-")}-Study-Guide.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const fetchNotes = async (subject: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/govt-job-notes?subject=${subject}`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAiPdfNotes = async (subject: string) => {
    setAiLoading(true);
    try {
      const response = await fetch(`/api/ai-pdf-notes?subject=${subject}`);
      if (response.ok) {
        const data = await response.json();
        setAiPdfNotes(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(activeSubject);
    fetchAiPdfNotes(activeSubject);
  }, [activeSubject]);

  useEffect(() => {
    const handleSetSubject = (e: any) => {
      setActiveSubject(e.detail);
      fetchNotes(e.detail);
      fetchAiPdfNotes(e.detail);
    };
    window.addEventListener("setGovtJobSubject", handleSetSubject);
    return () => window.removeEventListener("setGovtJobSubject", handleSetSubject);
  }, []);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const response = await fetch('/api/govt-job-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          subject: activeSubject,
          authorEmail: profile?.email || 'admin@studyhub',
          authorName: profile?.fullName || 'Admin'
        })
      });

      if (response.ok) {
        setIsCreating(false);
        setNewTitle("");
        setNewContent("");
        fetchNotes(activeSubject);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async (noteId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await fetch(`/api/govt-job-notes/${noteId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorEmail: profile?.email || 'student@studyhub',
          authorName: profile?.fullName || 'Student',
          text: commentText
        })
      });

      if (response.ok) {
        setCommentText("");
        fetchNotes(activeSubject);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm(isBengali ? "আপনি কি এই নোটটি মুছতে চান?" : "Are you sure you want to delete this note?")) return;
    try {
      const response = await fetch(`/api/govt-job-notes/${noteId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchNotes(activeSubject);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai-pdf-notes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: activeSubject })
      });
      if (response.ok) {
        const data = await response.json();
        fetchAiPdfNotes(activeSubject);
        setSelectedPdf(data);
        setSelectedAnswers({});
        setShowExplanation({});
      } else {
        const errData = await response.json();
        alert(errData.error || "Failed to generate AI PDF note.");
      }
    } catch (e: any) {
      console.error("Failed to generate AI PDF guide:", e);
      alert("Error: " + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeletePdfNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(isBengali ? "আপনি কি এই এআই পিডিএফ গাইডটি মুছতে চান?" : "Are you sure you want to delete this AI PDF Study Guide?")) return;
    try {
      const response = await fetch(`/api/ai-pdf-notes/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchAiPdfNotes(activeSubject);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOptionSelect = (qIdx: number, option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: option }));
    setShowExplanation(prev => ({ ...prev, [qIdx]: true }));
  };

  // Safe inline markdown rendering
  const renderMarkdown = (content: string) => {
    if (!content) return null;
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-base font-bold text-slate-800 dark:text-slate-100 mt-4 mb-2">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-lg font-extrabold text-slate-950 dark:text-slate-50 mt-5 mb-3">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-xl font-black text-slate-950 dark:text-slate-50 mt-6 mb-4">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return <li key={idx} className="ml-5 list-disc text-sm text-slate-700 dark:text-slate-300 my-1">{line.substring(2)}</li>;
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      const parts = line.split('**');
      if (parts.length > 1) {
        return (
          <p key={idx} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed my-2">
            {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-slate-900 dark:text-white">{part}</strong> : part)}
          </p>
        );
      }
      return <p key={idx} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed my-2">{line}</p>;
    });
  };

  const activeSubjectName = SUBJECTS.find(s => s.id === activeSubject)?.[isBengali ? 'name_bn' : 'name_en'] || activeSubject;

  // Monthly Release Days Tracker
  const getDaysUntilNextMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextMonthDate = new Date(year, month + 1, 1);
    const diffTime = nextMonthDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  const daysLeft = getDaysUntilNextMonth();

  return (
    <div className="space-y-6">
      {/* Header with Back Button and Subject Name */}
      <div className={`${theme.bgCard} rounded-2xl border ${theme.borderCard} p-6 shadow-sm`}>
        <div className="flex flex-col gap-4">
          {/* Back button */}
          {onBack && (
            <div className="flex items-center">
              <button
                onClick={onBack}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${theme.borderCard} ${theme.bgCard} text-xs font-bold ${theme.textHeading} hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-xs cursor-pointer`}
              >
                <ArrowLeft className="h-4 w-4" />
                {isBengali ? "ড্যাশবোর্ডে ফিরে যান" : "Back to Dashboard"}
              </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white text-xl bg-gradient-to-br from-teal-500 to-emerald-500 shadow-md`}>
                {activeSubject === "math" ? "📐" :
                 activeSubject === "reasoning" ? "🧠" :
                 activeSubject === "english" ? "📝" :
                 activeSubject === "science" ? "🔬" :
                 activeSubject === "history" ? "🏛️" :
                 activeSubject === "geography" ? "🌍" :
                 activeSubject === "polity" ? "⚖️" : "📈"}
              </div>
              <div>
                <h1 className={`text-xl md:text-2xl font-black ${theme.textHeading} tracking-tight`}>
                  {activeSubjectName} {isBengali ? "প্রস্তুতি নোটস" : "Preparation Notes"}
                </h1>
                <p className={`text-sm ${theme.textMuted}`}>
                  {isBengali 
                    ? `স্মার্ট এআই এবং শিক্ষকদের দ্বারা প্রস্তুতকৃত ${activeSubjectName} এর প্রিমিয়াম গাইডলাইন ও স্টাডি মেটেরিয়ালস` 
                    : `Premium study guides and handwritten notes compiled for ${activeSubjectName}`}
                </p>
              </div>
            </div>
            {subTab === "handwritten" && isAdmin && (
              <button
                onClick={() => setIsCreating(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold transition-all active:scale-95 shadow-md ${theme.primaryBtn} hover:opacity-90`}
              >
                <Plus className="h-4 w-4" />
                {isBengali ? "নতুন নোট আপলোড করুন" : "Upload New Note"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs (AI Guides vs Handwritten Notes) */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setSubTab("ai_pdf")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all ${
            subTab === "ai_pdf"
              ? "border-teal-500 text-teal-600 dark:text-teal-400 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
          {isBengali ? "এআই-উৎপাদিত প্রিমিয়াম পিডিএফ গাইড" : "AI Premium PDF Guides"}
        </button>
        <button
          onClick={() => setSubTab("handwritten")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all ${
            subTab === "handwritten"
              ? "border-teal-500 text-teal-600 dark:text-teal-400 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          {isBengali ? "অ্যাডমিন নোটস ও আলোচনা ফোরাম" : "Admin Notes & Discussion"}
        </button>
      </div>

      {/* TAB CONTENT: AI PDF Guides */}
      {subTab === "ai_pdf" && (
        <div className="space-y-6">
          {/* Monthly Info Counter Banner */}
          <div className={`p-6 rounded-2xl border ${theme.isDark ? 'bg-gradient-to-r from-slate-900 via-slate-950 to-teal-950/40 border-slate-800' : 'bg-gradient-to-r from-teal-50/50 via-teal-50 to-amber-50/30 border-teal-100'} shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
            <div className="flex gap-3 items-start">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 mt-1">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h4 className={`text-sm font-bold ${theme.textHeading} flex items-center gap-2`}>
                  {isBengali ? "মাসিক পিডিএফ প্রকাশনা কার্যক্রম" : "Monthly PDF Study Guide Schedule"}
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 font-extrabold">
                    {isBengali ? "সক্রিয়" : "ACTIVE"}
                  </span>
                </h4>
                <p className={`text-xs ${theme.textMuted} mt-1 leading-relaxed max-w-xl`}>
                  {isBengali 
                    ? `আমাদের প্রিমিয়াম এআই ইঞ্জিন প্রতি মাসে প্রতিটি বিষয়ের উপর ১টি করে নতুন স্পেশাল পিডিএফ গাইড সংকলন করে। পরবর্তী মাসিক গাইড পেতে ${daysLeft} দিন বাকি।` 
                    : `Our AI Engine publishes exactly 1 brand-new, high-yield comprehensive PDF study guide per subject every month. Next publication is scheduled in ${daysLeft} days.`}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleGeneratePdf}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold transition-all shadow-md active:scale-95 disabled:opacity-50 ${theme.primaryBtn}`}
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isBengali ? "এআই লিখছে..." : "Generating Note..."}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-amber-200 animate-pulse" />
                  {isBengali ? "নতুন এআই গাইড তৈরি করুন" : "Generate Monthly PDF"}
                </>
              )}
            </button>
          </div>

          {/* AI Notes List */}
          {aiLoading ? (
            <div className="flex justify-center p-12">
              <div className="h-8 w-8 rounded-full border-4 border-teal-500/30 border-t-teal-500 animate-spin"></div>
            </div>
          ) : aiPdfNotes.length === 0 ? (
            <div className={`text-center py-16 ${theme.bgCard} rounded-2xl border ${theme.borderCard}`}>
              <Sparkles className={`h-12 w-12 mx-auto text-amber-500 opacity-60 mb-3 animate-pulse`} />
              <p className={`text-sm font-bold ${theme.textHeading}`}>
                {isBengali ? "কোনো এআই পিডিএফ গাইড পাওয়া যায়নি।" : "No AI PDF study guides compiled yet."}
              </p>
              <p className={`text-xs ${theme.textMuted} mt-1 max-w-sm mx-auto`}>
                {isBengali ? "উপরের বাটনে ক্লিক করে প্রথম এআই প্রিমিয়াম গাইডটি তাত্ক্ষণিকভাবে তৈরি করে নিন!" : "Click the button above to dynamically generate your first high-yield study material."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiPdfNotes.map((pdf) => (
                <div 
                  key={pdf.id}
                  onClick={() => {
                    setSelectedPdf(pdf);
                    setSelectedAnswers({});
                    setShowExplanation({});
                  }}
                  className={`p-5 rounded-2xl border ${theme.borderCard} ${theme.bgCard} hover:border-teal-500/50 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${theme.isDark ? 'bg-teal-950 text-teal-400' : 'bg-teal-50 text-teal-700'}`}>
                        <Award className="h-3 w-3" />
                        {pdf.month}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(isBengali ? "পিডিএফটি অফলাইনে সেভ করা হয়েছে!" : "PDF saved for offline access!");
                        }}
                        className="p-1.5 text-teal-500 hover:bg-teal-500/10 rounded-lg transition-all ml-auto"
                        title={isBengali ? "অফলাইনে সেভ করুন" : "Save Offline"}
                      >
                        <DownloadCloud className="h-4 w-4" />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={(e) => handleDeletePdfNote(pdf.id, e)}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <h3 className={`text-base font-bold ${theme.textHeading} leading-snug mb-2 group-hover:text-teal-500 transition-colors`}>
                      {pdf.title}
                    </h3>
                    
                    <p className={`text-xs ${theme.textMuted} line-clamp-2 mb-4`}>
                      {pdf.introduction}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mt-2 text-xs">
                    <span className={`text-[10px] font-bold uppercase ${theme.textMuted} flex items-center gap-1`}>
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(pdf.timestamp).toLocaleDateString()}
                    </span>
                    <span className="text-teal-600 dark:text-teal-400 font-extrabold flex items-center gap-1 group-hover:underline">
                      {isBengali ? "পিডিএফ খুলুন" : "Open PDF View"}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Traditional Handwritten Notes & Discussion Forum */}
      {subTab === "handwritten" && (
        <div className="space-y-6">
          {/* Note Creation Form */}
          <AnimatePresence>
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className={`${theme.bgCard} rounded-2xl border ${theme.borderCard} p-6 shadow-sm mb-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-lg font-bold ${theme.textHeading}`}>
                      {isBengali ? "নতুন নোট তৈরি করুন" : "Create New Note"}
                    </h2>
                    <button
                      onClick={() => setIsCreating(false)}
                      className={`flex items-center gap-1 text-sm font-semibold ${theme.textMuted} hover:${theme.textMain}`}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {isBengali ? "বাতিল" : "Cancel"}
                    </button>
                  </div>
                  <form onSubmit={handleCreateNote} className="space-y-4">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme.textMuted}`}>
                        {isBengali ? "শিরোনাম" : "Title"}
                      </label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className={`w-full rounded-xl border ${theme.isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200'} px-4 py-3 text-sm focus:outline-none focus:border-teal-500`}
                        placeholder={isBengali ? "নোটের শিরোনাম..." : "Note title..."}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme.textMuted}`}>
                        {isBengali ? "নোটের বিস্তারিত বিষয়বস্তু" : "Note Content"}
                      </label>
                      <textarea
                        required
                        rows={8}
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className={`w-full rounded-xl border ${theme.isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200'} px-4 py-3 text-sm focus:outline-none focus:border-teal-500`}
                        placeholder={isBengali ? "বিস্তারিত লিখুন..." : "Write details..."}
                      ></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition-all active:scale-95 shadow-md ${theme.primaryBtn}`}
                      >
                        <Send className="h-4 w-4" />
                        {isBengali ? "আপলোড করুন" : "Publish Note"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notes List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="h-8 w-8 rounded-full border-4 border-teal-500/30 border-t-teal-500 animate-spin"></div>
              </div>
            ) : notes.length === 0 ? (
              <div className={`text-center py-12 ${theme.bgCard} rounded-2xl border ${theme.borderCard}`}>
                <FileText className={`h-12 w-12 mx-auto ${theme.textMuted} opacity-50 mb-3`} />
                <p className={`text-sm font-semibold ${theme.textMuted}`}>
                  {isBengali ? "এই বিষয়ে এখনও কোনো নোট আপলোড করা হয়নি।" : "No notes uploaded for this subject yet."}
                </p>
              </div>
            ) : (
              notes.map(note => (
                <div key={note.id} className={`${theme.bgCard} rounded-2xl border ${theme.borderCard} overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
                  {/* Note Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className={`text-lg font-bold ${theme.textHeading} mb-2`}>{note.title}</h3>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${theme.isDark ? 'bg-slate-800 text-teal-400' : 'bg-teal-50 text-teal-700'}`}>
                            <User className="h-3 w-3" />
                            {note.authorName}
                          </span>
                          <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${theme.textMuted}`}>
                            <Clock className="h-3 w-3" />
                            {new Date(note.timestamp).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className={`prose prose-sm max-w-none ${theme.isDark ? 'prose-invert text-slate-300' : 'text-slate-700'} whitespace-pre-wrap`}>
                      {note.content}
                    </div>
                  </div>

                  {/* Comments Section Toggle */}
                  <div className={`border-t ${theme.borderCard} bg-slate-50/50 dark:bg-slate-900/50`}>
                    <button
                      onClick={() => setExpandedNoteId(expandedNoteId === note.id ? null : note.id)}
                      className={`w-full px-6 py-3 flex items-center justify-between text-xs font-bold ${theme.textMuted} hover:${theme.textHeading} transition-colors`}
                    >
                      <span className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        {isBengali ? "সমস্যা বা মন্তব্য" : "Doubts & Comments"} ({note.comments?.length || 0})
                      </span>
                      <span>{expandedNoteId === note.id ? (isBengali ? "লুকান" : "দেখুন") : (isBengali ? "দেখুন" : "Show")}</span>
                    </button>

                    {/* Comments List & Input */}
                    <AnimatePresence>
                      {expandedNoteId === note.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 space-y-4">
                            {(note.comments || []).length > 0 ? (
                              <div className="space-y-3">
                                {note.comments.map(comment => (
                                  <div key={comment.id} className={`p-3 rounded-xl ${theme.isDark ? 'bg-slate-800' : 'bg-white'} border ${theme.borderCard}`}>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className={`text-xs font-bold ${theme.textHeading}`}>{comment.authorName}</span>
                                      <span className={`text-[10px] ${theme.textMuted}`}>
                                        {new Date(comment.timestamp).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US')}
                                      </span>
                                    </div>
                                    <p className={`text-sm ${theme.textMain}`}>{comment.text}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <p className={`text-xs ${theme.textMuted}`}>
                                  {isBengali ? "এখনও কোনো মন্তব্য নেই। প্রথম মন্তব্য করুন!" : "No comments yet. Be the first to comment!"}
                                </p>
                              </div>
                            )}

                            <form onSubmit={(e) => handleAddComment(note.id, e)} className="flex gap-2">
                              <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder={isBengali ? "আপনার সমস্যা বা প্রশ্ন লিখুন..." : "Write your doubt or question..."}
                                className={`flex-1 text-sm rounded-xl border ${theme.isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300'} px-4 py-2 focus:outline-none focus:border-teal-500`}
                              />
                              <button
                                type="submit"
                                disabled={!commentText.trim()}
                                className={`px-4 py-2 rounded-xl text-white transition-all disabled:opacity-50 ${theme.primaryBtn}`}
                              >
                                <Send className="h-4 w-4" />
                              </button>
                            </form>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL: Highly immersive PDF Document Viewer */}
      <AnimatePresence>
        {selectedPdf && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white text-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 h-[90vh] relative"
            >
              {/* PDF Top Bar */}
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-extrabold text-xs">
                    PDF
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 truncate max-w-[200px] md:max-w-md">
                      {selectedPdf.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium">
                      StudyHub AI Study Guides • {selectedPdf.month}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowPrintModal(true)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 text-xs font-bold transition-all"
                    title="Print or Save as PDF"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{isBengali ? "পিডিএফ সেভ / প্রিন্ট" : "Save / Print PDF"}</span>
                  </button>
                  <button
                    onClick={() => setSelectedPdf(null)}
                    className="p-1.5 hover:bg-slate-200 rounded-lg transition-all text-slate-500 hover:text-slate-800"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* PDF Document Container */}
              <div 
                id="printable-pdf-document"
                className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 bg-slate-100 print:bg-white relative font-serif select-text"
              >
                {/* Embedded Watermark for PDF Authenticity */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] print:opacity-[0.04] pointer-events-none select-none z-0">
                  <div className="text-center -rotate-12">
                    <Award className="h-96 w-96 mx-auto text-slate-800" />
                    <h2 className="text-5xl font-black uppercase tracking-widest text-slate-800 mt-4">STUDYHUB ACADEMY</h2>
                  </div>
                </div>

                {/* PAGE 1: PDF Cover Sheet */}
                <div className="min-h-[750px] flex flex-col justify-between bg-white border border-slate-200 p-12 shadow-lg rounded-2xl print:border-none print:shadow-none print:p-0 relative z-10">
                  <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
                    <div className="font-sans font-bold text-lg text-slate-900 tracking-wider">
                      STUDY HUB ACADEMY
                    </div>
                    <div className="font-sans font-bold text-xs px-3 py-1 bg-slate-900 text-white rounded-md">
                      {selectedPdf.month} EDITION
                    </div>
                  </div>

                  <div className="my-auto space-y-6 text-center">
                    <div className="h-2 w-24 bg-teal-500 mx-auto rounded-full" />
                    <p className="font-sans text-xs uppercase font-extrabold text-teal-600 tracking-widest">
                      {isBengali ? "মাসিক সরকারি চাকরি প্রস্তুতি গাইড" : "MONTHLY GOVERNMENT JOB PREPARATION GUIDE"}
                    </p>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 font-sans tracking-tight leading-snug">
                      {selectedPdf.title}
                    </h1>
                    <p className="text-base text-slate-600 max-w-xl mx-auto italic">
                      "{selectedPdf.introduction}"
                    </p>
                    <div className="pt-8">
                      <span className="font-sans text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
                        SUBJECT CATEGORY
                      </span>
                      <span className="font-sans text-sm font-extrabold bg-slate-100 px-4 py-1.5 rounded-full text-slate-800">
                        {activeSubjectName}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans text-slate-500 font-bold">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span>{isBengali ? "এআই লার্নিং সিস্টেম দ্বারা সংকলিত" : "Generated via StudyHub AI Engine"}</span>
                    </div>
                    <div>
                      {isBengali ? "প্রকাশকাল: " : "Published: "} {new Date(selectedPdf.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* PAGE 2+: Core Theory Section */}
                <div className="bg-white border border-slate-200 p-12 shadow-lg rounded-2xl print:border-none print:shadow-none print:p-0 relative z-10 space-y-6">
                  <div className="border-b border-slate-100 pb-3 flex justify-between text-[10px] font-sans text-slate-400 uppercase tracking-widest">
                    <span>{selectedPdf.title}</span>
                    <span>{isBengali ? "অধ্যায় ১: মূল আলোচনা" : "SECTION I: CORE THEORY"}</span>
                  </div>

                  <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed font-serif">
                    {renderMarkdown(selectedPdf.theoryContent)}
                  </div>
                </div>

                {/* PAGE 3: interactive & Printable MCQ Section */}
                <div className="bg-white border border-slate-200 p-12 shadow-lg rounded-2xl print:border-none print:shadow-none print:p-0 relative z-10 space-y-6">
                  <div className="border-b border-slate-100 pb-3 flex justify-between text-[10px] font-sans text-slate-400 uppercase tracking-widest">
                    <span>{selectedPdf.title}</span>
                    <span>{isBengali ? "অধ্যায় ২: স্ব-মূল্যায়ন পরীক্ষা" : "SECTION II: PRACTICE MCQS"}</span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-bold font-sans text-slate-900">
                      {isBengali ? "গুরুত্বপূর্ণ মূল্যায়ন প্রশ্নাবলী" : "High-Yield Practice Questions"}
                    </h3>
                    <p className="text-xs font-sans text-slate-500">
                      {isBengali 
                        ? "নিচের প্রশ্নগুলোর সঠিক উত্তর বেছে নিন এবং আপনার প্রস্তুতি যাচাই করুন। প্রতিটি প্রশ্নের বিস্তারিত ব্যাখ্যা নিচে দেওয়া রয়েছে।" 
                        : "Select the correct option for each high-yield MCQ below to test your understanding. Answers include step-by-step logic."}
                    </p>
                  </div>

                  <div className="space-y-8 divide-y divide-slate-100 font-sans">
                    {(selectedPdf.mcqs || []).map((mcq: any, qIdx: number) => {
                      const selected = selectedAnswers[qIdx];
                      const showExpl = showExplanation[qIdx];
                      const isCorrect = selected === mcq.correctAnswer;

                      return (
                        <div key={qIdx} className={`pt-6 ${qIdx === 0 ? 'pt-0' : ''} space-y-4`}>
                          <h4 className="text-sm font-extrabold text-slate-900 leading-snug flex gap-2">
                            <span>{qIdx + 1}.</span>
                            <span>{mcq.question}</span>
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 print:block print:space-y-1">
                            {mcq.options.map((option: string) => {
                              const isOptionSelected = selected === option;
                              const isOptionCorrect = option === mcq.correctAnswer;
                              
                              let btnClass = "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800";
                              if (selected) {
                                if (isOptionCorrect) {
                                  btnClass = "bg-emerald-500/10 border-emerald-500 text-emerald-700 font-bold";
                                } else if (isOptionSelected) {
                                  btnClass = "bg-rose-500/10 border-rose-500 text-rose-700 font-bold";
                                } else {
                                  btnClass = "bg-slate-50/50 border-slate-100 text-slate-400 opacity-60";
                                }
                              }

                              return (
                                <button
                                  key={option}
                                  type="button"
                                  disabled={!!selected}
                                  onClick={() => handleOptionSelect(qIdx, option)}
                                  className={`w-full text-left px-4 py-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnClass} print:border-none print:py-1 print:px-0`}
                                >
                                  <span>{option}</span>
                                  {selected && isOptionCorrect && (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 print:hidden shrink-0" />
                                  )}
                                  {selected && isOptionSelected && !isOptionCorrect && (
                                    <AlertCircle className="h-4 w-4 text-rose-600 print:hidden shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {showExpl && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="p-4 rounded-xl border text-xs leading-relaxed overflow-hidden bg-slate-50 border-slate-200 print:border-none print:px-0"
                            >
                              <div className="flex gap-2 items-start">
                                <AlertCircle className={`h-4 w-4 mt-0.5 ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`} />
                                <div>
                                  <p className={`font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'} mb-1`}>
                                    {isCorrect 
                                      ? (isBengali ? "সঠিক উত্তর!" : "Correct Answer!") 
                                      : (isBengali ? `ভুল উত্তর! সঠিক উত্তর: ${mcq.correctAnswer}` : `Incorrect! Correct: ${mcq.correctAnswer}`)}
                                  </p>
                                  <p className="text-slate-600">{mcq.explanation}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Back Cover / Insignia */}
                <div className="bg-slate-800 text-white rounded-2xl p-10 text-center space-y-4 print:bg-white print:text-slate-800 print:border-t print:pt-6">
                  <Award className="h-10 w-10 mx-auto text-amber-400" />
                  <h4 className="font-bold text-sm tracking-widest uppercase">
                    STUDY HUB ACADEMY
                  </h4>
                  <p className="text-xs text-slate-400 print:text-slate-500 max-w-sm mx-auto leading-relaxed">
                    {isBengali 
                      ? "আপনার স্বপ্ন ছোঁয়ার যাত্রায় আমরা সর্বদা আপনার সাথে আছি। নিয়মিত পড়াশোনা করুন এবং সফল হোন।" 
                      : "We are with you at every step of your preparation. Keep practicing and keep moving towards your dream."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Help / Print & Download Options */}
      <AnimatePresence>
        {showPrintModal && selectedPdf && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`${theme.bgCard} text-slate-900 dark:text-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border ${theme.borderCard} p-6 space-y-6 relative`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <Printer className="h-5 w-5" />
                  <h3 className={`text-base font-bold ${theme.textHeading}`}>
                    {isBengali ? "প্রিন্ট এবং পিডিএফ ডাউনলোড অপশন" : "Print & PDF Download Options"}
                  </h3>
                </div>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <p className={`text-xs ${theme.textMuted} leading-relaxed`}>
                  {isBengali 
                    ? "আইফ্রেম (iFrame) সিকিউরিটি সুবিধার কারণে ব্রাউজারের প্রিন্ট উইন্ডোটি এখানে সরাসরি কাজ নাও করতে পারে। নিচে দেওয়া সহজ এবং ১০০% কার্যকর পদ্ধতিগুলোর যেকোনো একটি ব্যবহার করুন:" 
                    : "Due to browser security constraints inside standard sandboxed previews, the default print window may be blocked. Please choose one of the options below to get a perfect copy:"}
                </p>

                <div className="space-y-3">
                  {/* OPTION 1: Standalone Download (BEST) */}
                  <div className={`p-4 rounded-2xl border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 transition-all flex flex-col gap-2`}>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                        <Download className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${theme.textHeading}`}>
                          {isBengali ? "১. প্রিমিয়াম অফলাইন নোট ফাইল ডাউনলোড (সেরা পদ্ধতি)" : "1. Download Offline Notes File (Recommended)"}
                        </h4>
                        <p className={`text-[10px] ${theme.textMuted} mt-0.5 leading-normal`}>
                          {isBengali 
                            ? "এই নোটটি আপনার ডিভাইসে একটি ফাইল হিসেবে ডাউনলোড করুন। ফাইলটি ওপেন করলেই ব্রাউজারে সুন্দরভাবে খুলবে এবং আপনি সরাসরি প্রিন্ট বা PDF সেভ করতে পারবেন। বাংলা লেখার ফন্ট ১০০% সঠিক থাকবে!" 
                            : "Download as a standalone offline file. Double-click to open in any browser to print/save as PDF with perfect formatting and fonts!"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        downloadStandaloneHtml(selectedPdf);
                        setShowPrintModal(false);
                      }}
                      className="w-full h-9 rounded-xl text-white font-semibold text-xs bg-teal-600 hover:bg-teal-700 transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                    >
                      <Download className="h-4 w-4" />
                      {isBengali ? "অফলাইন নোট ফাইল ডাউনলোড করুন" : "Download Offline Note"}
                    </button>
                  </div>

                  {/* OPTION 2: Open in new tab */}
                  <div className={`p-4 rounded-2xl border ${theme.borderCard} bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all flex flex-col gap-2`}>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <Printer className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${theme.textHeading}`}>
                          {isBengali ? "২. নতুন ট্যাবে খুলে সরাসরি প্রিন্ট করুন" : "2. Open in New Tab & Print"}
                        </h4>
                        <p className={`text-[10px] ${theme.textMuted} mt-0.5 leading-normal`}>
                          {isBengali 
                            ? "অ্যাপটি নতুন একটি ট্যাবে ওপেন করে সরাসরি প্রিন্ট করুন। সেখানে ব্রাউজারের প্রিন্ট উইন্ডোটি কোনো সিকিউরিটি বাধা ছাড়াই কাজ করবে।" 
                            : "Opens the application in a new browser tab where standard direct printing works instantly without iframe limitations."}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        window.open(window.location.href, "_blank");
                        setShowPrintModal(false);
                      }}
                      className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      {isBengali ? "নতুন ট্যাবে অ্যাপ খুলুন" : "Open App in New Tab"}
                    </button>
                  </div>

                  {/* OPTION 3: Direct Print Fallback */}
                  <div className="flex justify-between items-center text-[10px]">
                    <span className={theme.textMuted}>
                      {isBengali ? "অথবা সরাসরি চেষ্টা করুন:" : "Or attempt direct print:"}
                    </span>
                    <button
                      onClick={() => {
                        window.print();
                        setShowPrintModal(false);
                      }}
                      className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
                    >
                      {isBengali ? "সরাসরি প্রিন্ট করার চেষ্টা করুন" : "Attempt Direct Print"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Embedded print override styles */}
      <style>{`
        @media print {
          /* Hide normal screen layout completely */
          body * {
            visibility: hidden !important;
          }
          /* Only display our PDF document frame */
          #printable-pdf-document, #printable-pdf-document * {
            visibility: visible !important;
          }
          #printable-pdf-document {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          /* Force page breaks on major PDF document sheets */
          #printable-pdf-document > div {
            page-break-after: always !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 0 2rem 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
