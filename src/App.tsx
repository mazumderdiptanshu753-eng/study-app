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
  BookMarked,
  Search
} from "lucide-react";
import GlobalSearchModal from "./components/GlobalSearchModal";
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
import ServerWakeOverlay from "./components/ServerWakeOverlay";
import AppUpdateOverlay from "./components/AppUpdateOverlay";
import OfflineIndicator from "./components/OfflineIndicator";
import { StudyNote, UserStats, Subject, GradeLevel, StudentProfile, isPermanentAdmin } from "./types";
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

  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
          const isUserAdmin = isPermanentAdmin(parsed?.email);
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
    return localStorage.getItem("client_app_version") || "2.6.6";
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
        // Automatic full-screen update splash trigger removed per user request.
      }
    } catch (e) {
      console.warn("Failed to check app version:", e);
    }
  };

  const startUpdateProcess = (targetVersion?: string, isTest?: boolean) => {
    setShowUpdateModal(false);
    setIsUpdatingApp(true);
    setUpdateProgress(0);
    setUpdateStatusStep(lang === "bn" ? "নতুন আপডেট প্যাকেজ ডাউনলোড হচ্ছে..." : "Downloading update package...");

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 6;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setUpdateProgress(100);
        setUpdateStatusStep(lang === "bn" ? "স্টাডি হাব প্রস্তুত! রিস্টার্ট হচ্ছে..." : "Study Hub ready! Restarting...");
        clearInterval(interval);
        
        if (isTest) {
          // Preview mode: finish test without persistent bump or hard reload
          setTimeout(() => {
            setIsUpdatingApp(false);
            setUpdateProgress(0);
            setShowUpdateSuccessToast(true);
            setTimeout(() => setShowUpdateSuccessToast(false), 5000);
          }, 1800);
          return;
        }

        // Persist the updated version code in localStorage
        const versionToSave = targetVersion || serverVersionInfo?.latestVersion || "2.6.7";
        localStorage.setItem("client_app_version", versionToSave);
        localStorage.setItem("just_updated", "true");
        setCurrentClientVersion(versionToSave);
        
        // Notify the user about their device's successful automatic update
        if (profile?.email) {
          safeFetch("/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: "অ্যাপ সফলভাবে আপডেট হয়েছে! 🎉",
              message: lang === "bn" 
                ? `আপনার ডিভাইসটি সফলভাবে v${versionToSave} সংস্করণে আপডেট করা হয়েছে।`
                : `Your device was successfully updated to version v${versionToSave}.`,
              type: "info",
              userEmail: profile.email
            })
          }).catch(err => console.warn("Failed to post update completed notification:", err));
        }
        
        setTimeout(() => {
          window.location.reload();
        }, 1600);
      } else {
        setUpdateProgress(currentProgress);
        if (currentProgress < 25) {
          setUpdateStatusStep(lang === "bn" ? "প্যাকেজ ফাইল ও রিসোর্স ডাউনলোড হচ্ছে..." : "Downloading update package...");
        } else if (currentProgress < 50) {
          setUpdateStatusStep(lang === "bn" ? "রিসোর্স যাচাই এবং এক্সট্র্যাক্ট করা হচ্ছে..." : "Verifying & extracting assets...");
        } else if (currentProgress < 75) {
          setUpdateStatusStep(lang === "bn" ? "ক্লাউড ডাটাবেস ও সিস্টেম কনফিগারেশন সিঙ্ক হচ্ছে..." : "Synchronizing system configuration...");
        } else {
          setUpdateStatusStep(lang === "bn" ? "নতুন ফিচার প্রয়োগ ও রিস্টার্ট প্রস্তুতি..." : "Finalizing system upgrade...");
        }
      }
    }, 350);
  };

  useEffect(() => {
    const handleTriggerUpdate = (e: any) => {
      const targetV = e.detail?.targetVersion;
      if (e.detail?.changelogBn || e.detail?.changelogEn) {
        setServerVersionInfo(prev => ({
          latestVersion: targetV || prev?.latestVersion || "2.6.7",
          changelogEn: e.detail?.changelogEn || prev?.changelogEn || "",
          changelogBn: e.detail?.changelogBn || prev?.changelogBn || ""
        }));
      }
      startUpdateProcess(targetV, e.detail?.isTest);
    };
    window.addEventListener("studyhub_trigger_update", handleTriggerUpdate);
    return () => window.removeEventListener("studyhub_trigger_update", handleTriggerUpdate);
  }, []);

  useEffect(() => {
    const timer = setTimeout(checkAppVersion, 1200);
    const interval = setInterval(() => {
      if (!document.hidden) {
        checkAppVersion();
      }
    }, 6000);
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
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
  }, [themeId]);

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
        if (!isPermanentAdmin(newProfile.email)) {
          alert(lang === "bn" ? "অ্যাপটিতে বর্তমানে রক্ষণাবেক্ষণ চলছে। শুধুমাত্র অ্যাডমিনরা এখন লগইন করতে পারবেন।" : "The app is currently under maintenance. Only Admins can login right now.");
          return;
        }
      }
    }
    
    if (existingUser && existingUser.role === "Admin") {
      newProfile.role = "Admin";
      newProfile.avatarUrl = "👑";
    }

    // Explicitly grant Admin role to permanent admin accounts
    if (isPermanentAdmin(newProfile?.email)) {
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
    <>
      {/* Full-screen splash update screen covering the entire screen for all users */}
      <AppUpdateOverlay
        isUpdating={isUpdatingApp}
        targetVersion={serverVersionInfo?.latestVersion}
        progress={updateProgress}
        statusStep={updateStatusStep}
        lang={lang}
        changelogBn={serverVersionInfo?.changelogBn}
        changelogEn={serverVersionInfo?.changelogEn}
      />

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
          className={`w-full flex ${profile ? "md:h-screen md:overflow-hidden flex-col md:flex-row min-h-screen" : "min-h-screen flex-col"} ${theme.bgPage} ${theme.textMain} font-sans antialiased transition-colors duration-300`}
        >
          {/* Elegant Desktop Left Sidebar Workspace Navigation */}
          {profile && (
            <aside className={`hidden md:flex flex-col w-72 shrink-0 border-r ${theme.borderCard} ${theme.bgCard} h-[100vh] sticky top-0 z-30 transition-all duration-300 overflow-y-auto overflow-x-hidden p-5 shadow-xs`}>
              {/* Top Brand Area */}
              <div className={`flex items-center justify-between pb-5 mb-5 border-b ${theme.borderCard}`}>
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <AppLogo size="md" />
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div className="leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-sm tracking-tight text-slate-900">
                        STUDY HUB
                      </span>
                      <Sparkles className="h-3 w-3 text-amber-500" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block mt-0.5">
                      {lang === "bn" ? "অধ্যয়ন ও এআই হাব" : "LEARN & AI SPACE"}
                    </span>
                  </div>
                </div>
                <OfflineIndicator lang={lang} variant="pill" />
              </div>

              {/* User Profile Summary Card inside Sidebar */}
              <div className={`mb-5 p-3.5 rounded-2xl border ${theme.borderCard} bg-gradient-to-br ${theme.heroGradient} flex flex-col gap-2.5 relative overflow-hidden group`}>
                <div 
                  onClick={() => setCurrentTab("profile")}
                  className="flex items-center gap-3 cursor-pointer hover:bg-white/80 p-1.5 -m-1.5 rounded-xl transition-all duration-200 group/profile-card"
                  title={lang === "bn" ? "অ্যাকাউন্ট প্রোফাইল দেখুন" : "View Account Profile"}
                >
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-base shadow-xs select-none group-hover/profile-card:scale-105 transition-transform duration-200 shrink-0">
                    {profile.avatarUrl && (profile.avatarUrl.startsWith("http") || profile.avatarUrl.startsWith("data:image")) ? (
                      <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                    ) : (
                      profile.avatarUrl || "🎓"
                    )}
                  </div>
                  <div className="flex-1 min-w-0 leading-tight">
                    <span className="font-black text-xs block truncate text-slate-900 group-hover/profile-card:text-emerald-700 transition-colors">
                      {profile.name || profile.fullName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium truncate block mt-0.5">
                      {profile.email}
                    </span>
                  </div>
                </div>
                <div className={`flex items-center justify-between border-t border-slate-200/80 pt-2.5 mt-0.5`}>
                  {profile.role === "Admin" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-black tracking-wide rounded-md bg-amber-500/15 text-amber-700 border border-amber-500/30 uppercase shrink-0">
                      👑 {lang === "bn" ? "এডমিন" : "Admin"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-black tracking-wide rounded-md bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 uppercase shrink-0">
                      🎓 {lang === "bn" ? "শিক্ষার্থী" : "Student"}
                    </span>
                  )}
                  
                  <div className="flex items-center gap-1 shrink-0">
                    <motion.button
                      onClick={() => setCurrentTab("profile")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center h-7 w-7 rounded-lg bg-white/80 hover:bg-emerald-500/15 text-slate-600 hover:text-emerald-700 border border-slate-200/60 transition-all cursor-pointer shadow-3xs"
                      title={lang === "bn" ? "অ্যাকাউন্ট সেটিংস" : "Account Settings"}
                    >
                      <User className="h-3.5 w-3.5" />
                    </motion.button>

                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center h-7 w-7 rounded-lg bg-white/80 hover:bg-rose-500/15 text-slate-600 hover:text-rose-600 border border-slate-200/60 transition-all cursor-pointer shadow-3xs group/logout"
                      title={lang === "bn" ? "লগ আউট" : "Sign Out"}
                    >
                      <LogOut className="h-3.5 w-3.5 transition-transform duration-200 group-hover/logout:translate-x-0.5" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Navigation Items List */}
              <div className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1">
                {/* Global Search Quick Trigger Bar */}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="w-full mb-2 px-3 py-2 rounded-xl border border-indigo-200/80 bg-white/85 hover:border-indigo-400 hover:bg-white flex items-center justify-between text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-3xs group active:scale-98"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-indigo-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px]">{lang === "bn" ? "খুঁজুন (নোটস, প্রশ্ন)..." : "Search Anything..."}</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 rounded bg-indigo-50 text-[10px] font-mono border border-indigo-200 text-indigo-600 font-bold">⌘K</kbd>
                </button>

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
                      className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isActive
                          ? `${theme.primaryText} ${theme.primaryBg} shadow-xs border ${theme.borderCard}`
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                      }`}
                    >
                      <IconComp className="h-4 w-4" />
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
                    className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      currentTab === "admin"
                        ? `text-amber-700 bg-amber-100/80 border border-amber-300/80 shadow-xs`
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                    }`}
                  >
                    <Shield className="h-4 w-4 text-amber-500" />
                    <span>{lang === "bn" ? "অ্যাডমিন প্যানেল" : "Admin Panel"}</span>
                    {currentTab === "admin" && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500" />
                    )}
                  </button>
                )}
              </div>

              {/* Sidebar Footer: Theme & Language Controls */}
              <div className="border-t border-slate-200/70 pt-3.5 mt-auto flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                      {lang === "bn" ? "থিম" : "Theme"}
                    </span>
                    <div className="flex items-center gap-1">
                      {(["emerald", "cosmic", "aurora", "sunset"] as ThemeId[]).map((tId) => (
                        <button
                          key={tId}
                          onClick={() => {
                            setThemeId(tId);
                            localStorage.setItem("app_theme_id", tId);
                          }}
                          className={`h-6 w-6 rounded-lg flex items-center justify-center text-xs transition-all duration-200 active:scale-90 border cursor-pointer ${
                            themeId === tId
                              ? `${theme.primaryBg} ${theme.primaryText} ${theme.borderCard} scale-105 shadow-3xs`
                              : "border-transparent hover:bg-white/80 text-slate-600"
                          }`}
                          title={THEMES[tId].nameEn}
                        >
                          {THEMES[tId].icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/70 pt-2.5">
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                    {lang === "bn" ? "ভাষা" : "Language"}
                  </span>
                  
                  {/* Language switch */}
                  <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-slate-200 bg-slate-100/80">
                    <button
                      onClick={() => handleLanguageChange("en")}
                      className={`px-2.5 py-0.5 text-[10px] font-black rounded-md transition-all cursor-pointer ${
                        lang === "en"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => handleLanguageChange("bn")}
                      className={`px-2.5 py-0.5 text-[10px] font-black rounded-md transition-all cursor-pointer ${
                        lang === "bn"
                          ? "bg-white text-slate-900 shadow-xs"
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
              <header className={`md:hidden flex items-center justify-between px-4 h-14 border-b ${theme.borderCard} bg-white/95 backdrop-blur-xl z-25 sticky top-0 shadow-xs`}>
                <button 
                  onClick={() => setCurrentTab("dashboard")}
                  className="flex items-center gap-2.5 text-left"
                >
                  <AppLogo size="sm" />
                  <div>
                    <span className="font-black text-xs block tracking-tight text-slate-900">
                      STUDY HUB
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 block tracking-wider uppercase">
                      {lang === "bn" ? "অধ্যয়ন ও এআই" : "LEARN & AI"}
                    </span>
                  </div>
                </button>
                
                <div className="flex items-center gap-1.5">
                  <OfflineIndicator lang={lang} variant="pill" />

                  {/* Global Search Mobile Trigger */}
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="flex items-center justify-center h-8 w-8 rounded-xl bg-white border border-indigo-200/80 text-slate-700 transition-all cursor-pointer active:scale-95 shadow-3xs"
                    title={lang === "bn" ? "সার্চ করুন" : "Global Search"}
                  >
                    <Search className="w-3.5 h-3.5 text-indigo-500" />
                  </button>

                  {/* Language Toggle */}
                  <button
                    onClick={() => handleLanguageChange(lang === "en" ? "bn" : "en")}
                    className="flex items-center justify-center gap-1 h-8 px-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-[10px] font-extrabold text-emerald-700 transition-all cursor-pointer active:scale-95"
                    title={lang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
                  >
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

            {/* Subtle Top Offline Banner Bar */}
            <OfflineIndicator lang={lang} variant="banner" />

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
                  className="mb-5 self-start flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white/90 text-slate-700 hover:text-slate-900 hover:bg-white text-xs font-bold shadow-3xs backdrop-blur-sm transition-all duration-250 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-indigo-500" />
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
                  currentVersion={currentClientVersion}
                  latestVersion={serverVersionInfo?.latestVersion}
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
        <div className="md:hidden fixed bottom-3 left-3 right-3 z-50 pb-[env(safe-area-inset-bottom,0px)] flex justify-center pointer-events-none">
          <div className="flex justify-around items-center w-full max-w-lg mx-auto h-16 px-2 rounded-[1.75rem] shadow-[0_12px_40px_rgba(99,102,241,0.12)] backdrop-blur-2xl pointer-events-auto bg-white/95 border border-indigo-100">
          {[
            { id: "dashboard", labelEn: "Dashboard", labelBn: "ড্যাশবোর্ড", icon: GraduationCap },
            { id: "notes", labelEn: "Notes", labelBn: "নোটস", icon: BookOpen },
            { id: "school", labelEn: "School", labelBn: "স্কুল", icon: BookMarked },
            { id: "chat", labelEn: "Support", labelBn: "সহায়তা", icon: MessageSquare },
            { id: "liveClasses", labelEn: "Live", labelBn: "লাইভ", icon: Radio },
            ...(profile.role === "Admin" ? [{ id: "admin", labelEn: "Admin", labelBn: "অ্যাডমিন", icon: Shield }] : [])
          ].map((item) => {
            const IconComp = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id as any);
                  setSelectedNote(null);
                }}
                className={`relative flex flex-col items-center justify-center flex-1 py-1.5 h-full transition-all cursor-pointer ${
                  isActive
                    ? `${item.id === "admin" ? "text-amber-600 font-black" : `${theme.primaryText} font-black`}`
                    : "text-slate-500 hover:text-slate-700 font-semibold"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-dock-pill"
                    className="absolute inset-x-1 inset-y-1.5 rounded-2xl bg-indigo-500/10 -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}
                <IconComp className={`h-5 w-5 mb-0.5 transition-transform ${isActive ? "scale-110" : ""}`} />
                <span className="text-[9px] sm:text-[10px] tracking-tight truncate max-w-full font-bold">
                  {lang === "bn" ? item.labelBn : item.labelEn}
                </span>
              </button>
            );
          })}
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


      {/* Persistent Global Server Wake Loading Overlay */}
      <ServerWakeOverlay lang={lang} />

      {/* Dynamic Update Success Toast */}
      <AnimatePresence>
        {showUpdateSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] w-full max-w-sm px-4"
          >
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white rounded-2xl p-4 shadow-2xl border border-emerald-300/40 flex items-start gap-3.5 relative overflow-hidden backdrop-blur-xl">
              {/* Highlight background glow */}
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
              
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center text-white border border-white/30 shrink-0">
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

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        lang={lang}
        theme={theme}
        userNotes={notes}
        onNavigate={(tab, extraData) => {
          setCurrentTab(tab as any);
          if (extraData?.noteData) {
            setSelectedNote(extraData.noteData);
          } else {
            setSelectedNote(null);
          }
        }}
      />

    </motion.div>
    )}
  </AnimatePresence>
  </>
  );
}
