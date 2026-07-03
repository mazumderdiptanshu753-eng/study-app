
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeConfig } from "../lib/themes";
import { Language } from "../lib/translations";
import GeneralKnowledge from "./GeneralKnowledge";
import ImportantQuestions from "./ImportantQuestions";
import { ArrowLeft, Upload, FileText, Image as ImageIcon, Video, X, CheckCircle } from "lucide-react";

interface GeneralKnowledgePageProps {
  theme: ThemeConfig;
  lang: Language;
  onBack: () => void;
}

export default function GeneralKnowledgePage({ theme, lang, onBack }: GeneralKnowledgePageProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    // Filter for allowed types: pdf, images, videos
    const allowed = newFiles.filter(file => 
      file.type === "application/pdf" || 
      file.type.startsWith("image/") || 
      file.type.startsWith("video/")
    );
    setFiles(prev => [...prev, ...allowed]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    setUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setFiles([]);
      }, 3000);
    }, 1500);
  };

  const getFileIcon = (type: string) => {
    if (type === "application/pdf") return <FileText className="h-6 w-6 text-red-500" />;
    if (type.startsWith("image/")) return <ImageIcon className="h-6 w-6 text-emerald-500" />;
    if (type.startsWith("video/")) return <Video className="h-6 w-6 text-blue-500" />;
    return <FileText className="h-6 w-6 text-slate-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto w-full"
    >
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className={`p-2 rounded-full border ${theme.borderCard} ${theme.bgCard} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
        >
          <ArrowLeft className={`h-5 w-5 ${theme.textHeading}`} />
        </button>
        <h2 className={`text-2xl font-black ${theme.textHeading}`}>
          {lang === "bn" ? "সরকারি চাকরি প্রস্তুতি" : "Government Job Preparation"}
        </h2>
      </div>

      <div className="grid gap-8">
        {/* Upload Section */}
        <div className={`rounded-2xl border ${theme.borderCard} ${theme.bgCard} p-6 shadow-sm`}>
          <h3 className={`font-extrabold ${theme.textHeading} text-lg mb-2 flex items-center gap-2`}>
            <Upload className={`h-5 w-5 ${theme.primaryText}`} />
            {lang === "bn" ? "স্টাডি মেটেরিয়াল আপলোড করুন" : "Upload Study Materials"}
          </h3>
          <p className={`text-sm ${theme.textMuted} mb-6`}>
            {lang === "bn" 
              ? "সরকারি চাকরির প্রস্তুতির জন্য পিডিএফ, জেপিজি ছবি বা ভিডিও আপলোড করুন।" 
              : "Upload PDFs, JPGs, or Video files for government job preparation."}
          </p>

          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive ? "border-emerald-500 bg-emerald-50/10" : `${theme.borderCard} hover:border-slate-400 dark:hover:border-slate-500`
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="application/pdf,image/*,video/*"
              onChange={handleChange}
              className="hidden"
            />
            
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex gap-4 mb-2">
                <div className={`p-3 rounded-full ${theme.primaryBg} ${theme.primaryText} shadow-sm`}>
                  <FileText className="h-6 w-6" />
                </div>
                <div className={`p-3 rounded-full ${theme.accentBg} ${theme.accentText} shadow-sm`}>
                  <ImageIcon className="h-6 w-6" />
                </div>
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm">
                  <Video className="h-6 w-6" />
                </div>
              </div>
              <div>
                <p className={`text-sm font-bold ${theme.textHeading}`}>
                  {lang === "bn" ? "ফাইলগুলো এখানে টেনে আনুন বা" : "Drag and drop files here, or"}
                </p>
                <button
                  onClick={() => inputRef.current?.click()}
                  className={`mt-2 px-4 py-2 rounded-lg text-sm font-bold ${theme.primaryBtn} ${theme.primaryBtnText} cursor-pointer hover:opacity-90 active:scale-95 transition-all`}
                >
                  {lang === "bn" ? "ফাইল নির্বাচন করুন" : "Browse Files"}
                </button>
              </div>
              <p className={`text-xs ${theme.textMuted} font-semibold mt-2`}>
                {lang === "bn" ? "সাপোর্টেড ফরম্যাট: PDF, JPG, PNG, MP4" : "Supported formats: PDF, JPG, PNG, MP4"}
              </p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className={`font-bold ${theme.textHeading} text-sm`}>
                {lang === "bn" ? "নির্বাচিত ফাইলসমূহ" : "Selected Files"} ({files.length})
              </h4>
              <div className="grid gap-2">
                <AnimatePresence>
                  {files.map((file, index) => (
                    <motion.div
                      key={`${file.name}-${index}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`flex items-center justify-between p-3 rounded-lg border ${theme.borderCard} bg-slate-50/50 dark:bg-slate-800/30`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {getFileIcon(file.type)}
                        <div className="truncate">
                          <p className={`text-sm font-bold ${theme.textHeading} truncate`}>
                            {file.name}
                          </p>
                          <p className={`text-xs ${theme.textMuted}`}>
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className={`p-1.5 rounded-md hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500 transition-colors`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleUpload}
                  disabled={uploading || uploadSuccess}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    uploadSuccess 
                      ? "bg-emerald-500 text-white" 
                      : `${theme.primaryBtn} ${theme.primaryBtnText} hover:opacity-90 active:scale-95 cursor-pointer`
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {uploading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      {lang === "bn" ? "আপলোড হচ্ছে..." : "Uploading..."}
                    </>
                  ) : uploadSuccess ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      {lang === "bn" ? "আপলোড সফল!" : "Uploaded Successfully!"}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      {lang === "bn" ? "আপলোড সম্পন্ন করুন" : "Complete Upload"}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <GeneralKnowledge lang={lang} theme={theme} />
          <ImportantQuestions lang={lang} theme={theme} />
        </div>
      </div>
    </motion.div>
  );
}
