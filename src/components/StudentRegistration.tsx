import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  CheckCircle, 
  Heart,
  Calendar,
  Building,
  Crown,
  RefreshCw,
  AlertCircle,
  Clock,
  UserPlus,
  ShieldAlert,
  Search,
  CheckCircle2,
  Send,
  Lock,
  Eye,
  EyeOff,
  Key
} from "lucide-react";
import { StudentProfile } from "../types";
import AppLogo from "./AppLogo";
import { Language, TRANSLATIONS } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";
import StudentAccessRequestModal from "./StudentAccessRequestModal";

interface StudentRegistrationProps {
  onRegister: (profile: StudentProfile) => void;
  lang: Language;
  theme: ThemeConfig;
}

export default function StudentRegistration({ onRegister, lang, theme }: StudentRegistrationProps) {
  const t = TRANSLATIONS[lang];
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [institution, setInstitution] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"Student" | "Admin">("Student");
  
  // Admin Passcode state
  const [adminPasscode, setAdminPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);

  // Join Request Modal state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [accessNotice, setAccessNotice] = useState<{
    type: "pending" | "rejected" | "not_found" | "error";
    message: string;
    details?: any;
  } | null>(null);

  const isBengali = lang === "bn";
  const trimmedEmail = (email || "").trim().toLowerCase();
  const isAdminEmail = trimmedEmail === "mazumderdiptanshu753@gmail.com";

  // Watch email to auto-toggle admin role
  useEffect(() => {
    if (isAdminEmail) {
      setSelectedRole("Admin");
      setAccessNotice(null);
    } else {
      setSelectedRole("Student");
    }
  }, [email, isAdminEmail]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccessNotice(null);

    if (!fullName.trim() || !email.trim()) return;

    // Admin email requires verification of secret passcode
    if (isAdminEmail) {
      if (!adminPasscode.trim()) {
        setAccessNotice({
          type: "error",
          message: isBengali 
            ? "প্রধান অ্যাডমিন অ্যাকাউন্টে প্রবেশ করতে সিকিউরিটি পাসকোড প্রদান আবশ্যক।" 
            : "Admin security passcode is required to access the admin account."
        });
        return;
      }

      setIsSubmitting(true);
      try {
        const verifyRes = await fetch("/api/admin/verify-passcode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: trimmedEmail,
            passcode: adminPasscode.trim()
          })
        });

        if (!verifyRes.ok) {
          const errData = await verifyRes.json().catch(() => ({}));
          setAccessNotice({
            type: "error",
            message: errData?.error || (isBengali ? "ভুল অ্যাডমিন পাসকোড! আপনি এই অ্যাকাউন্টে প্রবেশ করতে পারবেন না।" : "Incorrect admin passcode!")
          });
          setIsSubmitting(false);
          return;
        }

        const profile: StudentProfile = {
          fullName: fullName.trim(),
          email: trimmedEmail,
          age: age.trim() || "24",
          institution: institution.trim() || "Study Hub Administration",
          grade: "High School",
          preferredSubject: "Mathematics",
          registeredAt: new Date().toISOString(),
          avatarUrl: "👑",
          role: "Admin"
        };
        onRegister(profile);
        setIsSubmitting(false);
      } catch (err) {
        setAccessNotice({
          type: "error",
          message: isBengali ? "সার্ভার যাচাইকরণ ত্রুটি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।" : "Server verification failed."
        });
        setIsSubmitting(false);
      }
      return;
    }

    // For regular students: verify approval status
    setIsSubmitting(true);
    try {
      // 1. Check if user is already present in registered users
      const usersRes = await fetch("/api/users");
      if (usersRes.ok) {
        const usersList: StudentProfile[] = await usersRes.json();
        const existing = usersList.find(u => (u?.email || "").trim().toLowerCase() === trimmedEmail);
        if (existing) {
          if (existing.isSuspended) {
            setAccessNotice({
              type: "rejected",
              message: isBengali 
                ? "আপনার অ্যাকাউন্টটি অ্যাডমিন দ্বারা সাময়িকভাবে স্থগিত (Suspended) করা হয়েছে।" 
                : "Your account has been suspended by the administrator."
            });
            setIsSubmitting(false);
            return;
          }
          // Already registered and approved member!
          onRegister(existing);
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Check access request status
      const statusRes = await fetch(`/api/access-requests/status?email=${encodeURIComponent(trimmedEmail)}`);
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        
        if (statusData.status === "approved") {
          // Approved! Can proceed to enter
          const profile: StudentProfile = {
            fullName: fullName.trim() || statusData.request?.fullName || "Student",
            email: trimmedEmail,
            age: age.trim() || "18",
            institution: institution.trim() || statusData.request?.institution || "Educational Institution",
            grade: "High School",
            preferredSubject: statusData.request?.preferredSubject || "Mathematics",
            registeredAt: new Date().toISOString(),
            avatarUrl: "🎓",
            role: "Student"
          };
          onRegister(profile);
          setIsSubmitting(false);
          return;
        }

        if (statusData.status === "pending") {
          setAccessNotice({
            type: "pending",
            message: isBengali
              ? `আপনার আবেদনটি অ্যাডমিনের অনুমোদনের অপেক্ষায় রয়েছে (তারিখ: ${new Date(statusData.request.requestedAt).toLocaleDateString("bn-BD")})। অ্যাডমিন অনুমোদন দিলে আপনার ইমেইলে (${trimmedEmail}) নিশ্চিতকরণ বার্তা পাঠানো হবে।`
              : `Your join request is pending approval by the Admin. Once approved, an official notification will be sent to ${trimmedEmail}.`,
            details: statusData.request
          });
          setIsSubmitting(false);
          return;
        }

        if (statusData.status === "rejected") {
          setAccessNotice({
            type: "rejected",
            message: isBengali
              ? `দুঃখিত! আপনার পূর্বের আবেদনটি অ্যাডমিন কর্তৃক প্রত্যাখ্যাত হয়েছে। কারণ: ${statusData.request.adminNotes || "অনুপযুক্ত তথ্য"}। আপনি পুনরায় নতুন আবেদন পাঠাতে পারেন।`
              : `Your previous request was rejected by the admin. Reason: ${statusData.request.adminNotes || "Incomplete details"}. You may submit a new request.`,
            details: statusData.request
          });
          setIsSubmitting(false);
          return;
        }
      }

      // 3. Not registered and no request found
      setAccessNotice({
        type: "not_found",
        message: isBengali
          ? "এই ইমেইল দিয়ে কোনো অনুমোদিত অ্যাকাউন্ট পাওয়া যায়নি। স্টাডি হাবে প্রবেশ করার জন্য প্রথমে একটি জয়েন রিকোয়েস্ট (Join Request) পাঠাতে হবে।"
          : "No approved account was found for this email. You must submit an Access Request and wait for admin approval."
      });

    } catch (err) {
      console.error("Access verification error:", err);
      setAccessNotice({
        type: "error",
        message: isBengali ? "সার্ভার যাচাই ত্রুটি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।" : "Verification failed. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprovedLogin = (approvedEmail: string) => {
    setEmail(approvedEmail);
    setIsRequestModalOpen(false);
    // Auto fill and prompt user or fetch profile
    fetch("/api/users")
      .then(res => res.json())
      .then(users => {
        const found = users.find((u: any) => (u?.email || "").trim().toLowerCase() === approvedEmail.toLowerCase());
        if (found) {
          onRegister(found);
        } else {
          setAccessNotice({
            type: "pending",
            message: isBengali
              ? "অ্যাকাউন্ট অনুমোদিত! নিচের ফর্মে আপনার নাম পূরণ করে ড্যাশবোর্ডে প্রবেশ করুন।"
              : "Account approved! Complete the form to enter."
          });
        }
      })
      .catch(() => {});
  };

  return (
    <div className="w-full flex items-center justify-center py-2 px-1 sm:py-6 sm:px-4">
      <div className={`max-w-md w-full ${theme.bgCard} rounded-2xl border ${theme.borderCard} shadow-xl overflow-hidden transition-all duration-300 relative mx-auto`}>
        
        {/* Dynamic header brand banner */}
        <div className={`bg-gradient-to-r ${theme.heroGradient} px-3.5 py-3 sm:px-6 sm:py-5 text-slate-900 text-center relative overflow-hidden border-b ${theme.borderCard}`}>
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/30 rounded-full blur-xl"></div>
          <div className="absolute left-0 bottom-0 w-24 h-24 bg-teal-100/40 rounded-full blur-xl"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-1 sm:gap-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500/10 px-2.5 py-0.5 text-[8px] sm:text-xs font-black text-teal-800 border border-teal-500/20 select-none">
              <AppLogo size="sm" className="bg-transparent shadow-none h-3.5 w-3.5 sm:h-4 sm:w-4 animate-pulse" />
              <span>{isBengali ? "স্টাডি হাব পোর্টাল" : "Study Hub Portal"}</span>
            </div>
            <h1 className="text-sm sm:text-lg font-black tracking-tight mt-1 leading-tight text-slate-950">
              {isBengali ? "অনুমোদিত শিক্ষার্থীদের ডিজিটাল মাধ্যম" : "Approved Students Learning Desk"}
            </h1>
            <p className="text-[9px] sm:text-[10px] text-slate-800 max-w-xs mt-0.5 font-bold leading-relaxed">
              {isBengali 
                ? "অ্যাডমিন অনুমোদিত শিক্ষার্থীরা সরাসরি লগইন করুন অথবা নতুন অ্যাকাউন্ট এর জন্য জয়েন রিকোয়েস্ট পাঠান।"
                : "Approved students login directly or request access if you're a new student."}
            </p>
          </div>
        </div>

        {/* Dynamic Transition Canvas */}
        <div className="p-3.5 sm:p-5 space-y-3.5">

          {/* Quick Access Action Bar for New Students */}
          <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-teal-500/10 border border-indigo-500/20 rounded-xl p-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <UserPlus className="h-4 w-4" />
              </div>
              <div>
                <p className={`text-[10px] sm:text-xs font-extrabold ${theme.textHeading} leading-tight`}>
                  {isBengali ? "নতুন শিক্ষার্থী? জয়েন রিকোয়েস্ট পাঠান" : "New Student? Request Access"}
                </p>
                <p className={`text-[8px] sm:text-[9px] ${theme.textMuted} font-semibold leading-tight`}>
                  {isBengali ? "অ্যাডমিন অনুমোদন দিলে আপনার ইমেইলে নোটিফিকেশন যাবে" : "Official approval mail via Admin Gmail"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsRequestModalOpen(true)}
              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] sm:text-[10px] font-black rounded-lg transition-all shadow-xs shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <span>{isBengali ? "আবেদন করুন" : "Apply Now"}</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Notice alerts (Pending, Rejected, Not Found) */}
          <AnimatePresence>
            {accessNotice && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`p-3 rounded-xl border text-xs ${
                  accessNotice.type === "pending"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-300"
                    : accessNotice.type === "rejected"
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-300"
                    : accessNotice.type === "not_found"
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-300"
                    : "bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-300"
                }`}
              >
                <div className="flex items-start gap-2">
                  {accessNotice.type === "pending" && <Clock className="h-4 w-4 shrink-0 text-amber-600 mt-0.5 animate-spin" />}
                  {accessNotice.type === "rejected" && <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />}
                  {accessNotice.type === "not_found" && <AlertCircle className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />}
                  {accessNotice.type === "error" && <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />}
                  
                  <div className="space-y-1.5 flex-1">
                    <p className="font-semibold leading-relaxed text-[11px] sm:text-xs">
                      {accessNotice.message}
                    </p>

                    {accessNotice.type === "not_found" && (
                      <div className="pt-1 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsRequestModalOpen(true);
                            setAccessNotice(null);
                          }}
                          className="px-2.5 py-1 bg-blue-600 text-white rounded-md text-[10px] font-black hover:bg-blue-700 transition cursor-pointer flex items-center gap-1"
                        >
                          <Send className="h-3 w-3" />
                          <span>{isBengali ? "এখনই আবেদন পাঠান" : "Submit Request Now"}</span>
                        </button>
                      </div>
                    )}

                    {accessNotice.type === "pending" && (
                      <div className="text-[9px] font-bold opacity-80 flex items-center gap-1 mt-1">
                        <span>💡 স্ট্যাটাস আপডেট পেতে অ্যাডমিনের সাথে যোগাযোগ রাখুন।</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key="form-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto"
            >
              {/* Form fields */}
              <form onSubmit={handleFormSubmit} className="space-y-2.5 sm:space-y-3 text-left">
                <div className="flex items-center justify-between empty:hidden">
                  {isAdminEmail && (
                    <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full text-[10px] font-black border border-amber-500/20 animate-pulse">
                      <Crown className="h-3 w-3 fill-amber-500" />
                      <span>{isBengali ? "প্রধান প্রশাসক ইমেইল সনাক্ত হয়েছে 👑" : "Primary Admin Email Detected"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2.5">
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
                    <div className="flex items-center justify-between">
                      <label className={`text-[9px] font-extrabold ${theme.textHeading} uppercase tracking-wider block`}>
                        {t.regEmailLabel}
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsRequestModalOpen(true)}
                        className="text-[9px] font-extrabold text-indigo-600 hover:underline cursor-pointer"
                      >
                        {isBengali ? "আবেদনের স্ট্যাটাস?" : "Check Status?"}
                      </button>
                    </div>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${theme.textMuted}`} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.regEmailPlaceholder}
                        className={`w-full rounded-xl border ${theme.borderCard} ${theme.bgPage} pl-9 pr-3 h-9 sm:h-10 text-xs ${theme.textMain} placeholder-slate-400 outline-hidden focus:border-teal-500 focus:bg-transparent focus:ring-1 focus:ring-teal-500/20 transition-all font-semibold`}
                      />
                    </div>
                  </div>

                  {/* Admin Security Passcode Field (Only shown for Admin Email) */}
                  {isAdminEmail && (
                    <motion.div 
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      className="space-y-1.5 p-3 rounded-xl bg-amber-500/10 border-2 border-amber-500/30 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Lock className="h-3.5 w-3.5 text-amber-600 fill-amber-500/20" />
                          <span>{isBengali ? "অ্যাডমিন সিকিউরিটি পাসকোড *" : "Admin Security Passcode *"}</span>
                        </label>
                        <span className="text-[9px] font-black text-amber-700 dark:text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">
                          🔒 {isBengali ? "সুরক্ষা লক" : "Protected"}
                        </span>
                      </div>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-amber-600" />
                        <input
                          type={showPasscode ? "text" : "password"}
                          required
                          value={adminPasscode}
                          onChange={(e) => setAdminPasscode(e.target.value)}
                          placeholder={isBengali ? "গোপন অ্যাডমিন পাসকোড লিখুন..." : "Enter secret admin passcode..."}
                          className="w-full rounded-xl border border-amber-500/40 bg-white/90 dark:bg-slate-900/90 pl-9 pr-10 h-10 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 font-black outline-hidden focus:border-amber-600 focus:ring-2 focus:ring-amber-500/30 transition shadow-inner"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasscode(!showPasscode)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                          title={showPasscode ? "Hide Passcode" : "Show Passcode"}
                        >
                          {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-[9px] font-bold text-amber-900/80 dark:text-amber-300/80 leading-relaxed flex items-center gap-1">
                        <span>🛡️ অননুমোদিত ব্যবহার রোধে শুধুমাত্র সঠিক পাসকোড দিয়ে অ্যাডমিন প্যানেলে ঢোকা যাবে।</span>
                      </p>
                    </motion.div>
                  )}

                  {/* Age input */}
                  <div className="space-y-1">
                    <label className={`text-[9px] font-extrabold ${theme.textHeading} uppercase tracking-wider block`}>
                      {t.regAgeLabel}
                    </label>
                    <div className="relative">
                      <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${theme.textMuted}`} />
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder={t.regAgePlaceholder}
                        className={`w-full rounded-xl border ${theme.borderCard} ${theme.bgPage} pl-9 pr-3 h-9 sm:h-10 text-xs ${theme.textMain} placeholder-slate-400 outline-hidden focus:border-teal-500 focus:bg-transparent focus:ring-1 focus:ring-teal-500/20 transition-all font-semibold`}
                      />
                    </div>
                  </div>

                  {/* Institution input */}
                  <div className="space-y-1">
                    <label className={`text-[9px] font-extrabold ${theme.textHeading} uppercase tracking-wider block`}>
                      {t.regInstitutionLabel}
                    </label>
                    <div className="relative">
                      <Building className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${theme.textMuted}`} />
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder={t.regInstitutionPlaceholder}
                        className={`w-full rounded-xl border ${theme.borderCard} ${theme.bgPage} pl-9 pr-3 h-9 sm:h-10 text-xs ${theme.textMain} placeholder-slate-400 outline-hidden focus:border-teal-500 focus:bg-transparent focus:ring-1 focus:ring-teal-500/20 transition-all font-semibold`}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-1.5 space-y-2">
                  {(() => {
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
                        className={`w-full inline-flex items-center justify-center gap-2 rounded-xl h-10 sm:h-11 text-xs font-black tracking-wider uppercase shadow-md transition-all cursor-pointer relative overflow-hidden border border-white/10 ${
                          isDisabled 
                            ? "opacity-50 pointer-events-none bg-slate-300 dark:bg-slate-800 text-slate-500" 
                            : `bg-gradient-to-r ${btnGradient} ${theme.primaryBtnText}`
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span className="font-bold tracking-widest">
                              {isBengali ? "অনুমোদন ও তথ্য যাচাই হচ্ছে..." : "Verifying student access..."}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                              {isAdminEmail 
                                ? (isBengali ? "অ্যাডমিন প্যানেলে প্রবেশ করুন 👑" : "Enter Admin Dashboard")
                                : (isBengali ? "স্টাডি হাবে প্রবেশ করুন (ড্যাশবোর্ড)" : "Launch My Study Dashboard")
                              }
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
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Safe security footer */}
        <div className="p-2 sm:p-3 border-t border-slate-200 dark:border-slate-800 text-center text-[8px] sm:text-[9px] font-bold tracking-wider text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-center gap-1 uppercase leading-relaxed">
          <span>{isBengali ? "🔒 নিরাপদ শিক্ষার্থী অ্যাক্সেস কন্ট্রোল" : "🔒 Secure Student Access Control"}</span>
          <div className="hidden sm:block h-1 w-1 rounded-full bg-slate-400"></div>
          <span className="flex items-center gap-1 normal-case text-slate-500 dark:text-slate-400">
            Powered by Google Workspace & Gmail API
          </span>
        </div>
      </div>

      {/* Join Request Modal */}
      <StudentAccessRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        lang={lang}
        theme={theme}
        initialEmail={email}
        onApprovedLogin={handleApprovedLogin}
      />
    </div>
  );
}
