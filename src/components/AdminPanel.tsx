import React, { useState } from "react";
import { Users, Search, Shield, ShieldCheck, UserCheck, UserMinus, Calendar, GraduationCap, Mail } from "lucide-react";
import { StudentProfile } from "../types";
import { Language } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";

interface AdminPanelProps {
  lang: Language;
  users: StudentProfile[];
  onToggleAdminRole: (email: string) => void;
  currentUserEmail: string;
  theme: ThemeConfig;
}

export default function AdminPanel({ lang, users, onToggleAdminRole, currentUserEmail, theme }: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const isBengali = lang === "bn";

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
    primaryAdminBadge: isBengali ? "প্রধান অ্যাডমিন" : "Primary Admin",
    noUsersFound: isBengali ? "কোনো ব্যবহারকারী খুঁজে পাওয়া যায়নি।" : "No registered users match your search query.",
    actionSuccess: isBengali ? "ভূমিকা সফলভাবে পরিবর্তন করা হয়েছে!" : "User role updated successfully!",
    cannotModifySelf: isBengali ? "আপনি নিজের ভূমিকা পরিবর্তন করতে পারবেন না।" : "You cannot modify your own administrator role.",
    cannotModifyPrimary: isBengali ? "প্রধান অ্যাডমিনকে পরিবর্তন করা সম্ভব নয়।" : "The primary system administrator cannot be demoted."
  };

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRegistered = users.length;
  const adminsCount = users.filter(u => u.role === "Admin").length;
  const studentsCount = users.filter(u => u.role === "Student").length;

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

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      
      {/* Header section with styling and safe area */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-teal-700/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 rounded-lg text-xs font-bold text-teal-300 tracking-wider uppercase">
            <Shield className="h-3.5 w-3.5 animate-pulse" />
            {isBengali ? "প্রশাসক প্যানেল" : "System Administration"}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t.title}</h1>
          <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-2xl leading-relaxed">{t.subtitle}</p>
        </div>
      </div>

      {/* Stats Summary Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
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

      </div>

      {/* Main control table and search bar */}
      <div className={`${theme.bgCard} rounded-xl border ${theme.borderCard} shadow-3xs overflow-hidden`}>
        
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
                  const isPrimaryAdmin = user.email.trim().toLowerCase() === "mazumderdiptanshu753@gmail.com";
                  const isSelf = user.email.trim().toLowerCase() === currentUserEmail.trim().toLowerCase();

                  return (
                    <tr key={user.email} className="hover:bg-slate-500/5 transition-colors">
                      
                      {/* Name and Email */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-full bg-teal-500/10 border ${theme.borderCard} flex items-center justify-center text-base shrink-0 overflow-hidden`}>
                            {user.avatarUrl && (user.avatarUrl.startsWith("data:image") || user.avatarUrl.startsWith("http")) ? (
                              <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              user.avatarUrl || "🎓"
                            )}
                          </div>
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
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
