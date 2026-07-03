import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeConfig } from "../lib/themes";
import { Language } from "../lib/translations";
import { MessageCircle, Users, Search, Plus, X, Send, Clock, User, MessageSquare } from "lucide-react";
import { UserProfile } from "../types"; // Assuming types are in types.ts or we can use any

interface ForumReply {
  id: string;
  authorEmail: string;
  authorName: string;
  content: string;
  timestamp: string;
}

interface ForumPost {
  id: string;
  authorEmail: string;
  authorName: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: ForumReply[];
}

interface CommunityForumProps {
  theme: ThemeConfig;
  lang: Language;
  profile: any; // UserProfile
  onBack: () => void;
}

export default function CommunityForum({ theme, lang, profile, onBack }: CommunityForumProps) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/forum/posts");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    try {
      const res = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorEmail: profile.email,
          authorName: profile.fullName || "Student",
          title: newTitle,
          content: newContent
        })
      });
      if (res.ok) {
        setIsCreating(false);
        setNewTitle("");
        setNewContent("");
        fetchPosts();
      }
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  const handleReply = async (postId: string) => {
    if (!replyContent.trim()) return;
    try {
      const res = await fetch(`/api/forum/posts/${postId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorEmail: profile.email,
          authorName: profile.fullName || "Student",
          content: replyContent
        })
      });
      if (res.ok) {
        setReplyContent("");
        fetchPosts();
      }
    } catch (err) {
      console.error("Failed to reply", err);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString(lang === "bn" ? "bn-IN" : "en-IN", {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto w-full"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`p-2 rounded-full border ${theme.borderCard} ${theme.bgCard} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
          >
            <X className={`h-5 w-5 ${theme.textHeading}`} />
          </button>
          <div>
            <h2 className={`text-2xl font-black ${theme.textHeading} flex items-center gap-2`}>
              <Users className="h-6 w-6 text-blue-500" />
              {lang === "bn" ? "ডিসকাশন ফোরাম" : "Community Forum"}
            </h2>
            <p className={`text-sm ${theme.textMuted} mt-1`}>
              {lang === "bn" ? "একে অপরের সাথে বিষয়ভিত্তিক আলোচনা করুন" : "Discuss topics and ask questions with other students"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95 ${theme.primaryBtn} ${theme.primaryBtnText}`}
        >
          <Plus className="h-4 w-4" />
          {lang === "bn" ? "নতুন প্রশ্ন করুন" : "New Post"}
        </button>
      </div>

      <div className={`relative flex items-center mb-6`}>
        <Search className={`absolute left-4 h-5 w-5 ${theme.textMuted}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={lang === "bn" ? "বিষয় বা প্রশ্ন খুঁজুন..." : "Search topics or questions..."}
          className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${theme.borderCard} ${theme.bgCard} ${theme.textMain} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium`}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border ${theme.borderCard} ${theme.bgCard} overflow-hidden shadow-sm hover:shadow-md transition-all`}
              >
                <div 
                  onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                  className="p-5 cursor-pointer flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shadow-sm">
                        {post.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${theme.textHeading}`}>{post.authorName}</p>
                        <p className={`text-[10px] ${theme.textMuted} flex items-center gap-1`}>
                          <Clock className="h-3 w-3" />
                          {formatDate(post.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className={`text-base font-black ${theme.textHeading} mb-1 leading-snug`}>{post.title}</h3>
                    <p className={`text-sm ${theme.textMuted} line-clamp-2`}>{post.content}</p>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold ${theme.textMuted}`}>
                      <MessageSquare className="h-4 w-4" />
                      {post.replies?.length || 0} {lang === "bn" ? "টি উত্তর" : "Replies"}
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedPostId === post.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className={`border-t ${theme.borderCard} bg-slate-50/50 dark:bg-slate-900/30 overflow-hidden`}
                    >
                      <div className="p-5 space-y-6">
                        {/* Full Content */}
                        <div className={`text-sm ${theme.textMain} leading-relaxed whitespace-pre-wrap`}>
                          {post.content}
                        </div>

                        {/* Replies */}
                        <div className="space-y-4 pl-4 border-l-2 border-blue-500/20">
                          {post.replies?.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs shrink-0 text-slate-600 dark:text-slate-300">
                                {reply.authorName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                  <p className={`text-xs font-bold ${theme.textHeading}`}>{reply.authorName}</p>
                                  <span className={`text-[10px] ${theme.textMuted}`}>{formatDate(reply.timestamp)}</span>
                                </div>
                                <p className={`text-sm ${theme.textMain} leading-snug`}>{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add Reply */}
                        <div className="flex items-end gap-2 mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder={lang === "bn" ? "আপনার উত্তর লিখুন..." : "Write a reply..."}
                            className={`flex-1 min-h-[44px] max-h-32 p-3 rounded-xl border ${theme.borderCard} bg-white dark:bg-slate-950 ${theme.textMain} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none font-medium`}
                            rows={1}
                          />
                          <button
                            onClick={() => handleReply(post.id)}
                            disabled={!replyContent.trim()}
                            className={`p-3 rounded-xl shadow-sm transition-all text-white ${replyContent.trim() ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer active:scale-95' : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'}`}
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredPosts.length === 0 && (
            <div className={`text-center py-12 ${theme.textMuted}`}>
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="font-bold text-lg">{lang === "bn" ? "কোনো প্রশ্ন পাওয়া যায়নি" : "No discussions found"}</p>
              <p className="text-sm mt-1">{lang === "bn" ? "প্রথম প্রশ্নটি আপনি করুন!" : "Be the first to start a discussion!"}</p>
            </div>
          )}
        </div>
      )}

      {/* Create Post Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-lg ${theme.bgCard} rounded-3xl shadow-2xl p-6 border ${theme.borderCard} z-10`}
            >
              <h3 className={`text-xl font-black ${theme.textHeading} mb-4 flex items-center gap-2`}>
                <MessageCircle className="h-5 w-5 text-blue-500" />
                {lang === "bn" ? "নতুন আলোচনা শুরু করুন" : "Start a New Discussion"}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-bold ${theme.textHeading} mb-1.5`}>
                    {lang === "bn" ? "বিষয়/শিরোনাম" : "Title / Subject"}
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={lang === "bn" ? "যেমন: SSC CGL এর জন্য কোন বই ভালো?" : "e.g., Best books for SSC CGL?"}
                    className={`w-full p-3 rounded-xl border ${theme.borderCard} bg-white dark:bg-slate-950 ${theme.textMain} font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-bold ${theme.textHeading} mb-1.5`}>
                    {lang === "bn" ? "বিস্তারিত বিবরণ" : "Details"}
                  </label>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder={lang === "bn" ? "আপনার প্রশ্ন বা আলোচনার বিষয় বিস্তারিত লিখুন..." : "Write your question or topic in detail..."}
                    rows={5}
                    className={`w-full p-3 rounded-xl border ${theme.borderCard} bg-white dark:bg-slate-950 ${theme.textMain} font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none`}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsCreating(false)}
                  className={`flex-1 py-3 rounded-xl font-bold border ${theme.borderCard} ${theme.textMain} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
                >
                  {lang === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!newTitle.trim() || !newContent.trim()}
                  className={`flex-1 py-3 rounded-xl font-bold text-white transition-all ${
                    newTitle.trim() && newContent.trim()
                      ? 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-md cursor-pointer'
                      : 'bg-blue-400 dark:bg-blue-800 cursor-not-allowed opacity-70'
                  }`}
                >
                  {lang === "bn" ? "পোস্ট করুন" : "Post Discussion"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
