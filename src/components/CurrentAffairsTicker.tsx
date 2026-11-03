import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Newspaper, ChevronRight } from "lucide-react";
import { Language } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";

interface NewsItem {
  headline: string;
  description: string;
  category: string;
  date: string;
}

interface CurrentAffairsTickerProps {
  theme: ThemeConfig;
  lang: Language;
}

export default function CurrentAffairsTicker({ theme, lang }: CurrentAffairsTickerProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch("/api/current-affairs");
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            setNews(data.news || []);
          } else {
            console.warn("Expected JSON for current affairs ticker, but received:", contentType);
          }
        }
      } catch (error) {
        console.warn("Network error or issue fetching current affairs ticker:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  useEffect(() => {
    if (news.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [news.length]);

  if (loading || news.length === 0) return null;

  return (
    <div className={`group overflow-hidden rounded-2xl border ${theme.borderCard} ${theme.bgCard} shadow-xs flex items-center min-h-[50px] transition-all hover:shadow-md`}>
      {/* Live Badge */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white font-bold text-xs shrink-0 border-r border-rose-300/40 shadow-xs">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
        <Newspaper className="w-3.5 h-3.5 text-rose-400" />
        <span className="text-[11px] font-black tracking-wider uppercase hidden sm:inline">
          {lang === "bn" ? "কারেন্ট অ্যাফেয়ার্স" : "Current Affairs"}
        </span>
      </div>
      
      {/* Dynamic News Headline */}
      <div className="flex-1 relative flex items-center px-4 overflow-hidden py-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex items-center gap-2.5 text-xs sm:text-sm w-full truncate"
          >
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shrink-0">
              {news[currentIndex].category}
            </span>
            <p className={`font-semibold ${theme.textMain} truncate text-xs sm:text-sm leading-normal`}>
              {news[currentIndex].headline}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress & Pagination counter */}
      <div className="flex items-center gap-1.5 pr-3.5 pl-2 shrink-0 border-l border-slate-100 dark:border-slate-800 text-[11px] font-mono font-bold text-slate-400">
        <span>{currentIndex + 1}</span>
        <span className="opacity-40">/</span>
        <span>{news.length}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
}
