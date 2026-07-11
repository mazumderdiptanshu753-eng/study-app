import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Send, 
  User, 
  Shield, 
  Sparkles, 
  Clock, 
  
  Search,
  MessageCircle,
  AlertCircle
} from "lucide-react";
import { StudentProfile, ChatMessage } from "../types";
import { Language, TRANSLATIONS } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";

interface SupportChatProps {
  profile: StudentProfile;
  lang: Language;
  theme: ThemeConfig;
}

export default function SupportChat({ profile, lang, theme }: SupportChatProps) {
  const t = TRANSLATIONS[lang];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // For Admin View
  const [selectedStudentEmail, setSelectedStudentEmail] = useState<string | null>(null);
  const [adminSearchTerm, setAdminSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isAdmin = profile.role === "Admin";

  // Fetch messages from backend
  const fetchMessages = async (silent = false) => {
    try {
      const url = `/api/chat/messages?email=${encodeURIComponent(profile.email)}&role=${profile.role}&name=${encodeURIComponent(profile.fullName)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json();
      setMessages(data);
      if (error) setError(null);
    } catch (e: any) {
      if (!silent) {
        setError("Unable to connect to the live chat server. Please make sure the server is online.");
      }
    }
  };

  // Initial fetch and polling every 4 seconds for real-time exchange
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [profile.email, profile.role]);

  // Scroll to bottom when messages or typing status changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, selectedStudentEmail]);

  // Send a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    setInputText("");
    setError(null);

    // Determine target student email
    let studentEmail = profile.email;
    let studentName = profile.fullName;
    
    if (isAdmin) {
      if (!selectedStudentEmail) {
        setError("Please select a student conversation first.");
        return;
      }
      studentEmail = selectedStudentEmail;
      // Find the student name from existing messages
      const found = messages.find(m => m.studentEmail === selectedStudentEmail);
      studentName = found ? found.studentName : "Student";
    }

    const payload = {
      senderName: profile.fullName,
      senderEmail: profile.email,
      senderRole: profile.role,
      message: messageText,
      studentEmail: studentEmail,
      studentName: studentName
    };

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("Could not deliver message");
      
      const savedMsg = await res.json();
      setMessages(prev => [...prev, savedMsg]);
    } catch (err: any) {
      setError("Failed to deliver your message. Please try again.");
    }
  };

  // Helper to group messages by student for Admin View
  const getStudentConversations = () => {
    const groups: Record<string, {
      studentEmail: string;
      studentName: string;
      lastMessage: string;
      lastTimestamp: string;
      unreadCount: number;
    }> = {};

    messages.forEach(msg => {
      const emailKey = (msg.studentEmail || "").toLowerCase().trim();
      if (!emailKey) return;
      // Only keep track of student conversations
      if (!groups[emailKey]) {
        groups[emailKey] = {
          studentEmail: msg.studentEmail || "",
          studentName: msg.studentName || "Unknown Student",
          lastMessage: msg.message || "",
          lastTimestamp: msg.timestamp || new Date().toISOString(),
          unreadCount: 0
        };
      } else {
        // Update to latest message
        const currentTimestamp = msg.timestamp ? new Date(msg.timestamp).getTime() : 0;
        const lastTimestamp = groups[emailKey].lastTimestamp ? new Date(groups[emailKey].lastTimestamp).getTime() : 0;
        if (currentTimestamp > lastTimestamp) {
          groups[emailKey].lastMessage = msg.message || "";
          groups[emailKey].lastTimestamp = msg.timestamp || new Date().toISOString();
        }
      }
    });

    return Object.values(groups)
      .filter(c => 
        (c.studentName || "").toLowerCase().includes((adminSearchTerm || "").toLowerCase()) ||
        (c.studentEmail || "").toLowerCase().includes((adminSearchTerm || "").toLowerCase())
      )
      .sort((a, b) => {
        const timeA = a.lastTimestamp ? new Date(a.lastTimestamp).getTime() : 0;
        const timeB = b.lastTimestamp ? new Date(b.lastTimestamp).getTime() : 0;
        return timeB - timeA;
      });
  };

  // Filter messages for active student thread
  const getActiveThreadMessages = () => {
    if (isAdmin) {
      if (!selectedStudentEmail) return [];
      return messages.filter(m => (m?.studentEmail || "").toLowerCase().trim() === (selectedStudentEmail || "").toLowerCase().trim());
    }
    return messages;
  };

  const conversations = isAdmin ? getStudentConversations() : [];
  const activeMessages = getActiveThreadMessages();

  // If admin has not selected a student yet, auto-select the first conversation if available (on desktop)
  useEffect(() => {
    if (isAdmin && !selectedStudentEmail && conversations.length > 0 && typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSelectedStudentEmail(conversations[0].studentEmail);
    }
  }, [messages, isAdmin]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-3xs">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            {t.chatHeaderTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isAdmin 
              ? (lang === "bn" ? "প্রশাসক নিয়ন্ত্রণ প্যানেল: শিক্ষার্থীদের প্রশ্নের উত্তর দিন এবং তাদের সাহায্য করুন।" : "Admin Control Panel: Reply to student questions and guide their studies.")
              : t.chatAssistantHint}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850 overflow-hidden min-h-[580px] h-[580px] shadow-3xs">
        
        {/* Left Column (Conversations List) - ADMIN ONLY */}
        {isAdmin && (
          <div className={`lg:col-span-4 bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-850 flex flex-col h-full ${selectedStudentEmail ? "hidden lg:flex" : "flex"}`}>
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-850">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder={lang === "bn" ? "শিক্ষার্থী খুঁজুন..." : "Search students..."}
                  value={adminSearchTerm}
                  onChange={(e) => setAdminSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 pl-9 pr-4 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-900/50">
              {conversations.map((c) => {
                const isActive = (selectedStudentEmail || "").toLowerCase().trim() === (c.studentEmail || "").toLowerCase().trim();
                return (
                  <button
                    key={c.studentEmail}
                    onClick={() => setSelectedStudentEmail(c.studentEmail)}
                    className={`w-full text-left p-4 transition-all flex items-start gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-900/80 ${
                      isActive ? "bg-teal-50/50 dark:bg-teal-950/30 border-l-4 border-teal-600" : ""
                    }`}
                  >
                    <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 shrink-0 uppercase text-xs">
                      {c.studentName.substring(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate block">{c.studentName}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-medium">
                          {new Date(c.lastTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-2xs text-slate-400 dark:text-slate-500 truncate block font-mono">{c.studentEmail}</p>
                      <p className="text-2xs text-slate-500 dark:text-slate-400 truncate block font-medium mt-0.5 leading-normal">
                        {c.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })}

              {conversations.length === 0 && (
                <div className="text-center py-20 text-slate-400 text-xs px-4">
                  <MessageCircle className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold">
                    {lang === "bn" ? "কোনো চ্যাট পাওয়া যায়নি" : "No student chats found"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {lang === "bn" ? "শিক্ষার্থীরা কোনো মেসেজ পাঠালে এখানে দৃশ্যমান হবে।" : "Students will appear here once they send a message."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Column (Message Log) */}
        <div className={`flex flex-col h-full bg-white dark:bg-slate-950 ${isAdmin ? "lg:col-span-8" : "lg:col-span-12"} ${isAdmin && !selectedStudentEmail ? "hidden lg:flex" : "flex"}`}>
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between bg-white dark:bg-slate-950">
            <div className="flex items-center gap-2.5">
              {isAdmin && selectedStudentEmail && (
                <button
                  onClick={() => setSelectedStudentEmail(null)}
                  className="lg:hidden flex items-center justify-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all font-bold text-xs cursor-pointer mr-1"
                >
                  ← {lang === "bn" ? "আলাপন" : "Chats"}
                </button>
              )}
              <div className="h-9 w-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0 shadow-3xs">
                {isAdmin ? <Shield className="h-4.5 w-4.5" /> : <Shield className="h-4.5 w-4.5" />}
              </div>
              <div className="text-left">
                <span className="font-bold text-xs text-slate-800 dark:text-white block">
                  {isAdmin 
                    ? (lang === "bn" ? `আলাপ করছেন: ${conversations.find(c => c.studentEmail === selectedStudentEmail)?.studentName || "শিক্ষার্থী নির্বাচন করুন"}` : `Chatting with: ${conversations.find(c => c.studentEmail === selectedStudentEmail)?.studentName || "Select a Student"}`)
                    : (lang === "bn" ? "স্টাডি হাব এডমিন সহায়তা" : "STUDY HUB Admin Support")}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  {lang === "bn" ? "নিরাপদ চ্যাট সংযোগ সক্রিয়" : "Active Secure Connection"}
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-slate-950">
            {activeMessages.map((msg) => {
              // Message from self
              const isSelf = (msg?.senderEmail || "").toLowerCase().trim() === (profile?.email || "").toLowerCase().trim();
              return (
                <div 
                  key={msg.id} 
                  className={`flex ${isSelf ? "justify-end" : "justify-start"} items-end gap-2.5 max-w-full`}
                >
                  {/* Sender Icon (Left side) */}
                  {!isSelf && (
                    <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase shrink-0">
                      {msg.senderRole === "Admin" ? "👑" : "🎓"}
                    </div>
                  )}

                  <div className="space-y-1 max-w-[75%]">
                    {/* Bubble */}
                    <div 
                      className={`rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed shadow-3xs ${
                        isSelf 
                          ? "bg-teal-600 text-white rounded-br-none" 
                          : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none"
                      }`}
                    >
                      <p className="break-words whitespace-pre-wrap">{msg.message}</p>
                    </div>

                    {/* Metadata */}
                    <div className={`flex items-center gap-1 text-[9px] text-slate-400 ${isSelf ? "justify-end" : "justify-start"}`}>
                      <span className="font-bold">{msg.senderName}</span>
                      <span>•</span>
                      <Clock className="h-2.5 w-2.5 text-slate-400" />
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString(lang === "bn" ? "bn-BD" : [], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing status indicator */}
            {isTyping && (
              <div className="flex justify-start items-end gap-2.5">
                <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs shrink-0">
                  👑
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-bl-none px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 shadow-3xs flex items-center gap-1">
                  <span className="font-semibold text-2xs">
                    {lang === "bn" ? "প্রশাসক উত্তর লিখছেন" : "Admin is writing"}
                  </span>
                  <span className="flex gap-0.5 ml-1">
                    <span className="h-1 w-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="h-1 w-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="h-1 w-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </span>
                </div>
              </div>
            )}

            {activeMessages.length === 0 && (
              <div className="text-center py-20 text-slate-400 text-xs">
                <MessageSquare className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold">
                  {lang === "bn" ? "এখনও কোনো মেসেজ নেই" : "No messages yet"}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {isAdmin 
                    ? (lang === "bn" ? "নিচে উত্তর লিখে শুরু করুন।" : "Select a student to view their messages or start typing below.") 
                    : (lang === "bn" ? "সরাসরি এডমিন দীপ্তাংশুর সাথে কথা বলতে নিচে প্রশ্নটি লিখুন।" : "Type a question below to connect with our support administrator!")}
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-950">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isAdmin && !selectedStudentEmail}
                placeholder={
                  isAdmin 
                    ? (selectedStudentEmail ? (lang === "bn" ? "উত্তর লিখুন..." : "Type your official reply...") : (lang === "bn" ? "শিক্ষার্থী নির্বাচন করুন..." : "Select a student to begin...")) 
                    : t.chatInputPlaceholder
                }
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-teal-500 focus:outline-hidden disabled:bg-slate-50 dark:disabled:bg-slate-900/40 disabled:text-slate-400 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || (isAdmin && !selectedStudentEmail)}
                className="rounded-xl bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
}
