import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, User, Clock, Send, MessageSquare, Plus, FileText, Trash2, ArrowLeft } from 'lucide-react';
import { ThemeConfig } from '../lib/themes';
import { Language } from '../lib/translations';

interface GovtJobNote {
  id: string;
  title: string;
  content: string;
  subject: string;
  timestamp: string;
  authorEmail: string;
  authorName: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  authorName: string;
  authorEmail: string;
  text: string;
  timestamp: string;
}

interface GovtJobNotesProps {
  theme: ThemeConfig;
  lang: Language;
  profile: any;
  initialSubject?: string;
}

const SUBJECTS = [
  { id: "math", name_bn: "অঙ্ক (Math)", name_en: "Mathematics" },
  { id: "reasoning", name_bn: "রিজনিং (Reasoning)", name_en: "Reasoning" },
  { id: "english", name_bn: "ইংরেজি (English)", name_en: "English" },
  { id: "science", name_bn: "সাধারণ বিজ্ঞান", name_en: "General Science" },
  { id: "history", name_bn: "ইতিহাস", name_en: "History" },
  { id: "geography", name_bn: "ভূগোল", name_en: "Geography" },
  { id: "polity", name_bn: "সংবিধান (Polity)", name_en: "Polity" },
  { id: "economics", name_bn: "অর্থনীতি (Economics)", name_en: "Economics" }
];

