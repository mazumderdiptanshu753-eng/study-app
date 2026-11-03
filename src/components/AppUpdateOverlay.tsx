import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, 
  Download, 
  ShieldCheck, 
  Database, 
  Sparkles, 
  RefreshCw,
  Cpu,
  CheckCircle2,
  Rocket,
  Zap,
  Layers,
  ArrowRight
} from "lucide-react";
import { Language } from "../lib/translations";

interface AppUpdateOverlayProps {
  isUpdating: boolean;
  targetVersion?: string;
  progress: number;
  statusStep: string;
  lang?: Language;
  changelogBn?: string;
  changelogEn?: string;
}

export default function AppUpdateOverlay({
  isUpdating,
  targetVersion,
  progress,
  statusStep,
  lang = "bn",
  changelogBn,
  changelogEn
}: AppUpdateOverlayProps) {
  if (!isUpdating) return null;

  const isBn = lang === "bn";
  const changelogText = isBn ? (changelogBn || changelogEn) : (changelogEn || changelogBn);

  const steps = [
    {
      id: 1,
      minProgress: 0,
      maxProgress: 25,
      labelBn: "প্যাকেজ ডাউনলোড",
      labelEn: "Downloading",
      icon: Download
    },
    {
      id: 2,
      minProgress: 25,
      maxProgress: 50,
      labelBn: "যাচাই ও এক্সট্র্যাক্ট",
      labelEn: "Verifying",
      icon: ShieldCheck
    },
    {
      id: 3,
      minProgress: 50,
      maxProgress: 75,
      labelBn: "ডাটাবেস ও সিঙ্ক",
      labelEn: "System Sync",
      icon: Database
    },
    {
      id: 4,
      minProgress: 75,
      maxProgress: 100,
      labelBn: "নতুন ফিচার প্রয়োগ",
      labelEn: "Finalizing",
      icon: Sparkles
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        id="fullscreen-splash-update-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50/98 via-white to-sky-50/98 text-slate-800 overflow-y-auto px-4 py-8 select-none"
      >
        {/* Colorful Ambient Glow Background Mesh */}
        <div className="fixed -top-32 -left-32 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="fixed -bottom-32 -right-32 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "1.2s" }} />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-sky-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:28px_28px] opacity-70 pointer-events-none" />

        {/* Center Splash Container Card */}
        <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center text-center space-y-6">
          
          {/* Top Pulsing Upgrade Pill Badge */}
          <motion.div
            initial={{ scale: 0.85, y: -15 }}
            animate={{ scale: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 via-teal-500/10 to-emerald-500/10 border border-indigo-200/80 shadow-md shadow-indigo-500/5 text-indigo-700 text-xs font-bold tracking-wide uppercase"
          >
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
            </div>
            <Rocket className="w-4 h-4 text-indigo-600 animate-bounce" />
            <span>{isBn ? "সিস্টেম স্প্ল্যাশ আপডেট চলমান" : "Live Splash System Upgrade"}</span>
            {targetVersion && (
              <span className="ml-1 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-mono font-black shadow-xs">
                v{targetVersion}
              </span>
            )}
          </motion.div>

          {/* Central 3D Animated Orbital Logo Ring */}
          <div className="relative inline-flex items-center justify-center my-3">
            {/* Outer Rotating Dashed Ring */}
            <motion.div 
              className="absolute -inset-7 rounded-full border-2 border-indigo-300/60 border-dashed"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
            />
            {/* Inner Counter Rotating Ring */}
            <motion.div 
              className="absolute -inset-3.5 rounded-full border-2 border-teal-400/50"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            />

            {/* Glowing Logo Container */}
            <div className="relative h-28 w-28 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/35 border-2 border-white/80">
              <GraduationCap className="h-14 w-14 text-white drop-shadow-md animate-pulse" />
              
              {/* Corner Badge */}
              <div className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white font-bold">
                <RefreshCw className="h-4.5 w-4.5 animate-spin" />
              </div>
            </div>
          </div>

          {/* Titles & Dynamic Live Step */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              {isBn ? "স্টাডি হাব নতুন সংস্করণে উন্নীত হচ্ছে" : "STUDY HUB System Upgrade"}
            </h1>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/80 text-xs sm:text-sm font-bold text-teal-800 shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: "4s" }} />
              <span>{statusStep || (isBn ? "আপডেট প্যাকেজ ইনস্টল করা হচ্ছে..." : "Installing update package...")}</span>
            </div>
          </div>

          {/* Main Progress Bar Box */}
          <div className="w-full bg-white/95 backdrop-blur-xl p-5 sm:p-7 rounded-3xl border border-indigo-100/90 shadow-xl shadow-indigo-500/5 space-y-4">
            
            {/* Header with percentage counter */}
            <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
              <span className="text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                {isBn ? "ইনস্টলেশন অগ্রগতি" : "Installation Progress"}
              </span>
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 font-mono text-sm sm:text-base font-black">
                <span>{progress}%</span>
                {progress === 100 && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
            </div>

            {/* Glowing Multi-color Progress Track */}
            <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/90">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 rounded-full shadow-md relative overflow-hidden"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.3 }}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              </motion.div>
            </div>

            {/* 4 Interactive Milestones */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {steps.map((step) => {
                const isCompleted = progress >= step.maxProgress;
                const isCurrent = progress >= step.minProgress && progress < step.maxProgress;
                const IconComponent = step.icon;

                return (
                  <div key={step.id} className="flex flex-col items-center gap-1.5 text-center">
                    <div 
                      className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isCompleted 
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                          : isCurrent 
                          ? "bg-indigo-600 text-white ring-4 ring-indigo-500/20 animate-pulse shadow-md" 
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      ) : (
                        <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      )}
                    </div>
                    <span 
                      className={`text-[10px] sm:text-[11px] leading-tight font-bold ${
                        isCurrent 
                          ? "text-indigo-700" 
                          : isCompleted 
                          ? "text-emerald-700" 
                          : "text-slate-400 font-medium"
                      }`}
                    >
                      {isBn ? step.labelBn : step.labelEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Changelog Card (If Admin Provided Notes) */}
          {changelogText && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-50/90 via-sky-50/80 to-indigo-50/90 border border-teal-200/80 text-left shadow-sm space-y-1.5"
            >
              <div className="flex items-center gap-2 text-xs font-black text-teal-900 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>{isBn ? `সংস্করণ v${targetVersion || ""} এ যা নতুন থাকছে:` : `What's New in v${targetVersion || ""}:`}</span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-semibold">
                {changelogText}
              </p>
            </motion.div>
          )}

          {/* Warning / Live Notice */}
          <div className="w-full px-5 py-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-left flex items-start gap-3 shadow-2xs">
            <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-0.5">
              <p className="text-xs font-black text-amber-950">
                {isBn ? "গুরুত্বপূর্ণ নির্দেশনা:" : "Important Notice:"}
              </p>
              <p className="text-[11px] leading-relaxed text-amber-900/90 font-medium">
                {isBn
                  ? "অনুগ্রহ করে এই ট্যাবটি বন্ধ বা রিফ্রেশ করবেন না। ১০০% সম্পন্ন হওয়া মাত্র অ্যাপটি স্বয়ংক্রিয়ভাবে রিস্টার্ট হয়ে নতুন ফিচার নিয়ে ওপেন হবে।"
                  : "Please keep this tab open. The app will automatically reload and launch with all fresh enhancements."}
              </p>
            </div>
          </div>

          {/* Bottom Completion Celebration Status */}
          {progress === 100 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 animate-bounce"
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>{isBn ? "আপডেট সফল! অ্যাপ রিস্টার্ট হচ্ছে..." : "Update complete! Restarting app..."}</span>
            </motion.div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
