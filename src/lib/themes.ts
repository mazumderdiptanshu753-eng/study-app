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
    bgPage: "bg-slate-50/70 dark:bg-slate-950",
    bgHeader: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-emerald-500/15 dark:border-emerald-500/20",
    bgFooter: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-emerald-500/15 dark:border-emerald-500/20",
    borderHeader: "border-emerald-500/15",
    borderFooter: "border-emerald-500/15",
    
    // Typography Colors
    textMain: "text-slate-900 dark:text-slate-100 font-bold",
    textMuted: "text-slate-600 dark:text-slate-400 font-semibold",
    textHeading: "text-slate-950 dark:text-white font-black tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 font-black",
    textHeroSub: "text-emerald-950/90 dark:text-emerald-100 font-bold",
    
    // Card Configurations
    bgCard: "bg-white dark:bg-slate-900/90 border border-emerald-500/20 dark:border-emerald-500/30 shadow-[0_4px_24px_rgba(16,185,129,0.06)] rounded-3xl",
    borderCard: "border-emerald-500/20 dark:border-emerald-500/30",
    hoverBorderCard: "hover:border-emerald-500 hover:shadow-[0_12px_36px_rgba(16,185,129,0.14)]",
    hoverTranslate: "hover:-translate-y-1 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-emerald-700 dark:text-emerald-400 font-extrabold",
    primaryBg: "bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-400/30",
    primaryBtn: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-extrabold shadow-[0_4px_20px_rgba(16,185,129,0.28)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.45)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200",
    primaryBtnHover: "hover:from-emerald-600 hover:to-teal-600",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-teal-50/80 dark:bg-teal-950/40 border border-teal-400/30",
    accentText: "text-teal-700 dark:text-teal-300 font-bold",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400/35",
    badgeText: "text-emerald-700 dark:text-emerald-300 font-extrabold",
    
    // Hero & Interactive Banners
    heroGradient: "from-emerald-50/90 via-teal-50/60 to-cyan-50/80 dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/40 border border-emerald-500/25 shadow-[0_10px_40px_rgba(16,185,129,0.08)]",
    heroOuterBorder: "border-emerald-500/25",
    heroBtnBg: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold shadow-[0_4px_15px_rgba(16,185,129,0.35)] hover:shadow-[0_8px_28px_rgba(16,185,129,0.5)] transform hover:-translate-y-0.5 transition-all duration-200",
    heroBtnText: "text-white font-extrabold",
    heroBtnHover: "hover:from-emerald-600 hover:to-teal-700",
    heroSecondaryBtn: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold shadow-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-all",
    heroSecondaryBtnHover: "hover:bg-slate-50 dark:hover:bg-slate-800"
  },
  cosmic: {
    id: "cosmic",
    nameEn: "Midnight Cosmic",
    nameBn: "মহাজাগতিক রাত",
    icon: "🌌",
    isDark: false,
    
    // Backgrounds & Layout
    bgPage: "bg-slate-50/70 dark:bg-slate-950",
    bgHeader: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-indigo-500/15 dark:border-indigo-500/20",
    bgFooter: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-indigo-500/15 dark:border-indigo-500/20",
    borderHeader: "border-indigo-500/15",
    borderFooter: "border-indigo-500/15",
    
    // Typography Colors
    textMain: "text-slate-900 dark:text-slate-100 font-bold",
    textMuted: "text-slate-600 dark:text-slate-400 font-semibold",
    textHeading: "text-slate-950 dark:text-white font-black tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 font-black",
    textHeroSub: "text-indigo-950/90 dark:text-indigo-100 font-bold",
    
    // Card Configurations
    bgCard: "bg-white dark:bg-slate-900/90 border border-indigo-500/20 dark:border-indigo-500/30 shadow-[0_4px_24px_rgba(99,102,241,0.06)] rounded-3xl",
    borderCard: "border-indigo-500/20 dark:border-indigo-500/30",
    hoverBorderCard: "hover:border-indigo-500 hover:shadow-[0_12px_36px_rgba(99,102,241,0.14)]",
    hoverTranslate: "hover:-translate-y-1 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-indigo-700 dark:text-indigo-400 font-extrabold",
    primaryBg: "bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-400/30",
    primaryBtn: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold shadow-[0_4px_20px_rgba(99,102,241,0.28)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.45)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200",
    primaryBtnHover: "hover:from-indigo-600 hover:to-purple-600",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-purple-50/80 dark:bg-purple-950/40 border border-purple-400/30",
    accentText: "text-purple-700 dark:text-purple-300 font-bold",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-400/35",
    badgeText: "text-indigo-700 dark:text-indigo-300 font-extrabold",
    
    // Hero & Interactive Banners
    heroGradient: "from-indigo-50/90 via-purple-50/60 to-pink-50/80 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/40 border border-indigo-500/25 shadow-[0_10px_40px_rgba(99,102,241,0.08)]",
    heroOuterBorder: "border-indigo-500/25",
    heroBtnBg: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold shadow-[0_4px_15px_rgba(99,102,241,0.35)] hover:shadow-[0_8px_28px_rgba(99,102,241,0.5)] transform hover:-translate-y-0.5 transition-all duration-200",
    heroBtnText: "text-white font-extrabold",
    heroBtnHover: "hover:from-indigo-600 hover:to-purple-700",
    heroSecondaryBtn: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold shadow-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-all",
    heroSecondaryBtnHover: "hover:bg-slate-50 dark:hover:bg-slate-800"
  },
  aurora: {
    id: "aurora",
    nameEn: "Nordic Aurora",
    nameBn: "মেরু জ্যোতি",
    icon: "❄️",
    isDark: false,
    
    // Backgrounds & Layout
    bgPage: "bg-slate-50/70 dark:bg-slate-950",
    bgHeader: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-cyan-500/15 dark:border-cyan-500/20",
    bgFooter: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-cyan-500/15 dark:border-cyan-500/20",
    borderHeader: "border-cyan-500/15",
    borderFooter: "border-cyan-500/15",
    
    // Typography Colors
    textMain: "text-slate-900 dark:text-slate-100 font-bold",
    textMuted: "text-slate-600 dark:text-slate-400 font-semibold",
    textHeading: "text-slate-950 dark:text-white font-black tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-600 to-teal-600 font-black",
    textHeroSub: "text-cyan-950/90 dark:text-cyan-100 font-bold",
    
    // Card Configurations
    bgCard: "bg-white dark:bg-slate-900/90 border border-cyan-500/20 dark:border-cyan-500/30 shadow-[0_4px_24px_rgba(6,182,212,0.06)] rounded-3xl",
    borderCard: "border-cyan-500/20 dark:border-cyan-500/30",
    hoverBorderCard: "hover:border-cyan-500 hover:shadow-[0_12px_36px_rgba(6,182,212,0.14)]",
    hoverTranslate: "hover:-translate-y-1 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-cyan-700 dark:text-cyan-400 font-extrabold",
    primaryBg: "bg-cyan-50/80 dark:bg-cyan-950/40 border border-cyan-400/30",
    primaryBtn: "bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-500 text-white font-extrabold shadow-[0_4px_20px_rgba(6,182,212,0.28)] hover:shadow-[0_8px_30px_rgba(6,182,212,0.45)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200",
    primaryBtnHover: "hover:from-cyan-600 hover:to-sky-600",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-teal-50/80 dark:bg-teal-950/40 border border-teal-400/30",
    accentText: "text-teal-700 dark:text-teal-300 font-bold",
    badgeBg: "bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-400/35",
    badgeText: "text-cyan-700 dark:text-cyan-300 font-extrabold",
    
    // Hero & Interactive Banners
    heroGradient: "from-cyan-50/90 via-sky-50/60 to-teal-50/80 dark:from-cyan-950/40 dark:via-slate-900 dark:to-sky-950/40 border border-cyan-500/25 shadow-[0_10px_40px_rgba(6,182,212,0.08)]",
    heroOuterBorder: "border-cyan-500/25",
    heroBtnBg: "bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-extrabold shadow-[0_4px_15px_rgba(6,182,212,0.35)] hover:shadow-[0_8px_28px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5 transition-all duration-200",
    heroBtnText: "text-white font-extrabold",
    heroBtnHover: "hover:from-cyan-600 hover:to-sky-700",
    heroSecondaryBtn: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold shadow-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-all",
    heroSecondaryBtnHover: "hover:bg-slate-50 dark:hover:bg-slate-800"
  },
  sunset: {
    id: "sunset",
    nameEn: "Sunset Warmth",
    nameBn: "গোধূলি উষ্মা",
    icon: "🌅",
    isDark: false,
    
    // Backgrounds & Layout
    bgPage: "bg-slate-50/70 dark:bg-slate-950",
    bgHeader: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-amber-500/15 dark:border-amber-500/20",
    bgFooter: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-amber-500/15 dark:border-amber-500/20",
    borderHeader: "border-amber-500/15",
    borderFooter: "border-amber-500/15",
    
    // Typography Colors
    textMain: "text-slate-900 dark:text-slate-100 font-bold",
    textMuted: "text-slate-600 dark:text-slate-400 font-semibold",
    textHeading: "text-slate-950 dark:text-white font-black tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-pink-600 font-black",
    textHeroSub: "text-amber-950/90 dark:text-amber-100 font-bold",
    
    // Card Configurations
    bgCard: "bg-white dark:bg-slate-900/90 border border-amber-500/20 dark:border-amber-500/30 shadow-[0_4px_24px_rgba(245,158,11,0.06)] rounded-3xl",
    borderCard: "border-amber-500/20 dark:border-amber-500/30",
    hoverBorderCard: "hover:border-amber-500 hover:shadow-[0_12px_36px_rgba(245,158,11,0.14)]",
    hoverTranslate: "hover:-translate-y-1 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-amber-700 dark:text-amber-400 font-extrabold",
    primaryBg: "bg-amber-50/80 dark:bg-amber-950/40 border border-amber-400/30",
    primaryBtn: "bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white font-extrabold shadow-[0_4px_20px_rgba(245,158,11,0.28)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.45)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200",
    primaryBtnHover: "hover:from-amber-600 hover:to-orange-600",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-orange-50/80 dark:bg-orange-950/40 border border-orange-400/30",
    accentText: "text-orange-700 dark:text-orange-300 font-bold",
    badgeBg: "bg-amber-50 dark:bg-amber-950/60 border border-amber-400/35",
    badgeText: "text-amber-700 dark:text-amber-300 font-extrabold",
    
    // Hero & Interactive Banners
    heroGradient: "from-amber-50/90 via-orange-50/60 to-pink-50/80 dark:from-amber-950/40 dark:via-slate-900 dark:to-orange-950/40 border border-amber-500/25 shadow-[0_10px_40px_rgba(245,158,11,0.08)]",
    heroOuterBorder: "border-amber-500/25",
    heroBtnBg: "bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold shadow-[0_4px_15px_rgba(245,158,11,0.35)] hover:shadow-[0_8px_28px_rgba(245,158,11,0.5)] transform hover:-translate-y-0.5 transition-all duration-200",
    heroBtnText: "text-white font-extrabold",
    heroBtnHover: "hover:from-amber-600 hover:to-orange-700",
    heroSecondaryBtn: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold shadow-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-all",
    heroSecondaryBtnHover: "hover:bg-slate-50 dark:hover:bg-slate-800"
  }
};
