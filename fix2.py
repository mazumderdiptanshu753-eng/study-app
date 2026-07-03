with open("src/components/WelcomePage.tsx", "r") as f:
    text = f.read()

import re
text = re.sub(r'<p className="text-\[10px\] text-slate-500 font-bold uppercase tracking-wider text-center lg:text-left mt-3 ml-2">\s*\{t\.secureSessionNotice\}\s*</p>\s*</motion\.div>\s*</div>\s*</div>', 
'''<p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center lg:text-left mt-3 ml-2">
              {t.secureSessionNotice}
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="lg:col-span-6 flex items-center justify-center perspective-[1000px] h-[360px] sm:h-[450px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            ref={cardRef}
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            }}
            className="relative w-80 sm:w-96 aspect-square bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center backdrop-blur-md cursor-grab active:cursor-grabbing select-none transition-all duration-150"
          >
            {/* Background glowing ring inside card */}
            <div className="absolute inset-10 rounded-full border border-teal-500/20 animate-pulse duration-3000 pointer-events-none z-0"></div>
            <div className="absolute inset-16 rounded-full border border-dashed border-slate-700/60 animate-spin duration-15000 pointer-events-none z-0"></div>
            
            {/* 3D Layer 1: App Logo Stack (Highest translateZ) */}
            <div 
              style={{ transform: "translateZ(80px)" }} 
              className="relative z-10 mb-6 drop-shadow-[0_20px_35px_rgba(200,29,37,0.3)] transition-transform duration-300"
            >
              <AppLogo size="xl" className="border-4 border-slate-950/40 scale-105" />
            </div>

            {/* 3D Layer 2: Label & Title (Medium translateZ) */}
            <div 
              style={{ transform: "translateZ(50px)" }}
              className="text-center space-y-1 relative z-10 transition-transform duration-300"
            >
              <h3 className="text-xl font-black tracking-widest uppercase text-slate-100">
                {t.brandName}
              </h3>
            </div>

            {/* 3D Layer 3: Developer attribution (Dynamic 3D float) */}
            <div 
              style={{ 
                transform: "translateZ(35px)",
                backfaceVisibility: "hidden"
              }}
              className="text-center relative z-10 mt-6 transition-transform duration-300"
            >
              <span className="text-xs sm:text-sm font-black tracking-widest text-teal-300 font-mono bg-slate-900 border-2 border-teal-400 px-5 py-2.5 rounded-xl shadow-[0_4px_20px_rgba(13,148,136,0.4)] block uppercase">
                DEVOLOPED BY:- DIPTANSHU MAZUMDER
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>''', text, flags=re.DOTALL)

with open("src/components/WelcomePage.tsx", "w") as f:
    f.write(text)
