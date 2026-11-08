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
  Send,
  AlertTriangle,
  BookOpen,
  Video,
  BrainCircuit,
  Copy,
  Check
} from "lucide-react";
import { StudentProfile, isPermanentAdmin } from "../types";
import AppLogo from "./AppLogo";
import { Language, TRANSLATIONS } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";
import { safeFetch } from "../lib/api";
import { signInWithGoogleForGmail, getGmailAccessToken } from "../lib/googleWorkspace";
import UserManualModal from "./UserManualModal";

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
  const [createdPassword, setCreatedPassword] = useState("");
  const [copiedPassword, setCopiedPassword] = useState(false);

  // Status Check & Notice state
  const [notice, setNotice] = useState<{
    type: "pending" | "rejected" | "not_found" | "error" | "info" | "success";
    title?: string;
    message: string;
    details?: any;
  } | null>(null);

  const trimmedLoginEmail = (loginEmail || "").trim().toLowerCase();
  const isAdminLoginEmail = trimmedLoginEmail === "studyhub2026admin@gmail.com";

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

  // Forgot Password OTP States & Handlers
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotOtp, setForgotOtp] = useState("");
  const [revealedPassword, setRevealedPassword] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [emailDelivered, setEmailDelivered] = useState<boolean>(false);
  const [needsGmailAuth, setNeedsGmailAuth] = useState<boolean>(false);
  const [isConnectingGmail, setIsConnectingGmail] = useState<boolean>(false);
  const [showAppPasswordInput, setShowAppPasswordInput] = useState<boolean>(false);
  const [quickAppPassword, setQuickAppPassword] = useState<string>("");

  const handleForgotPasswordClick = () => {
    setForgotEmail(loginEmail);
    setForgotStep(1);
    setForgotOtp("");
    setRevealedPassword("");
    setForgotError(null);
    setEmailDelivered(false);
    setNeedsGmailAuth(false);
    setShowAppPasswordInput(false);
    setShowForgotModal(true);
  };

  const [showManualModal, setShowManualModal] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setIsForgotLoading(true);
    setForgotError(null);
    try {
      const currentToken = getGmailAccessToken();
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: forgotEmail.trim().toLowerCase(),
          gmailToken: currentToken || undefined
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmailDelivered(!!data.emailDelivered);
        setNeedsGmailAuth(!!data.needsGmailAuth);
        setForgotStep(2);
      } else {
        setForgotError(data.error || (isBengali ? "ওটিপি পাঠানো যায়নি।" : "Failed to send OTP."));
      }
    } catch (err) {
      setForgotError(isBengali ? "নেটওয়ার্ক ত্রুটি।" : "Network error. Please try again.");
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleQuickConnectGmail = async () => {
    setIsConnectingGmail(true);
    setForgotError(null);
    try {
      const { accessToken } = await signInWithGoogleForGmail();
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail.trim().toLowerCase(),
          gmailToken: accessToken
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmailDelivered(!!data.emailDelivered);
        setNeedsGmailAuth(!!data.needsGmailAuth);
        setForgotStep(2);
      } else {
        setForgotError(data.error || (isBengali ? "ইমেইল পাঠানো যায়নি।" : "Failed to dispatch email."));
      }
    } catch (e: any) {
      setForgotError(e.message || (isBengali ? "গুগল সাইন-ইন সংযোগ ব্যর্থ হয়েছে।" : "Google sign-in connection failed."));
    } finally {
      setIsConnectingGmail(false);
    }
  };

  const handleQuickSaveAppPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAppPassword.trim()) return;
    setIsConnectingGmail(true);
    setForgotError(null);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail.trim().toLowerCase(),
          appPassword: quickAppPassword.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmailDelivered(!!data.emailDelivered);
        setNeedsGmailAuth(!!data.needsGmailAuth);
        setShowAppPasswordInput(false);
        setForgotStep(2);
      } else {
        setForgotError(data.error || (isBengali ? "ইমেইল পাঠানো যায়নি।" : "Failed to dispatch email."));
      }
    } catch (e: any) {
      setForgotError(e.message || (isBengali ? "পাসওয়ার্ড সংরক্ষণ ব্যর্থ হয়েছে।" : "Failed to save App Password."));
    } finally {
      setIsConnectingGmail(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotOtp.trim()) return;
    setIsForgotLoading(true);
    setForgotError(null);
    try {
      const res = await fetch("/api/auth/verify-otp-and-reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase(), otp: forgotOtp.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRevealedPassword(data.password);
        setForgotStep(3);
      } else {
        setForgotError(data.error || (isBengali ? "ভুল ওটিপি কোড।" : "Incorrect OTP code."));
      }
    } catch (err) {
      setForgotError(isBengali ? "যাচাইকরণ ব্যর্থ হয়েছে।" : "Verification failed. Please try again.");
    } finally {
      setIsForgotLoading(false);
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
          fullName: "Study Hub Official Admin",
          email: "studyhub2026admin@gmail.com",
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

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        if (data.password) {
          setCreatedPassword(data.password);
        }
        setSignupSuccess(true);
      } else {
        setNotice({
          type: "error",
          message: data?.error || (isBengali ? "রেজিস্ট্রেশন সম্পন্ন করা যায়নি।" : "Failed to register student.")
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
      <div className={`w-full max-w-md md:max-w-4xl lg:max-w-5xl ${theme.bgCard} rounded-3xl border ${theme.borderCard} shadow-2xl overflow-hidden transition-all duration-300 relative mx-auto flex flex-col md:flex-row`}>
        
        {/* Left Side: Desktop Feature & Brand Showcase Panel (Visible on md: and above) */}
        <div className={`hidden md:flex md:w-5/12 lg:w-5/12 flex-col justify-between p-7 lg:p-9 bg-gradient-to-br ${theme.heroGradient} border-b md:border-b-0 md:border-r ${theme.borderCard} relative overflow-hidden text-slate-900 shrink-0`}>
          {/* Decorative Glowing Circles */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-teal-200/50 rounded-full blur-2xl pointer-events-none" />

          {/* Top Section */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/80 dark:bg-white/90 backdrop-blur-md px-3.5 py-1 text-xs font-black text-slate-900 border border-white/50 shadow-xs select-none">
              <AppLogo size="sm" className="bg-transparent shadow-none h-4 w-4" />
              <span>STUDY HUB ACADEMIC PORTAL</span>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight leading-tight text-slate-950">
                {isBengali ? "স্মার্ট পড়াশোনা, নিশ্চিত সাফল্য 🚀" : "Empowering Your Academic Journey 🚀"}
              </h1>
              <p className="text-xs lg:text-sm text-slate-800 font-semibold leading-relaxed">
                {isBengali 
                  ? "AI ডাউট সলভার, ভিডিও লেকচার, বিষয়ভিত্তিক স্টাডি নোটস ও ইন্টারঅ্যাক্টিভ ফ্ল্যাশকার্ড—আপনার শিক্ষা হোক সহজ ও আনন্দময়।"
                  : "All-in-one student workspace featuring AI Doubt Solver, Video Lectures, Comprehensive Notes & Community Discussions."}
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/60 backdrop-blur-xs border border-white/40">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <BrainCircuit className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-950">
                    {isBengali ? "AI ডাউট সলভার" : "AI Doubt Solver"}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-700">
                    {isBengali ? "ধাপে ধাপে দ্রুত সমাধান ও ব্যাখ্যা" : "Instant step-by-step problem solver"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/60 backdrop-blur-xs border border-white/40">
                <div className="h-8 w-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-950">
                    {isBengali ? "ডিজিটাল স্টাডি ডেস্ক" : "Curated Study Vault"}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-700">
                    {isBengali ? "বিষয়ভিত্তিক হ্যান্ডনোটস ও ফ্ল্যাশকার্ড" : "Smart study notes & flashcards"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/60 backdrop-blur-xs border border-white/40">
                <div className="h-8 w-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Video className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-950">
                    {isBengali ? "ভিডিও লেকচার ও ক্লাস" : "Video Lectures & Classes"}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-700">
                    {isBengali ? "রেকর্ডেড ও লাইভ ডাউট ক্লিয়ারিং" : "High-quality academic lessons"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Panel */}
        <div className="w-full md:w-7/12 lg:w-7/12 flex flex-col justify-between">
          
          {/* Mobile Header Brand Banner (Shown only on mobile < md) */}
          <div className={`md:hidden bg-gradient-to-r ${theme.heroGradient} px-4 py-3.5 sm:px-6 sm:py-4.5 text-slate-900 text-center relative overflow-hidden border-b ${theme.borderCard}`}>
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

          {/* Desktop Form Header (Shown only on md: and above) */}
          <div className="hidden md:block p-6 lg:p-7 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
            <h2 className={`text-xl lg:text-2xl font-black ${theme.textHeading} tracking-tight`}>
              {authMode === "login"
                ? (isBengali ? "স্টাডি হাবে লগইন করুন" : "Sign In to Study Hub")
                : (isBengali ? "নতুন শিক্ষার্থী সাইন আপ" : "Create Student Account")
              }
            </h2>
            <p className={`text-xs ${theme.textMuted} font-semibold mt-1`}>
              {authMode === "login"
                ? (isBengali ? "আপনার নিবন্ধিত ইমেইল ও পাসওয়ার্ড দিয়ে প্রবেশ করুন।" : "Enter your approved email and password to continue.")
                : (isBengali ? "অফিশিয়াল অনুমোদনের জন্য নিচের তথ্যগুলো পূরণ করুন।" : "Fill in your academic profile details for approval.")
              }
            </p>
          </div>

          {/* The Form Options Container */}
          <div className="p-4 sm:p-6 lg:p-7 space-y-4 flex-1">
            
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
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={handleForgotPasswordClick}
                          className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                          {isBengali ? "পাসওয়ার্ড ভুলে গেছেন? 🔑" : "Forgot Password? 🔑"}
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
                /* Instant Registration Successful - Sent to Email Only */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 shadow-lg"
                >
                  <div className="h-14 w-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>

                  <div>
                    <span className="inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-[11px] font-black rounded-full uppercase tracking-wider mb-2">
                      ✅ {isBengali ? "রেজিস্ট্রেশন সম্পন্ন হয়েছে" : "Registration Successful"}
                    </span>
                    <h3 className="text-lg font-black text-emerald-950 dark:text-emerald-200">
                      {isBengali ? "🎉 অ্যাকাউন্ট তৈরি ও সক্রিয় হয়েছে!" : "🎉 Account Created & Activated!"}
                    </h3>
                  </div>

                  {/* Email Sent Information Notice Card */}
                  <div className="bg-white/95 dark:bg-slate-900/95 border border-emerald-500/30 rounded-2xl p-4 text-left space-y-3 shadow-xs">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                          {isBengali ? "ইমেইলে লগইন তথ্য পাঠানো হয়েছে" : "Credentials Dispatched to Email"}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                          {isBengali 
                            ? `আপনার User ID ও Password অফিসিয়াল অ্যাডমিন ইমেইল (studyhub2026admin@gmail.com) থেকে স্বয়ংক্রিয়ভাবে পাঠিয়ে দেওয়া হয়েছে:`
                            : `Your account User ID and Password have been dispatched from studyhub2026admin@gmail.com to:`
                          }
                        </p>
                        <div className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-900/30 px-2.5 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800/50 break-all">
                          {signupEmail.trim().toLowerCase()}
                        </div>
                      </div>
                    </div>

                    {/* Critical Spam Notice Banner */}
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-[11px] text-amber-950 dark:text-amber-200 leading-relaxed space-y-1.5">
                      <div className="font-black flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
                        <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                        <span>{isBengali ? "ইমেইল খুঁজে পাচ্ছেন না? অনুগ্রহ করে এটি পড়ুন:" : "Cannot find the email? Please check:"}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">
                        {isBengali 
                          ? "গুগলের স্বয়ংক্রিয় ফিল্টারের কারণে কোনো কোনো ক্ষেত্রে প্রথম ইমেইলটি ইনবক্সের বদলে আপনার জিমেইলের 'Spam (স্প্যাম)' অথবা 'Promotions / Updates' ফোল্ডারে যেতে পারে। ইনবক্সে না পেলে অনুগ্রহ করে আপনার জিমেইলের Spam ফোল্ডারটি চেক করুন।"
                          : "Due to mail filters, automated security messages may land in your 'Spam' or 'Promotions' folder. Please check your Spam folder if not found in Primary Inbox."}
                      </p>
                    </div>

                    {/* Immediate On-Screen Access Credentials (Failsafe) */}
                    {createdPassword && (
                      <div className="p-3.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                            {isBengali ? "তাৎক্ষণিক লগইন তথ্য (Failsafe Backup):" : "Immediate Access Credentials:"}
                          </span>
                          <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                            {isBengali ? "কপি বা সংরক্ষণ করুন" : "Save or copy now"}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <span className="block text-[9px] font-sans font-bold text-slate-500 uppercase">User ID</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 select-all truncate block">{signupEmail.trim().toLowerCase()}</span>
                          </div>
                          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-1.5">
                            <div className="min-w-0">
                              <span className="block text-[9px] font-sans font-bold text-slate-500 uppercase">Password</span>
                              <span className="font-black text-indigo-600 dark:text-indigo-400 select-all tracking-wider text-sm">{createdPassword}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(createdPassword);
                                setCopiedPassword(true);
                                setTimeout(() => setCopiedPassword(false), 2500);
                              }}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer shrink-0 shadow-xs"
                              title="Copy password"
                            >
                              {copiedPassword ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              <span>{copiedPassword ? (isBengali ? "কপি হয়েছে" : "Copied") : (isBengali ? "কপি" : "Copy")}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const email = signupEmail.trim().toLowerCase();
                        const pwd = createdPassword;
                        setLoginEmail(email);
                        setLoginPassword(pwd);
                        setSignupSuccess(false);
                        handleTabSwitch("login");
                      }}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>{isBengali ? "সরাসরি লগইন করুন (Proceed to Login) 🚀" : "Proceed to Login 🚀"}</span>
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
                          <span>{isBengali ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "Creating account..."}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>{isBengali ? "তাৎক্ষণিক অ্যাকাউন্ট তৈরি করুন 🚀" : "Register & Activate Instantly 🚀"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Bottom switch to Log In */}
              <div className="pt-2 text-center text-xs border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500 font-semibold">
                  {isBengali ? "পূর্বেই অ্যাকাউন্ট তৈরি করেছেন? " : "Already have an account? "}
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

      {/* Forgot Password OTP Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className={`w-full max-w-lg md:max-w-xl p-6 sm:p-7 rounded-3xl ${theme.bgCard} border ${theme.borderCard} shadow-2xl space-y-5 text-left`}
            >
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className={`text-base font-black ${theme.textHeading} flex items-center gap-2`}>
                  <Key className="h-5 w-5 text-indigo-600" />
                  {isBengali ? "পাসওয়ার্ড পুনরুদ্ধার (OTP)" : "Password Recovery (OTP)"}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {forgotError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-600">
                  {forgotError}
                </div>
              )}

              {forgotStep === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <p className={`text-xs ${theme.textMuted} font-medium leading-relaxed`}>
                    {isBengali 
                      ? "আপনার নিবন্ধিত ইমেইল ঠিকানাটি লিখুন। আপনার ইমেইলে একটি ৪/৬-সংখ্যার ওটিপি (OTP) কোড পাঠানো হবে।" 
                      : "Enter your registered email address. A 6-digit OTP verification code will be sent to your email."}
                  </p>
                  <div className="space-y-1">
                    <label className={`text-[10px] font-extrabold ${theme.textHeading} uppercase tracking-wider block`}>
                      {isBengali ? "ইমেইল ঠিকানা *" : "Email Address *"}
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${theme.textMuted}`} />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="student@example.com"
                        className={`w-full rounded-xl border ${theme.borderCard} ${theme.bgPage} pl-9 pr-3 h-11 text-xs ${theme.textMain} placeholder-slate-400 outline-hidden focus:border-indigo-500 font-semibold`}
                      />
                    </div>
                  </div>
                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className={`flex-1 py-3 px-4 rounded-xl border ${theme.borderCard} text-xs font-bold ${theme.textMain} hover:bg-slate-500/10 cursor-pointer`}
                    >
                      {isBengali ? "বাতিল" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      disabled={isForgotLoading || !forgotEmail.trim()}
                      className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isForgotLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      <span>{isBengali ? "ওটিপি পাঠান" : "Send OTP"}</span>
                    </button>
                  </div>
                </form>
              )}

              {forgotStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {needsGmailAuth ? (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-950 dark:text-amber-200 space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                        <span className="font-extrabold text-sm text-amber-800 dark:text-amber-300">
                          {isBengali ? "অফিশিয়াল জিমেইল অ্যাপ পাসওয়ার্ড প্রয়োজন" : "Official Gmail App Password Required"}
                        </span>
                      </div>
                      
                      <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                        {isBengali 
                          ? "গুগলের নিয়মানুযায়ী অ্যাপ পাসওয়ার্ড তৈরি করতে অ্যাকাউন্টে 2-Step Verification অন থাকতে হয় (তা না থাকলে 'setting is not available' এরর আসে)। নিচে ২টি সহজ সমাধান রয়েছে:"
                          : "Google requires 2-Step Verification to be ON for App Passwords (otherwise 'setting is not available' appears). Choose an option below:"
                        }
                      </p>

                      <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900/50 space-y-2 text-[11px]">
                        <p className="font-bold text-amber-950 dark:text-amber-200">
                          {isBengali ? "উপায় ১: গুগল অ্যাপ পাসওয়ার্ড চালু করার ধাপ:" : "Option 1: Enable Google App Password:"}
                        </p>
                        <ol className="list-decimal pl-4 space-y-1.5 text-slate-700 dark:text-slate-300">
                          <li>
                            {isBengali ? "প্রথমে যান: " : "First go to: "}
                            <a 
                              href="https://myaccount.google.com/signinoptions/two-step-verification" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 dark:text-indigo-400 font-bold underline"
                            >
                              2-Step Verification সেটিংস
                            </a>
                            {isBengali ? " এবং মোবাইল নম্বর দিয়ে ২-স্টেপ ভেরিফিকেশন অন (Turn ON) করুন।" : " and Turn ON 2-Step Verification with your mobile number."}
                          </li>
                          <li>
                            {isBengali ? "এরপর যান: " : "Then visit: "}
                            <a 
                              href="https://myaccount.google.com/apppasswords" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 dark:text-indigo-400 font-bold underline"
                            >
                              myaccount.google.com/apppasswords
                            </a>
                            {isBengali ? ' -> "StudyHub" লিখে Create চাপলে ১৬-সংখ্যার পাসওয়ার্ড পাবেন।' : ' -> Name it "StudyHub" to get the 16-character code.'}
                          </li>
                          <li>{isBengali ? "কোডটি নিচের বক্সে পেস্ট করে সেভ করুন:" : "Paste the 16-character code below and click Save:"}</li>
                        </ol>

                        <div className="pt-1">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="password"
                              value={quickAppPassword}
                              onChange={(e) => setQuickAppPassword(e.target.value)}
                              placeholder="xxxx xxxx xxxx xxxx"
                              className="flex-1 px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold outline-none focus:border-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={handleQuickSaveAppPassword}
                              disabled={!quickAppPassword.trim() || isConnectingGmail}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                            >
                              {isConnectingGmail ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                              <span>{isBengali ? "সেভ ও ওটিপি পাঠান" : "Save & Send OTP"}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 text-[11px] text-indigo-900 dark:text-indigo-200 flex items-center justify-between gap-2">
                        <div>
                          <span className="font-bold">{isBengali ? "উপায় ২ (জরুরি তাৎক্ষণিক পাসওয়ার্ড প্রদর্শন): " : "Option 2 (Instant Master Passcode): "}</span>
                          <span>{isBengali ? "নিচের ওটিপি বক্সে অ্যাডমিন পাসকোড 7530 দিলেও পাসওয়ার্ড দেখা যাবে।" : "Enter master passcode 7530 in the OTP box below to reveal password."}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-mono font-bold text-xs shrink-0">7530</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-950 dark:text-indigo-200 space-y-2 text-center">
                      <p className="font-extrabold text-sm text-indigo-700 dark:text-indigo-300">
                        {isBengali ? "📩 ৬-সংখ্যার ওটিপি কোড পাঠানো হয়েছে!" : "📩 6-Digit OTP Dispatched!"}
                      </p>
                      <p className="font-semibold leading-relaxed">
                        {isBengali 
                          ? `অফিশিয়াল ইমেইল (studyhub2026admin@gmail.com) থেকে আপনার ইমেইল (${forgotEmail})-এ ৬-সংখ্যার ওটিপি কোড পাঠানো হয়েছে।`
                          : `An official 6-digit OTP code has been dispatched to ${forgotEmail} from studyhub2026admin@gmail.com.`
                        }
                      </p>
                      <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-[11px] font-bold text-left space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          <span>{isBengali ? "জরুরি নির্দেশনা (Important):" : "Important:"}</span>
                        </div>
                        <p className="font-normal text-[10.5px]">
                          {isBengali 
                            ? "ইনবক্সে সরাসরি না পেলে অনুগ্রহ করে আপনার জিমেইলের Spam (স্প্যাম) অথবা Promotions ফোল্ডার চেক করুন।" 
                            : "If not visible in primary Inbox, please check your Spam or Promotions folder."}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className={`text-[10px] font-extrabold ${theme.textHeading} uppercase tracking-wider block`}>
                      {isBengali ? "৬-সংখ্যার ওটিপি কোড লিখুন *" : "Enter 6-Digit OTP Code *"}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      placeholder="123456"
                      className={`w-full rounded-xl border ${theme.borderCard} ${theme.bgPage} px-4 h-12 text-center text-lg font-black tracking-widest ${theme.textMain} outline-hidden focus:border-indigo-500`}
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className={`flex-1 py-3 px-4 rounded-xl border ${theme.borderCard} text-xs font-bold ${theme.textMain} hover:bg-slate-500/10 cursor-pointer`}
                    >
                      {isBengali ? "ফিরে যান" : "Back"}
                    </button>
                    <button
                      type="submit"
                      disabled={isForgotLoading || !forgotOtp.trim()}
                      className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isForgotLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                      <span>{isBengali ? "যাচাই ও পাসওয়ার্ড দেখুন" : "Verify & Reveal"}</span>
                    </button>
                  </div>
                </form>
              )}

              {forgotStep === 3 && (
                <div className="space-y-4 text-center">
                  <div className="h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {isBengali ? "ওটিপি সফলভাবে যাচাই হয়েছে!" : "OTP Verified Successfully!"}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {isBengali ? "আপনার অ্যাকাউন্ট পাসওয়ার্ড নিচে দেওয়া হলো:" : "Your account password is:"}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-mono text-base font-black text-indigo-600 dark:text-indigo-400 tracking-wider">
                      {revealedPassword}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(revealedPassword);
                        alert(isBengali ? "পাসওয়ার্ড কপি করা হয়েছে!" : "Password copied to clipboard!");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer shadow-xs"
                    >
                      {isBengali ? "কপি" : "Copy"}
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotModal(false);
                        setLoginEmail(forgotEmail);
                        setLoginPassword(revealedPassword);
                        setAuthMode("login");
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>{isBengali ? "এই পাসওয়ার্ড দিয়ে লগইন করুন" : "Log In with This Password"}</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Security Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setShowManualModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>{isBengali ? "📖 ব্যবহারকারী নির্দেশিকা (User Manual PDF)" : "📖 User Manual (PDF Guide)"}</span>
          </button>
          <div className="text-[9px] font-black tracking-widest text-slate-500 uppercase">
            Developed by DIPTANSHU MAZUMDER
          </div>
        </div>

        {/* User Manual Modal */}
        <UserManualModal
          isOpen={showManualModal}
          onClose={() => setShowManualModal(false)}
          lang={lang}
        />
      </div>
    </div>
  </div>
);
}
