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
    <div className={`mt-6 overflow-hidden rounded-xl border ${theme.borderCard} ${theme.bgCard} shadow-sm flex items-stretch min-h-[48px]`}>
      <div className={`bg-gradient-to-r from-red-500 to-rose-600 text-white px-3 sm:px-4 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 shadow-[4px_0_12px_rgba(0,0,0,0.1)] z-10 w-12 sm:w-auto`}>
        <Newspaper className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
        <span className="hidden sm:inline whitespace-nowrap">{lang === "bn" ? "কারেন্ট অ্যাফেয়ার্স" : "Current Affairs"}</span>
      </div>
      
      <div className="flex-1 relative flex items-center px-3 sm:px-4 py-2 sm:py-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 w-full"
          >
            <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${theme.badgeBg} ${theme.badgeText} shrink-0 w-max self-start sm:self-auto`}>
              {news[currentIndex].category}
            </span>
            <p className={`text-xs sm:text-sm font-medium ${theme.textMain} flex-1 leading-snug whitespace-normal `}>
              {news[currentIndex].headline}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
