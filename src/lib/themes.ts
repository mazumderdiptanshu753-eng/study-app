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
    nameEn: "Emerald Mint",
    nameBn: "মরকত শ্যামলিমা",
    icon: "🌱",
    isDark: false,
    
    // Backgrounds & Layout
    bgPage: "bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-cyan-50/80",
    bgHeader: "bg-white/90 backdrop-blur-xl border-b border-emerald-200/80 shadow-xs",
    bgFooter: "bg-white/90 backdrop-blur-xl border-t border-emerald-200/80",
    borderHeader: "border-emerald-200/80",
    borderFooter: "border-emerald-200/80",
    
    // Typography Colors
    textMain: "text-slate-800 font-bold",
    textMuted: "text-emerald-900/70 font-semibold",
    textHeading: "text-slate-950 font-black tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 font-black",
    textHeroSub: "text-emerald-950 font-bold",
    
    // Card Configurations
    bgCard: "bg-white/95 backdrop-blur-md border border-emerald-200/70 shadow-[0_8px_30px_rgba(16,185,129,0.08)] rounded-3xl",
    borderCard: "border-emerald-200/70",
    hoverBorderCard: "hover:border-emerald-400 hover:shadow-[0_12px_36px_rgba(16,185,129,0.16)]",
    hoverTranslate: "hover:-translate-y-1 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-emerald-700 font-black",
    primaryBg: "bg-emerald-100/70 border border-emerald-300/60",
    primaryBtn: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-extrabold shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200",
    primaryBtnHover: "hover:from-emerald-600 hover:to-teal-600",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-teal-100/70 border border-teal-300/60",
    accentText: "text-teal-800 font-bold",
    badgeBg: "bg-emerald-100/80 border border-emerald-300/80",
    badgeText: "text-emerald-800 font-extrabold",
    
    // Hero & Interactive Banners
    heroGradient: "from-emerald-100/90 via-teal-100/60 to-cyan-100/80 border border-emerald-300/70 shadow-[0_12px_40px_rgba(16,185,129,0.12)]",
    heroOuterBorder: "border-emerald-300/70",
    heroBtnBg: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold shadow-[0_6px_22px_rgba(16,185,129,0.35)] hover:shadow-[0_10px_30px_rgba(16,185,129,0.5)] transform hover:-translate-y-0.5 transition-all duration-200",
    heroBtnText: "text-white font-extrabold",
    heroBtnHover: "hover:from-emerald-600 hover:to-teal-700",
    heroSecondaryBtn: "bg-white/90 backdrop-blur-md border border-emerald-200 text-emerald-900 font-bold shadow-xs hover:bg-emerald-50 transition-all",
    heroSecondaryBtnHover: "hover:bg-emerald-50"
  },
  cosmic: {
    id: "cosmic",
    nameEn: "Cosmic Prism",
    nameBn: "রঙিন মহাজাগতিক",
    icon: "🌌",
    isDark: false,
    
    // Backgrounds & Layout
    bgPage: "bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-pink-50/70",
    bgHeader: "bg-white/90 backdrop-blur-xl border-b border-indigo-200/80 shadow-xs",
    bgFooter: "bg-white/90 backdrop-blur-xl border-t border-indigo-200/80",
    borderHeader: "border-indigo-200/80",
    borderFooter: "border-indigo-200/80",
    
    // Typography Colors
    textMain: "text-slate-800 font-bold",
    textMuted: "text-indigo-900/70 font-semibold",
    textHeading: "text-slate-950 font-black tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 font-black",
    textHeroSub: "text-indigo-950 font-bold",
    
    // Card Configurations
    bgCard: "bg-white/95 backdrop-blur-md border border-indigo-200/70 shadow-[0_8px_30px_rgba(99,102,241,0.08)] rounded-3xl",
    borderCard: "border-indigo-200/70",
    hoverBorderCard: "hover:border-indigo-400 hover:shadow-[0_12px_36px_rgba(99,102,241,0.16)]",
    hoverTranslate: "hover:-translate-y-1 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-indigo-700 font-black",
    primaryBg: "bg-indigo-100/70 border border-indigo-300/60",
    primaryBtn: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-extrabold shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200",
    primaryBtnHover: "hover:from-indigo-700 hover:to-purple-700",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-purple-100/70 border border-purple-300/60",
    accentText: "text-purple-800 font-bold",
    badgeBg: "bg-indigo-100/80 border border-indigo-300/80",
    badgeText: "text-indigo-800 font-extrabold",
    
    // Hero & Interactive Banners
    heroGradient: "from-indigo-100/90 via-purple-100/60 to-pink-100/80 border border-indigo-300/70 shadow-[0_12px_40px_rgba(99,102,241,0.12)]",
    heroOuterBorder: "border-indigo-300/70",
    heroBtnBg: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold shadow-[0_6px_22px_rgba(99,102,241,0.35)] hover:shadow-[0_10px_30px_rgba(99,102,241,0.5)] transform hover:-translate-y-0.5 transition-all duration-200",
    heroBtnText: "text-white font-extrabold",
    heroBtnHover: "hover:from-indigo-700 hover:to-purple-700",
    heroSecondaryBtn: "bg-white/90 backdrop-blur-md border border-indigo-200 text-indigo-900 font-bold shadow-xs hover:bg-indigo-50 transition-all",
    heroSecondaryBtnHover: "hover:bg-indigo-50"
  },
  aurora: {
    id: "aurora",
    nameEn: "Nordic Sky",
    nameBn: "মেরু প্রভা",
    icon: "❄️",
    isDark: false,
    
    // Backgrounds & Layout
    bgPage: "bg-gradient-to-br from-cyan-50/90 via-sky-50/60 to-blue-50/70",
    bgHeader: "bg-white/90 backdrop-blur-xl border-b border-cyan-200/80 shadow-xs",
    bgFooter: "bg-white/90 backdrop-blur-xl border-t border-cyan-200/80",
    borderHeader: "border-cyan-200/80",
    borderFooter: "border-cyan-200/80",
    
    // Typography Colors
    textMain: "text-slate-800 font-bold",
    textMuted: "text-cyan-900/70 font-semibold",
    textHeading: "text-slate-950 font-black tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 font-black",
    textHeroSub: "text-cyan-950 font-bold",
    
    // Card Configurations
    bgCard: "bg-white/95 backdrop-blur-md border border-cyan-200/70 shadow-[0_8px_30px_rgba(6,182,212,0.08)] rounded-3xl",
    borderCard: "border-cyan-200/70",
    hoverBorderCard: "hover:border-cyan-400 hover:shadow-[0_12px_36px_rgba(6,182,212,0.16)]",
    hoverTranslate: "hover:-translate-y-1 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-cyan-700 font-black",
    primaryBg: "bg-cyan-100/70 border border-cyan-300/60",
    primaryBtn: "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 text-white font-extrabold shadow-[0_4px_20px_rgba(6,182,212,0.35)] hover:shadow-[0_8px_30px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200",
    primaryBtnHover: "hover:from-cyan-600 hover:to-sky-600",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-sky-100/70 border border-sky-300/60",
    accentText: "text-sky-800 font-bold",
    badgeBg: "bg-cyan-100/80 border border-cyan-300/80",
    badgeText: "text-cyan-800 font-extrabold",
    
    // Hero & Interactive Banners
    heroGradient: "from-cyan-100/90 via-sky-100/60 to-blue-100/80 border border-cyan-300/70 shadow-[0_12px_40px_rgba(6,182,212,0.12)]",
    heroOuterBorder: "border-cyan-300/70",
    heroBtnBg: "bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-extrabold shadow-[0_6px_22px_rgba(6,182,212,0.35)] hover:shadow-[0_10px_30px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5 transition-all duration-200",
    heroBtnText: "text-white font-extrabold",
    heroBtnHover: "hover:from-cyan-600 hover:to-sky-700",
    heroSecondaryBtn: "bg-white/90 backdrop-blur-md border border-cyan-200 text-cyan-900 font-bold shadow-xs hover:bg-cyan-50 transition-all",
    heroSecondaryBtnHover: "hover:bg-cyan-50"
  },
  sunset: {
    id: "sunset",
    nameEn: "Sunset Glow",
    nameBn: "গোধূলির রোদ",
    icon: "🌅",
    isDark: false,
    
    // Backgrounds & Layout
    bgPage: "bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-rose-50/70",
    bgHeader: "bg-white/90 backdrop-blur-xl border-b border-amber-200/80 shadow-xs",
    bgFooter: "bg-white/90 backdrop-blur-xl border-t border-amber-200/80",
    borderHeader: "border-amber-200/80",
    borderFooter: "border-amber-200/80",
    
    // Typography Colors
    textMain: "text-slate-800 font-bold",
    textMuted: "text-amber-900/70 font-semibold",
    textHeading: "text-slate-950 font-black tracking-tight",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 font-black",
    textHeroSub: "text-amber-950 font-bold",
    
    // Card Configurations
    bgCard: "bg-white/95 backdrop-blur-md border border-amber-200/70 shadow-[0_8px_30px_rgba(245,158,11,0.08)] rounded-3xl",
    borderCard: "border-amber-200/70",
    hoverBorderCard: "hover:border-amber-400 hover:shadow-[0_12px_36px_rgba(245,158,11,0.16)]",
    hoverTranslate: "hover:-translate-y-1 transition-all duration-300 ease-out",
    
    // Highlighting & Accents
    primaryText: "text-amber-700 font-black",
    primaryBg: "bg-amber-100/70 border border-amber-300/60",
    primaryBtn: "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-extrabold shadow-[0_4px_20px_rgba(245,158,11,0.35)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200",
    primaryBtnHover: "hover:from-amber-600 hover:to-orange-600",
    primaryBtnText: "text-white font-bold",
    accentBg: "bg-orange-100/70 border border-orange-300/60",
    accentText: "text-orange-800 font-bold",
    badgeBg: "bg-amber-100/80 border border-amber-300/80",
    badgeText: "text-amber-800 font-extrabold",
    
    // Hero & Interactive Banners
    heroGradient: "from-amber-100/90 via-orange-100/60 to-rose-100/80 border border-amber-300/70 shadow-[0_12px_40px_rgba(245,158,11,0.12)]",
    heroOuterBorder: "border-amber-300/70",
    heroBtnBg: "bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold shadow-[0_6px_22px_rgba(245,158,11,0.35)] hover:shadow-[0_10px_30px_rgba(245,158,11,0.5)] transform hover:-translate-y-0.5 transition-all duration-200",
    heroBtnText: "text-white font-extrabold",
    heroBtnHover: "hover:from-amber-600 hover:to-orange-700",
    heroSecondaryBtn: "bg-white/90 backdrop-blur-md border border-amber-200 text-amber-900 font-bold shadow-xs hover:bg-amber-50 transition-all",
    heroSecondaryBtnHover: "hover:bg-amber-50"
  }
};
