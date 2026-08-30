import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  ArrowRight, 
  ChevronRight, 
  Calculator, 
  Maximize2,
  CheckSquare as BookOpenCheck,
  TrendingUp,
  Award,
  Users,
  Radio,
  Quote,
  RefreshCw,
  Zap,
  GraduationCap,
  Laptop,
  Cpu,
  Clock,
  FileText,
  Search,
  BookMarked,
  Flame,
  Star,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { StudyNote, UserStats, StudentProfile } from "../types";
import { Language, TRANSLATIONS } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";
import ScientificCalculator from "./ScientificCalculator";
import SolveWithAI from "./SolveWithAI";
import CurrentAffairsTicker from "./CurrentAffairsTicker";
import DailyQuiz from "./DailyQuiz";

interface DashboardProps {
  stats: UserStats;
  notes: StudyNote[];
  onNavigate: (tab: "notes" | "chat" | "videos" | "gk" | "forum" | "liveClasses" | "govtJobNotes" | "school" | "btech" | "diploma") => void;
  onSelectNote: (note: StudyNote) => void;
  lang: Language;
  theme: ThemeConfig;
  role: "Admin" | "Student";
  profile?: StudentProfile | null;
}

export default function Dashboard({
  stats,
  notes,
  onNavigate,
  onSelectNote,
  lang,
  theme,
  role,
  profile
}: DashboardProps) {
  const t = TRANSLATIONS[lang];
  const totalNotes = notes.length;
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [showSolveModal, setShowSolveModal] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [activePortalTab, setActivePortalTab] = useState<"all" | "academic" | "prep" | "tools">("all");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (lang === "bn") {
      if (hour >= 5 && hour < 12) return "শুভ সকাল";
      if (hour >= 12 && hour < 16) return "শুভ দুপুর";
      if (hour >= 16 && hour < 18) return "শুভ বিকেল";
      if (hour >= 18 && hour < 22) return "শুভ সন্ধ্যা";
      return "শুভ রাত্রি";
    } else {
      if (hour >= 5 && hour < 12) return "Good Morning";
      if (hour >= 12 && hour < 17) return "Good Afternoon";
      if (hour >= 17 && hour < 21) return "Good Evening";
      return "Good Night";
    }
  };

  const studyAdvice = [
    {
      en: "Focus on one small topic today. Micro-habits beat giant plans!",
      bn: "আজ একটি ছোট বিষয়ের উপর ফোকাস করুন। ছোট ছোট অভ্যাস বড় লক্ষ্যের চেয়েও শক্তিশালী!"
    },
    {
      en: "Take a 5-minute break after every 25 minutes of active reading.",
      bn: "প্রতি ২৫ মিনিট সক্রিয়ভাবে পড়ার পর ৫ মিনিটের জন্য একটি ছোট বিরতি নিন।"
    },
    {
      en: "Don't just read; summarize and explain it aloud or use Study Hub's AI.",
      bn: "শুধু মুখস্থ করবেন না; নিজের ভাষায় সারসংক্ষেপ করুন বা স্টাডি হাবের এআই ব্যবহার করুন।"
    },
    {
      en: "Study hard, stay curious, and track your progress daily in Workspace.",
      bn: "মনোযোগ দিয়ে পড়ুন, কৌতুহলী থাকুন এবং ওয়ার্কস্পেসে প্রতিদিনের প্রগ্রেস ট্র্যাক করুন।"
    },
    {
      en: "Sleep is where memories consolidate. Never compromise on 7-8 hours!",
      bn: "ঘুমের মধ্যেই স্মৃতিগুলো মস্তিষ্কে স্থায়ী হয়। ৭-৮ ঘণ্টার ঘুমে কখনোই ছাড় দেবেন না!"
    }
  ];

  const rotateQuote = () => {
    setQuoteIdx((prev) => (prev + 1) % studyAdvice.length);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 140, damping: 18 } }
  };

  return (
    <motion.div 
      className="space-y-6 sm:space-y-8 pb-16"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* 1. Modern Bento Hero Header */}
      <motion.div 
        variants={itemVariants} 
        className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${theme.heroGradient} p-6 sm:p-8 lg:p-10 text-slate-900 dark:text-white shadow-xl border border-white/60 dark:border-white/10 group`}
      >
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-indigo-400/20 dark:bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Details */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-slate-900/80 px-3.5 py-1 text-xs font-black tracking-wider uppercase backdrop-blur-md text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-spin" style={{ animationDuration: "8s" }} />
                {lang === "bn" ? "স্টাডি হাব ৩.০ স্মার্ট লার্নিং" : "Study Hub 3.0 Smart Learning"}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-500/20">
                <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>{lang === "bn" ? "৫ দিনের স্টাডি স্ট্রিক!" : "5-Day Study Streak!"}</span>
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-950 dark:text-white">
                {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 dark:from-emerald-400 dark:via-teal-300 dark:to-indigo-400">{profile?.fullName || (lang === "bn" ? "শিক্ষার্থী বন্ধু!" : "Scholar!")}</span>
              </h1>
              
              <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-semibold max-w-xl">
                {lang === "bn"
                   ? "স্মার্ট স্টাডি নোটস, প্রিভিয়াস ইয়ার প্রশ্নপত্র, ভিডিও লেকচার ও এআই ডাউট সলভারের সাথে আপনার পরীক্ষা প্রস্তুতি আরও সহজ ও দ্রুত করুন।"
                   : "Your all-in-one portal for curriculum notes, previous year question banks, live lectures, and instant AI homework assistance."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a 
                href="https://whatsapp.com/channel/0029VbD7Yyt3AzNVccgfh93K" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#25D366] via-[#1ea851] to-[#128C7E] text-white rounded-2xl font-black text-xs sm:text-sm transition-all shadow-[0_8px_25px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_35px_rgba(37,211,102,0.5)] hover:scale-[1.02] active:scale-95 border border-white/20 text-center group cursor-pointer"
              >
                <svg className="w-4.5 h-4.5 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 00-5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>{lang === "bn" ? "হোয়াটসঅ্যাপ চ্যানেল" : "WhatsApp Channel"}</span>
              </a>

              <button 
                onClick={() => onNavigate("notes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-900 dark:hover:bg-slate-100 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <BookMarked className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
                <span>{lang === "bn" ? "অধ্যয়ন শুরু করুন" : "Start Learning Now"}</span>
              </button>
            </div>
          </div>
          
          {/* Right Bento Gateways Grid */}
          <div className="lg:col-span-5 w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-white/80 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-500" />
                {lang === "bn" ? "কুইক গেটওয়ে পোর্টাল" : "Quick Portals"}
              </span>
              <span className="text-[10px] bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full font-black">
                PRO 3.0
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Card 1: Notes Room */}
              <button 
                onClick={() => onNavigate("notes")}
                className="group p-4 bg-white dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-left transition-all hover:border-emerald-400 hover:-translate-y-0.5 shadow-3xs cursor-pointer"
              >
                <div className="h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-300 mb-2.5 transition-transform group-hover:scale-110">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">{lang === "bn" ? "নোটস রুম" : "Notes Room"}</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">{lang === "bn" ? "হাতে লেখা নোট ও পিডিএফ" : "Handwritten guides & PDF"}</p>
              </button>

              {/* Card 2: Live Classes */}
              <button 
                onClick={() => onNavigate("liveClasses")}
                className="group p-4 bg-white dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-left transition-all hover:border-rose-400 hover:-translate-y-0.5 shadow-3xs cursor-pointer"
              >
                <div className="h-9 w-9 rounded-xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-700 dark:text-rose-300 mb-2.5 transition-transform group-hover:scale-110">
                  <Radio className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">{lang === "bn" ? "লাইভ ক্লাস" : "Live Classes"}</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">{lang === "bn" ? "অনলাইন লেকচার" : "Live stream sessions"}</p>
              </button>

              {/* Card 3: Support Chat */}
              <button 
                onClick={() => onNavigate("chat")}
                className="group p-4 bg-white dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-left transition-all hover:border-blue-400 hover:-translate-y-0.5 shadow-3xs cursor-pointer"
              >
                <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-300 mb-2.5 transition-transform group-hover:scale-110">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">{lang === "bn" ? "শিক্ষক চ্যাট" : "Ask Faculty"}</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">{lang === "bn" ? "ডাউট ও পরামর্শ" : "Direct teacher chat"}</p>
              </button>

              {/* Card 4: Community Forum */}
              <button 
                onClick={() => onNavigate("forum")}
                className="group p-4 bg-white dark:bg-slate-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-left transition-all hover:border-purple-400 hover:-translate-y-0.5 shadow-3xs cursor-pointer"
              >
                <div className="h-9 w-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-700 dark:text-purple-300 mb-2.5 transition-transform group-hover:scale-110">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">{lang === "bn" ? "আলোচনা সভা" : "Discussion"}</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">{lang === "bn" ? "প্রশ্নোত্তর ও ফোরাম" : "Q&A Forum & board"}</p>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Real-time Current Affairs Ticker & Daily Quiz Banner */}
      <CurrentAffairsTicker theme={theme} lang={lang} />
      <DailyQuiz theme={theme} lang={lang} />

      {/* 3. Bento Category Sections */}
      <div className="space-y-8">
        
        {/* School Academy (Class 9-12) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-950 dark:text-white tracking-tight flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span>{lang === "bn" ? "স্কুল একাডেমি ও বোর্ড পরীক্ষা (৯ম - ১২শ শ্রেণি)" : "School Academy (Class 9-12)"}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                {lang === "bn" ? "পশ্চিমবঙ্গ মাধ্যমিক ও উচ্চ মাধ্যমিক বোর্ড সিলেবাসের সম্পূর্ণ সমাধান ও চ্যাপ্টার নোট।" : "Complete syllabus summaries, interactive practice & board guidelines."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { id: "9", name_bn: "৯ম শ্রেণি", name_en: "Class 9", desc_en: "Science & Arts basis", desc_bn: "বেসিক ফাউন্ডেশন নোটস", icon: "🎒", color: "from-blue-500/10 to-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30" },
              { id: "10", name_bn: "১০ম শ্রেণি", name_en: "Class 10 (মাধ্যমিক)", desc_en: "Madhyamik Special", desc_bn: "মাধ্যমিক স্পেশাল ও মক টেস্ট", icon: "🏫", color: "from-emerald-500/10 to-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
              { id: "11", name_bn: "১১শ শ্রেণি", name_en: "Class 11", desc_en: "Core Stream Blueprints", desc_bn: "বিজ্ঞান ও কলা বিভাগ", icon: "📚", color: "from-purple-500/10 to-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30" },
              { id: "12", name_bn: "১২শ শ্রেণি", name_en: "Class 12 (উচ্চ মাধ্যমিক)", desc_en: "HS Exam Preparation", desc_bn: "এইচএস ফাইনাল সাজেশন", icon: "🎓", color: "from-amber-500/10 to-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30" }
            ].map((cls) => (
              <motion.button
                key={cls.id}
                onClick={() => {
                  onNavigate("school");
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent("setSchoolClass", { detail: cls.id }));
                  }, 100);
                }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex flex-col justify-between p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all text-left group cursor-pointer h-40"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cls.color} flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform`}>
                  {cls.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{lang === "bn" ? cls.name_bn : cls.name_en}</span>
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500" />
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === "bn" ? cls.desc_bn : cls.desc_en}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Polytechnic Diploma Engineering */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-950 dark:text-white tracking-tight flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Laptop className="h-5 w-5" />
                </div>
                <span>{lang === "bn" ? "কারিগরি ও ডিপ্লোমা ইঞ্জিনিয়ারিং কর্নার" : "Technical & Diploma Engineering"}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                {lang === "bn" ? "WBSCTE পলিটেকনিক ডিপ্লোমা কারিকুলাম, সেমিস্টার ভিত্তিক হ্যান্ডআউটস ও লজিক গেট সিমুলেটর।" : "WBSCTE semester blueprints, lab sheets & digital simulators."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              onClick={() => onNavigate("diploma")}
              whileHover={{ y: -4, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-start gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all text-left group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl shadow-xs shrink-0 group-hover:scale-110 transition-transform">
                🛠️
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    {lang === "bn" ? "পলিটেকনিক ডিপ্লোমা কর্নার" : "Polytechnic Diploma Corner"}
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">WBSCTE</span>
                </div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lang === "bn" 
                    ? "৩ বছরের ডিপ্লোমা ইঞ্জিনিয়ারিং-এর সেমিস্টার ভিত্তিক পিডিএফ, ল্যাব রিপোর্টস এবং ডিজিটাল সার্কিট ল্যাব।" 
                    : "Complete 3-year polytechnic semester blueprints, lab report guides, logic gate tools."}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs font-black text-indigo-600 dark:text-indigo-400">
                  <span>{lang === "bn" ? "ডিপ্লোমা সেকশন খুলুন" : "Explore Diploma Portal"}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.button>

            {/* Govt Exam Corner Card */}
            <motion.button
              onClick={() => onNavigate("govtJobNotes")}
              whileHover={{ y: -4, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-start gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all text-left group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl shadow-xs shrink-0 group-hover:scale-110 transition-transform">
                🏆
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    {lang === "bn" ? "সরকারি চাকরির স্পেশাল নোটস" : "Govt Job Exam Preparation"}
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">WBCS / SSC</span>
                </div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lang === "bn" 
                    ? "WBCS, রেলওয়ে, এসএসসি ও রাজ্য পরীক্ষার জন্য সাধারণ জ্ঞান, গণিত, সংবিধান ও বিজ্ঞানের টপিক ভিত্তিক হ্যান্ডবুক।" 
                    : "Curated study modules for WBCS, Railway NTPC, SSC CGL/CHSL with previous year questions."}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs font-black text-amber-600 dark:text-amber-400">
                  <span>{lang === "bn" ? "চাকরির নোটস দেখুন" : "View Exam Notes"}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Govt Job Subjects Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-950 dark:text-white tracking-tight flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Award className="h-5 w-5" />
                </div>
                <span>{lang === "bn" ? "চাকরির পরীক্ষার বিষয়ভিত্তিক গাইড" : "Subject Modules for Competitive Exams"}</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { id: "math", name_bn: "অঙ্ক (Math)", name_en: "Mathematics", icon: "📐", color: "from-blue-500 to-cyan-500" },
              { id: "reasoning", name_bn: "রিজনিং", name_en: "Reasoning", icon: "🧠", color: "from-purple-500 to-indigo-500" },
              { id: "english", name_bn: "ইংরেজি", name_en: "English", icon: "📝", color: "from-rose-500 to-pink-500" },
              { id: "science", name_bn: "বিজ্ঞান", name_en: "Gen Science", icon: "🔬", color: "from-teal-500 to-emerald-500" },
              { id: "history", name_bn: "ইতিহাস", name_en: "History", icon: "🏛️", color: "from-amber-500 to-orange-500" },
              { id: "geography", name_bn: "ভূগোল", name_en: "Geography", icon: "🌍", color: "from-green-500 to-lime-500" },
              { id: "polity", name_bn: "সংবিধান", name_en: "Polity", icon: "⚖️", color: "from-slate-600 to-slate-800" },
              { id: "economics", name_bn: "অর্থনীতি", name_en: "Economics", icon: "📈", color: "from-indigo-500 to-blue-600" }
            ].map((subj) => (
              <motion.button
                key={subj.id}
                onClick={() => { onNavigate("govtJobNotes"); window.dispatchEvent(new CustomEvent("setGovtJobSubject", { detail: subj.id })); }}
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="flex flex-col items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all text-center cursor-pointer group"
              >
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${subj.color} flex items-center justify-center text-xl shadow-xs text-white group-hover:scale-110 transition-transform`}>
                  {subj.icon}
                </div>
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                  {lang === "bn" ? subj.name_bn : subj.name_en}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

      </div>

      {/* 4. SIDE-BY-SIDE MAIN AREA (AI Studio Suite & Recent Notes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start pt-2">
        
        {/* Left Column (5/12): Activity Dashboard & AI Tools */}
        <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
          
          {/* Quick Learning Stats Panel */}
          <div className="bg-slate-950 dark:bg-slate-900 text-white rounded-[2rem] p-6 shadow-xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-3">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" />
                  <span>{lang === "bn" ? "লার্নিং প্রগ্রেস অ্যানালিটিক্স" : "Live Learning Progress"}</span>
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{lang === "bn" ? "রিয়েল-টাইম সিঙ্ক ডাটাবেস" : "Synchronized real-time cloud data"}</p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{t.dashNotesSaved}</span>
                <span className="text-2xl font-black text-white block mt-1">{totalNotes}</span>
              </div>
              
              <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{lang === "bn" ? "ডাউট এআই সমাধান" : "AI Doubts Solved"}</span>
                <span className="text-2xl font-black text-emerald-400 block mt-1">{stats.doubtsSolved || 14}</span>
              </div>

              <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{lang === "bn" ? "অধ্যয়ন সময় (মিনিট)" : "Study Minutes"}</span>
                <span className="text-2xl font-black text-cyan-400 block mt-1">{stats.studyMinutes || 120}</span>
              </div>

              <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{lang === "bn" ? "ভিডিও লেকচার" : "Syllabus Videos"}</span>
                <span className="text-2xl font-black text-rose-400 block mt-1">{stats.videosUploaded || 8}</span>
              </div>
            </div>
          </div>

          {/* AI Tools Suite (Calculator & AI Solver) */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-2 px-1">
              <Cpu className="h-4 w-4 text-emerald-500" />
              <span>{lang === "bn" ? "এআই ও ডিজিটাল টুলস" : "AI & Digital Tools"}</span>
            </h3>

            {/* Scientific Calculator */}
            <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-sm">
                      {lang === "bn" ? "বৈজ্ঞানিক ক্যালকুলেটর" : "Scientific Calculator"}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Trig, Log & Functions</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-4 leading-relaxed">
                {lang === "bn" 
                  ? "ত্রিকোণমিতি, লগারিদম এবং জটিল সমীকরণ হিসাবের মাল্টি-ফাংশন ক্যালকুলেটর।" 
                  : "Solve trigonometric angles, log bases, roots and advanced algebraic expressions."}
              </p>
              <button
                onClick={() => setShowCalcModal(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>{lang === "bn" ? "ক্যালকুলেটর চালু করুন" : "Launch Calculator"}</span>
              </button>
            </div>

            {/* AI Math Solver Launch Card */}
            <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-sm">
                      {lang === "bn" ? "এআই ডাউট সলভার ৩.০" : "AI Doubt Solver 3.0"}
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Powered by Gemini AI</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-4 leading-relaxed">
                {lang === "bn" 
                  ? "যেকোনো জটিল প্রশ্নের ছবি বা টেক্সট দিন, পেয়ে যাবেন ধাপে ধাপে বিস্তারিত সমাধান।" 
                  : "Upload homework questions or type doubts to get comprehensive step-by-step guidance."}
              </p>
              <button
                onClick={() => setShowSolveModal(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{lang === "bn" ? "এআই ইঞ্জিন চালু করুন" : "Launch AI Solver"}</span>
              </button>
            </div>
          </div>

        </motion.div>

        {/* Right Column (7/12): Motivation & Recent Notes */}
        <motion.div variants={itemVariants} className="lg:col-span-7 space-y-6">
          
          {/* Motivation advice card */}
          <div className="p-6 rounded-[2rem] bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-pink-500/10 border border-amber-500/20 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <Quote className="h-4 w-4 text-amber-500" />
                <span>{lang === "bn" ? "দৈনিক স্টাডি মোটিভেশন" : "Daily Study Habit Guide"}</span>
              </span>
              <button 
                onClick={rotateQuote}
                className="p-2 hover:bg-amber-500/15 text-amber-700 dark:text-amber-300 rounded-xl transition-colors cursor-pointer"
                title="Next Advice"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            <motion.p 
              key={quoteIdx}
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed"
            >
              "{lang === "bn" ? studyAdvice[quoteIdx].bn : studyAdvice[quoteIdx].en}"
            </motion.p>
          </div>

          {/* Study Notes Library Card List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-lg font-black text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
                  <BookOpenCheck className="h-5 w-5 text-emerald-500" />
                  <span>{lang === "bn" ? "সম্প্রতি সংরক্ষিত নোটসমূহ" : "Recent Notes Library"}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                  {lang === "bn" ? "ক্লাস নোট, এআই সামারি ও ফ্ল্যাশকার্ড পর্যালোচনা করুন।" : "Review handwritten notes or create new study summaries."}
                </p>
              </div>
              <button
                onClick={() => onNavigate("notes")}
                className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 px-3 py-1.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all cursor-pointer"
              >
                <span>{lang === "bn" ? "সবগুলো দেখুন" : "View all"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid gap-3.5">
              {notes.slice(0, 4).map((note) => (
                <motion.div
                  key={note.id}
                  onClick={() => onSelectNote(note)}
                  id={`note-card-${note.id}`}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="group relative cursor-pointer rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-xl hover:border-indigo-400 transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="inline-block rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">
                      {note.subject === "Mathematics" ? t.mathSubject : note.subject}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {new Date(note.timestamp).toLocaleDateString(lang === "bn" ? "bn-BD" : undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {note.title}
                  </h3>
                  
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-semibold">
                    {note.content}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-500" />
                      <span>{lang === "bn" ? "বিস্তারিত ও এআই সারাংশ" : "Read Details & AI Summary"}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}

              {notes.length === 0 && (
                <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-slate-50/50 dark:bg-slate-900/50">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-slate-400 opacity-60" />
                  <p className="text-xs font-black text-slate-600 dark:text-slate-400 mb-3">
                    {lang === "bn" ? "এখনও কোনো অধ্যয়ন নোট তৈরি করা নেই।" : "Your study notes library is currently empty."}
                  </p>
                  <button
                    onClick={() => onNavigate("notes")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer transition-all active:scale-95"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>{lang === "bn" ? "নতুন নোট তৈরি করুন" : "Add Your First Note"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </motion.div>
      </div>

      {/* AI Math Solver Modal */}
      <AnimatePresence>
        {showSolveModal && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-0 sm:p-6 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSolveModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity cursor-pointer"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              className={`relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl ${theme.bgCard} rounded-none sm:rounded-3xl shadow-2xl overflow-hidden z-10 border-0 sm:border ${theme.borderCard} flex flex-col`}
            >
              <SolveWithAI 
                lang={lang} 
                theme={theme}
                onClose={() => setShowSolveModal(false)} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen Scientific Calculator Modal */}
      <AnimatePresence>
        {showCalcModal && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCalcModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity cursor-pointer"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              className={`relative w-full max-w-2xl ${theme.bgCard} rounded-3xl shadow-2xl overflow-hidden z-10 border ${theme.borderCard} max-h-[90vh] overflow-y-auto`}
            >
              <ScientificCalculator 
                lang={lang} 
                onClose={() => setShowCalcModal(false)} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
