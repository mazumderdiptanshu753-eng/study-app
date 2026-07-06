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
    bgPage: "bg-slate-50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]",
    bgHeader: "bg-white/80 backdrop-blur-md border-b border-slate-100",
    bgFooter: "bg-white border-t border-slate-100",
    borderHeader: "border-slate-100",
    borderFooter: "border-slate-100",
    
    // Typography Colors
    textMain: "text-slate-700 font-medium",
    textMuted: "text-slate-400 font-normal",
    textHeading: "text-slate-900 font-extrabold tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-teal-50 font-black",
    textHeroSub: "text-emerald-50/90 font-medium",
    
    // Card Configurations
    bgCard: "bg-white/90 backdrop-blur-sm border border-slate-100/80 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.02)]",
    borderCard: "border-slate-100/80",
    hoverBorderCard: "hover:border-emerald-300 hover:shadow-[0_10px_30px_-5px_rgba(16,185,129,0.08)]",
    hoverTranslate: "hover:-translate-y-1 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-emerald-600 font-semibold",
    primaryBg: "bg-emerald-50/60 border border-emerald-100/30",
    primaryBtn: "bg-gradient-to-r from-emerald-600 to-teal-600 shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:shadow-[0_8px_20px_rgba(16,185,129,0.3)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-200",
    primaryBtnHover: "hover:from-emerald-500 hover:to-teal-500",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-teal-50/60 border border-teal-100/30",
    accentText: "text-teal-700 font-semibold",
    badgeBg: "bg-emerald-50/80 border border-emerald-100/40",
    badgeText: "text-emerald-700 font-bold",
    
    // Hero & Interactive Banners
    heroGradient: "from-emerald-700 via-emerald-600 to-teal-700 shadow-[inset_0_0_80px_rgba(0,0,0,0.05)]",
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
    bgPage: "bg-[#030712] bg-radial-gradient [background-size:100%_100%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-gray-950 to-black",
    bgHeader: "bg-[#090d16]/80 backdrop-blur-lg border-b border-slate-800/60",
    bgFooter: "bg-[#060a12] border-t border-slate-900",
    borderHeader: "border-slate-800/60",
    borderFooter: "border-slate-900",
    
    // Typography Colors
    textMain: "text-slate-300 font-medium",
    textMuted: "text-slate-400 font-normal",
    textHeading: "text-white font-extrabold tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-indigo-200 to-cyan-100 font-black",
    textHeroSub: "text-indigo-200/80 font-medium",
    
    // Card Configurations
    bgCard: "bg-slate-950/60 backdrop-blur-md border border-slate-800/60 shadow-[0_8px_32px_rgba(0,0,0,0.25)]",
    borderCard: "border-slate-800/60",
    hoverBorderCard: "hover:border-indigo-500/40 hover:shadow-[0_12px_40px_rgba(99,102,241,0.18)] hover:bg-slate-950/85",
    hoverTranslate: "hover:-translate-y-1 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-indigo-400 font-semibold",
    primaryBg: "bg-indigo-500/10 border border-indigo-500/20",
    primaryBtn: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_8px_25px_rgba(99,102,241,0.5)] hover:from-indigo-500 hover:to-violet-500 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-200",
    primaryBtnHover: "hover:from-indigo-500 hover:to-violet-500",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-purple-500/10 border border-purple-500/20",
    accentText: "text-purple-400 font-semibold",
    badgeBg: "bg-indigo-950/40 border border-indigo-500/10",
    badgeText: "text-indigo-300 font-bold",
    
    // Hero & Interactive Banners
    heroGradient: "from-[#080d1a] via-[#111827] to-[#1e1b4b] border border-indigo-500/10 shadow-[inset_0_0_100px_rgba(99,102,241,0.05)]",
    heroOuterBorder: "border-indigo-500/20",
    heroBtnBg: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold shadow-[0_4px_15px_rgba(99,102,241,0.35)] hover:shadow-[0_8px_25px_rgba(99,102,241,0.5)] transform hover:-translate-y-0.5 transition-all duration-200",
    heroBtnText: "text-white font-extrabold",
    heroBtnHover: "hover:from-indigo-400 hover:to-purple-500",
    heroSecondaryBtn: "bg-slate-900/60 border border-slate-700/50 text-slate-200 font-semibold backdrop-blur-md hover:bg-slate-900/90 transition-all",
    heroSecondaryBtnHover: "hover:bg-slate-900/90"
  },
  aurora: {
    id: "aurora",
    nameEn: "Nordic Aurora",
    nameBn: "মেরু জ্যোতি",
    icon: "❄️",
    isDark: false,
    
    // Backgrounds & Layout
    bgPage: "bg-[#f1f5f9] bg-[linear-gradient(rgba(14,116,144,0.03)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(14,116,144,0.03)_1.5px,transparent_1.5px)] [background-size:32px_32px]",
    bgHeader: "bg-[#e2e8f0]/85 backdrop-blur-md border-b border-slate-300/40",
    bgFooter: "bg-[#e2e8f0] border-t border-slate-300/40",
    borderHeader: "border-slate-300/40",
    borderFooter: "border-slate-300/40",
    
    // Typography Colors
    textMain: "text-slate-850 font-medium",
    textMuted: "text-slate-450 font-normal",
    textHeading: "text-slate-900 font-extrabold tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 font-black",
    textHeroSub: "text-cyan-900/80 font-medium",
    
    // Card Configurations
    bgCard: "bg-white/95 backdrop-blur-xs border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(14,116,144,0.02)]",
    borderCard: "border-slate-200/80",
    hoverBorderCard: "hover:border-cyan-400 hover:shadow-[0_10px_30px_-5px_rgba(6,182,212,0.08)]",
    hoverTranslate: "hover:-translate-y-1 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-cyan-600 font-semibold",
    primaryBg: "bg-cyan-50/60 border border-cyan-100/30",
    primaryBtn: "bg-gradient-to-r from-cyan-600 to-sky-600 shadow-[0_4px_12px_rgba(6,182,212,0.2)] hover:shadow-[0_8px_20px_rgba(6,182,212,0.3)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-200",
    primaryBtnHover: "hover:from-cyan-500 hover:to-sky-500",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-emerald-50/60 border border-emerald-100/30",
    accentText: "text-emerald-700 font-semibold",
    badgeBg: "bg-cyan-50/80 border border-cyan-100/40",
    badgeText: "text-cyan-800 font-bold",
    
    // Hero & Interactive Banners
    heroGradient: "from-cyan-100/80 via-sky-50 to-emerald-100/60 border border-cyan-200/40 shadow-[inset_0_0_60px_rgba(6,182,212,0.02)]",
    heroOuterBorder: "border-cyan-200/60",
    heroBtnBg: "bg-cyan-600 text-white font-extrabold shadow-[0_4px_12px_rgba(6,182,212,0.25)] hover:shadow-[0_8px_20px_rgba(6,182,212,0.4)] transform hover:-translate-y-0.5 transition-all duration-200",
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
    bgPage: "bg-[#faf8f5] bg-[radial-gradient(#ecd9c1_1px,transparent_1px)] [background-size:24px_24px]",
    bgHeader: "bg-[#f4ebe1]/85 backdrop-blur-md border-b border-[#e9dac7]/60",
    bgFooter: "bg-[#f4ebe1] border-t border-[#e9dac7]/60",
    borderHeader: "border-[#e9dac7]/60",
    borderFooter: "border-[#e9dac7]/60",
    
    // Typography Colors
    textMain: "text-[#5c4a3c] font-medium",
    textMuted: "text-[#8c7662] font-normal",
    textHeading: "text-[#3d2a1c] font-extrabold tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-[#3d2a1c] via-amber-900 to-[#3d2a1c] font-black",
    textHeroSub: "text-[#7c5b3c] font-medium",
    
    // Card Configurations
    bgCard: "bg-white/95 backdrop-blur-xs border border-[#f0e4d4] shadow-[0_4px_20px_-2px_rgba(61,42,28,0.015)]",
    borderCard: "border-[#f0e4d4]",
    hoverBorderCard: "hover:border-amber-400 hover:shadow-[0_10px_30px_-5px_rgba(217,119,6,0.06)]",
    hoverTranslate: "hover:-translate-y-1 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-amber-700 font-semibold",
    primaryBg: "bg-amber-50 border border-amber-100/40",
    primaryBtn: "bg-gradient-to-r from-amber-600 to-orange-600 shadow-[0_4px_12px_rgba(217,119,6,0.2)] hover:shadow-[0_8px_20px_rgba(217,119,6,0.3)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-200",
    primaryBtnHover: "hover:from-amber-500 hover:to-orange-500",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-orange-50 border border-orange-100/40",
    accentText: "text-orange-700 font-semibold",
    badgeBg: "bg-amber-50 border border-amber-100/40",
    badgeText: "text-amber-850 font-bold",
    
    // Hero & Interactive Banners
    heroGradient: "from-[#fefcf8] via-[#f7e8d5] to-[#fce4c8] border border-[#ecd9c1]/60 shadow-[inset_0_0_60px_rgba(217,119,6,0.015)]",
    heroOuterBorder: "border-[#ecd9c1]/60",
    heroBtnBg: "bg-amber-700 text-white font-extrabold shadow-[0_4px_12px_rgba(217,119,6,0.2)] hover:shadow-[0_8px_20px_rgba(217,119,6,0.35)] transform hover:-translate-y-0.5 transition-all duration-200",
    heroBtnText: "text-white font-extrabold",
    heroBtnHover: "hover:bg-amber-800",
    heroSecondaryBtn: "bg-orange-100/80 border border-orange-200/60 text-orange-850 font-semibold hover:bg-orange-200/60 transition-all",
    heroSecondaryBtnHover: "hover:bg-orange-200/60"
  }
};
