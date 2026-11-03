import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  ChevronRight, 
  Calculator, 
  Maximize2,
  CheckSquare as BookOpenCheck,
  TrendingUp,
  Award,
  Quote,
  RefreshCw,
  GraduationCap,
  Laptop,
  Cpu,
  FileText,
  BookMarked,
  ArrowUpRight,
  Flame,
  MessageCircle
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return lang === "bn" ? "শুভ সকাল" : "Good Morning";
    if (hour < 17) return lang === "bn" ? "শুভ দুপুর" : "Good Afternoon";
    return lang === "bn" ? "শুভ সন্ধ্যা" : "Good Evening";
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
      {/* Real-time Current Affairs Ticker */}
      <motion.div variants={itemVariants}>
        <CurrentAffairsTicker theme={theme} lang={lang} />
      </motion.div>

      {/* 🌟 Top Hero Welcome & Motivation Bento Card (ওপরের হিরো কার্ড) */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-6 sm:p-8 shadow-xl">
          {/* Background Ambient Glows */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left side: Greetings + Student Info + Streak */}
            <div className="space-y-3.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold backdrop-blur-md shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>{getGreeting()}, {profile?.fullName || (lang === "bn" ? "শিক্ষার্থী" : "Student")}!</span>
                </span>
                
                {/* 5-Day Study Streak Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black shadow-md border border-amber-300/40 animate-pulse">
                  <Flame className="w-4 h-4 text-yellow-200" />
                  <span>{lang === "bn" ? "৫-দিনের স্ট্রিক 🔥" : "5-Day Streak 🔥"}</span>
                </span>

                {profile?.role === "Admin" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-2xs font-black uppercase tracking-wider shadow-xs">
                    👑 ADMIN
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-xs leading-tight">
                  {lang === "bn" ? "স্টাডি হাবে স্বাগতম!" : "Welcome to STUDY HUB!"}
                </h1>
                <p className="text-xs sm:text-sm text-indigo-100 font-semibold mt-1 leading-relaxed">
                  {lang === "bn"
                    ? "পশ্চিমবঙ্গ বোর্ড, উচ্চ মাধ্যমিক, পলিটেকনিক ও সরকারি চাকরির সর্বাঙ্গীন প্রস্তুতি পোর্টাল।"
                    : "Your all-in-one preparation portal for School Boards, Higher Secondary, Technical Studies & Govt Exams."}
                </p>
              </div>

              {/* Smart Study Guidance / Daily Tip */}
              <div className="flex items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md">
                <div className="flex items-start gap-2.5 min-w-0">
                  <Quote className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-white/95 leading-relaxed">
                    "{lang === "bn" ? studyAdvice[quoteIdx].bn : studyAdvice[quoteIdx].en}"
                  </p>
                </div>
                <button
                  onClick={rotateQuote}
                  className="p-1.5 hover:bg-white/20 rounded-xl transition-colors text-white/80 hover:text-white shrink-0 cursor-pointer"
                  title="Next Advice"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right side: WhatsApp Channel Gateway & Quick Action Hub */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              {/* WhatsApp Official Channel Gateway */}
              <a
                href="https://whatsapp.com/channel/0029Vb1P2j7I7Be9V3bV0g0Z"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-emerald-300/40"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[11px] font-black uppercase tracking-wider text-emerald-100">
                      {lang === "bn" ? "অফিসিয়াল চ্যানেল" : "Official Channel"}
                    </span>
                    <span className="block text-xs font-black">
                      {lang === "bn" ? "হোয়াটসঅ্যাপে যুক্ত হোন" : "Join on WhatsApp"}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-100 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Quick Actions Shortcuts */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowCalcModal(true)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/25 text-white text-xs font-bold backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <Calculator className="w-3.5 h-3.5 text-amber-300" />
                  <span>{lang === "bn" ? "ক্যালকুলেটর" : "Calculator"}</span>
                </button>

                <button
                  onClick={() => setShowSolveModal(true)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/25 text-white text-xs font-bold backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-300" />
                  <span>{lang === "bn" ? "এআই সলভ" : "AI Solver"}</span>
                </button>

                <button
                  onClick={() => onNavigate("notes")}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/25 text-white text-xs font-bold backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{lang === "bn" ? "নতুন নোট" : "Write Note"}</span>
                </button>

                <button
                  onClick={() => onNavigate("liveClasses")}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/25 text-white text-xs font-bold backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping mr-0.5" />
                  <span>{lang === "bn" ? "লাইভ ক্লাস" : "Live Class"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Counter Bar at bottom of Hero Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-6 pt-5 border-t border-white/20">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider block truncate">
                  {lang === "bn" ? "মোট নোটস" : "Total Notes"}
                </span>
                <span className="text-base sm:text-lg font-black font-mono text-white">
                  {totalNotes}
                </span>
              </div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 text-amber-300" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider block truncate">
                  {lang === "bn" ? "ডাউট সলভড" : "Doubts Solved"}
                </span>
                <span className="text-base sm:text-lg font-black font-mono text-amber-300">
                  {stats.doubtsSolved || 14}
                </span>
              </div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-400/20 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider block truncate">
                  {lang === "bn" ? "অধ্যয়ন সময়" : "Study Minutes"}
                </span>
                <span className="text-base sm:text-lg font-black font-mono text-emerald-300">
                  {stats.studyMinutes || 120}m
                </span>
              </div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-pink-400/20 flex items-center justify-center shrink-0">
                <Laptop className="w-4 h-4 text-pink-200" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider block truncate">
                  {lang === "bn" ? "ভিডিও লেকচার" : "Lectures"}
                </span>
                <span className="text-base sm:text-lg font-black font-mono text-pink-200">
                  {stats.videosUploaded || 8}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Daily Quiz Banner */}
      <motion.div variants={itemVariants}>
        <DailyQuiz theme={theme} lang={lang} />
      </motion.div>

      {/* Bento Category Sections */}
      <div className="space-y-8">
        
        {/* School Academy (Class 9-12) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>{lang === "bn" ? "স্কুল একাডেমি ও বোর্ড পরীক্ষা" : "School Academy & Board Prep"}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {lang === "bn" ? "৯ম - ১২শ শ্রেণি" : "Class 9 - 12"}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  {lang === "bn" ? "পশ্চিমবঙ্গ মাধ্যমিক ও উচ্চ মাধ্যমিক বোর্ড সিলেবাসের সম্পূর্ণ সমাধান ও চ্যাপ্টার নোট।" : "Complete syllabus summaries, board exam question banks & chapter notes."}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {[
              { id: "9", name_bn: "৯ম শ্রেণি", name_en: "Class 9", board_bn: "WBBSE ফাউন্ডেশন", board_en: "WBBSE Foundation", desc_en: "Science & Arts Basis", desc_bn: "বেসিক ফাউন্ডেশন নোটস", icon: "🎒", accent: "from-blue-500/10 to-indigo-500/5 hover:border-blue-500/50" },
              { id: "10", name_bn: "১০ম শ্রেণি (মাধ্যমিক)", name_en: "Class 10 (Madhyamik)", board_bn: "মাধ্যমিক স্পেশাল", board_en: "Board Examination", desc_en: "Madhyamik Mock Tests", desc_bn: "মাধ্যমিক স্পেশাল ও মক টেস্ট", icon: "🏫", accent: "from-emerald-500/10 to-teal-500/5 hover:border-emerald-500/50" },
              { id: "11", name_bn: "১১শ শ্রেণি", name_en: "Class 11", board_bn: "WBCHSE সেমিস্টার", board_en: "Core Stream Curricula", desc_en: "Science & Arts Streams", desc_bn: "বিজ্ঞান ও কলা বিভাগ", icon: "📚", accent: "from-purple-500/10 to-pink-500/5 hover:border-purple-500/50" },
              { id: "12", name_bn: "১২শ শ্রেণি (উচ্চ মাধ্যমিক)", name_en: "Class 12 (Higher Sec)", board_bn: "উচ্চ মাধ্যমিক ফাইনাল", board_en: "HS Final Suggestions", desc_en: "HS Exam Preparation", desc_bn: "এইচএস ফাইনাল সাজেশন", icon: "🎓", accent: "from-amber-500/10 to-orange-500/5 hover:border-amber-500/50" }
            ].map((cls) => (
              <motion.button
                key={cls.id}
                onClick={() => {
                  onNavigate("school");
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent("setSchoolClass", { detail: cls.id }));
                  }, 100);
                }}
                whileHover={{ y: -3, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex flex-col justify-between p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all text-left group cursor-pointer h-44 overflow-hidden bg-gradient-to-br ${cls.accent}`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
                    {cls.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                    {lang === "bn" ? cls.board_bn : cls.board_en}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{lang === "bn" ? cls.name_bn : cls.name_en}</span>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {lang === "bn" ? cls.desc_bn : cls.desc_en}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Polytechnic & Govt Exam Cards */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Polytechnic Card */}
            <motion.button
              onClick={() => onNavigate("diploma")}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="relative flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-indigo-400 transition-all text-left group cursor-pointer overflow-hidden"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl border border-indigo-500/20 shrink-0 group-hover:scale-105 transition-transform">
                  🛠️
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                      {lang === "bn" ? "পলিটেকনিক ডিপ্লোমা ইঞ্জিনিয়ারিং" : "Polytechnic Diploma Engineering"}
                    </h3>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
                      WBSCTE
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                    {lang === "bn" 
                      ? "৩ বছরের ডিপ্লোমা ইঞ্জিনিয়ারিং-এর সেমিস্টার ভিত্তিক পিডিএফ, ল্যাব রিপোর্টস এবং ডিজিটাল সার্কিট সিমুলেটর।" 
                      : "Complete 3-year polytechnic semester blueprints, lab report guides, and digital logic gate lab."}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-black text-indigo-600 dark:text-indigo-400">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  {lang === "bn" ? "ডিপ্লোমা সেকশন খুলুন" : "Explore Diploma Portal"}
                </span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>

            {/* Govt Job Exam Card */}
            <motion.button
              onClick={() => onNavigate("govtJobNotes")}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="relative flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-amber-400 transition-all text-left group cursor-pointer overflow-hidden"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl border border-amber-500/20 shrink-0 group-hover:scale-105 transition-transform">
                  🏆
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                      {lang === "bn" ? "সরকারি চাকরির স্পেশাল প্রস্তুতি" : "Govt Job Exam Preparation"}
                    </h3>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                      WBCS / SSC
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                    {lang === "bn" 
                      ? "WBCS, রেলওয়ে, এসএসসি ও রাজ্য পরীক্ষার জন্য সাধারণ জ্ঞান, গণিত, সংবিধান ও বিজ্ঞানের টপিক ভিত্তিক হ্যান্ডবুক।" 
                      : "Curated study modules for WBCS, Railway NTPC, SSC CGL/CHSL with previous year questions."}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-black text-amber-600 dark:text-amber-400">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  {lang === "bn" ? "চাকরির নোটস দেখুন" : "View Exam Notes & Modules"}
                </span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          </div>
        </section>

        {/* Govt Job Subjects Grid */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Award className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                {lang === "bn" ? "চাকরির পরীক্ষার বিষয়ভিত্তিক গাইড" : "Subject Modules for Competitive Exams"}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
            {[
              { id: "math", name_bn: "গণিত", name_en: "Mathematics", icon: "📐", color: "from-blue-500 to-cyan-500" },
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
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-amber-400 transition-all text-center cursor-pointer group active:scale-95"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subj.color} flex items-center justify-center text-lg shadow-xs text-white group-hover:scale-105 transition-transform`}>
                  {subj.icon}
                </div>
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 truncate w-full">
                  {lang === "bn" ? subj.name_bn : subj.name_en}
                </span>
              </motion.button>
            ))}
          </div>
        </section>

      </div>

      {/* 4. SIDE-BY-SIDE MAIN AREA (AI Studio Suite & Recent Notes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start pt-2">
        
        {/* Left Column (5/12): Activity Dashboard & AI Tools */}
        <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
          
          {/* Quick Learning Stats Panel */}
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white rounded-3xl p-6 shadow-xl border border-indigo-300/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-5 border-b border-white/20 pb-3">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-200 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>{lang === "bn" ? "লার্নিং প্রগ্রেস অ্যানালিটিক্স" : "Live Learning Progress"}</span>
                </h4>
                <p className="text-[10px] text-indigo-100 mt-0.5">{lang === "bn" ? "রিয়েল-টাইম সিঙ্ক ডাটাবেস" : "Cloud synchronized metrics"}</p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider bg-white/20 text-white border border-white/30 px-2 py-0.5 rounded-md font-black shadow-xs">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-white/15 border border-white/25 rounded-2xl backdrop-blur-xs">
                <span className="text-[10px] font-black text-indigo-100 block uppercase tracking-wider">{t.dashNotesSaved}</span>
                <span className="text-2xl font-black font-mono tabular-nums text-white block mt-1">{totalNotes}</span>
              </div>
              
              <div className="p-3.5 bg-white/15 border border-white/25 rounded-2xl backdrop-blur-xs">
                <span className="text-[10px] font-black text-indigo-100 block uppercase tracking-wider">{lang === "bn" ? "ডাউট এআই সমাধান" : "AI Doubts Solved"}</span>
                <span className="text-2xl font-black font-mono tabular-nums text-amber-300 block mt-1">{stats.doubtsSolved || 14}</span>
              </div>

              <div className="p-3.5 bg-white/15 border border-white/25 rounded-2xl backdrop-blur-xs">
                <span className="text-[10px] font-black text-indigo-100 block uppercase tracking-wider">{lang === "bn" ? "অধ্যয়ন সময় (মিনিট)" : "Study Minutes"}</span>
                <span className="text-2xl font-black font-mono tabular-nums text-emerald-300 block mt-1">{stats.studyMinutes || 120}</span>
              </div>

              <div className="p-3.5 bg-white/15 border border-white/25 rounded-2xl backdrop-blur-xs">
                <span className="text-[10px] font-black text-indigo-100 block uppercase tracking-wider">{lang === "bn" ? "ভিডিও লেকচার" : "Syllabus Videos"}</span>
                <span className="text-2xl font-black font-mono tabular-nums text-rose-200 block mt-1">{stats.videosUploaded || 8}</span>
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
            <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-sm">
                      {lang === "bn" ? "বৈজ্ঞানিক ক্যালকুলেটর" : "Scientific Calculator"}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400">Trig, Log & Functions</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-4 leading-relaxed">
                {lang === "bn" 
                  ? "ত্রিকোণমিতি, লগারিদম এবং জটিল সমীকরণ হিসাবের মাল্টি-ফাংশন ক্যালকুলেটর।" 
                  : "Solve trigonometric angles, log bases, roots and advanced algebraic expressions."}
              </p>
              <button
                onClick={() => setShowCalcModal(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>{lang === "bn" ? "ক্যালকুলেটর চালু করুন" : "Launch Calculator"}</span>
              </button>
            </div>

            {/* AI Math Solver Launch Card */}
            <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
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
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-4 leading-relaxed">
                {lang === "bn" 
                  ? "যেকোনো জটিল প্রশ্নের ছবি বা টেক্সট দিন, পেয়ে যাবেন ধাপে ধাপে বিস্তারিত সমাধান।" 
                  : "Upload homework questions or type doubts to get comprehensive step-by-step guidance."}
              </p>
              <button
                onClick={() => setShowSolveModal(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-98 cursor-pointer"
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
          <div className="p-5 sm:p-6 rounded-3xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <Quote className="h-4 w-4 text-amber-500" />
                <span>{lang === "bn" ? "দৈনিক স্টাডি মোটিভেশন" : "Daily Study Habit Guide"}</span>
              </span>
              <button 
                onClick={rotateQuote}
                className="p-1.5 hover:bg-amber-500/15 text-amber-700 dark:text-amber-400 rounded-xl transition-colors cursor-pointer"
                title="Next Advice"
              >
                <RefreshCw className="h-3.5 w-3.5" />
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
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <BookOpenCheck className="h-4.5 w-4.5 text-emerald-500" />
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

            <div className="grid gap-3">
              {notes.slice(0, 4).map((note) => (
                <motion.div
                  key={note.id}
                  onClick={() => onSelectNote(note)}
                  id={`note-card-${note.id}`}
                  whileHover={{ y: -2, scale: 1.008 }}
                  whileTap={{ scale: 0.99 }}
                  className="group relative cursor-pointer rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-indigo-400 transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                      {note.subject === "Mathematics" ? t.mathSubject : note.subject}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {new Date(note.timestamp).toLocaleDateString(lang === "bn" ? "bn-BD" : undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {note.title}
                  </h3>
                  
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-semibold">
                    {note.content}
                  </p>

                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-500" />
                      <span>{lang === "bn" ? "বিস্তারিত ও এআই সারাংশ" : "Read Details & AI Summary"}</span>
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </motion.div>
              ))}

              {notes.length === 0 && (
                <div className="rounded-3xl border-2 border-dashed border-indigo-200/80 p-8 text-center bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-pink-50/30 shadow-xs">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
                  <p className="text-xs font-black text-indigo-950 mb-3">
                    {lang === "bn" ? "এখনও কোনো অধ্যয়ন নোট তৈরি করা নেই।" : "Your study notes library is currently empty."}
                  </p>
                  <button
                    onClick={() => onNavigate("notes")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer transition-all active:scale-95"
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
              className="absolute inset-0 bg-indigo-950/25 backdrop-blur-md transition-opacity cursor-pointer"
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
              className="absolute inset-0 bg-indigo-950/25 backdrop-blur-md transition-opacity cursor-pointer"
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
