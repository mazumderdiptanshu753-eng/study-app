import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeConfig } from "../lib/themes";
import { Language } from "../lib/translations";
import { Briefcase, AlertCircle, RefreshCcw, ExternalLink, BellRing, CheckCircle2, FileText } from "lucide-react";

interface JobAlertsProps {
  theme: ThemeConfig;
  lang: Language;
}

interface AlertItem {
  title: string;
  organization: string;
  type: string; // 'New Job', 'Admit Card', 'Result'
  lastDateOrStatus: string;
  link: string;
}

export default function JobAlerts({ theme, lang }: JobAlertsProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/job-alerts");
      if (!response.ok) {
        throw new Error("Failed to fetch job alerts");
      }
      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const getTypeIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('job') || t.includes('vacancy')) return <Briefcase className="h-4 w-4" />;
    if (t.includes('admit') || t.includes('card')) return <FileText className="h-4 w-4" />;
    if (t.includes('result')) return <CheckCircle2 className="h-4 w-4" />;
    return <BellRing className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('job') || t.includes('vacancy')) return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400';
    if (t.includes('admit') || t.includes('card')) return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400';
    if (t.includes('result')) return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400';
    return 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400';
  };

  return (
    <div className={`rounded-2xl border ${theme.borderCard} ${theme.bgCard} p-6 shadow-sm`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`font-extrabold ${theme.textHeading} text-lg mb-1 flex items-center gap-2`}>
            <BellRing className={`h-5 w-5 ${theme.primaryText}`} />
            {lang === "bn" ? "লাইভ চাকরির খবর" : "Live Job Alerts"}
          </h3>
          <p className={`text-sm ${theme.textMuted}`}>
            {lang === "bn" ? "নতুন বিজ্ঞপ্তি, অ্যাডমিট কার্ড এবং রেজাল্ট" : "New notifications, admit cards, and results"}
          </p>
        </div>
        <button
          onClick={fetchAlerts}
          disabled={loading}
          className={`p-2 rounded-lg border ${theme.borderCard} ${theme.bgCard} hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
          title={lang === "bn" ? "রিফ্রেশ করুন" : "Refresh"}
        >
          <RefreshCcw className={`h-4 w-4 ${theme.textHeading} ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className={`text-sm font-bold ${theme.textMuted}`}>
            {lang === "bn" ? "খবর লোড হচ্ছে..." : "Loading alerts..."}
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
        <div className="grid gap-3">
          <AnimatePresence>
            {alerts.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border ${theme.borderCard} bg-slate-50/50 dark:bg-slate-800/30 hover:border-blue-500/30 transition-all group`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 ${getTypeColor(item.type)}`}>
                        {getTypeIcon(item.type)}
                        {item.type}
                      </span>
                      <span className={`text-[10px] font-bold ${theme.textMuted} bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border ${theme.borderCard}`}>
                        {item.organization}
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold ${theme.textHeading} mb-1 leading-snug`}>
                      {item.title}
                    </h4>
                    <p className={`text-xs font-semibold ${theme.textMuted}`}>
                      {item.lastDateOrStatus}
                    </p>
                  </div>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg bg-white dark:bg-slate-900 border ${theme.borderCard} ${theme.textMuted} hover:text-blue-500 hover:border-blue-500/50 transition-all cursor-pointer`}
                    title={lang === "bn" ? "বিস্তারিত দেখুন" : "View Details"}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {alerts.length === 0 && (
            <div className={`text-center py-8 text-sm ${theme.textMuted}`}>
              {lang === "bn" ? "কোনো খবর পাওয়া যায়নি।" : "No alerts available."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
