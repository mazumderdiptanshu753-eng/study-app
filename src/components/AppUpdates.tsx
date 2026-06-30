import React, { useState, useEffect } from "react";
import { RefreshCcw, DownloadCloud, CheckCircle, Server, AlertCircle } from "lucide-react";
import { ThemeConfig } from "../lib/themes";

interface AppUpdatesProps {
  lang: "en" | "bn";
  theme: ThemeConfig;
}

export default function AppUpdates({ lang, theme }: AppUpdatesProps) {
  const [status, setStatus] = useState<"checking" | "up-to-date" | "updating" | "update-available" | "error">("checking");
  const [progress, setProgress] = useState(0);
  const [versionInfo, setVersionInfo] = useState<{currentVersion: string, latestVersion: string, changelog: string} | null>(null);

  const checkUpdates = async () => {
    setStatus("checking");
    try {
      const currentVersion = localStorage.getItem("app_installed_version") || "1.0.0";
      const response = await fetch(`/api/updates/check?currentVersion=${currentVersion}`);
      if (!response.ok) throw new Error("Failed to check updates");
      const data = await response.json();
      
      const latestVersion = data.latestVersion;
      
      setVersionInfo({
        currentVersion: currentVersion,
        latestVersion: latestVersion,
        changelog: data.changelog
      });

      if (currentVersion !== latestVersion) {
        setStatus("update-available");
      } else {
        setStatus("up-to-date");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const installUpdate = async () => {
    setStatus("updating");
    setProgress(0);
    // Start fake progress while API call happens
    const interval = setInterval(() => {
      setProgress(p => (p < 90 ? p + Math.floor(Math.random() * 15) + 5 : p));
    }, 500);

    try {
      const response = await fetch("/api/updates/install", { method: "POST" });
      if (!response.ok) throw new Error("Failed to install update");
      await response.json();
      
      clearInterval(interval);
      setProgress(100);
      
      // Update local installed version marker
      if (versionInfo?.latestVersion) {
        localStorage.setItem("app_installed_version", versionInfo.latestVersion);
      }

      setTimeout(() => {
        window.location.reload(); // Reload to apply new version
      }, 1000);
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setStatus("error");
    }
  };

  useEffect(() => {
    checkUpdates();
  }, []);

  return (
    <div className={`p-4 md:p-8 space-y-6 ${theme.textMain}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
            <Server className={`h-6 w-6 ${theme.primaryText}`} />
            {lang === "bn" ? "অ্যাপ আপডেট" : "App Updates"}
          </h2>
          <p className={`text-sm ${theme.textMuted} mt-1 font-medium`}>
            {lang === "bn" 
              ? "সিস্টেম স্বয়ংক্রিয়ভাবে সার্ভার থেকে আপডেট পরীক্ষা করছে।" 
              : "System is automatically checking for updates from the server."}
          </p>
        </div>
      </div>

      <div className={`mt-8 p-8 md:p-12 rounded-2xl border ${theme.borderCard} bg-black/5 backdrop-blur-sm flex flex-col items-center justify-center text-center max-w-2xl mx-auto min-h-[300px]`}>
        
        {status === "checking" && (
          <div className="flex flex-col items-center space-y-6 animate-pulse">
            <div className="relative">
              <div className={`absolute inset-0 rounded-full ${theme.primaryBg} blur-xl opacity-20 animate-spin`} style={{ animationDuration: '3s' }}></div>
              <RefreshCcw className={`h-16 w-16 ${theme.primaryText} animate-spin`} style={{ animationDuration: '2s' }} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold">
                {lang === "bn" ? "সার্ভারের সাথে যোগাযোগ করা হচ্ছে..." : "Communicating with server..."}
              </h3>
              <p className={`text-sm ${theme.textMuted}`}>
                {lang === "bn" ? "অনুগ্রহ করে অপেক্ষা করুন" : "Please wait while we check for pending updates."}
              </p>
            </div>
          </div>
        )}

        {status === "updating" && (
          <div className="flex flex-col items-center space-y-6 w-full max-w-md">
            <DownloadCloud className={`h-16 w-16 text-sky-500 animate-bounce`} />
            <div className="space-y-2 w-full">
              <h3 className="text-lg font-bold">
                {lang === "bn" ? "নতুন আপডেট ডাউনলোড হচ্ছে..." : "Downloading new update..."}
              </h3>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-sky-500 h-3 rounded-full transition-all duration-300 ease-out relative overflow-hidden" 
                  style={{ width: `${Math.min(progress, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 skew-x-12 animate-shine"></div>
                </div>
              </div>
              <p className={`text-xs ${theme.textMuted} text-right font-mono font-bold`}>
                {Math.min(progress, 100)}%
              </p>
            </div>
          </div>
        )}

        {status === "up-to-date" && (
          <div className="flex flex-col items-center space-y-6 animate-fade-in">
            <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
              <CheckCircle className="h-10 w-10 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {lang === "bn" ? "অ্যাপ আপ-টু-ডেট আছে" : "App is up to date"}
              </h3>
              <p className={`text-sm ${theme.textMuted}`}>
                {lang === "bn" 
                  ? `আপনার কাছে সর্বশেষ সংস্করণটি (${versionInfo?.currentVersion}) ইনস্টল করা আছে।` 
                  : `You are currently running the latest version (${versionInfo?.currentVersion}).`}
              </p>
            </div>
            <button 
              onClick={checkUpdates}
              className={`mt-4 px-6 py-2 rounded-lg font-bold text-sm ${theme.primaryBtn} ${theme.primaryBtnText} transition-all`}
            >
              {lang === "bn" ? "আবার চেক করুন" : "Check Again"}
            </button>
          </div>
        )}

        {status === "update-available" && (
          <div className="flex flex-col items-center space-y-6 animate-fade-in w-full max-w-md">
            <div className="h-20 w-20 bg-sky-500/10 rounded-full flex items-center justify-center border border-sky-500/20">
              <DownloadCloud className="h-10 w-10 text-sky-500" />
            </div>
            <div className="space-y-2 text-center w-full">
              <h3 className="text-xl font-bold text-sky-600 dark:text-sky-400">
                {lang === "bn" ? "নতুন আপডেট উপলব্ধ" : "New Update Available!"}
              </h3>
              <p className={`text-sm ${theme.textMuted}`}>
                {lang === "bn" 
                  ? `সংস্করণ ${versionInfo?.latestVersion} ইনস্টল করার জন্য প্রস্তুত।` 
                  : `Version ${versionInfo?.latestVersion} is ready to install.`}
              </p>
              {versionInfo?.changelog && (
                <div className={`mt-4 p-4 text-sm text-left rounded-lg bg-black/5 dark:bg-white/5 border ${theme.borderCard}`}>
                  <p className="font-semibold mb-1">What's new:</p>
                  <p className={theme.textMuted}>{versionInfo.changelog}</p>
                </div>
              )}
            </div>
            <button 
              onClick={installUpdate}
              className={`mt-4 px-8 py-3 rounded-xl font-bold text-base bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/30 transition-all`}
            >
              {lang === "bn" ? "এখনই আপডেট করুন" : "Update Now"}
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center space-y-6 animate-fade-in">
             <AlertCircle className="h-16 w-16 text-rose-500" />
             <div className="space-y-2">
              <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400">
                {lang === "bn" ? "ত্রুটি দেখা দিয়েছে" : "Connection Error"}
              </h3>
              <p className={`text-sm ${theme.textMuted}`}>
                {lang === "bn" 
                  ? "সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।" 
                  : "Could not establish a connection to the update server."}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
