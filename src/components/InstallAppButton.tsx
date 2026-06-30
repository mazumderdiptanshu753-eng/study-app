import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Language, TRANSLATIONS } from '../lib/translations';

interface InstallAppButtonProps {
  lang: Language;
}

export default function InstallAppButton({ lang }: InstallAppButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      console.log(`'beforeinstallprompt' event was fired.`);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert(
        lang === "bn" 
          ? "দয়া করে অ্যাপটি নতুন ট্যাবে খুলুন এবং আপনার ব্রাউজারের মেনু থেকে ইনস্টল করুন (Install App)।" 
          : "To install, please open this app in a new tab and use your browser's 'Install App' option."
      );
      return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  return (
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
  );
}
