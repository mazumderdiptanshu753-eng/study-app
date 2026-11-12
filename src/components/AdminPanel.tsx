import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, Search, Shield, ShieldCheck, UserCheck, UserMinus, Calendar, GraduationCap, 
  Mail, Activity, LogIn, LogOut, Trash2, Settings, BarChart2, ShieldAlert, TrendingUp, 
  Star, Ban, ArrowUpCircle, RefreshCcw, RefreshCw, Sparkles, CheckCircle, Rocket, Zap,
  UserPlus, CheckCircle2, Clock, XCircle, Send, AlertTriangle, ExternalLink, Filter, Phone, Building, Check,
  Lock, Key, Eye, EyeOff, MessageSquareShare
} from "lucide-react";
import { StudentProfile, AccessRequest, isPermanentAdmin } from "../types";
import { Language } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";
import { 
  signInWithGoogleForGmail, 
  getGmailAccessToken, 
  sendStudentApprovalGmail, 
  getStudentApprovalMailtoLink,
  workspaceLogout 
} from "../lib/googleWorkspace";
import { safeFetch } from "../lib/api";

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

export default function AdminPanel({ lang, users: propUsers, onToggleAdminRole, onToggleSuspendUser, onDeleteUser, currentUserEmail, theme, currentAppVersion }: AdminPanelProps) {
  const [users, setUsers] = useState<StudentProfile[]>(propUsers && propUsers.length > 0 ? propUsers : [
    {
      fullName: "Study Hub Official Admin",
      email: "studyhub2026admin@gmail.com",
      age: "24",
      institution: "Study Hub Official Administration",
      grade: "High School",
      preferredSubject: "Mathematics",
      registeredAt: "2026-01-01T00:00:00.000Z",
      avatarUrl: "👑",
      role: "Admin"
    },
    {
      fullName: "Diptanshu Mazumder",
      email: "mazumderdiptanshu753@gmail.com",
      age: "20",
      institution: "Ranaghat",
      grade: "High School",
      preferredSubject: "Mathematics",
      registeredAt: "2026-11-06T12:50:08.577Z",
      avatarUrl: "🎓",
      role: "Student"
    },
    {
      fullName: "Anwit Chaki",
      email: "anwitchaki@gmail.com",
      age: "20",
      institution: "Birnagar",
      grade: "High School",
      preferredSubject: "Mathematics",
      registeredAt: "2026-11-06T12:57:48.121Z",
      avatarUrl: "👑",
      role: "Admin"
    }
  ]);

  useEffect(() => {
    if (propUsers && propUsers.length > 0) {
      setUsers(propUsers);
    } else {
      fetch("/api/users")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setUsers(data);
          }
        })
        .catch(() => {});
    }
  }, [propUsers]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "requests" | "logs" | "settings" | "analytics" | "moderation" | "updates">("users");
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Access Requests & Gmail states
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestFilter, setRequestFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [requestSearch, setRequestSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [approvalSuccessMsg, setApprovalSuccessMsg] = useState<string | null>(null);
  const [approvalErrorMsg, setApprovalErrorMsg] = useState<string | null>(null);
  const [isConnectingGmail, setIsConnectingGmail] = useState(false);
  const [gmailTokenAvailable, setGmailTokenAvailable] = useState<boolean>(() => !!getGmailAccessToken());
  const [adminGmailUser, setAdminGmailUser] = useState<string | null>(null);
  const [recentApprovedEmailAction, setRecentApprovedEmailAction] = useState<{
    name: string;
    email: string;
    webUrl: string;
    mailtoUrl: string;
    plainBody: string;
  } | null>(null);

  // Admin Passcode change states
  const [currentPasscode, setCurrentPasscode] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [isChangingPasscode, setIsChangingPasscode] = useState(false);
  const [passcodeMsg, setPasscodeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showSettingsPasscodes, setShowSettingsPasscodes] = useState(false);

  const handleChangePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeMsg(null);

    if (!currentPasscode.trim()) {
      setPasscodeMsg({ type: "error", text: isBengali ? "বর্তমান পাসকোড লিখুন।" : "Enter current passcode." });
      return;
    }
    if (!newPasscode.trim() || newPasscode.trim().length < 4) {
      setPasscodeMsg({ type: "error", text: isBengali ? "নতুন পাসকোড কমপক্ষে ৪ অক্ষরের হতে হবে।" : "New passcode must be at least 4 characters." });
      return;
    }
    if (newPasscode.trim() !== confirmPasscode.trim()) {
      setPasscodeMsg({ type: "error", text: isBengali ? "নতুন পাসকোড দুটি মেলেনি!" : "New passcodes do not match!" });
      return;
    }

    setIsChangingPasscode(true);
    try {
      const res = await fetch("/api/admin/change-passcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": currentUserEmail
        },
        body: JSON.stringify({
          currentPasscode: currentPasscode.trim(),
          newPasscode: newPasscode.trim()
        })
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setPasscodeMsg({
          type: "success",
          text: isBengali ? "✅ অ্যাডমিন সিকিউরিটি পাসকোড সফলভাবে পরিবর্তন করা হয়েছে!" : "Admin passcode successfully updated!"
        });
        setCurrentPasscode("");
        setNewPasscode("");
        setConfirmPasscode("");
      } else {
        setPasscodeMsg({
          type: "error",
          text: data?.error || (isBengali ? "পাসকোড পরিবর্তন করতে ব্যর্থ হয়েছে।" : "Failed to update passcode.")
        });
      }
    } catch (err) {
      setPasscodeMsg({
        type: "error",
        text: isBengali ? "সার্ভার সংযোগ সমস্যা।" : "Server connection error."
      });
    } finally {
      setIsChangingPasscode(false);
    }
  };

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.maintenanceMode === 'boolean') {
          setMaintenanceMode(data.maintenanceMode);
        }
        if (data && data.adminGmailAppPassword) {
          setAdminAppPasswordInput(data.adminGmailAppPassword);
        }
        if (data && data.adminGmailToken) {
          setGmailTokenAvailable(true);
          if (data.adminGmailUser) setAdminGmailUser(data.adminGmailUser);
        }
      })
      .catch(e => console.warn("Failed to fetch settings (transient network or server restart):", e));
  }, []);

  // Admin Gmail Automated Dispatch state
  const [adminAppPasswordInput, setAdminAppPasswordInput] = useState("");
  const [isSavingAppPassword, setIsSavingAppPassword] = useState(false);
  const [appPasswordSuccessMsg, setAppPasswordSuccessMsg] = useState<string | null>(null);

  const handleSaveAppPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAppPassword(true);
    setAppPasswordSuccessMsg(null);
    try {
      const res = await fetch("/api/admin/save-gmail-app-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appPassword: adminAppPasswordInput.trim() })
      });
      if (res.ok) {
        setAppPasswordSuccessMsg(
          isBengali
            ? "গুগল অ্যাপ পাসওয়ার্ড সংরক্ষিত হয়েছে! এখন থেকে যেকোনো শিক্ষার্থীর ওটিপি ও অনুমোদন মেইল studyhub2026admin@gmail.com থেকে স্বয়ংক্রিয়ভাবে প্রেরিত হবে।"
            : "Google App Password saved! OTP and notification emails will now be automatically sent from studyhub2026admin@gmail.com."
        );
      } else {
        alert("Failed to save App Password.");
      }
    } catch {
      alert("Failed to save App Password.");
    } finally {
      setIsSavingAppPassword(false);
    }
  };

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
            ? `সংস্করণ v${newVersion} সফলভাবে প্রকাশ করা হয়েছে! সব শিক্ষার্থীর ডিভাইসে ফুল-স্ক্রিন স্প্ল্যাশ স্ক্রিন চলে আসবে।`
            : `Version v${newVersion} released successfully! All users will see the full-screen splash update screen.`
        });
        window.dispatchEvent(new CustomEvent("studyhub_trigger_update", {
          detail: {
            targetVersion: newVersion.trim(),
            changelogBn: changelogBn.trim(),
            changelogEn: changelogEn.trim(),
            isTest: false
          }
        }));
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

  const fetchRequests = async (isPolling = false) => {
    if (!isPolling) setLoadingRequests(true);
    try {
      const res = await safeFetch("/api/access-requests", {
        headers: { "x-admin-email": currentUserEmail }
      });
      if (res && res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setRequests(data);
          }
        }
      }
    } catch (e) {
      console.warn("Could not fetch access requests:", e);
    } finally {
      if (!isPolling) setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(() => {
      if (!document.hidden) fetchRequests(true);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleConnectGmail = async () => {
    setIsConnectingGmail(true);
    setApprovalErrorMsg(null);
    try {
      const { user, accessToken } = await signInWithGoogleForGmail();
      setGmailTokenAvailable(true);
      setAdminGmailUser(user.email || currentUserEmail);

      // Save token to backend so automatic OTP and approval emails send directly from studyhub2026admin@gmail.com
      try {
        await fetch("/api/admin/save-gmail-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: accessToken, email: user.email || currentUserEmail })
        });
      } catch (tErr) {
        console.warn("Failed to sync Gmail token to backend:", tErr);
      }

      setApprovalSuccessMsg(
        isBengali 
          ? `জিমেইল সফলভাবে সংযুক্ত হয়েছে (${user.email || currentUserEmail})! এখন আপনি আবেদন অনুমোদন করতে পারবেন এবং স্টুডেন্টদের অটোমেটিক ওটিপি মেইল যাবে।` 
          : `Gmail successfully connected (${user.email || currentUserEmail})! Automated emails & OTPs will now be sent from this account.`
      );
    } catch (err: any) {
      const errCode = err?.code || "";
      const errMsg = err?.message || "";
      let friendlyMsg = "";

      if (errCode === "auth/popup-closed-by-user" || errMsg.includes("popup-closed-by-user")) {
        friendlyMsg = isBengali 
          ? "গুগল সাইন-ইন পপ-আপ উইন্ডোটি বন্ধ করা হয়েছে বা সাইন-ইন সম্পন্ন হয়নি। পুনরায় 'Connect Admin Gmail' এ ক্লিক করে আপনার গুগল অ্যাকাউন্ট (studyhub2026admin@gmail.com) নির্বাচন করুন।"
          : "Google Sign-in popup was closed before completing. Please click 'Connect Admin Gmail' again and sign in.";
      } else if (errCode === "auth/popup-blocked" || errMsg.includes("popup-blocked")) {
        friendlyMsg = isBengali
          ? "আপনার ব্রাউজার পপ-আপ ব্লক করেছে। ব্রাউজারের অ্যাড্রেস বার থেকে Pop-ups Allow করুন।"
          : "Popup was blocked by your browser. Please allow popups for this site.";
      } else if (errCode === "auth/cancelled-popup-request" || errMsg.includes("cancelled-popup-request")) {
        friendlyMsg = isBengali
          ? "পূর্বের পপ-আপ বাতিল হয়েছে। পুনরায় চেষ্টা করুন।"
          : "Previous popup request was cancelled. Please try again.";
      } else {
        friendlyMsg = isBengali 
          ? `গুগল জিমেইল কানেক্ট করতে সমস্যা হয়েছে: ${errMsg || "অনাকাঙ্ক্ষিত ত্রুটি"}`
          : `Failed to connect Gmail: ${errMsg}`;
      }

      setApprovalErrorMsg(friendlyMsg);
    } finally {
      setIsConnectingGmail(false);
    }
  };

  const handleApproveAndSend = async (req: AccessRequest) => {
    setIsApproving(true);
    setApprovalErrorMsg(null);
    setApprovalSuccessMsg(null);

    const generatedPassword = req.password || Math.random().toString(36).substring(2, 10).toUpperCase();
    const token = getGmailAccessToken();
    let emailSentSuccessfully = false;
    let emailErrorMessage = "";

    if (token) {
      try {
        await sendStudentApprovalGmail(
          token,
          currentUserEmail || "studyhub2026admin@gmail.com",
          req.email,
          req.fullName,
          generatedPassword,
          req.targetExam
        );
        emailSentSuccessfully = true;
      } catch (gErr: any) {
        console.error("Gmail sending error:", gErr);
        emailErrorMessage = gErr.message || "জিমেইল এপিআই ত্রুটি";
      }
    }

    try {
      const res = await fetch(`/api/access-requests/${req.id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": currentUserEmail
        },
        body: JSON.stringify({
          reviewedBy: currentUserEmail,
          emailSent: emailSentSuccessfully,
          emailError: emailSentSuccessfully ? undefined : emailErrorMessage,
          password: generatedPassword
        })
      });

      if (res.ok) {
        if (emailSentSuccessfully) {
          setApprovalSuccessMsg(
            isBengali
              ? `🎉 চমৎকার! ${req.fullName}-এর আবেদন অনুমোদিত হয়েছে এবং studyhub2026admin@gmail.com থেকে সরাসরি অফিশিয়াল স্বাগতম ইমেইল পাঠানো হয়েছে! (Password: ${generatedPassword})`
              : `Success! ${req.fullName}'s request approved and welcome email sent directly from studyhub2026admin@gmail.com via Gmail! (Password: ${generatedPassword})`
          );
        } else {
          const mailLinks = getStudentApprovalMailtoLink(req.email, req.fullName, generatedPassword, req.targetExam);
          setRecentApprovedEmailAction({
            name: req.fullName,
            email: req.email,
            webUrl: mailLinks.webUrl,
            mailtoUrl: mailLinks.mailtoUrl,
            plainBody: mailLinks.plainBody
          });
          setApprovalSuccessMsg(
            isBengali
              ? `✅ ${req.fullName}-এর অ্যাকাউন্ট অনুমোদিত হয়েছে! নিচে দেওয়া বোতামে চাপ দিয়ে সরাসরি ফোনের জিমেইল অ্যাপ থেকে অফিশিয়াল ইংরেজি ইমেইল পাঠাতে পারবেন।`
              : `✅ ${req.fullName}'s account approved! Tap the buttons below to send the official English email from your phone.`
          );
        }
        setSelectedRequest(null);
        fetchRequests(true);
      } else {
        const errData = await res.json().catch(() => ({}));
        setApprovalErrorMsg(errData?.error || "অনুমোদন সম্পন্ন করা যায়নি।");
      }
    } catch (err: any) {
      setApprovalErrorMsg("সার্ভার সংযোগ সমস্যা।");
    } finally {
      setIsApproving(false);
    }
  };

  const handleApproveAndOpenGmailApp = async (req: AccessRequest) => {
    setIsApproving(true);
    setApprovalErrorMsg(null);
    const generatedPassword = req.password || Math.random().toString(36).substring(2, 10).toUpperCase();
    try {
      const res = await fetch(`/api/access-requests/${req.id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": currentUserEmail
        },
        body: JSON.stringify({
          reviewedBy: currentUserEmail,
          emailSent: true,
          password: generatedPassword
        })
      });

      if (res.ok) {
        const mailLinks = getStudentApprovalMailtoLink(req.email, req.fullName, generatedPassword, req.targetExam);
        setSelectedRequest(null);
        fetchRequests(true);
        setRecentApprovedEmailAction({
          name: req.fullName,
          email: req.email,
          webUrl: mailLinks.webUrl,
          mailtoUrl: mailLinks.mailtoUrl,
          plainBody: mailLinks.plainBody
        });
        setApprovalSuccessMsg(
          isBengali
            ? `🎉 ${req.fullName}-এর অ্যাকাউন্ট অনুমোদিত হয়েছে! ফোনের জিমেইল অ্যাপ ওপেন হচ্ছে...`
            : `🎉 ${req.fullName}'s account approved! Opening Gmail app...`
        );
        // Trigger native Gmail app
        window.location.href = mailLinks.mailtoUrl;
      } else {
        const errData = await res.json().catch(() => ({}));
        setApprovalErrorMsg(errData?.error || "অনুমোদন সম্পন্ন করা যায়নি।");
      }
    } catch (err: any) {
      setApprovalErrorMsg("সার্ভার সংযোগ সমস্যা।");
    } finally {
      setIsApproving(false);
    }
  };

  const handleApproveAndOpenGmailWeb = async (req: AccessRequest) => {
    setIsApproving(true);
    setApprovalErrorMsg(null);
    const generatedPassword = req.password || Math.random().toString(36).substring(2, 10).toUpperCase();
    try {
      const res = await fetch(`/api/access-requests/${req.id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": currentUserEmail
        },
        body: JSON.stringify({
          reviewedBy: currentUserEmail,
          emailSent: true,
          password: generatedPassword
        })
      });

      if (res.ok) {
        const mailLinks = getStudentApprovalMailtoLink(req.email, req.fullName, generatedPassword, req.targetExam);
        setSelectedRequest(null);
        fetchRequests(true);
        setRecentApprovedEmailAction({
          name: req.fullName,
          email: req.email,
          webUrl: mailLinks.webUrl,
          mailtoUrl: mailLinks.mailtoUrl,
          plainBody: mailLinks.plainBody
        });
        setApprovalSuccessMsg(
          isBengali
            ? `🎉 ${req.fullName}-এর অ্যাকাউন্ট অনুমোদিত হয়েছে! জিমেইল ওয়েব পেজ ওপেন হচ্ছে...`
            : `🎉 ${req.fullName}'s account approved! Opening Gmail Web...`
        );
        window.open(mailLinks.webUrl, "_blank");
      } else {
        const errData = await res.json().catch(() => ({}));
        setApprovalErrorMsg(errData?.error || "অনুমোদন সম্পন্ন করা যায়নি।");
      }
    } catch (err: any) {
      setApprovalErrorMsg("সার্ভার সংযোগ সমস্যা।");
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectRequest = async (id: string, reason?: string) => {
    try {
      const res = await fetch(`/api/access-requests/${id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": currentUserEmail
        },
        body: JSON.stringify({
          reviewedBy: currentUserEmail,
          adminNotes: reason || "আবেদন তথ্য অসম্পূর্ণ ছিল"
        })
      });
      if (res.ok) {
        fetchRequests(true);
      }
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm(isBengali ? "আপনি কি এই আবেদনটি মুছে ফেলতে চান?" : "Delete this access request?")) return;
    try {
      const res = await fetch(`/api/access-requests/${id}`, {
        method: "DELETE",
        headers: { "x-admin-email": currentUserEmail }
      });
      if (res.ok) {
        fetchRequests(true);
      }
    } catch (err) {
      console.error("Delete request error:", err);
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
  const pendingCount = requests.filter(r => r.status === "pending").length;

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
      className="space-y-4 sm:space-y-6 w-full max-w-full mx-auto pb-12 px-1 sm:px-4 overflow-x-hidden box-border"
    >
      
      {/* Header section with cleaner aesthetic */}
      <motion.div variants={itemVariants} className={`flex flex-col gap-1 p-4 ${theme.bgCard} rounded-2xl border ${theme.borderCard} shadow-sm`}>
        <h1 className={`text-xl font-black ${theme.textHeading} tracking-tight`}>{t.title}</h1>
        <p className={`text-xs ${theme.textMuted} font-medium max-w-2xl leading-relaxed`}>{t.subtitle}</p>
      </motion.div>

      {/* Stats Summary Bento Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {[
          { icon: Users, label: t.totalUsers, count: totalRegistered, color: "text-blue-600" },
          { icon: ShieldCheck, label: t.adminCount, count: adminsCount, color: "text-amber-600" },
          { icon: GraduationCap, label: t.studentCount, count: studentsCount, color: "text-emerald-600" },
          { icon: Clock, label: isBengali ? "অপেক্ষমান আবেদন" : "Pending Requests", count: pendingCount, color: "text-indigo-600", badge: pendingCount > 0 },
        ].map((stat, i) => (
          <div key={i} className={`${theme.bgCard} rounded-xl border ${theme.borderCard} p-3 flex items-center gap-3 shadow-sm`}>
            <div className={`h-10 w-10 rounded-xl ${theme.bgPage} flex items-center justify-center ${stat.color} relative`}>
              <stat.icon className="h-5 w-5" />
              {stat.badge && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-rose-500 rounded-full animate-ping"></span>
              )}
            </div>
            <div>
              <span className={`text-[9px] uppercase font-bold ${theme.textMuted} tracking-wider block`}>{stat.label}</span>
              <span className={`text-xl font-black ${theme.textHeading}`}>{stat.count}</span>
            </div>
          </div>
        ))}

      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className={`flex overflow-x-auto whitespace-nowrap p-1 ${theme.bgPage} rounded-xl mb-6 w-full gap-1 no-scrollbar`}>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all shrink-0 ${
            activeTab === "users" ? `${theme.bgCard} ${theme.textHeading} shadow-sm` : `${theme.textMuted} hover:${theme.textHeading}`
          }`}
        >
          <Users className="h-4 w-4" />
          {isBengali ? "ব্যবহারকারী" : "Users"}
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all relative shrink-0 ${
            activeTab === "requests" ? `${theme.bgCard} ${theme.textHeading} shadow-sm border border-indigo-500/20 text-indigo-600` : `${theme.textMuted} hover:${theme.textHeading}`
          }`}
        >
          <UserPlus className="h-4 w-4 text-indigo-500" />
          <span>{isBengali ? "আবেদন তালিকা" : "Join Requests"}</span>
          {pendingCount > 0 && (
            <span className="bg-rose-500 text-white rounded-full px-1.5 py-0.2 text-[9px] font-black animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all shrink-0 ${
            activeTab === "logs" ? `${theme.bgCard} ${theme.textHeading} shadow-sm` : `${theme.textMuted} hover:${theme.textHeading}`
          }`}
        >
          <Activity className="h-4 w-4" />
          {isBengali ? "অ্যাক্টিভিটি লগ" : "Logs"}
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all shrink-0 ${
            activeTab === "settings" ? `${theme.bgCard} ${theme.textHeading} shadow-sm` : `${theme.textMuted} hover:${theme.textHeading}`
          }`}
        >
          <Settings className="h-4 w-4" />
          {isBengali ? "সেটিংস" : "Settings"}
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all shrink-0 ${
            activeTab === "analytics" ? `${theme.bgCard} ${theme.textHeading} shadow-sm` : `${theme.textMuted} hover:${theme.textHeading}`
          }`}
        >
          <BarChart2 className="h-4 w-4" />
          {isBengali ? "অ্যানালিটিক্স" : "Analytics"}
        </button>
        <button
          onClick={() => setActiveTab("moderation")}
          className={`flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all shrink-0 ${
            activeTab === "moderation" ? `${theme.bgCard} ${theme.textHeading} shadow-sm` : `${theme.textMuted} hover:${theme.textHeading}`
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          {isBengali ? "মডারেশন" : "Moderation"}
        </button>
        <button
          onClick={() => setActiveTab("updates")}
          className={`flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
            activeTab === "updates" ? `${theme.bgCard} ${theme.textHeading} shadow-sm border border-indigo-200 text-indigo-700` : `${theme.textMuted} hover:${theme.textHeading}`
          }`}
        >
          <Rocket className="h-4 w-4 text-indigo-600" />
          {isBengali ? "সিস্টেম আপডেট" : "App Updates"}
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
                    const isPrimaryAdmin = isPermanentAdmin(user?.email);
                    const isSuspended = user.isSuspended;
                    const isSelf = (user?.email || "").trim().toLowerCase() === (currentUserEmail || "").trim().toLowerCase();

                    return (
                      <tr key={user?.email || Math.random().toString()} className="hover:bg-slate-500/5 transition-colors">
                        
                        {/* Name and Email */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="min-w-0 space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`font-bold text-xs ${theme.textHeading} block break-words`}>{user.fullName}</span>
                                {isPermanentAdmin(user.email) && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[8px] font-black uppercase tracking-wider shadow-2xs">
                                    ✓ Official Verified
                                  </span>
                                )}
                              </div>
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
                const isPrimaryAdmin = isPermanentAdmin(user?.email);
                const isSuspended = user.isSuspended;
                const isSelf = (user?.email || "").trim().toLowerCase() === (currentUserEmail || "").trim().toLowerCase();
                return (
                  <div key={user?.email || Math.random().toString()} className="p-4 space-y-3">
                    {/* User basic info */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`font-bold text-xs ${theme.textHeading} block break-words`}>{user.fullName}</span>
                          {isPermanentAdmin(user.email) && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[8px] font-black uppercase tracking-wider shadow-2xs">
                              ✓ Official Verified
                            </span>
                          )}
                        </div>
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

      {/* Join Requests Tab */}
      {activeTab === "requests" && (
        <motion.div variants={itemVariants} className="space-y-4">
          


          {/* Feedback messages */}
          <AnimatePresence>
            {approvalSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{approvalSuccessMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setApprovalSuccessMsg(null)}
                  className="text-emerald-700 hover:text-emerald-900 cursor-pointer text-xs font-black px-1.5"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {approvalErrorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>{approvalErrorMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setApprovalErrorMsg(null)}
                  className="text-rose-700 hover:text-rose-900 cursor-pointer text-xs font-black px-1.5"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {recentApprovedEmailAction && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-4 rounded-xl bg-gradient-to-r from-teal-500/10 via-indigo-500/10 to-blue-500/10 border border-teal-500/30 space-y-2.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>{isBengali ? `${recentApprovedEmailAction.name}-এর অ্যাকাউন্ট সক্রিয় হয়েছে! 🎉` : `${recentApprovedEmailAction.name}'s Account Activated! 🎉`}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setRecentApprovedEmailAction(null)}
                    className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                  {isBengali 
                    ? "মোবাইল থেকে সরাসরি ১-ট্যাপে অফিশিয়াল ইংরেজি ইমেইল পাঠাতে নিচের অপশন বেছে নিন:" 
                    : "Send the official English welcome email directly from your phone:"}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href={recentApprovedEmailAction.mailtoUrl}
                    className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg text-xs font-black shadow-xs flex items-center gap-1.5 transition"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>{isBengali ? "📱 ফোনে Gmail অ্যাপ খুলুন" : "Open Phone's Gmail App"}</span>
                  </a>
                  <a
                    href={recentApprovedEmailAction.webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>{isBengali ? "🌐 জিমেইল ওয়েব পেজ" : "Open Gmail Web"}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(recentApprovedEmailAction.plainBody);
                      alert(isBengali ? "ইমেইল টেক্সট কপি করা হয়েছে!" : "Email text copied!");
                    }}
                    className="px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    📋 {isBengali ? "কপি মেসেজ" : "Copy Message"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Requests Content Table */}
          <div className={`${theme.bgCard} rounded-2xl border ${theme.borderCard} shadow-sm overflow-hidden`}>
            
            {/* Filter and Search header */}
            <div className={`p-4 border-b ${theme.borderCard} flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3`}>
              
              {/* Filter pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {(["all", "pending", "approved", "rejected"] as const).map(filter => {
                  const count = filter === "all" 
                    ? requests.length 
                    : requests.filter(r => r.status === filter).length;
                  const labels = {
                    all: isBengali ? "সব আবেদন" : "All",
                    pending: isBengali ? "অপেক্ষমান" : "Pending",
                    approved: isBengali ? "অনুমোদিত" : "Approved",
                    rejected: isBengali ? "প্রত্যাখ্যাত" : "Rejected"
                  };
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setRequestFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        requestFilter === filter 
                          ? "bg-indigo-600 text-white shadow-xs" 
                          : `${theme.bgPage} ${theme.textMuted} hover:${theme.textHeading}`
                      }`}
                    >
                      <span>{labels[filter]}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        requestFilter === filter 
                          ? "bg-white/20 text-white" 
                          : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search and Refresh */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${theme.textMuted}`} />
                  <input
                    type="text"
                    value={requestSearch}
                    onChange={(e) => setRequestSearch(e.target.value)}
                    placeholder={isBengali ? "নাম, ইমেইল বা প্রতিষ্ঠান..." : "Search requests..."}
                    className={`w-full ${theme.bgPage} pl-8.5 pr-3 py-1.5 rounded-xl border ${theme.borderCard} text-xs font-medium focus:outline-none focus:border-indigo-500 transition ${theme.textMain}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fetchRequests()}
                  disabled={loadingRequests}
                  className={`p-2 rounded-xl border ${theme.borderCard} hover:${theme.bgPage} text-slate-600 dark:text-slate-400 cursor-pointer transition`}
                  title={isBengali ? "তাজা করুন" : "Refresh"}
                >
                  <RefreshCw className={`h-4 w-4 ${loadingRequests ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* List Table */}
            {(() => {
              const filteredList = requests.filter(req => {
                if (requestFilter !== "all" && req.status !== requestFilter) return false;
                if (!requestSearch.trim()) return true;
                const q = requestSearch.toLowerCase();
                return (
                  (req.fullName || "").toLowerCase().includes(q) ||
                  (req.email || "").toLowerCase().includes(q) ||
                  (req.institution || "").toLowerCase().includes(q) ||
                  (req.targetExam || "").toLowerCase().includes(q)
                );
              });

              if (filteredList.length === 0) {
                return (
                  <div className="p-12 text-center space-y-2">
                    <UserPlus className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto" />
                    <p className={`text-xs ${theme.textMuted} font-bold`}>
                      {isBengali ? "কোনো আবেদন পাওয়া যায়নি।" : "No access requests found matching your filter."}
                    </p>
                  </div>
                );
              }

              return (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredList.map(req => {
                    const isPending = req.status === "pending";
                    const isApproved = req.status === "approved";
                    const isRejected = req.status === "rejected";

                    return (
                      <div 
                        key={req.id} 
                        className="p-4 sm:p-5 hover:bg-slate-500/5 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        {/* Student Details */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`font-black text-sm ${theme.textHeading}`}>
                              {req.fullName}
                            </span>
                            
                            {/* Status badge */}
                            {isPending && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                                <Clock className="h-2.5 w-2.5" />
                                <span>{isBengali ? "অপেক্ষমান" : "Pending"}</span>
                              </span>
                            )}
                            {isApproved && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="h-2.5 w-2.5" />
                                <span>{isBengali ? "অনুমোদিত" : "Approved"}</span>
                                {req.emailSent && <span className="opacity-80">✉️ মেইল প্রেরিত</span>}
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                                <XCircle className="h-2.5 w-2.5" />
                                <span>{isBengali ? "প্রত্যাখ্যাত" : "Rejected"}</span>
                              </span>
                            )}
                          </div>

                          {/* Email, Phone, Institution */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
                            <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
                              <Mail className="h-3 w-3" />
                              <span className="break-all">{req.email}</span>
                            </span>
                            {req.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span>{req.phone}</span>
                              </span>
                            )}
                            {req.institution && (
                              <span className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                <span>{req.institution}</span>
                              </span>
                            )}
                          </div>

                          {/* Target Exam & Message */}
                          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px]">
                            {req.targetExam && (
                              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-bold">
                                🎯 {req.targetExam}
                              </span>
                            )}
                            {req.preferredSubject && (
                              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-bold">
                                📚 {req.preferredSubject}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">
                              আবেদনের সময়: {formatDate(req.requestedAt)}
                            </span>
                          </div>

                          {req.message && (
                            <div className="bg-slate-500/5 rounded-lg p-2 text-xs text-slate-700 dark:text-slate-300 italic border-l-2 border-indigo-500 mt-1">
                              "{req.message}"
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => setSelectedRequest(req)}
                                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 cursor-pointer transition"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>{isBengali ? "অনুমোদন ও মেইল পাঠান" : "Approve & Send Mail"}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const reason = prompt(isBengali ? "বাতিল করার কারণ লিখুন (ঐচ্ছিক):" : "Reason for rejection (optional):");
                                  if (reason !== null) handleRejectRequest(req.id, reason);
                                }}
                                className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold border border-rose-200 dark:border-rose-900/30 transition cursor-pointer"
                              >
                                {isBengali ? "বাতিল" : "Reject"}
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <a
                                href={getStudentApprovalMailtoLink(req.email, req.fullName, req.targetExam).mailtoUrl}
                                className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400 text-xs font-bold flex items-center gap-1 transition"
                                title="Open in Phone's Gmail App"
                              >
                                <Mail className="h-3.5 w-3.5 text-red-600" />
                                <span>{isBengali ? "ফোনে Gmail" : "Gmail App"}</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => setSelectedRequest(req)}
                                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                              >
                                <Send className="h-3 w-3 text-indigo-600" />
                                <span>{isBengali ? "পুনরায় পাঠান" : "Resend"}</span>
                              </button>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteRequest(req.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition cursor-pointer"
                            title={isBengali ? "মুছে ফেলুন" : "Delete"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

          </div>

          {/* Approval Confirmation Dialog per Workspace Skill rules */}
          <AnimatePresence>
            {selectedRequest && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`max-w-lg w-full ${theme.bgCard} rounded-2xl border ${theme.borderCard} shadow-2xl overflow-hidden p-5 sm:p-6 space-y-4`}
                >
                  <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className={`text-base font-black ${theme.textHeading}`}>
                          {isBengali ? "শিক্ষার্থী অনুমোদন ও জিমেইল নিশ্চিতকরণ" : "Confirm Student Approval & Gmail Send"}
                        </h3>
                        <p className={`text-[11px] ${theme.textMuted} font-semibold`}>
                          Google Workspace Gmail API
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Summary Details */}
                  <div className="bg-slate-500/5 rounded-xl p-3.5 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-800/50">
                      <span className="text-slate-500 font-bold">{isBengali ? "শিক্ষার্থীর নাম:" : "Student Name:"}</span>
                      <span className={`font-black ${theme.textHeading}`}>{selectedRequest.fullName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-800/50">
                      <span className="text-slate-500 font-bold">{isBengali ? "শিক্ষার্থীর ইমেইল (To):" : "Recipient Email:"}</span>
                      <span className="font-black text-indigo-600 dark:text-indigo-400">{selectedRequest.email}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-800/50">
                      <span className="text-slate-500 font-bold">{isBengali ? "প্রেরক (From Gmail):" : "Sender Email:"}</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-black">
                        studyhub2026admin@gmail.com
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500 font-bold">{isBengali ? "ইমেইল বিষয় (Subject):" : "Email Subject:"}</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Welcome to Study Hub! Your Account Has Been Approved 🎉
                      </span>
                    </div>
                  </div>

                  {/* Credentials Preview */}
                  <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                    <h4 className="text-[10px] font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Key className="h-3.5 w-3.5" />
                      <span>{isBengali ? "শিক্ষার্থীর লগইন তথ্য (Credentials)" : "Student Login Credentials"}</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">{isBengali ? "ইউজার আইডি:" : "User ID:"}</span>
                        <div className="text-xs font-black text-slate-800 dark:text-slate-200 break-all">{selectedRequest.email}</div>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">{isBengali ? "পাসওয়ার্ড:" : "Password:"}</span>
                        <div className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">
                          {selectedRequest.password || "Auto-Generated ✨"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Single 1-Click Automatic Approve & Send Option */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition cursor-pointer"
                    >
                      {isBengali ? "বাতিল" : "Cancel"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproveAndOpenGmailApp(selectedRequest)}
                      disabled={isApproving}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white text-xs font-black flex items-center gap-2 shadow-xl shadow-teal-600/30 transition cursor-pointer disabled:opacity-50"
                    >
                      {isApproving ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>{isBengali ? "অনুমোদন ও অটো-মেইল পাঠানো হচ্ছে..." : "Approving & Sending Auto-Mail..."}</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>{isBengali ? "অনুমোদন করুন ও অটো-মেইল পাঠান 🚀" : "Approve & Send Auto-Mail 🚀"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

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
        <motion.div variants={itemVariants} className="space-y-4">
          
          {/* Maintenance Mode Card */}
          <div className={`${theme.bgCard} rounded-2xl border ${theme.borderCard} shadow-sm overflow-hidden p-4 sm:p-6`}>
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
          </div>

          {/* Admin Security Passcode Card */}
          <div className={`${theme.bgCard} rounded-2xl border ${theme.borderCard} shadow-sm overflow-hidden p-5 sm:p-6 space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={`text-base font-black ${theme.textHeading}`}>
                    {isBengali ? "অ্যাডমিন সিকিউরিটি পাসকোড সেটিংস" : "Admin Security Passcode Settings"}
                  </h3>
                  <p className={`text-xs ${theme.textMuted} font-medium`}>
                    {isBengali 
                      ? "অননুমোদিত প্রবেশ ঠেকাতে অ্যাডমিন লগইনের জন্য বিশেষ সিকিউরিটি পাসকোড নিয়ন্ত্রণ করুন।" 
                      : "Protect admin access with a master security passcode."}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                🔒 {isBengali ? "সুরক্ষা লক সক্রিয়" : "Security Active"}
              </span>
            </div>

            {/* Informational callout */}
            <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Key className="h-4 w-4 text-amber-600" />
                <span>{isBengali ? "ডিফল্ট প্রাথমিক পাসকোড: 7530" : "Default Initial Passcode: 7530"}</span>
              </p>
              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                {isBengali 
                  ? "যে কেউ আপনার অ্যাডমিন ইমেইল লিখলেই লগইন করতে পারবে না; তাকে অবশ্যই এই পাসকোড দিতে হবে। আপনি নিচে থেকে নিজের ইচ্ছামতো নতুন পাসকোড সেট করতে পারেন।"
                  : "Anyone entering the admin email cannot log in without this passcode. You can update it anytime below."}
              </p>
            </div>

            {/* Alert Message */}
            <AnimatePresence>
              {passcodeMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
                    passcodeMsg.type === "success" 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300"
                  }`}
                >
                  <span>{passcodeMsg.text}</span>
                  <button
                    type="button"
                    onClick={() => setPasscodeMsg(null)}
                    className="p-1 text-xs hover:opacity-70 cursor-pointer"
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Change Passcode Form */}
            <form onSubmit={handleChangePasscode} className="space-y-3 pt-2 max-w-lg">
              <div className="space-y-1">
                <label className={`text-[10px] font-bold ${theme.textHeading} uppercase tracking-wider block`}>
                  {isBengali ? "বর্তমান পাসকোড (Current Passcode)" : "Current Passcode"}
                </label>
                <div className="relative">
                  <input
                    type={showSettingsPasscodes ? "text" : "password"}
                    required
                    value={currentPasscode}
                    onChange={(e) => setCurrentPasscode(e.target.value)}
                    placeholder={isBengali ? "বর্তমান পাসকোড দিন (ডিফল্ট: 7530)" : "Enter current passcode"}
                    className={`w-full ${theme.bgPage} px-3 pr-10 h-10 rounded-xl border ${theme.borderCard} text-xs font-bold ${theme.textMain} focus:outline-none focus:border-amber-500`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSettingsPasscodes(!showSettingsPasscodes)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showSettingsPasscodes ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold ${theme.textHeading} uppercase tracking-wider block`}>
                    {isBengali ? "নতুন পাসকোড" : "New Passcode"}
                  </label>
                  <input
                    type={showSettingsPasscodes ? "text" : "password"}
                    required
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    placeholder={isBengali ? "নতুন গোপন পাসকোড" : "New passcode (min 4 chars)"}
                    className={`w-full ${theme.bgPage} px-3 h-10 rounded-xl border ${theme.borderCard} text-xs font-bold ${theme.textMain} focus:outline-none focus:border-amber-500`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] font-bold ${theme.textHeading} uppercase tracking-wider block`}>
                    {isBengali ? "পাসকোড নিশ্চিত করুন" : "Confirm Passcode"}
                  </label>
                  <input
                    type={showSettingsPasscodes ? "text" : "password"}
                    required
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value)}
                    placeholder={isBengali ? "আবারও নতুন পাসকোড" : "Confirm new passcode"}
                    className={`w-full ${theme.bgPage} px-3 h-10 rounded-xl border ${theme.borderCard} text-xs font-bold ${theme.textMain} focus:outline-none focus:border-amber-500`}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isChangingPasscode}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  {isChangingPasscode ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>{isBengali ? "পরিবর্তন হচ্ছে..." : "Updating..."}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5" />
                      <span>{isBengali ? "সিকিউরিটি পাসকোড আপডেট করুন" : "Update Admin Passcode"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Official Email Dispatcher Card */}
          <div className={`${theme.bgCard} rounded-2xl border ${theme.borderCard} shadow-sm overflow-hidden p-5 sm:p-6 space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={`text-base font-black ${theme.textHeading}`}>
                    {isBengali ? "অফিশিয়াল জিমেইল প্রেরক কনফিগারেশন" : "Official Gmail Dispatcher Settings"}
                  </h3>
                  <p className={`text-xs ${theme.textMuted} font-medium`}>
                    {isBengali 
                      ? "পাসওয়ার্ড রিকভারি ওটিপি (OTP) ও অনুমোদন ইমেইল স্বয়ংক্রিয়ভাবে প্রেরণের ব্যবস্থা।" 
                      : "Automated OTP and approval emails dispatching configuration."}
                  </p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-2xs font-extrabold uppercase border ${
                gmailTokenAvailable || adminAppPasswordInput
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20"
              }`}>
                {gmailTokenAvailable || adminAppPasswordInput 
                  ? (isBengali ? "সক্রিয় (Active)" : "Active") 
                  : (isBengali ? "অসম্পূর্ণ (Setup Needed)" : "Setup Needed")}
              </span>
            </div>

            {/* Quick Status */}
            <div className="p-3.5 rounded-xl bg-slate-500/5 border border-slate-200/60 dark:border-slate-800/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Official Sender:</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">studyhub2026admin@gmail.com</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Google Workspace OAuth:</span>
                <span className={`font-bold ${gmailTokenAvailable ? "text-emerald-600" : "text-amber-500"}`}>
                  {gmailTokenAvailable ? "✅ Connected" : "⚠️ Not Connected"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Google App Password (SMTP):</span>
                <span className={`font-bold ${adminAppPasswordInput ? "text-emerald-600" : "text-slate-400"}`}>
                  {adminAppPasswordInput ? "✅ Configured (24/7 Background Sending)" : "Not Set"}
                </span>
              </div>
            </div>

            {/* Option 1: 16-character Google App Password (Permanent 24/7 background dispatch) */}
            <div className="p-4 rounded-xl border border-indigo-200/80 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-black uppercase">
                    {isBengali ? "সুপারিশকৃত (Recommended)" : "Recommended"}
                  </span>
                  <h4 className="text-xs font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
                    {isBengali ? "গুগল অ্যাপ পাসওয়ার্ড (App Password)" : "Google App Password (24/7 Background Sending)"}
                  </h4>
                </div>
                <p className="text-[11px] text-indigo-900/80 dark:text-indigo-300/80 mt-1 leading-relaxed">
                  {isBengali 
                    ? "গুগলের নতুন নিরাপত্তা নীতিতে OAuth পপআপ ব্লক (Error 403) হতে পারে। কিন্তু Google App Password ব্যবহার করলে কোনো ভেরিফিকেশন বাধা ছাড়াই ২৪ ঘণ্টা নিরবচ্ছিন্নভাবে প্রতিটি ওটিপি ও অনুমোদন ইমেইল পাঠানো যায়।"
                    : "Google blocks third-party OAuth popups for Gmail scopes (Error 403). Using a Google App Password bypasses this restriction and delivers real emails 24/7."}
                </p>
                <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <a
                    href="https://myaccount.google.com/apppasswords"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 font-bold underline"
                  >
                    myaccount.google.com/apppasswords
                  </a> {isBengali ? 'এ গিয়ে "StudyHub" নামে ১৬-সংখ্যার পাসওয়ার্ড তৈরি করুন।' : 'to generate a 16-character password.'}
                </div>
              </div>

              {appPasswordSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {appPasswordSuccessMsg}
                </div>
              )}

              <form onSubmit={handleSaveAppPassword} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="password"
                  value={adminAppPasswordInput}
                  onChange={(e) => setAdminAppPasswordInput(e.target.value)}
                  placeholder="xxxx xxxx xxxx xxxx"
                  className={`flex-1 ${theme.bgPage} px-3.5 h-10 rounded-xl border ${theme.borderCard} text-xs font-mono font-bold ${theme.textMain} focus:outline-none focus:border-indigo-500`}
                />
                <button
                  type="submit"
                  disabled={isSavingAppPassword || !adminAppPasswordInput.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isSavingAppPassword ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Lock className="h-3.5 w-3.5" />}
                  <span>{isBengali ? "পাসওয়ার্ড সেভ করুন" : "Save App Password"}</span>
                </button>
              </form>
            </div>

            {/* Option 2: 1-Click Connect Gmail (For verified Google Cloud projects) */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-500/5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    {isBengali ? "বিকল্প: গুগল সাইন-ইন দিয়ে কানেক্ট (OAuth)" : "Alternative: Google Sign-in OAuth"}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isBengali 
                      ? "নোট: গুগল প্রজেক্ট আনভেরিফাইড থাকলে গুগল Error 403 (access_denied) দেখাতে পারে।"
                      : "Note: May trigger Google Error 403 if project is unverified."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleConnectGmail}
                  disabled={isConnectingGmail}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isConnectingGmail ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
                  <span>{isBengali ? "Connect Admin Gmail" : "Connect Admin Gmail"}</span>
                </button>
              </div>
            </div>
          </div>

        </motion.div>
      )}

      {activeTab === "updates" && (
        <motion.div variants={itemVariants} className={`${theme.bgCard} rounded-2xl border ${theme.borderCard} shadow-sm overflow-hidden p-5 sm:p-7 space-y-6`}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                  <Rocket className="h-5 w-5" />
                </div>
                <h2 className={`text-lg font-black ${theme.textHeading}`}>
                  {isBengali ? "ফুল-স্ক্রিন সিস্টেম আপডেট কন্ট্রোল সেন্টার" : "Full-Screen App Update Center"}
                </h2>
              </div>
              <p className={`text-xs ${theme.textMuted} mt-1 font-medium`}>
                {isBengali 
                  ? "নতুন সংস্করণ প্রকাশ করুন। প্রকাশের সাথে সাথে সকল শিক্ষার্থীর ডিভাইসে পুরো স্ক্রিন জুড়ে স্প্ল্যাশ আপডেট স্ক্রিন চলে আসবে এবং স্বয়ংক্রিয়ভাবে আপডেট হবে।" 
                  : "Release new updates. When published, all connected users will instantly see the full-screen splash update screen and automatically upgrade."}
              </p>
            </div>
            
            {/* Current Active Live Version Pill */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold shrink-0">
              <span className="text-slate-500">{isBengali ? "বর্তমান সংস্করণ:" : "Live Version:"}</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-mono font-black">
                v{currentAppVersion || "2.6.6"}
              </span>
            </div>
          </div>

          {/* Update Message Alert if present */}
          {updateMessage && (
            <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs font-semibold ${
              updateMessage.type === "success" 
                ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}>
              {updateMessage.type === "success" ? <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" /> : <ShieldAlert className="h-5 w-5 shrink-0 text-rose-600" />}
              <div>{updateMessage.text}</div>
            </div>
          )}

          {/* Form to release update */}
          <form onSubmit={handlePublishUpdate} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>{isBengali ? "নতুন সংস্করণ নম্বর (Version Code) *" : "New Version Code *"}</span>
                  <span className="text-[10px] text-slate-400 font-normal">যেমন: 2.6.7 বা 2.7.0</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="2.6.7"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    className={`flex-1 ${theme.bgPage} px-3.5 py-2.5 rounded-xl border ${theme.borderCard} text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
                  />
                  {/* Quick Increment Buttons */}
                  <button
                    type="button"
                    onClick={() => {
                      const cur = currentAppVersion || "2.6.6";
                      const parts = cur.split(".").map(Number);
                      parts[2] = (parts[2] || 0) + 1;
                      setNewVersion(parts.join("."));
                    }}
                    className="px-2.5 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                    title="Auto increment patch version (+0.0.1)"
                  >
                    + Patch
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = currentAppVersion || "2.6.6";
                      const parts = cur.split(".").map(Number);
                      parts[1] = (parts[1] || 0) + 1;
                      parts[2] = 0;
                      setNewVersion(parts.join("."));
                    }}
                    className="px-2.5 py-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                    title="Auto increment minor version (+0.1.0)"
                  >
                    + Minor
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {isBengali ? "আপডেটের বিবরণ / চেঞ্জলগ (বাংলা) *" : "Changelog (Bengali) *"}
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ফুল-স্ক্রিন স্প্ল্যাশ আপডেট ও ইন্টারফেসের গতি বৃদ্ধি করা হয়েছে।"
                  value={changelogBn}
                  onChange={(e) => setChangelogBn(e.target.value)}
                  className={`w-full ${theme.bgPage} px-3.5 py-2.5 rounded-xl border ${theme.borderCard} text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {isBengali ? "আপডেটের বিবরণ / চেঞ্জলগ (English - Optional)" : "Changelog (English - Optional)"}
              </label>
              <input
                type="text"
                placeholder="e.g. Added immersive full-screen splash update screen and performance optimizations."
                value={changelogEn}
                onChange={(e) => setChangelogEn(e.target.value)}
                className={`w-full ${theme.bgPage} px-3.5 py-2.5 rounded-xl border ${theme.borderCard} text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={isPublishing}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{isBengali ? "সম্প্রচার হচ্ছে..." : "Broadcasting..."}</span>
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4" />
                    <span>{isBengali ? "🚀 সব ডিভাইসে আপডেট সম্প্রচার করুন" : "🚀 Broadcast Update to All Devices"}</span>
                  </>
                )}
              </button>

              {/* Test Splash Preview Button */}
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("studyhub_trigger_update", {
                    detail: {
                      targetVersion: newVersion.trim() || "2.6.7 (প্রিভিউ)",
                      changelogBn: changelogBn.trim() || "নতুন ফুল-স্ক্রিন স্প্ল্যাশ স্ক্রিন সিস্টেম সফলভাবে অ্যাক্টিভ হয়েছে!",
                      changelogEn: changelogEn.trim() || "Full-screen splash update preview.",
                      isTest: true
                    }
                  }));
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span>{isBengali ? "স্প্ল্যাশ আপডেট স্ক্রিন টেস্ট প্রিভিউ" : "Test Splash Screen Preview"}</span>
              </button>
            </div>
          </form>

          {/* Visual Information Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border border-indigo-200/70 text-xs space-y-2">
            <h4 className="font-black text-indigo-950 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              {isBengali ? "ফুল-স্ক্রিন স্প্ল্যাশ আপডেট যেভাবে কাজ করে:" : "How the Full-Screen Splash Update Works:"}
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 leading-relaxed font-medium">
              <li>
                {isBengali 
                  ? "অ্যাডমিন নতুন ভার্সন প্রকাশ করার সাথে সাথেই সকল কানেক্টেড ছাত্র-ছাত্রীর ব্রাউজারে স্বয়ংক্রিয়ভাবে পুরো স্ক্রিন জুড়ে স্প্ল্যাশ স্ক্রিন ফুটে উঠবে।"
                  : "As soon as you publish a new version, every connected student's browser immediately displays the full-screen splash update screen."}
              </li>
              <li>
                {isBengali 
                  ? "ইউজার যে পেজেই থাকুক না কেন (লগইন, ওয়েলকাম, নোটস, বা ড্যাশবোর্ড), পুরো স্ক্রিন জুড়ে স্প্ল্যাশ প্রগ্রেস বার ও চেঞ্জলগ লাইভ চলবে।"
                  : "Regardless of what page the user is on (Welcome, Notes, or Dashboard), the splash screen takes over the entire viewport with live progress."}
              </li>
              <li>
                {isBengali 
                  ? "১০০% ইন্সটল হওয়া মাত্র স্বয়ংক্রিয়ভাবে পেজ রিলোড হয়ে নতুন ফিচার ও ইন্টারফেস সরাসরি সামনে চলে আসবে।"
                  : "Once reaching 100%, the app cleanly reloads and presents all the latest features seamlessly."}
              </li>
            </ul>
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}

