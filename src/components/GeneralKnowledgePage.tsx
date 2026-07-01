import React from "react";
import { motion } from "motion/react";
import { ThemeConfig } from "../lib/themes";
import { Language } from "../lib/translations";
import GeneralKnowledge from "./GeneralKnowledge";
import ImportantQuestions from "./ImportantQuestions";
import { ArrowLeft } from "lucide-react";

interface GeneralKnowledgePageProps {
  theme: ThemeConfig;
  lang: Language;
  onBack: () => void;
}

export default function GeneralKnowledgePage({ theme, lang, onBack }: GeneralKnowledgePageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto w-full"
    >
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className={`p-2 rounded-full border ${theme.borderCard} ${theme.bgCard} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
        >
          <ArrowLeft className={`h-5 w-5 ${theme.textHeading}`} />
        </button>
        <h2 className={`text-2xl font-black ${theme.textHeading}`}>
          {lang === "bn" ? "সাধারণ জ্ঞান ও প্রশ্নোত্তর" : "General Knowledge & QnA"}
        </h2>
      </div>

      <div className="grid gap-6">
        <GeneralKnowledge lang={lang} theme={theme} />
        <ImportantQuestions lang={lang} theme={theme} />
      </div>
    </motion.div>
  );
}
