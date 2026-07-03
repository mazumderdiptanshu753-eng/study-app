import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeConfig } from "../lib/themes";
import { Language } from "../lib/translations";
import { Radio, Calendar, Clock, Video, Plus, X, Trash2, Edit2, PlayCircle, Users, CheckSquare 
} from "lucide-react";
import { UserProfile } from "../types";

interface LiveClass {
  id: string;
  title: string;
  subject: string;
  instructor: string;
  scheduledTime: string;
  link: string;
  status: "Scheduled" | "Live" | "Completed";
  createdAt: string;
}

interface LiveClassesProps {
  theme: ThemeConfig;
  lang: Language;
  profile: UserProfile | null;
  onBack: () => void;
}

export default function LiveClasses({ theme, lang, profile, onBack }: LiveClassesProps) {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [instructor, setInstructor] = useState(profile?.fullName || "");
  const [scheduledTime, setScheduledTime] = useState("");
  const [link, setLink] = useState("");

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/live-classes");
      const data = await res.json();
      if (Array.isArray(data)) {
        setClasses(data);
      }
    } catch (err) {
      console.error("Failed to fetch classes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreate = async () => {
    if (!title.trim() || !link.trim() || !scheduledTime) return;
    try {
      const res = await fetch("/api/live-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, subject, instructor, scheduledTime, link, status: "Scheduled"
        })
      });
      if (res.ok) {
        setIsCreating(false);
        setTitle("");
        setSubject("");
        setLink("");
        setScheduledTime("");
        fetchClasses();
      }
    } catch (err) {
      console.error("Failed to create class", err);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/live-classes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchClasses();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/live-classes/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchClasses();
      }
    } catch (err) {
      console.error("Failed to delete class", err);
    }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString(lang === "bn" ? "bn-IN" : "en-IN", {
        weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live": return "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border-rose-500 animate-pulse";
      case "Completed": return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-400";
      default: return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto w-full"
    >
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`p-2 rounded-full border ${theme.borderCard} ${theme.bgCard} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
          >
            <X className={`h-5 w-5 ${theme.textHeading}`} />
          </button>
          <div>
            <h2 className={`text-2xl font-black ${theme.textHeading} flex items-center gap-2`}>
              <Radio className="h-6 w-6 text-rose-500" />
              {lang === "bn" ? "অনলাইন লাইভ ক্লাস" : "Online Live Classes"}
            </h2>
            <p className={`text-sm ${theme.textMuted} mt-1`}>
              {lang === "bn" ? "Google Meet বা YouTube এর মাধ্যমে সরাসরি ক্লাসে যুক্ত হোন" : "Join live classes directly via Google Meet or YouTube"}
            </p>
          </div>
        </div>
        {profile?.role === "Admin" && (
          <button
            onClick={() => setIsCreating(true)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95 ${theme.primaryBtn} ${theme.primaryBtnText}`}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{lang === "bn" ? "ক্লাস যোগ করুন" : "Schedule Class"}</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <AnimatePresence>
            {classes.map((cls) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-2xl border ${theme.borderCard} ${theme.bgCard} overflow-hidden shadow-sm flex flex-col`}
              >
                <div className={`p-5 flex-1`}>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(cls.status)}`}>
                      {cls.status === "Live" && <Radio className="h-3 w-3 inline mr-1" />}
                      {cls.status}
                    </span>
                    {profile?.role === "Admin" && (
                      <div className="flex gap-2">
                        {cls.status === "Scheduled" && (
                          <button onClick={() => handleUpdateStatus(cls.id, "Live")} className={`p-1.5 rounded-md bg-rose-100 text-rose-600 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-400`} title="Go Live">
                            <PlayCircle className="h-4 w-4" />
                          </button>
                        )}
                        {cls.status === "Live" && (
                          <button onClick={() => handleUpdateStatus(cls.id, "Completed")} className={`p-1.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400`} title="Mark Completed">
                            <CheckSquare className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => handleDelete(cls.id)} className={`p-1.5 rounded-md bg-slate-100 text-slate-400 hover:text-red-500 dark:bg-slate-800 transition-colors`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <h3 className={`text-lg font-black ${theme.textHeading} mb-2 leading-tight`}>{cls.title}</h3>
                  <div className="space-y-2 mt-4">
                    <div className={`flex items-center gap-2 text-sm font-medium ${theme.textMuted}`}>
                      <Users className="h-4 w-4 shrink-0" />
                      <span>{cls.subject} • {cls.instructor}</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm font-medium ${theme.textMuted}`}>
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>{formatDateTime(cls.scheduledTime)}</span>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 border-t ${theme.borderCard} bg-slate-50/50 dark:bg-slate-900/30`}>
                  {cls.status === "Completed" ? (
                    <button disabled className={`w-full py-2.5 rounded-xl font-bold text-sm bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed`}>
                      {lang === "bn" ? "ক্লাস শেষ হয়েছে" : "Class Completed"}
                    </button>
                  ) : (
                    <a
                      href={cls.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full text-center py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${cls.status === "Live" ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 animate-pulse' : `${theme.primaryBtn} ${theme.primaryBtnText}`}`}
                    >
                      {cls.status === "Live" ? (lang === "bn" ? "লাইভ ক্লাসে যুক্ত হোন" : "Join Live Class") : (lang === "bn" ? "লিংকটি সেভ করুন" : "Save Class Link")}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {classes.length === 0 && (
            <div className={`col-span-1 sm:col-span-2 text-center py-16 ${theme.textMuted}`}>
              <Video className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="font-bold text-lg">{lang === "bn" ? "কোনো ক্লাস শিডিউল করা নেই" : "No scheduled classes"}</p>
            </div>
          )}
        </div>
      )}

      {/* Create Class Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-md ${theme.bgCard} rounded-3xl shadow-2xl p-6 border ${theme.borderCard} z-10 max-h-[90vh] overflow-y-auto`}
            >
              <h3 className={`text-xl font-black ${theme.textHeading} mb-4 flex items-center gap-2`}>
                <Radio className="h-5 w-5 text-rose-500" />
                {lang === "bn" ? "নতুন ক্লাস শিডিউল করুন" : "Schedule New Class"}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-bold ${theme.textHeading} mb-1.5`}>Class Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={`w-full p-3 rounded-xl border ${theme.borderCard} bg-white dark:bg-slate-950 ${theme.textMain} font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/50`} placeholder="e.g. Current Affairs Masterclass" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-bold ${theme.textHeading} mb-1.5`}>Subject/Topic</label>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className={`w-full p-3 rounded-xl border ${theme.borderCard} bg-white dark:bg-slate-950 ${theme.textMain} font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/50`} placeholder="e.g. General Knowledge" />
                  </div>
                  <div>
                    <label className={`block text-sm font-bold ${theme.textHeading} mb-1.5`}>Instructor</label>
                    <input type="text" value={instructor} onChange={(e) => setInstructor(e.target.value)} className={`w-full p-3 rounded-xl border ${theme.borderCard} bg-white dark:bg-slate-950 ${theme.textMain} font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/50`} />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-bold ${theme.textHeading} mb-1.5`}>Date & Time</label>
                  <input type="datetime-local" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className={`w-full p-3 rounded-xl border ${theme.borderCard} bg-white dark:bg-slate-950 ${theme.textMain} font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/50`} />
                </div>
                <div>
                  <label className={`block text-sm font-bold ${theme.textHeading} mb-1.5`}>Meeting Link (Google Meet / YouTube)</label>
                  <input type="url" value={link} onChange={(e) => setLink(e.target.value)} className={`w-full p-3 rounded-xl border ${theme.borderCard} bg-white dark:bg-slate-950 ${theme.textMain} font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/50`} placeholder="https://meet.google.com/..." />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setIsCreating(false)} className={`flex-1 py-3 rounded-xl font-bold border ${theme.borderCard} ${theme.textMain} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}>Cancel</button>
                <button onClick={handleCreate} disabled={!title.trim() || !link.trim() || !scheduledTime} className={`flex-1 py-3 rounded-xl font-bold text-white transition-all ${title.trim() && link.trim() && scheduledTime ? 'bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-md cursor-pointer' : 'bg-rose-400 dark:bg-rose-800 cursor-not-allowed opacity-70'}`}>Schedule</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
