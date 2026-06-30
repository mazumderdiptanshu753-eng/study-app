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
    bgPage: "bg-slate-50/70",
    bgHeader: "bg-white/95 backdrop-blur-md",
    bgFooter: "bg-white",
    borderHeader: "border-slate-100",
    borderFooter: "border-slate-100",
    
    // Typography Colors
    textMain: "text-slate-900",
    textMuted: "text-slate-500",
    textHeading: "text-slate-950",
    textHeroTitle: "text-white",
    textHeroSub: "text-emerald-100/90",
    
    // Card Configurations
    bgCard: "bg-white",
    borderCard: "border-slate-100",
    hoverBorderCard: "hover:border-emerald-200 hover:shadow-sm",
    hoverTranslate: "hover:-translate-y-0.5",
    
    // Highlighting & Accents
    primaryText: "text-emerald-600",
    primaryBg: "bg-emerald-50",
    primaryBtn: "bg-emerald-600",
    primaryBtnHover: "hover:bg-emerald-700",
    primaryBtnText: "text-white",
    accentBg: "bg-teal-50",
    accentText: "text-teal-700",
    badgeBg: "bg-teal-50/60",
    badgeText: "text-teal-700",
    
    // Hero & Interactive Banners
    heroGradient: "from-emerald-600 via-teal-600 to-cyan-700",
    heroOuterBorder: "border-emerald-500/20",
    heroBtnBg: "bg-white",
    heroBtnText: "text-teal-950",
    heroBtnHover: "hover:bg-emerald-50",
    heroSecondaryBtn: "bg-teal-800/40 border border-teal-400/30",
    heroSecondaryBtnHover: "hover:bg-teal-800/60"
  },
  cosmic: {
    id: "cosmic",
    nameEn: "Midnight Cosmic",
    nameBn: "মহাজাগতিক রাত",
    icon: "🌌",
    isDark: true,
    
    // Backgrounds & Layout
    bgPage: "bg-[#0b0f19]",
    bgHeader: "bg-[#0f172a]/90 backdrop-blur-md",
    bgFooter: "bg-[#0f172a]",
    borderHeader: "border-slate-800",
    borderFooter: "border-slate-800",
    
    // Typography Colors
    textMain: "text-slate-300",
    textMuted: "text-slate-400",
    textHeading: "text-slate-100",
    textHeroTitle: "text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-pink-200 to-cyan-200",
    textHeroSub: "text-indigo-200/80",
    
    // Card Configurations
    bgCard: "bg-[#111827]/80 backdrop-blur-xs",
    borderCard: "border-slate-800",
    hoverBorderCard: "hover:border-indigo-500/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]",
    hoverTranslate: "hover:-translate-y-1",
    
    // Highlighting & Accents
    primaryText: "text-indigo-400",
    primaryBg: "bg-indigo-500/10",
    primaryBtn: "bg-indigo-600",
    primaryBtnHover: "hover:bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]",
    primaryBtnText: "text-white",
    accentBg: "bg-purple-500/10",
    accentText: "text-purple-400",
    badgeBg: "bg-indigo-950/40",
    badgeText: "text-indigo-300",
    
    // Hero & Interactive Banners
    heroGradient: "from-[#111827] via-slate-900 to-[#1e1b4b]",
    heroOuterBorder: "border-indigo-500/30",
    heroBtnBg: "bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.4)]",
    heroBtnText: "text-white",
    heroBtnHover: "hover:bg-indigo-500",
    heroSecondaryBtn: "bg-slate-800/80 border border-slate-700",
    heroSecondaryBtnHover: "hover:bg-slate-700"
  },
  aurora: {
    id: "aurora",
    nameEn: "Nordic Aurora",
    nameBn: "মেরু জ্যোতি",
    icon: "❄️",
    isDark: false,
    
    // Backgrounds & Layout
    bgPage: "bg-[#f1f5f9]",
    bgHeader: "bg-[#e2e8f0]/95 backdrop-blur-md",
    bgFooter: "bg-[#e2e8f0]",
    borderHeader: "border-slate-300/60",
    borderFooter: "border-slate-300/60",
    
    // Typography Colors
    textMain: "text-slate-800",
    textMuted: "text-slate-500",
    textHeading: "text-slate-900",
    textHeroTitle: "text-slate-900",
    textHeroSub: "text-cyan-800/90",
    
    // Card Configurations
    bgCard: "bg-white",
    borderCard: "border-slate-200/80",
    hoverBorderCard: "hover:border-cyan-400 hover:shadow-sm",
    hoverTranslate: "hover:-translate-y-0.5",
    
    // Highlighting & Accents
    primaryText: "text-cyan-600",
    primaryBg: "bg-cyan-50",
    primaryBtn: "bg-cyan-600",
    primaryBtnHover: "hover:bg-cyan-700",
    primaryBtnText: "text-white",
    accentBg: "bg-emerald-50",
    accentText: "text-emerald-700",
    badgeBg: "bg-cyan-50/70",
    badgeText: "text-cyan-800",
    
    // Hero & Interactive Banners
    heroGradient: "from-cyan-100 via-sky-50 to-emerald-100",
    heroOuterBorder: "border-cyan-200",
    heroBtnBg: "bg-cyan-600",
    heroBtnText: "text-white",
    heroBtnHover: "hover:bg-cyan-700",
    heroSecondaryBtn: "bg-emerald-600/10 border border-emerald-200 text-emerald-800",
    heroSecondaryBtnHover: "hover:bg-emerald-600/20"
  },
  sunset: {
    id: "sunset",
    nameEn: "Sunset Warmth",
    nameBn: "গোধূলি উষ্মা",
    icon: "🌅",
    isDark: false,
    
    // Backgrounds & Layout
    bgPage: "bg-[#faf8f5]",
    bgHeader: "bg-[#f4ebe1]/95 backdrop-blur-md",
    bgFooter: "bg-[#f4ebe1]",
    borderHeader: "border-[#e9dac7]",
    borderFooter: "border-[#e9dac7]",
    
    // Typography Colors
    textMain: "text-[#5c4a3c]",
    textMuted: "text-[#8c7662]",
    textHeading: "text-[#3d2a1c]",
    textHeroTitle: "text-[#3d2a1c]",
    textHeroSub: "text-[#7c5b3c]",
    
    // Card Configurations
    bgCard: "bg-white",
    borderCard: "border-[#f0e4d4]",
    hoverBorderCard: "hover:border-amber-300 hover:shadow-sm",
    hoverTranslate: "hover:-translate-y-0.5",
    
    // Highlighting & Accents
    primaryText: "text-amber-700",
    primaryBg: "bg-amber-50",
    primaryBtn: "bg-amber-600",
    primaryBtnHover: "hover:bg-amber-700",
    primaryBtnText: "text-white",
    accentBg: "bg-orange-50",
    accentText: "text-orange-700",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-800",
    
    // Hero & Interactive Banners
    heroGradient: "from-[#fdf8f2] via-[#f7e8d5] to-[#fce4c8]",
    heroOuterBorder: "border-[#ecd9c1]",
    heroBtnBg: "bg-amber-700",
    heroBtnText: "text-white",
    heroBtnHover: "hover:bg-amber-800",
    heroSecondaryBtn: "bg-orange-100 border border-orange-200 text-orange-800",
    heroSecondaryBtnHover: "hover:bg-orange-200/60"
  }
};
