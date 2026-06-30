import React, { useState, useEffect } from 'react';
import { Download, ExternalLink, X } from 'lucide-react';
import { Language, TRANSLATIONS } from '../lib/translations';

interface InstallAppButtonProps {
  lang: Language;
}

export default function InstallAppButton({ lang }: InstallAppButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if ((window as any).deferredPrompt) {
      setDeferredPrompt((window as any).deferredPrompt);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      (window as any).deferredPrompt = e;
      console.log(`'beforeinstallprompt' event was fired.`);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || (window as any).deferredPrompt;
    if (!promptEvent) {
      setShowInstructions(true);
      return;
    }
    
    // Show the install prompt
    promptEvent.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await promptEvent.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    (window as any).deferredPrompt = null;
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
        title={lang === "bn" ? "অ্যাপটি ইনস্টল করুন" : "Install App"}
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">
          {lang === "bn" ? "অ্যাপ ইনস্টল করুন" : "Install App"}
        </span>
      </button>

      {showInstructions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-sm overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                {lang === "bn" ? "অ্যাপটি কীভাবে ইনস্টল করবেন" : "How to Install"}
              </h3>
              <button 
                onClick={() => setShowInstructions(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:text-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 text-sm text-slate-600 dark:text-slate-300 space-y-4">
              <p>
                {lang === "bn" 
                  ? "যেহেতু আপনি অ্যাপটি প্রিভিউ মোডে দেখছেন অথবা আপনার ব্রাউজার ইতিমধ্যে ইনস্টল আইকন দেখাচ্ছে, তাই সরাসরি এখান থেকে ইনস্টল করা যাবে না।" 
                  : "Because you are viewing the app in preview mode, or your browser is already showing an install icon, it cannot be installed directly from here."}
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                <ol className="list-decimal pl-4 space-y-2 font-medium">
                  <li>
                    {lang === "bn" 
                      ? "পিসিতে থাকলে: ব্রাউজারের অ্যাড্রেস বারের ডানদিকে থাকা 'Install' আইকনে ক্লিক করুন।" 
                      : "On PC: Click the 'Install' icon at the right side of the browser's address bar."}
                  </li>
                  <li>
                    {lang === "bn" 
                      ? "মোবাইলে থাকলে: উপরে ডানদিকে থাকা 'Open in new tab' (↗️) আইকনে ক্লিক করে অ্যাপটি নতুন ট্যাবে খুলুন। তারপর ব্রাউজারের মেনু থেকে 'Add to Home Screen' নির্বাচন করুন।" 
                      : "On Mobile: Click the 'Open in new tab' (↗️) icon to open the app, then select 'Add to Home Screen' from your browser's menu."}
                  </li>
                </ol>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button
                onClick={() => setShowInstructions(false)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-sm font-bold hover:bg-slate-800 dark:hover:bg-white transition-colors"
              >
                {lang === "bn" ? "বুঝতে পেরেছি" : "Got it"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
