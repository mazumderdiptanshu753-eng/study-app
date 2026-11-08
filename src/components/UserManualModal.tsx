import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Download, 
  Printer, 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  Shield, 
  Key, 
  Mail, 
  Sparkles, 
  GraduationCap, 
  FileText, 
  HelpCircle,
  Video,
  MessagesSquare,
  RefreshCw
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "bn" | "en";
}

export default function UserManualModal({ isOpen, onClose, lang: appLang }: UserManualModalProps) {
  const [manualLang, setManualLang] = useState<"bilingual" | "bn" | "en">("bilingual");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const isBn = manualLang === "bn" || manualLang === "bilingual";
  const isEn = manualLang === "en" || manualLang === "bilingual";

  const handleDownloadPdf = async () => {
    if (!printAreaRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const element = printAreaRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;
      }

      pdf.save("Study_Hub_Official_User_Manual.pdf");
    } catch (err) {
      console.error("PDF generation error, fallback to browser print:", err);
      window.open("/manual.html", "_blank");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.open("/manual.html", "_blank");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-md overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="w-full max-w-4xl h-[92vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Header Bar */}
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>স্টাডি হাব ব্যবহারকারী নির্দেশিকা (User Manual)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    PDF Guide
                  </span>
                </h3>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  অফিসিয়াল সংস্করণ v2.6 • বাংলা ও ইংরেজি সম্পূর্ণ ব্যবহার সহায়িকা
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Controls Bar: Language selection & Download buttons */}
          <div className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
            {/* Language filter pills */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <button
                type="button"
                onClick={() => setManualLang("bilingual")}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  manualLang === "bilingual" 
                    ? "bg-indigo-600 text-white shadow-xs" 
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                🌐 উভয় ভাষা (Bilingual)
              </button>
              <button
                type="button"
                onClick={() => setManualLang("bn")}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  manualLang === "bn" 
                    ? "bg-indigo-600 text-white shadow-xs" 
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                বাংলা (Bengali)
              </button>
              <button
                type="button"
                onClick={() => setManualLang("en")}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  manualLang === "en" 
                    ? "bg-indigo-600 text-white shadow-xs" 
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                English
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingPdf ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>পিডিএফ তৈরি হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" />
                    <span>PDF ডাউনলোড করুন</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                title="ওপেন ও ভেক্টর প্রিন্ট"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>প্রিন্ট ভিউ (Print/Save)</span>
              </button>

              <a
                href="/manual.html"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 text-slate-500 hover:text-indigo-600 transition"
                title="নতুন ট্যাবে ফুলস্ক্রিন দেখুন"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Scrollable Document Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50 dark:bg-slate-950 font-sans">
            <div 
              ref={printAreaRef}
              className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 text-slate-800 dark:text-slate-200"
            >
              {/* Cover Banner */}
              <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-800 space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-black text-[11px] uppercase tracking-wider">
                  STUDY HUB ACADEMIC PORTAL • USER MANUAL
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                  স্টাডি হাব সম্পূর্ণ ব্যবহারকারী নির্দেশিকা
                </h1>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  Comprehensive Step-by-Step Guide for Students &amp; Administrators
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-500">
                  <span>সংস্করণ: <strong>v2.6 Verified</strong></span>
                  <span>অফিশিয়াল অ্যাডমিন: <strong className="text-indigo-600 dark:text-indigo-400">studyhub2026admin@gmail.com</strong></span>
                  <span>ডেভেলপার: <strong>Diptanshu Mazumder</strong></span>
                </div>
              </div>

              {/* SECTION 1: Platform Overview */}
              <section className="space-y-3">
                <h2 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="p-1 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-xs">১</span>
                  <span>প্ল্যাটফর্ম পরিচিতি (Platform Overview)</span>
                </h2>
                {isBn && (
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    <strong>স্টাডি হাব (Study Hub)</strong> হলো একটি সর্বাধুনিক কৃত্রিম বুদ্ধিমত্তা (AI) চালিত অল-ইন-ওয়ান শিক্ষা প্ল্যাটফর্ম। এটি মাধ্যমিক, উচ্চ মাধ্যমিক, পলিটেকনিক, বিশ্ববিদ্যালয় ভর্তি এবং বিসিএস/ব্যাংকসহ সরকারি চাকরি প্রার্থীদের পড়াশোনাকে সহজ, গোছানো ও কার্যকর করতে তৈরি করা হয়েছে।
                  </p>
                )}
                {isEn && (
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    <strong>Study Hub</strong> is an all-in-one smart learning and AI portal tailored for students from secondary to university entrance and competitive exam aspirants (BCS, Bank, Railway).
                  </p>
                )}
              </section>

              {/* SECTION 2: Instant Auto-Registration */}
              <section className="space-y-3">
                <h2 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="p-1 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-xs">২</span>
                  <span>স্বয়ংক্রিয় রেজিস্ট্রেশন ও ইমেইলে ক্রেডেনশিয়াল (Instant Sign-Up)</span>
                </h2>
                
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-1.5">
                  <div className="font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>কোনো অ্যাডমিন অনুমোদনের অপেক্ষা নেই (Instant Activation)</span>
                  </div>
                  {isBn && (
                    <p className="text-emerald-900/90 dark:text-emerald-400">
                      কোনো শিক্ষার্থী সাইন আপ করলেই সাথে সাথে তার অ্যাকাউন্ট সক্রিয় হয়ে যাবে। অ্যাডমিন দ্বারা ম্যানুয়াল অ্যাপ্রুভালের প্রয়োজন নেই।
                    </p>
                  )}
                  {isEn && (
                    <p className="text-emerald-900/90 dark:text-emerald-400">
                      Students are auto-activated immediately upon submission without requiring manual admin approval.
                    </p>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                    <h4 className="font-black text-slate-900 dark:text-slate-100">পদক্ষেপ ১: সাইন আপ ফর্ম পূরণ</h4>
                    <p className="text-slate-600 dark:text-slate-300">
                      লগইন স্ক্রিন থেকে SIGN UP ট্যাবে গিয়ে আপনার সম্পূর্ণ নাম, সক্রিয় জিমেইল ঠিকানা, বয়স, ফোন নম্বর, শিক্ষাপ্রতিষ্ঠানের নাম ও টার্গেট পরীক্ষা দিয়ে <strong>"তাৎক্ষণিক অ্যাকাউন্ট তৈরি করুন 🚀"</strong> বাটনে চাপ দিন।
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                    <h4 className="font-black text-slate-900 dark:text-slate-100">পদক্ষেপ ২: অফিসিয়াল ইমেইল চেক করুন</h4>
                    <p className="text-slate-600 dark:text-slate-300">
                      সাবমিটের সাথে সাথেই স্টাডি হাবের অফিসিয়াল ইমেইল <code>studyhub2026admin@gmail.com</code> থেকে আপনার ইমেইলে একটি স্বয়ংক্রিয় ওয়েলকাম ইমেইল চলে যাবে যার মধ্যে আপনার <strong>User ID (ইমেইল)</strong> ও একটি <strong>সুরক্ষিত পাসওয়ার্ড</strong> থাকবে। (ইনবক্সে না পেলে স্প্যাম ফোল্ডার চেক করুন)।
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 3: Login & OTP Recovery */}
              <section className="space-y-3">
                <h2 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="p-1 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-xs">৩</span>
                  <span>লগইন ও ওটিপি পাসওয়ার্ড রিকভারি (Login &amp; Password Recovery)</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <h4 className="font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Key className="h-3.5 w-3.5 text-indigo-500" />
                      <span>শিক্ষার্থী লগইন</span>
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300">
                      LOG IN ট্যাবে গিয়ে আপনার ইমেইল এবং ইমেইলে পাওয়া পাসওয়ার্ডটি লিখুন এবং "স্টাডি হাবে প্রবেশ করুন" বাটনে ক্লিক করুন।
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <h4 className="font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-amber-500" />
                      <span>পাসওয়ার্ড ভুলে গেলে (OTP)</span>
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300">
                      "পাসওয়ার্ড ভুলে গেছেন?" অপশনে ক্লিক করে ইমেইল দিলে <code>studyhub2026admin@gmail.com</code> থেকে ৬-সংখ্যার ওটিপি কোড যাবে। ওটিপি যাচাই করলেই পাসওয়ার্ড দৃশ্যমান হবে।
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 4: Admin Exclusive Security */}
              <section className="space-y-3">
                <h2 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="p-1 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-xs">৪</span>
                  <span>অফিসিয়াল প্রধান অ্যাডমিন ও সিকিউরিটি পাসকোড (Admin Security)</span>
                </h2>

                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs space-y-1.5">
                  <div className="font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <Shield className="h-4 w-4" />
                    <span>একমাত্র অফিসিয়াল পার্মানেন্ট অ্যাডমিন: studyhub2026admin@gmail.com</span>
                  </div>
                  <p className="text-amber-900/90 dark:text-amber-400">
                    স্টাডি হাবে শুধুমাত্র <code>studyhub2026admin@gmail.com</code> হলো স্থায়ী প্রধান অ্যাডমিন। অন্য কোনো অ্যাকাউন্ট (যেমন mazumderdiptanshu753@gmail.com) স্থায়ী অ্যাডমিন নয়—তারা সাধারণ শিক্ষার্থী বা ইউজার।
                  </p>
                  <p className="text-amber-900/90 dark:text-amber-400 font-semibold pt-1">
                    🔒 <strong>বিশেষ অ্যাডমিন লগইন কোড:</strong> শুধুমাত্র <code>studyhub2026admin@gmail.com</code> লিখলেই বিশেষ অ্যাডমিন পাসকোড ফিল্ড কার্যকর হয় (মাস্টার কোড: <strong>7530</strong>)।
                  </p>
                </div>
              </section>

              {/* SECTION 5: Key Learning Features */}
              <section className="space-y-3">
                <h2 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="p-1 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-xs">৫</span>
                  <span>মূল অ্যাকাডেমিক মডিউলসমূহ (Academic Modules)</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
                    <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      <span>নোটস ও এআই পিডিএফ জেনারেটর</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      নিজে নোট লেখা ছাড়াও যেকোনো বিষয় দিয়ে AI-এর মাধ্যমে রঙিন A4 সাইজের প্রিন্টযোগ্য রিভিশন নোট তৈরি করা যায়।
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
                    <div className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                      <Video className="h-3.5 w-3.5" />
                      <span>লাইভ ক্লাস ও ভিডিও লাইব্রেরি</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      সরাসরি Google Meet, YouTube Live বা Zoom লিংকের মাধ্যমে রিয়েল-টাইম ক্লাস এবং চ্যাপ্টারভিত্তিক ভিডিও লেকচার।
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5" />
                      <span>চাকরি প্রস্তুতি, জিকে ও স্কুল সেকশন</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      বিসিএস ও ব্যাংক প্রস্তুতি, দৈনিক সাধারণ জ্ঞান ও কুইজ, নবম-দ্বাদশ শ্রেণির সিলেবাস এবং ইঞ্জিনিয়ারিং সেমিস্টার নোট।
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
                    <div className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                      <MessagesSquare className="h-3.5 w-3.5" />
                      <span>ফোরাম, সাপোর্ট চ্যাট ও এআই টিউটর</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      সহপাঠীদের সাথে আলোচনা ফোরাম, অ্যাডমিনের সাথে রিয়েল-টাইম সাপোর্ট চ্যাট এবং ২৪/৭ যেকোনো প্রশ্নের উত্তর দিতে এআই টিউটর।
                    </p>
                  </div>
                </div>
              </section>

              {/* Footer attribution */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <p className="font-black text-slate-800 dark:text-slate-200">
                  STUDY HUB OFFICIAL ACADEMIC PLATFORM • VERIFIED V2.6
                </p>
                <p>
                  Official Inquiries: <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">studyhub2026admin@gmail.com</span>
                </p>
                <p className="text-[11px]">
                  Developed by <strong>DIPTANSHU MAZUMDER</strong>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
