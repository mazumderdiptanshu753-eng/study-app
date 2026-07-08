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
  Radio,
  User
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
import NotificationBell from "./components/NotificationBell";
import ProfileSettings from "./components/ProfileSettings";
import { StudyNote, UserStats, Subject, GradeLevel, StudentProfile } from "./types";
import { Language, TRANSLATIONS } from "./lib/translations";
import { ThemeId, THEMES } from "./lib/themes";

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
  const [currentTab, _setCurrentTab] = useState<"dashboard" | "notes" | "chat" | "aiAssistant" | "videos" | "admin" | "gk" | "forum" | "liveClasses" | "govtJobNotes" | "profile">("dashboard");
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [selectedGovtJobSubject, setSelectedGovtJobSubject] = useState<string>("math");

  // App Update states
  const [currentClientVersion, setCurrentClientVersion] = useState<string>(() => {
    return localStorage.getItem("client_app_version") || "2.6.1";
  });
  const [serverVersionInfo, setServerVersionInfo] = useState<{
    latestVersion: string;
    changelogEn: string;
    changelogBn: string;
  } | null>(null);
  const [isUpdatingApp, setIsUpdatingApp] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateStatusStep, setUpdateStatusStep] = useState<string>("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showUpdateSuccessToast, setShowUpdateSuccessToast] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("just_updated") === "true") {
      localStorage.removeItem("just_updated");
      setShowUpdateSuccessToast(true);
      const timer = setTimeout(() => {
        setShowUpdateSuccessToast(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const isNewerVersion = (latest: string, current: string) => {
    if (!latest || !current) return false;
    const lParts = latest.replace(/[^\d.]/g, "").split(".").map(Number);
    const cParts = current.replace(/[^\d.]/g, "").split(".").map(Number);
    for (let i = 0; i < Math.max(lParts.length, cParts.length); i++) {
      const l = lParts[i] || 0;
      const c = cParts[i] || 0;
      if (l > c) return true;
      if (l < c) return false;
    }
    return false;
  };

  const checkAppVersion = async () => {
    try {
      const res = await fetch("/api/app-version");
      if (res.ok) {
        const data = await res.json();
        setServerVersionInfo(data);
        if (data.latestVersion && isNewerVersion(data.latestVersion, currentClientVersion)) {
          // Automatic update: immediately trigger update process if not already updating
          if (!isUpdatingApp) {
            startUpdateProcess(data.latestVersion);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to check app version:", e);
    }
  };

  const startUpdateProcess = (targetVersion?: string) => {
    setShowUpdateModal(false);
    setIsUpdatingApp(true);
    setUpdateProgress(0);
    setUpdateStatusStep(lang === "bn" ? "নতুন আপডেট ফাইল ডাউনলোড হচ্ছে..." : "Downloading update package...");

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 12) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setUpdateProgress(100);
        setUpdateStatusStep(lang === "bn" ? "স্টাডি হাব রিস্টার্ট হচ্ছে!" : "Restarting Study Hub!");
        clearInterval(interval);
        
        // Persist the updated version code in localStorage
        const versionToSave = targetVersion || serverVersionInfo?.latestVersion || "2.6.1";
        localStorage.setItem("client_app_version", versionToSave);
        localStorage.setItem("just_updated", "true");
        setCurrentClientVersion(versionToSave);
        
        // Notify the user about their device's successful automatic update
        if (profile?.email) {
          fetch("/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: "YOURR APP IS SUCESSFULLY UPDATED",
              message: lang === "bn" 
                ? `আপনার ডিভাইসটি সফলভাবে v${versionToSave} সংস্করণে আপডেট করা হয়েছে। (YOURR APP IS SUCESSFULLY UPDATED)`
                : `YOURR APP IS SUCESSFULLY UPDATED. Your device was successfully updated to version v${versionToSave}.`,
              type: "info",
              userEmail: profile.email
            })
          }).catch(err => console.error("Failed to post update completed notification:", err));
        }
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setUpdateProgress(currentProgress);
        if (currentProgress < 25) {
          setUpdateStatusStep(lang === "bn" ? "নতুন আপডেট ফাইল ডাউনলোড হচ্ছে..." : "Downloading update package...");
        } else if (currentProgress < 50) {
          setUpdateStatusStep(lang === "bn" ? "ফাইল এক্সট্র্যাক্ট এবং যাচাই করা হচ্ছে..." : "Extracting and verifying resources...");
        } else if (currentProgress < 75) {
          setUpdateStatusStep(lang === "bn" ? "কনফিগারেশন এবং ডাটাবেস সিঙ্ক করা হচ্ছে..." : "Synchronizing system settings...");
        } else {
          setUpdateStatusStep(lang === "bn" ? "সবকিছু প্রস্তুত করা হচ্ছে..." : "Finalizing system upgrade...");
        }
      }
    }, 400);
  };

  useEffect(() => {
    // Check initially after 4s
    const timer = setTimeout(checkAppVersion, 4000);
    // Poll every 12s for near real-time reactivity
    const interval = setInterval(checkAppVersion, 12000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

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
          if (matched) {
            if (matched.isSuspended) {
              setProfile(null);
              localStorage.removeItem("student_profile");
              alert(lang === "bn" ? "আপনার অ্যাকাউন্টটি অ্যাডমিন দ্বারা সাসপেন্ড করা হয়েছে।" : "Your account has been suspended by the admin.");
              return;
            }
            if (matched.role !== profile.role || matched.avatarUrl !== profile.avatarUrl) {
              const updatedProfile = { ...profile, role: matched.role, avatarUrl: matched.avatarUrl };
              setProfile(updatedProfile);
              localStorage.setItem("student_profile", JSON.stringify(updatedProfile));
            }
          } else {
            console.log("Recovering/Syncing existing user profile to PostgreSQL database...");
            try {
              const regRes = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile)
              });
              if (regRes.ok) {
                const updatedUsersList = await regRes.json();
                setUsers(updatedUsersList);
                localStorage.setItem("registered_users", JSON.stringify(updatedUsersList));
              }
            } catch (err) {
              console.error("Failed to recover user profile in database:", err);
            }
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

  const setCurrentTab = (tab: "dashboard" | "notes" | "chat" | "aiAssistant" | "videos" | "admin" | "gk" | "forum" | "liveClasses" | "govtJobNotes" | "profile") => {
    setIsPageLoading(true);
    setTimeout(() => {
      _setCurrentTab(tab);
      setIsPageLoading(false);
    }, 300);
  };

  const handleUpdateProfile = async (updated: StudentProfile) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        localStorage.setItem("registered_users", JSON.stringify(data));
        
        setProfile(updated);
        localStorage.setItem("student_profile", JSON.stringify(updated));
      }
    } catch (e) {
      console.error("Failed to update profile on backend:", e);
    }
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

  // Sync personal study notes from database or local storage as fallback
  useEffect(() => {
    if (!profile?.email) {
      setNotes([]);
      return;
    }

    const fetchNotes = async () => {
      try {
        const response = await fetch(`/api/study-notes?email=${encodeURIComponent(profile.email)}`);
        if (response.ok) {
          const cloudNotes = await response.json();
          
          const localNotesStr = localStorage.getItem("study_notes");
          let localNotes: StudyNote[] = [];
          if (localNotesStr) {
            try {
              localNotes = JSON.parse(localNotesStr);
            } catch (err) {
              localNotes = [];
            }
          }

          const missingInCloud = localNotes.filter(
            (localNote: any) => localNote && localNote.id && !cloudNotes.some((cloudNote: any) => cloudNote.id === localNote.id)
          );

          if (missingInCloud.length > 0) {
            console.log(`Recovering ${missingInCloud.length} local study notes to PostgreSQL...`);
            for (const note of missingInCloud) {
              try {
                await fetch("/api/study-notes", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ...note,
                    userEmail: profile.email
                  })
                });
              } catch (err) {
                console.error("Failed to recover note:", note.id, err);
              }
            }
            
            const mergedNotes = [...cloudNotes, ...missingInCloud].sort((a: any, b: any) => 
              new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
            );
            setNotes(mergedNotes);
            localStorage.setItem("study_notes", JSON.stringify(mergedNotes));
          } else {
            setNotes(cloudNotes);
            localStorage.setItem("study_notes", JSON.stringify(cloudNotes));
          }
        } else {
          throw new Error("Failed to fetch cloud notes");
        }
      } catch (e) {
        console.warn("Using offline fallback for study notes:", e);
        const local = localStorage.getItem("study_notes");
        if (local) {
          try {
            setNotes(JSON.parse(local));
          } catch (err) {
            setNotes([]);
          }
        } else {
          setNotes([]);
        }
      }
    };

    fetchNotes();
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

  // Save or update manually written note or AI updated fields (PG Database + Local Storage)
  const handleSaveNote = async (noteData: Omit<StudyNote, "id" | "timestamp"> & { id?: string; timestamp?: string }) => {
    const isNew = !noteData.id;
    const noteId = noteData.id || `note-${Date.now()}`;
    const timestamp = noteData.timestamp || new Date().toISOString();
    
    const finalNote: StudyNote = {
      ...noteData,
      id: noteId,
      timestamp: timestamp,
    };

    // Update state & local storage (Optimistic update)
    if (isNew) {
      setNotes(prev => [finalNote, ...prev]);
    } else {
      setNotes(prev => prev.map(n => n.id === noteId ? finalNote : n));
    }
    setSelectedNote(finalNote);

    // Sync to PostgreSQL database
    if (profile?.email) {
      try {
        await fetch("/api/study-notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...finalNote,
            userEmail: profile.email
          })
        });
      } catch (e) {
        console.error("Failed to sync study note to database:", e);
      }
    }
  };

  // Delete note from database and local storage
  const handleDeleteNote = async (id: string) => {
    // Update local state and storage
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }

    // Sync deletion to PostgreSQL database
    try {
      await fetch(`/api/study-notes/${id}`, {
        method: "DELETE"
      });
    } catch (e) {
      console.error("Failed to sync note deletion to database:", e);
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
    if (existingUser?.isSuspended) {
      alert(lang === "bn" ? "আপনার অ্যাকাউন্টটি অ্যাডমিন দ্বারা সাসপেন্ড করা হয়েছে।" : "Your account has been suspended by the admin.");
      return;
    }
    
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

  const handleToggleSuspendUser = async (email: string) => {
    const targetUser = users.find(user => (user?.email || "").trim().toLowerCase() === (email || "").trim().toLowerCase());
    if (!targetUser) return;
    if (targetUser.role === "Admin") {
      alert(lang === "bn" ? "অ্যাডমিনকে সাসপেন্ড করা যাবে না।" : "Cannot suspend an admin.");
      return;
    }

    const updatedUser = {
      ...targetUser,
      isSuspended: !targetUser.isSuspended
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
      }
    } catch (e) {
      console.error("Failed to toggle suspend on backend:", e);
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
          {/* Visual Navigation Header Banner - Completely Redesigned into an Animated Luxury Centered Floating Glass Header */}
          <div className="fixed top-2.5 sm:top-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 sm:px-6">
            <motion.div 
              initial={{ y: -80, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.15 }}
              whileHover={{ y: 1 }}
              className={`flex items-center justify-between w-full max-w-7xl p-2 sm:p-2.5 rounded-2xl md:rounded-3xl border ${theme.isDark ? 'border-white/[0.08] bg-slate-950/75' : 'border-black/[0.06] bg-white/75'} shadow-[0_15px_35px_rgba(0,0,0,0.12)] pointer-events-auto backdrop-blur-2xl transition-all duration-300`}
            >
              
              {/* Left Section: Interactive Brand Identity / Logo Badge */}
              <motion.button 
                onClick={() => setCurrentTab("dashboard")}
                whileHover={{ scale: 1.03, y: -0.5 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 group cursor-pointer text-left select-none outline-none focus:ring-2 focus:ring-emerald-500/40 rounded-xl px-1.5 py-1"
                title={lang === "bn" ? "ড্যাশবোর্ড-এ ফিরে যান" : "Go to Dashboard"}
              >
                <div className={`relative flex items-center justify-center h-8.5 w-8.5 sm:h-9.5 sm:w-9.5 rounded-xl bg-gradient-to-tr ${theme.heroGradient} text-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3`}>
                  <GraduationCap className="h-4.5 w-4.5 sm:h-5 sm:w-5 drop-shadow-md" />
                  <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 border border-white" />
                </div>
                <div className="hidden xs:block leading-none">
                  <div className="flex items-center gap-1">
                    <span className={`font-black text-xs sm:text-sm tracking-tight ${theme.isDark ? 'text-white' : 'text-slate-900'} group-hover:text-emerald-500 transition-colors`}>
                      STUDY HUB
                    </span>
                    <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-extrabold text-slate-400 tracking-wider uppercase block mt-0.5">
                    {lang === "bn" ? "অধ্যয়ন ও এআই হাব" : "LEARN & AI"}
                  </span>
                </div>
              </motion.button>

              {/* Right Section: Controls Wrapper */}
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* Theme & Language Switchers tray */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  
                  {/* Theme Selector Tray */}
                  <div className={`flex items-center gap-0.5 p-0.5 rounded-lg sm:rounded-xl border ${theme.isDark ? 'bg-white/[0.04] border-white/[0.06]' : 'bg-black/[0.03] border-black/[0.05]'} shadow-inner`}>
                    {(Object.keys(THEMES) as ThemeId[]).map((tid) => {
                      const tConfig = THEMES[tid];
                      const isActive = themeId === tid;
                      return (
                        <motion.button
                          key={tid}
                          onClick={() => {
                            setThemeId(tid);
                            localStorage.setItem("app_theme", tid);
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-md sm:rounded-lg text-[10px] sm:text-xs transition-all relative group cursor-pointer ${
                            isActive 
                              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] scale-105 border border-black/[0.05] dark:border-white/[0.05]" 
                              : "opacity-60 hover:opacity-100 text-slate-500 hover:bg-white/45 dark:hover:bg-slate-800/45"
                          }`}
                          title={lang === "bn" ? tConfig.nameBn : tConfig.nameEn}
                        >
                          <span className="transform duration-200 group-hover:scale-110">{tConfig.icon}</span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Language Switcher Toggle */}
                  <div className={`flex items-center gap-0.5 p-0.5 rounded-lg sm:rounded-xl border ${theme.isDark ? 'bg-white/[0.04] border-white/[0.06]' : 'bg-black/[0.03] border-black/[0.05]'} shadow-inner`}>
                    <motion.button
                      onClick={() => handleLanguageChange("en")}
                      id="lang-switcher-en-new"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-black rounded-md sm:rounded-lg transition-all cursor-pointer ${
                        lang === "en"
                          ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-black/[0.03] dark:border-white/[0.03]"
                          : "text-slate-450 hover:text-slate-700 dark:hover:text-slate-200"
                      }`}
                    >
                      EN
                    </motion.button>
                    <motion.button
                      onClick={() => handleLanguageChange("bn")}
                      id="lang-switcher-bn-new"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-black rounded-md sm:rounded-lg transition-all cursor-pointer ${
                        lang === "bn"
                          ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-black/[0.03] dark:border-white/[0.03]"
                          : "text-slate-450 hover:text-slate-700 dark:hover:text-slate-200"
                      }`}
                    >
                      BN
                    </motion.button>
                  </div>

                </div>

                {/* Interactive Notification Center */}
                {profile && (
                  <NotificationBell profile={profile} lang={lang} theme={theme} />
                )}

                {/* Delicate Divider */}
                <span className={`h-5 w-[1px] ${theme.isDark ? 'bg-white/[0.08]' : 'bg-black/[0.06]'}`} />

                {/* User Profile Summary / Controls */}
                {profile ? (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentTab("profile")}
                      className="flex items-center gap-2" title={profile.email}
                    >
                      {/* User Info labels */}
                      <div className="hidden md:flex flex-col text-left leading-none max-w-[110px] select-none">
                        <span className={`font-black text-[11px] sm:text-xs ${theme.isDark ? 'text-slate-100' : 'text-slate-800'} truncate block`}>
                          {profile.name}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          {profile.role === "Admin" ? (
                            <span className="inline-flex items-center px-1 py-0.5 text-[7px] font-black tracking-wide rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase shrink-0">
                              👑 {lang === "bn" ? "এডমিন" : "Admin"}
                            </span>
                          ) : (
                            <span className={`inline-flex items-center px-1 py-0.5 text-[7px] font-black tracking-wide rounded ${theme.primaryBg} ${theme.primaryText} border ${theme.borderCard} uppercase shrink-0`}>
                              🎓 {lang === "bn" ? "শিক্ষার্থী" : "Student"}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={handleLogout}
                      id="header-btn-logout-new"
                      className="flex items-center justify-center h-7.5 w-7.5 sm:h-8.5 sm:w-8.5 rounded-lg sm:rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 hover:text-rose-400 transition-all cursor-pointer shadow-3xs hover:scale-105 active:scale-95 group/logout"
                      title={lang === "bn" ? "লগ আউট" : "Sign Out"}
                    >
                      <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-200 group-hover/logout:translate-x-0.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <div className="h-7 w-7 rounded-lg bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-500">
                      G
                    </div>
                    <div className="hidden sm:block text-left leading-none">
                      <span className="font-semibold text-[9px] text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                        {lang === "bn" ? "নিবন্ধিত নয়" : "Guest Mode"}
                      </span>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>

      {/* Main Content Area Container */}
      <main className={`flex-1 w-full mx-auto ${profile ? "max-w-7xl px-4 pt-20 md:pt-24 pb-32 sm:px-6 md:pl-28" : "max-w-md px-2 py-4 flex items-center justify-center min-h-[calc(100vh-3rem)]"} relative`}>
        
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
              {currentTab === "admin" && profile && profile.role === "Admin" && (
                <AdminPanel
                  lang={lang}
                  users={users}
                  onToggleAdminRole={handleToggleAdminRole}
                  onToggleSuspendUser={handleToggleSuspendUser}
                  onDeleteUser={handleDeleteUser}
                  currentUserEmail={profile?.email || ""}
                  theme={theme}
                  currentAppVersion={currentClientVersion}
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
              {currentTab === "profile" && profile && (
                <ProfileSettings
                  profile={profile}
                  onUpdate={handleUpdateProfile}
                  onClose={() => setCurrentTab("dashboard")}
                  theme={theme}
                  lang={lang}
                />
              )}
              </>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Floating Profile Button - Unique Access */}
        {profile && (
          <motion.button
            onClick={() => setCurrentTab("profile")}
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            className={`md:hidden fixed bottom-24 right-6 z-40 p-4 rounded-full shadow-2xl border ${theme.isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
          >
            <User className={`h-6 w-6 ${theme.textHeading}`} />
          </motion.button>
        )}

        {/* Humble Footer */}
        <footer className={`mt-20 pt-8 pb-32 md:pb-8 text-center text-xs ${theme.textMuted} font-semibold tracking-wide transition-colors duration-300`}>
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          </div>
        </footer>
      </main>

      {/* Desktop Floating Sidebar Navigation */}
      {profile && (
        <div className={`hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-4 py-6 px-3 rounded-[2rem] shadow-[0_15px_35px_rgba(0,0,0,0.12)] backdrop-blur-xl border ${theme.isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white/90 border-black/5'}`}>
          <button
            onClick={() => setCurrentTab("dashboard")}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all ${
              currentTab === "dashboard"
                ? `${theme.primaryText} bg-black/5 dark:bg-white/5 font-bold shadow-sm scale-110`
                : `${theme.textMuted} font-medium hover:bg-black/5 dark:hover:bg-white/5 hover:scale-105`
            }`}
            title={lang === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
          >
            <GraduationCap className="h-6 w-6" style={{ color: currentTab === "dashboard" ? "currentColor" : "#94a3b8" }} />
          </button>
           <button
            onClick={() => {
              setCurrentTab("notes");
              setSelectedNote(null);
            }}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all ${
              currentTab === "notes"
                ? `${theme.primaryText} bg-black/5 dark:bg-white/5 font-bold shadow-sm scale-110`
                : `${theme.textMuted} font-medium hover:bg-black/5 dark:hover:bg-white/5 hover:scale-105`
            }`}
            title={lang === "bn" ? "নোটস" : "Notes"}
          >
            <BookOpen className="h-6 w-6" style={{ color: currentTab === "notes" ? "currentColor" : "#94a3b8" }} />
          </button>
           <button
            onClick={() => {
              setCurrentTab("chat");
              setSelectedNote(null);
            }}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all ${
              currentTab === "chat"
                ? `${theme.primaryText} bg-black/5 dark:bg-white/5 font-bold shadow-sm scale-110`
                : `${theme.textMuted} font-medium hover:bg-black/5 dark:hover:bg-white/5 hover:scale-105`
            }`}
            title={lang === "bn" ? "চ্যাট" : "Chat"}
          >
            <MessageSquare className="h-6 w-6" style={{ color: currentTab === "chat" ? "currentColor" : "#94a3b8" }} />
          </button>
          
           <button
            onClick={() => {
              setCurrentTab("liveClasses");
              setSelectedNote(null);
            }}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all ${
              currentTab === "liveClasses"
                ? `${theme.primaryText} bg-black/5 dark:bg-white/5 font-bold shadow-sm scale-110`
                : `${theme.textMuted} font-medium hover:bg-black/5 dark:hover:bg-white/5 hover:scale-105`
            }`}
            title={lang === "bn" ? "লাইভ ক্লাস" : "Live"}
          >
            <Radio className="h-6 w-6" style={{ color: currentTab === "liveClasses" ? "currentColor" : "#94a3b8" }} />
          </button>
          
          {profile.role === "Admin" && (
            <button
              onClick={() => {
                setCurrentTab("admin");
                setSelectedNote(null);
              }}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all ${
                currentTab === "admin"
                  ? "text-amber-500 bg-amber-500/10 dark:bg-amber-500/20 font-bold shadow-sm scale-110"
                  : `${theme.textMuted} font-medium hover:bg-amber-500/10 dark:hover:bg-amber-500/20 hover:text-amber-500 hover:scale-105`
              }`}
              title={lang === "bn" ? "অ্যাডমিন" : "Admin"}
            >
              <Shield className="h-6 w-6" style={{ color: currentTab === "admin" ? "#d97706" : "#94a3b8" }} />
            </button>
          )}
        </div>
      )}

      {/* Mobile Sticky Bottom Bar Navigation */}
      {profile && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 pb-[env(safe-area-inset-bottom,0px)] flex justify-center pointer-events-none">
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

      {/* Full-screen sleek updating overlay */}
      {isUpdatingApp && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-2xl text-white">
          <div className="w-full max-w-sm px-6 text-center space-y-8">
            <div className="relative inline-flex items-center justify-center">
              {/* Rotating outer rings */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-teal-500/30 animate-spin" style={{ animationDuration: "12s" }}></div>
              <div className="absolute -inset-4 rounded-full border border-teal-500/10 animate-reverse-spin" style={{ animationDuration: "8s" }}></div>
              
              <div className="h-20 w-20 rounded-3xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20 shadow-lg shadow-teal-500/10">
                <GraduationCap className="h-10 w-10 text-teal-400 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black tracking-tight text-slate-100">
                {lang === "bn" ? "স্টাডি হাব আপডেট হচ্ছে" : "Upgrading STUDY HUB"}
              </h2>
              <p className="text-xs text-slate-400 font-semibold tracking-wide min-h-5">
                {updateStatusStep}
              </p>
            </div>

            <div className="space-y-2">
              {/* Progress track */}
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5 p-0.5">
                <motion.div 
                  className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-400 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${updateProgress}%` }}
                  transition={{ ease: "easeInOut", duration: 0.2 }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-extrabold tracking-wider font-mono uppercase">
                <span>{lang === "bn" ? "ধাপ" : "STEP"} {updateProgress < 25 ? "1/4" : updateProgress < 50 ? "2/4" : updateProgress < 75 ? "3/4" : "4/4"}</span>
                <span className="text-teal-400">{updateProgress}%</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              {lang === "bn" 
                ? "অনুগ্রহ করে অপেক্ষা করুন। আপডেট প্রসেস সম্পূর্ণ হলে অ্যাপটি স্বয়ংক্রিয়ভাবে রিস্টার্ট হবে।" 
                : "Please do not close or refresh this tab. System will resume automatically."}
            </p>
          </div>
        </div>
      )}

      {/* Dynamic Update Success Toast */}
      <AnimatePresence>
        {showUpdateSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] w-full max-w-sm px-4"
          >
            <div className="bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border border-teal-500/30 text-white rounded-2xl p-4 shadow-2xl flex items-start gap-3.5 relative overflow-hidden">
              {/* Highlight background glow */}
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl"></div>
              
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20 shrink-0">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <div className="space-y-1 pr-4 min-w-0 flex-1">
                <h4 className="text-xs font-black tracking-widest text-teal-400 uppercase">
                  System Updated
                </h4>
                <p className="text-sm font-black text-slate-100 leading-tight">
                  YOURR APP IS SUCESSFULLY UPDATED
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {lang === "bn" 
                    ? "স্টাডি হাব পোর্টাল সফলভাবে সর্বশেষ সংস্করণে স্বয়ংক্রিয়ভাবে আপডেট করা হয়েছে।" 
                    : "Study Hub Portal has been successfully updated to the latest version automatically."}
                </p>
              </div>
              <button 
                onClick={() => setShowUpdateSuccessToast(false)}
                className="text-slate-500 hover:text-slate-300 transition-colors text-xs font-bold self-start mt-0.5"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
    )}
  </AnimatePresence>
  );
}
