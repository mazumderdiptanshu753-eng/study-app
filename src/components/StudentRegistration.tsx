import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Mail, 
  ArrowRight, 
  Calendar,
  Building,
  Crown,
  RefreshCw,
  AlertCircle,
  Clock,
  UserPlus,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Key,
  LogIn,
  Phone,
  GraduationCap,
  Sparkles,
  Search
} from "lucide-react";
import { StudentProfile, isPermanentAdmin } from "../types";
import AppLogo from "./AppLogo";
import { Language, TRANSLATIONS } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";
import { safeFetch } from "../lib/api";

interface StudentRegistrationProps {
  onRegister: (profile: StudentProfile) => void;
  lang: Language;
  theme: ThemeConfig;
}

export default function StudentRegistration({ onRegister, lang, theme }: StudentRegistrationProps) {
  const t = TRANSLATIONS[lang];
  const isBengali = lang === "bn";

  // Active top-level mode: "login" or "signup"
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [adminPasscode, setAdminPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Sign Up Form States
  const [signupFullName, setSignupFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupAge, setSignupAge] = useState("");
  const [signupInstitution, setSignupInstitution] = useState("");
  const [signupTargetExam, setSignupTargetExam] = useState("Secondary / Higher Secondary");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Status Check & Notice state
  const [notice, setNotice] = useState<{
    type: "pending" | "rejected" | "not_found" | "error" | "info" | "success";
    title?: string;
    message: string;
    details?: any;
  } | null>(null);

  const trimmedLoginEmail = (loginEmail || "").trim().toLowerCase();
  const isAdminLoginEmail = isPermanentAdmin(trimmedLoginEmail);

  // Clear notice when switching tabs
  const handleTabSwitch = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setNotice(null);
    if (mode === "signup" && !signupEmail && loginEmail) {
      setSignupEmail(loginEmail);
    }
    if (mode === "login" && !loginEmail && signupEmail) {
      setLoginEmail(signupEmail);
    }
  };

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (!trimmedLoginEmail) return;

    // 1. If admin email: verify passcode
    if (isAdminLoginEmail) {
      if (!adminPasscode.trim()) {
        setNotice({
          type: "error",
          message: isBengali 
            ? "প্রধান অ্যাডমিন অ্যাকাউন্টে প্রবেশ করতে সিকিউরিটি পাসকোড প্রদান আবশ্যক।" 
            : "Admin security passcode is required to access the admin account."
        });
        return;
      }

      setIsLoggingIn(true);
      try {
        const verifyRes = await fetch("/api/admin/verify-passcode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: trimmedLoginEmail,
            passcode: adminPasscode.trim()
          })
        });

        if (!verifyRes.ok) {
          const errData = await verifyRes.json().catch(() => ({}));
          setNotice({
            type: "error",
            message: errData?.error || (isBengali ? "ভুল অ্যাডমিন পাসকোড! অনুগ্রহ করে সঠিক পাসকোড দিন।" : "Incorrect admin passcode!")
          });
          setIsLoggingIn(false);
          return;
        }

        // Passcode verified: load admin profile
        const adminProfile: StudentProfile = {
          fullName: trimmedLoginEmail.includes("mazumder") ? "Diptanshu Mazumder (Admin)" : "Study Hub Official Admin",
          email: trimmedLoginEmail,
          age: "24",
          institution: "Study Hub Official Administration",
          grade: "High School",
          preferredSubject: "Mathematics",
          registeredAt: new Date().toISOString(),
          avatarUrl: "👑",
          role: "Admin"
        };
        onRegister(adminProfile);
      } catch (err) {
        setNotice({
          type: "error",
          message: isBengali ? "সার্ভার সংযোগ ত্রুটি। পুনরায় চেষ্টা করুন।" : "Server verification failed. Please try again."
        });
      } finally {
        setIsLoggingIn(false);
      }
      return;
    }

    // 2. Regular student login
    setIsLoggingIn(true);
    try {
      // Check registered users in database
      const usersRes = await safeFetch("/api/users");
      if (usersRes && usersRes.ok) {
        const cType = usersRes.headers.get("content-type");
        if (cType && cType.includes("application/json")) {
          const usersList: StudentProfile[] = await usersRes.json();
          const existing = usersList.find(u => (u?.email || "").trim().toLowerCase() === trimmedLoginEmail);
          
          if (existing) {
            if (existing.isSuspended) {
              setNotice({
                type: "rejected",
                title: isBengali ? "অ্যাকাউন্ট স্থগিত" : "Account Suspended",
                message: isBengali 
                  ? "আপনার অ্যাকাউন্টটি অ্যাডমিন দ্বারা সাময়িকভাবে স্থগিত (Suspended) করা হয়েছে।" 
                  : "Your account has been suspended by the administrator."
              });
              setIsLoggingIn(false);
              return;
            }

            // Check if password matches
            if (existing.password && loginPassword.trim() !== existing.password) {
              setNotice({
                type: "error",
                message: isBengali ? "ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।" : "Incorrect password! Please enter the correct password."
              });
              setIsLoggingIn(false);
              return;
            }

            // Existing authorized student -> Log in immediately!
            onRegister(existing);
            setIsLoggingIn(false);
            return;
          }
        }
      }

      // 3. Not in registered users -> check access-requests status
      const statusRes = await safeFetch(`/api/access-requests/status?email=${encodeURIComponent(trimmedLoginEmail)}`);
      if (statusRes && statusRes.ok) {
        const cType = statusRes.headers.get("content-type");
        if (cType && cType.includes("application/json")) {
          const statusData = await statusRes.json();
        
        if (statusData.status === "pending") {
          setNotice({
            type: "pending",
            title: isBengali ? "আবেদন অনুমোদনের অপেক্ষায়" : "Request Pending Approval",
            message: isBengali
              ? `আপনার আবেদনটি অ্যাডমিনের অনুমোদনের অপেক্ষায় রয়েছে। অ্যাডমিন অনুমোদন দিলে studyhub2026admin@gmail.com থেকে আপনার কাছে সরাসরি নোটিফিকেশন মেইল যাবে।`
              : `Your access request is currently pending admin approval. Once approved, an official email will be sent from studyhub2026admin@gmail.com.`,
            details: statusData.request
          });
          setIsLoggingIn(false);
          return;
        }

        if (statusData.status === "rejected") {
          setNotice({
            type: "rejected",
            title: isBengali ? "আবেদন প্রত্যাখ্যাত" : "Request Rejected",
            message: isBengali
              ? `দুঃখিত! আপনার পূর্বের আবেদনটি অ্যাডমিন কর্তৃক প্রত্যাখ্যাত হয়েছে (${statusData.request?.adminNotes || "অনুপযুক্ত তথ্য"})। আপনি SIGN UP ট্যাব থেকে পুনরায় নতুন আবেদন করতে পারেন।`
              : `Your request was rejected (${statusData.request?.adminNotes || "Incomplete details"}). You can submit a new request under SIGN UP.`,
            details: statusData.request
          });
          setIsLoggingIn(false);
          return;
        }

        if (statusData.status === "approved") {
          // Request is approved but not populated into users list yet
          const req = statusData.request;
          const newProfile: StudentProfile = {
            fullName: req.fullName || "Student",
            email: req.email,
            age: "18",
            institution: req.institution || "Study Hub",
            grade: "High School",
            preferredSubject: req.preferredSubject || "Mathematics",
            registeredAt: new Date().toISOString(),
            avatarUrl: "🎓",
            role: "Student"
          };
          // Post to users list
          await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProfile)
          });
          onRegister(newProfile);
          setIsLoggingIn(false);
          return;
        }
      }
    }

      // 4. No account and no request found
      setNotice({
        type: "not_found",
        title: isBengali ? "অ্যাকাউন্ট পাওয়া যায়নি" : "Account Not Found",
        message: isBengali
          ? "এই ইমেইল দিয়ে কোনো অনুমোদিত অ্যাকাউন্ট পাওয়া যায়নি। স্টাডি হাবে প্রবেশ করার জন্য অনুগ্রহ করে SIGN UP অপশন থেকে আবেদন করুন।"
          : "No approved account was found for this email. Please switch to the SIGN UP tab to submit an access request."
      });

    } catch (err) {
      setNotice({
        type: "error",
        message: isBengali ? "সার্ভার যাচাইকরণে সমস্যা হয়েছে।" : "Verification failed. Please try again."
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Sign Up submission (Access Request)
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    const emailToUse = (signupEmail || "").trim().toLowerCase();
    if (!signupFullName.trim() || !emailToUse) {
      setNotice({
        type: "error",
        message: isBengali ? "সম্পূর্ণ নাম এবং ইমেইল ঠিকানা আবশ্যক।" : "Full name and email are required."
      });
      return;
    }

    // Check if trying to sign up with admin email
    if (isPermanentAdmin(emailToUse)) {
      setNotice({
        type: "info",
        message: isBengali 
          ? "এটি প্রধান অ্যাডমিন ইমেইল! অনুগ্রহ করে LOG IN ট্যাবে গিয়ে পাসকোড দিয়ে প্রবেশ করুন।" 
          : "This is a permanent admin email. Please use the LOG IN tab with your admin passcode."
      });
      return;
    }

    setIsSigningUp(true);
    try {
      const res = await fetch("/api/access-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: signupFullName.trim(),
          email: emailToUse,
          phone: signupPhone.trim(),
          institution: signupInstitution.trim() || "Independent Student",
          age: signupAge.trim() || "18",
          targetExam: signupTargetExam,
          preferredSubject: "Mathematics"
        })
      });

      if (res.ok) {
        setSignupSuccess(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setNotice({
          type: "error",
          message: data?.error || (isBengali ? "আবেদন জমা দেওয়া যায়নি।" : "Failed to submit sign up request.")
        });
      }
    } catch (err) {
      setNotice({
        type: "error",
        message: isBengali ? "সার্ভার সংযোগে সমস্যা হয়েছে।" : "Connection error. Please try again."
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center py-2 px-1 sm:py-6 sm:px-4">
      <div className={`max-w-md w-full ${theme.bgCard} rounded-2xl border ${theme.borderCard} shadow-xl overflow-hidden transition-all duration-300 relative mx-auto`}>
        
        {/* Dynamic Header Brand Banner */}
        <div className={`bg-gradient-to-r ${theme.heroGradient} px-4 py-3.5 sm:px-6 sm:py-4.5 text-slate-900 text-center relative overflow-hidden border-b ${theme.borderCard}`}>
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/30 rounded-full blur-xl"></div>
          <div className="absolute left-0 bottom-0 w-24 h-24 bg-teal-100/40 rounded-full blur-xl"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500/10 px-2.5 py-0.5 text-[9px] sm:text-xs font-black text-teal-900 border border-teal-500/20 select-none">
              <AppLogo size="sm" className="bg-transparent shadow-none h-4 w-4 animate-pulse" />
              <span>{isBengali ? "স্টাডি হাব পোর্টাল" : "Study Hub Portal"}</span>
            </div>
            
            <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight text-slate-950 mt-0.5">
              {authMode === "login"
                ? (isBengali ? "স্টাডি হাবে লগইন করুন" : "Log In to Study Hub")
                : (isBengali ? "নতুন শিক্ষার্থী সাইন আপ" : "Student Sign Up")
              }
            </h1>
            
            <p className="text-[10px] sm:text-[11px] text-slate-800 max-w-xs font-bold leading-tight">
              {authMode === "login"
                ? (isBengali 
                    ? "অনুমোদিত শিক্ষার্থী বা অ্যাডমিন ইমেইল দিয়ে প্রবেশ করুন" 
                    : "Enter your approved email to access your study desk")
                : (isBengali 
                    ? "অ্যাডমিন অনুমোদনের জন্য তথ্য দিয়ে সাইন আপ করুন" 
                    : "Submit your details for official admission & approval")
              }
            </p>
          </div>
        </div>

        {/* The Two Main Options: LOG IN & SIGN UP */}
        <div className="p-3.5 sm:p-5 space-y-4">
          
          {/* Segmented Control: LOG IN | SIGN UP */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
            <button
              type="button"
              onClick={() => handleTabSwitch("login")}
              className={`py-2 text-xs sm:text-sm font-black rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                authMode === "login"
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200/80 dark:border-slate-700"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <LogIn className="h-4 w-4" />
              <span>LOG IN</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch("signup")}
              className={`py-2 text-xs sm:text-sm font-black rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                authMode === "signup"
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200/80 dark:border-slate-700"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <UserPlus className="h-4 w-4" />
              <span>SIGN UP</span>
            </button>
          </div>

          {/* Interactive Notices / Status Messages */}
          <AnimatePresence>
            {notice && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`p-3 rounded-xl border text-xs ${
                  notice.type === "pending"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-300"
                    : notice.type === "rejected"
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-300"
                    : notice.type === "not_found"
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-300"
                    : notice.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-300"
                    : "bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-300"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {notice.type === "pending" && <Clock className="h-4 w-4 shrink-0 text-amber-600 mt-0.5 animate-spin" />}
                  {notice.type === "rejected" && <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />}
                  {notice.type === "not_found" && <AlertCircle className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />}
                  {notice.type === "error" && <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />}
                  {notice.type === "success" && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />}
                  {notice.type === "info" && <Sparkles className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />}
                  
                  <div className="space-y-1.5 flex-1 text-left">
                    {notice.title && (
                      <p className="font-black text-xs">{notice.title}</p>
                    )}
                    <p className="font-semibold leading-relaxed text-[11px] sm:text-xs">
                      {notice.message}
                    </p>

                    {/* Quick switch to Sign Up if account is not found */}
                    {notice.type === "not_found" && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => handleTabSwitch("signup")}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black transition cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <UserPlus className="h-3 w-3" />
                          <span>{isBengali ? "এখনই SIGN UP করুন" : "Switch to SIGN UP"}</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TAB 1: LOG IN VIEW */}
          {authMode === "login" && (
            <motion.div
              key="login-tab"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-3.5"
            >
              <form onSubmit={handleLoginSubmit} className="space-y-3 text-left">
                
                {/* Admin detected badge */}
                {isAdminLoginEmail && (
                  <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-[10px] font-black border border-amber-500/20 animate-pulse">
                    <Crown className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span>{isBengali ? "প্রধান প্রশাসক ইমেইল সনাক্ত হয়েছে 👑" : "Primary Admin Email Detected"}</span>
                  </div>
                )}

                  {/* Email Address */}
                  <div className="space-y-1">
                    <label className={`text-[10px] font-extrabold ${theme.textHeading} uppercase tracking-wider block`}>
                      {t.regEmailLabel} *
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${theme.textMuted}`} />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder={t.regEmailPlaceholder}
                        className={`w-full rounded-xl border ${theme.borderCard} ${theme.bgPage} pl-9.5 pr-3 h-10 text-xs ${theme.textMain} placeholder-slate-400 outline-hidden focus:border-indigo-500 focus:bg-transparent focus:ring-1 focus:ring-indigo-500/20 transition-all font-semibold`}
                      />
                    </div>
                  </div>

                  {/* Password Field (Only for non-admin students) */}
                  {!isAdminLoginEmail && (
                    <div className="space-y-1">
                      <label className={`text-[10px] font-extrabold ${theme.textHeading} uppercase tracking-wider block`}>
                        {isBengali ? "পাসওয়ার্ড *" : "Account Password *"}
                      </label>
                      <div className="relative">
                        <Key className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${theme.textMuted}`} />
                        <input
                          type={showPasscode ? "text" : "password"}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder={isBengali ? "আপনার পাসওয়ার্ড লিখুন..." : "Enter your account password..."}
                          className={`w-full rounded-xl border ${theme.borderCard} ${theme.bgPage} pl-9.5 pr-10 h-10 text-xs ${theme.textMain} placeholder-slate-400 outline-hidden focus:border-indigo-500 focus:bg-transparent focus:ring-1 focus:ring-indigo-500/20 transition-all font-semibold`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasscode(!showPasscode)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                        >
                          {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                {/* Admin Passcode field (Dynamic for Permanent Admins) */}
                {isAdminLoginEmail && (
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
                    <p className="text-[9px] font-bold text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
                      🛡️ {isBengali ? "অননুমোদিত ব্যবহার রোধে শুধুমাত্র সঠিক পাসকোড দিয়ে প্রবেশ করা যাবে।" : "Admin passcode is required to enter admin dashboard."}
                    </p>
                  </motion.div>
                )}

                {/* Log In Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isLoggingIn || !loginEmail.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl h-11 text-xs font-black tracking-wider uppercase shadow-md bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isLoggingIn ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>{isBengali ? "যাচাই করা হচ্ছে..." : "Verifying access..."}</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4" />
                        <span>
                          {isAdminLoginEmail
                            ? (isBengali ? "অ্যাডমিন প্যানেলে প্রবেশ করুন 👑" : "Log In to Admin Panel 👑")
                            : (isBengali ? "স্টাডি হাবে লগইন করুন 🚀" : "Log In to Study Hub 🚀")
                          }
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Bottom switch to Sign Up */}
              <div className="pt-2 text-center text-xs border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500 font-semibold">
                  {isBengali ? "নতুন শিক্ষার্থী? অ্যাকাউন্ট নেই? " : "Don't have an approved account? "}
                </span>
                <button
                  type="button"
                  onClick={() => handleTabSwitch("signup")}
                  className="font-black text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer ml-1 inline-flex items-center gap-1"
                >
                  <span>SIGN UP</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 2: SIGN UP VIEW */}
          {authMode === "signup" && (
            <motion.div
              key="signup-tab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-3.5"
            >
              {signupSuccess ? (
                /* Success Confirmation State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3"
                >
                  <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-emerald-900 dark:text-emerald-300">
                      {isBengali ? "🎉 সাইন আপ রিকোয়েস্ট সফলভাবে জমা হয়েছে!" : "🎉 Sign Up Request Submitted!"}
                    </h3>
                    <p className="text-xs text-emerald-800/90 dark:text-emerald-400/90 mt-1.5 leading-relaxed font-medium">
                      {isBengali 
                        ? `ধন্যবাদ ${signupFullName}! আপনার আবেদনটি অ্যাডমিনের কাছে পাঠানো হয়েছে। অ্যাডমিন অনুমোদন দিলে আপনার ইমেইল (${signupEmail})-এ studyhub2026admin@gmail.com থেকে অফিশিয়াল নোটিফিকেশন যাবে।`
                        : `Thank you ${signupFullName}! Your application has been submitted to the Admin. Once approved, an official notification will be emailed to ${signupEmail} from studyhub2026admin@gmail.com.`
                      }
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSignupSuccess(false);
                        handleTabSwitch("login");
                      }}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>{isBengali ? "লগইন এ ফিরে যান" : "Go to LOG IN"}</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Sign Up Form */
                <form onSubmit={handleSignUpSubmit} className="space-y-2.5 text-left">
                  


                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className={`text-[10px] font-extrabold ${theme.textHeading} uppercase tracking-wider block`}>
                      {t.regFullNameLabel} *
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${theme.textMuted}`} />
                      <input
                        type="text"
                        required
                        value={signupFullName}
                        onChange={(e) => setSignupFullName(e.target.value)}
                        placeholder={isBengali ? "যেমন: দীপ্তাংশু মজুমদার" : "e.g. Diptanshu Mazumder"}
                        className={`w-full rounded-xl border ${theme.borderCard} ${theme.bgPage} pl-9 pr-3 h-9 sm:h-10 text-xs ${theme.textMain} placeholder-slate-400 outline-hidden focus:border-indigo-500 focus:bg-transparent focus:ring-1 focus:ring-indigo-500/20 transition-all font-semibold`}
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1">
                    <label className={`text-[10px] font-extrabold ${theme.textHeading} uppercase tracking-wider block`}>
                      {t.regEmailLabel} *
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${theme.textMuted}`} />
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className={`w-full rounded-xl border ${theme.borderCard} ${theme.bgPage} pl-9 pr-3 h-9 sm:h-10 text-xs ${theme.textMain} placeholder-slate-400 outline-hidden focus:border-indigo-500 focus:bg-transparent focus:ring-1 focus:ring-indigo-500/20 transition-all font-semibold`}
                      />
                    </div>
                  </div>

                  {/* Two-column layout for Age & Phone */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className={`text-[10px] font-extrabold ${theme.textHeading} uppercase tracking-wider block`}>
                        {t.regAgeLabel} *
                      </label>
                      <div className="relative">
                        <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${theme.textMuted}`} />
                        <input
                          type="number"
                          required
                          value={signupAge}
                          onChange={(e) => setSignupAge(e.target.value)}
                          placeholder="e.g. 17"
                          className={`w-full rounded-xl border ${theme.borderCard} ${theme.bgPage} pl-9 pr-3 h-9 sm:h-10 text-xs ${theme.textMain} placeholder-slate-400 outline-hidden focus:border-indigo-500 focus:bg-transparent focus:ring-1 focus:ring-indigo-500/20 transition-all font-semibold`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className={`text-[10px] font-extrabold ${theme.textHeading} uppercase tracking-wider block`}>
                        {isBengali ? "ফোন / হোয়াটসঅ্যাপ" : "Phone (Optional)"}
                      </label>
                      <div className="relative">
                        <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${theme.textMuted}`} />
                        <input
                          type="tel"
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
                          placeholder="017XXXXXXXX"
                          className={`w-full rounded-xl border ${theme.borderCard} ${theme.bgPage} pl-9 pr-3 h-9 sm:h-10 text-xs ${theme.textMain} placeholder-slate-400 outline-hidden focus:border-indigo-500 focus:bg-transparent focus:ring-1 focus:ring-indigo-500/20 transition-all font-semibold`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* School / College Name */}
                  <div className="space-y-1">
                    <label className={`text-[10px] font-extrabold ${theme.textHeading} uppercase tracking-wider block`}>
                      {t.regInstitutionLabel} *
                    </label>
                    <div className="relative">
                      <Building className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${theme.textMuted}`} />
                      <input
                        type="text"
                        required
                        value={signupInstitution}
                        onChange={(e) => setSignupInstitution(e.target.value)}
                        placeholder={t.regInstitutionPlaceholder}
                        className={`w-full rounded-xl border ${theme.borderCard} ${theme.bgPage} pl-9 pr-3 h-9 sm:h-10 text-xs ${theme.textMain} placeholder-slate-400 outline-hidden focus:border-indigo-500 focus:bg-transparent focus:ring-1 focus:ring-indigo-500/20 transition-all font-semibold`}
                      />
                    </div>
                  </div>

                  {/* Target Exam / Class */}
                  <div className="space-y-1">
                    <label className={`text-[10px] font-extrabold ${theme.textHeading} uppercase tracking-wider block`}>
                      {isBengali ? "টার্গেট পরীক্ষা বা শ্রেণি *" : "Target Goal / Exam *"}
                    </label>
                    <div className="relative">
                      <GraduationCap className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${theme.textMuted}`} />
                      <select
                        value={signupTargetExam}
                        onChange={(e) => setSignupTargetExam(e.target.value)}
                        className={`w-full rounded-xl border ${theme.borderCard} ${theme.bgPage} pl-9 pr-3 h-9 sm:h-10 text-xs ${theme.textMain} outline-hidden focus:border-indigo-500 font-semibold cursor-pointer`}
                      >
                        <option value="Secondary / Higher Secondary">Secondary / Higher Secondary (Class 9-12)</option>
                        <option value="HSC / Alim Board Exam">HSC / Alim Board Exam</option>
                        <option value="University Admission">University Admission</option>
                        <option value="Medical / Engineering Entrance">Medical / Engineering Entrance</option>
                        <option value="Govt Job Prep (BCS / Bank)">Govt Job Prep (BCS / Bank)</option>
                        <option value="General Studies">General Studies</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSigningUp || !signupFullName.trim() || !signupEmail.trim() || !signupInstitution.trim()}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl h-11 text-xs font-black tracking-wider uppercase shadow-md bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 text-white transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isSigningUp ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>{isBengali ? "আবেদন পাঠানো হচ্ছে..." : "Submitting sign up..."}</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          <span>{isBengali ? "সাইন আপ রিকোয়েস্ট পাঠান 🚀" : "Submit Sign Up Request 🚀"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Bottom switch to Log In */}
              <div className="pt-2 text-center text-xs border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500 font-semibold">
                  {isBengali ? "পূর্বেই অ্যাকাউন্ট অনুমোদিত? " : "Already approved or registered? "}
                </span>
                <button
                  type="button"
                  onClick={() => handleTabSwitch("login")}
                  className="font-black text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer ml-1 inline-flex items-center gap-1"
                >
                  <span>LOG IN</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          )}

        </div>

        {/* Security Footer */}
        <div className="p-2 sm:p-3 border-t border-slate-200 dark:border-slate-800 text-center text-[9px] font-black tracking-widest text-slate-500 uppercase leading-relaxed">
          Developed by DIPTANSHU MAZUMDER
        </div>
      </div>
    </div>
  );
}
