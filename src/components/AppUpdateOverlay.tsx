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
  CheckCircle2
} from "lucide-react";
import { Language } from "../lib/translations";

interface AppUpdateOverlayProps {
  isUpdating: boolean;
  targetVersion?: string;
  progress: number;
  statusStep: string;
  lang: Language;
}

export default function AppUpdateOverlay({
  isUpdating,
  targetVersion,
  progress,
  statusStep,
  lang = "bn"
}: AppUpdateOverlayProps) {
  if (!isUpdating) return null;

  const isBn = lang === "bn";

  const steps = [
    {
      id: 1,
      minProgress: 0,
      maxProgress: 25,
      labelBn: "আপডেট ফাইল ডাউনলোড",
      labelEn: "Downloading Package",
      icon: Download
    },
    {
      id: 2,
      minProgress: 25,
      maxProgress: 50,
      labelBn: "যাচাই এবং এক্সট্র্যাক্ট",
      labelEn: "Verifying & Extracting",
      icon: ShieldCheck
    },
    {
      id: 3,
      minProgress: 50,
      maxProgress: 75,
      labelBn: "ডাটাবেস ও সিস্টেম সিঙ্ক",
      labelEn: "Syncing Systems",
      icon: Database
    },
    {
      id: 4,
      minProgress: 75,
      maxProgress: 100,
      labelBn: "প্রস্তুত ও রিস্টার্ট",
      labelEn: "Restarting App",
      icon: Sparkles
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        id="fullscreen-update-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden select-none"
      >
        {/* Glowing Background Radial Effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Ambient Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", 
            backgroundSize: "32px 32px" 
          }} 
        />

        {/* Center Card Container */}
        <div className="relative z-10 w-full max-w-md px-6 sm:px-8 text-center space-y-8">
          
          {/* Animated Header Badge */}
          <motion.div
            initial={{ scale: 0.8, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold tracking-wider uppercase shadow-lg shadow-teal-500/10"
          >
            <Cpu className="w-4 h-4 text-teal-400 animate-spin" style={{ animationDuration: "6s" }} />
            <span>{isBn ? "সিস্টেম আপডেট চলমান" : "System Upgrade in Progress"}</span>
            {targetVersion && (
              <span className="ml-1 px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-200 text-[10px] font-mono font-bold">
                v{targetVersion}
              </span>
            )}
          </motion.div>

          {/* Central Logo & Orbit Ring Effect */}
          <div className="relative inline-flex items-center justify-center my-2">
            {/* Outer Orbit Rings */}
            <motion.div 
              className="absolute -inset-6 rounded-full border border-teal-500/20 border-dashed"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
            />
            <motion.div 
              className="absolute -inset-3 rounded-full border border-emerald-400/30"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            />

            {/* Glowing Icon Container */}
            <div className="relative h-24 w-24 rounded-3xl bg-gradient-to-br from-teal-500/20 via-emerald-500/10 to-indigo-500/20 border border-teal-400/30 flex items-center justify-center shadow-2xl shadow-teal-500/30 backdrop-blur-xl">
              <GraduationCap className="h-12 w-12 text-teal-300 animate-pulse" />
              <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg text-slate-950 font-black">
                <RefreshCw className="h-4 w-4 animate-spin" />
              </div>
            </div>
          </div>

          {/* Titles */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
              {isBn ? "স্টাডি হাব নতুন সংস্করণে আপডেট হচ্ছে" : "Upgrading STUDY HUB"}
            </h1>
            <p className="text-sm font-medium text-teal-300/90 min-h-[24px] transition-all">
              {statusStep}
            </p>
          </div>

          {/* Main Progress Bar Container */}
          <div className="space-y-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-md shadow-xl">
            <div className="flex justify-between items-center text-xs font-bold font-mono">
              <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {isBn ? "অগ্রগতি" : "Progress"}
              </span>
              <span className="text-emerald-400 text-sm font-extrabold">{progress}%</span>
            </div>

            {/* Progress Bar Track */}
            <div className="relative h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <motion.div 
                className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-indigo-400 rounded-full shadow-lg shadow-emerald-500/50"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.3 }}
              />
            </div>

            {/* 4 Steps Visual Indicators */}
            <div className="grid grid-cols-4 gap-1.5 pt-2">
              {steps.map((step) => {
                const isCompleted = progress >= step.maxProgress;
                const isCurrent = progress >= step.minProgress && progress < step.maxProgress;
                const IconComponent = step.icon;

                return (
                  <div key={step.id} className="flex flex-col items-center gap-1">
                    <div 
                      className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${
                        isCompleted 
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" 
                          : isCurrent 
                          ? "bg-teal-500/30 text-teal-200 border border-teal-400 animate-pulse shadow-md shadow-teal-500/30" 
                          : "bg-slate-800/50 text-slate-600 border border-slate-800"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <IconComponent className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span 
                      className={`text-[9px] font-semibold leading-tight line-clamp-1 ${
                        isCurrent ? "text-teal-300 font-bold" : isCompleted ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {isBn ? step.labelBn : step.labelEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Warning / Instructions */}
          <div className="px-4 py-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-slate-400 text-xs space-y-1">
            <p className="font-semibold text-slate-300">
              {isBn ? "⚡ গুরুত্বপূর্ণ নির্দেশনা:" : "⚡ Important Notice:"}
            </p>
            <p className="text-[11px] leading-relaxed text-slate-400">
              {isBn
                ? "অনুগ্রহ করে ব্রাউজার রিফ্রেশ বা বন্ধ করবেন না। প্রসেস সম্পন্ন হওয়া মাত্র অ্যাপটি সরাসরি নতুন ফিচারের সাথে চালু হবে।"
                : "Please do not close or refresh this tab. System will complete the update and reload automatically."}
            </p>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
