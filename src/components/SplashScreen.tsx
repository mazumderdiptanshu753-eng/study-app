import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import AppLogo from './AppLogo';
import { ThemeConfig } from '../lib/themes';
import { Language } from '../lib/translations';
import pkg from '../../package.json';

interface SplashScreenProps {
  key?: string;
  theme: ThemeConfig;
  lang: Language;
}

export default function SplashScreen({ theme, lang }: SplashScreenProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = ((y - centerY) / centerY) * -15;
    const rotateYValue = ((x - centerX) / centerX) * 15;
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      key="splash"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${theme.bgPage} ${theme.textMain} overflow-hidden`}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob bg-teal-200/50"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[60%] h-[60%] rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-2000 bg-rose-200/50"></div>
      </div>

      <div 
        className="relative z-10 flex flex-col items-center gap-8 perspective-[1000px] w-full max-w-sm"
      >
        <motion.div
          ref={cardRef}
          initial={{ scale: 0.8, opacity: 0, rotateY: -30, rotateX: 20 }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            rotateY: rotateY !== 0 ? rotateY : [ -30, 10, -5, 0 ],
            rotateX: rotateX !== 0 ? rotateX : [ 20, -5, 5, 0 ]
          }}
          transition={{ 
            duration: (rotateX !== 0 || rotateY !== 0) ? 0.1 : 2.5,
            ease: "easeOut"
          }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-64 h-64 flex items-center justify-center"
        >
          {/* Background glowing ring inside card */}
          <div className={`absolute inset-0 rounded-full border ${theme.heroOuterBorder} opacity-50 animate-[spin_10s_linear_infinite] pointer-events-none`}></div>
          <div className={`absolute inset-[-2rem] rounded-full border ${theme.heroOuterBorder} border-dashed opacity-30 animate-[spin_15s_linear_infinite_reverse] pointer-events-none`}></div>
          
          <div style={{ transform: "translateZ(80px)" }} className="relative z-10 shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-white/40 to-transparent p-1.5 transition-transform duration-300">
            <div className={`${theme.primaryBg} rounded-[1.25rem] p-6 shadow-inner`}>
              <AppLogo size="xl" className="scale-110" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="text-center"
          initial={{ y: 30, opacity: 0, rotateX: -20 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          style={{ transformStyle: "preserve-3d", transform: "translateZ(40px)" }}
        >
          <h1 className={`text-5xl md:text-6xl font-black tracking-tight ${theme.textHeading} mb-3 drop-shadow-xs`}>
            StudyHub
          </h1>
          <p className="text-sm md:text-base tracking-[0.3em] uppercase font-bold bg-gradient-to-r from-teal-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent mb-4">
            {lang === 'bn' ? 'শিক্ষা পোর্টাল' : 'Academic Portal'}
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5, type: "spring" }}
            className="inline-flex items-center justify-center"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-xs bg-white/90 text-teal-700 border border-teal-200 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              V {pkg.version}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="flex items-center justify-center gap-2 bg-white/95 text-slate-800 px-6 py-3.5 rounded-2xl shadow-xl border border-teal-200 backdrop-blur-md">
          <span className="text-xs sm:text-sm md:text-base font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-indigo-600 to-rose-600">
            {lang === 'bn' ? 'ডেভেলপার' : 'Developed By'}: Diptanshu Mazumder
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
