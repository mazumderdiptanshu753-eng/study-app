import React, { useState, useEffect } from "react";
import { Lightbulb, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { ThemeConfig } from "../lib/themes";
import { Language } from "../lib/translations";

interface QnA {
  question: string;
  answer: string;
  subject: string;
}

interface ImportantQuestionsProps {
  theme: ThemeConfig;
  lang: Language;
}

export default function ImportantQuestions({ theme, lang }: ImportantQuestionsProps) {
  const [qnaList, setQnaList] = useState<QnA[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    setExpandedIndex(null);
    try {
      const response = await fetch("/api/important-questions");
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      setQnaList(data.qnaList || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  if (loading) {
    return (
      <div className={`rounded-xl border ${theme.borderCard} ${theme.bgCard} p-6 flex flex-col items-center justify-center min-h-[200px]`}>
        <RefreshCw className={`h-8 w-8 animate-spin ${theme.primaryText} mb-4`} />
        <p className={`text-sm font-semibold ${theme.textMuted}`}>
          {lang === "bn" ? "গুরুত্বপূর্ণ প্রশ্নোত্তর তৈরি করা হচ্ছে..." : "Loading Important Q&A..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-xl border ${theme.borderCard} ${theme.bgCard} p-6 flex flex-col items-center justify-center min-h-[200px]`}>
        <AlertCircle className="h-8 w-8 text-rose-500 mb-4" />
        <p className={`text-sm font-semibold text-rose-500 mb-4`}>{error}</p>
        <button
          onClick={fetchQuestions}
          className={`px-4 py-2 rounded-lg text-xs font-bold ${theme.primaryBtn} ${theme.primaryBtnText} cursor-pointer`}
        >
          {lang === "bn" ? "পুনরায় চেষ্টা করুন" : "Try Again"}
        </button>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border ${theme.borderCard} ${theme.bgCard} p-5 shadow-3xs`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Lightbulb className={`h-5 w-5 ${theme.primaryText}`} />
          <h3 className={`font-extrabold ${theme.textHeading} text-sm uppercase tracking-wide`}>
            {lang === "bn" ? "গুরুত্বপূর্ণ প্রশ্নোত্তর" : "Important Q&A"}
          </h3>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400`}>
          {lang === "bn" ? "পরীক্ষার জন্য" : "For Exams"}
        </span>
      </div>

      <div className="space-y-3">
        {qnaList.map((qna, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div key={idx} className={`rounded-xl border ${theme.borderCard} overflow-hidden transition-all duration-200`}>
              <button
                onClick={() => toggleExpand(idx)}
                className={`w-full text-left p-4 flex items-center justify-between cursor-pointer ${isExpanded ? 'bg-slate-50 dark:bg-slate-800/50' : theme.bgCard} hover:bg-slate-50 dark:hover:bg-slate-800/50`}
              >
                <div className="flex flex-col pr-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.textMuted} mb-1`}>{qna.subject}</span>
                  <span className={`font-semibold text-sm ${theme.textHeading}`}>{qna.question}</span>
                </div>
                {isExpanded ? (
                  <ChevronUp className={`h-5 w-5 ${theme.textMuted} shrink-0`} />
                ) : (
                  <ChevronDown className={`h-5 w-5 ${theme.textMuted} shrink-0`} />
                )}
              </button>
              
              {isExpanded && (
                <div className={`p-4 pt-0 bg-slate-50 dark:bg-slate-800/50`}>
                  <div className={`p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30`}>
                    <p className={`text-sm font-bold text-emerald-800 dark:text-emerald-300`}>
                      <span className="opacity-75 mr-2">{lang === "bn" ? "উত্তর:" : "Ans:"}</span>
                      {qna.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
