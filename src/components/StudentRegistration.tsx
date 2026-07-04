import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  CheckCircle, 
  Layers, 
  Heart,
  Award,
  Phone,
  Lock,
  ArrowLeft,
  RefreshCw,
  Check,
  AlertCircle,
  Fingerprint,
  ShieldCheck,
  GraduationCap,
  Crown,
  Laptop,
  CheckSquare,
  Star
} from "lucide-react";
import { StudentProfile, GradeLevel, Subject } from "../types";
import AppLogo from "./AppLogo";
import { Language, TRANSLATIONS } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";

interface StudentRegistrationProps {
  onRegister: (profile: StudentProfile) => void;
  lang: Language;
  theme: ThemeConfig;
}

export default function StudentRegistration({ onRegister, lang, theme }: StudentRegistrationProps) {
  const t = TRANSLATIONS[lang];
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState<GradeLevel>("High School");
  const [preferredSubject, setPreferredSubject] = useState<Subject>("Mathematics");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"Student" | "Admin">("Student");

  const isBengali = lang === "bn";
  const isAdminEmail = (email || "").trim().toLowerCase() === "mazumderdiptanshu753@gmail.com";

  // Watch email to auto-toggle admin role
  useEffect(() => {
    if (isAdminEmail) {
      setSelectedRole("Admin");
    } else {
      setSelectedRole("Student");
    }
  }, [email]);

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const isAdmin = user.email?.trim().toLowerCase() === "mazumderdiptanshu753@gmail.com";
      const profile: StudentProfile = {
        fullName: user.displayName || "Google User",
        email: user.email || "",
        grade,
        preferredSubject,
        registeredAt: new Date().toISOString(),
        avatarUrl: user.photoURL || (isAdmin ? "👑" : "🎓"),
        role: isAdmin ? "Admin" : "Student"
      };
      onRegister(profile);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert(isBengali ? "গুগল সাইন-ইন ব্যর্থ হয়েছে" : "Google Sign-In Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const finalAvatar = isAdminEmail ? "👑" : "🎓";
      const profile: StudentProfile = {
        fullName: fullName.trim(),
        email: email.trim(),
        grade,
        preferredSubject,
        registeredAt: new Date().toISOString(),
        avatarUrl: finalAvatar,
        role: isAdminEmail ? "Admin" : "Student"
      };
      onRegister(profile);
      setIsSubmitting(false);
    }, 850);
  };

  return (
    <div className="w-full flex items-center justify-center py-1.5 px-1 sm:py-6 sm:px-4">
      <div className={`max-w-md w-full ${theme.bgCard} rounded-2xl border ${theme.borderCard} shadow-xl overflow-hidden transition-all duration-300 relative mx-auto`}>
        {/* Dynamic header brand banner */}
        <div className={`bg-gradient-to-r ${theme.heroGradient} px-3.5 py-3 sm:px-6 sm:py-5 text-white text-center relative overflow-hidden border-b ${theme.borderCard}`}>
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute left-0 bottom-0 w-24 h-24 bg-teal-50/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-1 sm:gap-1.5">
            <div className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-0.5 text-[8px] sm:text-xs font-semibold backdrop-blur-md border border-white/10 select-none">
              <AppLogo size="sm" className="bg-transparent shadow-none h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{isBengali ? "স্টাডি হাব পোর্টাল" : "Study Hub Portal"}</span>
            </div>
            <h1 className="text-sm sm:text-lg font-black tracking-tight mt-0.5 leading-tight">
              {isBengali ? "জ্ঞান অর্জনের সেরা ডিজিটাল মাধ্যম" : "Unleash Your Learning Potential"}
            </h1>
            <p className="hidden sm:block text-[9px] sm:text-[10px] text-white/80 max-w-xs mt-0.5 font-medium leading-relaxed">
              {isBengali 
                ? "সহজ উপায়ে প্রশ্ন সমাধান, কুইজ প্রতিযোগিতা, লেকচার এবং বিশেষজ্ঞ শিক্ষকদের সহায়তা লাভ করুন।"
                : "Ask queries, solve equations with AI, view lectures, and get active guidance."}
            </p>
          </div>
        </div>

        {/* Dynamic Transition Canvas */}
        <div className="p-3 sm:p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key="form-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto"
            >
              {/* Form fields */}
              <form onSubmit={handleFormSubmit} className="space-y-2.5 sm:space-y-3.5 text-left">
                <div className="flex items-center justify-between empty:hidden">
                  {isAdminEmail && (
                    <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full text-[9px] font-black border border-amber-500/20 animate-pulse">
                      <Crown className="h-2.5 w-2.5 fill-amber-500" />
                      <span>{isBengali ? "প্রশাসক ইমেইল সনাক্ত হয়েছে" : "Admin Account Detected"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  {/* Full Name input */}
                  <div className="space-y-1">
                    <label className={`text-[9px] font-extrabold ${theme.textHeading} uppercase tracking-wider block`}>
                      {t.regFullNameLabel}
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${theme.textMuted}`} />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={isBengali ? "যেমন: দীপ্তাংশু মজুমদার" : "e.g. Diptanshu Mazumder"}
                        className={`w-full rounded-xl border ${theme.borderCard} ${theme.bgPage} pl-9 pr-3 h-9 sm:h-10 text-xs ${theme.textMain} placeholder-slate-400 outline-hidden focus:border-teal-500 focus:bg-transparent focus:ring-1 focus:ring-teal-500/20 transition-all font-semibold`}
                      />
                    </div>
                  </div>

                  {/* Email input */}
                  <div className="space-y-1">
                    <label className={`text-[9px] font-extrabold ${theme.textHeading} uppercase tracking-wider block`}>
                      {t.regEmailLabel}
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${theme.textMuted}`} />
                      <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.regEmailPlaceholder}
                        className={`w-full rounded-xl border ${theme.borderCard} ${theme.bgPage} pl-9 pr-3 h-9 sm:h-10 text-xs ${theme.textMain} placeholder-slate-400 outline-hidden focus:border-teal-500 focus:bg-transparent focus:ring-1 focus:ring-teal-500/20 transition-all font-semibold`}
                      />
                    </div>
                  </div>

                  {/* Interactive Grid of Chips for Grade Level (Hidden for Admin) */}
                  {!isAdminEmail && (
                    <div className="space-y-1 animate-fade-in pt-0.5">
                      <label className={`text-[9px] font-extrabold ${theme.textHeading} uppercase tracking-wider block`}>
                        {isBengali ? "আপনার বর্তমান শ্রেণী স্তর" : "Your Education Level"}
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                        {[
                          { 
                            id: "Middle School", 
                            nameBnShort: "৫ম - ৮ম", 
                            nameEnShort: "Class 5 - 8", 
                            descBnShort: "মাধ্যমিক স্তর", 
                            descEnShort: "Middle School", 
                            icon: BookOpen 
                          },
                          { 
                            id: "High School", 
                            nameBnShort: "৯ম - ১২শ", 
                            nameEnShort: "Class 9 - 12", 
                            descBnShort: "উচ্চ মাধ্যমিক", 
                            descEnShort: "HSC Prep", 
                            icon: GraduationCap 
                          },
                          { 
                            id: "Undergraduate", 
                            nameBnShort: "স্নাতক ও চাকরি", 
                            nameEnShort: "College / Job", 
                            descBnShort: "চাকরি প্রস্তুতি", 
                            descEnShort: "Govt & BCS", 
                            icon: Award 
                          }
                        ].map((g) => {
                          const IconComp = g.icon;
                          const isSelected = grade === g.id;
                          return (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => setGrade(g.id as GradeLevel)}
                              className={`rounded-xl border p-1.5 sm:p-2 text-center flex flex-col items-center justify-center transition-all duration-200 cursor-pointer relative overflow-hidden h-14 sm:h-20 select-none ${
                                isSelected 
                                  ? "border-teal-500 bg-teal-500/5 text-teal-600 dark:text-teal-400 shadow-[0_4px_12px_rgba(20,184,166,0.06)] font-black"
                                  : `${theme.borderCard} ${theme.bgCard} ${theme.textMain} hover:border-slate-300 dark:hover:border-slate-700`
                              }`}
                            >
                              <div className={`h-5 w-5 sm:h-6.5 sm:w-6.5 rounded-full flex items-center justify-center shrink-0 mb-0.5 sm:mb-1 ${
                                isSelected ? "bg-teal-500 text-white" : "bg-slate-100 dark:bg-slate-850 text-slate-500 dark:text-slate-400"
                              }`}>
                                <IconComp className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                              </div>
                              <div className="min-w-0 text-center w-full">
                                <span className="text-[9px] sm:text-[10px] font-bold leading-tight block truncate">
                                  {isBengali ? g.nameBnShort : g.nameEnShort}
                                </span>
                                <span className={`hidden sm:block text-[8px] leading-none block truncate ${isSelected ? "text-teal-600/80 dark:text-teal-400/80" : "text-slate-400 dark:text-slate-500"} mt-0.5`}>
                                  {isBengali ? g.descBnShort : g.descEnShort}
                                </span>
                              </div>
                              {isSelected && (
                                <div className="absolute right-1 top-1 text-teal-500">
                                  <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-teal-500 text-white dark:text-slate-950" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                 <div className="pt-1 sm:pt-2 space-y-1.5 sm:space-y-2">
                  {(() => {
                    // Premium gradients and glowing styles matching selected theme
                    let btnGradient = "from-emerald-500 via-teal-500 to-cyan-500";
                    let glowColor = "rgba(20, 184, 166, 0.4)";
                    
                    if (theme.id === "cosmic") {
                      btnGradient = "from-indigo-500 via-purple-500 to-pink-500";
                      glowColor = "rgba(124, 58, 237, 0.4)";
                    } else if (theme.id === "aurora") {
                      btnGradient = "from-cyan-500 via-sky-500 to-emerald-500";
                      glowColor = "rgba(6, 182, 212, 0.4)";
                    } else if (theme.id === "sunset") {
                      btnGradient = "from-amber-500 via-orange-500 to-rose-500";
                      glowColor = "rgba(244, 63, 94, 0.4)";
                    }

                    const isDisabled = isSubmitting || !fullName.trim() || !email.trim();

                    return (
                      <motion.button
                        type="submit"
                        id="btn-register-student-new"
                        disabled={isDisabled}
                        whileHover={isDisabled ? {} : { 
                          scale: 1.02,
                          boxShadow: `0 8px 20px ${glowColor}`
                        }}
                        whileTap={isDisabled ? {} : { scale: 0.98 }}
                        className={`w-full inline-flex items-center justify-center gap-2 rounded-xl h-9.5 sm:h-11 text-xs font-black tracking-wider uppercase shadow-md transition-all cursor-pointer relative overflow-hidden border border-white/10 ${
                          isDisabled 
                            ? "opacity-50 pointer-events-none bg-slate-300 dark:bg-slate-800 text-slate-500" 
                            : `bg-gradient-to-r ${btnGradient} ${theme.primaryBtnText}`
                        }`}
                      >
                        {/* Interactive gloss overlay on hover */}
                        {!isDisabled && (
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full hover:animate-shine pointer-events-none" style={{ animationDuration: "2.5s" }} />
                        )}
                        
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span className="font-bold tracking-widest">{isBengali ? "পোর্টাল প্রস্তুত হচ্ছে..." : "Configuring your study desk..."}</span>
                          </>
                        ) : (
                          <>
                            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                              {isBengali ? "পড়াশোনা শুরু করুন (ড্যাশবোর্ড)" : "Launch My Study Dashboard"}
                            </span>
                            <motion.span
                              animate={{ x: [0, 4, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            >
                              <ArrowRight className="h-3.5 w-3.5" />
                            </motion.span>
                          </>
                        )}
                      </motion.button>
                    );
                  })()}

                  <div className="relative flex items-center py-0.5">
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                    <span className={`mx-3 text-[8px] font-extrabold ${theme.textMuted} uppercase tracking-wider`}>
                      {isBengali ? "অথবা" : "or login instantly"}
                    </span>
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSubmitting}
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-xl h-8.5 sm:h-9.5 text-xs font-semibold border ${theme.borderCard} ${theme.bgPage} ${theme.textMain} hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all active:scale-98 disabled:opacity-50 disabled:pointer-events-none cursor-pointer`}
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" xmlns="http://www.w3.org/2000/svg">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                      </g>
                    </svg>
                    <span>{isBengali ? "গুগল অ্যাকাউন্ট দিয়ে সাইন-ইন" : "Sign in with Google"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Playful and clean footer */}
        <div className="p-2 sm:p-3 border-t border-slate-150 dark:border-slate-800 text-center text-[8px] sm:text-[9px] font-bold tracking-wider text-slate-400 dark:text-slate-600 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 uppercase leading-relaxed">
          <span>{isBengali ? "শিক্ষার ডিজিটাল হাব" : "Study Hub Smart Portal"}</span>
          <div className="hidden sm:block h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <span className="flex items-center gap-1 font-semibold normal-case">
            Made with <Heart className="h-2.5 w-2.5 text-rose-500 fill-rose-500 animate-pulse" /> for academic excellence
          </span>
        </div>
      </div>
    </div>
  );
}
