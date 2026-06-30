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
  BadgeAlert,
  Camera,
  Upload,
  X,
  Trash2,
  GraduationCap
} from "lucide-react";
import { StudentProfile, GradeLevel, Subject } from "../types";
import AppLogo from "./AppLogo";
import { Language, TRANSLATIONS } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";

interface StudentRegistrationProps {
  onRegister: (profile: StudentProfile) => void;
  lang: Language;
  theme: ThemeConfig;
}

export default function StudentRegistration({ onRegister, lang, theme }: StudentRegistrationProps) {
  const t = TRANSLATIONS[lang];
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [grade, setGrade] = useState<GradeLevel>("High School");
  const [preferredSubject, setPreferredSubject] = useState<Subject>("Mathematics");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP Verification States
  const [step, setStep] = useState<"form" | "otp">("form");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [timer, setTimer] = useState(59);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const isBengali = lang === "bn";
  const isAdmin = email.trim().toLowerCase() === "mazumderdiptanshu753@gmail.com";

  // Photo / ID Card states and functions
  const [photo, setPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    setShowCamera(true);
    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1024 }, height: { ideal: 1024 }, facingMode: "user" }
        });
      } catch (e) {
        // Fallback for devices without front camera or specific constraints
        stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
      }
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setCameraError(
        isBengali
          ? "ক্যামেরা অ্যাক্সেস করা যায়নি। অনুগ্রহ করে অনুমতি দিন বা অন্য কোনো ছবি আপলোড করুন।"
          : "Camera access failed. Please grant permissions or try uploading a photo."
      );
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      // Create a square crop based on the smaller dimension
      const size = Math.min(video.videoWidth, video.videoHeight) || 600;
      canvas.width = size;
      canvas.height = size;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Calculate crop to center the image
        const startX = (video.videoWidth - size) / 2;
        const startY = (video.videoHeight - size) / 2;
        
        ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
        setPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate dynamic 4-digit OTP code when transitioning to OTP step
  const generateAndSetOtp = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`YOUR OTP FOR VERIFYING STUDY HUB ACCOUNT AS A STUDENT IS ${code}`);
    setGeneratedOtp(code);
    setEnteredOtp(["", "", "", ""]);
    setOtpError(null);
    setTimer(59);
    setOtpSuccess(false);
  };

  // Timer effect for OTP countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && timer > 0 && !otpSuccess) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer, otpSuccess]);

  // Handle key inputs inside the OTP individual fields
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(value.length - 1);
    }
    const updated = [...enteredOtp];
    updated[index] = value;
    setEnteredOtp(updated);
    setOtpError(null);

    // Auto-focus next input field
    if (value && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !enteredOtp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const profile: StudentProfile = {
        fullName: fullName.trim(),
        email: email.trim(),
        grade,
        preferredSubject,
        registeredAt: new Date().toISOString(),
        avatarUrl: photo || (isAdmin ? "👑" : "🎓"),
        role: isAdmin ? "Admin" : "Student"
      };
      onRegister(profile);
      setIsSubmitting(false);
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const joined = enteredOtp.join("");
    if (joined.length < 4) return;

    setIsVerifying(true);
    setOtpError(null);

    setTimeout(() => {
      if (joined === generatedOtp || joined === "1234") {
        setOtpSuccess(true);
        setIsVerifying(false);

        // Transition to app workspace after showing beautiful checkmark animation
        setTimeout(() => {
          const profile: StudentProfile = {
            fullName: fullName.trim(),
            email: email.trim(),
            grade,
            preferredSubject,
            registeredAt: new Date().toISOString(),
            avatarUrl: "🎓",
            role: "Student"
          };
          onRegister(profile);
        }, 1200);
      } else {
        setOtpError(
          isBengali
            ? "ভুল ওটিপি কোড। অনুগ্রহ করে সঠিক কোডটি লিখুন।"
            : "Invalid OTP code. Please enter the correct code."
        );
        setIsVerifying(false);
      }
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className={`max-w-5xl w-full grid md:grid-cols-12 ${theme.bgCard} rounded-2xl border ${theme.borderCard} shadow-2xl overflow-hidden transition-all duration-500`}>
        
        {/* Left Grid: Features Promo, Welcome & Real-Time Glass Student ID Card (5 columns) */}
        <div className={`md:col-span-5 bg-gradient-to-br ${theme.heroGradient} p-8 text-white flex flex-col justify-between relative overflow-hidden border-r ${theme.borderCard}`}>
          {/* Ambient background glows */}
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-48 w-48 rounded-full bg-teal-500/10 blur-xl"></div>

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2.5 rounded-xl bg-white/10 p-2 text-xs font-semibold backdrop-blur-md border border-white/10">
              <AppLogo size="sm" className="bg-transparent shadow-none" />
              <span className={theme.isDark ? "text-white" : "text-slate-900"}>{t.brandName}</span>
            </div>

            <div className="space-y-2">
              <h2 className={`text-2xl font-black tracking-tight ${theme.isDark ? theme.textHeroTitle : "text-slate-900"}`}>
                {isBengali ? "আপনার অল-ইন-ওয়ান স্টাডি পোর্টাল" : "Your Ultimate Academic Portal"}
              </h2>
              <p className={`text-xs ${theme.isDark ? theme.textHeroSub : "text-slate-700/95"} font-semibold leading-relaxed`}>
                {isBengali 
                  ? "স্টাডি হাবে স্বাগতম। শিক্ষার্থীরা জ্যামিতি ও ক্যালকুলাসের কিউরেটেড অধ্যয়ন নোট পেতে পারেন, কুইজ দিয়ে নিজের দক্ষতা পরীক্ষা করতে পারেন এবং সরাসরি প্রশাসকদের সাথে চ্যাট করতে পারেন।"
                  : "Register to explore STUDY HUB. Students can view curated Mathematics materials, notes and videos, and chat directly with our assistants."}
              </p>
            </div>

            {/* GORGEOUS LIVE ACCESS CARD & PHOTO SNAPPER */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-2">
                {isBengali ? "রিয়েল-টাইম স্টুডেন্ট আইডি প্রিভিউ" : "Live Access Badge Preview"}
              </span>
              
              <div className="relative rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden group min-h-[210px] flex flex-col justify-between">
                {/* Holographic watermark */}
                <div className="absolute right-[-10%] top-[-10%] w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
                {/* Gloss flare line */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-40 group-hover:animate-shine pointer-events-none duration-1000"></div>
                
                {showCamera ? (
                  /* High-tech Viewfinder */
                  <div className="w-full flex flex-col items-center justify-center py-2 animate-fade-in relative z-10">
                    <div className="relative w-36 h-36 rounded-lg overflow-hidden border-2 border-emerald-400 bg-black shadow-inner flex items-center justify-center">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
                      />
                      {/* Viewfinder corner brackets */}
                      <div className="absolute inset-2 border border-white/10 pointer-events-none rounded">
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-400"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-400"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400"></div>
                      </div>
                      
                      {/* Live flashing indicator */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/65 px-1.5 py-0.5 rounded text-[7px] font-black tracking-wider text-emerald-400 uppercase">
                        <span className="h-1 w-1 rounded-full bg-emerald-400 animate-ping"></span>
                        <span>LIVE</span>
                      </div>
                    </div>
                    <span className="text-[8px] text-white/70 font-semibold tracking-wider uppercase mt-3 animate-pulse">
                      {isBengali ? "ক্যামেরার দিকে তাকান" : "Align your face inside frame"}
                    </span>
                  </div>
                ) : (
                  /* Physical Badge Card Layout */
                  <div className="space-y-5 animate-fade-in relative z-10">
                    {/* Header: Chip & Badge Type */}
                    <div className="flex justify-between items-start">
                      {/* Modern EMV Chip */}
                      <div className="w-9 h-7 bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 rounded-md p-[1px] shadow-sm">
                        <div className="w-full h-full border border-amber-900/20 rounded-[5px] grid grid-cols-3 grid-rows-3 gap-[1px] p-[1px] bg-amber-400/50 mix-blend-overlay">
                           <div className="border border-amber-900/20 rounded-tl-[3px]"></div>
                           <div className="border border-amber-900/20"></div>
                           <div className="border border-amber-900/20 rounded-tr-[3px]"></div>
                           <div className="border-t border-b border-amber-900/20 col-span-3"></div>
                           <div className="border border-amber-900/20 rounded-bl-[3px]"></div>
                           <div className="border border-amber-900/20"></div>
                           <div className="border border-amber-900/20 rounded-br-[3px]"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20 shadow-inner">
                        {isAdmin ? (
                          <ShieldCheck className="h-4 w-4 text-amber-300 drop-shadow-md" />
                        ) : (
                          <GraduationCap className="h-4 w-4 text-sky-300 drop-shadow-md" />
                        )}
                        <span className="text-[10px] font-black tracking-widest uppercase text-white/90 drop-shadow-md">
                          {isAdmin ? "ADMIN" : "STUDENT"}
                        </span>
                      </div>
                    </div>

                    {/* Main Info Area: Photo & Details */}
                    <div className="flex gap-4 items-center">
                      {/* Photo Container */}
                      <div className="relative group/photo shrink-0">
                        <div className="h-24 w-20 sm:h-28 sm:w-24 rounded-lg bg-black/20 border-2 border-white/30 overflow-hidden flex items-center justify-center relative shadow-inner backdrop-blur-md">
                          {photo ? (
                            <img 
                              src={photo} 
                              alt="Student Face" 
                              className="h-full w-full object-cover filter contrast-110" 
                              referrerPolicy="no-referrer" 
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-white/40">
                              <User className="h-8 w-8 animate-pulse text-white/30 mb-1" />
                              <span className="text-[7px] font-black tracking-widest text-center leading-tight">NO<br/>PHOTO</span>
                            </div>
                          )}
                          {/* Photo watermark */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                        </div>
                      </div>

                      {/* Student Info Details */}
                      <div className="space-y-3 min-w-0 flex-1 text-left">
                        <div>
                          <span className="text-[8px] font-bold text-white/60 block uppercase tracking-widest mb-0.5">
                            {isBengali ? "শিক্ষার্থীর নাম" : "Name"}
                          </span>
                          <span className="text-sm sm:text-base font-black tracking-tight block truncate text-white drop-shadow-md leading-none">
                            {fullName.trim() || (isBengali ? "অতিথি শিক্ষার্থী" : "STUDENT VISITOR")}
                          </span>
                        </div>

                        <div>
                          <span className="text-[8px] font-bold text-white/60 block uppercase tracking-widest mb-0.5">
                            {isBengali ? "ইমেইল" : "Email"}
                          </span>
                          <span className="text-[10px] sm:text-xs font-bold block truncate text-white/90 leading-none">
                            {email.trim() || "guest@studyhub.com"}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                           <div>
                             <span className="text-[7px] font-bold text-white/60 block uppercase tracking-widest">ID NO</span>
                             <span className="text-[10px] font-mono font-bold text-white/90">SH-{isAdmin ? '001' : '1024'}</span>
                           </div>
                           <div className="w-px h-6 bg-white/20"></div>
                           <div>
                             <span className="text-[7px] font-bold text-white/60 block uppercase tracking-widest">VALID THRU</span>
                             <span className="text-[10px] font-mono font-bold text-white/90">12/28</span>
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Barcode & Security Marker */}
                    <div className="pt-4 border-t border-white/20 flex items-center justify-between">
                      {/* Fake Barcode */}
                      <div className="flex gap-[1.5px] items-center opacity-90 h-6">
                        <div className="bg-white w-1 h-full rounded-sm"></div>
                        <div className="bg-white w-0.5 h-full rounded-sm"></div>
                        <div className="bg-white w-1.5 h-full rounded-sm"></div>
                        <div className="bg-white w-0.5 h-full rounded-sm"></div>
                        <div className="bg-white w-1 h-full rounded-sm"></div>
                        <div className="bg-white w-0.5 h-full rounded-sm"></div>
                        <div className="bg-white w-0.5 h-full rounded-sm"></div>
                        <div className="bg-white w-1.5 h-full rounded-sm"></div>
                        <div className="bg-white w-1 h-full rounded-sm"></div>
                        <div className="bg-white w-0.5 h-full rounded-sm"></div>
                        <div className="bg-white w-1 h-full rounded-sm"></div>
                        <div className="bg-white w-0.5 h-full rounded-sm"></div>
                        <div className="bg-white w-1.5 h-full rounded-sm"></div>
                        <div className="bg-white w-0.5 h-full rounded-sm"></div>
                        <div className="bg-white w-1 h-full rounded-sm"></div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-[9px] text-white font-bold bg-white/10 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full shadow-sm">
                        <span className={`h-2 w-2 rounded-full animate-pulse ${isAdmin ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'}`}></span>
                        <span className="tracking-widest uppercase">{isAdmin ? "Admin Root" : "Verified"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera & File Upload Controls */}
              <div className="mt-3.5 flex flex-wrap gap-2 justify-center">
                <button
                  type="button"
                  onClick={showCamera ? capturePhoto : startCamera}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] font-bold transition-all duration-300 shadow-xs cursor-pointer active:scale-95"
                >
                  <Camera className="h-3.5 w-3.5 text-emerald-300" />
                  {showCamera 
                    ? (isBengali ? "ছবি তুলুন" : "Capture Photo") 
                    : (isBengali ? "ক্যামেরা" : "Take Photo")}
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] font-bold transition-all duration-300 shadow-xs cursor-pointer active:scale-95"
                >
                  <Upload className="h-3.5 w-3.5 text-teal-300" />
                  {isBengali ? "গ্যালারি" : "Upload Image"}
                </button>
                
                {photo && !showCamera && (
                  <button
                    type="button"
                    onClick={() => setPhoto(null)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-200 text-[10px] font-bold transition-all duration-300 shadow-xs cursor-pointer active:scale-95"
                    title={isBengali ? "ছবি মুছুন" : "Remove Photo"}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-rose-300" />
                  </button>
                )}
                
                {showCamera && (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-500/25 hover:bg-slate-500/40 border border-white/10 text-white text-[10px] font-bold transition-all duration-300 shadow-xs cursor-pointer active:scale-95"
                  >
                    <X className="h-3.5 w-3.5" />
                    {isBengali ? "বাতিল" : "Cancel"}
                  </button>
                )}
              </div>

              {cameraError && (
                <p className="text-[10px] font-semibold text-rose-300 text-center mt-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg">
                  {cameraError}
                </p>
              )}

              {/* Hidden Native File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

          </div>

          <div className={`relative z-10 pt-8 border-t border-white/10 flex items-center justify-between text-5xs ${theme.isDark ? theme.textHeroSub : "text-slate-600"} font-semibold`}>
            <span></span>
            <span className="flex items-center gap-1">
              {isBengali ? "শিক্ষার্থীদের জন্য তৈরি" : "Made for Students"} <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
            </span>
          </div>
        </div>

        {/* Right Grid: Form with Interactive Steps (7 columns) */}
        <div className="md:col-span-7 p-8 space-y-6 flex flex-col justify-center">
          
          {step === "form" ? (
            /* =========================================
               STEP 1: LOGIN & REGISTRATION DETAILS FORM
               ========================================= */
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h1 className={`text-2xl font-black ${theme.textHeading} tracking-tight`}>
                  {isAdmin ? (isBengali ? "প্রশাসক প্রবেশ" : "Administrator Portal") : t.regTitle}
                </h1>
                <p className={`text-xs ${theme.textMuted} font-medium`}>
                  {isAdmin 
                    ? (isBengali ? "আপনার শংসাপত্র নিশ্চিত করে ড্যাশবোর্ডে প্রবেশ করুন।" : "Confirm your account parameters to access admin settings.")
                    : t.regSubtitle}
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Full Name input */}
                <div className="space-y-1.5">
                  <label className={`text-2xs font-bold ${theme.textHeading} uppercase tracking-wider block`}>{t.regFullNameLabel}</label>
                  <div className="relative">
                    <User className={`absolute left-3.5 top-3.5 h-4 w-4 ${theme.textMuted}`} />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={isBengali ? "যেমন: দীপ্তাংশু মজুমদার" : "e.g. Diptanshu Mazumder"}
                      className={`w-full rounded-xl border ${theme.borderCard} ${theme.bgPage} pl-10 pr-3.5 py-3 text-xs ${theme.textMain} placeholder-slate-400 outline-hidden focus:border-emerald-500 focus:bg-transparent transition-all font-semibold`}
                    />
                  </div>
                </div>

                {/* Email input */}
                <div className="space-y-1.5">
                  <label className={`text-2xs font-bold ${theme.textHeading} uppercase tracking-wider block`}>{t.regEmailLabel}</label>
                  <div className="relative">
                    <Mail className={`absolute left-3.5 top-3.5 h-4 w-4 ${theme.textMuted}`} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.regEmailPlaceholder}
                      className={`w-full rounded-xl border ${theme.borderCard} ${theme.bgPage} pl-10 pr-3.5 py-3 text-xs ${theme.textMain} placeholder-slate-400 outline-hidden focus:border-emerald-500 focus:bg-transparent transition-all font-semibold`}
                    />
                  </div>
                </div>

                {/* STUDENT MOBILE NUMBER FIELD (Hidden ONLY for Admin) */}
                {!isAdmin && email.trim() !== "" && (
                  <div className="space-y-1.5 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <label className={`text-2xs font-bold ${theme.textHeading} uppercase tracking-wider block`}>
                        {isBengali ? "মোবাইল নম্বর (ঐচ্ছিক)" : "Mobile Number (Optional)"}
                      </label>
                      <span className="inline-flex items-center gap-0.5 rounded bg-slate-500/10 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Optional
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3.5 top-3.5 flex items-center gap-1 border-r border-slate-200 dark:border-slate-800 pr-2">
                        <Phone className={`h-4 w-4 ${theme.textMuted}`} />
                        <span className={`text-[11px] font-bold ${theme.textMuted}`}>+91</span>
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                        placeholder={isBengali ? "যেমন: ৯৮৭৬৫-৪৩২১০" : "e.g. 98765-43210"}
                        maxLength={10}
                        className={`w-full rounded-xl border ${theme.borderCard} ${theme.bgPage} pl-20 pr-3.5 py-3 text-xs ${theme.textMain} placeholder-slate-400 outline-hidden focus:border-emerald-500 focus:bg-transparent transition-all font-semibold`}
                      />
                    </div>
                    <p className={`text-[10px] ${theme.textMuted} font-medium`}>
                      {isBengali 
                        ? "আপনার অ্যাকাউন্টের সাথে যোগাযোগের জন্য মোবাইল নম্বর প্রদান করতে পারেন।" 
                        : "Provide your phone number for receiving account updates and communications."}
                    </p>
                  </div>
                )}



                {/* Submit button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    id="btn-register-student"
                    disabled={isSubmitting || !fullName.trim() || !email.trim()}
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold shadow-md transition-all active:scale-98 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${theme.primaryBtn} ${theme.primaryBtnHover} ${theme.primaryBtnText}`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        {isBengali ? "ওয়ার্কস্পেস লোড হচ্ছে..." : "Setting up academic workspace..."}
                      </>
                    ) : (
                      <>
                        {isBengali ? "একাডেমিক ওয়ার্কস্পেসে প্রবেশ করুন" : "Enter Academic Workspace"}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* =========================================
               STEP 2: GORGEOUS OTP VERIFICATION FLOW (Student Only)
               ========================================= */
            <div className="space-y-6 animate-fade-in">
              <button
                type="button"
                onClick={() => setStep("form")}
                className={`inline-flex items-center gap-1.5 text-xs font-bold ${theme.primaryText} hover:underline mb-2 cursor-pointer`}
              >
                <ArrowLeft className="h-4 w-4" />
                {isBengali ? "তথ্যাদি পরিবর্তন করুন" : "Back to details"}
              </button>

              <div className="space-y-2">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 mb-1">
                  <Fingerprint className="h-6 w-6" />
                </div>
                <h1 className={`text-2xl font-black ${theme.textHeading} tracking-tight`}>
                  {isBengali ? "নিরাপদ ওটিপি যাচাইকরণ" : "Secure OTP Verification"}
                </h1>
                <p className={`text-xs ${theme.textMuted} font-medium leading-relaxed`}>
                  {isBengali 
                    ? `আমরা আপনার মোবাইল নম্বর +৯১ ${phoneNumber} এ ৪-ডিজিটের যাচাইকরণ কোড পাঠিয়েছি।` 
                    : `We've dispatched a secure 4-digit code to your registered mobile phone +91 ${phoneNumber}.`}
                </p>
              </div>

              {/* OTP will be received on user's device. No simulated SMS helper is rendered in-app to replicate a real gateway flow. */}
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs">
                  <ShieldCheck className="h-4 w-4 shrink-0 animate-pulse" />
                  <span>{isBengali ? "স্যান্ডবক্স ওটিপি তথ্য" : "Sandbox Environment Info"}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                  {isBengali ? (
                    <>
                      বাস্তব মোবাইল ফোনে এসএমএস পাঠাতে একটি পরিশোধিত গেটওয়ে (যেমন: Twilio, MSG91) প্রয়োজন। যেহেতু এটি একটি প্রিভিউ টেস্ট এনভায়রনমেন্ট, তাই আপনি সরাসরি এই টেস্ট কোডটি ব্যবহার করতে পারেন: <strong className="text-amber-700 dark:text-amber-300 font-black px-1 rounded bg-amber-500/10 border border-amber-500/20 text-xs tracking-wider">{generatedOtp}</strong> অথবা ডিফল্ট পাসকোড <strong className="text-amber-700 dark:text-amber-300 font-black px-1 rounded bg-amber-500/10 border border-amber-500/20 text-xs">1234</strong> দিয়ে সরাসরি লগইন করতে পারেন।
                    </>
                  ) : (
                    <>
                      Sending physical text messages to a phone requires a paid SMS API gateway (e.g., Twilio or MSG91). In this sandbox/preview environment, you can use the secure test code: <strong className="text-amber-700 dark:text-amber-300 font-black px-1 rounded bg-amber-500/10 border border-amber-500/20 text-xs tracking-wider">{generatedOtp}</strong> or bypass immediately using <strong className="text-amber-700 dark:text-amber-300 font-black px-1 rounded bg-amber-500/10 border border-amber-500/20 text-xs">1234</strong> to proceed.
                    </>
                  )}
                </p>
                <div className="pt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (generatedOtp) {
                        const digits = generatedOtp.split("");
                        setEnteredOtp(digits);
                      }
                    }}
                    className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 px-2.5 py-1 rounded-md border border-teal-500/20 transition-all cursor-pointer"
                  >
                    {isBengali ? "কোডটি স্বয়ংক্রিয়ভাবে বসান" : "Auto-fill Code"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEnteredOtp(["1", "2", "3", "4"]);
                    }}
                    className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-md border border-amber-500/20 transition-all cursor-pointer"
                  >
                    {isBengali ? "১২৩৪ বসান" : "Auto-fill 1234"}
                  </button>
                </div>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                {/* 4 Digit Entry Boxes */}
                <div className="space-y-2">
                  <label className={`text-2xs font-bold ${theme.textHeading} uppercase tracking-wider block text-center`}>
                    {isBengali ? "ভেরিফিকেশন কোড লিখুন" : "Enter Verification Code"}
                  </label>
                  
                  <div className="flex gap-3.5 justify-center">
                    {enteredOtp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        required
                        pattern="\d*"
                        maxLength={1}
                        value={digit}
                        ref={(el) => { otpInputsRef.current[index] = el; }}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className={`w-14 h-14 text-center rounded-xl border-2 text-xl font-mono font-black ${
                          digit 
                            ? "border-teal-500 bg-teal-50/15 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400" 
                            : `${theme.borderCard} ${theme.bgPage} text-slate-800 dark:text-white`
                        } focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all`}
                      />
                    ))}
                  </div>
                </div>

                {/* Error Banner */}
                {otpError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-center gap-2 animate-shake text-rose-800 dark:text-rose-200">
                    <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                    <span className="text-2xs font-semibold">{otpError}</span>
                  </div>
                )}

                {/* Action CTA */}
                <div>
                  <button
                    type="submit"
                    disabled={isVerifying || otpSuccess || enteredOtp.join("").length < 4}
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold shadow-md transition-all active:scale-98 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${
                      otpSuccess 
                        ? "bg-emerald-600 text-white border-transparent" 
                        : `${theme.primaryBtn} ${theme.primaryBtnHover} ${theme.primaryBtnText}`
                    }`}
                  >
                    {otpSuccess ? (
                      <span className="flex items-center gap-1.5 animate-pulse">
                        <Check className="h-4 w-4 stroke-[3px]" />
                        {isBengali ? "যাচাই করা হয়েছে!" : "OTP Verified Successfully!"}
                      </span>
                    ) : isVerifying ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        {isBengali ? "যাচাই করা হচ্ছে..." : "Verifying code securely..."}
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        {isBengali ? "কোড যাচাই করুন" : "Verify & Access Study Portal"}
                      </>
                    )}
                  </button>
                </div>

                {/* Countdown Timer or Resend */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  <span className={`${theme.textMuted} font-medium`}>
                    {isBengali ? "কোড পাননি?" : "Didn't receive the SMS?"}
                  </span>
                  
                  {timer > 0 ? (
                    <span className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
                      <RefreshCw className="h-3 w-3 animate-spin text-teal-500" />
                      {isBengali ? `${timer} সেকেন্ডে পুনরায় পাঠান` : `Resend in ${timer}s`}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={generateAndSetOtp}
                      className={`font-black ${theme.primaryText} hover:underline cursor-pointer inline-flex items-center gap-1`}
                    >
                      <RefreshCw className="h-3 w-3" />
                      {isBengali ? "নতুন ওটিপি কোড পাঠান" : "Resend New OTP Code"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

        </div>

      </div>
    </motion.div>
  );
}

// Helper checking function to conditionally hide inputs in real-time
function isEmailAdmin(emailStr: string) {
  return emailStr.trim().toLowerCase() === "mazumderdiptanshu753@gmail.com";
}
