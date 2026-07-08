const fs = require('fs');
const file = 'src/components/Dashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add showSolveModal state
content = content.replace(
  /const \[showCalcModal, setShowCalcModal\] = useState\(false\);/g,
  `const [showCalcModal, setShowCalcModal] = useState(false);
  const [showSolveModal, setShowSolveModal] = useState(false);`
);

// Add launch card
const launchCardRegex = /<button\s*onClick=\{\(\) => setShowCalcModal\(true\)\}\s*className=\{`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-md active:scale-95 \${theme.primaryBtn} \${theme.primaryBtnHover} \${theme.primaryBtnText}`\}\s*>\s*<Maximize2 className="h-4 w-4" \/>\s*\{lang === "bn" \? "ক্যালকুলেটর খুলুন" : "Open Calculator"\}\s*<\/button>\s*<\/div>\s*<\/div>/g;

const launchCardReplacement = `<button
                onClick={() => setShowCalcModal(true)}
                className={\`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-md active:scale-95 \${theme.primaryBtn} \${theme.primaryBtnHover} \${theme.primaryBtnText}\`}
              >
                <Maximize2 className="h-4 w-4" />
                {lang === "bn" ? "ক্যালকুলেটর খুলুন" : "Open Calculator"}
              </button>
            </div>
          </div>

          {/* AI Math Solver Launch Card */}
          <div className={\`relative overflow-hidden rounded-2xl border \${theme.borderCard} \${theme.bgCard} p-6 shadow-xs transition-all duration-300 hover:shadow-lg \${theme.hoverBorderCard} \${getGlowClass()} \${getGlowShadow()} group mt-6\`}>
            <div className={\`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br \${theme.heroGradient} opacity-5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110\`}></div>
            <div className="space-y-5 relative z-10">
              <div>
                <span className={\`inline-flex items-center gap-1.5 rounded-lg \${theme.badgeBg} px-2.5 py-1 text-[10px] font-black \${theme.badgeText} uppercase tracking-wide mb-3 select-none\`}>
                  <Zap className="h-3 w-3 animate-pulse" /> AI Engine
                </span>
                <h4 className={\`font-black \${theme.textHeading} text-base flex items-center gap-2\`}>
                  <Sparkles className={\`h-5 w-5 \${theme.primaryText}\`} />
                  {lang === "bn" ? "এআই গণিত সমাধানকারী" : "AI Math Derivation Engine"}
                </h4>
                <p className={\`text-xs \${theme.textMuted} leading-relaxed font-medium mt-2\`}>
                  {lang === "bn" 
                    ? "যেকোন জটিল গণিত সমীকরণ বা সমস্যা এআই এর সাহায্যে ধাপে ধাপে সমাধান করুন।" 
                    : "Solve complex math problems and equations step-by-step using our advanced AI math engine."}
                </p>
              </div>
              
              <button
                onClick={() => setShowSolveModal(true)}
                className={\`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-md active:scale-95 \${theme.primaryBtn} \${theme.primaryBtnHover} \${theme.primaryBtnText}\`}
              >
                <Maximize2 className="h-4 w-4" />
                {lang === "bn" ? "ইঞ্জিন চালু করুন" : "Launch Engine"}
              </button>
            </div>
          </div>`;

content = content.replace(launchCardRegex, launchCardReplacement);

// Add AnimatePresence block for modal
const modalRegex = /<\/AnimatePresence>\s*<\/motion\.div>\s*<\/div>\s*\)\s*\}\s*<\/AnimatePresence>\s*<\/motion\.div>\s*\);\s*\}/g;

// Wait, the end of the file is just one AnimatePresence for the calc modal.
content = content.replace(
  /\{\/\* Fullscreen Scientific Calculator Modal with Glass backdrop \*\/\}/g,
  `{/* AI Math Solver Modal */}
      <AnimatePresence>
        {showSolveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSolveModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity cursor-pointer"
            ></motion.div>
            
            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              className={\`relative w-full max-w-2xl \${theme.bgCard} rounded-3xl shadow-2xl overflow-hidden z-10 border \${theme.borderCard} max-h-[90vh] overflow-y-auto\`}
            >
              <SolveWithAI 
                lang={lang} 
                theme={theme}
                onClose={() => setShowSolveModal(false)} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen Scientific Calculator Modal with Glass backdrop */}`
);

fs.writeFileSync(file, content);
