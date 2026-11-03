import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  X, 
  BookOpen, 
  Award, 
  Laptop, 
  GraduationCap, 
  BellRing, 
  Newspaper, 
  Archive, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  Radio, 
  Video, 
  Users, 
  Lightbulb,
  Tag,
  Bookmark
} from "lucide-react";
import { class9Subjects } from "../data/class9Data";
import { class10Subjects } from "../data/class10Data";
import { ThemeConfig } from "../lib/themes";
import { Language } from "../lib/translations";
import { StudyNote } from "../types";

export interface SearchResultItem {
  id: string;
  titleEn: string;
  titleBn: string;
  subtitleEn?: string;
  subtitleBn?: string;
  categoryEn: string;
  categoryBn: string;
  type: "chapter_class9" | "chapter_class10" | "user_note" | "gk_topic" | "job_alert" | "pyq" | "nav";
  targetTab: string;
  targetSubTab?: string;
  noteData?: StudyNote;
  subjectId?: string;
  chapterId?: string;
  icon: React.ElementType | string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  theme: ThemeConfig;
  userNotes: StudyNote[];
  onNavigate: (tab: string, extraData?: any) => void;
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
  lang,
  theme,
  userNotes,
  onNavigate,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Can be triggered externally
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Build searchable index
  const allSearchableItems: SearchResultItem[] = React.useMemo(() => {
    const items: SearchResultItem[] = [];

    // 1. App Navigation Pages
    const navItems = [
      { id: "nav_dashboard", titleEn: "Dashboard", titleBn: "ড্যাশবোর্ড", targetTab: "dashboard", icon: GraduationCap, categoryEn: "Navigation", categoryBn: "ন্যাভিগেশন" },
      { id: "nav_school", titleEn: "School Academy (Class 9 & 10)", titleBn: "স্কুল একাডেমি (৯ম ও ১০ম শ্রেণি)", targetTab: "school", icon: BookOpen, categoryEn: "Navigation", categoryBn: "ন্যাভিগেশন" },
      { id: "nav_diploma", titleEn: "Polytechnic Diploma Corner", titleBn: "ডিপ্লোমা কর্নার (পলিটেকনিক)", targetTab: "diploma", icon: Laptop, categoryEn: "Navigation", categoryBn: "ন্যাভিগেশন" },
      { id: "nav_gk", titleEn: "Job Prep & General Knowledge", titleBn: "চাকরির খবর ও সাধারণ জ্ঞান", targetTab: "gk", icon: Award, categoryEn: "Navigation", categoryBn: "ন্যাভিগেশন" },
      { id: "nav_govt_notes", titleEn: "Govt Job Notes (Math, English, GK)", titleBn: "সরকারী চাকরির নোটস", targetTab: "govtJobNotes", icon: FileText, categoryEn: "Navigation", categoryBn: "ন্যাভিগেশন" },
      { id: "nav_notes", titleEn: "My Personal Study Notes", titleBn: "আমার নোটস", targetTab: "notes", icon: FileText, categoryEn: "Navigation", categoryBn: "ন্যাভিগেশন" },
      { id: "nav_chat", titleEn: "AI Teacher & Support Chat", titleBn: "শিক্ষক চ্যাট ও সমাধান", targetTab: "chat", icon: MessageSquare, categoryEn: "Navigation", categoryBn: "ন্যাভিগেশন" },
      { id: "nav_live", titleEn: "Live Lectures & Video Portal", titleBn: "লাইভ ক্লাস ও ভিডিও পোর্টাল", targetTab: "liveClasses", icon: Radio, categoryEn: "Navigation", categoryBn: "ন্যাভিগেশন" },
      { id: "nav_forum", titleEn: "Community Discussion Forum", titleBn: "ফোরাম বোর্ড", targetTab: "forum", icon: Users, categoryEn: "Navigation", categoryBn: "ন্যাভিগেশন" },
    ];

    navItems.forEach((n) => {
      items.push({
        id: n.id,
        titleEn: n.titleEn,
        titleBn: n.titleBn,
        categoryEn: n.categoryEn,
        categoryBn: n.categoryBn,
        type: "nav",
        targetTab: n.targetTab,
        icon: n.icon,
      });
    });

    // 2. Class 9 Chapters
    class9Subjects.forEach((sub) => {
      sub.chapters.forEach((chap) => {
        items.push({
          id: `c9_${sub.id}_${chap.id}`,
          titleEn: `${chap.chapterNameEn} (${sub.nameEn})`,
          titleBn: `${chap.chapterNameBn} (${sub.nameBn})`,
          subtitleEn: chap.summaryEn,
          subtitleBn: chap.summaryBn,
          categoryEn: "Class 9 Notes",
          categoryBn: "৯ম শ্রেণির নোটস",
          type: "chapter_class9",
          targetTab: "school",
          subjectId: sub.id,
          chapterId: chap.id,
          icon: "📘",
        });
      });
    });

    // 3. Class 10 Chapters
    class10Subjects.forEach((sub) => {
      sub.chapters.forEach((chap) => {
        items.push({
          id: `c10_${sub.id}_${chap.id}`,
          titleEn: `${chap.chapterNameEn} (${sub.nameEn})`,
          titleBn: `${chap.chapterNameBn} (${sub.nameBn})`,
          subtitleEn: chap.summaryEn,
          subtitleBn: chap.summaryBn,
          categoryEn: "Class 10 Notes",
          categoryBn: "১০ম শ্রেণির নোটস",
          type: "chapter_class10",
          targetTab: "school",
          subjectId: sub.id,
          chapterId: chap.id,
          icon: "📗",
        });
      });
    });

    // 4. Personal User Notes
    userNotes.forEach((n) => {
      items.push({
        id: `user_note_${n.id}`,
        titleEn: n.title,
        titleBn: n.title,
        subtitleEn: n.content.substring(0, 80) + "...",
        subtitleBn: n.content.substring(0, 80) + "...",
        categoryEn: "Personal Notes",
        categoryBn: "ব্যক্তিগত নোটস",
        type: "user_note",
        targetTab: "notes",
        noteData: n,
        icon: FileText,
      });
    });

    // 5. Job Prep & GK topics
    const staticGKTopics = [
      { id: "gk_wbcs", titleEn: "WBCS & WBPSC Previous Questions", titleBn: "WBCS ও WBPSC বিগত বছরের প্রশ্ন", catEn: "Job Prep & PYQ", catBn: "চাকরির প্রিপারেশন" },
      { id: "gk_rail", titleEn: "Railway NTPC & Group D Math & Science", titleBn: "রেলওয়ে এনটিপিসি ও গ্রুপ ডি স্পেশাল", catEn: "Job Prep & PYQ", catBn: "চাকরির প্রিপারেশন" },
      { id: "gk_ssc", titleEn: "SSC CGL / CHSL General Knowledge", titleBn: "এসএসসি সিজিএল ও সিএইচএসএল জিকে", catEn: "Job Prep & PYQ", catBn: "চাকরির প্রিপারেশন" },
      { id: "gk_current", titleEn: "National & International Current Affairs 2026", titleBn: "সাম্প্রতিক ঘটনাবলী ও দৈনিক কারেন্ট অ্যাফেয়ার্স", catEn: "Current Affairs", catBn: "কারেন্ট অ্যাফেয়ার্স" },
      { id: "gk_alerts", titleEn: "West Bengal & All India Govt Job Notifications", titleBn: "পশ্চিমবঙ্গ ও সর্বভারতীয় সরকারি চাকরির বিজ্ঞপ্তি", catEn: "Job Alerts", catBn: "চাকরির বিজ্ঞপ্তি" },
      { id: "gk_important", titleEn: "High-Yield GK Question Answers", titleBn: "গুরুত্বপূর্ণ সাধারণ জ্ঞান প্রশ্নোত্তর", catEn: "GK Q&A", catBn: "জিকে প্রশ্নোত্তর" },
    ];

    staticGKTopics.forEach((g) => {
      items.push({
        id: g.id,
        titleEn: g.titleEn,
        titleBn: g.titleBn,
        categoryEn: g.catEn,
        categoryBn: g.catBn,
        type: "gk_topic",
        targetTab: "gk",
        icon: Award,
      });
    });

    return items;
  }, [userNotes]);

