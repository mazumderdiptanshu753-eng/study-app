import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, Search, Shield, ShieldCheck, UserCheck, UserMinus, Calendar, GraduationCap, Mail, Activity, LogIn, LogOut, Trash2, ArrowUpCircle, RefreshCcw } from "lucide-react";
import { StudentProfile } from "../types";
import { Language } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";

interface AdminPanelProps {
  lang: Language;
  users: StudentProfile[];
  onToggleAdminRole: (email: string) => void;
  onDeleteUser: (email: string) => void;
  currentUserEmail: string;
  theme: ThemeConfig;
  currentAppVersion: string;
}

interface ActivityLog {
  id: string;
  userEmail: string;
  userName: string;
  action: "Login" | "Logout";
  timestamp: string;
}

export default function AdminPanel({ lang, users, onToggleAdminRole, onDeleteUser, currentUserEmail, theme, currentAppVersion }: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "logs" | "updates">("users");
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // App Release Update states
  const [newVersion, setNewVersion] = useState("");
  const [changelogEn, setChangelogEn] = useState("");
  const [changelogBn, setChangelogBn] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  const handlePublishUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateMessage(null);

    if (!newVersion.trim()) {
      setUpdateMessage({
        type: "error",
        text: isBengali ? "সংস্করণ নম্বর আবশ্যক।" : "Version number is required."
      });
      return;
    }

    setIsPublishing(true);
    try {
      const res = await fetch("/api/app-version", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-email": currentUserEmail
        },
        body: JSON.stringify({
          latestVersion: newVersion.trim(),
          changelogEn: changelogEn.trim(),
          changelogBn: changelogBn.trim(),
          adminEmail: currentUserEmail
        })
      });

      if (res.ok) {
        setUpdateMessage({
          type: "success",
          text: isBengali 
            ? `সংস্করণ v${newVersion} সফলভাবে প্রকাশ করা হয়েছে! সব শিক্ষার্থীর ডিভাইস স্বয়ংক্রিয়ভাবে আপডেট হবে।`
            : `Version v${newVersion} released successfully! All users will be automatically updated.`
        });
        setNewVersion("");
        setChangelogEn("");
        setChangelogBn("");
      } else {
        const err = await res.json();
        setUpdateMessage({
          type: "error",
          text: err.error || (isBengali ? "আপডেট প্রকাশ করতে ব্যর্থ হয়েছে।" : "Failed to release update.")
        });
      }
    } catch (err) {
      setUpdateMessage({
        type: "error",
        text: isBengali ? "সার্ভার সংযোগ ত্রুটি।" : "Server connection error."
      });
    } finally {
      setIsPublishing(false);
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
      className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-12 px-1 sm:px-0"
    >
      
      {/* Header section with styling and safe area */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-lg border border-teal-700/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-teal-500/20 rounded-lg text-[10px] sm:text-xs font-bold text-teal-300 tracking-wider uppercase">
            <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-pulse" />
            {isBengali ? "প্রশাসক প্যানেল" : "System Administration"}
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">{t.title}</h1>
          <p className="text-[11px] sm:text-xs md:text-sm text-teal-100 font-medium max-w-2xl leading-relaxed">{t.subtitle}</p>
        </div>
      </motion.div>

      {/* Stats Summary Bento Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        
        {/* Total Users Stat Card */}
        <div className={`${theme.bgCard} rounded-xl border ${theme.borderCard} p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-3xs hover:shadow-2xs transition-shadow`}>
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500 shrink-0">
            <Users className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <span className={`text-[9px] sm:text-[10px] uppercase font-bold ${theme.textMuted} tracking-wider block`}>{t.totalUsers}</span>
            <span className={`text-lg sm:text-2xl font-black ${theme.textHeading}`}>{totalRegistered}</span>
          </div>
        </div>

        {/* Total Admins Stat Card */}
        <div className={`${theme.bgCard} rounded-xl border ${theme.borderCard} p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-3xs hover:shadow-2xs transition-shadow`}>
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
            <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <span className={`text-[9px] sm:text-[10px] uppercase font-bold ${theme.textMuted} tracking-wider block`}>{t.adminCount}</span>
            <span className={`text-lg sm:text-2xl font-black ${theme.textHeading}`}>{adminsCount}</span>
          </div>
        </div>

        {/* Total Students Stat Card */}
        <div className={`${theme.bgCard} rounded-xl border ${theme.borderCard} p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-3xs hover:shadow-2xs transition-shadow`}>
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <span className={`text-[9px] sm:text-[10px] uppercase font-bold ${theme.textMuted} tracking-wider block`}>{t.studentCount}</span>
            <span className={`text-lg sm:text-2xl font-black ${theme.textHeading}`}>{studentsCount}</span>
          </div>
        </div>

      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex space-x-1 sm:space-x-2 border-b border-slate-700/20 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none pb-px">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors shrink-0 ${
            activeTab === "users" ? "border-teal-500 text-teal-400" : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          {isBengali ? "ব্যবহারকারী" : "User Management"}
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors shrink-0 ${
            activeTab === "logs" ? "border-teal-500 text-teal-400" : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          {isBengali ? "অ্যাক্টিভিটি লগ" : "Activity Logs"}
        </button>
        <button
          onClick={() => setActiveTab("updates")}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors shrink-0 ${
            activeTab === "updates" ? "border-teal-500 text-teal-400" : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          <ArrowUpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          {isBengali ? "অ্যাপ আপডেট" : "App Updates"}
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
          <>
            {/* Desktop View Table */}
            <div className="overflow-x-auto hidden sm:block">
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

            {/* Mobile View Card List */}
            <div className="block sm:hidden divide-y divide-slate-500/10">
              {filteredUsers.map((user) => {
                const isPrimaryAdmin = (user?.email || "").trim().toLowerCase() === "mazumderdiptanshu753@gmail.com";
                const isSelf = (user?.email || "").trim().toLowerCase() === (currentUserEmail || "").trim().toLowerCase();
                return (
                  <div key={user?.email || Math.random().toString()} className="p-4 space-y-3">
                    {/* User basic info */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className={`font-bold text-xs ${theme.textHeading} block truncate`}>{user.fullName}</span>
                        <span className={`text-[10px] ${theme.textMuted} font-medium block truncate max-w-[180px]`}>{user.email}</span>
                      </div>
                      <div className="shrink-0">
                        {user.role === "Admin" ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-black tracking-wide rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase">
                            <ShieldCheck className="h-3 w-3" />
                            {isBengali ? "অ্যাডমিন" : "Admin"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-black tracking-wide rounded-md bg-slate-500/10 text-slate-500 border border-slate-500/20 uppercase">
                            {isBengali ? "শিক্ষার্থী" : "Student"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action section for mobile */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-500/5">
                      <span className={`text-[10px] ${theme.textMuted} font-semibold flex items-center gap-1`}>
                        <Calendar className="h-3 w-3" />
                        {formatDate(user.registeredAt)}
                      </span>
                      <div className="shrink-0">
                        {isPrimaryAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                            {t.primaryAdminBadge}
                          </span>
                        ) : isSelf ? (
                          <span className={`text-2xs font-semibold ${theme.textMuted} italic`}>
                            {isBengali ? "আপনি নিজে" : "Logged-in Self"}
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onToggleAdminRole(user.email)}
                              className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                                user.role === "Admin"
                                  ? "bg-rose-500/10 border-rose-500/20 text-rose-500"
                                  : "bg-teal-500/10 border-teal-500/20 text-teal-600"
                              }`}
                            >
                              {user.role === "Admin" ? (
                                <>
                                  <UserMinus className="h-3 w-3" />
                                  {isBengali ? "সরান" : "Revoke"}
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-3 w-3" />
                                  {isBengali ? "অ্যাডমিন" : "Admin"}
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
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
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
            <>
              {/* Desktop View Table */}
              <div className="overflow-x-auto hidden sm:block">
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

              {/* Mobile View Card List */}
              <div className="block sm:hidden divide-y divide-slate-500/10">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-2xs shrink-0 ${theme.bgPage} ${theme.textMain} border ${theme.borderCard}`}>
                          {log.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className={`font-bold text-xs ${theme.textHeading} truncate`}>{log.userName}</div>
                          <div className={`text-[10px] ${theme.textMuted} truncate max-w-[150px]`}>{log.userEmail}</div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold rounded-md border shrink-0 ${
                        log.action === "Login"
                           ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400"
                           : "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400"
                      }`}>
                        {log.action === "Login" ? <LogIn className="w-2.5 h-2.5" /> : <LogOut className="w-2.5 h-2.5" />}
                        {log.action}
                      </span>
                    </div>
                    <div className={`text-[10px] font-semibold ${theme.textMuted} flex justify-between items-center pt-1.5 border-t border-slate-500/5`}>
                      <span>{formatDate(log.timestamp)}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString(isBengali ? "bn-BD" : "en-US")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}

      {activeTab === "updates" && (
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Version Status Overview Card */}
          <div className={`${theme.bgCard} rounded-xl border ${theme.borderCard} p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-3xs`}>
            <div className="space-y-1">
              <h3 className={`text-sm font-black ${theme.textHeading}`}>
                {isBengali ? "বর্তমান সক্রিয় সংস্করণ" : "Current Active Version"}
              </h3>
              <p className={`text-xs ${theme.textMuted}`}>
                {isBengali 
                  ? "স্টাডি হাব বর্তমানে এই সংস্করণে চালিত হচ্ছে।" 
                  : "Study Hub is currently running this production version."}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-lg font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                v{currentAppVersion}
              </span>
            </div>
          </div>

          {/* Release Update Form Card */}
          <div className={`${theme.bgCard} rounded-xl border ${theme.borderCard} p-5 sm:p-6 shadow-3xs space-y-6`}>
            <div className="space-y-1">
              <h3 className={`text-sm font-black ${theme.textHeading}`}>
                {isBengali ? "নতুন অ্যাপ সংস্করণ রিলিজ করুন 🚀" : "Release New App Version 🚀"}
              </h3>
              <p className={`text-xs ${theme.textMuted}`}>
                {isBengali 
                  ? "নতুন আপডেট ফাইল এবং ফিচারের তথ্য দিয়ে সিস্টেম আপগ্রেড রিলিজ করুন।" 
                  : "Deploy a system-wide upgrade with update notes and feature highlights."}
              </p>
            </div>

            {updateMessage && (
              <div className={`p-4 rounded-xl border text-xs font-bold leading-relaxed ${
                updateMessage.type === "success" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                  : "bg-red-500/10 border-red-500/20 text-red-500"
              }`}>
                {updateMessage.text}
              </div>
            )}

            <form onSubmit={handlePublishUpdate} className="space-y-5">
              <div className="grid grid-cols-1 gap-5">
                {/* Version Number Input */}
                <div className="space-y-2">
                  <label className={`text-xs font-extrabold tracking-wide uppercase ${theme.textMuted}`}>
                    {isBengali ? "নতুন সংস্করণ কোড (Version Code) *" : "New Version Code *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 1.0.2"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    className={`w-full ${theme.bgPage} px-4 py-2.5 rounded-xl border ${theme.borderCard} text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${theme.textMain} placeholder:text-slate-400`}
                  />
                  <p className="text-[10px] text-slate-500 font-medium">
                    {isBengali 
                      ? "অবশ্যই বর্তমান সংস্করণের চেয়ে বড় হতে হবে (যেমন: v7.5.1 থেকে v7.5.2)।" 
                      : "Must be incremental to current active version (e.g., v7.5.1 ➔ v7.5.2)."}
                  </p>
                </div>

                {/* Bengali Changelog */}
                <div className="space-y-2">
                  <label className={`text-xs font-extrabold tracking-wide uppercase ${theme.textMuted}`}>
                    {isBengali ? "পরিবর্তনসমূহ (Bengali Changelog)" : "Changes (Bengali Changelog)"}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={isBengali ? "যেমন: ১. লাইভ চ্যাটে নতুন রিঅ্যাকশন যোগ করা হয়েছে। ২. বাগ ফিক্স।" : "e.g., 1. Live Chat improvements..."}
                    value={changelogBn}
                    onChange={(e) => setChangelogBn(e.target.value)}
                    className={`w-full ${theme.bgPage} px-4 py-2.5 rounded-xl border ${theme.borderCard} text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${theme.textMain} placeholder:text-slate-400 resize-none`}
                  />
                </div>

                {/* English Changelog */}
                <div className="space-y-2">
                  <label className={`text-xs font-extrabold tracking-wide uppercase ${theme.textMuted}`}>
                    {isBengali ? "পরিবর্তনসমূহ (English Changelog)" : "Changes (English Changelog)"}
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g., 1. Added Live chat reaction. 2. Performance optimization."
                    value={changelogEn}
                    onChange={(e) => setChangelogEn(e.target.value)}
                    className={`w-full ${theme.bgPage} px-4 py-2.5 rounded-xl border ${theme.borderCard} text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${theme.textMain} placeholder:text-slate-400 resize-none`}
                  />
                </div>
              </div>

              {/* Warning/Disclaimer Banner */}
              <div className="p-4 rounded-xl border border-amber-500/15 bg-amber-500/5 text-[11px] leading-relaxed text-amber-600 dark:text-amber-400 font-semibold space-y-1">
                <span className="uppercase font-black tracking-wider text-2xs block text-amber-500">
                  {isBengali ? "⚠️ গুরুত্বপূর্ণ সতর্কতা" : "⚠️ CRITICAL SYSTEM NOTICE"}
                </span>
                <p>
                  {isBengali 
                    ? "আপনি 'রিলিজ আপডেট' বোতামে ক্লিক করার সাথে সাথে স্টাডি হাবের সব ব্যবহারকারী এবং প্রশাসকদের ডিভাইসে স্বয়ংক্রিয়ভাবে একটি ইন্টারেক্টিভ ডাউনলোড ও ইন্সটলেশন প্রসেস চালু হয়ে যাবে। সম্পন্ন হলে সবার ডিভাইস সাথে সাথে রিস্টার্ট হবে।" 
                    : "Once released, all connected students and administrators will instantly experience an automatic full-screen downloading and updating screen. The application will reboot automatically to apply the new version."}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:bg-teal-500/40 text-white font-extrabold text-xs shadow-md active:scale-98 transition-all cursor-pointer"
                >
                  {isPublishing ? (
                    <>
                      <RefreshCcw className="h-4 w-4 animate-spin" />
                      {isBengali ? "আপডেট রিলিজ হচ্ছে..." : "Releasing Update..."}
                    </>
                  ) : (
                    <>
                      <ArrowUpCircle className="h-4 w-4" />
                      {isBengali ? "আপডেট রিলিজ করুন" : "Release Update Now"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}
