
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
  Award

,
  Users,
  Radio,
} from "lucide-react";
import { StudyNote, UserStats } from "../types";
import { Language, TRANSLATIONS } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";
import ScientificCalculator from "./ScientificCalculator";
import SolveWithAI from "./SolveWithAI";

interface DashboardProps {
  stats: UserStats;
  notes: StudyNote[];
  onNavigate: (tab: "notes" | "chat" | "videos" | "gk" | "forum" | "liveClasses") => void;
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
      {/* Hero Welcome Header (Restyled) */}
      <motion.div variants={itemVariants} className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${theme.heroGradient} p-8 sm:p-10 text-white shadow-xl border ${theme.heroOuterBorder}`}>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-teal-300/20 blur-3xl mix-blend-overlay"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold tracking-widest uppercase backdrop-blur-md text-white shadow-sm border border-white/10">
              <Sparkles className="h-4 w-4 text-amber-200 animate-pulse" />
              {lang === "bn" ? "অধ্যয়ন ও এআই হাব" : "Interactive Study & AI Hub"}
            </span>
            <h1 className={`text-4xl font-black tracking-tighter md:text-5xl ${theme.isDark ? theme.textHeroTitle : "text-white"} drop-shadow-md`}>
              {lang === "bn" ? "স্টাডি হাবে স্বাগতম" : "Welcome to STUDY HUB"}
            </h1>
            
            <p className={`${theme.isDark ? theme.textHeroSub : "text-white/90"} font-medium text-sm md:text-base leading-relaxed max-w-xl drop-shadow-sm`}>
              {lang === "bn"
                 ? "এখানে গণিতের সূত্র ও অধ্যয়ন নোটসমূহ সাজান, তাৎক্ষণিকভাবে গুরুত্বপূর্ণ সারাংশ তৈরি করুন, এবং ফ্ল্যাশকার্ড পর্যালোচনা করুন।"
                 : "Organize study notes, instantly generate AI-powered summaries, and build custom flashcards."}
            </p>
            <div className="pt-2">
              <a 
                href="https://whatsapp.com/channel/0029VbD7Yyt3AzNVccgfh93K" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-[#25D366] to-[#1DA851] text-white rounded-2xl font-bold text-sm md:text-base transition-all shadow-[0_8px_30px_rgba(37,211,102,0.3)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.5)] active:scale-95 border border-white/20 w-full sm:w-auto text-center flex-wrap group animate-[pulse_4s_ease-in-out_infinite]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                {lang === "bn" ? "আমাদের হোয়াটসঅ্যাপ চ্যানেলে যুক্ত হোন" : "Join our WhatsApp Channel"}
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 shrink-0 w-full md:w-auto md:max-w-md lg:max-w-lg mt-6 md:mt-0">
            <button
              onClick={() => onNavigate("notes")}
              className={`inline-flex flex-col items-center justify-center gap-1.5 rounded-2xl px-4 py-4 text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-lg ${theme.heroBtnBg} ${theme.heroBtnText} hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5 text-center`}
            >
              <BookOpen className="h-5 w-5 mb-1" />
              <span>{lang === "bn" ? "নোট ওয়ার্কস্পেস" : "Notes Workspace"}</span>
            </button>
            
            <button
              onClick={() => onNavigate("liveClasses")}
              className={`inline-flex flex-col items-center justify-center gap-1.5 rounded-2xl px-4 py-4 text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-md ${theme.heroSecondaryBtn} hover:bg-white/30 hover:-translate-y-0.5 text-center`}
            >
              <Radio className="h-5 w-5 text-rose-500 mb-1 animate-pulse" />
              <span>{lang === "bn" ? "লাইভ ক্লাস" : "Live Classes"}</span>
            </button>

            <button
              onClick={() => onNavigate("chat")}
              className={`inline-flex flex-col items-center justify-center gap-1.5 rounded-2xl px-4 py-4 text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-md ${theme.heroSecondaryBtn} hover:bg-white/30 hover:-translate-y-0.5 text-center`}
            >
              <MessageSquare className="h-5 w-5 mb-1 text-blue-400" />
              <span>{lang === "bn" ? "সাপোর্ট চ্যাট" : "Support Chat"}</span>
            </button>

            <button
              onClick={() => onNavigate("forum")}
              className={`inline-flex flex-col items-center justify-center gap-1.5 rounded-2xl px-4 py-4 text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-md ${theme.heroSecondaryBtn} hover:bg-white/30 hover:-translate-y-0.5 text-center`}
            >
              <Users className="h-5 w-5 mb-1 text-teal-400" />
              <span>{lang === "bn" ? "ডিসকাশন ফোরাম" : "Community Forum"}</span>
            </button>

            <button
              onClick={() => onNavigate("gk")}
              className={`col-span-1 sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-md ${theme.heroSecondaryBtn} hover:bg-white/30 hover:-translate-y-0.5 text-center`}
            >
              <Award className="h-5 w-5 text-amber-400" />
              <span>{lang === "bn" ? "সরকারি চাকরি প্রস্তুতি ও খবর" : "Govt. Job Prep & News"}</span>
            </button>
          </div>
        </div>
      </motion.div>


      {/* Main Grid Layout (Restyled: 12-col grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Sidebar Column (4/12) */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`rounded-2xl border ${theme.borderCard} ${theme.bgCard} p-5 shadow-sm transition-all hover:shadow-md ${theme.hoverBorderCard}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[11px] font-bold ${theme.textMuted} uppercase tracking-wider block`}>
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

            <div className={`rounded-2xl border ${theme.borderCard} ${theme.bgCard} p-5 shadow-sm transition-all hover:shadow-md ${theme.hoverBorderCard}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[11px] font-bold ${theme.textMuted} uppercase tracking-wider block`}>
                  {lang === "bn" ? "ভিডিও" : "Videos"}
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

          {/* Scientific Calculator Launch Card */}
          <div className={`relative overflow-hidden rounded-2xl border ${theme.borderCard} ${theme.bgCard} p-6 shadow-sm transition-all hover:shadow-md ${theme.hoverBorderCard} group`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${theme.heroGradient} opacity-5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110`}></div>
            <div className="space-y-5 relative z-10">
              <div>
                <span className={`inline-flex items-center gap-1.5 rounded-lg ${theme.badgeBg} px-2.5 py-1 text-[10px] font-black ${theme.badgeText} uppercase tracking-wide mb-3`}>
                  <Award className="h-3 w-3" /> Digital Tool
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
                className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${theme.primaryBtn} ${theme.primaryBtnHover} ${theme.primaryBtnText}`}
              >
                <Maximize2 className="h-4 w-4" />
                {lang === "bn" ? "ক্যালকুলেটর খুলুন" : "Open Calculator"}
              </button>
            </div>
          </div>

          {/* Subject Distribution */}
          <div className={`rounded-2xl border ${theme.borderCard} ${theme.bgCard} p-6 shadow-sm space-y-5`}>
            <div className="flex items-center gap-2">
              <TrendingUp className={`h-5 w-5 ${theme.textMuted}`} />
              <h3 className={`font-black ${theme.textHeading} text-sm tracking-wide uppercase`}>
                {lang === "bn" ? "নোটস বিতরণ বিন্যাস" : "Notes Subject Distribution"}
              </h3>
            </div>
            
            <div className="space-y-4">
              {Object.keys(subjectCounts).length > 0 ? (
                Object.entries(subjectCounts).map(([subj, count]) => {
                  const percentage = Math.round((count / totalNotes) * 100);
                  const subjDisplay = subj === "Mathematics" ? t.mathSubject : subj;
                  return (
                    <div key={subj} className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-bold">
                        <span className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${theme.primaryBtn}`}></span>
                          {subjDisplay}
                        </span>
                        <span className={theme.textMuted}>
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className={`h-2 w-full ${theme.primaryBg} rounded-full overflow-hidden`}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full ${theme.primaryBtn} rounded-full`}
                        ></motion.div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-xl p-4 text-center border border-dashed border-slate-200 dark:border-slate-700">
                  <p className={`text-xs ${theme.textMuted} font-semibold`}>
                    {role === "Admin"
                      ? (lang === "bn" ? "বিষয়ভিত্তিক ডিস্ট্রিবিউশন দেখতে নতুন নোট তৈরি করুন।" : "Create notes under various subjects to see distribution here.")
                      : (lang === "bn" ? "বিষয়ভিত্তিক ডিস্ট্রিবিউশন দেখতে নোট প্রয়োজন।" : "Notes needed to see subject distribution.")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Daily Advice */}
          <div className={`rounded-2xl border ${theme.borderCard} ${theme.primaryBg} p-6 shadow-sm`}>
            <div className="flex gap-4 items-start">
              <div className="text-2xl mt-1">💡</div>
              <div className="space-y-1.5">
                <h4 className={`font-black ${theme.textHeading} text-sm uppercase tracking-wide`}>
                  {t.dashDailyAdviceTitle}
                </h4>
                <p className={`text-xs ${theme.textMain} leading-relaxed font-medium`}>
                  {t.dashDailyAdviceText}
                </p>
              </div>
            </div>
          </div>

        </motion.div>

        {/* Right Main Content Column (8/12) */}
        <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6 lg:space-y-8">
          
          {/* Solve with AI */}
          <div className="space-y-3">
            <div className="px-1">
              <h2 className={`text-lg font-black ${theme.textHeading} tracking-tight uppercase flex items-center gap-2`}>
                <Sparkles className={`h-5 w-5 ${theme.primaryText}`} />
                {lang === "bn" ? "এআই গণিত সমাধান সহকারী" : "AI Math Derivation Engine"}
              </h2>
              <p className={`text-xs ${theme.textMuted} font-medium mt-1`}>
                {lang === "bn" ? "যেকোনো গাণিতিক সমস্যা টাইপ করুন বা ছবি/পিডিএফ আপলোড করে ধাপে ধাপে সমাধান বুঝে নিন" : "Describe a problem or upload photo/PDF to get instant detailed mathematical proofs"}
              </p>
            </div>
            <SolveWithAI lang={lang} theme={theme} />
          </div>

          {/* Study Notes */}
          <div className="space-y-4 pt-2">
            <div className="flex items-end justify-between px-1">
              <div>
                <h2 className={`text-lg font-black ${theme.textHeading} tracking-tight uppercase flex items-center gap-2`}>
                  <BookOpenCheck className={`h-5 w-5 ${theme.primaryText}`} />
                  {lang === "bn" ? "অধ্যয়ন নোটসমূহ" : "Your Study Notes Library"}
                </h2>
                <p className={`text-xs ${theme.textMuted} font-medium mt-1`}>
                  {lang === "bn" ? "আপনার সংরক্ষিত গণিত অধ্যায় এবং এআই কুইজ ট্র্যাকার" : "Browse notes, review active lessons, or launch self-assessments"}
                </p>
              </div>
              <button
                onClick={() => onNavigate("notes")}
                className={`inline-flex items-center gap-1.5 text-xs font-bold ${theme.primaryBtnText} ${theme.primaryBtn} px-4 py-2 rounded-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer`}
              >
                {lang === "bn" ? "সবগুলো" : "View all"}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {notes.slice(0, 4).map((note) => (
                <div
                  key={note.id}
                  onClick={() => onSelectNote(note)}
                  id={`note-card-${note.id}`}
                  className={`group relative cursor-pointer rounded-2xl border ${theme.borderCard} ${theme.bgCard} p-6 shadow-sm transition-all ${theme.hoverTranslate} hover:shadow-md ${theme.hoverBorderCard} overflow-hidden`}
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
                  <p className={`mt-2 text-xs ${theme.textMuted} line-clamp-2 leading-relaxed relative z-10`}>
                    {note.content}
                  </p>
                  <div className={`mt-5 pt-4 border-t ${theme.borderCard} flex items-center justify-between text-xs font-bold ${theme.textMuted} group-hover:${theme.primaryText} transition-colors relative z-10`}>
                    <span>{lang === "bn" ? "বিস্তারিত দেখুন" : "View Details"}</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
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