  // Filtered results
  const filteredResults = React.useMemo(() => {
    if (!query.trim()) {
      return allSearchableItems.slice(0, 10); // Show top default suggestions
    }

    const q = query.toLowerCase().trim();

    return allSearchableItems.filter((item) => {
      // Filter by category tab if selected
      if (selectedCategory === "notes" && !item.type.startsWith("chapter") && item.type !== "user_note") return false;
      if (selectedCategory === "jobs" && item.type !== "job_alert" && item.type !== "gk_topic") return false;
      if (selectedCategory === "nav" && item.type !== "nav") return false;

      const matchEn = item.titleEn.toLowerCase().includes(q) || (item.subtitleEn && item.subtitleEn.toLowerCase().includes(q));
      const matchBn = item.titleBn.toLowerCase().includes(q) || (item.subtitleBn && item.subtitleBn.toLowerCase().includes(q));
      const matchCat = item.categoryEn.toLowerCase().includes(q) || item.categoryBn.toLowerCase().includes(q);

      return matchEn || matchBn || matchCat;
    });
  }, [allSearchableItems, query, selectedCategory]);

  // Keyboard navigation inside list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelectItem(filteredResults[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleSelectItem = (item: SearchResultItem) => {
    onNavigate(item.targetTab, {
      subjectId: item.subjectId,
      chapterId: item.chapterId,
      noteData: item.noteData,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-4 bg-indigo-950/25 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl border border-indigo-100 shadow-2xl overflow-hidden"
        >
          {/* Top Search Input Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3">
            <Search className="w-5 h-5 text-indigo-500 flex-shrink-0 animate-pulse" />
            
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                lang === "bn"
                  ? "নোটস, বিষয়, চাকরির খবর বা অধ্যায় খুঁজুন... (যেমন: বাস্তব সংখ্যা, Physics, GK)"
                  : "Search notes, topics, job alerts, or chapters... (e.g. Real Numbers, Math, PYQ)"
              }
              className="flex-1 bg-transparent text-sm sm:text-base font-semibold outline-none text-slate-900 placeholder-slate-400"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              ESC
            </button>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2 overflow-x-auto custom-scrollbar text-xs font-bold">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-200/70 text-slate-700 hover:text-slate-900"
              }`}
            >
              {lang === "bn" ? "সকল রেজাল্ট" : "All Results"}
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("notes")}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                selectedCategory === "notes"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {lang === "bn" ? "নোটস ও অধ্যায়" : "Notes & Chapters"}
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("jobs")}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                selectedCategory === "jobs"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {lang === "bn" ? "জিকে ও চাকরির খবর" : "GK & Job Prep"}
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("nav")}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                selectedCategory === "nav"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {lang === "bn" ? "পেজ লিঙ্ক" : "Pages"}
            </button>
          </div>

          {/* Results List */}
          <div 
            ref={resultsContainerRef}
            className="p-2 sm:p-3 max-h-[60vh] overflow-y-auto space-y-1 custom-scrollbar"
          >
            {filteredResults.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-bold">
                  {lang === "bn" ? "কোন ফলাফল পাওয়া যায়নি!" : "No search results found!"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === "bn" ? "অন্য শব্দ দিয়ে আবার চেষ্টা করুন।" : "Try searching for another topic or chapter."}
                </p>
              </div>
            ) : (
              filteredResults.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const IconComp = item.icon;

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full p-3 rounded-2xl text-left flex items-center justify-between gap-3 transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800/80 shadow-xs"
                        : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${
                        isSelected 
                          ? "bg-indigo-600 text-white shadow-sm" 
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}>
                        {typeof IconComp === "string" ? (
                          <span>{IconComp}</span>
                        ) : (
                          <IconComp className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider">
                            {lang === "bn" ? item.categoryBn : item.categoryEn}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                          {lang === "bn" ? item.titleBn : item.titleEn}
                        </h4>
                        {(item.subtitleBn || item.subtitleEn) && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                            {lang === "bn" ? item.subtitleBn : item.subtitleEn}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 flex-shrink-0">
                      <span className="hidden sm:inline text-[11px] text-indigo-500 font-semibold">
                        {lang === "bn" ? "খুলুন" : "Open"}
                      </span>
                      <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? "translate-x-1 text-indigo-500" : ""}`} />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Keyboard Hints */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px]">↑↓</kbd>
                <span>{lang === "bn" ? "উপরে/নিচে" : "Navigate"}</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px]">↵</kbd>
                <span>{lang === "bn" ? "নির্বাচন" : "Select"}</span>
              </span>
            </div>

            <span className="text-[10px] text-slate-400 font-mono font-bold">
              STUDY HUB GLOBAL SEARCH
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
