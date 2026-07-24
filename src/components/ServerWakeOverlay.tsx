import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Server, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";
import { Language } from "../lib/translations";

interface ServerWakeOverlayProps {
  lang?: Language;
}

export default function ServerWakeOverlay({ lang = "bn" }: ServerWakeOverlayProps) {
  const [isWaking, setIsWaking] = useState(false);
  const [wakeMessage, setWakeMessage] = useState<string>("");
  const [successPing, setSuccessPing] = useState(false);

  useEffect(() => {
    const handleWakeStatus = (event: Event) => {
      const customEvent = event as CustomEvent<{ isWaking: boolean; message?: string }>;
      if (customEvent.detail.isWaking) {
        setIsWaking(true);
        setWakeMessage(customEvent.detail.message || "");
        setSuccessPing(false);
      } else {
        setSuccessPing(true);
        const timer = setTimeout(() => {
          setIsWaking(false);
          setSuccessPing(false);
        }, 800);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener("server-wake-status", handleWakeStatus);
    return () => {
      window.removeEventListener("server-wake-status", handleWakeStatus);
    };
  }, []);

  return (
    <AnimatePresence>
      {isWaking && (
        <motion.div
          id="server-wake-overlay"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
        >
          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900/90 dark:bg-slate-800/95 text-white backdrop-blur-md border border-indigo-500/40 shadow-2xl shadow-indigo-500/20">
            {successPing ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
            ) : (
              <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
            )}

            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-wide text-indigo-300 uppercase flex items-center gap-1">
                <Server className="w-3.5 h-3.5" />
                {successPing
                  ? (lang === "bn" ? "সার্ভার সক্রিয়!" : "Server Ready!")
                  : (lang === "bn" ? "সার্ভার শুরু হচ্ছে..." : "Connecting to Server...")}
              </span>
              <span className="text-xs text-slate-200 font-medium">
                {wakeMessage ||
                  (lang === "bn"
                    ? "অনুগ্রহ করে ১-২ সেকেন্ড অপেক্ষা করুন, সার্ভার প্রস্তুত হচ্ছে।"
                    : "Waking up cloud server, please wait a moment...")}
              </span>
            </div>

            {!successPing && (
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-1" />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
