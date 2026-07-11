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
    bgPage: "bg-white",
    bgHeader: "bg-white/95 backdrop-blur-xl border-b border-emerald-150",
    bgFooter: "bg-white border-t border-emerald-150",
    borderHeader: "border-emerald-150",
    borderFooter: "border-emerald-150",
    
    // Typography Colors
    textMain: "text-slate-900 font-bold",
    textMuted: "text-slate-600 font-semibold",
    textHeading: "text-slate-950 font-black tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 font-black",
    textHeroSub: "text-emerald-950/90 font-bold",
    
    // Card Configurations
    bgCard: "bg-white border-2 border-emerald-500/20 shadow-[0_8px_30px_rgba(16,185,129,0.06)] rounded-2xl",
    borderCard: "border-emerald-500/20",
    hoverBorderCard: "hover:border-emerald-500 hover:shadow-[0_12px_40px_rgba(16,185,129,0.12)] hover:bg-white",
    hoverTranslate: "hover:-translate-y-1 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-emerald-700 font-extrabold",
    primaryBg: "bg-emerald-50/70 border-2 border-emerald-400/20",
    primaryBtn: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-extrabold shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_8px_28px_rgba(16,185,129,0.4)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200",
    primaryBtnHover: "hover:from-emerald-600 hover:to-teal-600",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-teal-50/70 border-2 border-teal-400/20",
    accentText: "text-teal-700 font-bold",
    badgeBg: "bg-emerald-50 border border-emerald-400/35",
    badgeText: "text-emerald-700 font-extrabold",
    
    // Hero & Interactive Banners
    heroGradient: "from-emerald-50 via-teal-50/50 to-cyan-50 border-2 border-emerald-500/20 shadow-[inset_0_0_100px_rgba(16,185,129,0.05)]",
    heroOuterBorder: "border-emerald-500/20",
    heroBtnBg: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.45)] transform hover:-translate-y-0.5 transition-all duration-200",
    heroBtnText: "text-white font-extrabold",
    heroBtnHover: "hover:from-emerald-600 hover:to-teal-700",
    heroSecondaryBtn: "bg-white border border-slate-300 text-slate-800 font-bold shadow-xs hover:bg-slate-50 transition-all",
    heroSecondaryBtnHover: "hover:bg-slate-50"
  },
  cosmic: {
    id: "cosmic",
    nameEn: "Midnight Cosmic",
    nameBn: "মহাজাগতিক রাত",
    icon: "🌌",
    isDark: false,
    
    // Backgrounds & Layout
    bgPage: "bg-white",
    bgHeader: "bg-white/95 backdrop-blur-xl border-b border-indigo-150",
    bgFooter: "bg-white border-t border-indigo-150",
    borderHeader: "border-indigo-150",
    borderFooter: "border-indigo-150",
    
    // Typography Colors
    textMain: "text-slate-900 font-bold",
    textMuted: "text-slate-600 font-semibold",
    textHeading: "text-slate-950 font-black tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 font-black",
    textHeroSub: "text-indigo-950/90 font-bold",
    
    // Card Configurations
    bgCard: "bg-white border-2 border-indigo-500/20 shadow-[0_8px_30px_rgba(99,102,241,0.06)] rounded-2xl",
    borderCard: "border-indigo-500/20",
    hoverBorderCard: "hover:border-indigo-500 hover:shadow-[0_12px_40px_rgba(99,102,241,0.12)] hover:bg-white",
    hoverTranslate: "hover:-translate-y-1 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-indigo-700 font-extrabold",
    primaryBg: "bg-indigo-50/70 border-2 border-indigo-400/20",
    primaryBtn: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_8px_28px_rgba(99,102,241,0.4)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200",
    primaryBtnHover: "hover:from-indigo-600 hover:to-purple-600",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-purple-50/70 border-2 border-purple-400/20",
    accentText: "text-purple-700 font-bold",
    badgeBg: "bg-indigo-50 border border-indigo-400/35",
    badgeText: "text-indigo-700 font-extrabold",
    
    // Hero & Interactive Banners
    heroGradient: "from-indigo-50 via-purple-50/50 to-pink-50 border-2 border-indigo-500/20 shadow-[inset_0_0_100px_rgba(99,102,241,0.05)]",
    heroOuterBorder: "border-indigo-500/20",
    heroBtnBg: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:shadow-[0_8px_25px_rgba(99,102,241,0.45)] transform hover:-translate-y-0.5 transition-all duration-200",
    heroBtnText: "text-white font-extrabold",
    heroBtnHover: "hover:from-indigo-600 hover:to-purple-700",
    heroSecondaryBtn: "bg-white border border-slate-300 text-slate-800 font-bold shadow-xs hover:bg-slate-50 transition-all",
    heroSecondaryBtnHover: "hover:bg-slate-50"
  },
  aurora: {
    id: "aurora",
    nameEn: "Nordic Aurora",
    nameBn: "মেরু জ্যোতি",
    icon: "❄️",
    isDark: false,
    
    // Backgrounds & Layout
    bgPage: "bg-white",
    bgHeader: "bg-white/95 backdrop-blur-xl border-b border-cyan-150",
    bgFooter: "bg-white border-t border-cyan-150",
    borderHeader: "border-cyan-150",
    borderFooter: "border-cyan-150",
    
    // Typography Colors
    textMain: "text-slate-900 font-bold",
    textMuted: "text-slate-600 font-semibold",
    textHeading: "text-slate-950 font-black tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-600 to-teal-600 font-black",
    textHeroSub: "text-cyan-950/90 font-bold",
    
    // Card Configurations
    bgCard: "bg-white border-2 border-cyan-500/20 shadow-[0_8px_30px_rgba(6,182,212,0.06)] rounded-2xl",
    borderCard: "border-cyan-500/20",
    hoverBorderCard: "hover:border-cyan-500 hover:shadow-[0_12px_40px_rgba(6,182,212,0.12)] hover:bg-white",
    hoverTranslate: "hover:-translate-y-1 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-cyan-700 font-extrabold",
    primaryBg: "bg-cyan-50/70 border-2 border-cyan-400/20",
    primaryBtn: "bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-500 text-white font-extrabold shadow-[0_4px_20px_rgba(6,182,212,0.25)] hover:shadow-[0_8px_28px_rgba(6,182,212,0.4)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200",
    primaryBtnHover: "hover:from-cyan-600 hover:to-sky-600",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-teal-50/70 border-2 border-teal-400/20",
    accentText: "text-teal-700 font-bold",
    badgeBg: "bg-cyan-50 border border-cyan-400/35",
    badgeText: "text-cyan-700 font-extrabold",
    
    // Hero & Interactive Banners
    heroGradient: "from-cyan-50 via-sky-50/50 to-teal-50 border-2 border-cyan-500/20 shadow-[inset_0_0_100px_rgba(6,182,212,0.05)]",
    heroOuterBorder: "border-cyan-500/20",
    heroBtnBg: "bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-extrabold shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:shadow-[0_8px_25px_rgba(6,182,212,0.45)] transform hover:-translate-y-0.5 transition-all duration-200",
    heroBtnText: "text-white font-extrabold",
    heroBtnHover: "hover:from-cyan-600 hover:to-sky-700",
    heroSecondaryBtn: "bg-white border border-slate-300 text-slate-800 font-bold shadow-xs hover:bg-slate-50 transition-all",
    heroSecondaryBtnHover: "hover:bg-slate-50"
  },
  sunset: {
    id: "sunset",
    nameEn: "Sunset Warmth",
    nameBn: "গোধূলি উষ্মা",
    icon: "🌅",
    isDark: false,
    
    // Backgrounds & Layout
    bgPage: "bg-white",
    bgHeader: "bg-white/95 backdrop-blur-xl border-b border-amber-150",
    bgFooter: "bg-white border-t border-amber-150",
    borderHeader: "border-amber-150",
    borderFooter: "border-amber-150",
    
    // Typography Colors
    textMain: "text-slate-900 font-bold",
    textMuted: "text-slate-600 font-semibold",
    textHeading: "text-slate-950 font-black tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-pink-600 font-black",
    textHeroSub: "text-amber-950/90 font-bold",
    
    // Card Configurations
    bgCard: "bg-white border-2 border-amber-500/20 shadow-[0_8px_30px_rgba(245,158,11,0.06)] rounded-2xl",
    borderCard: "border-amber-500/20",
    hoverBorderCard: "hover:border-amber-500 hover:shadow-[0_12px_40px_rgba(245,158,11,0.12)] hover:bg-white",
    hoverTranslate: "hover:-translate-y-1 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-amber-700 font-extrabold",
    primaryBg: "bg-amber-50/70 border-2 border-amber-400/20",
    primaryBtn: "bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white font-extrabold shadow-[0_4px_20px_rgba(245,158,11,0.25)] hover:shadow-[0_8px_28px_rgba(245,158,11,0.4)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200",
    primaryBtnHover: "hover:from-amber-600 hover:to-orange-600",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-orange-50/70 border-2 border-orange-400/20",
    accentText: "text-orange-700 font-bold",
    badgeBg: "bg-amber-50 border border-amber-400/35",
    badgeText: "text-amber-700 font-extrabold",
    
    // Hero & Interactive Banners
    heroGradient: "from-amber-50 via-orange-50/50 to-pink-50 border-2 border-amber-500/20 shadow-[inset_0_0_100px_rgba(245,158,11,0.05)]",
    heroOuterBorder: "border-amber-500/20",
    heroBtnBg: "bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold shadow-[0_4px_15px_rgba(245,158,11,0.3)] hover:shadow-[0_8px_25px_rgba(245,158,11,0.45)] transform hover:-translate-y-0.5 transition-all duration-200",
    heroBtnText: "text-white font-extrabold",
    heroBtnHover: "hover:from-amber-600 hover:to-orange-700",
    heroSecondaryBtn: "bg-white border border-slate-300 text-slate-800 font-bold shadow-xs hover:bg-slate-50 transition-all",
    heroSecondaryBtnHover: "hover:bg-slate-50"
  }
};
