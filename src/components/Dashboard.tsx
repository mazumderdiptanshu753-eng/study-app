import React, { useState, useEffect } from "react";
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
  Zap,
  GraduationCap,
  Laptop,
  Cpu,
  Clock,
  FileText,
  Search,
  CheckSquare,
  BookMarked
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
  const [searchQuery, setSearchQuery] = useState("");

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 16 } }
  };

  // Pre-filter items based on query for quick search across dashboard links
  const portalItems = [
    { name_en: "Polytechnic Diploma Corner", name_bn: "পলিটেকনিক ডিপ্লোমা কর্নার", tab: "diploma", type: "academic" },
    { name_en: "School Academy (9-12)", name_bn: "স্কুল একাডেমি ও বোর্ড পরীক্ষা", tab: "school", type: "academic" },
    { name_en: "Govt Job Prep Subjects", name_bn: "সরকারি চাকরির প্রস্তুতি", tab: "govtJobNotes", type: "prep" },
    { name_en: "Live Classes Portal", name_bn: "লাইভ ক্লাস পোর্টাল", tab: "liveClasses", type: "prep" },
    { name_en: "Community Q&A Forum", name_bn: "ফোরাম ও প্রশ্নোত্তর", tab: "forum", type: "prep" },
    { name_en: "Scientific Calculator", name_bn: "বৈজ্ঞানিক ক্যালকুলেটর", action: "calc", type: "tools" },
    { name_en: "AI 7.0 Solver Engine", name_bn: "এআই ৭.০ সমাধান ইঞ্জিন", action: "solve", type: "tools" }
  ];

  const filteredPortalItems = portalItems.filter(item => {
    const text = (lang === "bn" ? item.name_bn : item.name_en).toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  return (
    <motion.div 
      className="space-y-6 lg:space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* 1. Header Welcome Section with Personalized Layout */}
      <motion.div 
        variants={itemVariants} 
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${theme.heroGradient} p-6 sm:p-8 lg:p-10 text-slate-900 shadow-xl border border-white/20 group`}
      >
        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-white/25 blur-3xl mix-blend-overlay animate-pulse-slow"></div>
        <div className="absolute -bottom-16 -left-16 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl mix-blend-overlay"></div>
        <div className="absolute top-1/3 left-1/4 h-2 w-2 rounded-full bg-indigo-300/40 animate-ping"></div>

        {/* Shine hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Welcome Details */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/10 px-3 py-1 text-[10px] sm:text-[11px] font-black tracking-wider uppercase backdrop-blur-md text-slate-900 border border-slate-900/10 shadow-3xs select-none">
                <Sparkles className="h-3 w-3 text-amber-600 animate-spin" style={{ animationDuration: "5s" }} />
                {lang === "bn" ? "অধ্যয়ন ও এআই হাব" : "Interactive Study & AI Hub"}
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-950">
                {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-teal-950 to-indigo-950">{profile?.fullName || (lang === "bn" ? "শিক্ষার্থী বন্ধু!" : "Scholar!") || "Diptanshu"}</span>
              </h1>
              
              <p className="text-xs sm:text-sm leading-relaxed text-slate-800 font-semibold max-w-xl">
                {lang === "bn"
                   ? "শিক্ষা কার্যক্রমকে সহজ ও সুন্দর করতে স্টাডি হাবে পাবেন সিলেবাস, প্রশ্নপত্র, ভিডিও লেকচার এবং এআই গণিত সমাধান ইঞ্জিন।"
                   : "Your integrated portal for smart summaries, video syllabus guides, daily tickers, polytechnic notes & AI homework helper tools."}
              </p>
            </div>

            {/* Profile Highlight Info Banner & WhatsApp CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a 
                href="https://whatsapp.com/channel/0029VbD7Yyt3AzNVccgfh93K" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#25D366] via-[#1ea851] to-[#128C7E] text-white rounded-2xl font-black text-xs sm:text-sm transition-all shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.65)] hover:scale-[1.02] active:scale-95 border border-white/20 text-center group w-full sm:w-auto cursor-pointer"
              >
                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:animate-shine" />
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 00-5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>{lang === "bn" ? "হোয়াটসঅ্যাপ অফিসিয়াল চ্যানেল" : "Official WhatsApp Channel"}</span>
              </a>

              <button 
                onClick={() => onNavigate("notes")}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-950 text-white hover:bg-slate-900 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <BookMarked className="h-4 w-4 text-emerald-400" />
                <span>{lang === "bn" ? "অধ্যয়ন শুরু করুন" : "Start Learning Now"}</span>
              </button>
            </div>
          </div>
          
          {/* Right Bento Quick Actions */}
          <div className="lg:col-span-5 w-full bg-white/50 backdrop-blur-md p-5 rounded-3xl border border-white/30 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                {lang === "bn" ? "সহজ ড্যাশবোর্ড নেভিগেশন" : "Instant Gateways"}
              </span>
              <span className="text-[10px] bg-slate-950/10 px-2 py-0.5 rounded-md font-bold text-slate-800">Bento 2.0</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Card 1: Study Library */}
              <button 
                onClick={() => onNavigate("notes")}
                className="group p-3.5 bg-white hover:bg-emerald-50 rounded-2xl border border-slate-100 text-left transition-all hover:border-emerald-200 hover:-translate-y-0.5 shadow-3xs cursor-pointer"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 mb-2.5 transition-transform group-hover:scale-110">
                  <BookOpen className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-xs font-black text-slate-900">{lang === "bn" ? "নোটস রুম" : "Notes Room"}</h3>
                <p className="text-[9px] text-slate-500 font-bold mt-0.5">{lang === "bn" ? "হ্যান্ডরাইটিং নোট ও পিডিএফ" : "Handwritten guides & PDF"}</p>
              </button>

              {/* Card 2: Live virtual portal */}
              <button 
                onClick={() => onNavigate("liveClasses")}
                className="group p-3.5 bg-white hover:bg-rose-50 rounded-2xl border border-slate-100 text-left transition-all hover:border-rose-200 hover:-translate-y-0.5 shadow-3xs cursor-pointer"
              >
                <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-800 mb-2.5 transition-transform group-hover:scale-110">
                  <Radio className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-xs font-black text-slate-900">{lang === "bn" ? "লাইভ ক্লাস" : "Live Classes"}</h3>
                <p className="text-[9px] text-slate-500 font-bold mt-0.5">{lang === "bn" ? "অনলাইন ভার্চুয়াল সেশন" : "Virtual live sessions"}</p>
              </button>

              {/* Card 3: Support Chat */}
              <button 
                onClick={() => onNavigate("chat")}
                className="group p-3.5 bg-white hover:bg-blue-50 rounded-2xl border border-slate-100 text-left transition-all hover:border-blue-200 hover:-translate-y-0.5 shadow-3xs cursor-pointer"
              >
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800 mb-2.5 transition-transform group-hover:scale-110">
                  <MessageSquare className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-xs font-black text-slate-900">{lang === "bn" ? "শিক্ষক হেল্প" : "Ask Teacher"}</h3>
                <p className="text-[9px] text-slate-500 font-bold mt-0.5">{lang === "bn" ? "সরাসরি শিক্ষক চ্যাট" : "Admin & Faculty chat"}</p>
              </button>

              {/* Card 4: Community forum */}
              <button 
                onClick={() => onNavigate("forum")}
                className="group p-3.5 bg-white hover:bg-indigo-50 rounded-2xl border border-slate-100 text-left transition-all hover:border-indigo-200 hover:-translate-y-0.5 shadow-3xs cursor-pointer"
              >
                <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-800 mb-2.5 transition-transform group-hover:scale-110">
                  <Users className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-xs font-black text-slate-900">{lang === "bn" ? "আলোচনা সভা" : "Discussion"}</h3>
                <p className="text-[9px] text-slate-500 font-bold mt-0.5">{lang === "bn" ? "ফোরাম ও সাধারণ কুইজ" : "Q&A Forum & board"}</p>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Interactive Search & Tab Filters */}
      <motion.div variants={itemVariants} className="w-full">
        <div className={`p-4 rounded-2xl bg-white border ${theme.borderCard} shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4`}>
          {/* Tab switches */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label_en: "All Portals", label_bn: "সবগুলো" },
              { id: "academic", label_en: "Academic Gateways", label_bn: "একাডেমিক বোর্ড" },
              { id: "prep", label_en: "Preparation & Group", label_bn: "প্রস্তুতি ও আলোচনা" },
              { id: "tools", label_en: "AI Tools", label_bn: "এআই টুলস" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePortalTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activePortalTab === tab.id
                    ? `${theme.primaryBg} ${theme.primaryText} shadow-sm scale-102`
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                }`}
              >
                {lang === "bn" ? tab.label_bn : tab.label_en}
              </button>
            ))}
          </div>

          {/* Mini Search box */}
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "bn" ? "সার্চ করুন (যেমন: স্কুল, ডিপ্লোমা...)" : "Filter portals... (e.g. diploma)"}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-extrabold hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Render Dynamic Search Results if filtering */}
      {searchQuery && (
        <motion.div variants={itemVariants} className="w-full bg-slate-50 border border-slate-150 p-4 rounded-2xl">
          <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2.5">
            Search Results ({filteredPortalItems.length})
          </h4>
          {filteredPortalItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {filteredPortalItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.action === "calc") setShowCalcModal(true);
                    else if (item.action === "solve") setShowSolveModal(true);
                    else if (item.tab) onNavigate(item.tab as any);
                  }}
                  className="p-3 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between text-left shadow-3xs cursor-pointer"
                >
                  <span className="text-xs font-black text-slate-800">
                    {lang === "bn" ? item.name_bn : item.name_en}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-semibold py-2">No matching gateways found. Try searching for "btech", "calculator" or "live".</p>
          )}
        </motion.div>
      )}

      {/* 3. Current Affairs & Daily Quiz */}
      <CurrentAffairsTicker theme={theme} lang={lang} />
      <DailyQuiz theme={theme} lang={lang} />

      {/* 4. MAIN LAYOUT: Tab-based sections / Dynamic Grid */}
      <AnimatePresence mode="wait">
        {(activePortalTab === "all" || activePortalTab === "academic") && (
          <motion.div
            key="academic-section"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* School Academy Gateway Grid */}
            <div className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 px-1">
                <div>
                  <h2 className={`text-lg md:text-xl font-black ${theme.textHeading} tracking-tight uppercase flex items-center gap-2 select-none`}>
                    <GraduationCap className={`h-6 w-6 text-emerald-500 animate-pulse`} />
                    {lang === "bn" ? "স্কুল একাডেমি ও বোর্ড পরীক্ষা প্রস্তুতি (৯ম - ১২শ শ্রেণী)" : "School Academy & Board Prep (Class 9-12)"}
                  </h2>
                  <p className="text-xs text-slate-500 font-bold">পশ্চিমবঙ্গ মাধ্যমিক ও উচ্চ মাধ্যমিক বোর্ড সিলেবাস কভার করতে তৈরি বিশেষ পোর্টাল।</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { id: "9", name_bn: "৯ম শ্রেণী", name_en: "Class 9", desc_en: "Science & Arts basis", desc_bn: "ভিত্তি মজবুত করুন", icon: "🎒", color: "from-blue-500/10 to-blue-500/20 text-blue-600 border-blue-500/30" },
                  { id: "10", name_bn: "১০ম শ্রেণী", name_en: "Class 10 (মাধ্যমিক)", desc_en: "Madhyamik Special", desc_bn: "মাধ্যমিক মক টেস্ট", icon: "🏫", color: "from-emerald-500/10 to-emerald-500/20 text-emerald-600 border-emerald-500/30" },
                  { id: "11", name_bn: "১১শ শ্রেণী", name_en: "Class 11", desc_en: "Core subject streams", desc_bn: "বিজ্ঞান ও কলা বিভাগ", icon: "📚", color: "from-purple-500/10 to-purple-500/20 text-purple-600 border-purple-500/30" },
                  { id: "12", name_bn: "১২শ শ্রেণী", name_en: "Class 12 (উচ্চ মাধ্যমিক)", desc_en: "HS Exam Preparation", desc_bn: "এইচএস লাস্ট মিনিট সাজেশন", icon: "🎓", color: "from-amber-500/10 to-amber-500/20 text-amber-600 border-amber-500/30" }
                ].map((cls) => (
                  <motion.button
                    key={cls.id}
                    onClick={() => {
                      onNavigate("school");
                      setTimeout(() => {
                        window.dispatchEvent(new CustomEvent("setSchoolClass", { detail: cls.id }));
                      }, 100);
                    }}
                    whileHover={{ y: -5, scale: 1.025 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className={`flex flex-col items-start justify-between p-5 rounded-2xl border ${theme.borderCard} ${theme.bgCard} shadow-xs hover:shadow-lg ${getGlowClass()} ${getGlowShadow()} cursor-pointer relative group overflow-hidden h-[155px] text-left`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cls.color} flex items-center justify-center text-2xl shadow-xs transform group-hover:rotate-6 transition-transform`}>
                      {cls.icon}
                    </div>
                    <div>
                      <span className={`text-sm font-black ${theme.textHeading} block`}>
                        {lang === "bn" ? cls.name_bn : cls.name_en}
                      </span>
                      <span className={`text-[10px] font-bold text-slate-500 block mt-1`}>
                        {lang === "bn" ? cls.desc_bn : cls.desc_en}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Technical Studies Section */}
            <div className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 px-1">
                <div>
                  <h2 className={`text-lg md:text-xl font-black ${theme.textHeading} tracking-tight uppercase flex items-center gap-2 select-none`}>
                    <Laptop className={`h-6 w-6 text-indigo-500`} />
                    {lang === "bn" ? "কারিগরি ও ডিপ্লোমা ইঞ্জিনিয়ারিং" : "Technical & Diploma Engineering"}
                  </h2>
                  <p className="text-xs text-slate-500 font-bold">WBSCTE পলিটেকনিক ডিপ্লোমা কারিকুলাম, সেমিস্টার ভিত্তিক হ্যান্ডআউটস ও লজিক গেট সিমুলেটর।</p>
                </div>
              </div>
              <div className="max-w-2xl">
                <motion.button
                  onClick={() => onNavigate("diploma")}
                  whileHover={{ y: -4, scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`w-full flex items-start gap-4 p-6 rounded-3xl border ${theme.borderCard} ${theme.bgCard} shadow-xs hover:shadow-lg ${getGlowClass()} ${getGlowShadow()} cursor-pointer relative group overflow-hidden text-left`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 text-emerald-600 border border-emerald-500/30 flex items-center justify-center text-3xl shadow-xs transform group-hover:scale-110 transition-transform shrink-0">
                    🛠️
                  </div>
                  <div className="space-y-1">
                    <span className={`text-base font-black ${theme.textHeading} block group-hover:text-emerald-600 transition-colors`}>
                      {lang === "bn" ? "পলিটেকনিক ডিপ্লোমা কর্নার" : "Polytechnic Diploma Corner"}
                    </span>
                    <p className={`text-xs font-semibold ${theme.textMuted} leading-relaxed`}>
                      {lang === "bn" 
                        ? "WBSCTE কারিকুলাম অনুযায়ী ৩ বছরের ডিপ্লোমা ইঞ্জিনিয়ারিং-এর সেমিস্টার ভিত্তিক পিডিএফ ও লজিক গেট সিমুলেটর।" 
                        : "Complete 3-year polytechnic semester blueprints, lab reports library, logic gates sandbox and custom tools."}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-wide pt-1">
                      {lang === "bn" ? "ডিপ্লোমা গেটওয়ে খুলুন" : "Explore Diploma Gateway"}
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {(activePortalTab === "all" || activePortalTab === "prep") && (
          <motion.div
            key="prep-section"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 mt-6"
          >
            {/* Govt Job Subjects Section with Glowing Cards & Enhanced Graphics */}
            <div className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 px-1">
                <div>
                  <h2 className={`text-lg md:text-xl font-black ${theme.textHeading} tracking-tight uppercase flex items-center gap-2 select-none`}>
                    <Award className={`h-6 w-6 ${theme.primaryText}`} />
                    {lang === "bn" ? "সরকারি চাকরির প্রস্তুতির বিষয়সমূহ" : "Govt Job Preparation Subjects"}
                  </h2>
                  <p className="text-xs text-slate-500 font-bold">WBCS, SSC CGL, রেলওয়ে এবং রাজ্য সরকারি পরীক্ষার জন্য বিশেষভাবে তৈরি ডাইনামিক স্টাডি সায়েন্স ও জিকে কর্নার।</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                {[
                  { id: "math", name_bn: "অঙ্ক (Math)", name_en: "Mathematics", icon: "📐", color: "from-blue-500 to-cyan-500" },
                  { id: "reasoning", name_bn: "রিজনিং", name_en: "Reasoning", icon: "🧠", color: "from-purple-500 to-indigo-500" },
                  { id: "english", name_bn: "ইংরেজি (English)", name_en: "English", icon: "📝", color: "from-rose-500 to-pink-500" },
                  { id: "science", name_bn: "সাধারণ বিজ্ঞান", name_en: "Gen Science", icon: "🔬", color: "from-teal-500 to-emerald-500" },
                  { id: "history", name_bn: "ইতিহাস", name_en: "History", icon: "🏛️", color: "from-amber-500 to-orange-500" },
                  { id: "geography", name_bn: "ভূগোল", name_en: "Geography", icon: "🌍", color: "from-green-500 to-lime-500" },
                  { id: "polity", name_bn: "সংবিধান (Polity)", name_en: "Polity", icon: "⚖️", color: "from-slate-500 to-gray-500" },
                  { id: "economics", name_bn: "অর্থনীতি", name_en: "Economics", icon: "📈", color: "from-indigo-500 to-blue-600" }
                ].map((subj) => (
                  <motion.button
                    key={subj.id}
                    onClick={() => { onNavigate("govtJobNotes"); window.dispatchEvent(new CustomEvent("setGovtJobSubject", { detail: subj.id })); }}
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border ${theme.borderCard} ${theme.bgCard} shadow-xs hover:shadow-lg ${getGlowClass()} ${getGlowShadow()} cursor-pointer relative group overflow-hidden h-[135px]`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${subj.color} flex items-center justify-center text-xl shadow-md transform group-hover:scale-110 transition-transform text-white`}>
                      {subj.icon}
                    </div>
                    <span className={`text-[11px] font-black ${theme.textHeading} text-center select-none leading-snug`}>
                      {lang === "bn" ? subj.name_bn : subj.name_en}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. SIDE-BY-SIDE MAIN AREA (AI Studio Suite & Recent Notes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Dashboard Column (5/12) */}
        <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
          
          {/* Quick Learning Stats Panel */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            {/* Ambient pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-5 border-b border-white/[0.08] pb-3">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">{lang === "bn" ? "অধ্যয়ন ট্র্যাকার" : "Your Activity Dashboard"}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{lang === "bn" ? "সংরক্ষিত সেশন ও অগ্রগতি" : "Real-time sync statistics"}</p>
              </div>
              <span className="text-[9px] uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded-full font-bold">Progress</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl">
                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">{t.dashNotesSaved}</span>
                <span className="text-2xl font-black text-white block mt-1">{totalNotes}</span>
              </div>
              
              <div className="p-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl">
                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">{lang === "bn" ? "ডাউট এআই সমাধান" : "AI Doubts Solved"}</span>
                <span className="text-2xl font-black text-emerald-400 block mt-1">{stats.doubtsSolved || 14}</span>
              </div>

              <div className="p-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl">
                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">{lang === "bn" ? "অধ্যয়ন সময় (মিনিট)" : "Study Minutes"}</span>
                <span className="text-2xl font-black text-cyan-400 block mt-1">{stats.studyMinutes || 120}</span>
              </div>

              <div className="p-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl">
                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">{lang === "bn" ? "উপলব্ধ ভিডিওসমূহ" : "Syllabus Videos"}</span>
                <span className="text-2xl font-black text-rose-400 block mt-1">{stats.videosUploaded || 8}</span>
              </div>
            </div>
          </div>

          {/* AI & Digital Tools Suite Section (Calculator & Solve with AI) */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 px-1 select-none">
              <Cpu className="h-4 w-4 text-emerald-500" />
              {lang === "bn" ? "উন্নত এআই ও ডিজিটাল সাহায্যকারী" : "AI & Advanced Digital Tools Workspace"}
            </h3>

            {/* Scientific Calculator */}
            <div className={`relative overflow-hidden rounded-2xl border ${theme.borderCard} ${theme.bgCard} p-5 shadow-xs hover:shadow-lg transition-all duration-300 ${theme.hoverBorderCard} group`}>
              <div className="space-y-4 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className={`inline-block rounded bg-indigo-100 text-indigo-800 text-[8px] font-black uppercase tracking-wider px-2 py-0.5`}>
                      Calculator
                    </span>
                    <h4 className={`font-black ${theme.textHeading} text-sm flex items-center gap-1.5`}>
                      <Calculator className={`h-4.5 w-4.5 text-indigo-500`} />
                      {lang === "bn" ? "বৈজ্ঞানিক ক্যালকুলেটর" : "Scientific Calculator Room"}
                    </h4>
                  </div>
                </div>
                <p className={`text-[11px] ${theme.textMuted} leading-relaxed font-semibold`}>
                  {lang === "bn" 
                    ? "ত্রিকোণমিতি, লগারিদম এবং জটিল গাণিতিক সমীকরণ সমাধান করতে মাল্টি-মোড ক্যালকুলেটর।" 
                    : "Solve log bases, angles, trigonometric, and standard engineering computations."}
                </p>
                <button
                  onClick={() => setShowCalcModal(true)}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black shadow-sm cursor-pointer ${theme.primaryBtn} ${theme.primaryBtnHover} ${theme.primaryBtnText}`}
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  {lang === "bn" ? "ক্যালকুলেটর চালু করুন" : "Launch Calculator"}
                </button>
              </div>
            </div>

            {/* AI Math Solver Launch Card */}
            <div className={`relative overflow-hidden rounded-2xl border ${theme.borderCard} ${theme.bgCard} p-5 shadow-xs hover:shadow-lg transition-all duration-300 ${theme.hoverBorderCard} group`}>
              <div className="space-y-4 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="inline-block rounded bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase tracking-wider px-2 py-0.5">
                      Gemini 1.5
                    </span>
                    <h4 className={`font-black ${theme.textHeading} text-sm flex items-center gap-1.5`}>
                      <Sparkles className={`h-4.5 w-4.5 text-emerald-500`} />
                      {lang === "bn" ? "এআই ৭.০ গণিত সমাধান ইঞ্জিন" : "AI 7.0 Solver Workspace"}
                    </h4>
                  </div>
                </div>
                <p className={`text-[11px] ${theme.textMuted} leading-relaxed font-semibold`}>
                  {lang === "bn" 
                    ? "যেকোনো প্রশ্নের সমাধান, অ্যানালজি এবং সম্পূর্ণ ধাপে ধাপে বিস্তারিত উত্তর পান।" 
                    : "Upload details and solve homework problems instantly with highly accurate step explanations."}
                </p>
                <button
                  onClick={() => setShowSolveModal(true)}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black shadow-sm cursor-pointer ${theme.primaryBtn} ${theme.primaryBtnHover} ${theme.primaryBtnText}`}
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  {lang === "bn" ? "এআই ইঞ্জিন চালু করুন" : "Launch AI Solver"}
                </button>
              </div>
            </div>
          </div>

        </motion.div>

        {/* Right Main Content Column (7/12) */}
        <motion.div variants={itemVariants} className="lg:col-span-7 space-y-6">
          
          {/* Motivation advice card */}
          <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200/60 shadow-3xs">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-black uppercase text-amber-800 flex items-center gap-1.5">
                <Quote className="h-4 w-4 text-amber-600" />
                {lang === "bn" ? "আজকের পড়াশোনার টিপস" : "Daily Micro-Habit Study Guide"}
              </span>
              <button 
                onClick={rotateQuote}
                className="p-1.5 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors cursor-pointer"
                title="Next Advice"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
            <motion.p 
              key={quoteIdx}
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs sm:text-sm font-extrabold text-slate-800 leading-relaxed"
            >
              "{lang === "bn" ? studyAdvice[quoteIdx].bn : studyAdvice[quoteIdx].en}"
            </motion.p>
          </div>

          {/* Study Notes Library Card List */}
          <div className="space-y-4">
            <div className="flex items-end justify-between px-1">
              <div>
                <h2 className={`text-lg font-black ${theme.textHeading} tracking-tight uppercase flex items-center gap-2 select-none`}>
                  <BookOpenCheck className={`h-5 w-5 ${theme.primaryText}`} />
                  {lang === "bn" ? "অধ্যয়ন নোটসমূহ" : "Recent Notes Library"}
                </h2>
                <p className={`text-[11px] ${theme.textMuted} font-semibold`}>
                  {lang === "bn" ? "আপনার সম্প্রতি সংরক্ষিত ক্লাস নোট এবং এআই সারাংশ।" : "Review handwritten notes, summary flashcards or create new lists."}
                </p>
              </div>
              <button
                onClick={() => onNavigate("notes")}
                className={`inline-flex items-center gap-1 text-xs font-black ${theme.primaryBtnText} ${theme.primaryBtn} px-4 py-2 rounded-xl shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer`}
              >
                {lang === "bn" ? "সবগুলো" : "View all"}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid gap-4">
              {notes.slice(0, 3).map((note) => (
                <motion.div
                  key={note.id}
                  onClick={() => onSelectNote(note)}
                  id={`note-card-${note.id}`}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 450, damping: 20 }}
                  className={`group relative cursor-pointer rounded-2xl border ${theme.borderCard} ${theme.bgCard} p-5 shadow-3xs ${theme.hoverBorderCard} ${getGlowClass()} ${getGlowShadow()} overflow-hidden text-left`}
                >
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${theme.heroGradient} opacity-0 group-hover:opacity-5 transition-opacity rounded-bl-full`}></div>
                  
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <span className={`inline-block rounded-md ${theme.badgeBg} px-2 py-0.5 text-[9px] font-black uppercase ${theme.badgeText} tracking-wider`}>
                      {note.subject === "Mathematics" ? t.mathSubject : note.subject}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {new Date(note.timestamp).toLocaleDateString(lang === "bn" ? "bn-BD" : undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>

                  <h3 className={`font-black ${theme.textHeading} text-sm line-clamp-1 group-hover:${theme.primaryText} transition-colors relative z-10`}>
                    {note.title}
                  </h3>
                  
                  <p className={`mt-1.5 text-xs ${theme.textMuted} line-clamp-2 leading-relaxed relative z-10 font-semibold`}>
                    {note.content}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 group-hover:text-emerald-600 transition-colors relative z-10">
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                      {lang === "bn" ? "বিস্তারিত ও এআই সারাংশ" : "Read Details & AI Summary"}
                    </span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              ))}

              {notes.length === 0 && (
                <div className={`rounded-2xl border-2 border-dashed ${theme.borderCard} p-8 text-center bg-slate-50/50`}>
                  <BookOpen className={`h-8 w-8 mx-auto mb-2 text-slate-400 opacity-60`} />
                  <p className={`text-xs font-black text-slate-500 mb-3`}>
                    {lang === "bn" ? "এখনও কোনো অধ্যয়ন নোট তৈরি করা নেই।" : "Your hand-written/study notes library is currently empty."}
                  </p>
                  <button
                    onClick={() => onNavigate("notes")}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black shadow-sm cursor-pointer ${theme.primaryBtn} ${theme.primaryBtnText} ${theme.primaryBtnHover} transition-transform active:scale-95`}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    {lang === "bn" ? "নতুন নোট যুক্ত করুন" : "Add Your First Note"}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 md:p-10">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
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
