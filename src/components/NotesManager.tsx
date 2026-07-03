import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Sparkles, 
  Download, 
  Upload, 
  Share2, 
  FileText, 
  CheckCircle, 
  HelpCircle, 
  RefreshCw, 
  Layers, 
  Compass, 
  ArrowLeft,
  GraduationCap,
  Copy,
  Check
} from "lucide-react";
import { StudyNote, Subject, Flashcard } from "../types";
import { Language, TRANSLATIONS } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";

interface NotesManagerProps {
  notes: StudyNote[];
  selectedNote: StudyNote | null;
  onSelectNote: (note: StudyNote | null) => void;
  onSaveNote: (note: Omit<StudyNote, "id" | "timestamp">) => void;
  onDeleteNote: (id: string) => void;
  onUpdateNoteAI: (id: string, updates: Partial<StudyNote>) => void;
  isLoadingAI: boolean;
  onTriggerSummary: (note: StudyNote) => Promise<void>;
  onTriggerFlashcards: (note: StudyNote) => Promise<void>;
  role: "Admin" | "Student";
  lang: Language;
  theme: ThemeConfig;
}

const SUBJECTS: Subject[] = [
  "Mathematics"
];

export default function NotesManager({
  notes,
  selectedNote,
  onSelectNote,
  onSaveNote,
  onDeleteNote,
  onUpdateNoteAI,
  isLoadingAI,
  onTriggerSummary,
  onTriggerFlashcards,
  role,
  lang,
  theme
}: NotesManagerProps) {
  const t = TRANSLATIONS[lang];
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<Subject>("Mathematics");
  const [content, setContent] = useState("");
  
  const [fileUrl, setFileUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<"pdf" | "image" | "none">("none");
  const [isDragging, setIsDragging] = useState(false);

  // Interactive Flashcards state
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Custom study tool tab state
  const [activeStudyTab, setActiveStudyTab] = useState<"content" | "summary" | "flashcards">("content");

  // Share note / Copying state
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isImage = file.type.startsWith("image/") || 
                    file.name.toLowerCase().endsWith(".jpg") || 
                    file.name.toLowerCase().endsWith(".jpeg") || 
                    file.name.toLowerCase().endsWith(".png");

    if (!isPdf && !isImage) {
      alert(lang === "bn" ? "দয়া করে শুধুমাত্র পিডিএফ বা ইমেজ ফাইল আপলোড করুন (PDF, JPG, JPEG, PNG)" : "Please upload PDF or Image files only (PDF, JPG, JPEG, PNG).");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert(lang === "bn" ? "ফাইল সাইজ ৩ মেগাবাইটের বেশি হওয়া যাবে না।" : "File size must be under 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFileUrl(reader.result as string);
      setFileName(file.name);
      setFileType(isPdf ? "pdf" : "image");
    };
    reader.readAsDataURL(file);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSaveNote({
      title,
      subject,
      content,
      attachmentUrl: fileUrl || undefined,
      attachmentName: fileName || undefined,
      attachmentType: fileType !== "none" ? fileType : undefined,
    });
    setTitle("");
    setContent("");
    setFileUrl("");
    setFileName("");
    setFileType("none");
    setIsCreating(false);
  };

  const handleShareNote = (note: StudyNote) => {
    const serialized = JSON.stringify({
      title: note.title,
      subject: note.subject,
      content: note.content,
      isImported: true
    });
    navigator.clipboard.writeText(serialized);
    setCopiedNoteId(note.id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  const handleImportNote = () => {
    const input = prompt("Paste the study note sharing code here:");
    if (!input) return;
    try {
      const parsed = JSON.parse(input);
      if (parsed.title && parsed.content) {
        onSaveNote({
          title: `${parsed.title} (Shared)`,
          subject: parsed.subject || "General Science",
          content: parsed.content,
        });
        alert("Study Note imported successfully!");
      } else {
        alert("Invalid note format. Make sure you copied the correct share code.");
      }
    } catch (e) {
      alert("Invalid code format. Could not parse sharing payload.");
    }
  };

  // Reset states when switching notes or active tabs
  const handleSelectNote = (note: StudyNote | null) => {
    onSelectNote(note);
    setActiveStudyTab("content");
    setCurrentFlashcardIndex(0);
    setIsFlipped(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="grid gap-6 md:grid-cols-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* LEFT PANEL: Note List & Quick Import (4 cols on md+) */}
      <motion.div variants={itemVariants} className={`md:col-span-4 space-y-4 ${selectedNote || isCreating ? "hidden md:block" : "block"}`}>
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-3xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <BookOpen className="h-4.5 w-4.5 text-teal-600" />
              {t.notesLibraryTitle}
            </h3>
            {role === "Admin" ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleImportNote}
                  title={lang === "bn" ? "শেয়ার কোড ইম্পোর্ট করুন" : "Import shared note code"}
                  id="btn-import-note"
                  className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setIsCreating(true);
                    onSelectNote(null);
                  }}
                  id="btn-new-note"
                  className="p-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-5xs font-bold text-slate-600 border border-slate-100 uppercase tracking-wide">
                {lang === "bn" ? "শুধুমাত্র প্রদর্শন" : "View Only"}
              </span>
            )}
          </div>

          {/* Notes list */}
          <motion.div 
            className="space-y-2 max-h-[460px] overflow-y-auto pr-1"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
          >
            {notes.map((note) => (
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  show: { opacity: 1, x: 0 }
                }}
                key={note.id}
                onClick={() => handleSelectNote(note)}
                className={`relative group w-full text-left p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedNote?.id === note.id
                    ? "bg-teal-50/70 border-teal-200"
                    : "bg-slate-50/50 border-slate-100 hover:bg-slate-100/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="rounded-md bg-white px-1.5 py-0.5 text-4xs font-bold text-teal-700 border border-teal-100 uppercase tracking-wide">
                    {note.subject === "Mathematics" ? t.mathSubject : note.subject}
                  </span>
                  <span className="text-4xs text-slate-400">
                    {new Date(note.timestamp).toLocaleDateString(lang === "bn" ? "bn-BD" : undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-800 text-xs line-clamp-1 group-hover:text-teal-600 pr-4">
                  {note.title}
                </h4>
                <p className="mt-1 text-4xs text-slate-500 line-clamp-2 leading-normal">
                  {note.content}
                </p>

                {/* Tags preview */}
                {note.tags && note.tags.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {note.tags.slice(0, 2).map((tg) => (
                      <span key={tg} className="text-5xs bg-white text-slate-600 px-1 py-0.5 rounded-sm border border-slate-100">
                        #{tg}
                      </span>
                    ))}
                  </div>
                )}

                {/* Hover Quick Actions */}
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-md shadow-xs">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareNote(note);
                    }}
                    title={lang === "bn" ? "শেয়ার কোড কপি করুন" : "Copy sharing code"}
                    className="p-1 text-slate-500 hover:text-teal-600 hover:bg-slate-50 rounded-sm cursor-pointer"
                  >
                    {copiedNoteId === note.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Share2 className="h-3 w-3" />}
                  </button>
                  {role === "Admin" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const msg = lang === "bn" ? "আপনি কি এই অধ্যয়ন নোটটি মুছে ফেলতে চান?" : "Are you sure you want to delete this study note?";
                        if (confirm(msg)) {
                          onDeleteNote(note.id);
                          if (selectedNote?.id === note.id) {
                            handleSelectNote(null);
                          }
                        }
                      }}
                      title={lang === "bn" ? "নোট মুছুন" : "Delete Note"}
                      className="p-1 text-slate-500 hover:text-rose-600 hover:bg-slate-50 rounded-sm cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {notes.length === 0 && !isCreating && (
              <div className="text-center py-10 text-slate-400 text-xs">
                {role === "Admin" 
                  ? (lang === "bn" ? "এখনও কোনো নোট তৈরি করা হয়নি। নোট তৈরি করতে + বাটনে ক্লিক করুন অথবা শেয়ার কোড ইম্পোর্ট করুন!" : "No notes created yet. Click the + icon to make one or import a note code!")
                  : (lang === "bn" ? "লাইব্রেরিতে কোনো স্টাডি নোট পাওয়া যায়নি।" : "No notes available in the library yet.")}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT PANEL: Note Viewer / Editor / Study mode (8 cols on md+) */}
      <motion.div variants={itemVariants} className="md:col-span-8 space-y-6">
        {isCreating ? (
          /* CREATE NOTE FORM */
          <div className="space-y-4">
            <button
              onClick={() => setIsCreating(false)}
              className="md:hidden flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              {lang === "bn" ? "লাইব্রেরিতে ফিরে যান" : "Back to Library"}
            </button>
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h2 className="font-bold text-slate-900 text-base">
                {lang === "bn" ? "নতুন অধ্যয়ন নোট লিখুন" : "Write a New Study Note"}
              </h2>
              <button
                onClick={() => setIsCreating(false)}
                className="text-xs text-slate-500 hover:underline font-medium cursor-pointer"
              >
                {lang === "bn" ? "বাতিল" : "Cancel"}
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {lang === "bn" ? "নোটের শিরোনাম" : "Note Title"}
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={lang === "bn" ? "যেমন: দ্বিঘাত সমীকরণ বা ত্রিকোণমিতি সূত্র" : "e.g. Mitochondria & Cellular Respiration"}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-hidden focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {lang === "bn" ? "বিষয়" : "Subject"}
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as Subject)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs text-slate-800 outline-hidden focus:border-teal-500 focus:bg-white"
                  >
                    {SUBJECTS.map((sub) => (
                      <option key={sub} value={sub}>{sub === "Mathematics" ? t.mathSubject : sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  {lang === "bn" ? "অধ্যয়ন নোটের বিবরণ" : "Study Note Body Content"}
                </label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder={lang === "bn" ? "এখানে আপনার পাঠ্যবইয়ের সংজ্ঞা, লেকচার নোট বা গণিতের সূত্রাবলী পেস্ট করুন যাতে জেমিনি এআই আপনার জন্য সারাংশ, কুইজ এবং ফ্ল্যাশকার্ড তৈরি করতে পারে।" : "Paste textbook definitions, lecture key summaries, equations, or code logs here so Gemini can construct summaries, study cards, and practice questions for you."}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/30 p-3.5 text-sm text-slate-800 placeholder-slate-400 outline-hidden focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                ></textarea>
              </div>

              {/* File attachment area */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  {lang === "bn" ? "নোট ফাইল সংযুক্তি (ঐচ্ছিক - PDF বা JPG/PNG)" : "File Attachment (Optional - PDF or JPG/PNG)"}
                </label>
                
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      processFile(file);
                    }
                  }}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-all relative ${
                    isDragging 
                      ? "border-teal-500 bg-teal-50/50" 
                      : fileUrl 
                        ? "border-teal-100 bg-teal-50/20" 
                        : "border-slate-200 bg-slate-50/30 hover:border-slate-300"
                  }`}
                >
                  {fileUrl ? (
                    <div className="flex items-center justify-between gap-3 text-left">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="rounded-lg bg-teal-100 p-2 text-teal-600 shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate max-w-[200px] sm:max-w-md">
                            {fileName}
                          </p>
                          <span className="text-[10px] text-slate-400 font-bold capitalize">
                            {fileType === "pdf" ? "PDF Document" : "Image Attachment"}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFileUrl("");
                          setFileName("");
                          setFileType("none");
                        }}
                        className="rounded-lg bg-rose-50 p-2 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="mx-auto h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Upload className="h-4.5 w-4.5" />
                      </div>
                      <div className="text-2xs text-slate-500">
                        <span className="font-bold text-teal-600 cursor-pointer hover:underline relative">
                          {lang === "bn" ? "ফাইল আপলোড করুন" : "Upload a file"}
                          <input
                            type="file"
                            accept="application/pdf,image/jpeg,image/jpg,image/png"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </span>{" "}
                        {lang === "bn" ? "অথবা ড্র্যাগ করে এখানে ছাড়ুন" : "or drag and drop here"}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">
                        PDF, JPG, JPEG, PNG ({lang === "bn" ? "সর্বোচ্চ ৩ মেগাবাইট" : "max 3MB"})
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  id="btn-save-note-submit"
                  className="rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-700 transition-all active:scale-95 cursor-pointer"
                >
                  {lang === "bn" ? "লাইব্রেরিতে সংরক্ষণ করুন" : "Save to Library"}
                </button>
              </div>
            </form>
          </div>
          </div>
        ) : selectedNote ? (
          /* NOTE STUDY & INTERACTIVE AI ZONE */
          <div className="space-y-6">
            <button
              onClick={() => handleSelectNote(null)}
              className="md:hidden flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              {lang === "bn" ? "লাইব্রেরিতে ফিরে যান" : "Back to Library"}
            </button>
            {/* Note Sub-navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-2">
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setActiveStudyTab("content")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeStudyTab === "content"
                      ? "bg-teal-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {lang === "bn" ? "নোটের বিবরণ" : "Note Text"}
                </button>
                <button
                  onClick={() => setActiveStudyTab("summary")}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeStudyTab === "summary"
                      ? "bg-teal-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Sparkles className="h-3 w-3 text-amber-500 fill-amber-300" />
                  {lang === "bn" ? "এআই সারাংশ" : "AI Summary"}
                </button>
                <button
                  onClick={() => setActiveStudyTab("flashcards")}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeStudyTab === "flashcards"
                      ? "bg-teal-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Layers className="h-3 w-3" />
                  {lang === "bn" ? "ফ্ল্যাশকার্ড" : "Flashcards"} {selectedNote.flashcards ? `(${selectedNote.flashcards.length})` : ""}
                </button>
              </div>

              {/* Note Share code widget */}
              <button
                onClick={() => handleShareNote(selectedNote)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-2xs font-semibold text-slate-700 transition-all hover:bg-slate-50 cursor-pointer"
              >
                {copiedNoteId === selectedNote.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    {lang === "bn" ? "শেয়ার কোড কপি হয়েছে!" : "Copied Share Code!"}
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5 text-teal-600" />
                    {lang === "bn" ? "নোট শেয়ার কোড" : "Share Note Code"}
                  </>
                )}
              </button>
            </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStudyTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* TAB CONTENT: 1. Core Note Text */}
                  {activeStudyTab === "content" && (
                    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <h2 className="font-bold text-slate-900 text-base">{selectedNote.title}</h2>
                  <span className="rounded-md bg-teal-50 px-2 py-0.5 text-2xs font-bold text-teal-700">
                    {selectedNote.subject === "Mathematics" ? t.mathSubject : selectedNote.subject}
                  </span>
                </div>
                <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedNote.content}
                </div>

                {selectedNote.attachmentUrl && (
                  <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-teal-50 p-1.5 text-teal-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs">
                        {lang === "bn" ? "সংযুক্ত স্টাডি ফাইল" : "Attached Study File"}: <span className="font-medium text-slate-600">{selectedNote.attachmentName || (selectedNote.attachmentType === "pdf" ? "Document.pdf" : "Image.jpg")}</span>
                      </h4>
                    </div>

                    {selectedNote.attachmentType === "pdf" ? (
                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-[500px]">
                        <iframe
                          src={selectedNote.attachmentUrl}
                          title={selectedNote.attachmentName || "Attached PDF"}
                          className="w-full h-full"
                          frameBorder="0"
                        ></iframe>
                      </div>
                    ) : selectedNote.attachmentType === "image" ? (
                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex justify-center p-2">
                        <img
                          src={selectedNote.attachmentUrl}
                          alt={selectedNote.attachmentName || "Attached Image"}
                          className="max-h-[600px] object-contain rounded-lg"
                        />
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: 2. AI Summary */}
            {activeStudyTab === "summary" && (
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    {lang === "bn" ? "জেমিনি এআই সারাংশ ইঞ্জিন" : "Gemini AI Summary Engine"}
                  </h3>
                  {!selectedNote.summaryPoints && (
                    <span className="text-2xs text-slate-500">
                      {lang === "bn" ? "সারাংশ করা হয়নি" : "Unsummarized"}
                    </span>
                  )}
                </div>

                {isLoadingAI ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
                    <p className="text-xs text-slate-500 font-semibold animate-pulse">
                      {lang === "bn" ? "নোট বিশ্লেষণ করা হচ্ছে এবং সারাংশ তৈরি করা হচ্ছে..." : "Analyzing note & preparing bullet summary..."}
                    </p>
                  </div>
                ) : selectedNote.summaryPoints ? (
                  <div className="space-y-4">
                    {/* Tags */}
                    {selectedNote.tags && (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedNote.tags.map((tag) => (
                          <span key={tag} className="text-2xs font-semibold bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-100">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bullet summary */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs text-slate-800">
                        {lang === "bn" ? "মূল বক্তব্যসমূহ" : "Key Takeaways"}
                      </h4>
                      <div className="space-y-2">
                        {selectedNote.summaryPoints.map((pt, idx) => (
                          <div key={idx} className="flex gap-2.5 items-start p-2 rounded-lg hover:bg-slate-50">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"></span>
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">{pt}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => onTriggerSummary(selectedNote)}
                      className="mt-2 inline-flex items-center gap-1.5 text-3xs font-semibold text-amber-700 hover:underline cursor-pointer"
                    >
                      <RefreshCw className="h-3 w-3" /> {lang === "bn" ? "সারাংশ পুনরায় তৈরি করুন" : "Regenerate Summary"}
                    </button>
                  </div>
                ) : (
                  <div className="py-10 text-center space-y-4">
                    <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                      {lang === "bn" ? "জেমিনি এআই মডেল ব্যবহার করে তাৎক্ষণিকভাবে এই নোটের সংক্ষিপ্ত সারাংশ তৈরি করুন।" : "Construct concise key study notes summaries instantly using Gemini AI models."}
                    </p>
                    <button
                      onClick={() => onTriggerSummary(selectedNote)}
                      id="btn-generate-summary"
                      className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 shadow-sm cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {lang === "bn" ? "নোটের সারাংশ তৈরি করুন" : "Summarize Note"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: 3. Flashcards */}
            {activeStudyTab === "flashcards" && (
              <div className="space-y-4">
                {isLoadingAI ? (
                  <div className="rounded-xl border border-slate-100 bg-white p-12 text-center space-y-3">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
                    <p className="text-xs text-slate-500 font-semibold animate-pulse">
                      {lang === "bn" ? "ধারণাগুলো বের করা হচ্ছে এবং ফ্ল্যাশকার্ড তৈরি করা হচ্ছে..." : "Extracting concepts & building flashcards..."}
                    </p>
                  </div>
                ) : selectedNote.flashcards && selectedNote.flashcards.length > 0 ? (
                  <div className="space-y-4">
                    {/* Interactive Flip Card */}
                    <div 
                      onClick={() => setIsFlipped(!isFlipped)}
                      id="study-flashcard"
                      className={`relative min-h-[180px] w-full rounded-2xl border cursor-pointer p-6 flex flex-col justify-between transition-all duration-300 ${
                        isFlipped 
                          ? "bg-indigo-600 border-indigo-700 text-white shadow-md transform rotate-1"
                          : "bg-white border-slate-200 text-slate-800 shadow-xs hover:border-indigo-300 hover:shadow-sm"
                      }`}
                    >
                      {/* Side indicator badge */}
                      <span className={`inline-block self-start rounded-md px-1.5 py-0.5 text-5xs font-extrabold uppercase tracking-widest ${
                        isFlipped ? "bg-white/20 text-indigo-100" : "bg-indigo-50 text-indigo-700"
                      }`}>
                        {isFlipped 
                          ? (lang === "bn" ? "পেছন (উত্তর)" : "Back (Answer)") 
                          : (lang === "bn" ? "সামনে (প্রশ্ন)" : "Front (Question)")}
                      </span>

                      {/* Card Content text */}
                      <div className="my-auto py-4 text-center">
                        <p className={`font-bold transition-all text-sm md:text-base leading-relaxed ${isFlipped ? "text-indigo-50" : "text-slate-800"}`}>
                          {isFlipped 
                            ? selectedNote.flashcards[currentFlashcardIndex].back 
                            : selectedNote.flashcards[currentFlashcardIndex].front
                          }
                        </p>
                      </div>

                      {/* Click helper hint footer */}
                      <span className={`text-center text-5xs font-medium uppercase tracking-widest ${
                        isFlipped ? "text-indigo-200/80" : "text-slate-400"
                      }`}>
                        {lang === "bn" ? "কার্ডটি উল্টাতে ক্লিক করুন" : "Click to Flip Card"}
                      </span>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        {lang === "bn" 
                          ? `কার্ড ${currentFlashcardIndex + 1} / ${selectedNote.flashcards.length}` 
                          : `Card ${currentFlashcardIndex + 1} of ${selectedNote.flashcards.length}`}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={currentFlashcardIndex === 0}
                          onClick={() => {
                            setCurrentFlashcardIndex(prev => prev - 1);
                            setIsFlipped(false);
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                        >
                          {lang === "bn" ? "পূর্ববর্তী" : "Prev"}
                        </button>
                        <button
                          disabled={currentFlashcardIndex === selectedNote.flashcards.length - 1}
                          onClick={() => {
                            setCurrentFlashcardIndex(prev => prev + 1);
                            setIsFlipped(false);
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                        >
                          {lang === "bn" ? "পরবর্তী" : "Next"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-100 bg-white p-10 text-center space-y-4">
                    <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                      {lang === "bn" ? "এই নোটের জন্য কোনো ফ্ল্যাশকার্ড নেই।" : "No flashcards generated for this note."}
                    </p>
                    <button
                      onClick={() => onTriggerFlashcards(selectedNote)}
                      id="btn-generate-flashcards-empty"
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm cursor-pointer"
                    >
                      <Layers className="h-3.5 w-3.5" />
                      {lang === "bn" ? "ফ্ল্যাশকার্ড তৈরি করুন" : "Generate Flashcards"}
                    </button>
                  </div>
                )}
              </div>
            )}
            </motion.div>
          </AnimatePresence>
        </div>
        ) : (
          /* NO NOTE SELECTED FALLBACK DISPLAY */
          <div className="hidden md:block rounded-xl border border-dashed border-slate-200 p-12 text-center bg-white space-y-4">
            <div className="mx-auto rounded-full bg-teal-50 p-3 text-teal-600 h-12 w-12 flex items-center justify-center">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="max-w-xs mx-auto space-y-1.5">
              <h3 className="font-bold text-slate-800 text-sm">
                {lang === "bn" ? "স্টাডি নোট ওয়ার্কস্টেশন" : "Study Note Workstation"}
              </h3>
              <p className="text-xs text-slate-500">
                {role === "Admin"
                  ? (lang === "bn" ? "ফ্ল্যাশকার্ড তৈরি করতে বাম পাশের লাইব্রেরি থেকে যেকোনো স্টাডি নোট সিলেক্ট করুন অথবা সম্পূর্ণ নতুন নোট যোগ করুন!" : "Select a study note on the left sidebar to generate flashcards, or write a brand new note to begin!")
                  : (lang === "bn" ? "বাম পাশের লাইব্রেরি থেকে যেকোনো স্টাডি নোট সিলেক্ট করে সেটির সারসংক্ষেপ বা ফ্ল্যাশকার্ড দিয়ে পড়াশোনা শুরু করুন!" : "Select a curated study note from the left sidebar library to generate custom summaries or interactive flashcards!")}
              </p>
            </div>
            {role === "Admin" && (
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" /> {lang === "bn" ? "নতুন স্টাডি নোট লিখুন" : "Write New Study Note"}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
