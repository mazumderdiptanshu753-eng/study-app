import { motion } from 'motion/react';
import AppLogo from './AppLogo';
import { ThemeConfig } from '../lib/themes';
import { Language } from '../lib/translations';

interface SplashScreenProps {
  theme: ThemeConfig;
  lang: Language;
}

export default function SplashScreen({ theme, lang }: SplashScreenProps) {
  return (
    <motion.div
      key="splash"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${theme.bgPage.split("/")[0]} ${theme.textMain}`}
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
        >
          <AppLogo size="xl" />
        </motion.div>
        
        <motion.div 
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className={`text-4xl font-black tracking-tight ${theme.textHeading} mb-2`}>
            StudyHub
          </h1>
          <p className="text-sm tracking-widest uppercase opacity-70 font-bold">
            {lang === 'bn' ? 'শিক্ষা পোর্টাল' : 'Academic Portal'}
          </p>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-xs font-medium opacity-60 mb-1">
          {lang === 'bn' ? 'ডেভেলপার' : 'Developed by'}
        </p>
        <p className={`text-sm font-bold ${theme.textHeading}`}>
          Diptanshu Mazumder
        </p>
      </motion.div>
    </motion.div>
  );
}
