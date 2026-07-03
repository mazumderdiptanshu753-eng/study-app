import fs from 'fs';
let code = fs.readFileSync('src/components/WelcomePage.tsx', 'utf8');
code = code.replace(/<p className="text-\[10px\].*?\{t\.secureSessionNotice\}[\s\S]*$/, 
`<p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center lg:text-left mt-3 ml-2">
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
}`);
fs.writeFileSync('src/components/WelcomePage.tsx', code);
