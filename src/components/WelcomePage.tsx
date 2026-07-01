import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, BookOpen, Compass, Award, Shield, ChevronRight } from "lucide-react";
import AppLogo from "./AppLogo";
import { Language, TRANSLATIONS } from "../lib/translations";

interface WelcomePageProps {
  onStart: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function WelcomePage({ onStart, lang, onLanguageChange }: WelcomePageProps) {
  const t = TRANSLATIONS[lang];

  // Mouse position tracking for the 3D parallax effect
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Background floating stars / particles
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Generate static random positions for particles to avoid hydration mismatches
    const tempParticles = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10
    }));
    setParticles(tempParticles);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate normalized coordinates (-0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Set rotation angles (max 25 degrees)
    setRotateX(-mouseY * 30);
    setRotateY(mouseX * 30);
  };

  const handleMouseLeave = () => {
    // Reset back to center smoothly
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div 
      className="min-h-[100dvh] w-full relative bg-slate-950 text-white flex flex-col items-center justify-center overflow-hidden px-4 md:px-8 py-12"
      style={{
        background: "radial-gradient(circle at 50% 50%, #0b1528 0%, #030712 100%)"
      }}
      id="welcome-page-container"
    >
      {/* Floating Language Selector on Welcome Screen */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-1 bg-slate-900/80 border border-slate-800/80 rounded-full p-1.5 backdrop-blur-md">
        <button
          onClick={() => onLanguageChange("en")}
          id="btn-lang-welcome-en"
          className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase transition-all duration-200 cursor-pointer ${
            lang === "en" 
              ? "bg-teal-500 text-slate-950 shadow-sm font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          English
        </button>
        <button
          onClick={() => onLanguageChange("bn")}
          id="btn-lang-welcome-bn"
          className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase transition-all duration-200 cursor-pointer ${
            lang === "bn" 
              ? "bg-teal-500 text-slate-950 shadow-sm font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          বাংলা
        </button>
      </div>

      {/* Glow Effects in the Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-10000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Floating Particle Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/40"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
            animate={{
              y: ["0px", "-100px", "0px"],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Outer Content Layout Grid */}
      <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Modern Core App Branding / Information */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md"
          >
            <Sparkles className="h-4.5 w-4.5 text-amber-400 fill-amber-300 animate-pulse" />
            {t.welcomeSubtitle}
          </motion.div>

          <div className="space-y-3">
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight"
            >
              {t.welcomeTitlePrefix} <br/>
              <span className="bg-gradient-to-r from-teal-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">{t.welcomeTitleAccent}</span>
            </motion.h1>
          </div>

          {/* Quick core metrics / features row */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="grid grid-cols-2 gap-4 w-full max-w-sm pt-4"
          >
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 text-center backdrop-blur-sm">
              <BookOpen className="h-5 w-5 text-teal-400 mx-auto mb-1.5" />
              <div className="text-2xs text-slate-400 font-bold">{t.mathSubject}</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 text-center backdrop-blur-sm">
              <Compass className="h-5 w-5 text-amber-400 mx-auto mb-1.5" />
              <div className="text-2xs text-slate-400 font-bold">{t.aiSummaries}</div>
            </div>
          </motion.div>

          {/* Start Button Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="pt-6"
          >
            {/* UNIQUE GLOWING INTERACTIVE START BUTTON */}
            <button
              onClick={onStart}
              id="unique-welcome-start-button"
              className="group relative inline-flex items-center justify-center p-0.5 rounded-full overflow-hidden font-extrabold text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-teal-500/20"
            >
              {/* Spinning multi-color neon orbit outline */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-teal-400 via-amber-400 to-rose-400 rounded-full animate-spin duration-3000"></span>
              
              {/* Inner capsule layout */}
              <span className="relative flex items-center gap-3 px-8 py-4 bg-slate-950 rounded-full transition-all group-hover:bg-opacity-90">
                <span className="bg-gradient-to-r from-teal-200 to-amber-200 bg-clip-text text-transparent font-black tracking-widest text-xs uppercase">
                  {t.welcomeStartButton}
                </span>
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all duration-300">
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                </span>
              </span>
            </button>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center lg:text-left mt-3 ml-2">
              {t.secureSessionNotice}
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="lg:col-span-6 flex items-center justify-center perspective-[1000px] h-[360px] sm:h-[450px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            ref={cardRef}
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            }}
            className="relative w-80 sm:w-96 aspect-square bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center backdrop-blur-md cursor-grab active:cursor-grabbing select-none transition-all duration-150"
          >
            {/* Background glowing ring inside card */}
            <div className="absolute inset-10 rounded-full border border-teal-500/20 animate-pulse duration-3000 pointer-events-none z-0"></div>
            <div className="absolute inset-16 rounded-full border border-dashed border-slate-700/60 animate-spin duration-15000 pointer-events-none z-0"></div>

            {/* 3D Layer 1: App Logo Stack (Highest translateZ) */}
            <div 
              style={{ transform: "translateZ(80px)" }} 
              className="relative z-10 mb-6 drop-shadow-[0_20px_35px_rgba(200,29,37,0.3)] transition-transform duration-300"
            >
              <AppLogo size="xl" className="border-4 border-slate-950/40 scale-105" />
            </div>

            {/* 3D Layer 2: Label & Title (Medium translateZ) */}
            <div 
              style={{ transform: "translateZ(50px)" }}
              className="text-center space-y-1 relative z-10 transition-transform duration-300"
            >
              <h3 className="text-xl font-black tracking-widest uppercase text-slate-100">
                {t.brandName}
              </h3>
            </div>

            {/* 3D Layer 3: Developer attribution (Dynamic 3D float) */}
            <div 
              style={{ 
                transform: "translateZ(35px)",
                backfaceVisibility: "hidden"
              }}
              className="text-center relative z-10 mt-6 transition-transform duration-300"
            >
              <span className="text-xs sm:text-sm font-black tracking-widest text-teal-300 font-mono bg-slate-900 border-2 border-teal-400 px-5 py-2.5 rounded-xl shadow-[0_4px_20px_rgba(13,148,136,0.4)] block uppercase">
                DEVOLOPED BY:- DIPTANSHU MAZUMDER
              </span>
            </div>

          </motion.div>
        </motion.div>

      </div>

      {/* Small floating branding */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-600 font-bold uppercase tracking-widest select-none pointer-events-none">
        Crafted for Excellence • {t.brandName}
      </div>
    </div>
  );
}
