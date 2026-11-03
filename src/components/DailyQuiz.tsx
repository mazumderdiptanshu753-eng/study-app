import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, CheckCircle2, XCircle, Award, ArrowRight } from "lucide-react";
import { Language } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";

interface QuizData {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface DailyQuizProps {
  theme: ThemeConfig;
  lang: Language;
}

export default function DailyQuiz({ theme, lang }: DailyQuizProps) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const response = await fetch("/api/daily-quiz");
        if (response.ok) {
          const data = await response.json();
          if (data && data.question && Array.isArray(data.options) && data.correctAnswer) {
            setQuiz(data);
            return;
          }
        }
        throw new Error("Invalid response or not ok");
      } catch (error) {
        console.error("Error fetching daily quiz, using local fallback:", error);
        setQuiz({
          question: lang === "bn" 
            ? "কোষের কোন অঙ্গাণুকে শক্তির ঘর (Powerhouse) বলা হয়?" 
            : "Which organelle is known as the powerhouse of the cell?",
          options: lang === "bn"
            ? ["নিউক্লিয়াস", "মাইটোকন্ড্রিয়া", "রাইবোজোম", "এন্ডোপ্লাজমিক রেটিকুলাম"]
            : ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
          correctAnswer: lang === "bn" ? "মাইটোকন্ড্রিয়া" : "Mitochondria",
          explanation: lang === "bn"
            ? "মাইটোকন্ড্রিয়া কোষের জৈব রাসায়নিক বিক্রিয়াগুলো পরিচালনা করতে বেশিরভাগ রাসায়নিক শক্তি উৎপাদন করে।"
            : "Mitochondria generate most of the chemical energy needed to power the cell's biochemical reactions."
        });
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [lang]);

  if (loading) {
    return (
      <div className={`mt-6 p-4 sm:p-6 rounded-2xl border ${theme.borderCard} ${theme.bgCard} shadow-sm animate-pulse`}>
        <div className="h-6 bg-slate-200 dark:bg-slate-700 w-1/3 rounded mb-4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 w-3/4 rounded mb-2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 w-1/2 rounded mb-6"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 w-full rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  const handleSelect = (option: string) => {
    if (selectedAnswer) return; // Prevent changing answer
    setSelectedAnswer(option);
    setShowExplanation(true);
    if (option === quiz.correctAnswer) {
      setPoints(10);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 sm:p-6 rounded-3xl border ${theme.borderCard} ${theme.bgCard} shadow-sm relative overflow-hidden transition-all`}
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <HelpCircle className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className={`text-sm sm:text-base font-black ${theme.textHeading} tracking-tight`}>
              {lang === "bn" ? "দৈনিক কুইজ" : "Question of the Day"}
            </h3>
            <span className="text-[10px] font-bold text-slate-400 block">
              {lang === "bn" ? "প্রতিদিনের চ্যালেঞ্জ ও তাৎক্ষণিক ব্যাখ্যা" : "Daily Challenge & Concept Check"}
            </span>
          </div>
        </div>
        
        {points > 0 ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-black"
          >
            <Award className="w-3.5 h-3.5" />
            <span>+10 PTS</span>
          </motion.div>
        ) : (
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
            10 PTS
          </span>
        )}
      </div>

      <div className={`text-sm sm:text-base font-bold mb-5 ${theme.textHeading} leading-relaxed pl-0.5`}>
        {quiz.question}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {quiz.options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === quiz.correctAnswer;
          const showStatus = selectedAnswer !== null;

          let optionStyle = `border ${theme.borderCard} bg-slate-50/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-400 text-slate-900 dark:text-slate-100 font-bold`;
          let icon = null;

          if (showStatus) {
            if (isCorrect) {
              optionStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-black shadow-xs";
              icon = <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />;
            } else if (isSelected && !isCorrect) {
              optionStyle = "bg-rose-500/10 border-rose-500 text-rose-900 dark:text-rose-300 font-black";
              icon = <XCircle className="w-4.5 h-4.5 text-rose-600 dark:text-rose-400 shrink-0 ml-2" />;
            } else {
              optionStyle = "opacity-45 border-slate-200 dark:border-slate-800 text-slate-400 font-medium";
            }
          } else if (isSelected) {
            optionStyle = `border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100 font-black shadow-xs`;
          }

          let badgeStyle = "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600";
          if (showStatus) {
            if (isCorrect) badgeStyle = "bg-emerald-600 text-white border-transparent";
            else if (isSelected && !isCorrect) badgeStyle = "bg-rose-600 text-white border-transparent";
          } else if (isSelected) {
            badgeStyle = "bg-emerald-600 text-white border-transparent";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(option)}
              disabled={selectedAnswer !== null}
              className={`text-left p-3.5 rounded-2xl transition-all duration-200 flex items-center justify-between ${optionStyle} cursor-pointer active:scale-98`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className={`flex items-center justify-center w-6 h-6 rounded-lg text-xs font-black shrink-0 ${badgeStyle}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-xs sm:text-sm whitespace-normal break-words flex-1 leading-snug">{option}</span>
              </div>
              {icon}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            className={`p-4 rounded-2xl text-xs sm:text-sm border ${
              selectedAnswer === quiz.correctAnswer
                ? "bg-emerald-500/5 border-emerald-500/20"
                : "bg-rose-500/5 border-rose-500/20"
            } relative`}
          >
            <div className={`mb-2 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 ${
              selectedAnswer === quiz.correctAnswer ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}>
              <ArrowRight className="w-3.5 h-3.5" />
              <span>
                {selectedAnswer === quiz.correctAnswer 
                  ? (lang === "bn" ? "সঠিক উত্তর!" : "Correct Answer!")
                  : (lang === "bn" ? `ভুল উত্তর। সঠিক উত্তর: ${quiz.correctAnswer}` : `Incorrect. Correct Answer: ${quiz.correctAnswer}`)
                }
              </span>
            </div>

            <p className={`whitespace-normal break-words leading-relaxed text-slate-700 dark:text-slate-300 font-semibold`}>
              {quiz.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
