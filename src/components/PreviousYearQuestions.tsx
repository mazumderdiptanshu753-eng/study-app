import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeConfig } from "../lib/themes";
import { Language } from "../lib/translations";
import { BookOpen, AlertCircle, RefreshCcw, Archive, CheckCircle2, XCircle } from "lucide-react";

interface PYQProps {
  theme: ThemeConfig;
  lang: Language;
}

interface QuestionItem {
  question: string;
  options: string[];
  correctAnswer: string;
  year: string;
  subject: string;
}

const EXAMS = ["SSC CGL", "WBCS", "RRB NTPC", "UPSC CSE", "WB Police"];

export default function PreviousYearQuestions({ theme, lang }: PYQProps) {
  const [selectedExam, setSelectedExam] = useState(EXAMS[0]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const fetchQuestions = async (exam: string) => {
    setLoading(true);
    setError(null);
    setShowResults(false);
    setSelectedAnswers({});
    try {
      const response = await fetch(`/api/pyq?exam=${encodeURIComponent(exam)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(selectedExam);
  }, [selectedExam]);

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] !== undefined && q.options[selectedAnswers[i]] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className={`rounded-2xl border ${theme.borderCard} ${theme.bgCard} p-6 shadow-sm`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`font-extrabold ${theme.textHeading} text-lg mb-1 flex items-center gap-2`}>
            <Archive className={`h-5 w-5 ${theme.primaryText}`} />
            {lang === "bn" ? "বিগত বছরের প্রশ্ন (PYQ)" : "Previous Year Questions"}
          </h3>
          <p className={`text-sm ${theme.textMuted}`}>
            {lang === "bn" ? "পুরোনো প্রশ্ন প্র্যাকটিস করুন" : "Practice old exam questions"}
          </p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
        {EXAMS.map(exam => (
          <button
            key={exam}
            onClick={() => setSelectedExam(exam)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedExam === exam
                ? `${theme.primaryBtn} ${theme.primaryBtnText} shadow-md`
                : `bg-slate-100 dark:bg-slate-800 ${theme.textMuted} hover:bg-slate-200 dark:hover:bg-slate-700`
            }`}
          >
            {exam}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className={`text-sm font-bold ${theme.textMuted}`}>
            {lang === "bn" ? "প্রশ্ন লোড হচ্ছে..." : "Loading questions..."}
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
        <div className="space-y-6 mt-4">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className={`p-5 rounded-xl border ${theme.borderCard} bg-slate-50/50 dark:bg-slate-800/20`}>
              <div className="flex gap-2 mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                  {q.subject}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {q.year}
                </span>
              </div>
              <p className={`font-bold ${theme.textHeading} text-sm mb-4 leading-relaxed`}>
                <span className={`text-amber-500 mr-2`}>Q{qIndex + 1}.</span>
                {q.question}
              </p>
              
              <div className="grid gap-2">
                {q.options.map((opt, optIndex) => {
                  const isSelected = selectedAnswers[qIndex] === optIndex;
                  const isCorrect = opt === q.correctAnswer;
                  
                  let optStyle = `border ${theme.borderCard} bg-white dark:bg-slate-900 hover:border-amber-500/50`;
                  if (isSelected) {
                    optStyle = `border-amber-500 bg-amber-50 dark:bg-amber-900/20`;
                  }
                  if (showResults) {
                    if (isCorrect) {
                      optStyle = `border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400`;
                    } else if (isSelected && !isCorrect) {
                      optStyle = `border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400`;
                    } else {
                      optStyle = `border ${theme.borderCard} opacity-50`;
                    }
                  }

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelectAnswer(qIndex, optIndex)}
                      disabled={showResults}
                      className={`w-full text-left p-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-between ${optStyle} ${theme.textMain} ${!showResults ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold border ${isSelected ? 'border-amber-500 bg-amber-500 text-white' : `${theme.borderCard} ${theme.textMuted}`}`}>
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        {opt}
                      </div>
                      {showResults && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                      {showResults && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-rose-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {questions.length > 0 && !showResults && (
            <button
              onClick={() => setShowResults(true)}
              disabled={Object.keys(selectedAnswers).length === 0}
              className={`w-full py-3 rounded-xl font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${theme.primaryBtn} ${theme.primaryBtnText}`}
            >
              {lang === "bn" ? "ফলাফল দেখুন" : "Submit & See Results"}
            </button>
          )}

          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-xl border ${theme.borderCard} bg-slate-50 dark:bg-slate-800/40 text-center`}
            >
              <h4 className={`text-xl font-black ${theme.textHeading} mb-2`}>
                {lang === "bn" ? "আপনার স্কোর" : "Your Score"}: {calculateScore()} / {questions.length}
              </h4>
              <p className={`text-sm ${theme.textMuted} mb-4`}>
                {calculateScore() >= questions.length / 2 
                  ? (lang === "bn" ? "ভালো প্রস্তুতি! এভাবেই চালিয়ে যান।" : "Good preparation! Keep it up.")
                  : (lang === "bn" ? "আরও অনুশীলনের প্রয়োজন।" : "Needs more practice.")}
              </p>
              <button
                onClick={() => fetchQuestions(selectedExam)}
                className={`px-6 py-2 rounded-lg font-bold border ${theme.borderCard} hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer ${theme.textMain}`}
              >
                {lang === "bn" ? "নতুন প্রশ্ন প্র্যাকটিস করুন" : "Practice New Questions"}
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
