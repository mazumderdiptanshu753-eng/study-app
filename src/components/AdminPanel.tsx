import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, Search, Shield, ShieldCheck, UserCheck, UserMinus, Calendar, GraduationCap, Mail, Activity, LogIn, LogOut, Trash2, CloudLightning, RefreshCw, Check, AlertTriangle } from "lucide-react";
import { StudentProfile } from "../types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Language } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";

interface AdminPanelProps {
  lang: Language;
  users: StudentProfile[];
  onToggleAdminRole: (email: string) => void;
  onDeleteUser: (email: string) => void;
  currentUserEmail: string;
  theme: ThemeConfig;
}

interface ActivityLog {
  id: string;
  userEmail: string;
  userName: string;
  action: "Login" | "Logout";
  timestamp: string;
}

export default function AdminPanel({ lang, users, onToggleAdminRole, onDeleteUser, currentUserEmail, theme }: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "logs" | "recovery">("users");
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const [recovering, setRecovering] = useState(false);
  const [recoveryStatus, setRecoveryStatus] = useState<any>(null);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  const handleRecoverFirestore = async () => {
    if (recovering) return;
    setRecovering(true);
    setRecoveryError(null);
    setRecoveryStatus(null);

    try {
      console.log("Starting Firestore collections retrieval...");
      
      const fetchCol = async (name: string) => {
        try {
          const snap = await getDocs(collection(db, name));
          return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (err) {
          console.warn(`Could not fetch collection ${name}:`, err);
          return [];
        }
      };

      const [
        usersData,
        studyNotesData,
        chatMessagesData,
        forumPostsData,
        liveClassesData,
        activityLogsData,
        govtJobNotesData,
        aiPdfNotesData
      ] = await Promise.all([
        fetchCol("users"),
        fetchCol("notes"),
        fetchCol("chatMessages"),
        fetchCol("forumPosts"),
        fetchCol("liveClasses"),
        fetchCol("activityLogs"),
        fetchCol("govtJobNotes"),
        fetchCol("aiPdfNotes")
      ]);

      const formattedStudyNotes = studyNotesData.map((note: any) => ({
        id: note.id,
        title: note.title || note.subject || "Untitled Note",
        content: note.content || note.text || "",
        timestamp: note.timestamp || note.createdAt || new Date().toISOString(),
        userEmail: note.userEmail || note.email || note.studentEmail || currentUserEmail
      }));

      const formattedChatMessages = chatMessagesData.map((msg: any) => ({
        id: msg.id,
        senderEmail: msg.senderEmail || msg.studentEmail || "",
        senderName: msg.senderName || msg.studentName || "",
        senderRole: msg.senderRole || msg.role || "Student",
        message: msg.message || msg.text || "",
        timestamp: msg.timestamp || msg.createdAt || new Date().toISOString(),
        avatarUrl: msg.avatarUrl || ""
      }));

      const formattedForumPosts = forumPostsData.map((post: any) => ({
        id: post.id,
        title: post.title || "",
        content: post.content || "",
        authorName: post.authorName || "",
        authorEmail: post.authorEmail || "",
        authorRole: post.authorRole || "",
        category: post.category || "General",
        timestamp: post.timestamp || new Date().toISOString(),
        replies: Array.isArray(post.replies) ? post.replies : []
      }));

      const formattedLiveClasses = liveClassesData.map((cls: any) => ({
        id: cls.id,
        title: cls.title || "",
        instructor: cls.instructor || "",
        scheduledAt: cls.scheduledAt || cls.date || new Date().toISOString(),
        duration: cls.duration || 60,
        meetingUrl: cls.meetingUrl || "",
        status: cls.status || "upcoming",
        subject: cls.subject || "General",
        grade: cls.grade || "All"
      }));

      const formattedActivityLogs = activityLogsData.map((log: any) => ({
        id: log.id,
        userEmail: log.userEmail || log.email || "",
        userName: log.userName || log.name || "Unknown",
        action: log.action || "Login",
        timestamp: log.timestamp || new Date().toISOString()
      }));

      const formattedGovtJobNotes = govtJobNotesData.map((note: any) => ({
        id: note.id,
        title: note.title || "",
        category: note.category || "General",
        content: note.content || "",
        attachments: Array.isArray(note.attachments) ? note.attachments : [],
        timestamp: note.timestamp || new Date().toISOString(),
        authorEmail: note.authorEmail || currentUserEmail,
        authorName: note.authorName || "Admin",
        comments: Array.isArray(note.comments) ? note.comments : []
      }));

      const formattedAiPdfNotes = aiPdfNotesData.map((note: any) => ({
        id: note.id,
        title: note.title || "",
        fileName: note.fileName || "",
        content: note.content || "",
        extractedNotes: note.extractedNotes || "",
        summary: note.summary || "",
        tips: note.tips || [],
        flashcards: note.flashcards || [],
        quiz: note.quiz || [],
        userEmail: note.userEmail || currentUserEmail,
        timestamp: note.timestamp || new Date().toISOString()
      }));

      const formattedUsers = usersData.map((u: any) => ({
        email: u.email,
        fullName: u.fullName || u.name || "",
        grade: u.grade || "12th",
        preferredSubject: u.preferredSubject || u.subject || "General",
        registeredAt: u.registeredAt || u.createdAt || new Date().toISOString(),
        avatarUrl: u.avatarUrl || "",
        role: u.role || "Student"
      }));

      const payload = {
        users: formattedUsers,
        studyNotes: formattedStudyNotes,
        chatMessages: formattedChatMessages,
        forumPosts: formattedForumPosts,
        liveClasses: formattedLiveClasses,
        activityLogs: formattedActivityLogs,
        govtJobNotes: formattedGovtJobNotes,
        aiPdfNotes: formattedAiPdfNotes
      };

      const res = await fetch("/api/recover-firestore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`);
      }

      const result = await res.json();
      if (result.success) {
        setRecoveryStatus(result.results);
      } else {
        throw new Error(result.error || "Recovery failed");
      }
    } catch (err: any) {
      console.error("Recovery failed:", err);
      setRecoveryError(err.message || String(err));
    } finally {
      setRecovering(false);
    }
  };

  const isBengali = lang === "bn";

  const fetchLogs = async (isPolling = false) => {
    if (!isPolling) setLoadingLogs(true);
    try {
      const res = await fetch("/api/activity-logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error("Failed to fetch logs:", e);
    } finally {
      if (!isPolling) setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (activeTab === "logs") {
      fetchLogs();
      const interval = setInterval(() => fetchLogs(true), 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const t = {
    title: isBengali ? "ব্যবহারকারী এবং প্রশাসক নিয়ন্ত্রণ প্যানেল" : "User & Admin Control Panel",
    subtitle: isBengali 
      ? "নিবন্ধিত সকল শিক্ষার্থী দেখুন এবং নতুন প্রশাসক নিয়োগ করুন।" 
      : "Manage registered members, inspect student details, and assign administrative privileges.",
    searchPlaceholder: isBengali ? "নাম বা ইমেল দিয়ে খুঁজুন..." : "Search by name or email...",
    totalUsers: isBengali ? "মোট ব্যবহারকারী" : "Total Registered Users",
    adminCount: isBengali ? "মোট প্রশাসক" : "Administrators",
    studentCount: isBengali ? "মোট শিক্ষার্থী" : "Students",
    nameHeader: isBengali ? "ব্যবহারকারী" : "User Info",
    detailsHeader: isBengali ? "শ্রেণী ও বিষয়" : "Grade & Subject",
    registeredHeader: isBengali ? "নিবন্ধনের তারিখ" : "Registered At",
    roleHeader: isBengali ? "ভূমিকা (Role)" : "Current Role",
    actionsHeader: isBengali ? "অ্যাকশন" : "Administrative Actions",
    makeAdmin: isBengali ? "প্রশাসক করুন" : "Make Admin",
    revokeAdmin: isBengali ? "প্রশাসক সরান" : "Revoke Admin",
    deleteUser: isBengali ? "মুছে ফেলুন" : "Delete User",
    primaryAdminBadge: isBengali ? "প্রধান অ্যাডমিন" : "Primary Admin",
    noUsersFound: isBengali ? "কোনো ব্যবহারকারী খুঁজে পাওয়া যায়নি।" : "No registered users match your search query.",
    actionSuccess: isBengali ? "ভূমিকা সফলভাবে পরিবর্তন করা হয়েছে!" : "User role updated successfully!",
    cannotModifySelf: isBengali ? "আপনি নিজের ভূমিকা পরিবর্তন করতে পারবেন না।" : "You cannot modify your own administrator role.",
    cannotModifyPrimary: isBengali ? "প্রধান অ্যাডমিনকে পরিবর্তন করা সম্ভব নয়।" : "The primary system administrator cannot be demoted."
  };

  const validUsers = users.filter(u => u && u.email && u.fullName);
  const filteredUsers = validUsers.filter(user => 
    (user?.fullName || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
    (user?.email || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  const totalRegistered = users.length;
  const adminsCount = users.filter(u => u?.role === "Admin").length;
  const studentsCount = users.filter(u => u?.role === "Student").length;

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(isBengali ? "bn-BD" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (e) {
      return isoString;
    }
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
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-7xl mx-auto pb-12"
    >
      
      {/* Header section with styling and safe area */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-teal-700/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 rounded-lg text-xs font-bold text-teal-300 tracking-wider uppercase">
            <Shield className="h-3.5 w-3.5 animate-pulse" />
            {isBengali ? "প্রশাসক প্যানেল" : "System Administration"}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t.title}</h1>
          <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-2xl leading-relaxed">{t.subtitle}</p>
        </div>
      </motion.div>

      {/* Stats Summary Bento Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Users Stat Card */}
        <div className={`${theme.bgCard} rounded-xl border ${theme.borderCard} p-5 flex items-center gap-4 shadow-3xs hover:shadow-2xs transition-shadow`}>
          <div className="h-12 w-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500 shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className={`text-[10px] uppercase font-bold ${theme.textMuted} tracking-wider block`}>{t.totalUsers}</span>
            <span className={`text-2xl font-black ${theme.textHeading}`}>{totalRegistered}</span>
          </div>
        </div>

        {/* Total Admins Stat Card */}
        <div className={`${theme.bgCard} rounded-xl border ${theme.borderCard} p-5 flex items-center gap-4 shadow-3xs hover:shadow-2xs transition-shadow`}>
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <span className={`text-[10px] uppercase font-bold ${theme.textMuted} tracking-wider block`}>{t.adminCount}</span>
            <span className={`text-2xl font-black ${theme.textHeading}`}>{adminsCount}</span>
          </div>
        </div>

        {/* Total Students Stat Card */}
        <div className={`${theme.bgCard} rounded-xl border ${theme.borderCard} p-5 flex items-center gap-4 shadow-3xs hover:shadow-2xs transition-shadow`}>
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <span className={`text-[10px] uppercase font-bold ${theme.textMuted} tracking-wider block`}>{t.studentCount}</span>
            <span className={`text-2xl font-black ${theme.textHeading}`}>{studentsCount}</span>
          </div>
        </div>

      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex space-x-2 border-b border-slate-700/20 mb-6 px-1">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "users" ? "border-teal-500 text-teal-400" : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          <Users className="h-4 w-4" />
          {isBengali ? "ব্যবহারকারী ব্যবস্থাপনা" : "User Management"}
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "logs" ? "border-teal-500 text-teal-400" : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          <Activity className="h-4 w-4" />
          {isBengali ? "অ্যাক্টিভিটি লগ" : "Activity Logs"}
        </button>
        <button
          onClick={() => setActiveTab("recovery")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "recovery" ? "border-teal-500 text-teal-400" : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          <CloudLightning className="h-4 w-4" />
          {isBengali ? "ডেটা পুনরুদ্ধার" : "Data Recovery"}
        </button>
      </motion.div>

      {activeTab === "users" && (
        <motion.div variants={itemVariants} className={`${theme.bgCard} rounded-xl border ${theme.borderCard} shadow-3xs overflow-hidden`}>
          
          {/* Search header bar */}
          <div className={`p-4 sm:p-5 border-b ${theme.borderCard} bg-slate-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${theme.textMuted}`} />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${theme.bgPage} pl-10 pr-4 py-2.5 rounded-xl border ${theme.borderCard} text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${theme.textMain} placeholder:text-slate-400`}
              />
            </div>
          </div>

        {/* Users Table / List */}
        {filteredUsers.length === 0 ? (
          <div className={`p-12 text-center ${theme.textMuted} font-medium`}>
            <Users className="h-12 w-12 opacity-30 mx-auto mb-3" />
            <p className="text-sm">{t.noUsersFound}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${theme.borderCard} bg-slate-500/5 ${theme.textMuted} font-bold text-[10px] tracking-wider uppercase`}>
                  <th className="py-4 px-6">{t.nameHeader}</th>
                  <th className="py-4 px-6 hidden sm:table-cell">{t.registeredHeader}</th>
                  <th className="py-4 px-6 text-center">{t.roleHeader}</th>
                  <th className="py-4 px-6 text-right">{t.actionsHeader}</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme.borderCard}`}>
                {filteredUsers.map((user) => {
                  const isPrimaryAdmin = (user?.email || "").trim().toLowerCase() === "mazumderdiptanshu753@gmail.com";
                  const isSelf = (user?.email || "").trim().toLowerCase() === (currentUserEmail || "").trim().toLowerCase();

                  return (
                    <tr key={user?.email || Math.random().toString()} className="hover:bg-slate-500/5 transition-colors">
                      
                      {/* Name and Email */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="min-w-0">
                            <span className={`font-bold text-xs ${theme.textHeading} block truncate`}>{user.fullName}</span>
                            <span className={`text-[10px] ${theme.textMuted} font-medium block truncate max-w-[180px] sm:max-w-xs`}>{user.email}</span>
                          </div>
                        </div>
                      </td>



                      {/* Registration Date */}
                      <td className={`py-4 px-6 hidden sm:table-cell text-xs font-semibold ${theme.textMuted}`}>
                        <div className="flex items-center gap-1.5">
                          <Calendar className={`h-3.5 w-3.5 ${theme.textMuted}`} />
                          {formatDate(user.registeredAt)}
                        </div>
                      </td>

                      {/* Current Role Badge */}
                      <td className="py-4 px-6 text-center">
                        {user.role === "Admin" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-[9px] font-black tracking-wide rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30">
                            <ShieldCheck className="h-3 w-3" />
                            {isBengali ? "প্রশাসক" : "Admin"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-[9px] font-black tracking-wide rounded-lg bg-slate-500/10 text-slate-600 border border-slate-500/20 uppercase dark:text-slate-300 dark:bg-slate-800/40 dark:border-slate-700/50">
                            {isBengali ? "শিক্ষার্থী" : "Student"}
                          </span>
                        )}
                      </td>

                      {/* Administrative actions */}
                      <td className="py-4 px-6 text-right">
                        {isPrimaryAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-[9px] font-bold rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                            {t.primaryAdminBadge}
                          </span>
                        ) : isSelf ? (
                          <span className={`text-2xs font-semibold ${theme.textMuted} italic`}>
                            {isBengali ? "আপনি নিজে" : "Logged-in Self"}
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onToggleAdminRole(user.email)}
                              className={`inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer android-ripple ${
                                user.role === "Admin"
                                  ? "bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20 dark:text-rose-400 dark:bg-rose-950/30 dark:border-rose-900/30"
                                  : "bg-teal-500/10 border-teal-500/20 text-teal-600 hover:bg-teal-500/20 dark:text-teal-400 dark:bg-teal-950/30 dark:border-teal-900/30"
                              }`}
                            >
                              {user.role === "Admin" ? (
                                <>
                                  <UserMinus className="h-3.5 w-3.5" />
                                  {t.revokeAdmin}
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-3.5 w-3.5" />
                                  {t.makeAdmin}
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(isBengali ? "আপনি কি নিশ্চিত যে আপনি এই ব্যবহারকারীকে মুছে ফেলতে চান?" : "Are you sure you want to delete this user?")) {
                                  onDeleteUser(user.email);
                                }
                              }}
                              className="inline-flex items-center justify-center p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer"
                              title={t.deleteUser}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
      )}

      {activeTab === "logs" && (
        <motion.div variants={itemVariants} className={`${theme.bgCard} rounded-xl border ${theme.borderCard} shadow-3xs overflow-hidden`}>
          {loadingLogs ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
              <p className={`mt-4 text-sm ${theme.textMuted}`}>
                {isBengali ? "লগ লোড হচ্ছে..." : "Loading activity logs..."}
              </p>
            </div>
          ) : logs.length === 0 ? (
            <div className={`p-12 text-center ${theme.textMuted} font-medium`}>
              <Activity className="h-12 w-12 opacity-30 mx-auto mb-3" />
              <p className="text-sm">
                {isBengali ? "কোনো অ্যাক্টিভিটি লগ পাওয়া যায়নি।" : "No activity logs found."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b ${theme.borderCard} bg-slate-500/5 ${theme.textMuted} font-bold text-[10px] tracking-wider uppercase`}>
                    <th className="py-4 px-6">{isBengali ? "ব্যবহারকারী" : "User Info"}</th>
                    <th className="py-4 px-6">{isBengali ? "অ্যাকশন" : "Action"}</th>
                    <th className="py-4 px-6 text-right">{isBengali ? "তারিখ ও সময়" : "Date & Time"}</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme.borderCard}`}>
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-500/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${theme.bgPage} ${theme.textMain} border ${theme.borderCard}`}>
                            {log.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className={`font-bold text-sm ${theme.textHeading}`}>{log.userName}</div>
                            <div className={`text-xs ${theme.textMuted}`}>{log.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border ${
                          log.action === "Login"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400"
                        }`}>
                          {log.action === "Login" ? <LogIn className="w-3 h-3" /> : <LogOut className="w-3 h-3" />}
                          {log.action}
                        </span>
                      </td>
                      <td className={`py-4 px-6 text-right text-xs font-semibold ${theme.textMuted}`}>
                        <div className="flex flex-col items-end gap-1">
                          <span>{formatDate(log.timestamp)}</span>
                          <span className="text-[10px] opacity-70">
                            {new Date(log.timestamp).toLocaleTimeString(isBengali ? "bn-BD" : "en-US")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "recovery" && (
        <motion.div variants={itemVariants} className="space-y-6">
          <div className={`${theme.bgCard} rounded-xl border ${theme.borderCard} p-6 shadow-3xs space-y-4`}>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500 shrink-0">
                <CloudLightning className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className={`text-lg font-bold ${theme.textHeading}`}>
                  {isBengali ? "ফায়ারস্টোর ক্লাউড ডেটা পুনরুদ্ধার" : "Firestore Cloud Data Recovery"}
                </h3>
                <p className={`text-xs ${theme.textMuted} max-w-2xl leading-relaxed`}>
                  {isBengali 
                    ? "আগের ক্লাউড ফায়ারস্টোর ডাটাবেস থেকে নিবন্ধিত শিক্ষার্থী, স্টাডি নোট, ফোরাম পোস্ট এবং চ্যাট মেসেজ পুনরুদ্ধার করে সরাসরি নিয়ন পোস্টগ্রেএসকিউএল ডাটাবেসে নিয়ে আসুন।"
                    : "Restore registered students, study notes, community forum posts, chat messages, and activity logs from the previous Firebase Firestore cloud database into the new Neon PostgreSQL database."}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/10 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleRecoverFirestore}
                disabled={recovering}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md cursor-pointer disabled:opacity-50 transition-all"
              >
                {recovering ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    {isBengali ? "পুনরুদ্ধার করা হচ্ছে..." : "Recovering Data..."}
                  </>
                ) : (
                  <>
                    <CloudLightning className="h-4 w-4" />
                    {isBengali ? "পুনরুদ্ধার শুরু করুন" : "Begin Recovery"}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Recovery Status Card */}
          {recoveryStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${theme.bgCard} rounded-xl border border-teal-500/20 p-6 shadow-2xs space-y-4`}
            >
              <div className="flex items-center gap-2 text-teal-500 font-bold text-sm">
                <Check className="h-5 w-5 bg-teal-500/10 rounded-full p-0.5" />
                <span>
                  {isBengali ? "ডেটা সফলভাবে পুনরুদ্ধার এবং নিয়ন পোস্টগ্রেএসকিউএল-এ সংরক্ষিত হয়েছে!" : "Historical data successfully recovered and synchronized with Neon PostgreSQL!"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className={`p-4 rounded-xl ${theme.bgPage} border ${theme.borderCard} text-center`}>
                  <span className={`text-[10px] uppercase font-bold ${theme.textMuted} tracking-wider block`}>
                    {isBengali ? "শিক্ষার্থী" : "Students"}
                  </span>
                  <span className={`text-xl font-black ${theme.textHeading} text-teal-400`}>{recoveryStatus.users}</span>
                </div>
                <div className={`p-4 rounded-xl ${theme.bgPage} border ${theme.borderCard} text-center`}>
                  <span className={`text-[10px] uppercase font-bold ${theme.textMuted} tracking-wider block`}>
                    {isBengali ? "স্টাডি নোট" : "Study Notes"}
                  </span>
                  <span className={`text-xl font-black ${theme.textHeading} text-teal-400`}>{recoveryStatus.studyNotes}</span>
                </div>
                <div className={`p-4 rounded-xl ${theme.bgPage} border ${theme.borderCard} text-center`}>
                  <span className={`text-[10px] uppercase font-bold ${theme.textMuted} tracking-wider block`}>
                    {isBengali ? "ফোরাম পোস্ট" : "Forum Posts"}
                  </span>
                  <span className={`text-xl font-black ${theme.textHeading} text-teal-400`}>{recoveryStatus.forumPosts}</span>
                </div>
                <div className={`p-4 rounded-xl ${theme.bgPage} border ${theme.borderCard} text-center`}>
                  <span className={`text-[10px] uppercase font-bold ${theme.textMuted} tracking-wider block`}>
                    {isBengali ? "চ্যাট মেসেজ" : "Chat Messages"}
                  </span>
                  <span className={`text-xl font-black ${theme.textHeading} text-teal-400`}>{recoveryStatus.chatMessages}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Recovery Error Card */}
          {recoveryError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${theme.bgCard} rounded-xl border border-rose-500/20 p-6 shadow-2xs flex items-start gap-4 text-rose-500`}
            >
              <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-sm block">
                  {isBengali ? "পুনরুদ্ধার করতে ব্যর্থ হয়েছে" : "Data Recovery Failed"}
                </span>
                <p className={`text-xs ${theme.textMuted} font-medium`}>{recoveryError}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
