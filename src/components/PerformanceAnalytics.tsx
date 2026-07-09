import React, { useState } from "react";
import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Target, TrendingUp, Award, Clock } from "lucide-react";
import { Language } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";

interface PerformanceAnalyticsProps {
  lang: Language;
  theme: ThemeConfig;
}

const progressData = [
  { name: 'Week 1', math: 40, english: 24, reasoning: 35 },
  { name: 'Week 2', math: 45, english: 38, reasoning: 40 },
  { name: 'Week 3', math: 65, english: 45, reasoning: 55 },
  { name: 'Week 4', math: 80, english: 60, reasoning: 75 },
];

const completionData = [
  { subject: 'Math', completed: 85, remaining: 15 },
  { subject: 'English', completed: 60, remaining: 40 },
  { subject: 'Reasoning', completed: 75, remaining: 25 },
  { subject: 'GK', completed: 40, remaining: 60 },
];

export default function PerformanceAnalytics({ lang, theme }: PerformanceAnalyticsProps) {
  const isBengali = lang === "bn";

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${theme.primaryText}`}>
            {isBengali ? "পারফরম্যান্স অ্যানালিটিক্স" : "Performance Analytics"}
          </h2>
          <p className={`text-sm ${theme.textMuted} mt-1`}>
            {isBengali ? "আপনার অগ্রগতি ও সিলেবাস শেষের বিস্তারিত রিপোর্ট।" : "Detailed report of your progress and syllabus completion."}
          </p>
        </div>
        <div className={`p-3 rounded-full ${theme.primaryBg}`}>
          <TrendingUp className={`h-6 w-6 ${theme.primaryText}`} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Target className="w-5 h-5 text-indigo-500" />, label: isBengali ? "লক্ষ্য পূরন" : "Goal Met", value: "75%", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
          { icon: <Clock className="w-5 h-5 text-amber-500" />, label: isBengali ? "অধ্যয়নের সময়" : "Study Time", value: "24h 30m", bg: "bg-amber-50 dark:bg-amber-500/10" },
          { icon: <Award className="w-5 h-5 text-emerald-500" />, label: isBengali ? "মক টেস্ট স্কোর" : "Mock Score", value: "82/100", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { icon: <TrendingUp className="w-5 h-5 text-rose-500" />, label: isBengali ? "উন্নতি" : "Improvement", value: "+15%", bg: "bg-rose-50 dark:bg-rose-500/10" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${theme.bgCard} p-4 rounded-2xl border ${theme.borderCard}`}
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className={`text-xs ${theme.textMuted} font-medium`}>{stat.label}</p>
            <p className={`text-lg font-bold ${theme.primaryText} mt-1`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`${theme.bgCard} p-5 rounded-2xl border ${theme.borderCard}`}
        >
          <h3 className={`text-sm font-bold ${theme.primaryText} mb-6`}>
            {isBengali ? "সাপ্তাহিক অগ্রগতি (Weekly Progress)" : "Weekly Progress"}
          </h3>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" stroke={theme.isDark ? '#cbd5e1' : '#64748b'} fontSize={10} />
                <YAxis stroke={theme.isDark ? '#cbd5e1' : '#64748b'} fontSize={10} />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: theme.isDark ? '#1e293b' : '#fff', 
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="math" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 8 }} name={isBengali ? "অংক" : "Math"} />
                <Line type="monotone" dataKey="english" stroke="#10b981" strokeWidth={3} name={isBengali ? "ইংরেজি" : "English"} />
                <Line type="monotone" dataKey="reasoning" stroke="#f59e0b" strokeWidth={3} name={isBengali ? "রিজনিং" : "Reasoning"} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`${theme.bgCard} p-5 rounded-2xl border ${theme.borderCard}`}
        >
          <h3 className={`text-sm font-bold ${theme.primaryText} mb-6`}>
            {isBengali ? "সিলেবাস শেষের হার (Syllabus Completion)" : "Syllabus Completion"}
          </h3>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="subject" stroke={theme.isDark ? '#cbd5e1' : '#64748b'} fontSize={10} />
                <YAxis stroke={theme.isDark ? '#cbd5e1' : '#64748b'} fontSize={10} />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: theme.isDark ? '#1e293b' : '#fff', 
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }} 
                  cursor={{fill: 'transparent'}}
                />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#10b981" name={isBengali ? "সম্পূর্ণ" : "Completed"} radius={[0, 0, 4, 4]} />
                <Bar dataKey="remaining" stackId="a" fill={theme.isDark ? '#334155' : '#e2e8f0'} name={isBengali ? "বাকি আছে" : "Remaining"} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
