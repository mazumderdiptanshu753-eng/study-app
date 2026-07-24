import React, { useState } from "react";
import { motion } from "motion/react";
import { Save, X, LogOut, Cpu } from "lucide-react";
import { StudentProfile } from "../types";
import { Language, TRANSLATIONS } from "../lib/translations";
import { ThemeId, THEMES } from "../lib/themes";

interface ProfileSettingsProps {
  profile: StudentProfile;
  onUpdate: (updatedProfile: StudentProfile) => void;
  onClose: () => void;
  theme: any;
  themeId: ThemeId;
  onThemeChange: (newThemeId: ThemeId) => void;
  onLogout: () => void;
  lang: Language;
  currentVersion?: string;
  latestVersion?: string;
}

const MALE_AVATARS = ["🧑‍🎓", "👨‍💻", "🧑‍🔬", "👦", "🧔", "👨", "👨‍🏫", "🧙‍♂️", "🕵️‍♂️"];
const FEMALE_AVATARS = ["👩‍🎓", "👩‍💻", "👩‍🔬", "👧", "👱‍♀️", "👩", "👩‍🏫", "🧙‍♀️", "🕵️‍♀️"];

export default function ProfileSettings({
  profile,
  onUpdate,
  onClose,
  theme,
  themeId,
  onThemeChange,
  onLogout,
  lang,
  currentVersion = "2.6.6",
  latestVersion
}: ProfileSettingsProps) {
  const t = TRANSLATIONS[lang];
  const [fullName, setFullName] = useState(profile.fullName);
  const [age, setAge] = useState(profile.age || "");
  const [institution, setInstitution] = useState(profile.institution || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "🎓");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    onUpdate({
      ...profile,
      fullName,
      age,
      institution,
      avatarUrl
    });
    setIsSaving(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl border ${theme.bgCard} ${theme.borderCard} shadow-xl max-w-xl mx-auto`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-black ${theme.textHeading}`}>
          {lang === "bn" ? "প্রোফাইল সেটিংস" : "Profile Settings"}
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800 cursor-pointer">
          <X className={`h-5 w-5 ${theme.textMain}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Side: Avatar Selection Panel */}
        <div className="md:col-span-6 flex flex-col items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-md select-none mb-3">
            {avatarUrl && (avatarUrl.startsWith("http") || avatarUrl.startsWith("data:image")) ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover rounded-2xl" />
            ) : (
              avatarUrl || "🎓"
            )}
          </div>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-4">
            {lang === "bn" ? "আপনার প্রোফাইল অবতার" : "Your Profile Avatar"}
          </p>

          {/* Male Avatars */}
          <div className="w-full space-y-2 mb-4">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block text-center md:text-left">
              {lang === "bn" ? "ছেলেদের অবতার (Male Avatars)" : "Male Avatars"}
            </span>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {MALE_AVATARS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setAvatarUrl(emoji)}
                  className={`h-10 w-10 rounded-xl text-xl flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer ${
                    avatarUrl === emoji
                      ? "bg-emerald-500 text-white border-2 border-emerald-600 shadow-sm scale-105"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Female Avatars */}
          <div className="w-full space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block text-center md:text-left">
              {lang === "bn" ? "মেয়েদের অবতার (Female Avatars)" : "Female Avatars"}
            </span>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {FEMALE_AVATARS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setAvatarUrl(emoji)}
                  className={`h-10 w-10 rounded-xl text-xl flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer ${
                    avatarUrl === emoji
                      ? "bg-emerald-500 text-white border-2 border-emerald-600 shadow-sm scale-105"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Details Form */}
        <div className="md:col-span-6 space-y-4">
          <div className="space-y-1">
            <label className={`text-xs font-bold ${theme.textHeading}`}>
              {lang === "bn" ? "সম্পূর্ণ নাম" : "Full Name"}
            </label>
            <input 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`w-full p-2.5 rounded-xl border ${theme.borderCard} ${theme.bgPage} text-xs font-bold`}
            />
          </div>
          <div className="space-y-1">
            <label className={`text-xs font-bold ${theme.textHeading}`}>
              {lang === "bn" ? "বয়স" : "Age"}
            </label>
            <input 
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className={`w-full p-2.5 rounded-xl border ${theme.borderCard} ${theme.bgPage} text-xs font-bold`}
            />
          </div>
          <div className="space-y-1">
            <label className={`text-xs font-bold ${theme.textHeading}`}>
              {lang === "bn" ? "শিক্ষা প্রতিষ্ঠান" : "Institution"}
            </label>
            <input 
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className={`w-full p-2.5 rounded-xl border ${theme.borderCard} ${theme.bgPage} text-xs font-bold`}
            />
          </div>
          
          <div className="space-y-1">
            <label className={`text-xs font-bold ${theme.textHeading}`}>
              {lang === "bn" ? "অ্যাপের থিম" : "App Theme"}
            </label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {(["emerald", "cosmic", "aurora", "sunset"] as ThemeId[]).map((tId) => (
                <button
                  type="button"
                  key={tId}
                  onClick={() => onThemeChange(tId)}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-black cursor-pointer transition-all duration-200 active:scale-95 ${
                    themeId === tId
                      ? `${theme.primaryBg} ${theme.primaryText} ${theme.borderCard} scale-[1.02] shadow-3xs`
                      : `bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 hover:text-slate-700`
                  }`}
                >
                  <span>{THEMES[tId].icon}</span>
                  <span>{lang === "bn" ? THEMES[tId].nameBn : THEMES[tId].nameEn.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Version & System Info Box */}
          <div className="pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-1.5 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-black tracking-wide text-slate-200 uppercase">
                    {lang === "bn" ? "স্টাডি হাব ভার্সন" : "System Version"}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 text-[11px] font-mono font-bold">
                  v{currentVersion}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                {lang === "bn"
                  ? "নতুন আপডেট প্রকাশের সাথে সাথে স্বয়ংক্রিয়ভাবে ফুলস্ক্রিন আপগ্রেড অ্যানিমেশন চালু হবে।"
                  : "System updates automatically run the upgrade screen whenever a new release is deployed."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-black cursor-pointer shadow-sm transition-all active:scale-95 ${theme.primaryBg} ${theme.primaryText}`}
        >
          <Save className="h-4 w-4" />
          {lang === "bn" ? "সংরক্ষণ করুন" : "Save Changes"}
        </button>

        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="py-3 px-6 rounded-xl flex items-center justify-center gap-2 font-black border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition-all cursor-pointer active:scale-95"
        >
          <LogOut className="h-4 w-4" />
          {lang === "bn" ? "লগ আউট" : "Log Out"}
        </button>
      </div>
    </motion.div>
  );
}
