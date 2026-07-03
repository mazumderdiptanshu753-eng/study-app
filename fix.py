with open("src/components/WelcomePage.tsx", "r") as f:
    text = f.read()

import re
text = re.sub(r'<p className="text-\[10px\] text-slate-500.*?\{t\.secureSessionNotice\}.*?$', 
'''<p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center lg:text-left mt-3 ml-2">
              {t.secureSessionNotice}
            </p>
          </motion.div>
        </div>
      </div>
      {/* Small floating branding */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-600 font-bold uppercase tracking-widest select-none pointer-events-none">
        Crafted for Excellence • {t.brandName}
      </div>
    </div>
  );
}''', text, flags=re.DOTALL)

with open("src/components/WelcomePage.tsx", "w") as f:
    f.write(text)
