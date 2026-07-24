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
  User,
  ArrowLeft,
  Users,
  Award,
  ChevronUp,
  BookMarked
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
import SchoolSection from "./components/SchoolSection";
import TechnicalStudies from "./components/TechnicalStudies";

const LazyDashboard = Dashboard;
const LazyNotesManager = NotesManager;
const LazySupportChat = SupportChat;
const LazyVideoPortal = VideoPortal;
const LazyAdminPanel = AdminPanel;
const LazyGeneralKnowledgePage = GeneralKnowledgePage;
const LazyCommunityForum = CommunityForum;
const LazyLiveClasses = LiveClasses;
const LazyGovtJobNotes = GovtJobNotes;
const LazyAIStudyAssistant = AIStudyAssistant;
import NotificationBell from "./components/NotificationBell";
import ProfileSettings from "./components/ProfileSettings";
import { StudyNote, UserStats, Subject, GradeLevel, StudentProfile } from "./types";
import { Language, TRANSLATIONS } from "./lib/translations";
import { ThemeId, THEMES } from "./lib/themes";
import { safeFetch } from "./lib/api";

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("app_lang");
    return (saved as Language) || "en";
  });

  const [themeId, setThemeId] = useState<ThemeId>(() => {
    const saved = localStorage.getItem("app_theme_id");
    return (saved as ThemeId) || "cosmic";
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

  const [hasStartedWelcome, setHasStartedWelcome] = useState<boolean>(() => {
    return localStorage.getItem("has_started_welcome") === "true";
  });
  const [currentTab, _setCurrentTab] = useState<"dashboard" | "notes" | "chat" | "aiAssistant" | "videos" | "admin" | "gk" | "forum" | "liveClasses" | "govtJobNotes" | "profile" | "school" | "btech" | "diploma">(() => {
    return (localStorage.getItem("current_tab") as any) || "dashboard";
  });
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [selectedGovtJobSubject, setSelectedGovtJobSubject] = useState<string>("math");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainScrollRef = React.useRef<HTMLDivElement>(null);

  // App Update states
  const [currentClientVersion, setCurrentClientVersion] = useState<string>(() => {
    return localStorage.getItem("client_app_version") || "2.6.5";
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
    if (document.hidden) return;
    try {
      const res = await safeFetch("/api/app-version", undefined, 3, 1000);
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
        const versionToSave = targetVersion || serverVersionInfo?.latestVersion || "2.6.5";
        localStorage.setItem("client_app_version", versionToSave);
        localStorage.setItem("just_updated", "true");
        setCurrentClientVersion(versionToSave);
        
        // Notify the user about their device's successful automatic update
        if (profile?.email) {
          safeFetch("/api/notifications", {
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
          }).catch(err => console.warn("Failed to post update completed notification:", err));
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
    const timer = setTimeout(checkAppVersion, 4000);
    const interval = setInterval(() => {
      if (!document.hidden) {
        checkAppVersion();
      }
    }, 20000);
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

  // Load settings from backend API
  const fetchSettings = async () => {
    if (document.hidden) return;
    try {
      const res = await safeFetch("/api/settings", undefined, 3, 1000);
      if (res.ok) {
        const data = await res.json();
        const isMaint = data.maintenanceMode === true;
        setMaintenanceMode(isMaint);
      }
    } catch (e) {
      console.warn("Failed to fetch settings:", e);
    }
  };

  const fetchUsers = async () => {
    if (document.hidden) return;
    try {
      const res = await safeFetch("/api/users", undefined, 3, 1000);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setUsers(data);
          localStorage.setItem("registered_users", JSON.stringify(data));
          
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
              // User exists locally in profile, but not in database yet. Post profile to backend to ensure DB is in sync.
              // NEVER LOGOUT OR ERASE PROFILE HERE!
              try {
                const regRes = await safeFetch("/api/users", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(profile)
                }, 2, 1000);
                if (regRes.ok) {
                  const updatedUsersList = await regRes.json();
                  if (Array.isArray(updatedUsersList) && updatedUsersList.length > 0) {
                    setUsers(updatedUsersList);
                    localStorage.setItem("registered_users", JSON.stringify(updatedUsersList));
                  }
                }
              } catch (err) {
                console.error("Failed to sync user profile in database:", err);
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn("Failed to fetch users:", e);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSettings();

    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchUsers();
        fetchSettings();
      }
    }, 15000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(() => {
          fetchUsers();
          fetchSettings();
          checkAppVersion();
        }, 1500);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [profile?.email]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", false);
  }, []);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const handleWindowScroll = () => {
      if (window.innerWidth < 768) {
        setShowScrollTop(window.scrollY > 200);
      }
    };
    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 768) {
      setShowScrollTop(e.currentTarget.scrollTop > 200);
    }
  };

  const scrollToTop = () => {
    if (window.innerWidth < 768) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } else {
      mainScrollRef.current?.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  const setCurrentTab = (tab: "dashboard" | "notes" | "chat" | "aiAssistant" | "videos" | "admin" | "gk" | "forum" | "liveClasses" | "govtJobNotes" | "profile" | "school" | "btech" | "diploma") => {
    _setCurrentTab(tab);
    localStorage.setItem("current_tab", tab);
    // Automatically scroll to the top of our main scroll container on tab switches
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: "instant" as any });
    } else {
      mainScrollRef.current?.scrollTo({ top: 0, behavior: "instant" as any });
    }
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
    
    // Check maintenance mode on login attempt
    if (maintenanceMode) {
      if (!existingUser || existingUser.role !== "Admin") {
        if (newProfile.email.trim().toLowerCase() !== "mazumderdiptanshu753@gmail.com") {
          alert(lang === "bn" ? "অ্যাপটিতে বর্তমানে রক্ষণাবেক্ষণ চলছে। শুধুমাত্র অ্যাডমিনরা এখন লগইন করতে পারবেন।" : "The app is currently under maintenance. Only Admins can login right now.");
          return;
        }
      }
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
              localStorage.setItem("has_started_welcome", "true");
            }} 
          />
        </motion.div>
      ) : (
        <motion.div
          key="main-app"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full flex ${profile ? "md:h-screen md:overflow-hidden flex-col md:flex-row min-h-screen" : "min-h-screen flex-col"} ${theme.bgPage} ${theme.isDark ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0b0f19] to-black" : "bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"} ${theme.textMain} font-sans antialiased transition-colors duration-300`}
        >
          {/* Unbelievably Elegant Desktop Left Sidebar Workspace Navigation */}
          {profile && (
            <aside className={`hidden md:flex flex-col w-72 shrink-0 border-r ${theme.borderCard} ${theme.bgCard} h-[100vh] sticky top-0 z-30 transition-all duration-300 overflow-y-auto overflow-x-hidden p-5`}>
              {/* Top Brand Area */}
              <div className={`flex items-center gap-3 pb-6 mb-6 border-b ${theme.borderCard}`}>
                <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md">
                  <GraduationCap className="h-5 w-5 drop-shadow-md" />
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 border border-white" />
                </div>
                <div className="leading-none">
                  <div className="flex items-center gap-1">
                    <span className="font-black text-sm sm:text-base tracking-tight text-slate-900">
                      STUDY HUB
                    </span>
                    <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
                  </div>
                  <span className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase block mt-1">
                    {lang === "bn" ? "অধ্যয়ন ও এআই হাব" : "LEARN & AI SPACE"}
                  </span>
                </div>
              </div>

              {/* User Profile Summary Card inside Sidebar */}
              <div className={`mb-6 p-4 rounded-2xl border ${theme.borderCard} bg-slate-50 flex flex-col gap-3 relative overflow-hidden group`}>
                <div 
                  onClick={() => setCurrentTab("profile")}
                  className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 -m-1.5 rounded-xl transition-all duration-200 group/profile-card"
                  title={lang === "bn" ? "অ্যাকাউন্ট প্রোফাইল দেখুন" : "View Account Profile"}
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-lg shadow-md select-none group-hover/profile-card:scale-105 transition-transform duration-200 shrink-0">
                    {profile.avatarUrl && (profile.avatarUrl.startsWith("http") || profile.avatarUrl.startsWith("data:image")) ? (
                      <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                    ) : (
                      profile.avatarUrl || "🎓"
                    )}
                  </div>
                  <div className="flex-1 min-w-0 leading-tight">
                    <span className="font-black text-xs sm:text-sm block truncate text-slate-850 group-hover/profile-card:text-emerald-600 dark:group-hover/profile-card:text-emerald-400 transition-colors">
                      {profile.name || profile.fullName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium truncate block mt-0.5">
                      {profile.email}
                    </span>
                  </div>
                </div>
                <div className={`flex items-center justify-between border-t ${theme.borderCard} pt-3 mt-1`}>
                  {profile.role === "Admin" ? (
                    <span className="inline-flex items-center px-2 py-0.5 text-[8px] font-black tracking-wide rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase shrink-0">
                      👑 {lang === "bn" ? "এডমিন" : "Admin"}
                    </span>
                  ) : (
                    <span className={`inline-flex items-center px-2 py-0.5 text-[8px] font-black tracking-wide rounded ${theme.primaryBg} ${theme.primaryText} border ${theme.borderCard} uppercase shrink-0`}>
                      🎓 {lang === "bn" ? "শিক্ষার্থী" : "Student"}
                    </span>
                  )}
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    <motion.button
                      onClick={() => setCurrentTab("profile")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center h-7 w-7 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 hover:text-emerald-500 transition-all cursor-pointer shadow-3xs"
                      title={lang === "bn" ? "অ্যাকাউন্ট সেটিংস" : "Account Settings"}
                    >
                      <User className="h-3.5 w-3.5" />
                    </motion.button>

                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center h-7 w-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 hover:text-rose-400 transition-all cursor-pointer shadow-3xs group/logout"
                      title={lang === "bn" ? "লগ আউট" : "Sign Out"}
                    >
                      <LogOut className="h-3.5 w-3.5 transition-transform duration-200 group-hover/logout:translate-x-0.5" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Navigation Items List */}
              <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1">
                {[
                  { id: "dashboard", labelEn: "Dashboard", labelBn: "ড্যাশবোর্ড", icon: GraduationCap },
                  { id: "school", labelEn: "School Academy", labelBn: "স্কুল একাডেমি", icon: BookMarked },
                  { id: "diploma", labelEn: "Polytechnic Diploma", labelBn: "ডিপ্লোমা কর্নার", icon: Laptop },
                  { id: "notes", labelEn: "Study Notes", labelBn: "অধ্যয়ন নোটস", icon: BookOpen },
                  { id: "chat", labelEn: "Support Chat", labelBn: "শিক্ষক চ্যাট", icon: MessageSquare },
                  { id: "liveClasses", labelEn: "Live Lectures", labelBn: "লাইভ ক্লাস", icon: Radio },
                  { id: "forum", labelEn: "Discussion Forum", labelBn: "ফোরাম বোর্ড", icon: Users },
                  { id: "videos", labelEn: "Video Library", labelBn: "ভিডিও পোর্টাল", icon: Video },
                  { id: "gk", labelEn: "Job Prep & GK", labelBn: "চাকরির খবর ও জিকে", icon: Award },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isActive = currentTab === item.id || (item.id === "gk" && currentTab === "govtJobNotes");
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id as any);
                        setSelectedNote(null);
                      }}
                      className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isActive
                          ? `${theme.primaryText} ${theme.primaryBg} shadow-xs border ${theme.borderCard}`
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-500/5"
                      }`}
                    >
                      <IconComp className="h-4.5 w-4.5" />
                      <span>{lang === "bn" ? item.labelBn : item.labelEn}</span>
                      {isActive && (
                        <motion.span 
                          layoutId="active-sidebar-indicator" 
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" 
                        />
                      )}
                    </button>
                  );
                })}

                {/* Admin-only Navigation item */}
                {profile.role === "Admin" && (
                  <button
                    onClick={() => {
                      setCurrentTab("admin");
                      setSelectedNote(null);
                    }}
                    className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      currentTab === "admin"
                        ? `text-amber-500 bg-amber-550/10 border border-amber-500/20 shadow-xs`
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-500/5"
                    }`}
                  >
                    <Shield className="h-4.5 w-4.5 text-amber-500" />
                    <span>{lang === "bn" ? "অ্যাডমিন প্যানেল" : "Admin Panel"}</span>
                    {currentTab === "admin" && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500" />
                    )}
                  </button>
                )}
              </div>

              {/* Sidebar Footer: Theme & Language Controls */}
              <div className="border-t border-slate-200/50 pt-4 mt-auto flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase">
                    {lang === "bn" ? "থিম পরিবর্তন" : "App Customization"}
                  </span>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${theme.textMain}`}>
                      {lang === "bn" ? "পছন্দের থিম" : "Visual Theme"}
                    </span>
                    <div className="flex items-center gap-1">
                      {(["emerald", "cosmic", "aurora", "sunset"] as ThemeId[]).map((tId) => (
                        <button
                          key={tId}
                          onClick={() => {
                            setThemeId(tId);
                            localStorage.setItem("app_theme_id", tId);
                          }}
                          className={`h-7 w-7 rounded-xl flex items-center justify-center text-xs transition-all duration-200 active:scale-90 border cursor-pointer ${
                            themeId === tId
                              ? `${theme.primaryBg} ${theme.primaryText} ${theme.borderCard} scale-110 shadow-3xs`
                              : "border-transparent hover:bg-slate-100"
                          }`}
                          title={THEMES[tId].nameEn}
                        >
                          {THEMES[tId].icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100/70 pt-3">
                  <span className={`text-xs font-bold ${theme.textMain}`}>
                    {lang === "bn" ? "অ্যাপের ভাষা" : "App Language"}
                  </span>
                  
                  {/* Language switch */}
                  <div className={`flex items-center gap-0.5 p-0.5 rounded-xl border bg-black/[0.03] border-black/[0.05] shadow-inner`}>
                    <button
                      onClick={() => handleLanguageChange("en")}
                      className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                        lang === "en"
                          ? "bg-white text-slate-900 shadow-sm border border-black/[0.03]"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => handleLanguageChange("bn")}
                      className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                        lang === "bn"
                          ? "bg-white text-slate-900 shadow-sm border border-black/[0.03]"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      BN
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          )}

          <div ref={mainScrollRef} onScroll={handleScroll} className={`flex-1 flex flex-col min-w-0 relative ${profile ? "md:h-full md:overflow-y-auto" : ""} scroll-smooth overscroll-y-contain`}>
            {/* Mobile-only compact floating header */}
            {profile && (
              <header className={`md:hidden flex items-center justify-between px-4 h-16 border-b ${theme.borderCard} bg-white/95 backdrop-blur-xl z-25 sticky top-0 shadow-3xs`}>
                <button 
                  onClick={() => setCurrentTab("dashboard")}
                  className="flex items-center gap-2 text-left"
                >
                  <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xs">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-black text-xs block tracking-tight text-slate-900">
                      STUDY HUB
                    </span>
                    <span className="text-[8px] font-extrabold text-slate-500 block tracking-wider uppercase">
                      {lang === "bn" ? "অধ্যয়ন ও এআই" : "LEARN & AI"}
                    </span>
                  </div>
                </button>
                
                <div className="flex items-center gap-2">
                  {/* Highly Visible Language Toggle */}
                  <button
                    onClick={() => handleLanguageChange(lang === "en" ? "bn" : "en")}
                    className="flex items-center justify-center gap-1 h-8 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-[10px] font-extrabold text-emerald-700 transition-all cursor-pointer shadow-3xs active:scale-95"
                    title={lang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
                  >
                    <span className="text-xs">🌐</span>
                    <span>{lang === "en" ? "BN" : "EN"}</span>
                  </button>

                  <NotificationBell profile={profile} lang={lang} theme={theme} />
                  <button 
                    onClick={() => setCurrentTab("profile")}
                    className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-sm shadow-xs border border-white/15 cursor-pointer overflow-hidden"
                  >
                    {profile.avatarUrl && (profile.avatarUrl.startsWith("http") || profile.avatarUrl.startsWith("data:image")) ? (
                      <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      profile.avatarUrl || "🎓"
                    )}
                  </button>
                </div>
              </header>
            )}

            {/* Main Content Area Container */}
            <main className={`flex-1 w-full mx-auto ${profile ? "max-w-7xl px-4 pt-6 md:px-8 pb-32" : "max-w-md px-2 py-4 flex items-center justify-center min-h-[calc(100vh-3rem)]"} relative`}>
        
        {!profile ? (
          <StudentRegistration lang={lang} onRegister={handleRegister} theme={theme} />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 15, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.985 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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
              {currentTab !== "dashboard" && (
                <motion.button
                  onClick={() => {
                    setCurrentTab("dashboard");
                    setSelectedNote(null);
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`mb-5 self-start flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-3xs backdrop-blur-sm transition-all duration-250 cursor-pointer ${
                    theme.isDark 
                      ? "bg-slate-950/60 border-white/[0.08] text-slate-300 hover:text-white hover:bg-slate-900/60" 
                      : "bg-white/80 border-black/[0.08] text-black hover:bg-slate-50 font-bold"
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === "bn" ? "ড্যাশবোর্ড-এ ফিরুন" : "Back to Dashboard"}</span>
                </motion.button>
              )}
              <React.Suspense fallback={<div className="flex flex-col items-center justify-center h-[50vh]"><div className={`h-12 w-12 rounded-full border-4 ${theme.borderCard} border-t-current animate-spin ${theme.textHeading}`} /></div>}>
              {currentTab === "dashboard" && (
                <LazyDashboard 
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
                  profile={profile}
                />
              )}
              {currentTab === "notes" && (
                <LazyNotesManager 
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
                <LazySupportChat lang={lang} theme={theme} profile={profile} />
              )}
              {currentTab === "aiAssistant" && (
                <LazyAIStudyAssistant lang={lang} theme={theme} />
              )}
              {currentTab === "videos" && (
                <LazyVideoPortal 
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
                <LazyLiveClasses
                  lang={lang}
                  theme={theme}
                  profile={profile}
                  onBack={() => setCurrentTab("dashboard")}
                />
              )}
              {currentTab === "forum" && (
                <LazyCommunityForum
                  lang={lang}
                  theme={theme}
                  profile={profile}
                  onBack={() => setCurrentTab("dashboard")}
                />
              )}
              {currentTab === "school" && (
                <SchoolSection
                  lang={lang}
                  theme={theme}
                  profile={profile}
                  onNavigate={(tab) => {
                    setCurrentTab(tab as any);
                    setSelectedNote(null);
                  }}
                />
              )}
              {currentTab === "diploma" && (
                <TechnicalStudies
                  lang={lang}
                  theme={theme}
                  profile={profile}
                  initialCourse="diploma"
                  fixedCourseOnly={true}
                  onBack={() => setCurrentTab("dashboard")}
                />
              )}
              {currentTab === "gk" && (
                <LazyGeneralKnowledgePage
                  lang={lang}
                  theme={theme}
                  profile={profile}
                  onBack={() => setCurrentTab("dashboard")}
                />
              )}
              {currentTab === "govtJobNotes" && (
                <LazyGovtJobNotes
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
                  themeId={themeId}
                  onThemeChange={(newThemeId: ThemeId) => {
                    setThemeId(newThemeId);
                    localStorage.setItem("app_theme_id", newThemeId);
                  }}
                  onLogout={handleLogout}
                  lang={lang}
                />
              )}
              </React.Suspense>
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
    </div>

      {/* Mobile Sticky Bottom Bar Navigation */}
      {profile && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 pb-[env(safe-area-inset-bottom,0px)] flex justify-center pointer-events-none">
          <div className={`flex justify-around items-center w-full max-w-lg mx-auto h-16 px-1 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl pointer-events-auto ${theme.isDark ? 'bg-slate-900/80 border border-white/10' : 'bg-white/90 border border-black/5'}`}>
          <button
            onClick={() => {
              setCurrentTab("dashboard");
              setSelectedNote(null);
            }}
            className={`flex flex-col items-center justify-center flex-1 px-0.5 h-full transition-all android-ripple ${
              currentTab === "dashboard"
                ? `${theme.primaryText} font-bold`
                : `${theme.textMuted} font-medium`
            }`}
          >
            <GraduationCap className="h-5 w-5 mb-1" style={{ color: currentTab === "dashboard" ? "currentColor" : "#94a3b8" }} />
            <span className="text-[9px] sm:text-[10px] tracking-tight truncate max-w-full">
              {lang === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
            </span>
          </button>

          <button
            onClick={() => {
              setCurrentTab("notes");
              setSelectedNote(null);
            }}
            className={`flex flex-col items-center justify-center flex-1 px-0.5 h-full transition-all android-ripple ${
              currentTab === "notes"
                ? `${theme.primaryText} font-bold`
                : `${theme.textMuted} font-medium`
            }`}
          >
            <BookOpen className="h-5 w-5 mb-1" style={{ color: currentTab === "notes" ? "currentColor" : "#94a3b8" }} />
            <span className="text-[9px] sm:text-[10px] tracking-tight truncate max-w-full">
              {lang === "bn" ? "নোটস" : "Notes"}
            </span>
          </button>

          <button
            onClick={() => {
              setCurrentTab("chat");
              setSelectedNote(null);
            }}
            className={`flex flex-col items-center justify-center flex-1 px-0.5 h-full transition-all android-ripple ${
              currentTab === "chat"
                ? `${theme.primaryText} font-bold`
                : `${theme.textMuted} font-medium`
            }`}
          >
            <MessageSquare className="h-5 w-5 mb-1" style={{ color: currentTab === "chat" ? "currentColor" : "#94a3b8" }} />
            <span className="text-[9px] sm:text-[10px] tracking-tight truncate max-w-full">
              {lang === "bn" ? "সহায়তা" : "Support"}
            </span>
          </button>

          <button
            onClick={() => {
              setCurrentTab("liveClasses");
              setSelectedNote(null);
            }}
            className={`flex flex-col items-center justify-center flex-1 px-0.5 h-full transition-all android-ripple ${
              currentTab === "liveClasses"
                ? `${theme.primaryText} font-bold`
                : `${theme.textMuted} font-medium`
            }`}
          >
            <Radio className="h-5 w-5 mb-1" style={{ color: currentTab === "liveClasses" ? "currentColor" : "#94a3b8" }} />
            <span className="text-[9px] sm:text-[10px] tracking-tight truncate max-w-full">
              {lang === "bn" ? "লাইভ ক্লাস" : "Live"}
            </span>
          </button>

          {profile.role === "Admin" && (
            <button
              onClick={() => {
                setCurrentTab("admin");
                setSelectedNote(null);
              }}
              className={`flex flex-col items-center justify-center flex-1 px-0.5 h-full transition-all android-ripple ${
                currentTab === "admin"
                  ? "text-amber-500 font-bold"
                  : `${theme.textMuted} font-medium`
              }`}
            >
              <Shield className="h-5 w-5 mb-1" style={{ color: currentTab === "admin" ? "#d97706" : "#94a3b8" }} />
              <span className="text-[9px] sm:text-[10px] tracking-tight truncate max-w-full">
                {lang === "bn" ? "অ্যাডমিন" : "Admin"}
              </span>
            </button>
          )}
          </div>
        </div>
      )}

      {/* Elegant Scroll to Top Floating Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-24 md:bottom-10 right-6 z-40 flex items-center justify-center h-12 w-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 border border-emerald-500/20 cursor-pointer hover:scale-105 active:scale-95 transition-all"
            title={lang === "bn" ? "উপরে যান" : "Scroll to Top"}
          >
            <ChevronUp className="h-6 w-6 stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>

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
