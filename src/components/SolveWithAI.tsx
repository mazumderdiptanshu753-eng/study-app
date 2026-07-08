import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Language } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";
import { 
  BrainCircuit, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  BookOpen,
  Send,
  Upload,
  Bot,
  User,
  X,
  Loader2,
  FileText
} from "lucide-react";

interface SolveWithAIProps {
  onClose?: () => void;
  lang: Language;
  theme: ThemeConfig;
}

interface MathSolution {
  problem: string;
  coreConcept: string;
  steps: string[];
  finalAnswer: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content?: string;
  attachment?: { name: string; data: string; mimeType: string };
  solution?: MathSolution;
  error?: string;
}

export default function SolveWithAI({ lang, theme, onClose }: SolveWithAIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; data: string; mimeType: string } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBengali = lang === "bn";
  const t = {
    title: isBengali ? "এআই ৭.০ (AI 7.0)" : "AI 7.0",
    subtitle: isBengali 
      ? "Google দ্বারা পরিচালিত, দীপ্তাংশু মজুমদার দ্বারা তৈরি" 
      : "Powered by Google , Created by Diptanshu Mazumder",
    placeholder: isBengali 
      ? "আপনার সমস্যা বা প্রশ্নটি এখানে টাইপ করুন..." 
      : "Ask your question or describe your problem...",
    solving: isBengali ? "চিন্তা করছে..." : "Thinking...",
    coreConceptLabel: isBengali ? "মূল ধারণা / তত্ত্ব:" : "Core Concept:",
    stepsLabel: isBengali ? "ধাপে ধাপে সমাধান:" : "Step-by-Step Solution:",
    finalAnswerLabel: isBengali ? "চূড়ান্ত উত্তর:" : "Final Answer:",
    errorLabel: isBengali ? "সমাধান তৈরি করতে ব্যর্থ হয়েছে।" : "Failed to generate solution.",
    tip: isBengali 
      ? "পরামর্শ: এটি গণিত, বিজ্ঞান, ইতিহাস, বা যেকোনো বিষয়ের প্রশ্নের উত্তর সুন্দরভাবে ব্যাখ্যা করতে পারে!" 
      : "Tip: It can thoroughly explain questions from Math, Science, History, and more!",
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: isBengali 
            ? "হ্যালো! আমি এআই ৭.০। যেকোনো কঠিন প্রশ্ন, সমস্যা বা সমীকরণ টাইপ বা আপলোড করুন এবং ১০০% নির্ভুল ধাপে ধাপে সমাধান বুঝে নিন।" 
            : "Hello! I am the AI 7.0. Type or upload any complex question or problem for 100% accurate step-by-step solutions."
        }
      ]);
    }
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      alert(isBengali ? "শুধুমাত্র JPG, PNG বা PDF ফাইল আপলোড করা যাবে।" : "Only JPG, PNG, or PDF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(isBengali ? "ফাইলের সাইজ ৫ এমবি এর চেয়ে ছোট হতে হবে।" : "File size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const commaIndex = base64String.indexOf(",");
      const data = commaIndex > -1 ? base64String.substring(commaIndex + 1) : base64String;
      setAttachedFile({
        name: file.name,
        data: data,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && !attachedFile) || isLoading) return;

    const userText = inputText.trim();
    const currentAttachment = attachedFile;
    
    setInputText("");
    setAttachedFile(null);

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      attachment: currentAttachment || undefined
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/solve-math", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          problem: userText,
          file: currentAttachment,
          lang 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || t.errorLabel);
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        solution: data
      }]);
    } catch (error: any) {
      console.error("AI Solver Error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        error: error.message || t.errorLabel
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSolution = (solution: MathSolution) => (
    <div className="space-y-4 w-full">
      {/* Main query copy */}
      <div className={`${theme.isDark ? "bg-slate-900/40" : "bg-slate-50"} border ${theme.borderCard} rounded-xl p-3`}>
        <span className={`text-[10px] uppercase font-bold ${theme.textMuted} tracking-wider block mb-1`}>
          {isBengali ? "প্রশ্ন:" : "Problem Asked:"}
        </span>
        <p className={`text-xs font-bold ${theme.textHeading}`}>
          {solution.problem || (isBengali ? "ছবি বা ডকুমেন্ট থেকে বিশ্লেষণ" : "Analyzed from uploaded document")}
        </p>
      </div>

      {/* Core Concept Banner */}
      <div className={`${theme.primaryBg}/20 border ${theme.borderCard} rounded-xl p-3 space-y-1.5`}>
        <span className={`text-[10px] uppercase font-black ${theme.primaryText} tracking-wider flex items-center gap-1`}>
          <BookOpen className="h-3.5 w-3.5" />
          {t.coreConceptLabel}
        </span>
        <p className={`text-xs font-bold ${theme.textHeading} leading-relaxed font-mono`}>
          {solution.coreConcept}
        </p>
      </div>

      {/* Derivation Steps List */}
      <div className="space-y-1.5">
        <span className={`text-[10px] uppercase font-bold ${theme.textMuted} tracking-wider block`}>
          {t.stepsLabel}
        </span>
        <div className={`divide-y ${theme.isDark ? "divide-slate-800" : "divide-slate-100"} border ${theme.borderCard} rounded-xl overflow-hidden ${theme.bgCard}`}>
          {solution.steps.map((step, index) => (
            <div key={index} className={`p-3 text-xs font-medium flex gap-2.5 hover:bg-slate-100/5 dark:hover:bg-slate-900/50 transition-colors`}>
              <span className={`h-4 w-4 rounded ${theme.isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-500"} flex items-center justify-center text-[9px] font-extrabold shrink-0 mt-0.5`}>
                {index + 1}
              </span>
              <p className={`leading-relaxed whitespace-pre-line ${theme.textMain}`}>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Highlighted Final Answer */}
      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-3 flex items-center justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <span className="text-[10px] uppercase font-black text-emerald-800 dark:text-emerald-300 tracking-wider flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            {t.finalAnswerLabel}
          </span>
          <p className="text-sm font-black text-emerald-950 dark:text-emerald-100 font-mono truncate">
            {solution.finalAnswer}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-[85vh] w-full max-w-4xl mx-auto rounded-3xl border ${theme.borderCard} overflow-hidden shadow-2xl ${theme.bgCard}`}>
      {/* Header */}
      <div className={`p-4 border-b ${theme.borderCard} flex items-center justify-between bg-gradient-to-r ${theme.isDark ? "from-slate-800 to-slate-900" : "from-emerald-50 to-teal-50"}`}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className={`font-bold ${theme.textHeading}`}>
              {t.title}
            </h2>
            <p className={`text-xs ${theme.textMuted}`}>
              {t.subtitle}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${theme.textMuted}`}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className={`h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-1`}>
                  <Sparkles className="h-4 w-4" />
                </div>
              )}
              
              <div className={`max-w-[85%] rounded-2xl ${isUser ? 'bg-emerald-600 text-white rounded-tr-none px-4 py-3 shadow-sm' : ''}`}>
                {isUser ? (
                  <div className="space-y-2 text-sm leading-relaxed">
                    {msg.attachment && (
                      <div className="bg-white/20 rounded-lg p-2 flex items-center gap-2 text-xs w-max max-w-full truncate">
                        {msg.attachment.mimeType.includes("image") ? <FileText className="h-4 w-4 shrink-0" /> : <FileText className="h-4 w-4 shrink-0" />}
                        <span className="truncate">{msg.attachment.name}</span>
                      </div>
                    )}
                    {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                  </div>
                ) : (
                  <div className="w-full">
                    {msg.content && (
                      <div className={`px-4 py-3 rounded-2xl rounded-tl-none border shadow-sm ${theme.isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    )}
                    {msg.solution && renderSolution(msg.solution)}
                    {msg.error && (
                      <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl p-3 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        <p className="text-xs font-medium text-rose-800 dark:text-rose-200">{msg.error}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 mt-1">
                  <User className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                </div>
              )}
            </motion.div>
          );
        })}

        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3 justify-start"
          >
            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-1">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className={`px-4 py-3 rounded-2xl rounded-tl-none border shadow-sm flex items-center gap-2 ${theme.isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
              <span className={`text-xs ${theme.textMuted}`}>{t.solving}</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-3 sm:p-4 border-t ${theme.borderCard} ${theme.bgCard}`}>
        {attachedFile && (
          <div className="mb-3 flex items-center gap-2">
            <div className={`flex items-center gap-2 ${theme.isDark ? 'bg-slate-800 text-slate-300' : 'bg-emerald-50 text-emerald-800'} border ${theme.borderCard} px-3 py-1.5 rounded-lg text-xs font-medium max-w-xs shadow-sm`}>
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{attachedFile.name}</span>
              <button 
                onClick={() => setAttachedFile(null)}
                className="ml-1 p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3 relative items-end">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/jpeg,image/png,image/jpg,application/pdf"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${theme.textMuted} shrink-0 mb-0.5 border ${theme.borderCard} shadow-sm bg-white dark:bg-slate-900`}
            title={isBengali ? "ফাইল আপলোড করুন" : "Upload file"}
          >
            <Upload className="h-5 w-5" />
          </button>
          
          <div className={`flex-1 relative rounded-2xl border shadow-inner overflow-hidden ${theme.isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
             <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={t.placeholder}
              rows={1}
              className="w-full bg-transparent px-4 py-3.5 text-sm focus:outline-none resize-none max-h-32 min-h-[50px] leading-relaxed"
              style={{ height: "auto" }}
            />
          </div>
          
          <button
            type="submit"
            disabled={(!inputText.trim() && !attachedFile) || isLoading}
            className={`p-3 rounded-xl flex items-center justify-center bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 mb-0.5 shadow-sm active:scale-95`}
          >
            <Send className="h-5 w-5 ml-0.5" />
          </button>
        </form>
        <div className="mt-2 text-center">
          <span className={`text-[10px] font-medium ${theme.textMuted}`}>{t.tip}</span>
        </div>
      </div>
    </div>
  );
}
