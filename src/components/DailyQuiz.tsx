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
          setQuiz(data);
        }
      } catch (error) {
        console.error("Error fetching daily quiz:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, []);

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
      className={`mt-6 p-4 sm:p-6 rounded-2xl border ${theme.borderCard} ${theme.bgCard} shadow-sm relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-bl-full -z-10 blur-2xl pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${theme.textHeading}`}>
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-500">
            <HelpCircle className="w-5 h-5" />
          </div>
          {lang === "bn" ? "দৈনিক কুইজ (Question of the Day)" : "Question of the Day"}
        </h3>
        
        {points > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-md"
          >
            <Award className="w-4 h-4" />
            +10 Points
          </motion.div>
        )}
      </div>

      <div className={`text-base sm:text-lg font-semibold mb-5 ${theme.textHeading} leading-relaxed pl-1 whitespace-normal break-words`}>
        {quiz.question}
      </div>

      <div className="space-y-2.5 sm:space-y-3">
        {quiz.options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === quiz.correctAnswer;
          const showStatus = selectedAnswer !== null;

          let optionStyle = `border ${theme.borderCard} hover:bg-slate-50 dark:hover:bg-slate-800 ${theme.textMain}`;
          let icon = null;

          if (showStatus) {
            if (isCorrect) {
              optionStyle = "bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-400 text-green-700 dark:text-green-300 shadow-sm";
              icon = <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 shrink-0 ml-2" />;
            } else if (isSelected && !isCorrect) {
              optionStyle = "bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300";
              icon = <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0 ml-2" />;
            } else {
              optionStyle = `opacity-60 border ${theme.borderCard} ${theme.textMain}`;
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(option)}
              disabled={selectedAnswer !== null}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl transition-all duration-300 flex items-start justify-between ${optionStyle}`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 mt-0.5 ${showStatus && (isCorrect || isSelected) ? 'bg-current text-white mix-blend-overlay opacity-30' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-medium whitespace-normal break-words flex-1 mt-0.5 leading-snug">{option}</span>
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
            animate={{ opacity: 1, height: "auto", marginTop: 20 }}
            className={`p-4 sm:p-5 rounded-xl text-sm sm:text-base border ${theme.isDark ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200"} relative`}
          >
            
            <div className={`mb-3 font-bold ${selectedAnswer === quiz.correctAnswer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
               {selectedAnswer === quiz.correctAnswer ? 
                  (lang === "bn" ? "সঠিক উত্তর!" : "Correct Answer!") :
                  (lang === "bn" ? `ভুল উত্তর। সঠিক উত্তর হলো: ${quiz.correctAnswer}` : `Wrong Answer. The correct answer is: ${quiz.correctAnswer}`)
               }
            </div>

            <h4 className={`font-bold mb-2 flex items-center gap-2 ${theme.isDark ? "text-slate-200" : "text-slate-800"}`}>
              <ArrowRight className="w-4 h-4 text-amber-500" />
              {lang === "bn" ? "ব্যাখ্যা:" : "Explanation:"}
            </h4>
            <p className={`whitespace-normal break-words leading-relaxed ${theme.isDark ? "text-slate-300" : "text-slate-600"}`}>
              {quiz.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
