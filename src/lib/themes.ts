export type ThemeId = "emerald" | "cosmic" | "aurora" | "sunset";

export interface ThemeConfig {
  id: ThemeId;
  nameEn: string;
  nameBn: string;
  icon: string;
  isDark: boolean;
  
  // Backgrounds & Layout
  bgPage: string;
  bgHeader: string;
  bgFooter: string;
  borderHeader: string;
  borderFooter: string;
  
  // Typography Colors
  textMain: string;
  textMuted: string;
  textHeading: string;
  textHeroTitle: string;
  textHeroSub: string;
  
  // Card Configurations
  bgCard: string;
  borderCard: string;
  hoverBorderCard: string;
  hoverTranslate: string;
  
  // Highlighting & Accents
  primaryText: string;
  primaryBg: string;
  primaryBtn: string;
  primaryBtnHover: string;
  primaryBtnText: string;
  accentBg: string;
  accentText: string;
  badgeBg: string;
  badgeText: string;
  
  // Hero & Interactive Banners
  heroGradient: string;
  heroOuterBorder: string;
  heroBtnBg: string;
  heroBtnText: string;
  heroBtnHover: string;
  heroSecondaryBtn: string;
  heroSecondaryBtnHover: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  emerald: {
    id: "emerald",
    nameEn: "Emerald Oasis",
    nameBn: "মরকত উদ্যান",
    icon: "🌱",
    isDark: false,
    
    // Backgrounds & Layout
    bgPage: "bg-slate-50 bg-[radial-gradient(#10b981_0.7px,transparent_0.7px)] [background-size:24px_24px]",
    bgHeader: "bg-white/80 backdrop-blur-xl border-b border-emerald-100/50",
    bgFooter: "bg-white border-t border-slate-100",
    borderHeader: "border-emerald-100/50",
    borderFooter: "border-slate-100",
    
    // Typography Colors
    textMain: "text-slate-700 font-semibold",
    textMuted: "text-slate-450 font-normal",
    textHeading: "text-slate-900 font-extrabold tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-teal-100 font-black",
    textHeroSub: "text-emerald-50/90 font-medium",
    
    // Card Configurations
    bgCard: "bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.015)] rounded-2xl",
    borderCard: "border-slate-200/60",
    hoverBorderCard: "hover:border-emerald-400 hover:shadow-[0_15px_40px_rgba(16,185,129,0.12)]",
    hoverTranslate: "hover:-translate-y-1.5 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-emerald-700 font-bold",
    primaryBg: "bg-emerald-50/70 border border-emerald-100",
    primaryBtn: "bg-gradient-to-r from-emerald-550 to-teal-550 hover:from-emerald-600 hover:to-teal-600 text-white font-bold shadow-[0_4px_16px_rgba(16,185,129,0.22)] hover:shadow-[0_8px_24px_rgba(16,185,129,0.35)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200",
    primaryBtnHover: "hover:from-emerald-600 hover:to-teal-600",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-teal-50 border border-teal-100/50",
    accentText: "text-teal-700 font-semibold",
    badgeBg: "bg-emerald-50/90 border border-emerald-100",
    badgeText: "text-emerald-700 font-bold",
    
    // Hero & Interactive Banners
    heroGradient: "from-emerald-600 via-emerald-500 to-teal-600 shadow-[inset_0_0_80px_rgba(0,0,0,0.02)] border border-emerald-500/20",
    heroOuterBorder: "border-emerald-500/20",
    heroBtnBg: "bg-white hover:bg-emerald-50 text-emerald-950 font-bold shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] transform hover:-translate-y-0.5 transition-all",
    heroBtnText: "text-emerald-950 font-extrabold",
    heroBtnHover: "hover:bg-emerald-50",
    heroSecondaryBtn: "bg-emerald-800/40 border border-emerald-400/20 text-emerald-50 font-semibold backdrop-blur-md hover:bg-emerald-800/60 transition-all",
    heroSecondaryBtnHover: "hover:bg-emerald-800/60"
  },
  cosmic: {
    id: "cosmic",
    nameEn: "Midnight Cosmic",
    nameBn: "মহাজাগতিক রাত",
    icon: "🌌",
    isDark: true,
    
    // Backgrounds & Layout
    bgPage: "bg-[#060913] bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:32px_32px]",
    bgHeader: "bg-[#090e1a]/85 backdrop-blur-xl border-b border-white/[0.08]",
    bgFooter: "bg-[#050912] border-t border-slate-900/60",
    borderHeader: "border-white/[0.08]",
    borderFooter: "border-slate-900/60",
    
    // Typography Colors
    textMain: "text-slate-300 font-semibold",
    textMuted: "text-slate-450 font-normal",
    textHeading: "text-white font-extrabold tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-indigo-200 to-cyan-100 font-black",
    textHeroSub: "text-indigo-200/85 font-medium",
    
    // Card Configurations
    bgCard: "bg-slate-950/45 backdrop-blur-xl border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.35)] rounded-2xl",
    borderCard: "border-white/[0.08]",
    hoverBorderCard: "hover:border-indigo-400/60 hover:shadow-[0_18px_48px_rgba(99,102,241,0.22)] hover:bg-slate-950/70",
    hoverTranslate: "hover:-translate-y-1.5 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-indigo-400 font-bold",
    primaryBg: "bg-indigo-500/15 border border-indigo-500/30",
    primaryBtn: "bg-gradient-to-r from-indigo-550 via-violet-550 to-fuchsia-550 text-white font-bold shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:shadow-[0_8px_28px_rgba(99,102,241,0.55)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200",
    primaryBtnHover: "hover:from-indigo-600 hover:to-violet-600",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-purple-500/15 border border-purple-500/30",
    accentText: "text-purple-400 font-semibold",
    badgeBg: "bg-indigo-950/40 border border-indigo-500/25",
    badgeText: "text-indigo-300 font-bold",
    
    // Hero & Interactive Banners
    heroGradient: "from-[#080d1e] via-[#12182c] to-[#1e1b52] border border-indigo-500/15 shadow-[inset_0_0_100px_rgba(99,102,241,0.08)]",
    heroOuterBorder: "border-indigo-500/25",
    heroBtnBg: "bg-gradient-to-r from-indigo-550 to-purple-600 text-white font-extrabold shadow-[0_4px_15px_rgba(99,102,241,0.35)] hover:shadow-[0_8px_25px_rgba(99,102,241,0.5)] transform hover:-translate-y-0.5 transition-all duration-200",
    heroBtnText: "text-white font-extrabold",
    heroBtnHover: "hover:from-indigo-400 hover:to-purple-500",
    heroSecondaryBtn: "bg-slate-950/60 border border-slate-700/50 text-slate-200 font-semibold backdrop-blur-md hover:bg-slate-950/90 transition-all",
    heroSecondaryBtnHover: "hover:bg-slate-950/90"
  },
  aurora: {
    id: "aurora",
    nameEn: "Nordic Aurora",
    nameBn: "মেরু জ্যোতি",
    icon: "❄️",
    isDark: false,
    
    // Backgrounds & Layout
    bgPage: "bg-slate-50 bg-[radial-gradient(#06b6d4_0.7px,transparent_0.7px)] [background-size:24px_24px]",
    bgHeader: "bg-white/80 backdrop-blur-xl border-b border-cyan-100/60",
    bgFooter: "bg-slate-50 border-t border-slate-200/60",
    borderHeader: "border-cyan-100/60",
    borderFooter: "border-slate-200/60",
    
    // Typography Colors
    textMain: "text-slate-700 font-semibold",
    textMuted: "text-slate-450 font-normal",
    textHeading: "text-slate-900 font-extrabold tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-900 via-sky-900 to-teal-900 font-black",
    textHeroSub: "text-cyan-900/85 font-medium",
    
    // Card Configurations
    bgCard: "bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-[0_8px_30px_rgba(14,116,144,0.015)] rounded-2xl",
    borderCard: "border-slate-200/80",
    hoverBorderCard: "hover:border-cyan-400 hover:shadow-[0_15px_40px_rgba(6,182,212,0.12)]",
    hoverTranslate: "hover:-translate-y-1.5 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-cyan-700 font-bold",
    primaryBg: "bg-cyan-50 border border-cyan-100/60",
    primaryBtn: "bg-gradient-to-r from-cyan-550 to-sky-550 hover:from-cyan-600 hover:to-sky-600 text-white font-bold shadow-[0_4px_16px_rgba(6,182,212,0.22)] hover:shadow-[0_8px_24px_rgba(6,182,212,0.35)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200",
    primaryBtnHover: "hover:from-cyan-650 hover:to-sky-650",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-emerald-50 border border-emerald-100/50",
    accentText: "text-emerald-700 font-semibold",
    badgeBg: "bg-cyan-50/90 border border-cyan-100",
    badgeText: "text-cyan-850 font-bold",
    
    // Hero & Interactive Banners
    heroGradient: "from-cyan-100 via-sky-50 to-emerald-100 border border-cyan-200/40 shadow-[inset_0_0_60px_rgba(6,182,212,0.015)]",
    heroOuterBorder: "border-cyan-200/60",
    heroBtnBg: "bg-cyan-600 text-white font-extrabold shadow-[0_4px_12px_rgba(6,182,212,0.2)] hover:shadow-[0_8px_20px_rgba(6,182,212,0.35)] transform hover:-translate-y-0.5 transition-all duration-200",
    heroBtnText: "text-white font-extrabold",
    heroBtnHover: "hover:bg-cyan-700",
    heroSecondaryBtn: "bg-emerald-600/10 border border-emerald-200/40 text-emerald-800 font-semibold hover:bg-emerald-600/20 transition-all",
    heroSecondaryBtnHover: "hover:bg-emerald-600/20"
  },
  sunset: {
    id: "sunset",
    nameEn: "Sunset Warmth",
    nameBn: "গোধূলি উষ্মা",
    icon: "🌅",
    isDark: false,
    
    // Backgrounds & Layout
    bgPage: "bg-[#faf6f0] bg-[radial-gradient(#f59e0b_0.7px,transparent_0.7px)] [background-size:24px_24px]",
    bgHeader: "bg-[#fcf8f2]/80 backdrop-blur-xl border-b border-[#ebd6bd]/60",
    bgFooter: "bg-[#fbf4ea] border-t border-[#eedec7]/60",
    borderHeader: "border-[#ebd6bd]/60",
    borderFooter: "border-[#eedec7]/60",
    
    // Typography Colors
    textMain: "text-[#5d4a3c] font-semibold",
    textMuted: "text-[#8d7764] font-normal",
    textHeading: "text-[#3e2b1d] font-extrabold tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-[#442c17] via-amber-800 to-[#442c17] font-black",
    textHeroSub: "text-[#7c5b3c] font-medium",
    
    // Card Configurations
    bgCard: "bg-white/95 backdrop-blur-md border border-[#f0e4d5] shadow-[0_8px_30px_rgba(61,42,28,0.015)] rounded-2xl",
    borderCard: "border-[#f0e4d5]",
    hoverBorderCard: "hover:border-[#e2bc93] hover:shadow-[0_15px_40px_rgba(217,119,6,0.1)]",
    hoverTranslate: "hover:-translate-y-1.5 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-amber-800 font-bold",
    primaryBg: "bg-amber-50/70 border border-amber-100",
    primaryBtn: "bg-gradient-to-r from-amber-550 to-orange-550 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-[0_4px_16px_rgba(217,119,6,0.22)] hover:shadow-[0_8px_24px_rgba(217,119,6,0.32)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200",
    primaryBtnHover: "hover:from-amber-600 hover:to-orange-600",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-orange-50 border border-orange-100/40",
    accentText: "text-orange-700 font-semibold",
    badgeBg: "bg-amber-50/90 border border-amber-100",
    badgeText: "text-amber-850 font-bold",
    
    // Hero & Interactive Banners
    heroGradient: "from-[#fefcf9] via-[#f7ebd9] to-[#fde9cc] border border-[#ebd6bd]/70 shadow-[inset_0_0_60px_rgba(217,119,6,0.015)]",
    heroOuterBorder: "border-[#ebd6bd]/60",
    heroBtnBg: "bg-amber-700 text-white font-extrabold shadow-[0_4px_12px_rgba(217,119,6,0.25)] hover:shadow-[0_8px_20px_rgba(217,119,6,0.35)] transform hover:-translate-y-0.5 transition-all duration-200",
    heroBtnText: "text-white font-extrabold",
    heroBtnHover: "hover:bg-amber-800",
    heroSecondaryBtn: "bg-orange-100/80 border border-orange-200/60 text-orange-850 font-semibold hover:bg-orange-200/60 transition-all",
    heroSecondaryBtnHover: "hover:bg-orange-200/60"
  }
};
