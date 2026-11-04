import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  UserPlus, 
  X, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Mail, 
  User, 
  Phone, 
  GraduationCap, 
  Building, 
  MessageSquare,
  Sparkles,
  Search,
  ArrowRight
} from "lucide-react";
import { Language } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";
import AppLogo from "./AppLogo";

interface StudentAccessRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  theme: ThemeConfig;
  initialEmail?: string;
  onApprovedLogin?: (email: string) => void;
}

export default function StudentAccessRequestModal({
  isOpen,
  onClose,
  lang,
  theme,
  initialEmail = "",
  onApprovedLogin
}: StudentAccessRequestModalProps) {
  const isBengali = lang === "bn";
  const [activeMode, setActiveMode] = useState<"apply" | "checkStatus">("apply");

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState("");
  const [institution, setInstitution] = useState("");
  const [targetExam, setTargetExam] = useState("মাধ্যমিক / উচ্চমাধ্যমিক");
  const [preferredSubject, setPreferredSubject] = useState("Mathematics");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Status check states
  const [checkEmail, setCheckEmail] = useState(initialEmail);
  const [isChecking, setIsChecking] = useState(false);
  const [statusResult, setStatusResult] = useState<{
    status: "pending" | "approved" | "rejected" | "not_found";
    request?: any;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!fullName.trim() || !email.trim()) {
      setErrorMessage(isBengali ? "নাম এবং ইমেইল ঠিকানা আবশ্যক।" : "Name and email are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/access-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          institution: institution.trim(),
          targetExam,
          preferredSubject,
          message: message.trim()
        })
      });

      if (res.ok) {
        setSubmitSuccess(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data?.error || (isBengali ? "আবেদন পাঠাতে ব্যর্থ হয়েছে।" : "Failed to submit request."));
      }
    } catch (err: any) {
      setErrorMessage(isBengali ? "সার্ভার সংযোগ ত্রুটি।" : "Server connection error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkEmail.trim()) return;
    setIsChecking(true);
    setStatusResult(null);

    try {
      const res = await fetch(`/api/access-requests/status?email=${encodeURIComponent(checkEmail.trim().toLowerCase())}`);
      if (res.ok) {
        const data = await res.json();
        setStatusResult(data);
      }
    } catch (err) {
      console.error("Status check failed:", err);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className={`relative w-full max-w-lg ${theme.bgCard} rounded-3xl border ${theme.borderCard} shadow-2xl overflow-hidden my-8`}
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 p-5 sm:p-6 text-white relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/15 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AppLogo size="sm" rounded="xl" className="border-white/40 shadow-md" />
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                    {isBengali ? "স্টাডি হাব জয়েন রিকোয়েস্ট" : "Study Hub Access Request"}
                  </h3>
                  <p className="text-[11px] text-white/80 font-medium">
                    {isBengali ? "অ্যাডমিন অনুমোদন ও জিমেইল নোটিফিকেশন" : "Approval-based Registration"}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/20 mt-4 border border-white/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setActiveMode("apply");
                  setSubmitSuccess(false);
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeMode === "apply" ? "bg-white text-indigo-700 shadow-xs" : "text-white/80 hover:text-white"
                }`}
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>{isBengali ? "নতুন আবেদন পাঠান" : "New Request"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMode("checkStatus");
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeMode === "checkStatus" ? "bg-white text-indigo-700 shadow-xs" : "text-white/80 hover:text-white"
                }`}
              >
                <Search className="h-3.5 w-3.5" />
                <span>{isBengali ? "স্ট্যাটাস দেখুন" : "Check Status"}</span>
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {activeMode === "apply" ? (
              submitSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="h-16 w-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 className="h-8 w-8 animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-slate-900">
                      {isBengali ? "আবেদন সফলভাবে জমা হয়েছে! 🎉" : "Request Submitted Successfully!"}
                    </h4>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed font-medium">
                      {isBengali 
                        ? `আপনার আবেদনটি অ্যাডমিনের কাছে পৌঁছেছে। অ্যাডমিন অনুমোদন করার সাথে সাথে আপনার ইমেইলে (${email}) সরাসরি অফিশিয়াল কনফার্মেশন চলে যাবে।` 
                        : `Your access request has been sent to the admin. Once approved, you will receive an official email confirmation at (${email}).`}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200/80 text-[11px] text-indigo-900 font-semibold text-left">
                    ⚡ <strong>পরামর্শ:</strong> অনুমোদন হওয়ার পর আপনি যেকোনো সময় আপনার এই ইমেইল দিয়ে লগইন করতে পারবেন।
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    {isBengali ? "ঠিক আছে" : "Got it"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-3.5">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <User className="h-3 w-3 text-indigo-600" />
                        <span>{isBengali ? "শিক্ষার্থীর নাম *" : "Full Name *"}</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isBengali ? "আপনার পুরো নাম" : "Your full name"}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={`w-full ${theme.bgPage} px-3 py-2 rounded-xl border ${theme.borderCard} text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <Mail className="h-3 w-3 text-indigo-600" />
                        <span>{isBengali ? "ইমেইল ঠিকানা *" : "Email Address *"}</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full ${theme.bgPage} px-3 py-2 rounded-xl border ${theme.borderCard} text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <Phone className="h-3 w-3 text-indigo-600" />
                        <span>{isBengali ? "ফোন / হোয়াটসঅ্যাপ (ঐচ্ছিক)" : "Phone / WhatsApp"}</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full ${theme.bgPage} px-3 py-2 rounded-xl border ${theme.borderCard} text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <Building className="h-3 w-3 text-indigo-600" />
                        <span>{isBengali ? "প্রতিষ্ঠান / স্কুল / কলেজ" : "Institution"}</span>
                      </label>
                      <input
                        type="text"
                        placeholder={isBengali ? "স্কুল বা কলেজের নাম" : "School / College"}
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className={`w-full ${theme.bgPage} px-3 py-2 rounded-xl border ${theme.borderCard} text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <GraduationCap className="h-3 w-3 text-indigo-600" />
                        <span>{isBengali ? "কোর্স / লক্ষ্য পরীক্ষা" : "Target Exam"}</span>
                      </label>
                      <select
                        value={targetExam}
                        onChange={(e) => setTargetExam(e.target.value)}
                        className={`w-full ${theme.bgPage} px-3 py-2 rounded-xl border ${theme.borderCard} text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
                      >
                        <option value="মাধ্যমিক / মাধ্যমিক দশম">মাধ্যমিক (Class 10)</option>
                        <option value="উচ্চমাধ্যমিক (একাদশ-দ্বাদশ)">উচ্চমাধ্যমিক (Class 11-12)</option>
                        <option value="ডিপ্লোমা / পলিটেকনিক">ডিপ্লোমা / পলিটেকনিক</option>
                        <option value="বি.টেক / বিএসসি / কলেজ">বি.টেক / বিএসসি / কলেজ</option>
                        <option value="WBCS ও সিভিল সার্ভিস">WBCS ও সিভিল সার্ভিস</option>
                        <option value="ব্যাংকিং ও রেলওয়ে চাকরি">ব্যাংকিং ও রেলওয়ে পরীক্ষা</option>
                        <option value="সাধারণ শিক্ষার্থী">সাধারণ শিক্ষার্থী</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-indigo-600" />
                        <span>{isBengali ? "মূল পছন্দের বিষয়" : "Preferred Subject"}</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Mathematics / Science / GK"
                        value={preferredSubject}
                        onChange={(e) => setPreferredSubject(e.target.value)}
                        className={`w-full ${theme.bgPage} px-3 py-2 rounded-xl border ${theme.borderCard} text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-indigo-600" />
                      <span>{isBengali ? "কেন যুক্ত হতে চান / মেসেজ (ঐচ্ছিক)" : "Message to Admin (Optional)"}</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder={isBengali ? "অ্যাডমিনকে কিছু বলতে চাইলে এখানে লিখুন..." : "Any message for the administrator..."}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`w-full ${theme.bgPage} px-3 py-2 rounded-xl border ${theme.borderCard} text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? (
                      <span>{isBengali ? "পাঠানো হচ্ছে..." : "Sending Request..."}</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>{isBengali ? "অ্যাক্সেস রিকোয়েস্ট পাঠান" : "Submit Access Request"}</span>
                      </>
                    )}
                  </button>
                </form>
              )
            ) : (
              /* Check Status Mode */
              <div className="space-y-4">
                <form onSubmit={handleCheckStatus} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Search className="h-3.5 w-3.5 text-indigo-600" />
                      <span>{isBengali ? "আপনার আবেদনের ইমেইল ঠিকানা দিন:" : "Enter your request email:"}</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        placeholder="example@gmail.com"
                        value={checkEmail}
                        onChange={(e) => setCheckEmail(e.target.value)}
                        className={`flex-1 ${theme.bgPage} px-3.5 py-2.5 rounded-xl border ${theme.borderCard} text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
                      />
                      <button
                        type="submit"
                        disabled={isChecking}
                        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                      >
                        <Search className="h-3.5 w-3.5" />
                        <span>{isChecking ? "..." : (isBengali ? "যাচাই করুন" : "Check")}</span>
                      </button>
                    </div>
                  </div>
                </form>

                {statusResult && (
                  <div className="p-4 rounded-2xl border transition-all animate-fadeIn">
                    {statusResult.status === "approved" ? (
                      <div className="space-y-3 text-center bg-emerald-50/80 border-emerald-200 p-4 rounded-xl">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                        <div>
                          <h4 className="text-sm font-black text-emerald-950">
                            {isBengali ? "অভিনন্দন! আপনার আবেদন অনুমোদিত হয়েছে 🎉" : "Congratulations! Your request is Approved 🎉"}
                          </h4>
                          <p className="text-xs text-emerald-800 font-medium mt-1">
                            {isBengali ? "আপনি এখন সরাসরি স্টাডি হাবে প্রবেশ করতে পারবেন।" : "You can now log in and use Study Hub."}
                          </p>
                        </div>
                        {onApprovedLogin && (
                          <button
                            onClick={() => {
                              onApprovedLogin(checkEmail.trim().toLowerCase());
                              onClose();
                            }}
                            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <span>{isBengali ? "এখনই লগইন করুন" : "Enter Study Hub Now"}</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ) : statusResult.status === "pending" ? (
                      <div className="space-y-2 text-center bg-amber-50/80 border-amber-200 p-4 rounded-xl">
                        <Clock className="h-8 w-8 text-amber-600 mx-auto animate-pulse" />
                        <div>
                          <h4 className="text-sm font-black text-amber-950">
                            {isBengali ? "আবেদন এখনও পেন্ডিং রয়েছে ⏳" : "Request Pending Approval ⏳"}
                          </h4>
                          <p className="text-xs text-amber-800 font-medium mt-1 leading-relaxed">
                            {isBengali 
                              ? "অ্যাডমিন এখনও আপনার আবেদনটি পর্যালোচনা করছেন। অনুমোদন পাওয়া মাত্র আপনার জিমেইলে অফিশিয়াল স্বাগতম বার্তা চলে যাবে।"
                              : "Admin is currently reviewing your access request. An official email will be sent upon approval."}
                          </p>
                        </div>
                      </div>
                    ) : statusResult.status === "rejected" ? (
                      <div className="space-y-2 text-center bg-rose-50/80 border-rose-200 p-4 rounded-xl">
                        <AlertCircle className="h-8 w-8 text-rose-600 mx-auto" />
                        <div>
                          <h4 className="text-sm font-black text-rose-950">
                            {isBengali ? "আবেদনটি বাতিল করা হয়েছে" : "Request Rejected"}
                          </h4>
                          <p className="text-xs text-rose-800 font-medium mt-1">
                            {isBengali ? "বিস্তারিত জানার জন্য অ্যাডমিনের সাথে যোগাযোগ করুন।" : "Please contact the administrator for more information."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-3 text-slate-500 text-xs">
                        <p>{isBengali ? "এই ইমেইল দিয়ে কোনো আবেদন পাওয়া যায়নি।" : "No access request found for this email."}</p>
                        <button
                          onClick={() => {
                            setEmail(checkEmail);
                            setActiveMode("apply");
                          }}
                          className="mt-2 text-indigo-600 hover:underline font-bold text-xs inline-block"
                        >
                          {isBengali ? "নতুন আবেদন করতে এখানে ক্লিক করুন &rarr;" : "Click here to apply now &rarr;"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
