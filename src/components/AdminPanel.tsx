import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, Search, Shield, ShieldCheck, UserCheck, UserMinus, Calendar, GraduationCap, Mail, Activity, LogIn, LogOut, Trash2, Settings, BarChart2, ShieldAlert, TrendingUp, Star, Ban, ArrowUpCircle, RefreshCcw, CheckCircle } from "lucide-react";
import { StudentProfile } from "../types";
import { Language } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";

interface AdminPanelProps {
  lang: Language;
  users: StudentProfile[];
  onToggleAdminRole: (email: string) => void;
  onToggleSuspendUser?: (email: string) => void;
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

export default function AdminPanel({ lang, users, onToggleAdminRole, onToggleSuspendUser, onDeleteUser, currentUserEmail, theme, currentAppVersion }: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "logs" | "settings" | "analytics" | "moderation">("users");
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.maintenanceMode === 'boolean') {
          setMaintenanceMode(data.maintenanceMode);
        }
      })
      .catch(e => console.error("Failed to fetch settings", e));
  }, []);

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
      
      {/* Header section with cleaner aesthetic */}
      <motion.div variants={itemVariants} className={`flex flex-col gap-1 p-4 ${theme.bgCard} rounded-2xl border ${theme.borderCard} shadow-sm`}>
        <h1 className={`text-xl font-black ${theme.textHeading} tracking-tight`}>{t.title}</h1>
        <p className={`text-xs ${theme.textMuted} font-medium max-w-2xl leading-relaxed`}>{t.subtitle}</p>
      </motion.div>

      {/* Stats Summary Bento Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {[
          { icon: Users, label: t.totalUsers, count: totalRegistered, color: "text-blue-600" },
          { icon: ShieldCheck, label: t.adminCount, count: adminsCount, color: "text-amber-600" },
          { icon: GraduationCap, label: t.studentCount, count: studentsCount, color: "text-emerald-600" },
        ].map((stat, i) => (
          <div key={i} className={`${theme.bgCard} rounded-xl border ${theme.borderCard} p-3 flex items-center gap-3 shadow-sm`}>
            <div className={`h-10 w-10 rounded-xl ${theme.bgPage} flex items-center justify-center ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <span className={`text-[9px] uppercase font-bold ${theme.textMuted} tracking-wider block`}>{stat.label}</span>
              <span className={`text-xl font-black ${theme.textHeading}`}>{stat.count}</span>
            </div>
          </div>
        ))}

      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className={`flex flex-wrap p-1 ${theme.bgPage} rounded-xl mb-6 w-full sm:w-fit gap-1`}>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center justify-center flex-1 sm:flex-none gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeTab === "users" ? `${theme.bgCard} ${theme.textHeading} shadow-sm` : `${theme.textMuted} hover:${theme.textHeading}`
          }`}
        >
          <Users className="h-4 w-4" />
          {isBengali ? "ব্যবহারকারী" : "Users"}
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center justify-center flex-1 sm:flex-none gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeTab === "logs" ? `${theme.bgCard} ${theme.textHeading} shadow-sm` : `${theme.textMuted} hover:${theme.textHeading}`
          }`}
        >
          <Activity className="h-4 w-4" />
          {isBengali ? "অ্যাক্টিভিটি লগ" : "Logs"}
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center justify-center flex-1 sm:flex-none gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeTab === "settings" ? `${theme.bgCard} ${theme.textHeading} shadow-sm` : `${theme.textMuted} hover:${theme.textHeading}`
          }`}
        >
          <Settings className="h-4 w-4" />
          {isBengali ? "সেটিংস" : "Settings"}
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center justify-center flex-1 sm:flex-none gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeTab === "analytics" ? `${theme.bgCard} ${theme.textHeading} shadow-sm` : `${theme.textMuted} hover:${theme.textHeading}`
          }`}
        >
          <BarChart2 className="h-4 w-4" />
          {isBengali ? "অ্যানালিটিক্স" : "Analytics"}
        </button>
        <button
          onClick={() => setActiveTab("moderation")}
          className={`flex items-center justify-center flex-1 sm:flex-none gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeTab === "moderation" ? `${theme.bgCard} ${theme.textHeading} shadow-sm` : `${theme.textMuted} hover:${theme.textHeading}`
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          {isBengali ? "মডারেশন" : "Moderation"}
        </button>
      </motion.div>

      {activeTab === "users" && (
        <motion.div variants={itemVariants} className={`${theme.bgCard} rounded-2xl border ${theme.borderCard} shadow-sm overflow-hidden`}>
          
          {/* Search header bar */}
          <div className={`p-5 border-b ${theme.borderCard} flex items-center justify-between gap-4`}>
            <div className="relative flex-1 max-w-sm">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${theme.textMuted}`} />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${theme.bgPage} pl-10 pr-4 py-2.5 rounded-xl border ${theme.borderCard} text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${theme.textMain} placeholder:text-slate-400`}
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
                const isSuspended = user.isSuspended;
                    const isSelf = (user?.email || "").trim().toLowerCase() === (currentUserEmail || "").trim().toLowerCase();

                    return (
                      <tr key={user?.email || Math.random().toString()} className="hover:bg-slate-500/5 transition-colors">
                        
                        {/* Name and Email */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="min-w-0">
                              <span className={`font-bold text-xs ${theme.textHeading} block break-words`}>{user.fullName}</span>
                              <span className={`text-[10px] ${theme.textMuted} font-medium block break-all sm:max-w-xs`}>{user.email}</span>
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
                                  if (window.confirm(isBengali ? (isSuspended ? "সাসপেন্ড তুলে নিতে চান?" : "আপনি কি নিশ্চিত যে আপনি এই ব্যবহারকারীকে সাসপেন্ড করতে চান?") : (isSuspended ? "Unsuspend user?" : "Suspend this user?"))) {
                                    if (onToggleSuspendUser) onToggleSuspendUser(user.email);
                                  }
                                }}
                                className={`inline-flex items-center justify-center p-1.5 rounded-lg border transition-colors cursor-pointer ${isSuspended ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'border-amber-500/20 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'}`}
                                title={isBengali ? (isSuspended ? "সাসপেন্ড বাতিল করুন" : "সাসপেন্ড করুন") : (isSuspended ? "Unsuspend" : "Suspend")}
                              >
                                {isSuspended ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
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
                const isSuspended = user.isSuspended;
                const isSelf = (user?.email || "").trim().toLowerCase() === (currentUserEmail || "").trim().toLowerCase();
                return (
                  <div key={user?.email || Math.random().toString()} className="p-4 space-y-3">
                    {/* User basic info */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className={`font-bold text-xs ${theme.textHeading} block break-words`}>{user.fullName}</span>
                        <span className={`text-[10px] ${theme.textMuted} font-medium block break-all`}>{user.email}</span>
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
                              title={isBengali ? (isSuspended ? "সাসপেন্ড বাতিল করুন" : "সাসপেন্ড করুন") : (isSuspended ? "Unsuspend" : "Suspend")}
                              onClick={() => {
                                if (window.confirm(isBengali ? (isSuspended ? "সাসপেন্ড তুলে নিতে চান?" : "আপনি কি নিশ্চিত যে আপনি এই ব্যবহারকারীকে সাসপেন্ড করতে চান?") : (isSuspended ? "Unsuspend user?" : "Suspend this user?"))) {
                                  if (onToggleSuspendUser) onToggleSuspendUser(user.email);
                                }
                              }}
                              className={`inline-flex items-center justify-center p-1.5 rounded-lg border transition-colors cursor-pointer ${isSuspended ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'border-amber-500/20 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'}`}
                            >
                              {isSuspended ? <CheckCircle className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
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
                          <div className={`font-bold text-xs ${theme.textHeading} break-words`}>{log.userName}</div>
                          <div className={`text-[10px] ${theme.textMuted} break-all`}>{log.userEmail}</div>
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
      {activeTab === "analytics" && (
        <motion.div variants={itemVariants} className={`${theme.bgCard} rounded-xl border ${theme.borderCard} shadow-sm overflow-hidden p-4 sm:p-6 space-y-6`}>
          <h2 className={`text-lg font-bold ${theme.textHeading}`}>
            {isBengali ? "অ্যানালিটিক্স এবং রিপোর্ট" : "Analytics & Dashboard"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-500/5 rounded-xl border border-slate-500/10">
              <h3 className={`font-bold ${theme.textHeading} mb-4 flex items-center gap-2`}>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                {isBengali ? "অ্যাক্টিভ ইউজার চার্ট" : "Active Users"}
              </h3>
              <div className="h-32 flex items-end gap-2 justify-between">
                {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                  <div key={i} className="w-full bg-teal-500/20 rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-slate-500/5 rounded-xl border border-slate-500/10">
              <h3 className={`font-bold ${theme.textHeading} mb-4 flex items-center gap-2`}>
                <Star className="h-4 w-4 text-amber-500" />
                {isBengali ? "পপুলার কন্টেন্ট" : "Popular Content"}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className={`${theme.textMain}`}>Math Masterclass (Video)</span>
                  <span className="font-bold text-teal-600">1.2k views</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className={`${theme.textMain}`}>History PDF Notes</span>
                  <span className="font-bold text-teal-600">850 dl</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className={`${theme.textMain}`}>Live Doubt Session</span>
                  <span className="font-bold text-teal-600">500 joined</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "moderation" && (
        <motion.div variants={itemVariants} className={`${theme.bgCard} rounded-xl border ${theme.borderCard} shadow-sm overflow-hidden p-4 sm:p-6`}>
          <h2 className={`text-lg font-bold ${theme.textHeading} mb-4`}>
            {isBengali ? "কন্টেন্ট মডারেশন" : "Content Moderation"}
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-slate-500/5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className={`font-bold ${theme.textHeading}`}>
                  {isBengali ? "কমিউনিটি ফোরাম স্প্যাম কন্ট্রোল" : "Community Forum Spam Control"}
                </h3>
                <p className={`text-xs ${theme.textMuted} mt-1`}>
                  {isBengali ? "স্প্যাম বা খারাপ কিছু পোস্ট হলে অটোমেটিক ফিল্টার করুন।" : "Automatically filter spam or inappropriate posts."}
                </p>
              </div>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 rounded-lg font-bold text-sm transition-all text-center">
                {isBengali ? "ম্যানেজ করুন" : "Manage"}
              </button>
            </div>
            <div className="p-4 bg-slate-500/5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className={`font-bold ${theme.textHeading}`}>
                  {isBengali ? "নোটস অ্যাপ্রুভাল সিস্টেম" : "Notes Approval System"}
                </h3>
                <p className={`text-xs ${theme.textMuted} mt-1`}>
                  {isBengali ? "ছাত্রদের শেয়ার করা নোটস অ্যাপ্রুভ করার জন্য পেন্ডিং লিস্ট দেখুন।" : "View pending notes shared by students for approval."}
                </p>
              </div>
              <button className="w-full sm:w-auto px-4 py-2 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                3 {isBengali ? "পেন্ডিং" : "Pending"}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "settings" && (
        <motion.div variants={itemVariants} className={`${theme.bgCard} rounded-xl border ${theme.borderCard} shadow-sm overflow-hidden p-4 sm:p-6`}>
          <h2 className={`text-lg font-bold ${theme.textHeading} mb-4`}>
            {isBengali ? "সিস্টেম কনফিগারেশন" : "System Configuration"}
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-500/5 rounded-xl gap-4">
            <div>
              <h3 className={`font-bold ${theme.textHeading}`}>
                {isBengali ? "মেইনটেন্যান্স মোড" : "Maintenance Mode"}
              </h3>
              <p className={`text-xs ${theme.textMuted} mt-1`}>
                {isBengali ? "অ্যাপে কোনো আপডেট চলার সময় ইউজারদের জন্য অ্যাপটি বন্ধ রাখুন।" : "Disable access for users during updates."}
              </p>
            </div>
            <button
              onClick={() => {
                const newValue = !maintenanceMode;
                fetch("/api/settings", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ maintenanceMode: newValue })
                })
                .then(res => {
                  if (res.ok) {
                    setMaintenanceMode(newValue);
                    alert(isBengali ? (newValue ? "মেইনটেন্যান্স মোড চালু করা হয়েছে।" : "মেইনটেন্যান্স মোড বন্ধ করা হয়েছে।") : (newValue ? "Maintenance Mode Enabled." : "Maintenance Mode Disabled."));
                  } else {
                    alert("Failed to update settings");
                  }
                })
                .catch(e => {
                  console.error(e);
                  alert("Failed to update settings");
                });
              }}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                maintenanceMode
                  ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                  : "bg-teal-500/10 text-teal-600 hover:bg-teal-500/20"
              }`}
            >
              {maintenanceMode ? (isBengali ? "বন্ধ করুন" : "Disable") : (isBengali ? "চালু করুন" : "Enable")}
            </button>
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}