export default function GovtJobNotes({ theme, lang, profile, initialSubject }: GovtJobNotesProps) {
  const [activeSubject, setActiveSubject] = useState(initialSubject || "math");
  const [notes, setNotes] = useState<GovtJobNote[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const isBengali = lang === "bn";
  const isAdmin = profile?.role === "Admin";

  const fetchNotes = async (subject: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/govt-job-notes?subject=${subject}`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(activeSubject);
  }, [activeSubject]);

  useEffect(() => {
    const handleSetSubject = (e: any) => {
      setActiveSubject(e.detail);
      fetchNotes(e.detail);
    };
    window.addEventListener("setGovtJobSubject", handleSetSubject);
    return () => window.removeEventListener("setGovtJobSubject", handleSetSubject);
  }, []);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const response = await fetch('/api/govt-job-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          subject: activeSubject,
          authorEmail: profile?.email || 'admin@studyhub',
          authorName: profile?.fullName || 'Admin'
        })
      });

      if (response.ok) {
        setIsCreating(false);
        setNewTitle("");
        setNewContent("");
        fetchNotes(activeSubject);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async (noteId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await fetch(`/api/govt-job-notes/${noteId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorEmail: profile?.email || 'student@studyhub',
          authorName: profile?.fullName || 'Student',
          text: commentText
        })
      });

      if (response.ok) {
        setCommentText("");
        fetchNotes(activeSubject);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm(isBengali ? "আপনি কি এই নোটটি মুছতে চান?" : "Are you sure you want to delete this note?")) return;
    try {
      const response = await fetch(`/api/govt-job-notes/${noteId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchNotes(activeSubject);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Subject Selector */}
      <div className={`${theme.bgCard} rounded-2xl border ${theme.borderCard} p-6 shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white ${theme.primaryBtn}`}>
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${theme.textHeading}`}>
                {isBengali ? "সরকারি চাকরি প্রস্তুতি" : "Govt Job Preparation"}
              </h1>
              <p className={`text-sm ${theme.textMuted}`}>
                {isBengali ? "অ্যাডমিনদের দেওয়া স্পেশাল নোটস পড়ুন এবং আলোচনা করুন" : "Read special notes provided by admins and discuss"}
              </p>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsCreating(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold transition-all active:scale-95 shadow-md ${theme.primaryBtn} hover:opacity-90`}
            >
              <Plus className="h-4 w-4" />
              {isBengali ? "নতুন নোট আপলোড করুন" : "Upload New Note"}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map(subj => (
            <button
              key={subj.id}
              onClick={() => setActiveSubject(subj.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubject === subj.id 
                  ? `${theme.primaryBtn} text-white shadow-md` 
                  : `${theme.isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'} border`
              }`}
            >
              {isBengali ? subj.name_bn : subj.name_en}
            </button>
          ))}
        </div>
      </div>

      {/* Note Creation Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={`${theme.bgCard} rounded-2xl border ${theme.borderCard} p-6 shadow-sm mb-6`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold ${theme.textHeading}`}>
                  {isBengali ? "নতুন নোট তৈরি করুন" : "Create New Note"}
                </h2>
                <button
                  onClick={() => setIsCreating(false)}
                  className={`flex items-center gap-1 text-sm font-semibold ${theme.textMuted} hover:${theme.textMain}`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  {isBengali ? "বাতিল" : "Cancel"}
                </button>
              </div>
              <form onSubmit={handleCreateNote} className="space-y-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme.textMuted}`}>
                    {isBengali ? "শিরোনাম" : "Title"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className={`w-full rounded-xl border ${theme.isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200'} px-4 py-3 text-sm focus:outline-none focus:border-teal-500`}
                    placeholder={isBengali ? "নোটের শিরোনাম..." : "Note title..."}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme.textMuted}`}>
                    {isBengali ? "নোটের বিস্তারিত বিষয়বস্তু" : "Note Content"}
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className={`w-full rounded-xl border ${theme.isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200'} px-4 py-3 text-sm focus:outline-none focus:border-teal-500`}
                    placeholder={isBengali ? "বিস্তারিত লিখুন..." : "Write details..."}
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition-all active:scale-95 shadow-md ${theme.primaryBtn}`}
                  >
                    <Send className="h-4 w-4" />
                    {isBengali ? "আপলোড করুন" : "Publish Note"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="h-8 w-8 rounded-full border-4 border-teal-500/30 border-t-teal-500 animate-spin"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className={`text-center py-12 ${theme.bgCard} rounded-2xl border ${theme.borderCard}`}>
            <FileText className={`h-12 w-12 mx-auto ${theme.textMuted} opacity-50 mb-3`} />
            <p className={`text-sm font-semibold ${theme.textMuted}`}>
              {isBengali ? "এই বিষয়ে এখনও কোনো নোট আপলোড করা হয়নি।" : "No notes uploaded for this subject yet."}
            </p>
          </div>
        ) : (
          notes.map(note => (
            <div key={note.id} className={`${theme.bgCard} rounded-2xl border ${theme.borderCard} overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
              {/* Note Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-lg font-bold ${theme.textHeading} mb-2`}>{note.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${theme.isDark ? 'bg-slate-800 text-teal-400' : 'bg-teal-50 text-teal-700'}`}>
                        <User className="h-3 w-3" />
                        {note.authorName}
                      </span>
                      <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${theme.textMuted}`}>
                        <Clock className="h-3 w-3" />
                        {new Date(note.timestamp).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className={`prose prose-sm max-w-none ${theme.isDark ? 'prose-invert text-slate-300' : 'text-slate-700'} whitespace-pre-wrap`}>
                  {note.content}
                </div>
              </div>

              {/* Comments Section Toggle */}
              <div className={`border-t ${theme.borderCard} bg-slate-50/50 dark:bg-slate-900/50`}>
                <button
                  onClick={() => setExpandedNoteId(expandedNoteId === note.id ? null : note.id)}
                  className={`w-full px-6 py-3 flex items-center justify-between text-xs font-bold ${theme.textMuted} hover:${theme.textHeading} transition-colors`}
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {isBengali ? "সমস্যা বা মন্তব্য" : "Doubts & Comments"} ({note.comments?.length || 0})
                  </span>
                  <span>{expandedNoteId === note.id ? (isBengali ? "লুকান" : "Hide") : (isBengali ? "দেখুন" : "Show")}</span>
                </button>

                {/* Comments List & Input */}
                <AnimatePresence>
                  {expandedNoteId === note.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 space-y-4">
                        {(note.comments || []).length > 0 ? (
                          <div className="space-y-3">
                            {note.comments.map(comment => (
                              <div key={comment.id} className={`p-3 rounded-xl ${theme.isDark ? 'bg-slate-800' : 'bg-white'} border ${theme.borderCard}`}>
                                <div className="flex items-center justify-between mb-2">
                                  <span className={`text-xs font-bold ${theme.textHeading}`}>{comment.authorName}</span>
                                  <span className={`text-[10px] ${theme.textMuted}`}>
                                    {new Date(comment.timestamp).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US')}
                                  </span>
                                </div>
                                <p className={`text-sm ${theme.textMain}`}>{comment.text}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className={`text-xs ${theme.textMuted}`}>
                              {isBengali ? "এখনও কোনো মন্তব্য নেই। প্রথম মন্তব্য করুন!" : "No comments yet. Be the first to comment!"}
                            </p>
                          </div>
                        )}

                        <form onSubmit={(e) => handleAddComment(note.id, e)} className="flex gap-2">
                          <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder={isBengali ? "আপনার সমস্যা বা প্রশ্ন লিখুন..." : "Write your doubt or question..."}
                            className={`flex-1 text-sm rounded-xl border ${theme.isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300'} px-4 py-2 focus:outline-none focus:border-teal-500`}
                          />
                          <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className={`px-4 py-2 rounded-xl text-white transition-all disabled:opacity-50 ${theme.primaryBtn}`}
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
