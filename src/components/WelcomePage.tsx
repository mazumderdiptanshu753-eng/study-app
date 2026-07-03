import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, BookOpen, Compass, Award, Shield, ChevronRight, GraduationCap } from "lucide-react";
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
  const cardRef = useRef<HTMLDivElement | null>(null);

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
      className={`flex-1 min-h-[100dvh] w-full relative ${theme.isDark ? "bg-[#0b0f19]" : "bg-slate-50"} ${theme.textMain} flex flex-col items-center justify-center overflow-x-hidden px-4 md:px-8 py-12 touch-scroll`}
      id="welcome-page-container"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob ${theme.isDark ? 'bg-indigo-900/40' : 'bg-teal-200/40'}`}></div>
        <div className={`absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-2000 ${theme.isDark ? 'bg-fuchsia-900/40' : 'bg-rose-200/40'}`}></div>
        <div className={`absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-4000 ${theme.isDark ? 'bg-cyan-900/40' : 'bg-amber-200/40'}`}></div>
      </div>

      {/* Floating Language Selector on Welcome Screen */}
      <div className={`absolute top-4 right-4 z-50 flex items-center gap-1 ${theme.isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} border rounded-full p-1.5 backdrop-blur-md shadow-sm`}>
        <button
          onClick={() => onLanguageChange("en")}
          id="btn-lang-welcome-en"
          className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase transition-all duration-200 cursor-pointer ${
            lang === "en" 
              ? `${theme.primaryBtn} ${theme.primaryBtnText} shadow-sm font-bold`
              : `${theme.textMuted} hover:${theme.primaryText}`
          }`}
        >
          English
        </button>
        <button
          onClick={() => onLanguageChange("bn")}
          id="btn-lang-welcome-bn"
          className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase transition-all duration-200 cursor-pointer ${
            lang === "bn" 
              ? `${theme.primaryBtn} ${theme.primaryBtnText} shadow-sm font-bold`
              : `${theme.textMuted} hover:${theme.primaryText}`
          }`}
        >
          বাংলা
        </button>
      </div>

      {/* Outer Content Layout Grid */}
      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Side: Modern Core App Branding / Information */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start pt-10 lg:pt-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${theme.badgeBg} ${theme.badgeText} text-xs font-bold tracking-wider uppercase shadow-sm`}
          >
            <Sparkles className="h-4.5 w-4.5 animate-pulse" />
            {t.welcomeSubtitle}
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1]"
            >
              <span className={`block ${theme.textHeading}`}>{t.welcomeTitlePrefix}</span>
              <span className={`bg-gradient-to-r from-teal-500 via-amber-500 to-rose-500 bg-clip-text text-transparent inline-block pb-2`}>
                {t.welcomeTitleAccent}
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`${theme.textMuted} text-base sm:text-lg max-w-xl font-medium leading-relaxed`}
            >
              {lang === "bn" 
                ? "এখানে গণিতের সূত্র ও অধ্যয়ন নোটসমূহ সাজান, তাৎক্ষণিকভাবে এআই দ্বারা গুরুত্বপূর্ণ সারাংশ তৈরি করুন, এবং ফ্ল্যাশকার্ড পর্যালোচনা করুন।"
                : "Organize study notes, instantly generate AI-powered summaries, and build custom flashcards for a seamless learning experience."}
            </motion.p>
          </div>

          {/* Start Button Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="pt-4 flex flex-col items-center lg:items-start"
          >
            <button
              onClick={onStart}
              className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full p-4 px-8 font-extrabold text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-xl ${theme.primaryBtn} ${theme.primaryBtnText}`}
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
              <span className="relative flex items-center gap-3">
                <span className="tracking-widest uppercase">
                  {t.welcomeStartButton}
                </span>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 transition-all duration-300 group-hover:bg-white group-hover:text-slate-900 group-hover:shadow-md">
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                </span>
              </span>
            </button>
            <p className={`text-[10px] ${theme.textMuted} font-bold uppercase tracking-wider text-center lg:text-left mt-4 opacity-70`}>
              {t.secureSessionNotice}
            </p>
          </motion.div>
        </div>

        {/* Right Side: 3D App Presentation Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="lg:col-span-6 xl:col-span-5 flex items-center justify-center perspective-[1000px] h-[400px] sm:h-[500px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            ref={cardRef}
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            }}
            className={`relative w-[300px] sm:w-[360px] aspect-[4/5] ${theme.bgCard} border ${theme.borderCard} rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center justify-center backdrop-blur-xl cursor-grab active:cursor-grabbing select-none transition-transform duration-150 ease-out`}
          >
            {/* Background glowing ring inside card */}
            <div className={`absolute inset-6 rounded-[2rem] border ${theme.heroOuterBorder} opacity-50 animate-pulse duration-[3000ms] pointer-events-none`}></div>
            
            {/* 3D Layer 1: App Logo Stack */}
            <div 
              style={{ transform: "translateZ(80px)" }} 
              className="relative z-10 mb-8 transition-transform duration-300 shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-transparent p-1"
            >
              <div className={`${theme.primaryBg} rounded-3xl p-4`}>
                <AppLogo size="xl" className="scale-110" />
              </div>
            </div>

            {/* 3D Layer 2: Label & Title */}
            <div 
              style={{ transform: "translateZ(50px)" }}
              className="text-center space-y-2 relative z-10 transition-transform duration-300 w-full"
            >
              <h3 className={`text-2xl font-black tracking-widest uppercase ${theme.textHeading}`}>
                {t.brandName}
              </h3>
              <div className="flex justify-center gap-2 mt-4">
                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${theme.badgeBg} ${theme.badgeText}`}>
                  {lang === "bn" ? "অধ্যয়ন" : "Study"}
                </span>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${theme.accentBg} ${theme.accentText}`}>
                  {lang === "bn" ? "এআই" : "AI"}
                </span>
              </div>
            </div>

            {/* 3D Layer 3: Developer attribution (Dynamic 3D float) */}
            <div 
              style={{ 
                transform: "translateZ(60px)",
                backfaceVisibility: "hidden"
              }}
              className="absolute bottom-[-1.5rem] text-center relative z-20 mt-10 transition-transform duration-300 w-[110%]"
            >
              <div className={`flex items-center justify-center gap-2 ${theme.isDark ? 'bg-slate-800' : 'bg-slate-900'} text-white px-5 py-3 rounded-2xl shadow-xl border border-white/10`}>
                <span className="text-xs sm:text-sm md:text-base font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-amber-300">
                  Developed By: Diptanshu Mazumder
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
}
