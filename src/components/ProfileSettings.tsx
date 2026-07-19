import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { User, Camera, Save, X, Calendar, Building, Loader2, LogOut } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";
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
}

export default function ProfileSettings({ profile, onUpdate, onClose, theme, themeId, onThemeChange, onLogout, lang }: ProfileSettingsProps) {
  const t = TRANSLATIONS[lang];
  const [fullName, setFullName] = useState(profile.fullName);
  const [age, setAge] = useState(profile.age || "");
  const [institution, setInstitution] = useState(profile.institution || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);
    try {
      const storageRef = ref(storage, `avatars/${profile.email}/${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setAvatarUrl(url);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

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
      className={`p-6 rounded-2xl border ${theme.bgCard} ${theme.borderCard} shadow-xl`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-black ${theme.textHeading}`}>
          {lang === "bn" ? "প্রোফাইল সেটিংস" : "Profile Settings"}
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800 cursor-pointer">
          <X className={`h-5 w-5 ${theme.textMain}`} />
        </button>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="relative h-24 w-24 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 mb-4 border-2 border-slate-300 dark:border-slate-600">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <User className="h-full w-full p-4 text-slate-500" />
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
          >
            {isUploading ? <Loader2 className="animate-spin" /> : <Camera />}
          </button>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className={`text-xs font-bold ${theme.textHeading}`}>
            {lang === "bn" ? "সম্পূর্ণ নাম" : "Full Name"}
          </label>
          <input 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`w-full p-2 rounded-lg border ${theme.borderCard} ${theme.bgPage}`}
          />
        </div>
        <div className="space-y-1">
          <label className={`text-xs font-bold ${theme.textHeading}`}>
            {lang === "bn" ? "বয়স" : "Age"}
          </label>
          <input 
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={`w-full p-2 rounded-lg border ${theme.borderCard} ${theme.bgPage}`}
          />
        </div>
        <div className="space-y-1">
          <label className={`text-xs font-bold ${theme.textHeading}`}>
            {lang === "bn" ? "শিক্ষা প্রতিষ্ঠান" : "Institution"}
          </label>
          <input 
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className={`w-full p-2 rounded-lg border ${theme.borderCard} ${theme.bgPage}`}
          />
        </div>
        
        <div className="space-y-1">
          <label className={`text-xs font-bold ${theme.textHeading}`}>
            {lang === "bn" ? "অ্যাপের থিম" : "App Theme"}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {(["emerald", "cosmic", "aurora", "sunset"] as ThemeId[]).map((tId) => (
              <button
                type="button"
                key={tId}
                onClick={() => onThemeChange(tId)}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-black cursor-pointer transition-all duration-200 active:scale-95 ${
                  themeId === tId
                    ? `${theme.primaryBg} ${theme.primaryText} ${theme.borderCard} scale-[1.02] shadow-3xs`
                    : `bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700`
                }`}
              >
                <span>{THEMES[tId].icon}</span>
                <span>{lang === "bn" ? THEMES[tId].nameBn : THEMES[tId].nameEn.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`mt-6 w-full py-3 rounded-xl flex items-center justify-center gap-2 font-black cursor-pointer ${theme.primaryBg} ${theme.primaryText}`}
      >
        {isSaving ? <Loader2 className="animate-spin" /> : <Save className="h-4 w-4" />}
        {lang === "bn" ? "সংরক্ষণ করুন" : "Save Changes"}
      </button>

      <button
        onClick={() => {
          onLogout();
          onClose();
        }}
        className="mt-3 w-full py-3 rounded-xl flex items-center justify-center gap-2 font-black border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition-all cursor-pointer"
      >
        <LogOut className="h-4 w-4" />
        {lang === "bn" ? "লগ আউট করুন" : "Log Out"}
      </button>
    </motion.div>
  );
}
