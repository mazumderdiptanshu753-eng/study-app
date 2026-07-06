import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, BookOpen, Compass, Award, Shield, ChevronRight, GraduationCap, Brain } from "lucide-react";
import AppLogo from "./AppLogo";
import { Language, TRANSLATIONS } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";

interface WelcomePageProps {
  onStart: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  theme: ThemeConfig;
}

export default function WelcomePage({ onStart, lang, onLanguageChange, theme }: WelcomePageProps) {
  const t = TRANSLATIONS[lang];
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = ((y - centerY) / centerY) * -12;
    const rotateYValue = ((x - centerX) / centerX) * 12;
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div 
      className={`flex-1 min-h-[100dvh] w-full relative ${theme.isDark ? "bg-[#0b0f19]" : "bg-slate-50"} ${theme.textMain} flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto px-4 md:px-8 py-8 sm:py-12`}
      id="welcome-page-container"
    >
      {/* Background Decorative Elements with Real Framer Motion Orbit & Drift Animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 ${theme.isDark ? 'bg-indigo-900/30' : 'bg-teal-200/30'}`}
        />
        <motion.div 
          animate={{
            x: [0, -35, 40, 0],
            y: [0, 45, -50, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 19,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 ${theme.isDark ? 'bg-fuchsia-900/30' : 'bg-rose-200/30'}`}
        />
        <motion.div 
          animate={{
            x: [0, 30, -40, 0],
            y: [0, 60, -30, 0],
            scale: [1, 1.08, 0.9, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 ${theme.isDark ? 'bg-cyan-900/30' : 'bg-amber-200/30'}`}
        />
      </div>

      {/* Gentle Floating Math & AI Symbols for Academic Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[
          { icon: "+", top: "12%", left: "12%", delay: 0, scale: 1.2 },
          { icon: "π", top: "22%", left: "88%", delay: 1.5, scale: 1.4 },
          { icon: "√", top: "72%", left: "10%", delay: 2, scale: 1.3 },
          { icon: "÷", top: "78%", left: "82%", delay: 0.5, scale: 1.1 },
          { icon: "∑", top: "45%", left: "92%", delay: 3, scale: 1.5 },
          { icon: "x", top: "58%", left: "6%", delay: 2.5, scale: 1.0 },
          { icon: "∫", top: "8%", left: "76%", delay: 1, scale: 1.6 },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: theme.isDark ? [0.08, 0.28, 0.08] : [0.12, 0.38, 0.12],
              scale: item.scale,
              y: [0, -12, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 1 },
              y: { duration: 5 + idx, repeat: Infinity, ease: "easeInOut", delay: item.delay },
              rotate: { duration: 22 + idx * 4, repeat: Infinity, ease: "linear" },
            }}
            style={{ top: item.top, left: item.left }}
            className={`absolute font-mono font-black text-lg sm:text-2xl ${theme.isDark ? "text-slate-500/20" : "text-slate-400/30"}`}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      {/* Floating Language Selector on Welcome Screen */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`absolute top-4 right-4 z-50 flex items-center gap-1 ${theme.isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} border rounded-full p-1.5 backdrop-blur-md shadow-sm`}
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onLanguageChange("en")}
          id="btn-lang-welcome-en"
          className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase transition-all duration-200 cursor-pointer ${
            lang === "en" 
              ? `${theme.primaryBtn} ${theme.primaryBtnText} shadow-sm font-bold`
              : `${theme.textMuted} hover:${theme.primaryText}`
          }`}
        >
          English
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onLanguageChange("bn")}
          id="btn-lang-welcome-bn"
          className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase transition-all duration-200 cursor-pointer ${
            lang === "bn" 
              ? `${theme.primaryBtn} ${theme.primaryBtnText} shadow-sm font-bold`
              : `${theme.textMuted} hover:${theme.primaryText}`
          }`}
        >
          বাংলা
        </motion.button>
      </motion.div>

      {/* Outer Content Layout Grid */}
      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center h-full max-h-full">
        
        {/* Left Side: Modern Core App Branding / Information */}
        <div className="col-span-1 lg:col-span-6 xl:col-span-7 space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start justify-center h-full max-h-full">
          
          {/* Small floating logo centered on mobile */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -6, 0]
            }}
            transition={{
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="flex items-center gap-2 mb-2 lg:hidden"
          >
            <div className={`${theme.primaryBg} p-3 rounded-[2rem] shadow-xl border ${theme.borderCard}`}>
              <AppLogo size="lg" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: [1, 1.03, 1]
            }}
            transition={{ 
              duration: 0.6,
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-2 rounded-full ${theme.badgeBg} ${theme.badgeText} text-[10px] sm:text-xs font-bold tracking-wider uppercase shadow-sm`}
          >
            <Sparkles className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 animate-spin" style={{ animationDuration: "12s" }} />
            {t.welcomeSubtitle}
          </motion.div>
          
          <div className="space-y-2 sm:space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.15] lg:leading-[1.1]"
            >
              <span className={`block ${theme.textHeading}`}>{t.welcomeTitlePrefix}</span>
              <motion.span 
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  backgroundSize: "200% auto",
                }}
                className={`bg-gradient-to-r from-teal-500 via-amber-500 to-rose-500 bg-clip-text text-transparent inline-block pb-1 sm:pb-2`}
              >
                {t.welcomeTitleAccent}
              </motion.span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`${theme.textMuted} text-xs sm:text-base max-w-md sm:max-w-xl font-medium leading-relaxed px-2 sm:px-0`}
            >
              {lang === "bn" 
                ? "এখানে গণিতের সূত্র ও অধ্যয়ন নোটসমূহ সাজান, তাৎক্ষণিকভাবে এআই দ্বারা গুরুত্বপূর্ণ সারাংশ তৈরি করুন, এবং ফ্ল্যাশকার্ড পর্যালোচনা করুন।"
                : "Organize study notes, instantly generate AI-powered summaries, and build custom flashcards for a seamless learning experience."}
            </motion.p>
          </div>

          {/* Start Button Section with Premium Custom Glow and Breathing Motion */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="pt-2 sm:pt-4 flex flex-col items-center lg:items-start"
          >
            {(() => {
              // Custom vibrant gradient styling based on active theme
              let btnGradient = "from-emerald-500 via-teal-500 to-cyan-600";
              let shadowColor = "rgba(20, 184, 166, 0.45)";
              let shadowGlowColor = "rgba(20, 184, 166, 0.2)";
              
              if (theme.id === "cosmic") {
                btnGradient = "from-[#4f46e5] via-[#7c3aed] to-[#db2777]";
                shadowColor = "rgba(124, 58, 237, 0.5)";
                shadowGlowColor = "rgba(124, 58, 237, 0.25)";
              } else if (theme.id === "aurora") {
                btnGradient = "from-cyan-500 via-sky-500 to-emerald-500";
                shadowColor = "rgba(6, 182, 212, 0.45)";
                shadowGlowColor = "rgba(6, 182, 212, 0.2)";
              } else if (theme.id === "sunset") {
                btnGradient = "from-orange-500 via-pink-500 to-rose-600";
                shadowColor = "rgba(244, 63, 94, 0.5)";
                shadowGlowColor = "rgba(244, 63, 94, 0.25)";
              }

              return (
                <motion.button
                  onClick={onStart}
                  id="btn-enter-academic-workspace"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    boxShadow: `0 12px 30px ${shadowColor}`
                  }}
                  whileTap={{ scale: 0.96 }}
                  animate={{
                    boxShadow: [
                      `0 4px 14px ${shadowColor}`,
                      `0 8px 32px 10px ${shadowGlowColor}`,
                      `0 4px 14px ${shadowColor}`
                    ]
                  }}
                  transition={{
                    boxShadow: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full p-3 px-7 sm:p-4.5 sm:px-10 font-black text-xs sm:text-sm tracking-widest transition-all duration-300 cursor-pointer shadow-xl bg-gradient-to-r ${btnGradient} ${theme.primaryBtnText} border border-white/10 uppercase`}
                >
                  {/* High-gloss animated shine overlay */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine pointer-events-none" style={{ animationDuration: "3s" }} />
                  
                  {/* Pulsing colored ring border */}
                  <span className={`absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-colors duration-300`} />
                  
                  <span className="relative flex items-center gap-3">
                    <span className="tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                      {t.welcomeStartButton}
                    </span>
                    <motion.span 
                      animate={{ x: [0, 6, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      className="flex items-center justify-center w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-full bg-white/20 group-hover:bg-white group-hover:text-slate-900 group-hover:shadow-md transition-all duration-300"
                    >
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </motion.span>
                  </span>
                </motion.button>
              );
            })()}
            <p className={`text-[8px] sm:text-[10px] ${theme.textMuted} font-bold uppercase tracking-wider text-center lg:text-left mt-3.5 sm:mt-5 opacity-75`}>
              {t.secureSessionNotice}
            </p>
          </motion.div>
        </div>

        {/* Right Side: 3D Academic Parallax Constellation Orbits */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="hidden lg:flex lg:col-span-6 xl:col-span-5 items-center justify-center perspective-[1200px] h-[500px] relative"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            ref={cardRef}
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            }}
            className="relative w-[380px] h-[480px] flex items-center justify-center transition-transform duration-200 ease-out select-none cursor-grab active:cursor-grabbing"
          >
            {/* Glowing background hub aura */}
            <div className={`absolute w-72 h-72 rounded-full filter blur-[60px] opacity-25 animate-pulse ${theme.isDark ? 'bg-teal-500/30' : 'bg-teal-400/20'} pointer-events-none`} />

            {/* Pulsing connection lines between center and orbiting nodes */}
            <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none opacity-45 dark:opacity-65" style={{ transform: "translateZ(20px)" }}>
              {/* Top-Left Line */}
              <motion.line 
                x1="190" y1="240" x2="65" y2="115" 
                stroke={theme.isDark ? "rgba(20, 184, 166, 0.45)" : "rgba(20, 184, 166, 0.3)"} 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
                animate={{ strokeDashoffset: [-20, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
              {/* Top-Right Line */}
              <motion.line 
                x1="190" y1="240" x2="315" y2="135" 
                stroke={theme.isDark ? "rgba(99, 102, 241, 0.45)" : "rgba(99, 102, 241, 0.3)"} 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
                animate={{ strokeDashoffset: [-20, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
              {/* Bottom-Left Line */}
              <motion.line 
                x1="190" y1="240" x2="65" y2="345" 
                stroke={theme.isDark ? "rgba(245, 158, 11, 0.45)" : "rgba(245, 158, 11, 0.3)"} 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
                animate={{ strokeDashoffset: [-20, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
              {/* Bottom-Right Line */}
              <motion.line 
                x1="190" y1="240" x2="315" y2="365" 
                stroke={theme.isDark ? "rgba(244, 63, 94, 0.45)" : "rgba(244, 63, 94, 0.3)"} 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
                animate={{ strokeDashoffset: [-20, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </svg>

            {/* CENTRAL GLASS CORE NODE */}
            <motion.div
              style={{ transform: "translateZ(60px)" }}
              className={`absolute w-60 h-60 rounded-full ${theme.isDark ? 'bg-slate-900/85 border-slate-800/90 shadow-[0_0_50px_rgba(20,184,166,0.18)]' : 'bg-white/95 border-slate-200/90 shadow-[0_0_40px_rgba(20,184,166,0.12)]'} border flex flex-col items-center justify-center p-4 backdrop-blur-xl transition-all duration-300`}
            >
              <div className={`absolute inset-2 rounded-full border ${theme.heroOuterBorder} opacity-40 animate-ping`} style={{ animationDuration: "3s" }}></div>
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <AppLogo size="xxl" />
              </motion.div>
              <span className={`text-[12px] font-black tracking-widest uppercase mt-4.5 ${theme.textHeading} drop-shadow-sm`}>
                {t.brandName}
              </span>
              <div className="flex gap-1.5 mt-2">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse delay-150"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse delay-300"></span>
              </div>
            </motion.div>

            {/* FLOATING NODE 1: AI SOLVER (Top Left) */}
            <motion.div
              style={{ 
                transform: "translateZ(95px) translateX(-125px) translateY(-125px)",
                transformStyle: "preserve-3d"
              }}
              animate={{
                y: [0, -6, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`absolute w-36 p-3 rounded-2xl ${theme.isDark ? 'bg-[#0f172a]/95 border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.35)]' : 'bg-white/95 border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.07)]'} border text-left backdrop-blur-md transition-all duration-300`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="h-5 w-5 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                </div>
                <span className="text-[8px] font-extrabold tracking-wider text-teal-600 uppercase">AI Solver</span>
              </div>
              <div className="font-mono text-[8.5px] leading-tight text-slate-500 space-y-0.5 select-none">
                <div className="text-teal-500 font-bold">f(x) = ∫ x² dx</div>
                <div className="text-slate-400 dark:text-slate-400 font-black">= x³/3 + C</div>
              </div>
            </motion.div>

            {/* FLOATING NODE 2: FLIPPING FLASHCARD (Top Right) */}
            <motion.div
              style={{ 
                transform: "translateZ(115px) translateX(125px) translateY(-105px)",
                transformStyle: "preserve-3d"
              }}
              animate={{
                y: [0, 6, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute w-36 h-20 rounded-2xl perspective-[500px] transition-all duration-300"
            >
              <div 
                className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}
              >
                {/* Front Side */}
                <div className={`absolute inset-0 backface-hidden p-3 rounded-2xl ${theme.isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'} border flex flex-col justify-between shadow-lg`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[7px] font-black tracking-widest text-indigo-500 uppercase">Card #12</span>
                    <Brain className="h-2.5 w-2.5 text-indigo-500" />
                  </div>
                  <div className={`text-[9px] font-black leading-tight ${theme.textHeading} truncate`}>
                    Euler's Formula?
                  </div>
                </div>
                {/* Back Side */}
                <div className={`absolute inset-0 backface-hidden rotate-y-180 p-3 rounded-2xl ${theme.isDark ? 'bg-[#0f172a]/95 border-indigo-500/30' : 'bg-indigo-50/95 border-indigo-200'} border flex flex-col justify-between shadow-lg`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[7px] font-black tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">Answer</span>
                    <Brain className="h-2.5 w-2.5 text-indigo-600 fill-indigo-500/20" />
                  </div>
                  <div className="text-[8px] font-mono font-black text-indigo-600 dark:text-indigo-400 leading-tight">
                    e^(iπ) + 1 = 0
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FLOATING NODE 3: FORMULA & STUDY METRIC (Bottom Left) */}
            <motion.div
              style={{ 
                transform: "translateZ(90px) translateX(-125px) translateY(105px)",
                transformStyle: "preserve-3d"
              }}
              animate={{
                y: [0, -5, 0]
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`absolute w-36 p-3 rounded-2xl ${theme.isDark ? 'bg-[#0f172a]/95 border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.35)]' : 'bg-white/95 border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.07)]'} border text-left backdrop-blur-md transition-all duration-300`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="h-5 w-5 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <BookOpen className="h-3 w-3" />
                </div>
                <span className="text-[8px] font-extrabold tracking-wider text-amber-600 uppercase">Formulas</span>
              </div>
              <div className="space-y-1">
                <div className={`text-[8px] font-bold ${theme.textHeading} truncate`}>Physics Revision</div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                  <motion.div 
                    animate={{ width: ["10%", "85%", "85%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 1.5 }}
                    className="bg-amber-500 h-full rounded-full"
                  />
                </div>
                <div className="flex justify-between items-center text-[6.5px] font-extrabold text-slate-400">
                  <span>85% READY</span>
                  <span className="text-amber-500 font-black">12 NOTES</span>
                </div>
              </div>
            </motion.div>

            {/* FLOATING NODE 4: PREMIUM SIGNATURE PILL (Bottom Right) */}
            <motion.div
              style={{ 
                transform: "translateZ(100px) translateX(125px) translateY(125px)",
                transformStyle: "preserve-3d"
              }}
              animate={{
                y: [0, 5, 0]
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`absolute w-36 p-2.5 rounded-2xl ${theme.isDark ? 'bg-slate-900 border-white/5' : 'bg-slate-950 border-white/10'} shadow-xl border text-left backdrop-blur-md transition-all duration-300`}
            >
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[7px] font-black tracking-widest text-emerald-400 uppercase">SYSTEM ACTIVE</span>
              </div>
              <div className="mt-1">
                <div className="text-[8px] font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-amber-300 to-rose-300 truncate">
                  Diptanshu Mazumder
                </div>
                <div className="text-[6px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Lead Developer
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile Developer Attribution with Premium Floating Motion */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: 1, 
          y: [0, -3, 0]
        }}
        transition={{
          opacity: { duration: 0.8, delay: 0.7 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute bottom-4 left-0 right-0 text-center lg:hidden z-20"
      >
        <span className={`inline-block px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-wider uppercase border border-slate-200/40 dark:border-slate-800/40 backdrop-blur-md ${theme.isDark ? 'bg-slate-900/40 text-slate-400' : 'bg-white/40 text-slate-500'} shadow-[0_4px_12px_rgba(0,0,0,0.05)]`}>
          Developed By: Diptanshu Mazumder
        </span>
      </motion.div>

    </div>
  );
}
