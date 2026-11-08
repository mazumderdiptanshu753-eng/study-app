import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Bot, User, Sparkles, Loader2, Upload, ImageIcon } from 'lucide-react';
import { ThemeConfig } from '../lib/themes';
import { Language } from '../lib/translations';
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

interface AIStudyAssistantProps {
  theme: ThemeConfig;
  lang: Language;
}

export default function AIStudyAssistant({ theme, lang }: AIStudyAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBengali = lang === "bn";

  useEffect(() => {
    // Add initial greeting
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: isBengali 
            ? "নমস্কার! আমি আপনার স্টাডি মেন্টর। সিলেবাস, পড়াশোনার রুটিন বা যেকোনো বিষয়ের প্রশ্ন এখানে জিজ্ঞেস করতে পারেন।" 
            : "Hello! I am your Academic Study Mentor. Feel free to ask any question regarding your studies or concepts."
        }
      ]);
    }
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `chat-images/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      const newUserMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: isBengali ? "আমি একটি ছবি সংযুক্ত করেছি" : "I have attached an image",
        imageUrl: url
      };
      
      setMessages(prev => [...prev, newUserMsg]);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    setInputText("");
    
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText
    };
    
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/study-assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          lang 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Failed to get response");

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text
      }]);
    } catch (error: any) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: isBengali ? "দুঃখিত, একটি সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।" : "Sorry, an error occurred. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-[600px] max-h-[80vh] w-full max-w-3xl mx-auto rounded-3xl border ${theme.borderCard} overflow-hidden shadow-xl ${theme.bgCard} mt-4`}>
      <div className={`p-4 border-b ${theme.borderCard} flex items-center gap-3 bg-gradient-to-r ${theme.isDark ? 'from-slate-800 to-slate-900' : 'from-indigo-50 to-blue-50'}`}>
        <div className={`h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md`}>
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h2 className={`font-bold ${theme.textHeading}`}>
            {isBengali ? "স্টাডি মেন্টর ও গাইড" : "Academic Study Mentor"}
          </h2>
          <p className={`text-xs ${theme.textMuted}`}>
            {isBengali ? "স্টাডি হাব একাডেমি • অ্যাকাডেমিক সহায়তা" : "Study Hub Academy • Academic Assistance"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className={`h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0`}>
                  <Bot className="h-4 w-4" />
                </div>
              )}
              
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                isUser 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : `${theme.isDark ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-white border-slate-200'} border rounded-bl-none`
              }`}>
                {msg.imageUrl && <img src={msg.imageUrl} alt="Uploaded" className="max-w-full rounded-lg mb-2" />}
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>

              {isUser && (
                <div className={`h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0`}>
                  <User className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                </div>
              )}
            </motion.div>
          );
        })}

        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex items-end gap-2.5 justify-start`}
          >
            <div className={`h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0`}>
              <Bot className="h-4 w-4" />
            </div>
            <div className={`rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2 ${theme.isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border`}>
              <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
              <span className={`text-xs ${theme.textMuted}`}>
                {isBengali ? "চিন্তা করছে..." : "Thinking..."}
              </span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={`p-4 pb-24 md:pb-4 border-t ${theme.borderCard} ${theme.bgCard}`}>
        <form onSubmit={handleSendMessage} className="flex gap-2 relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-2 rounded-full hover:bg-indigo-50 transition-colors ${theme.textMuted}`}
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isBengali ? "আপনার প্রশ্ন লিখুন..." : "Ask your question..."}
            className="flex-1 rounded-full border border-indigo-200 bg-white px-5 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`absolute right-1 top-1 bottom-1 aspect-square rounded-full flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Send className="h-4 w-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
