import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";
import { Language } from "../lib/translations";

interface OfflineIndicatorProps {
  lang?: Language;
  variant?: "pill" | "banner" | "inline";
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  });
  const [wasOffline, setWasOffline] = useState<boolean>(false);
  const [justReconnected, setJustReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setJustReconnected(true);
        const timer = setTimeout(() => {
          setJustReconnected(false);
          setWasOffline(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setJustReconnected(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [wasOffline]);

  return { isOnline, justReconnected };
}

export default function OfflineIndicator({ lang = "bn", variant = "pill" }: OfflineIndicatorProps) {
  const { isOnline, justReconnected } = useOnlineStatus();

  const isBn = lang === "bn";

  if (isOnline && !justReconnected) {
    return null;
  }

  if (variant === "pill") {
    return (
      <AnimatePresence>
        {(!isOnline || justReconnected) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-extrabold border shadow-3xs transition-all ${
              !isOnline
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 animate-pulse"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
            }`}
            title={
              !isOnline
                ? isBn
                  ? "ইন্টারনেট সংযোগ বিচ্ছিন্ন (ডেটা লোকালি সেভ হচ্ছে)"
                  : "Internet Disconnected (Features syncing paused)"
                : isBn
                ? "ইন্টারনেট সংযোগ পুনরায় যুক্ত হয়েছে"
                : "Internet Restored"
            }
          >
            {!isOnline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">
                  {isBn ? "অফলাইন (সিঙ্ক বন্ধ)" : "Disconnected"}
                </span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">
                  {isBn ? "সংযুক্ত হয়েছে" : "Connected"}
                </span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {(!isOnline || justReconnected) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full overflow-hidden"
        >
          <div
            className={`w-full px-4 py-2 flex items-center justify-center gap-2 text-xs font-semibold backdrop-blur-md border-b ${
              !isOnline
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20"
                : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
            }`}
          >
            {!isOnline ? (
              <>
                <WifiOff className="w-4 h-4 text-amber-500 animate-bounce" />
                <span>
                  {isBn
                    ? "আপনি বর্তমানে অফলাইনে আছেন। কিছু ফিচার রিয়েল-টাইমে সিঙ্ক নাও হতে পারে।"
                    : "You are currently offline. Changes will sync once connection is restored."}
                </span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-emerald-500" />
                <span>
                  {isBn
                    ? "ইন্টারনেট সংযোগ ফিরে এসেছে! ডেটা সিঙ্ক করা হচ্ছে..."
                    : "Internet connection restored! Syncing data..."}
                </span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
