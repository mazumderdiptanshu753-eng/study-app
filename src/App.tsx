import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { 
  BookOpen, 
  GraduationCap, 
  Sparkles,
  Github,
  Compass,
  Laptop,
  CheckCircle,
  BrainCircuit,
  MessageSquareShare,
  MessageSquare,
  LogOut,
  Video,
  Shield,
  RefreshCcw,
  Download,
  Radio
} from "lucide-react";
import Dashboard from "./components/Dashboard";
import NotesManager from "./components/NotesManager";
import SupportChat from "./components/SupportChat";
import StudentRegistration from "./components/StudentRegistration";
import AppLogo from "./components/AppLogo";
import WelcomePage from "./components/WelcomePage";
import SplashScreen from "./components/SplashScreen";
import VideoPortal from "./components/VideoPortal";
import AdminPanel from "./components/AdminPanel";
import GeneralKnowledgePage from "./components/GeneralKnowledgePage";
import CommunityForum from "./components/CommunityForum";
import LiveClasses from "./components/LiveClasses";
import GovtJobNotes from "./components/GovtJobNotes";
import AIStudyAssistant from "./components/AIStudyAssistant";
import { StudyNote, UserStats, Subject, GradeLevel, StudentProfile } from "./types";
import { Language, TRANSLATIONS } from "./lib/translations";
import { ThemeId, THEMES } from "./lib/themes";
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./lib/firebase";

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("app_lang");
    return (saved as Language) || "en";
  });

  const [themeId, setThemeId] = useState<ThemeId>(() => {
    const saved = localStorage.getItem("app_theme");
    return (saved as ThemeId) || "emerald";
  });

  const theme = THEMES[themeId];

  const t = TRANSLATIONS[lang];

  // Users State containing all registered members
  const [users, setUsers] = useState<StudentProfile[]>(() => {
    const local = localStorage.getItem("registered_users");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        // ignore
      }
    }
    // Preload sample students to make admin list view useful immediately
    const preloaded: StudentProfile[] = [];
    localStorage.setItem("registered_users", JSON.stringify(preloaded));
    return preloaded;
  });

  

  const [profile, setProfile] = useState<StudentProfile | null>(() => {
    const local = localStorage.getItem("student_profile");
    if (!local) return null;
    try {
      const parsed = JSON.parse(local);
      if (parsed) {
        // Look up role in the registered users list in case it got changed
        const localUsers = localStorage.getItem("registered_users");
        if (localUsers) {
          const allUsers = JSON.parse(localUsers) as StudentProfile[];
          const found = allUsers.find(u => (u?.email || "").trim().toLowerCase() === (parsed?.email || "").trim().toLowerCase());
          if (found) {
            parsed.role = found.role;
            parsed.avatarUrl = found.avatarUrl;
          }
        } else {
          const isUserAdmin = (parsed?.email || "").trim().toLowerCase() === "mazumderdiptanshu753@gmail.com";
          parsed.role = isUserAdmin ? "Admin" : "Student";
          parsed.avatarUrl = isUserAdmin ? "👑" : (parsed.avatarUrl || "🎓");
        }
        localStorage.setItem("student_profile", JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      return null;
    }
  });

  const [hasStartedWelcome, setHasStartedWelcome] = useState<boolean>(false);
  const [currentTab, _setCurrentTab] = useState<"dashboard" | "notes" | "chat" | "aiAssistant" | "videos" | "admin" | "gk" | "forum" | "liveClasses" | "govtJobNotes">("dashboard");
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [selectedGovtJobSubject, setSelectedGovtJobSubject] = useState<string>("math");

  useEffect(() => {
    const handleSetSubject = (e: any) => {
      setSelectedGovtJobSubject(e.detail);
    };
    window.addEventListener("setGovtJobSubject", handleSetSubject);
    return () => window.removeEventListener("setGovtJobSubject", handleSetSubject);
  }, []);

  // Load users from central backend API
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        localStorage.setItem("registered_users", JSON.stringify(data));
        
        // Also update local profile if role has changed on backend
        if (profile) {
          const matched = data.find((u: StudentProfile) => (u?.email || "").trim().toLowerCase() === (profile?.email || "").trim().toLowerCase());
          if (matched && (matched.role !== profile.role || matched.avatarUrl !== profile.avatarUrl)) {
            const updatedProfile = { ...profile, role: matched.role, avatarUrl: matched.avatarUrl };
            setProfile(updatedProfile);
            localStorage.setItem("student_profile", JSON.stringify(updatedProfile));
          }
        }
      }
    } catch (e) {
      console.warn("Failed to fetch users (transient network or server restart):", e);
    }
  };

  useEffect(() => {
    fetchUsers();
    // Poll every 5 seconds for real-time registration visibility
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, [profile?.email]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme.isDark);
  }, [theme.isDark]);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);
    return () => clearTimeout(splashTimer);
  }, []);

  const setCurrentTab = (tab: "dashboard" | "notes" | "chat" | "aiAssistant" | "videos" | "admin" | "gk" | "forum" | "liveClasses" | "govtJobNotes") => {
    setIsPageLoading(true);
    setTimeout(() => {
      _setCurrentTab(tab);
      setIsPageLoading(false);
    }, 300);
  };
  
  // App States initialized with preloaded educational notes or sync from Firestore
  const [notes, setNotes] = useState<StudyNote[]>(() => {
    const local = localStorage.getItem("study_notes");
    if (local) return JSON.parse(local);
    return [];
  });

  const [selectedNote, setSelectedNote] = useState<StudyNote | null>(null);

  // Dynamic video counts loaded from local storage
  const [videosCount, setVideosCount] = useState<number>(() => {
    try {
      const local = localStorage.getItem("video_lectures");
      if (local) {
        return JSON.parse(local).length;
      }
    } catch (e) {}
    return 0; // Default number of PRELOADED_VIDEOS is 0
  });

  // Loading indicator for AI tasks
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Sync personal study notes with Firestore real-time database when student is logged in
  useEffect(() => {
    if (!profile?.email) {
      // Fallback to local storage if not logged in
      const local = localStorage.getItem("study_notes");
      if (local) {
        try {
          setNotes(JSON.parse(local));
        } catch (e) {
          setNotes([]);
        }
      } else {
        setNotes([]);
      }
      return;
    }

    const email = profile.email.trim().toLowerCase();
    const path = "notes";
    const notesQuery = query(
      collection(db, path),
      where("userEmail", "==", email),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      notesQuery,
      (snapshot) => {
        const fetchedNotes = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
          } as StudyNote;
        });
        setNotes(fetchedNotes);
        localStorage.setItem("study_notes", JSON.stringify(fetchedNotes));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => unsubscribe();
  }, [profile?.email]);

  // Sync to local storage for local offline persistence fallback
  useEffect(() => {
    localStorage.setItem("study_notes", JSON.stringify(notes));
  }, [notes]);

  // Redirect to dashboard if a non-admin gets to the admin tab
  useEffect(() => {
    if (currentTab === "admin" && (!profile || profile.role !== "Admin")) {
      _setCurrentTab("dashboard");
    }
  }, [currentTab, profile]);

  // Save or update manually written note or AI updated fields
  const handleSaveNote = async (noteData: Omit<StudyNote, "id" | "timestamp"> & { id?: string; timestamp?: string }) => {
    const isNew = !noteData.id;
    const noteId = noteData.id || `note-${Date.now()}`;
    const timestamp = noteData.timestamp || new Date().toISOString();
    
    const finalNote: StudyNote = {
      ...noteData,
      id: noteId,
      timestamp: timestamp,
    };

    if (profile?.email) {
      const path = `notes/${noteId}`;
      const payload = {
        ...finalNote,
        userEmail: profile.email.trim().toLowerCase()
      };
      try {
        await setDoc(doc(db, "notes", noteId), payload, { merge: true });
        setSelectedNote(finalNote);
      } catch (error) {
        handleFirestoreError(error, isNew ? OperationType.CREATE : OperationType.UPDATE, path);
      }
    } else {
      if (isNew) {
        setNotes(prev => [finalNote, ...prev]);
      } else {
        setNotes(prev => prev.map(n => n.id === noteId ? finalNote : n));
      }
      setSelectedNote(finalNote);
    }
  };

  // Delete note from Firestore/local storage
  const handleDeleteNote = async (id: string) => {
    if (profile?.email) {
      const path = `notes/${id}`;
      try {
        await deleteDoc(doc(db, "notes", id));
        if (selectedNote?.id === id) {
          setSelectedNote(null);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    } else {
      setNotes(prev => prev.filter(n => n.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
    }
  };

  // Handle AI Note Summarizer API and sync to cloud
  const handleTriggerSummary = async (note: StudyNote) => {
    setIsLoadingAI(true);
    try {
      const response = await fetch("/api/summarize-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: note.title, content: note.content })
      });

      if (!response.ok) {
        throw new Error("Failed to summarize note");
      }

      const result = await response.json();
      
      const updatedNote: StudyNote = {
        ...note,
        summaryPoints: result.summaryPoints,
        tags: result.tags
      };

      await handleSaveNote(updatedNote);
    } catch (e: any) {
      console.error(e);
      alert(`Failed to summarize: ${e.message}`);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Handle AI Flashcard Generation API and sync to cloud
  const handleTriggerFlashcards = async (note: StudyNote) => {
    setIsLoadingAI(true);
    try {
      const response = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: note.title, content: note.content })
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const result = await response.json();
      
      const updatedNote: StudyNote = {
        ...note,
        flashcards: result.flashcards
      };

      await handleSaveNote(updatedNote);
    } catch (e: any) {
      console.error(e);
      alert(`Failed to build cards: ${e.message}`);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const recordActivityLog = async (action: "Login" | "Logout", userProfile: StudentProfile) => {
    try {
      await fetch("/api/activity-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: userProfile.email,
          userName: userProfile.fullName,
          action: action,
          timestamp: new Date().toISOString()
        })
      });
    } catch (e) {
      console.error("Failed to record activity log", e);
    }
  };

  const handleRegister = async (newProfile: StudentProfile) => {
    // If we have existing user records, make sure roles are preserved correctly
    const existingUser = users.find(u => (u?.email || "").trim().toLowerCase() === (newProfile?.email || "").trim().toLowerCase());
    if (existingUser && existingUser.role === "Admin") {
      newProfile.role = "Admin";
      newProfile.avatarUrl = "👑";
    }

    // Explicitly grant Admin role to the main user email
    if ((newProfile?.email || "").trim().toLowerCase() === "mazumderdiptanshu753@gmail.com") {
      newProfile.role = "Admin";
      newProfile.avatarUrl = "👑";
    }

    setProfile(newProfile);
    localStorage.setItem("student_profile", JSON.stringify(newProfile));
    
    // Log login activity
    recordActivityLog("Login", newProfile);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfile)
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        localStorage.setItem("registered_users", JSON.stringify(data));
      }
    } catch (e) {
      console.error("Failed to register user to central backend:", e);
    }
  };

  const handleToggleAdminRole = async (email: string) => {
    const targetUser = users.find(user => (user?.email || "").trim().toLowerCase() === (email || "").trim().toLowerCase());
    if (!targetUser) return;

    const newRole = targetUser.role === "Admin" ? "Student" : "Admin";
    const updatedUser = {
      ...targetUser,
      role: newRole,
      avatarUrl: newRole === "Admin" ? "👑" : "🎓"
    };

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser)
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        localStorage.setItem("registered_users", JSON.stringify(data));

        // If the modified user is the currently logged in user, update their active profile too!
        if (profile && (profile.email || "").trim().toLowerCase() === (email || "").trim().toLowerCase()) {
          const updatedSelf = data.find((u: StudentProfile) => (u?.email || "").trim().toLowerCase() === (email || "").trim().toLowerCase());
          if (updatedSelf) {
            setProfile(updatedSelf);
            localStorage.setItem("student_profile", JSON.stringify(updatedSelf));
          }
        }
      }
    } catch (e) {
      console.error("Failed to toggle admin role on backend:", e);
    }
  };

  const handleDeleteUser = async (email: string) => {
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        localStorage.setItem("registered_users", JSON.stringify(data));
      }
    } catch (e) {
      console.error("Failed to delete user on central backend:", e);
    }
  };

  const handleLogout = () => {
    if (profile) {
      recordActivityLog("Logout", profile);
    }
    setProfile(null);
    localStorage.removeItem("student_profile");
    setHasStartedWelcome(false);
  };

  const handleLanguageChange = (selected: Language) => {
    setLang(selected);
    localStorage.setItem("app_lang", selected);
  };

  // Compute calculated statistics summary
  const stats: UserStats = {
    doubtsSolved: 0,
    notesCreated: notes.length,
    studyMinutes: 0,
    videosUploaded: videosCount
  };

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" theme={theme} lang={lang} />
      ) : (!profile && !hasStartedWelcome) ? (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="min-h-[100dvh] w-full flex flex-col"
        >
          <WelcomePage theme={theme} 
            lang={lang}
            onLanguageChange={handleLanguageChange}
            onStart={() => {
              setHasStartedWelcome(true);
            }} 
          />
        </motion.div>
      ) : (
        <motion.div
          key="main-app"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`min-h-[100dvh] flex flex-col ${theme.bgPage} ${theme.isDark ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0b0f19] to-black" : "bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"} ${theme.textMain} font-sans antialiased transition-colors duration-300`}
        >
          {/* Visual Navigation Header Banner */}
      <div className="fixed top-2 right-2 md:top-4 md:right-4 z-50 flex items-center justify-end pointer-events-none">
        <div className={`flex items-center gap-2 p-1.5 rounded-2xl border ${theme.borderCard} shadow-lg pointer-events-auto backdrop-blur-xl ${theme.isDark ? 'bg-slate-900/80' : 'bg-white/80'}`}>

          {/* Navigation link triggers */}
          

          {/* Theme & Language Selectors container */}
          <div className="flex items-center gap-1 sm:gap-1.5 ml-auto mr-1 sm:mr-3">
            
            <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-3xs">
              {(Object.keys(THEMES) as ThemeId[]).map((tid) => {
                const tConfig = THEMES[tid];
                const isActive = themeId === tid;
                return (
                  <button
                    key={tid}
                    onClick={() => {
                      setThemeId(tid);
                      localStorage.setItem("app_theme", tid);
                    }}
                    className={`w-6.5 h-6.5 flex items-center justify-center rounded text-2xs transition-all relative group cursor-pointer ${
                      isActive 
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-3xs scale-105" 
                        : "opacity-60 hover:opacity-100 text-slate-500 hover:bg-white/40 dark:hover:bg-slate-900/40"
                    }`}
                    title={lang === "bn" ? tConfig.nameBn : tConfig.nameEn}
                  >
                    <span>{tConfig.icon}</span>
                  </button>
                );
              })}
            </div>

            {/* Language Switcher Selector Choice */}
            <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-3xs">
              <button
                onClick={() => handleLanguageChange("en")}
                id="lang-switcher-en"
                className={`px-2 py-0.5 text-[10px] font-black rounded transition-all cursor-pointer ${
                  lang === "en"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-3xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange("bn")}
                id="lang-switcher-bn"
                className={`px-2 py-0.5 text-[10px] font-black rounded transition-all cursor-pointer ${
                  lang === "bn"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-3xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                BN
              </button>
            </div>
          </div>

          {/* User Profile Summary */}
          {profile ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-left leading-none max-w-[100px]">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-700 dark:text-slate-200 block truncate">
                    {profile.name}
                  </span>
                  {profile.role === "Admin" ? (
                    <span className="inline-flex items-center px-1 py-0.5 text-[8px] font-black tracking-wide rounded-sm bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase shrink-0">
                      {lang === "bn" ? "প্রশাসক" : "Admin"}
                    </span>
                  ) : (
                    <span className={`inline-flex items-center px-1 py-0.5 text-[8px] font-black tracking-wide rounded-sm ${theme.primaryBg} ${theme.primaryText} border ${theme.borderCard} uppercase shrink-0`}>
                      {lang === "bn" ? "শিক্ষার্থী" : "Student"}
                    </span>
                  )}
                </div>
                <span className="text-[10px] opacity-60 block truncate">{profile.email}</span>
              </div>
              
              <button
                onClick={handleLogout}
                id="header-btn-logout"
                className="ml-1 md:ml-2 flex items-center justify-center h-8 w-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 hover:text-rose-400 transition-all cursor-pointer shadow-3xs"
                title={lang === "bn" ? "লগ আউট" : "Sign Out"}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                G
              </div>
              <div className="text-left leading-none">
                <span className="font-semibold text-xs text-slate-500 dark:text-slate-400 block">
                  {lang === "bn" ? "নিবন্ধিত নয়" : "Not Registered"}
                </span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Main Content Area Container */}
      <main className={`flex-1 w-full mx-auto ${profile ? "max-w-7xl px-4 pt-16 md:pt-8 pb-32 sm:px-6" : "max-w-md px-2 py-4 flex items-center justify-center min-h-[calc(100vh-3rem)]"} relative touch-scroll`}>
        
        {!profile ? (
          <StudentRegistration lang={lang} onRegister={handleRegister} theme={theme} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab + (isPageLoading ? "-loading" : "")}
              initial={{ opacity: 0, scale: 0.98, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -5 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full min-h-full flex flex-col"
            >
              {isPageLoading ? (
                <div className="flex flex-col items-center justify-center h-[50vh]">
                  <div className={`h-12 w-12 rounded-full border-4 ${theme.borderCard} border-t-current animate-spin ${theme.textHeading}`} />
                  <p className={`mt-4 font-bold text-sm ${theme.textHeading} animate-pulse`}>
                    {lang === "bn" ? "লোড হচ্ছে..." : "Loading..."}
                  </p>
                </div>
              ) : (
              <>
              {currentTab === "dashboard" && (
                <Dashboard 
                  stats={stats} 
                  notes={notes}
                  onNavigate={(tab) => {
                    setCurrentTab(tab);
                    setSelectedNote(null);
                  }}
                  onSelectNote={(note) => {
                    setSelectedNote(note);
                    setCurrentTab("notes");
                  }}
                  lang={lang}
                  theme={theme}
                  role={profile?.role || "Student"}
                />
              )}
              {currentTab === "notes" && (
                <NotesManager 
                  notes={notes}
                  selectedNote={selectedNote}
                  onSelectNote={setSelectedNote}
                  onSaveNote={handleSaveNote}
                  onDeleteNote={handleDeleteNote}
                  onUpdateNoteAI={async (id, updates) => {
                    const original = notes.find(n => n.id === id);
                    if (original) {
                      await handleSaveNote({ ...original, ...updates });
                    }
                  }} 
                  isLoadingAI={isLoadingAI}
                  onTriggerSummary={handleTriggerSummary}
                  onTriggerFlashcards={handleTriggerFlashcards}
                  role={profile?.role || "Student"}
                  lang={lang}
                  theme={theme}
                />
              )}
              {currentTab === "chat" && (
                <SupportChat lang={lang} theme={theme} profile={profile} />
              )}
              {currentTab === "aiAssistant" && (
                <AIStudyAssistant lang={lang} theme={theme} />
              )}
              {currentTab === "videos" && (
                <VideoPortal 
                  lang={lang} 
                  theme={theme} 
                  profile={profile} 
                  onVideosCountChange={setVideosCount}
                />
              )}
              {currentTab === "admin" && profile.role === "Admin" && (
                <AdminPanel
                  lang={lang}
                  users={users}
                  onToggleAdminRole={handleToggleAdminRole}
                  onDeleteUser={handleDeleteUser}
                  currentUserEmail={profile.email}
                  theme={theme}
                />
              )}
              {currentTab === "liveClasses" && (
                <LiveClasses
                  lang={lang}
                  theme={theme}
                  profile={profile}
                  onBack={() => setCurrentTab("dashboard")}
                />
              )}
              {currentTab === "forum" && (
                <CommunityForum
                  lang={lang}
                  theme={theme}
                  profile={profile}
                  onBack={() => setCurrentTab("dashboard")}
                />
              )}
              {currentTab === "gk" && (
                <GeneralKnowledgePage
                  lang={lang}
                  theme={theme}
                  onBack={() => setCurrentTab("dashboard")}
                />
              )}
              {currentTab === "govtJobNotes" && (
                <GovtJobNotes
                  lang={lang}
                  theme={theme}
                  profile={profile}
                  initialSubject={selectedGovtJobSubject}
                  onBack={() => setCurrentTab("dashboard")}
                />
              )}
              </>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Humble Footer */}
        <footer className={`mt-20 pt-8 pb-32 md:pb-8 text-center text-xs ${theme.textMuted} font-semibold tracking-wide transition-colors duration-300`}>
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          </div>
        </footer>
      </main>

      {/* Mobile Sticky Bottom Bar Navigation */}
      {profile && (
        <div className="fixed bottom-4 left-4 right-4 z-50 pb-[env(safe-area-inset-bottom,0px)] flex justify-center pointer-events-none">
          <div className={`flex justify-around items-center w-full max-w-lg mx-auto h-16 px-2 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl pointer-events-auto ${theme.isDark ? 'bg-slate-900/80 border border-white/10' : 'bg-white/90 border border-black/5'}`}>
          <button
            onClick={() => setCurrentTab("dashboard")}
            className={`flex flex-col items-center justify-center w-20 h-full transition-all android-ripple ${
              currentTab === "dashboard"
                ? `${theme.primaryText} font-bold`
                : `${theme.textMuted} font-medium`
            }`}
          >
            <GraduationCap className="h-5 w-5 mb-1" style={{ color: currentTab === "dashboard" ? "currentColor" : "#94a3b8" }} />
            <span className="text-[10px] tracking-tight">
              {lang === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
            </span>
          </button>
 
          <button
            onClick={() => {
              setCurrentTab("notes");
              setSelectedNote(null);
            }}
            className={`flex flex-col items-center justify-center w-20 h-full transition-all android-ripple ${
              currentTab === "notes"
                ? `${theme.primaryText} font-bold`
                : `${theme.textMuted} font-medium`
            }`}
          >
            <BookOpen className="h-5 w-5 mb-1" style={{ color: currentTab === "notes" ? "currentColor" : "#94a3b8" }} />
            <span className="text-[10px] tracking-tight">
              {lang === "bn" ? "নোটস" : "Notes"}
            </span>
          </button>
 
          <button
            onClick={() => {
              setCurrentTab("aiAssistant");
              setSelectedNote(null);
            }}
            className={`flex flex-col items-center justify-center w-20 h-full transition-all android-ripple ${
              currentTab === "aiAssistant"
                ? `${theme.primaryText} font-bold`
                : `${theme.textMuted} font-medium`
            }`}
          >
            <Sparkles className="h-5 w-5 mb-1" style={{ color: currentTab === "aiAssistant" ? "currentColor" : "#94a3b8" }} />
            <span className="text-[10px] tracking-tight">
              {lang === "bn" ? "এআই সহকারী" : "AI Helper"}
            </span>
          </button>
          
          <button
            onClick={() => {
              setCurrentTab("chat");
              setSelectedNote(null);
            }}
            className={`flex flex-col items-center justify-center w-20 h-full transition-all android-ripple ${
              currentTab === "chat"
                ? `${theme.primaryText} font-bold`
                : `${theme.textMuted} font-medium`
            }`}
          >
            <MessageSquare className="h-5 w-5 mb-1" style={{ color: currentTab === "chat" ? "currentColor" : "#94a3b8" }} />
            <span className="text-[10px] tracking-tight">
              {lang === "bn" ? "সহায়তা" : "Support"}
            </span>
          </button>
 
          <button
            onClick={() => {
              setCurrentTab("liveClasses");
              setSelectedNote(null);
            }}
            className={`flex flex-col items-center justify-center w-20 h-full transition-all android-ripple ${
              currentTab === "liveClasses"
                ? `${theme.primaryText} font-bold`
                : `${theme.textMuted} font-medium`
            }`}
          >
            <Radio className="h-5 w-5 mb-1" style={{ color: currentTab === "liveClasses" ? "currentColor" : "#94a3b8" }} />
            <span className="text-[10px] tracking-tight">
              {lang === "bn" ? "লাইভ ক্লাস" : "Live"}
            </span>
          </button>

          {profile.role === "Admin" && (
            <button
              onClick={() => {
                setCurrentTab("admin");
                setSelectedNote(null);
              }}
              className={`flex flex-col items-center justify-center w-20 h-full transition-all android-ripple ${
                currentTab === "admin"
                  ? "text-amber-500 font-bold"
                  : `${theme.textMuted} font-medium`
              }`}
            >
              <Shield className="h-5 w-5 mb-1" style={{ color: currentTab === "admin" ? "#d97706" : "#94a3b8" }} />
              <span className="text-[10px] tracking-tight">
                {lang === "bn" ? "অ্যাডমিন" : "Admin"}
              </span>
            </button>
          )}
          </div>
        </div>
      )}
    </motion.div>
    )}
  </AnimatePresence>
  );
}
