import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeConfig } from "../lib/themes";
import { Language } from "../lib/translations";
import { Calendar, RefreshCcw, AlertCircle, ChevronRight, Newspaper } from "lucide-react";

interface CurrentAffairsProps {
  theme: ThemeConfig;
  lang: Language;
}

interface NewsItem {
  headline: string;
  description: string;
  category: string;
  date: string;
}

export default function CurrentAffairs({ theme, lang }: CurrentAffairsProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/current-affairs");
      if (!response.ok) {
        throw new Error("Failed to fetch current affairs");
      }
      const data = await response.json();
      setNews(data.news || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    try {
      return new Date(dateStr).toLocaleDateString(lang === "bn" ? "bn-IN" : "en-IN", options);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`rounded-2xl border ${theme.borderCard} ${theme.bgCard} p-6 shadow-sm`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`font-extrabold ${theme.textHeading} text-lg mb-1 flex items-center gap-2`}>
            <Newspaper className={`h-5 w-5 ${theme.primaryText}`} />
            {lang === "bn" ? "দৈনিক কারেন্ট অ্যাফেয়ার্স" : "Daily Current Affairs"}
          </h3>
          <p className={`text-sm ${theme.textMuted}`}>
            {lang === "bn" ? "আজকের গুরুত্বপূর্ণ খবর ও আপডেট" : "Today's important news and updates"}
          </p>
        </div>
        <button
          onClick={fetchNews}
          disabled={loading}
          className={`p-2 rounded-lg border ${theme.borderCard} ${theme.bgCard} hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
          title={lang === "bn" ? "রিফ্রেশ করুন" : "Refresh"}
        >
          <RefreshCcw className={`h-4 w-4 ${theme.textHeading} ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className={`text-sm font-bold ${theme.textMuted}`}>
            {lang === "bn" ? "খবর লোড হচ্ছে..." : "Loading news..."}
          </p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-200 dark:border-rose-800/30 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400">
              {lang === "bn" ? "লোড করতে সমস্যা হয়েছে" : "Failed to load"}
            </h4>
            <p className="text-xs text-rose-600 dark:text-rose-300 mt-1">{error}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {news.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border ${theme.borderCard} rounded-xl overflow-hidden transition-all ${
                  expandedIndex === index ? 'bg-slate-50 dark:bg-slate-800/30 ring-1 ring-emerald-500/30' : 'hover:border-emerald-500/30'
                }`}
              >
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full text-left p-4 flex items-start gap-3 cursor-pointer"
                >
                  <div className={`p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1`}>
                    <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${expandedIndex === index ? 'rotate-90' : ''}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">
                        {item.category}
                      </span>
                      <span className={`text-xs ${theme.textMuted} flex items-center gap-1`}>
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.date)}
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold ${theme.textHeading} leading-snug`}>
                      {item.headline}
                    </h4>
                  </div>
                </button>
                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`px-4 pb-4 pt-1 ml-12 text-sm ${theme.textMain} leading-relaxed`}>
                        {item.description}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
          {news.length === 0 && (
            <div className={`text-center py-8 text-sm ${theme.textMuted}`}>
              {lang === "bn" ? "কোনো খবর পাওয়া যায়নি।" : "No news available."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
