import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Language } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";
import { 
  BrainCircuit, 
  Sparkles, 
  CornerDownLeft, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  BookOpen,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  X
} from "lucide-react";

interface SolveWithAIProps {
  lang: Language;
  theme: ThemeConfig;
}

interface MathSolution {
  problem: string;
  coreConcept: string;
  steps: string[];
  finalAnswer: string;
}

export default function SolveWithAI({ lang, theme }: SolveWithAIProps) {
  const [problem, setProblem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<MathSolution | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Input mode: "text" for typing, "file" for uploading image/pdf
  const [inputMode, setInputMode] = useState<"text" | "file">("text");

  // File upload state
  const [attachedFile, setAttachedFile] = useState<{ name: string; data: string; mimeType: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const isBengali = lang === "bn";

  const t = {
    title: isBengali ? "এআই দিয়ে সমাধান করুন (Solve with AI)" : "Solve with AI",
    subtitle: isBengali 
      ? "যেকোনো কঠিন গণিত বা সমীকরণ টাইপ করুন বা আপলোড করুন এবং এআই-এর মাধ্যমে ধাপে ধাপে সমাধান বুঝে নিন" 
      : "Type or upload any complex math question, equation, or word problem for step-by-step solutions",
    placeholder: isBengali 
      ? "যেমন: x² - 5x + 6 = 0 সমীকরণটি সমাধান করুন অথবা 3x² + sin(x) এর ব্যবকলন নির্ণয় করুন..." 
      : "e.g. Solve x^2 - 5x + 6 = 0 or find the derivative of 3x^2 + sin(x)...",
    solveBtn: isBengali ? "এআই সমাধান শুরু করুন" : "Solve with AI",
    solving: isBengali ? "এআই হিসাব করছে..." : "AI is solving...",
    coreConceptLabel: isBengali ? "মূল গাণিতিক সূত্র / তত্ত্ব:" : "Core Formula / Concept:",
    stepsLabel: isBengali ? "ধাপে ধাপে সমাধান:" : "Step-by-Step Derivation:",
    finalAnswerLabel: isBengali ? "চূড়ান্ত ফলাফল:" : "Final Answer:",
    clearBtn: isBengali ? "নতুন প্রশ্ন" : "New Problem",
    sampleLabel: isBengali ? "সহজ ট্রাই করার জন্য নমুনা সমীকরণ:" : "Try these sample problems:",
    errorLabel: isBengali ? "সমাধান তৈরি করতে ব্যর্থ হয়েছে।" : "Failed to solve the math problem.",
    tip: isBengali 
      ? "পরামর্শ: এটি সাধারণ বীজগণিত, ক্যালকুলাস, ত্রিকোণমিতি বা জ্যামিতির প্রশ্ন খুব সুন্দরভাবে ব্যাখ্যা করতে পারে!" 
      : "Tip: It can thoroughly explain algebra, calculus, trigonometry, statistics, or word problems!",
    uploadLabel: isBengali ? "প্রশ্ন বা খাতার ছবি/পিডিএফ আপলোড করুন" : "Upload problem photo or PDF",
    uploadHint: isBengali ? "JPG, PNG বা PDF ফাইল ড্র্যাগ করে আনুন অথবা ক্লিক করে আপলোড করুন" : "Drag & drop or click to select JPG, PNG, or PDF file",
    fileAttached: isBengali ? "সংযুক্ত ফাইল:" : "Attached File:",
    removeFile: isBengali ? "ফাইল মুছুন" : "Remove file",
    sizeLimitError: isBengali ? "ফাইলের আকার ৫ এমবি এর কম হতে হবে।" : "File size must be under 5MB.",
    invalidTypeError: isBengali ? "অনুগ্রহ করে একটি ছবি (JPG/PNG) অথবা পিডিএফ ফাইল আপলোড করুন।" : "Please upload a valid image (JPG, PNG) or PDF.",
    typeQuestionBtn: isBengali ? "টাইপ করে সমাধান" : "Get Answer by Typing Questions",
    uploadQuestionBtn: isBengali ? "ফাইল আপলোড করে সমাধান" : "Get Answer by Uploading",
  };

  const samples = isBengali ? [
    "x^2 - 7x + 12 = 0 এর সমাধান কি?",
    "y = x^3 * e^x হলে dy/dx কত?",
    "একটি ত্রিভুজের বাহুর দৈর্ঘ্য ৩, ৪ এবং ৫ সেমি হলে ক্ষেত্রফল কত?"
  ] : [
    "Solve x^2 - 7x + 12 = 0",
    "Find derivative of y = x^3 * e^x",
    "Find the area of a triangle with sides 3, 4, and 5 cm"
  ];

  const processFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      setError(t.invalidTypeError);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(t.sizeLimitError);
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
        mimeType: file.type
      });
      setError(null);
    };
    reader.onerror = () => {
      setError(isBengali ? "ফাইল রিড করতে সমস্যা হয়েছে" : "Error reading file.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSolve = async (textToSolve = problem) => {
    // Only fetch based on what's active/filled in current mode
    const query = inputMode === "text" ? textToSolve.trim() : "";
    const activeFile = inputMode === "file" ? attachedFile : null;
    
    if (!query && !activeFile) return;

    setIsLoading(true);
    setError(null);
    setSolution(null);

    try {
      const response = await fetch("/api/solve-math", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          problem: query, 
          file: activeFile ? { data: activeFile.data, mimeType: activeFile.mimeType } : null,
          lang 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to the math solver.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setSolution(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || t.errorLabel);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleClick = (sample: string) => {
    setInputMode("text");
    setProblem(sample);
    handleSolve(sample);
  };

  const isSolveDisabled = inputMode === "text" ? !problem.trim() : !attachedFile;


  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={`rounded-2xl border ${theme.borderCard} ${theme.bgCard} shadow-md p-6 space-y-6 transition-all duration-300`}
    >

      
      {/* Header section */}
      <motion.div variants={itemVariants} className={`flex items-center justify-between border-b ${theme.borderCard} pb-4`}>
        <div>
          <h3 className={`font-black ${theme.textHeading} text-base flex items-center gap-2`}>
            <BrainCircuit className={`h-5 w-5 ${theme.primaryText} animate-pulse`} />
            <span>{t.title}</span>
            <span className={`inline-flex items-center gap-1 rounded-full ${theme.badgeBg} px-2.5 py-0.5 text-[9px] font-bold ${theme.badgeText} uppercase tracking-wider`}>
              <Sparkles className="h-2.5 w-2.5" /> AI Active
            </span>
          </h3>
          <p className={`text-xs ${theme.textMuted} font-medium mt-1`}>{t.subtitle}</p>
        </div>
      </motion.div>

      {/* Mode Selector Option Buttons (Text vs File) */}
      {!solution && !isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            id="btn-solve-type-mode"
            onClick={() => setInputMode("text")}
            className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              inputMode === "text"
                ? `${theme.primaryBtn} ${theme.primaryBtnHover} ${theme.primaryBtnText} border-transparent shadow-xs`
                : `${theme.isDark ? "bg-slate-900/50 hover:bg-slate-900 text-slate-300 border-slate-800" : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"}`
            }`}
          >
            <span>⌨️</span>
            <span>{t.typeQuestionBtn}</span>
          </button>

          <button
            type="button"
            id="btn-solve-upload-mode"
            onClick={() => setInputMode("file")}
            className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              inputMode === "file"
                ? `${theme.primaryBtn} ${theme.primaryBtnHover} ${theme.primaryBtnText} border-transparent shadow-xs`
                : `${theme.isDark ? "bg-slate-900/50 hover:bg-slate-900 text-slate-300 border-slate-800" : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"}`
            }`}
          >
            <span>📄</span>
            <span>{t.uploadQuestionBtn}</span>
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!solution && !isLoading && (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {inputMode === "text" ? (
              /* Input Area for TEXT TYPING */
            <div className="space-y-2">
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder={t.placeholder}
                rows={4}
                className={`w-full ${
                  theme.isDark ? "bg-slate-900/40 text-white" : "bg-slate-50/50 text-slate-800"
                } pl-4 pr-4 py-3 rounded-xl border ${
                  theme.borderCard
                } text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 resize-none leading-relaxed`}
              />
            </div>
          ) : (
            /* File Upload Area for JPG/PNG/PDF */
            <div className="space-y-2">
              <span className={`text-2xs uppercase font-bold ${theme.textMuted} tracking-wider block`}>
                {t.uploadLabel}
              </span>
              
              {!attachedFile ? (
                <label 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    dragActive 
                      ? `border-emerald-500 ${theme.primaryBg}/40` 
                      : `${theme.borderCard} ${theme.isDark ? "bg-slate-900/30 hover:bg-slate-900/60" : "bg-slate-50 hover:bg-slate-100/60"}`
                  }`}
                >
                  <input 
                    type="file" 
                    accept="image/jpeg,image/png,image/jpg,application/pdf" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                  <UploadCloud className={`h-8 w-8 ${theme.primaryText} mb-2`} />
                  <span className={`text-xs font-extrabold ${theme.textHeading} block`}>
                    {isBengali ? "একটি ফাইল আপলোড করুন" : "Choose Image/PDF File"}
                  </span>
                  <span className={`text-[10px] ${theme.textMuted} font-semibold mt-1 block`}>
                    {t.uploadHint}
                  </span>
                </label>
              ) : (
                <div className={`${theme.primaryBg}/30 border ${theme.borderCard} rounded-xl p-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl ${theme.isDark ? "bg-slate-900" : "bg-white"} ${theme.primaryText} shrink-0 shadow-3xs`}>
                      {attachedFile.mimeType === "application/pdf" ? (
                        <FileText className="h-5 w-5" />
                      ) : (
                        <ImageIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className={`text-[9px] font-black ${theme.primaryText} block uppercase tracking-wider`}>{t.fileAttached}</span>
                      <span className={`text-xs font-black ${theme.textHeading} block truncate`}>{attachedFile.name}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setAttachedFile(null)}
                    className={`bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/30 border ${theme.borderCard} p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer transition-all shadow-3xs`}
                    title={t.removeFile}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Action trigger button */}
          <div className="flex items-center gap-4 pt-1">
            <button
              onClick={() => handleSolve()}
              disabled={isSolveDisabled}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:pointer-events-none active:scale-98 ${
                !isSolveDisabled
                  ? `${theme.primaryBtn} ${theme.primaryBtnHover} ${theme.primaryBtnText}`
                  : `${theme.isDark ? "bg-slate-800 text-slate-500 border border-slate-700" : "bg-slate-100 text-slate-400 border border-slate-200"}`
              }`}
            >
              <BrainCircuit className="h-4 w-4" />
              {t.solveBtn}
            </button>
          </div>

          {/* Quick-try samples */}
          {inputMode === "text" && (
            <div className="space-y-2 pt-2">
              <span className={`text-[10px] uppercase font-bold ${theme.textMuted} tracking-wider block`}>
                {t.sampleLabel}
              </span>
              <div className="flex flex-col gap-2">
                {samples.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSampleClick(sample)}
                    className={`w-full text-left ${
                      theme.isDark 
                        ? "bg-slate-900/50 hover:bg-slate-900 border-slate-800/80 text-slate-200" 
                        : "bg-slate-50/50 hover:bg-slate-100/60 border-slate-150 text-slate-700"
                    } border px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer group`}
                  >
                    <span className="truncate pr-4">{sample}</span>
                    <CornerDownLeft className={`h-4 w-4 ${theme.primaryText} opacity-70 group-hover:translate-x-[-3px] transition-transform shrink-0`} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
        )}

        {/* Loading animation state */}
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="py-12 text-center space-y-4"
          >
            <div className="relative inline-block">
            <div className={`h-12 w-12 rounded-full border-4 ${theme.isDark ? "border-slate-800" : "border-slate-100"} animate-spin`} style={{ borderTopColor: "rgb(16, 185, 129)" }}></div>
            <Sparkles className="h-5 w-5 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-1 max-w-xs mx-auto">
            <p className={`text-xs font-extrabold ${theme.textHeading} animate-pulse`}>{t.solving}</p>
            <p className={`text-[10px] ${theme.textMuted} leading-relaxed font-semibold`}>
              {lang === "bn" 
                ? "জেমিনি এআই আপনার সমীকরণ বা ফাইলটি বিশদভাবে বিশ্লেষণ করছে..." 
                : "Gemini is performing rigorous step-by-step mathematical derivations on your request..."}
            </p>
          </div>
        </motion.div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <p className="text-xs font-bold text-rose-800 dark:text-rose-200">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-[10px] font-bold text-rose-600 dark:text-rose-400 underline hover:no-underline cursor-pointer"
              >
                {isBengali ? "পুনরায় চেষ্টা করুন" : "Dismiss and retry"}
              </button>
            </div>
          </motion.div>
        )}

        {/* Beautiful formatted solution card output */}
        {solution && !isLoading && (
          <motion.div
            key="solution"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="space-y-5"
          >
          
          {/* Main query copy */}
          <div className={`${theme.isDark ? "bg-slate-900/60" : "bg-slate-50"} border ${theme.borderCard} rounded-xl p-4`}>
            <span className={`text-[10px] uppercase font-bold ${theme.textMuted} tracking-wider block mb-1`}>
              {isBengali ? "প্রশ্ন:" : "Problem Asked:"}
            </span>
            <p className={`text-xs font-extrabold ${theme.textHeading}`}>{solution.problem || (isBengali ? "ছবি বা ডকুমেন্ট থেকে বিশ্লেষণ" : "Analyzed from uploaded document")}</p>
          </div>

          {/* Core Concept Banner */}
          <div className={`${theme.primaryBg}/40 border ${theme.borderCard} rounded-xl p-4 space-y-2`}>
            <span className={`text-[10px] uppercase font-black ${theme.primaryText} tracking-wider flex items-center gap-1`}>
              <BookOpen className="h-3.5 w-3.5" />
              {t.coreConceptLabel}
            </span>
            <p className={`text-xs font-bold ${theme.textHeading} leading-relaxed font-mono`}>
              {solution.coreConcept}
            </p>
          </div>

          {/* Derivation Steps List */}
          <div className="space-y-2">
            <span className={`text-[10px] uppercase font-bold ${theme.textMuted} tracking-wider block`}>
              {t.stepsLabel}
            </span>
            <div className={`divide-y ${theme.isDark ? "divide-slate-800" : "divide-slate-100"} border ${theme.borderCard} rounded-xl overflow-hidden ${theme.bgCard}`}>
              {solution.steps.map((step, index) => (
                <div key={index} className={`p-4 text-xs font-medium flex gap-3 hover:bg-slate-100/5 dark:hover:bg-slate-900/50 transition-colors`}>
                  <span className={`h-5 w-5 rounded ${theme.isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-500"} flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5`}>
                    {index + 1}
                  </span>
                  <p className={`leading-relaxed whitespace-pre-line ${theme.textMain}`}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Highlighted Final Answer */}
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] uppercase font-black text-emerald-800 dark:text-emerald-300 tracking-wider flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                {t.finalAnswerLabel}
              </span>
              <p className="text-sm font-black text-emerald-950 dark:text-emerald-100 font-mono truncate">
                {solution.finalAnswer}
              </p>
            </div>
            
            <button
              onClick={() => {
                setSolution(null);
                setError(null);
                setAttachedFile(null);
              }}
              className="shrink-0 inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-800 dark:text-emerald-200 text-2xs font-extrabold px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-3xs"
            >
              <RefreshCw className="h-3 w-3" />
              {t.clearBtn}
            </button>
          </div>

        </motion.div>
      )}
      </AnimatePresence>

      {/* Tip footer */}
      {!solution && !isLoading && (
        <div className={`flex items-start gap-2 ${theme.isDark ? "bg-slate-900/30" : "bg-slate-50/50"} rounded-xl p-3.5 text-2xs ${theme.textMuted} font-semibold leading-relaxed`}>
          <Info className={`h-4 w-4 ${theme.primaryText} shrink-0 mt-0.5`} />
          <span>{t.tip}</span>
        </div>
      )}

    </motion.div>
  );
}
