import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bell, 
  BookOpen, 
  Video, 
  Info, 
  CheckCheck, 
  Trash2, 
  Clock,
  Sparkles
} from "lucide-react";
import { Notification, StudentProfile } from "../types";
import { Language } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";

interface NotificationBellProps {
  profile: StudentProfile | null;
  lang: Language;
  theme: ThemeConfig;
}

export default function NotificationBell({ profile, lang, theme }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userEmail = profile?.email?.trim().toLowerCase() || "";

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    if (!userEmail) {
      console.log("Notification fetch skipped: No userEmail");
      return;
    }
    console.log("Fetching notifications for:", userEmail);
    try {
      const res = await fetch(`/api/notifications?userEmail=${encodeURIComponent(userEmail)}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      } else {
        const errorText = await res.text();
        console.error("Failed to fetch notifications, status:", res.status, "body:", errorText);
      }
    } catch (e) {
      console.error("Failed to fetch notifications (exception):", e);
    }
  };

  // Poll for notifications every 10 seconds to make it real-time!
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [userEmail]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Mark notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: "POST" });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      }
    } catch (e) {
      console.error("Failed to mark notification as read:", e);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications/read-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail })
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (e) {
      console.error("Failed to mark all as read:", e);
    }
  };

  // Delete notification
  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (e) {
      console.error("Failed to delete notification:", e);
    }
  };

  // Format timestamp elegantly
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHrs / 24);

      if (lang === "bn") {
        if (diffMins < 1) return "এইমাত্র";
        if (diffMins < 60) return `${diffMins} মিনিট আগে`;
        if (diffHrs < 24) return `${diffHrs} ঘণ্টা আগে`;
        if (diffDays < 7) return `${diffDays} দিন আগে`;
        return date.toLocaleDateString("bn-BD", { month: "short", day: "numeric" });
      } else {
        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHrs < 24) return `${diffHrs}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Interactive Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-xl border transition-all cursor-pointer ${
          theme.isDark 
            ? "bg-slate-900/60 hover:bg-slate-900/90 border-white/[0.08] text-slate-200 hover:text-white" 
            : "bg-slate-100/60 hover:bg-slate-100/90 border-black/[0.06] text-slate-700 hover:text-slate-900"
        }`}
        id="btn-notification-bell"
        title={lang === "bn" ? "বিজ্ঞপ্তি সমূহ" : "Notifications"}
      >
        <Bell className={`h-4.5 w-4.5 sm:h-5 sm:w-5 ${unreadCount > 0 ? "animate-swing" : ""}`} />
        
        {/* Unread Badge Count */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-950"
            >
              {unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Floating Panel Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className={`fixed sm:absolute top-16 sm:top-auto right-4 sm:right-0 left-4 sm:left-auto mt-2 sm:mt-2.5 w-auto sm:w-96 rounded-2xl border shadow-xl z-50 overflow-hidden ${
              theme.isDark 
                ? "bg-slate-950/95 border-white/[0.08] backdrop-blur-xl" 
                : "bg-white/95 border-black/[0.06] backdrop-blur-xl"
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b ${theme.isDark ? "border-white/[0.08]" : "border-black/[0.06]"}`}>
              <div className="flex items-center gap-1.5">
                <span className={`font-extrabold text-xs sm:text-sm ${theme.isDark ? "text-white" : "text-slate-900"}`}>
                  {lang === "bn" ? "বিজ্ঞপ্তি হাব" : "Notifications Hub"}
                </span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-rose-500/10 text-rose-500 px-2 py-0.5 text-[9px] font-bold">
                    {unreadCount} {lang === "bn" ? "নতুন" : "new"}
                  </span>
                )}
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-500 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <CheckCheck className="h-3 w-3" />
                  {lang === "bn" ? "সব পঠিত চিহ্নিত করুন" : "Mark all read"}
                </button>
              )}
            </div>

            {/* Notifications List Container */}
            <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-100 dark:divide-white/[0.04]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className={`rounded-full p-3 mb-2.5 ${theme.isDark ? "bg-white/[0.02]" : "bg-black/[0.02]"}`}>
                    <Bell className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-xs font-bold text-slate-400">
                    {lang === "bn" ? "কোনো নতুন বিজ্ঞপ্তি নেই" : "No notifications yet"}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {lang === "bn" 
                      ? "নতুন লেকচার বা নোট আপলোড করা হলে এখানে বিজ্ঞপ্তি পাবেন।" 
                      : "We'll notify you when new lectures or study materials are published."}
                  </p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const Icon = notif.type === "video" 
                    ? Video 
                    : notif.type === "note" 
                    ? BookOpen 
                    : Info;
                    
                  const iconColor = notif.type === "video" 
                    ? "text-teal-500 bg-teal-500/10" 
                    : notif.type === "note" 
                    ? "text-emerald-500 bg-emerald-500/10" 
                    : "text-amber-500 bg-amber-500/10";

                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleMarkAsRead(notif.id)}
                      className={`flex gap-3 p-4 text-left transition-all relative group cursor-pointer ${
                        !notif.isRead 
                          ? theme.isDark 
                            ? "bg-emerald-500/[0.02] hover:bg-emerald-500/[0.04]" 
                            : "bg-emerald-500/[0.01] hover:bg-emerald-500/[0.03]" 
                          : "hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                      }`}
                    >
                      {/* Left Dot Indicator for Unread */}
                      {!notif.isRead && (
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      )}

                      {/* Icon */}
                      <div className={`h-8.5 w-8.5 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
                        <Icon className="h-4 w-4" />
                      </div>

                      {/* Info & Description */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className={`font-black text-xs leading-snug truncate ${notif.isRead ? "text-slate-500 dark:text-slate-400" : "text-slate-800 dark:text-slate-100"}`}>
                            {notif.title}
                          </p>
                          <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap pt-0.5">
                            {formatTime(notif.timestamp)}
                          </span>
                        </div>
                        <p className={`text-[10px] leading-relaxed mt-1 line-clamp-2 ${notif.isRead ? "text-slate-400 dark:text-slate-500" : "text-slate-500 dark:text-slate-400 font-medium"}`}>
                          {notif.message}
                        </p>
                      </div>

                      {/* Hover Actions */}
                      <button
                        onClick={(e) => handleDeleteNotification(notif.id, e)}
                        className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-all shrink-0 cursor-pointer self-center`}
                        title={lang === "bn" ? "মুছে ফেলুন" : "Delete notification"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
