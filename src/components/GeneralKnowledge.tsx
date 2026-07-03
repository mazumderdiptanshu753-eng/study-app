import React, { useState, useEffect } from "react";
import { BookOpen, AlertCircle, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { ThemeConfig } from "../lib/themes";
import { Language } from "../lib/translations";

interface GKQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

interface GeneralKnowledgeProps {
  theme: ThemeConfig;
  lang: Language;
}

export default function GeneralKnowledge({ theme, lang }: GeneralKnowledgeProps) {
  const [questions, setQuestions] = useState<GKQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    setShowResults(false);
    setSelectedAnswers({});
    try {
      const response = await fetch("/api/gk-questions");
      if (!response.ok) {
        throw new Error("Failed to fetch general knowledge questions");
      }
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        score++;
      }
    });
    return score;
  };

  if (loading) {
    return (
      <div className={`rounded-xl border ${theme.borderCard} ${theme.bgCard} p-6 flex flex-col items-center justify-center min-h-[300px]`}>
        <RefreshCw className={`h-8 w-8 animate-spin ${theme.primaryText} mb-4`} />
        <p className={`text-sm font-semibold ${theme.textMuted}`}>
          {lang === "bn" ? "জিকে প্রশ্ন তৈরি করা হচ্ছে..." : "Loading Weekly GK Questions..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-xl border ${theme.borderCard} ${theme.bgCard} p-6 flex flex-col items-center justify-center min-h-[300px]`}>
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
          <BookOpen className={`h-5 w-5 ${theme.primaryText}`} />
          <h3 className={`font-extrabold ${theme.textHeading} text-sm uppercase tracking-wide`}>
            {lang === "bn" ? "সাপ্তাহিক সাধারণ জ্ঞান (সরকারি চাকরির জন্য)" : "Weekly General Knowledge"}
          </h3>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${theme.primaryBg} ${theme.primaryText}`}>
          {lang === "bn" ? "সরকারি পরীক্ষা স্পেশাল" : "Govt Exam Special"}
        </span>
      </div>

      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const isAnswered = selectedAnswers[qIndex] !== undefined;
          const isCorrect = selectedAnswers[qIndex] === q.correctOptionIndex;

          return (
            <div key={qIndex} className={`p-4 rounded-xl border ${theme.borderCard} bg-slate-50/50 dark:bg-slate-900/30`}>
              <p className={`font-semibold ${theme.textHeading} text-sm mb-4 leading-relaxed`}>
                {qIndex + 1}. {q.question}
              </p>
              
              <div className="space-y-2">
                {q.options.map((opt, optIndex) => {
                  let buttonClass = `w-full text-left px-4 py-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${theme.borderCard} ${theme.bgCard} hover:border-slate-400 dark:hover:border-slate-500 ${theme.textMain}`;
                  
                  if (showResults) {
                    if (optIndex === q.correctOptionIndex) {
                      buttonClass = `w-full text-left px-4 py-3 rounded-lg border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold`;
                    } else if (selectedAnswers[qIndex] === optIndex) {
                      buttonClass = `w-full text-left px-4 py-3 rounded-lg border-2 border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold`;
                    } else {
                      buttonClass = `w-full text-left px-4 py-3 rounded-lg border ${theme.borderCard} opacity-50 ${theme.bgCard} ${theme.textMuted}`;
                    }
                  } else if (selectedAnswers[qIndex] === optIndex) {
                    buttonClass = `w-full text-left px-4 py-3 rounded-lg border-2 ${theme.primaryBtn} ${theme.primaryBtnText} font-bold`;
                  }

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelectAnswer(qIndex, optIndex)}
                      disabled={showResults}
                      className={buttonClass}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt}</span>
                        {showResults && optIndex === q.correctOptionIndex && (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        )}
                        {showResults && selectedAnswers[qIndex] === optIndex && optIndex !== q.correctOptionIndex && (
                          <XCircle className="h-4 w-4 text-rose-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {showResults && (
                <div className={`mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30`}>
                  <p className={`text-xs font-semibold text-blue-800 dark:text-blue-300`}>
                    <span className="font-bold">{lang === "bn" ? "ব্যাখ্যা: " : "Explanation: "}</span>
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!showResults ? (
        <button
          onClick={() => setShowResults(true)}
          className={`mt-6 w-full py-3 rounded-xl text-sm font-bold shadow-3xs transition-all ${theme.primaryBtn} ${theme.primaryBtnText} hover:opacity-90 cursor-pointer`}
        >
          {lang === "bn" ? "উত্তর ও ফলাফল দেখুন" : "View Answers & Results"}
        </button>
      ) : (
        <div className="mt-6 flex items-center justify-between p-4 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
              {lang === "bn" ? "আপনার স্কোর" : "Your Score"}
            </span>
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
              {calculateScore()} / {questions.length}
            </span>
          </div>
          <button
            onClick={() => {
              setShowResults(false);
              setSelectedAnswers({});
            }}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors cursor-pointer shadow-3xs"
          >
            {lang === "bn" ? "পুনরায় চেষ্টা করুন" : "Retake Quiz"}
          </button>
        </div>
      )}
    </div>
  );
}
