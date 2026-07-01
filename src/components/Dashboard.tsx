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
  CheckSquare as BookOpenCheck
} from "lucide-react";
import { StudyNote, UserStats } from "../types";
import { Language, TRANSLATIONS } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";
import ScientificCalculator from "./ScientificCalculator";
import SolveWithAI from "./SolveWithAI";
import GeneralKnowledge from "./GeneralKnowledge";
import ImportantQuestions from "./ImportantQuestions";

interface DashboardProps {
  stats: UserStats;
  notes: StudyNote[];
  onNavigate: (tab: "notes" | "chat" | "videos" | "gk") => void;
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

  // Group notes by subject for stats
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
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Hero Welcome Header */}
      <motion.div variants={itemVariants} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${theme.heroGradient} p-8 text-white shadow-xs border ${theme.heroOuterBorder}`}>
        <div className="absolute right-0 top-0 -mr-10 -mt-10 h-48 w-48 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl"></div>
        <div className="absolute top-1/2 left-10 -translate-y-1/2 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl"></div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-2xs font-bold tracking-wider uppercase backdrop-blur-md text-teal-100">
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            {lang === "bn" ? "অধ্যয়ন ও এআই হাব" : "Interactive Study & AI Hub"}
          </span>
          <h1 className={`text-3xl font-black tracking-tight md:text-4xl ${theme.isDark ? theme.textHeroTitle : "text-slate-900"}`}>
            {lang === "bn" ? "স্টাডি হাবে স্বাগতম" : "Welcome to STUDY HUB"}
          </h1>
          <p className={`${theme.isDark ? theme.textHeroSub : "text-slate-700/90"} font-semibold text-xs md:text-sm leading-relaxed max-w-xl`}>
            {lang === "bn"
               ? "এখানে গণিতের সূত্র ও অধ্যয়ন নোটসমূহ সাজান, তাৎক্ষণিকভাবে গুরুত্বপূর্ণ সারাংশ তৈরি করুন, এবং ফ্ল্যাশকার্ড পর্যালোচনা করুন।"
               : "Organize study notes, instantly generate AI-powered summaries, and build custom flashcards."}
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("notes")}
              id="dash-btn-notes"
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black transition-all active:scale-97 cursor-pointer ${theme.heroBtnBg} ${theme.heroBtnText} ${theme.heroBtnHover}`}
            >
              <BookOpen className="h-4 w-4" />
              {lang === "bn" ? "নোট ওয়ার্কস্পেসে যান" : "Go to Notes Workspace"}
            </button>
            <button
              onClick={() => onNavigate("chat")}
              id="dash-btn-chat"
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black transition-all active:scale-97 cursor-pointer ${theme.heroSecondaryBtn} ${theme.heroSecondaryBtnHover}`}
            >
              <MessageSquare className="h-4 w-4" />
              {lang === "bn" ? "এডমিনদের সাথে চ্যাট করুন" : "Chat with assistant"}
            </button>
            <button
              onClick={() => onNavigate("gk")}
              id="dash-btn-gk"
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black transition-all active:scale-97 cursor-pointer bg-amber-500 text-amber-50 hover:bg-amber-600`}
            >
              <BookOpen className="h-4 w-4" />
              {lang === "bn" ? "সাধারণ জ্ঞান" : "General Knowledge"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2-Column Quick Stats Row (Compact, Clean & Symmetric) */}
      <motion.div variants={itemVariants} className="grid gap-4 grid-cols-2 md:grid-cols-2">
        {/* Stat 1: Total Notes */}
        <div className={`rounded-xl border ${theme.borderCard} ${theme.bgCard} p-4 shadow-3xs transition-all ${theme.hoverBorderCard} ${theme.hoverTranslate}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold ${theme.textMuted} uppercase tracking-wider block`}>
              {t.dashNotesSaved}
            </span>
            <div className={`rounded-lg ${theme.primaryBg} p-2 ${theme.primaryText}`}>
              <BookOpen className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className={`text-2xl font-black ${theme.textHeading}`}>{totalNotes}</span>
            <span className={`text-[10px] font-semibold ${theme.primaryText}`}>
              {lang === "bn" ? "টি নোট" : (totalNotes === 1 ? "Note" : "Notes")}
            </span>
          </div>
        </div>

        {/* Stat 2: Video Notes/Lectures */}
        <div className={`rounded-xl border ${theme.borderCard} ${theme.bgCard} p-4 shadow-3xs transition-all ${theme.hoverBorderCard} ${theme.hoverTranslate}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold ${theme.textMuted} uppercase tracking-wider block`}>
              {lang === "bn" ? "ভিডিও লেকচার" : "Video Lectures"}
            </span>
            <div className={`rounded-lg ${theme.accentBg} p-2 ${theme.accentText}`}>
              <Video className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className={`text-2xl font-black ${theme.textHeading}`}>{stats.videosUploaded}</span>
            <span className={`text-[10px] font-semibold ${theme.accentText}`}>
              {lang === "bn" ? "টি ভিডিও" : (stats.videosUploaded === 1 ? "Video" : "Videos")}
            </span>
          </div>
        </div>


      </motion.div>

      {/* Main Content Workspace Layout (2 Columns: Left Spans 3 cols, Right Spans 2 cols) */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-5 items-start">
        
        {/* Left Column (3/5 Width) - Interactive Workspaces */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* 1. Solve with AI Workspace (Prominent & Spacious Center-piece) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-sm font-black ${theme.textHeading} tracking-tight uppercase`}>
                  {lang === "bn" ? "এআই গণিত সমাধান সহকারী" : "AI Math Derivation Engine"}
                </h2>
                <p className={`text-[11px] ${theme.textMuted} font-semibold`}>
                  {lang === "bn" ? "যেকোনো গাণিতিক সমস্যা টাইপ করুন বা ছবি/পিডিএফ আপলোড করে ধাপে ধাপে সমাধান বুঝে নিন" : "Describe a problem or upload photo/PDF to get instant detailed mathematical proofs"}
                </p>
              </div>
            </div>
            <SolveWithAI lang={lang} theme={theme} />
          </div>

          {/* 2. Your Study Notes Center */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h2 className={`text-sm font-black ${theme.textHeading} tracking-tight uppercase flex items-center gap-2`}>
                  <BookOpenCheck className={`h-4.5 w-4.5 ${theme.primaryText}`} />
                  {lang === "bn" ? "অধ্যয়ন নোটসমূহ" : "Your Study Notes Library"}
                </h2>
                <p className={`text-[11px] ${theme.textMuted} font-semibold`}>
                  {lang === "bn" ? "আপনার সংরক্ষিত গণিত অধ্যায় এবং এআই কুইজ ট্র্যাকার" : "Browse notes, review active lessons, or launch self-assessments"}
                </p>
              </div>
              <button
                onClick={() => onNavigate("notes")}
                className={`inline-flex items-center gap-1 text-xs font-bold ${theme.primaryText} cursor-pointer`}
              >
                {lang === "bn" ? "সবগুলো" : "View all"}
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {notes.slice(0, 4).map((note) => (
                <div
                  key={note.id}
                  onClick={() => onSelectNote(note)}
                  id={`note-card-${note.id}`}
                  className={`group relative cursor-pointer rounded-xl border ${theme.borderCard} ${theme.bgCard} p-5 shadow-3xs transition-all ${theme.hoverTranslate} hover:shadow-2xs ${theme.hoverBorderCard}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`inline-block rounded ${theme.badgeBg} px-2 py-0.5 text-3xs font-black uppercase ${theme.badgeText} tracking-wider`}>
                      {note.subject === "Mathematics" ? t.mathSubject : note.subject}
                    </span>
                    <span className={`text-[10px] font-semibold ${theme.textMuted}`}>
                      {new Date(note.timestamp).toLocaleDateString(lang === "bn" ? "bn-BD" : undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <h3 className={`mt-3 font-bold ${theme.textHeading} text-xs line-clamp-1 group-hover:${theme.primaryText}`}>
                    {note.title}
                  </h3>
                  <p className={`mt-1.5 text-2xs ${theme.textMuted} line-clamp-2 leading-relaxed`}>
                    {note.content}
                  </p>
                  <div className={`mt-4 pt-3 border-t ${theme.borderCard} flex items-center justify-between text-[10px] font-bold ${theme.textMuted} group-hover:${theme.primaryText}`}>
                    <span className="flex items-center gap-1 font-semibold">
                      {lang === "bn" ? "বিস্তারিত দেখুন" : "View Details"}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))}
              {notes.length === 0 && (
                <div className={`col-span-2 rounded-xl border border-dashed ${theme.borderCard} p-8 text-center bg-slate-50/50 dark:bg-slate-900/30`}>
                  <p className={`text-xs font-bold ${theme.textMuted}`}>{lang === "bn" ? "এখনও কোনো অধ্যয়ন নোট নেই।" : "No study notes yet."}</p>
                  {role === "Admin" && (
                    <button
                      onClick={() => onNavigate("notes")}
                      className={`mt-3 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-3xs cursor-pointer ${theme.primaryBtn} ${theme.primaryBtnText} ${theme.primaryBtnHover}`}
                    >
                      {lang === "bn" ? "প্রথম নোট তৈরি করুন" : "Create Your First Note"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (2/5 Width) - Interactive Tools & Insights */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Scientific Calculator Option Card (Stunning visual mock launcher) */}
          <div className={`rounded-2xl border ${theme.borderCard} ${theme.bgCard} p-5 shadow-3xs transition-all ${theme.hoverBorderCard} flex flex-col justify-between`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black ${theme.textMuted} uppercase tracking-wider block`}>
                  {lang === "bn" ? "ডিজিটাল গণিত টুল" : "Digital Math Instrument"}
                </span>
                <span className={`inline-flex items-center gap-1 rounded ${theme.badgeBg} px-2 py-0.5 text-[9px] font-bold ${theme.badgeText} uppercase`}>
                  Fullscreen Ready
                </span>
              </div>
              
              <div className="space-y-2">
                <h4 className={`font-extrabold ${theme.textHeading} text-sm flex items-center gap-2`}>
                  <Calculator className={`h-4.5 w-4.5 ${theme.primaryText}`} />
                  {lang === "bn" ? "বৈজ্ঞানিক ক্যালকুলেটর" : "Scientific Calculator"}
                </h4>
                <p className={`text-2xs ${theme.textMuted} leading-relaxed font-semibold`}>
                  {lang === "bn" 
                    ? "জটিল বীজগণিত, ত্রিকোণমিতি এবং ক্যালকুলাস সমীকরণগুলি সমাধান করতে আমাদের পূর্ণাঙ্গ ডিজিটাল বৈজ্ঞানিক ক্যালকুলেটরটি চালু করুন।" 
                    : "Launch our immersive mathematical environment with complete support for advanced trigonometric functions, log bases, roots, and angle modes."}
                </p>
              </div>

              {/* Calculator Visual Button Mockup (Adds great tactile and visual appeal!) */}
              <div className={`${theme.bgPage} border ${theme.borderCard} rounded-xl p-3.5 grid grid-cols-4 gap-1.5 font-mono text-[9px] font-bold text-slate-400 select-none`}>
                <div className={`${theme.bgCard} border ${theme.borderCard} rounded px-1 py-1.5 text-center`}>sin</div>
                <div className={`${theme.bgCard} border ${theme.borderCard} rounded px-1 py-1.5 text-center`}>cos</div>
                <div className={`${theme.bgCard} border ${theme.borderCard} rounded px-1 py-1.5 text-center`}>tan</div>
                <div className={`${theme.primaryBg} ${theme.primaryText} border ${theme.borderCard} rounded px-1 py-1.5 text-center`}>DEG</div>
                <div className={`${theme.bgCard} border ${theme.borderCard} rounded px-1 py-1.5 text-center`}>log</div>
                <div className={`${theme.bgCard} border ${theme.borderCard} rounded px-1 py-1.5 text-center`}>ln</div>
                <div className={`${theme.bgCard} border ${theme.borderCard} rounded px-1 py-1.5 text-center`}>π</div>
                <div className={`${theme.bgCard} border ${theme.borderCard} rounded px-1 py-1.5 text-center`}>e</div>
                <div className={`${theme.bgCard} border ${theme.borderCard} rounded px-1 py-1.5 text-center`}>x²</div>
                <div className={`${theme.bgCard} border ${theme.borderCard} rounded px-1 py-1.5 text-center`}>√</div>
                <div className={`${theme.bgCard} border ${theme.borderCard} rounded px-1 py-1.5 text-center`}>(</div>
                <div className={`${theme.bgCard} border ${theme.borderCard} rounded px-1 py-1.5 text-center`}>)</div>
              </div>
            </div>
            
            <button
              onClick={() => setShowCalcModal(true)}
              className={`mt-5 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-3xs active:scale-98 ${theme.primaryBtn} ${theme.primaryBtnHover} ${theme.primaryBtnText}`}
            >
              <Maximize2 className="h-3.5 w-3.5" />
              {lang === "bn" ? "ফুল স্ক্রিনে বৈজ্ঞানিক ক্যালকুলেটর" : "Open Fullscreen Calculator"}
            </button>
          </div>

          {/* 2. Notes Subject Distribution */}
          <div className={`rounded-xl border ${theme.borderCard} ${theme.bgCard} p-5 shadow-3xs space-y-4`}>
            <h3 className={`font-extrabold ${theme.textHeading} text-xs tracking-wider uppercase`}>
              {lang === "bn" ? "নোটস বিতরণ বিন্যাস" : "Notes Subject Distribution"}
            </h3>
            <div className="space-y-3.5">
              {Object.keys(subjectCounts).length > 0 ? (
                Object.entries(subjectCounts).map(([subj, count]) => {
                  const percentage = Math.round((count / totalNotes) * 100);
                  const subjDisplay = subj === "Mathematics" ? t.mathSubject : subj;
                  return (
                    <div key={subj} className="space-y-1.5">
                      <div className="flex justify-between text-2xs text-slate-600 dark:text-slate-400 font-bold">
                        <span className="flex items-center gap-1">
                          <span className={`h-1.5 w-1.5 rounded-full ${theme.primaryBtn}`}></span>
                          {subjDisplay}
                        </span>
                        <span className={theme.textMuted}>
                          {count} {lang === "bn" ? "টি" : (count === 1 ? "Note" : "Notes")} ({percentage}%)
                        </span>
                      </div>
                      <div className={`h-1.5 w-full ${theme.primaryBg} rounded-full overflow-hidden`}>
                        <div 
                          className={`h-full ${theme.primaryBtn} rounded-full`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className={`text-2xs ${theme.textMuted} font-semibold`}>
                  {role === "Admin"
                    ? (lang === "bn" ? "বিষয়ভিত্তিক ডিস্ট্রিবিউশন দেখতে নতুন নোট তৈরি করুন।" : "Create notes under various subjects to see distribution here.")
                    : (lang === "bn" ? "বিষয়ভিত্তিক ডিস্ট্রিবিউশন দেখতে নোট প্রয়োজন।" : "Notes needed to see subject distribution.")}
                </p>
              )}
            </div>
          </div>

          {/* 3. Daily Study Advice Card */}
          <div className={`rounded-2xl border ${theme.borderCard} ${theme.primaryBg} p-5 shadow-3xs space-y-3`}>
            <h4 className={`font-extrabold ${theme.textHeading} text-xs flex items-center gap-1.5 uppercase tracking-wider`}>
              <span className="text-sm">💡</span> {t.dashDailyAdviceTitle}
            </h4>
            <p className={`text-2xs ${theme.textMain} leading-relaxed font-semibold`}>
              {t.dashDailyAdviceText}
            </p>
          </div>

        </div>
      </motion.div>

      {/* Fullscreen Scientific Calculator Modal */}
      <AnimatePresence>
        {showCalcModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCalcModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            ></motion.div>
            
            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              className={`relative w-full max-w-2xl ${theme.bgCard} rounded-2xl shadow-2xl overflow-hidden z-10 border ${theme.borderCard} max-h-[90vh] overflow-y-auto`}
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
