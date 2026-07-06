import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  Video, 
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
  Zap
} from "lucide-react";
import { StudyNote, UserStats } from "../types";
import { Language, TRANSLATIONS } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";
import ScientificCalculator from "./ScientificCalculator";
import SolveWithAI from "./SolveWithAI";

interface DashboardProps {
  stats: UserStats;
  notes: StudyNote[];
  onNavigate: (tab: "notes" | "chat" | "videos" | "gk" | "forum" | "liveClasses" | "govtJobNotes") => void;
  onSelectNote: (note: StudyNote) => void;
  lang: Language;
  theme: ThemeConfig;
  role: "Admin" | "Student";
}

export default function Dashboard({
  stats,
  notes,
  onNavigate,
  onSelectNote,
  lang,
  theme,
  role
}: DashboardProps & { role?: "Admin" | "Student" }) {
  const t = TRANSLATIONS[lang];
  const totalNotes = notes.length;
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  const getGlowClass = () => {
    if (theme.id === "emerald") return "hover:glow-emerald";
    if (theme.id === "cosmic") return "hover:glow-indigo";
    if (theme.id === "aurora") return "hover:glow-teal";
    if (theme.id === "sunset") return "hover:glow-amber";
    return "";
  };

  const getGlowShadow = () => {
    if (theme.id === "emerald") return "hover:shadow-emerald-500/10";
    if (theme.id === "cosmic") return "hover:shadow-indigo-500/15";
    if (theme.id === "aurora") return "hover:shadow-cyan-500/10";
    if (theme.id === "sunset") return "hover:shadow-amber-500/10";
    return "";
  };

  const studyAdvice = [
    {
      en: "Focus on one small topic today. Micro-habits beat giant plans!",
      bn: "আজ একটি ছোট বিষয়ের উপর ফোকাস করুন। ছোট ছোট অভ্যাস বড় লক্ষ্যের চেয়েও শক্তিশালী!"
    },
    {
      en: "Take a 5-minute break after every 25 minutes of active reading.",
      bn: "প্রতি ২৫ মিনিট সক্রিয়ভাবে পড়ার পর ৫ মিনিটের জন্য একটি ছোট বিরতি নিন।"
    },
    {
      en: "Don't just read; summarize and explain it aloud or use Study Hub's AI.",
      bn: "শুধু মুখস্থ করবেন না; নিজের ভাষায় সারসংক্ষেপ করুন বা স্টাডি হাবের এআই ব্যবহার করুন।"
    },
    {
      en: "Study hard, stay curious, and track your progress daily in Workspace.",
      bn: "মনোযোগ দিয়ে পড়ুন, কৌতুহলী থাকুন এবং ওয়ার্কস্পেসে প্রতিদিনের প্রগ্রেস ট্র্যাক করুন।"
    },
    {
      en: "Sleep is where memories consolidate. Never compromise on 7-8 hours!",
      bn: "ঘুমের মধ্যেই স্মৃতিগুলো মস্তিষ্কে স্থায়ী হয়। ৭-৮ ঘণ্টার ঘুমে কখনোই ছাড় দেবেন না!"
    }
  ];

  const rotateQuote = () => {
    setQuoteIdx((prev) => (prev + 1) % studyAdvice.length);
  };

  const subjectCounts = notes.reduce((acc, note) => {
    acc[note.subject] = (acc[note.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="space-y-6 lg:space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Premium Redesigned Hero Welcome Header with Majestic Glass/Asymmetrical Layout */}
      <motion.div 
        variants={itemVariants} 
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${theme.heroGradient} p-5 sm:p-8 lg:p-9 text-white shadow-2xl border ${theme.heroOuterBorder} group`}
      >
        {/* Animated Background Spheres & Waves */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-80 w-80 rounded-full bg-white/10 blur-3xl mix-blend-overlay animate-pulse-slow"></div>
        <div className="absolute -bottom-10 left-1/4 h-56 w-56 rounded-full bg-teal-300/10 blur-3xl mix-blend-overlay"></div>
        <div className="absolute top-1/2 left-5 h-2 w-2 rounded-full bg-indigo-200/40 animate-ping"></div>
        <div className="absolute bottom-1/3 right-12 h-3 w-3 rounded-full bg-emerald-200/30 animate-pulse"></div>

        {/* Diagonal Light Beam effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Greeting, Description and Interactive Shimmering WhatsApp CTA */}
          <div className="lg:col-span-6 space-y-3.5 sm:space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] sm:text-[11px] font-black tracking-wider uppercase backdrop-blur-md text-white shadow-xs border border-white/10 select-none">
                <Sparkles className="h-3 w-3 text-amber-300 animate-pulse" />
                {lang === "bn" ? "অধ্যয়ন ও এআই হাব" : "Interactive Study & AI Hub"}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${theme.isDark ? theme.textHeroTitle : "text-white"} drop-shadow-md`}>
                {lang === "bn" ? "স্টাডি হাবে স্বাগতম" : "Welcome to STUDY HUB"}
              </h1>
              
              <p className={`text-[11px] sm:text-xs md:text-sm leading-relaxed ${theme.isDark ? theme.textHeroSub : "text-white/90"} font-medium max-w-lg drop-shadow-xs`}>
                {lang === "bn"
                   ? "আমরা অধ্যয়নের নোটগুলি সংগঠিত করি, তাৎক্ষণিকভাবে এআই-চালিত সারাংশ, পিডিএফ নোট এবং ভিডিও লেকচার তৈরি করি।"
                   : "We organize study notes, instantly generated AI-powered summaries, pdf notes and video lectures"}
              </p>
            </div>

            {/* Glowing Shimmering WhatsApp CTA Button */}
            <div className="pt-1.5 sm:pt-2">
              <a 
                href="https://whatsapp.com/channel/0029VbD7Yyt3AzNVccgfh93K" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-7 sm:py-3.5 bg-gradient-to-r from-[#25D366] via-[#1ea851] to-[#128C7E] text-white rounded-xl font-black text-xs sm:text-sm transition-all shadow-[0_8px_25px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_35px_rgba(37,211,102,0.5)] active:scale-95 border border-white/20 w-full sm:w-auto text-center group"
              >
                {/* Internal Shimmer Animation Layer */}
                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:animate-shine" />
                
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 00-5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span className="relative z-10">{lang === "bn" ? "হোয়াটসঅ্যাপ চ্যানেল" : "WhatsApp Channel"}</span>
              </a>
            </div>
          </div>
          
          {/* Right Column: Premium Interactive Bento Shortcuts Panel (2 rows of 3 columns) */}
          <div className="lg:col-span-6 w-full mt-2 lg:mt-0">
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
              
              {/* Shortcut Item 1: Notes Workspace */}
              <motion.button
                onClick={() => onNavigate("notes")}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="group/btn relative overflow-hidden inline-flex flex-col items-start justify-between rounded-2xl p-2.5 sm:p-3.5 text-left shadow-sm hover:shadow-lg bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 h-[85px] sm:h-[105px] select-none w-full cursor-pointer"
              >
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-emerald-400/20 rounded-full blur-lg group-hover/btn:scale-125 transition-transform pointer-events-none" />
                <div className="rounded-lg bg-emerald-500/20 border border-emerald-500/30 p-1.5 text-emerald-300 group-hover/btn:scale-105 group-hover/btn:bg-emerald-500/35 transition-all">
                  <BookOpen className="h-4 w-4 animate-pulse" />
                </div>
                <div className="w-full min-w-0">
                  <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider font-black text-emerald-200/80 mb-0.5 truncate">Workspace</span>
                  <span className="block text-[10px] sm:text-xs md:text-sm font-black text-white leading-tight truncate">
                    {lang === "bn" ? "নোটস" : "Notes"}
                  </span>
                </div>
              </motion.button>
              
              {/* Shortcut Item 2: Live Classes */}
              <motion.button
                onClick={() => onNavigate("liveClasses")}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="group/btn relative overflow-hidden inline-flex flex-col items-start justify-between rounded-2xl p-2.5 sm:p-3.5 text-left shadow-sm hover:shadow-lg bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 h-[85px] sm:h-[105px] select-none w-full cursor-pointer"
              >
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-rose-500/20 rounded-full blur-lg group-hover/btn:scale-125 transition-transform pointer-events-none" />
                <div className="flex justify-between items-center w-full">
                  <div className="rounded-lg bg-rose-500/20 border border-rose-500/30 p-1.5 text-rose-300 group-hover/btn:scale-105 group-hover/btn:bg-rose-500/35 transition-all">
                    <Radio className="h-4 w-4 animate-pulse text-rose-450" />
                  </div>
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-550 animate-ping"></span>
                </div>
                <div className="w-full min-w-0">
                  <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider font-black text-rose-200/80 mb-0.5 truncate">Live Portal</span>
                  <span className="block text-[10px] sm:text-xs md:text-sm font-black text-white leading-tight truncate">
                    {lang === "bn" ? "লাইভ ক্লাস" : "Live Classes"}
                  </span>
                </div>
              </motion.button>

              {/* Shortcut Item 3: Video Lectures */}
              <motion.button
                onClick={() => onNavigate("videos")}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="group/btn relative overflow-hidden inline-flex flex-col items-start justify-between rounded-2xl p-2.5 sm:p-3.5 text-left shadow-sm hover:shadow-lg bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 h-[85px] sm:h-[105px] select-none w-full cursor-pointer"
              >
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-cyan-400/20 rounded-full blur-lg group-hover/btn:scale-125 transition-transform pointer-events-none" />
                <div className="rounded-lg bg-cyan-500/20 border border-cyan-500/30 p-1.5 text-cyan-300 group-hover/btn:scale-105 group-hover/btn:bg-cyan-500/35 transition-all">
                  <Video className="h-4 w-4 text-cyan-300" />
                </div>
                <div className="w-full min-w-0">
                  <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider font-black text-cyan-200/80 mb-0.5 truncate">Library</span>
                  <span className="block text-[10px] sm:text-xs md:text-sm font-black text-white leading-tight truncate">
                    {lang === "bn" ? "ভিডিও" : "Videos"}
                  </span>
                </div>
              </motion.button>

              {/* Shortcut Item 4: Support Chat */}
              <motion.button
                onClick={() => onNavigate("chat")}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="group/btn relative overflow-hidden inline-flex flex-col items-start justify-between rounded-2xl p-2.5 sm:p-3.5 text-left shadow-sm hover:shadow-lg bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 h-[85px] sm:h-[105px] select-none w-full cursor-pointer"
              >
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-blue-400/20 rounded-full blur-lg group-hover/btn:scale-125 transition-transform pointer-events-none" />
                <div className="rounded-lg bg-blue-500/20 border border-blue-500/30 p-1.5 text-blue-300 group-hover/btn:scale-105 group-hover/btn:bg-blue-500/35 transition-all">
                  <MessageSquare className="h-4 w-4 text-blue-300" />
                </div>
                <div className="w-full min-w-0">
                  <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider font-black text-blue-200/80 mb-0.5 truncate">AI Assistant</span>
                  <span className="block text-[10px] sm:text-xs md:text-sm font-black text-white leading-tight truncate">
                    {lang === "bn" ? "চ্যাট সাহায্য" : "AI Chat"}
                  </span>
                </div>
              </motion.button>

              {/* Shortcut Item 5: Community Forum */}
              <motion.button
                onClick={() => onNavigate("forum")}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="group/btn relative overflow-hidden inline-flex flex-col items-start justify-between rounded-2xl p-2.5 sm:p-3.5 text-left shadow-sm hover:shadow-lg bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 h-[85px] sm:h-[105px] select-none w-full cursor-pointer"
              >
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-indigo-400/20 rounded-full blur-lg group-hover/btn:scale-125 transition-transform pointer-events-none" />
                <div className="rounded-lg bg-indigo-500/20 border border-indigo-500/30 p-1.5 text-indigo-300 group-hover/btn:scale-105 group-hover/btn:bg-indigo-500/35 transition-all">
                  <Users className="h-4 w-4 text-indigo-300" />
                </div>
                <div className="w-full min-w-0">
                  <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider font-black text-indigo-200/80 mb-0.5 truncate">Q&A Board</span>
                  <span className="block text-[10px] sm:text-xs md:text-sm font-black text-white leading-tight truncate">
                    {lang === "bn" ? "ফোরাম" : "Forum"}
                  </span>
                </div>
              </motion.button>

              {/* Shortcut Item 6: Job Prep & News */}
              <motion.button
                onClick={() => onNavigate("gk")}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="group/btn relative overflow-hidden inline-flex flex-col items-start justify-between rounded-2xl p-2.5 sm:p-3.5 text-left shadow-sm hover:shadow-lg bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 h-[85px] sm:h-[105px] select-none w-full cursor-pointer"
              >
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-amber-400/20 rounded-full blur-lg group-hover/btn:scale-125 transition-transform pointer-events-none" />
                <div className="rounded-lg bg-amber-500/20 border border-amber-500/30 p-1.5 text-amber-300 group-hover/btn:scale-105 group-hover/btn:bg-amber-555 transition-all">
                  <Award className="h-4 w-4 text-amber-300" />
                </div>
                <div className="w-full min-w-0">
                  <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider font-black text-amber-200/80 mb-0.5 truncate">Job Board</span>
                  <span className="block text-[10px] sm:text-xs md:text-sm font-black text-white leading-tight truncate">
                    {lang === "bn" ? "চাকরি খবর" : "Job Prep"}
                  </span>
                </div>
              </motion.button>

            </div>
          </div>
        </div>
      </motion.div>

      {/* Govt Job Subjects Section with Glowing Cards & Enhanced Graphics */}
      <motion.div variants={itemVariants} className="w-full mb-8">
        <div className="flex items-center justify-between mb-5 px-2">
          <h2 className={`text-lg md:text-xl font-extrabold ${theme.textHeading} tracking-tight uppercase flex items-center gap-2 select-none`}>
            <Award className={`h-6 w-6 ${theme.primaryText}`} />
            {lang === "bn" ? "सरकारी চাকরির প্রস্তুতির বিষয়সমূহ" : "Govt Job Preparation Subjects"}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[
            { id: "math", name_bn: "অঙ্ক (Math)", name_en: "Mathematics", icon: "📐", color: "from-blue-500 to-cyan-500" },
            { id: "reasoning", name_bn: "রিজনিং (Reasoning)", name_en: "Reasoning", icon: "🧠", color: "from-purple-500 to-indigo-500" },
            { id: "english", name_bn: "ইংরেজি (English)", name_en: "English", icon: "📝", color: "from-rose-500 to-pink-500" },
            { id: "science", name_bn: "সাধারণ বিজ্ঞান", name_en: "General Science", icon: "🔬", color: "from-teal-500 to-emerald-500" },
            { id: "history", name_bn: "ইতিহাস", name_en: "History", icon: "🏛️", color: "from-amber-500 to-orange-500" },
            { id: "geography", name_bn: "ভূগোল", name_en: "Geography", icon: "🌍", color: "from-green-500 to-lime-500" },
            { id: "polity", name_bn: "সংবিধান (Polity)", name_en: "Polity", icon: "⚖️", color: "from-slate-500 to-gray-500" },
            { id: "economics", name_bn: "অর্থনীতি (Economics)", name_en: "Economics", icon: "📈", color: "from-indigo-500 to-blue-600" }
          ].map((subj) => (
            <motion.button
              key={subj.id}
              onClick={() => { onNavigate("govtJobNotes"); window.dispatchEvent(new CustomEvent("setGovtJobSubject", { detail: subj.id })); }}
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className={`flex flex-col items-center justify-center gap-4 p-5 rounded-2xl border ${theme.borderCard} ${theme.bgCard} shadow-xs hover:shadow-lg ${getGlowClass()} ${getGlowShadow()} cursor-pointer relative group overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${subj.color} flex items-center justify-center text-2xl shadow-md transform group-hover:scale-110 transition-transform`}>
                {subj.icon}
              </div>
              <span className={`text-xs font-black ${theme.textHeading} text-center select-none`}>
                {lang === "bn" ? subj.name_bn : subj.name_en}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Main Grid Layout (12-col grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Sidebar Column (4/12) */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
          
          {/* Quick Stats Grid with Interactive Hover Glow Effects */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`rounded-2xl border ${theme.borderCard} ${theme.bgCard} p-5 shadow-xs transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${theme.hoverBorderCard} ${getGlowClass()} ${getGlowShadow()}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-black ${theme.textMuted} uppercase tracking-wider block select-none`}>
                  {t.dashNotesSaved}
                </span>
                <div className={`rounded-xl ${theme.primaryBg} p-2.5 ${theme.primaryText}`}>
                  <BookOpen className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-3xl font-black ${theme.textHeading}`}>{totalNotes}</span>
              </div>
            </div>

            <div 
              onClick={() => onNavigate("videos")}
              className={`rounded-2xl border ${theme.borderCard} ${theme.bgCard} p-5 shadow-xs transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${theme.hoverBorderCard} ${getGlowClass()} ${getGlowShadow()} cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-black ${theme.textMuted} uppercase tracking-wider block select-none`}>
                  {lang === "bn" ? "ভিডিও পোর্টাল" : "Videos Portal"}
                </span>
                <div className={`rounded-xl ${theme.accentBg} p-2.5 ${theme.accentText}`}>
                  <Video className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-3xl font-black ${theme.textHeading}`}>{stats.videosUploaded}</span>
              </div>
            </div>
          </div>

          {/* Scientific Calculator Launch Card styled with premium borders */}
          <div className={`relative overflow-hidden rounded-2xl border ${theme.borderCard} ${theme.bgCard} p-6 shadow-xs transition-all duration-300 hover:shadow-lg ${theme.hoverBorderCard} ${getGlowClass()} ${getGlowShadow()} group`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${theme.heroGradient} opacity-5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110`}></div>
            <div className="space-y-5 relative z-10">
              <div>
                <span className={`inline-flex items-center gap-1.5 rounded-lg ${theme.badgeBg} px-2.5 py-1 text-[10px] font-black ${theme.badgeText} uppercase tracking-wide mb-3 select-none`}>
                  <Award className="h-3 w-3 animate-bounce" style={{ animationDuration: "3s" }} /> Digital Tool
                </span>
                <h4 className={`font-black ${theme.textHeading} text-base flex items-center gap-2`}>
                  <Calculator className={`h-5 w-5 ${theme.primaryText}`} />
                  {lang === "bn" ? "বৈজ্ঞানিক ক্যালকুলেটর" : "Scientific Calculator"}
                </h4>
                <p className={`text-xs ${theme.textMuted} leading-relaxed font-medium mt-2`}>
                  {lang === "bn" 
                    ? "জটিল বীজগণিত, ত্রিকোণমিতি এবং ক্যালকুলাস সমীকরণগুলি সমাধান করতে আমাদের পূর্ণাঙ্গ ডিজিটাল বৈজ্ঞানিক ক্যালকুলেটরটি চালু করুন।" 
                    : "Launch our immersive mathematical environment with complete support for advanced trigonometric functions, log bases, roots, and angle modes."}
                </p>
              </div>
              
              <button
                onClick={() => setShowCalcModal(true)}
                className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-md active:scale-95 ${theme.primaryBtn} ${theme.primaryBtnHover} ${theme.primaryBtnText}`}
              >
                <Maximize2 className="h-4 w-4" />
                {lang === "bn" ? "ক্যালকুলেটর খুলুন" : "Open Calculator"}
              </button>
            </div>
          </div>

        </motion.div>

        {/* Right Main Content Column (8/12) */}
        <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6 lg:space-y-8">
          
          {/* Study Notes Library Cards */}
          <div className="space-y-4 pt-2">
            <div className="flex items-end justify-between px-1">
              <div>
                <h2 className={`text-lg font-extrabold ${theme.textHeading} tracking-tight uppercase flex items-center gap-2 select-none`}>
                  <BookOpenCheck className={`h-5 w-5 ${theme.primaryText}`} />
                  {lang === "bn" ? "অধ্যয়ন নোটসমূহ" : "Your Study Notes Library"}
                </h2>
                <p className={`text-xs ${theme.textMuted} font-medium mt-1`}>
                  {lang === "bn" ? "আপনার সংরক্ষিত গণিত অধ্যায় এবং এআই কুইজ ট্র্যাকার" : "Browse notes, review active lessons, or launch self-assessments"}
                </p>
              </div>
              <button
                onClick={() => onNavigate("notes")}
                className={`inline-flex items-center gap-1.5 text-xs font-black ${theme.primaryBtnText} ${theme.primaryBtn} px-4 py-2.5 rounded-xl shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer`}
              >
                {lang === "bn" ? "সবগুলো" : "View all"}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

             <div className="grid gap-4 sm:grid-cols-2">
              {notes.slice(0, 4).map((note) => (
                <motion.div
                  key={note.id}
                  onClick={() => onSelectNote(note)}
                  id={`note-card-${note.id}`}
                  whileHover={{ y: -3, scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 450, damping: 20 }}
                  className={`group relative cursor-pointer rounded-2xl border ${theme.borderCard} ${theme.bgCard} p-6 shadow-xs ${theme.hoverBorderCard} ${getGlowClass()} ${getGlowShadow()} overflow-hidden`}
                >
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${theme.heroGradient} opacity-0 group-hover:opacity-5 transition-opacity rounded-bl-full`}></div>
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <span className={`inline-block rounded-md ${theme.badgeBg} px-2.5 py-1 text-[10px] font-black uppercase ${theme.badgeText} tracking-wider`}>
                      {note.subject === "Mathematics" ? t.mathSubject : note.subject}
                    </span>
                    <span className={`text-[10px] font-bold ${theme.textMuted}`}>
                      {new Date(note.timestamp).toLocaleDateString(lang === "bn" ? "bn-BD" : undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <h3 className={`font-black ${theme.textHeading} text-sm line-clamp-1 group-hover:${theme.primaryText} transition-colors relative z-10`}>
                    {note.title}
                  </h3>
                  <p className={`mt-2 text-xs ${theme.textMuted} line-clamp-2 leading-relaxed relative z-10 font-medium`}>
                    {note.content}
                  </p>
                  <div className={`mt-5 pt-4 border-t ${theme.borderCard} flex items-center justify-between text-xs font-bold ${theme.textMuted} group-hover:${theme.primaryText} transition-colors relative z-10`}>
                    <span>{lang === "bn" ? "বিস্তারিত দেখুন" : "View Details"}</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              ))}
              {notes.length === 0 && (
                <div className={`col-span-2 rounded-2xl border-2 border-dashed ${theme.borderCard} p-10 text-center bg-slate-50/50 dark:bg-slate-900/30`}>
                  <BookOpen className={`h-8 w-8 mx-auto mb-3 ${theme.textMuted} opacity-50`} />
                  <p className={`text-sm font-bold ${theme.textMuted} mb-4`}>{lang === "bn" ? "এখনও কোনো অধ্যয়ন নোট নেই।" : "No study notes yet."}</p>
                  {role === "Admin" && (
                    <button
                      onClick={() => onNavigate("notes")}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-sm cursor-pointer ${theme.primaryBtn} ${theme.primaryBtnText} ${theme.primaryBtnHover} transition-transform active:scale-95`}
                    >
                      <BookOpen className="h-4 w-4" />
                      {lang === "bn" ? "প্রথম নোট তৈরি করুন" : "Create Your First Note"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

        </motion.div>
      </div>

      {/* Fullscreen Scientific Calculator Modal with Glass backdrop */}
      <AnimatePresence>
        {showCalcModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCalcModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity cursor-pointer"
            ></motion.div>
            
            {/* Modal Container */}
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
