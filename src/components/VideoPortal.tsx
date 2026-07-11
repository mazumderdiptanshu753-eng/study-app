import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Plus, 
  Trash2, DownloadCloud, 
  MessageSquare, 
  Clock, 
  User, 
  Send, 
  Video, 
  Sparkles,
  Info,
  ChevronRight,
  Tv,
  Check,
  AlertCircle
} from "lucide-react";
import { StudentProfile, VideoLecture, VideoComment, Subject } from "../types";
import { Language, TRANSLATIONS } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";

interface VideoPortalProps {
  profile: StudentProfile | null;
  lang: Language;
  theme: ThemeConfig;
  onVideosCountChange?: (count: number) => void;
}

// Helper to extract clean youtube embed URL from common YouTube watch/share links
export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  
  // Standardize string
  const cleanUrl = url.trim();

  // If already an embed link
  if (cleanUrl.includes("youtube.com/embed/") || cleanUrl.includes("player.vimeo.com")) {
    return cleanUrl;
  }

  // Handle standard watch links: youtube.com/watch?v=VIDEO_ID
  if (cleanUrl.includes("youtube.com/watch")) {
    try {
      const urlObj = new URL(cleanUrl);
      const videoId = urlObj.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (e) {
      // fallback regex
    }
  }

  // Handle short links: youtu.be/VIDEO_ID
  if (cleanUrl.includes("youtu.be/")) {
    try {
      const parts = cleanUrl.split("youtu.be/");
      if (parts.length > 1) {
        const afterUrl = parts[1].split(/[?#]/)[0];
        if (afterUrl) {
          return `https://www.youtube.com/embed/${afterUrl}`;
        }
      }
    } catch (e) {}
  }

  // General YouTube regex matcher for watch/v/embed/etc
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = cleanUrl.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }

  return null;
}

// Curated preloaded videos to make the workspace look full of life
const PRELOADED_VIDEOS: VideoLecture[] = [];

export default function VideoPortal({ profile, lang, theme, onVideosCountChange }: VideoPortalProps) {
  const t = TRANSLATIONS[lang];
  const role = profile?.role || "Student";
  const userEmail = profile?.email || "guest@studyhub.com";
  const userName = profile?.fullName || "Guest User";

  const [videos, setVideos] = useState<VideoLecture[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/videos");
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (e) {
      console.error("Failed to fetch videos:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Keep parent in sync with video counts
  useEffect(() => {
    if (onVideosCountChange) {
      onVideosCountChange(videos.length);
    }
  }, [videos, onVideosCountChange]);

  const [selectedVideo, setSelectedVideo] = useState<VideoLecture | null>(null);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  
  // Form states for new video
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newSubject, setNewSubject] = useState("Mathematics");
  const [errorMessage, setErrorMessage] = useState("");

  // Comment input state
  const [newCommentText, setNewCommentText] = useState("");

  // Keep selected video synchronized with real-time updates from videos array (e.g., comments)
  useEffect(() => {
    if (selectedVideo) {
      const updated = videos.find(v => v.id === selectedVideo.id);
      if (updated) {
        setSelectedVideo(updated);
      }
    } else if (videos.length > 0) {
      setSelectedVideo(videos[0]);
    }
  }, [videos]);

  // Add new video (Admin Only - Backend)
  const handleAddVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!newTitle.trim() || !newDescription.trim() || !newUrl.trim()) {
      setErrorMessage(lang === "bn" ? "দয়া করে সবগুলো ঘর পূরণ করুন।" : "Please fill out all required fields.");
      return;
    }

    let parsedEmbedUrl = getYouTubeEmbedUrl(newUrl);
    if (!parsedEmbedUrl) {
      // If it's not a standard youtube, check if it's a direct video link or vimeo or general iframe url
      if (newUrl.toLowerCase().endsWith(".mp4") || newUrl.includes("vimeo.com") || newUrl.includes("embed") || newUrl.includes("http")) {
        parsedEmbedUrl = newUrl;
      } else {
        setErrorMessage(
          lang === "bn" 
            ? "দয়া করে একটি সঠিক ইউটিউব লিংক বা ভিডিও ইউআরএল (MP4) প্রদান করুন।" 
            : "Invalid video URL. Please provide a valid YouTube link or direct video URL."
        );
        return;
      }
    }

    const newLecture: VideoLecture = {
      id: `vid-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim(),
      videoUrl: parsedEmbedUrl,
      uploadedBy: userName + " (" + (lang === "bn" ? "প্রশাসক" : "Admin") + ")",
      timestamp: new Date().toISOString(),
      subject: newSubject,
      comments: []
    };

    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLecture)
      });
      if (res.ok) {
        await fetchVideos();
        setSelectedVideo(newLecture);
        // Reset Form
        setNewTitle("");
        setNewDescription("");
        setNewUrl("");
        setIsAddingVideo(false);
      } else {
        setErrorMessage(lang === "bn" ? "ভিডিও সংরক্ষণ করতে ব্যর্থ হয়েছে।" : "Failed to save the video.");
      }
    } catch (err) {
      setErrorMessage(lang === "bn" ? "সার্ভার কানেকশন ত্রুটি।" : "Server connection error.");
    }
  };

  // Delete Video (Admin Only - Backend)
  const handleDeleteVideo = async (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = lang === "bn" ? "আপনি কি এই ভিডিও লেকচারটি মুছে ফেলতে চান?" : "Are you sure you want to delete this video lecture?";
    if (!window.confirm(msg)) return;

    try {
      const res = await fetch(`/api/videos/${videoId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await fetchVideos();
        if (selectedVideo?.id === videoId) {
          setSelectedVideo(null);
        }
      }
    } catch (err) {
      console.error("Error deleting video:", err);
    }
  };

  // Add Comment (All Logged-in Students & Admins - Backend)
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVideo || !newCommentText.trim()) return;

    const newComment: VideoComment = {
      id: `comment-${Date.now()}`,
      senderName: userName,
      senderEmail: userEmail,
      senderRole: role,
      avatarUrl: profile?.avatarUrl,
      comment: newCommentText.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      const res = await fetch(`/api/videos/${selectedVideo.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment)
      });
      if (res.ok) {
        await fetchVideos();
        setNewCommentText("");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Delete Comment (Admin can delete all, Student can delete their own - Backend)
  const handleDeleteComment = async (commentId: string) => {
    if (!selectedVideo) return;
    
    const msg = lang === "bn" ? "আপনি কি এই মন্তব্যটি মুছে ফেলতে চান?" : "Are you sure you want to delete this comment?";
    if (!window.confirm(msg)) return;

    try {
      const res = await fetch(`/api/videos/${selectedVideo.id}/comments/${commentId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await fetchVideos();
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
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
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Tab Banner Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Video className="h-6 w-6 text-teal-600" />
            {lang === "bn" ? "ভিডিও লেকচার পোর্টাল" : "Video Lecture Portal"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {lang === "bn" 
              ? "শিক্ষকদের আপলোডকৃত ক্লাসের ভিডিওসমূহ দেখুন এবং মন্তব্য করে আপনার মতামত জানান।" 
              : "Watch curated academic video lessons uploaded by teachers and interact through comments."}
          </p>
        </div>

        {role === "Admin" && (
          <button
            onClick={() => setIsAddingVideo(!isAddingVideo)}
            id="btn-trigger-add-video"
            className="inline-flex items-center gap-1.5 self-start rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-teal-700 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            {isAddingVideo ? (
              <>
                {lang === "bn" ? "তালিকায় ফিরে যান" : "Back to List"}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                {lang === "bn" ? "নতুন ভিডিও যোগ করুন" : "Upload Video Lesson"}
              </>
            )}
          </button>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Adding Video Form (Admin-only view state) OR Playlist Sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-4 order-2 lg:order-1">
          
          {role === "Admin" && isAddingVideo ? (
            /* Upload form block */
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-850 pb-2.5">
                <div className="rounded-lg bg-teal-50 dark:bg-teal-950/40 p-1.5 text-teal-600 dark:text-teal-400">
                  <Video className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                  {lang === "bn" ? "নতুন ভিডিও লেকচার ফর্ম" : "Add New Lecture Details"}
                </h3>
              </div>

              {errorMessage && (
                <div className="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-2xs font-semibold text-rose-700 border border-rose-100 animate-shake">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleAddVideoSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-450">
                    {lang === "bn" ? "ভিডিওর শিরোনাম *" : "Video Title *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={lang === "bn" ? "যেমন: ত্রিকোণমিতি বেসিকস" : "e.g. Introduction to Derivatives"}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-hidden focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-450">
                    {lang === "bn" ? "ভিডিও লিংক / ইউটিউব ইউআরএল *" : "YouTube Link or Video URL *"}
                  </label>
                  <input
                    type="url"
                    required
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-hidden focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/30"
                  />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-normal">
                    {lang === "bn" 
                      ? "ইউটিউব ওয়াচ লিংক বা ডাইরেক্ট MP4 লিংক পেস্ট করুন।" 
                      : "Paste any YouTube link, share link, or direct MP4 video link."}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-450">
                    {lang === "bn" ? "বিষয় *" : "Subject *"}
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-hidden focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/30"
                  >
                    <option value="Mathematics" className="bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100">{lang === "bn" ? "গণিত" : "Mathematics"}</option>
                    <option value="Physics" className="bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100">{lang === "bn" ? "পদার্থবিজ্ঞান" : "Physics"}</option>
                    <option value="Chemistry" className="bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100">{lang === "bn" ? "রসায়ন" : "Chemistry"}</option>
                    <option value="Biology" className="bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100">{lang === "bn" ? "জীববিজ্ঞান" : "Biology"}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-450">
                    {lang === "bn" ? "লেকচার বিবরণ *" : "Lecture Description *"}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder={lang === "bn" ? "এই লেকচারে কী শেখানো হয়েছে তার একটি বিবরণ লিখুন..." : "Describe the concepts covered in this video lesson..."}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 p-3 text-xs text-slate-800 dark:text-slate-200 outline-hidden focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/30"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-teal-600 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition-all cursor-pointer"
                >
                  {lang === "bn" ? "লেকচারটি পাবলিশ করুন" : "Publish Lecture Video"}
                </button>
              </form>
            </div>
          ) : (
            /* Standard Playlist sidebar list */
            <div className="rounded-2xl border border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-950 p-4 shadow-3xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850 pb-2.5 mb-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                  <Tv className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  {lang === "bn" ? "লেকচার প্লেলিস্ট" : "Lessons Playlist"}
                </h3>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
                  {videos.length} {lang === "bn" ? "টি ভিডিও" : "videos"}
                </span>
              </div>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {videos.map((vid) => {
                  const isActive = selectedVideo?.id === vid.id;
                  return (
                    <div
                      key={vid.id}
                      onClick={() => {
                        setSelectedVideo(vid);
                        setIsAddingVideo(false);
                      }}
                      className={`group p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isActive 
                          ? "bg-teal-50/70 border-teal-200" 
                          : "bg-slate-50/50 border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5 mb-1">
                        <span className="rounded-md bg-white px-1.5 py-0.5 text-[9px] font-extrabold text-teal-700 border border-teal-100 uppercase tracking-wider shrink-0">
                          {vid.subject === "Mathematics" ? (lang === "bn" ? "গণিত" : "Math") : vid.subject}
                        </span>
                        
                        <div className="flex gap-1 ml-auto shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(lang === "bn" ? "ভিডিওটি অফলাইনে সেভ করা হয়েছে!" : "Video saved for offline access!");
                            }}
                            title={lang === "bn" ? "অফলাইনে সেভ করুন" : "Save Offline"}
                            className="text-slate-400 hover:text-teal-600 p-0.5 hover:bg-teal-50 rounded transition-all cursor-pointer"
                          >
                            <DownloadCloud className="h-3 w-3" />
                          </button>
                          {role === "Admin" && (
                          <button
                            onClick={(e) => handleDeleteVideo(vid.id, e)}
                            title={lang === "bn" ? "লেকচার মুছুন" : "Delete Lecture"}
                            className="text-slate-400 hover:text-rose-600 p-0.5 hover:bg-rose-50 rounded transition-all shrink-0 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                        </div>
                      </div>

                      <h4 className={`font-bold text-xs line-clamp-2 leading-snug ${
                        isActive ? "text-teal-900" : "text-slate-800 group-hover:text-teal-700"
                      }`}>
                        {vid.title}
                      </h4>

                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3 text-slate-300" />
                          <span className="truncate max-w-[100px]">{vid.uploadedBy.split(" ")[0]}</span>
                        </span>
                        <span className="flex items-center gap-1 shrink-0">
                          <MessageSquare className="h-3 w-3 text-slate-300" />
                          <span>{vid.comments.length}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}

                {videos.length === 0 && (
                  <div className="text-center py-10 text-slate-400 text-xs font-semibold">
                    {lang === "bn" ? "কোনো ভিডিও লেকচার পাওয়া যায়নি।" : "No video lectures available."}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Notice Card */}
          <div className="rounded-2xl border border-teal-50/50 bg-teal-50/30 p-4 flex gap-3 text-xs text-teal-800 leading-normal">
            <Info className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">{lang === "bn" ? "অনলাইন রিসোর্স গাইড" : "Online Learning Tip"}</span>
              {lang === "bn" 
                ? "ভিডিও দেখার সময় গুরুত্বপূর্ণ পয়েন্টগুলো টুকে রাখুন এবং কোনো জটিলতা থাকলে কমেন্ট সেকশনে শিক্ষকদের সাথে আলোচনা করুন।" 
                : "Note down critical formulas during classes and feel free to clear up confusions directly in the interactive comment section below."}
            </div>
          </div>
        </motion.div>

        {/* Right Side: Active Video player and comments panel */}
        <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6 order-1 lg:order-2">
          
          {selectedVideo ? (
            <div className="space-y-6">
              {/* Responsive Video Frame Player */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-video relative shadow-md">
                {selectedVideo.videoUrl.includes("youtube.com") || selectedVideo.videoUrl.includes("youtu.be") || selectedVideo.videoUrl.includes("vimeo") ? (
                  <iframe
                    src={selectedVideo.videoUrl}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <video
                    src={selectedVideo.videoUrl}
                    controls
                    className="w-full h-full"
                    poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop"
                  ></video>
                )}
              </div>

              {/* Video Title and Metadata Description */}
              <div className="rounded-2xl border border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-950 p-6 shadow-3xs space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-50 dark:border-slate-850 pb-3">
                  <div className="space-y-1">
                    <span className="inline-block rounded-md bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 text-3xs font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-350 border border-teal-100 dark:border-teal-900/50">
                      {selectedVideo.subject === "Mathematics" ? (lang === "bn" ? "গণিত" : "Mathematics") : selectedVideo.subject}
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                      {selectedVideo.title}
                    </h2>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 dark:text-slate-500 font-medium self-end">
                    <span className="block">{lang === "bn" ? "আপলোড করেছেন:" : "Uploader:"} <strong className="text-slate-600 dark:text-slate-300 font-bold">{selectedVideo.uploadedBy}</strong></span>
                    <span className="block mt-0.5">{new Date(selectedVideo.timestamp).toLocaleDateString(lang === "bn" ? "bn-BD" : undefined, { dateStyle: "long" })}</span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">
                  {selectedVideo.description}
                </div>
              </div>

              {/* Comments Section */}
              <div className="rounded-2xl border border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-950 p-6 shadow-3xs space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-850 pb-3">
                  <MessageSquare className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {lang === "bn" ? `মন্তব্যসমূহ (${selectedVideo.comments.length})` : `Discussion Comments (${selectedVideo.comments.length})`}
                  </h3>
                </div>

                {/* Display existing comments */}
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {selectedVideo.comments.length > 0 ? (
                    selectedVideo.comments.map((comment) => {
                      const isUploaderComment = comment.senderRole === "Admin";
                      const canDelete = role === "Admin" || comment.senderEmail === userEmail;

                      return (
                        <div 
                          key={comment.id}
                          className={`p-3.5 rounded-xl border flex gap-3 text-left transition-all ${
                            isUploaderComment 
                              ? "bg-amber-50/30 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50" 
                              : "bg-slate-50/50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900"
                          }`}
                        >
                          <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-950 border border-teal-200 dark:border-teal-900 text-xs font-bold flex items-center justify-center shrink-0 overflow-hidden">
                            {comment.avatarUrl && (comment.avatarUrl.startsWith("data:image") || comment.avatarUrl.startsWith("http")) ? (
                              <img src={comment.avatarUrl} alt="Avatar" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              comment.avatarUrl || "🎓"
                            )}
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-800 dark:text-slate-100 text-xs">
                                  {comment.senderName}
                                </span>
                                {comment.senderRole === "Admin" ? (
                                  <span className="px-1 py-0.5 text-[8px] font-black rounded-sm bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50 uppercase scale-90">
                                    {lang === "bn" ? "শিক্ষক" : "Teacher"}
                                  </span>
                                ) : (
                                  <span className="px-1 py-0.5 text-[8px] font-black rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase scale-90">
                                    {lang === "bn" ? "শিক্ষার্থী" : "Student"}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                {new Date(comment.timestamp).toLocaleDateString(lang === "bn" ? "bn-BD" : undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                              </span>
                            </div>

                            <p className="text-slate-700 dark:text-slate-200 text-xs leading-relaxed font-medium">
                              {comment.comment}
                            </p>
                          </div>

                          {canDelete && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              title={lang === "bn" ? "মন্তব্যটি মুছুন" : "Delete Comment"}
                              className="text-slate-400 hover:text-rose-600 p-1 self-start hover:bg-rose-50 rounded-md transition-all cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                      {lang === "bn" ? "এখনো কোনো মন্তব্য করা হয়নি। প্রথম মন্তব্যটি আপনি করুন!" : "No comments yet. Start the conversation by typing your doubts below!"}
                    </div>
                  )}
                </div>

                {/* Comment writing box form */}
                <form onSubmit={handleAddComment} className="flex gap-2 items-start border-t border-slate-50 dark:border-slate-850 pt-4">
                  <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs font-bold flex items-center justify-center shrink-0 mt-1 overflow-hidden">
                    {profile?.avatarUrl && (profile.avatarUrl.startsWith("data:image") || profile.avatarUrl.startsWith("http")) ? (
                      <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      profile?.avatarUrl || "🎓"
                    )}
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      required
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder={lang === "bn" ? "আপনার প্রশ্ন বা মন্তব্য এখানে লিখুন..." : "Ask a question or share feedback with classmates..."}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-900/60 px-4.5 py-3 pr-12 text-xs text-slate-800 dark:text-slate-200 outline-hidden focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/30"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 p-1.5 text-white shadow-xs transition-all active:scale-90 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-20 text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-slate-400 dark:text-slate-500">
                <Video className="h-6 w-6" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold max-w-sm mx-auto">
                {lang === "bn" 
                  ? "বাম পাশের প্লেলিস্ট থেকে যেকোনো ভিডিও লেকচার সিলেক্ট করে ক্লাসে যোগ দিন।" 
                  : "Please select an educational video lecture from the left sidebar playlist to begin learning!"}
              </p>
            </div>
          )}

        </motion.div>
      </motion.div>
    </motion.div>
  );
}
