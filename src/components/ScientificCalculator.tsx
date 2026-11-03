import React, { useState } from "react";
import { Language } from "../lib/translations";
import { HelpCircle, RefreshCw, Delete, CornerDownLeft, Info, X } from "lucide-react";

interface ScientificCalculatorProps {
  lang: Language;
  onClose?: () => void;
}

export default function ScientificCalculator({ lang, onClose }: ScientificCalculatorProps) {
  const [display, setDisplay] = useState<string>("");
  const [history, setHistory] = useState<string>("");
  const [isRad, setIsRad] = useState<boolean>(true); // Degrees vs Radians
  const [memory, setMemory] = useState<number>(0);
  const [lastAnswer, setLastAnswer] = useState<string>("0");

  const isBengali = lang === "bn";

  const t = {
    title: isBengali ? "বৈজ্ঞানিক ক্যালকুলেটর" : "Digital Scientific Calculator",
    subtitle: isBengali ? "জটিল গাণিতিক হিসাব সমীকরণ সমাধান করুন" : "Solve complex mathematical equations instantly",
    deg: isBengali ? "ডিগ্রি" : "DEG",
    rad: isBengali ? "রেডিয়ান" : "RAD",
    clear: isBengali ? "মুছুন" : "Clear",
    invalid: isBengali ? "ভুল সমীকরণ" : "Error",
    historyLabel: isBengali ? "ইতিহাস" : "History",
    copy: isBengali ? "কপি করুন" : "Copy result",
    copied: isBengali ? "কপি হয়েছে!" : "Copied!",
    lastAns: isBengali ? "সর্বশেষ ফল:" : "Last Ans:"
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!display || display === t.invalid) return;
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const appendToDisplay = (value: string) => {
    // If there is an error, clear it first
    if (display === t.invalid) {
      setDisplay(value);
    } else {
      setDisplay(prev => prev + value);
    }
  };

  const clearDisplay = () => {
    setDisplay("");
    setHistory("");
  };

  const handleBackspace = () => {
    if (display === t.invalid) {
      setDisplay("");
    } else {
      setDisplay(prev => prev.slice(0, -1));
    }
  };

  const calculateResult = () => {
    if (!display.trim()) return;

    try {
      let formattedExpr = display;

      // Replace symbols for evaluation
      formattedExpr = formattedExpr.replace(/π/g, "Math.PI");
      formattedExpr = formattedExpr.replace(/e/g, "Math.E");
      
      // Handle square root: sqrt(x) -> Math.sqrt(x)
      formattedExpr = formattedExpr.replace(/sqrt\(/g, "Math.sqrt(");
      
      // Handle powers: x^y -> Math.pow(x,y)
      // Standard safe replacement of ^ for base evaluations (simple regex or direct math eval helper)
      // For more robust, let's support general replacement:
      while (formattedExpr.includes("^")) {
        const index = formattedExpr.indexOf("^");
        // Simple search for left and right operands or wrap in Math.pow
        // For a digital calculator parser, we can use simple eval if formatted, or implement a clean helper
        // Since we want this robust, we can replace '^' with '**' which is standard ES6 exponentiation!
        formattedExpr = formattedExpr.replace(/\^/g, "**");
      }

      // Handle sin, cos, tan, log, ln
      // If deg mode, we convert the argument of sin/cos/tan from degrees to radians
      const angleMultiplier = isRad ? 1 : Math.PI / 180;

      // We can substitute trigs. E.g. sin(x) -> Math.sin(x * multiplier)
      // A simple regex approach or custom evaluator. Let's do regex replacements
      // To prevent nested replacement issues, we can target sin(, cos(, tan(
      // Let's implement function injections:
      // We will parse trig functions customly or replace them with wrapped Math functions
      // In JS, sin(x) -> Math.sin(x * angleMultiplier)
      // Let's create helper functions on the evaluation context
      
      const sin = (x: number) => Math.sin(x * angleMultiplier);
      const cos = (x: number) => Math.cos(x * angleMultiplier);
      const tan = (x: number) => Math.tan(x * angleMultiplier);
      const log = (x: number) => Math.log10(x);
      const ln = (x: number) => Math.log(x);
      const sqrt = (x: number) => Math.sqrt(x);

      // Create a safe evaluation environment
      // We safely map these functions so eval can find them
      const safeEval = new Function(
        "sin", "cos", "tan", "log", "ln", "sqrt",
        `return (${formattedExpr})`
      );

      const result = safeEval(sin, cos, tan, log, ln, sqrt);

      if (result === null || result === undefined || isNaN(result) || !isFinite(result)) {
        setDisplay(t.invalid);
      } else {
        // Format result nicely
        const formattedResult = Number(result.toFixed(8)).toString();
        setHistory(display + " =");
        setDisplay(formattedResult);
        setLastAnswer(formattedResult);
      }
    } catch (error) {
      setDisplay(t.invalid);
    }
  };

  const handleMemory = (op: string) => {
    const currentVal = parseFloat(display) || 0;
    if (op === "MC") {
      setMemory(0);
    } else if (op === "MR") {
      setDisplay(memory.toString());
    } else if (op === "M+") {
      setMemory(prev => prev + currentVal);
    } else if (op === "M-") {
      setMemory(prev => prev - currentVal);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white via-indigo-50/20 to-purple-50/20 rounded-3xl border border-indigo-100 shadow-xl p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-indigo-100/60 pb-3">
        <div>
          <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
            <span className="p-1 rounded-lg bg-indigo-100 text-indigo-600">🧮</span> {t.title}
          </h3>
          <p className="text-[10px] text-slate-500 font-bold">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Rad/Deg Toggle Switch */}
          <div className="flex bg-indigo-50 border border-indigo-100 rounded-xl p-0.5 text-3xs font-black">
            <button
              onClick={() => setIsRad(false)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                !isRad 
                  ? "bg-white text-indigo-700 shadow-2xs font-black" 
                  : "text-slate-500 hover:text-indigo-900"
              }`}
            >
              {t.deg}
            </button>
            <button
              onClick={() => setIsRad(true)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                isRad 
                  ? "bg-white text-indigo-700 shadow-2xs font-black" 
                  : "text-slate-500 hover:text-indigo-900"
              }`}
            >
              {t.rad}
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-1.5 rounded-xl border border-rose-200 transition-all cursor-pointer"
              title={lang === "bn" ? "বন্ধ করুন" : "Close Calculator"}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Screen / Display Display */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 rounded-2xl p-4 text-right font-mono relative overflow-hidden shadow-inner border border-indigo-400/30 select-all">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>

        {/* History / Equation track */}
        <div className="text-[11px] text-indigo-200/80 font-bold h-4 truncate">
          {history}
        </div>
        
        {/* Current Entry */}
        <div className="text-2xl sm:text-3xl font-black text-emerald-300 tracking-tight h-9 truncate mt-1">
          {display || "0"}
        </div>

        {/* Bottom row: Memory & Copy actions inside Screen */}
        <div className="mt-3 pt-2.5 border-t border-indigo-500/20 flex items-center justify-between text-[10px] text-indigo-200/80">
          <div className="flex items-center gap-2">
            <span className="font-black text-indigo-300 uppercase">MEM:</span>
            <span className="font-bold text-amber-300">{memory}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-indigo-300 font-bold">
              {t.lastAns} <span className="text-emerald-300">{lastAnswer}</span>
            </span>
            <button
              onClick={handleCopy}
              className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-bold transition-all cursor-pointer"
              title={t.copy}
            >
              {copied ? t.copied : "[Copy]"}
            </button>
          </div>
        </div>
      </div>

      {/* Calculator Buttons Grid */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {/* Row 1: Memory & Backspace */}
        <button 
          onClick={() => handleMemory("MC")} 
          className="py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[10px] font-black text-indigo-700 border border-indigo-100 transition-colors cursor-pointer"
        >
          MC
        </button>
        <button 
          onClick={() => handleMemory("MR")} 
          className="py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[10px] font-black text-indigo-700 border border-indigo-100 transition-colors cursor-pointer"
        >
          MR
        </button>
        <button 
          onClick={() => handleMemory("M+")} 
          className="py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[10px] font-black text-indigo-700 border border-indigo-100 transition-colors cursor-pointer"
        >
          M+
        </button>
        <button 
          onClick={() => handleMemory("M-")} 
          className="py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[10px] font-black text-indigo-700 border border-indigo-100 transition-colors cursor-pointer"
        >
          M-
        </button>
        <button 
          onClick={handleBackspace} 
          className="py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors flex items-center justify-center cursor-pointer"
          title="Backspace"
        >
          <Delete className="h-4 w-4" />
        </button>

        {/* Row 2: Sci functions */}
        <button 
          onClick={() => appendToDisplay("sin(")} 
          className="py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-xs font-bold text-purple-700 border border-purple-200 transition-colors cursor-pointer"
        >
          sin
        </button>
        <button 
          onClick={() => appendToDisplay("cos(")} 
          className="py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-xs font-bold text-purple-700 border border-purple-200 transition-colors cursor-pointer"
        >
          cos
        </button>
        <button 
          onClick={() => appendToDisplay("tan(")} 
          className="py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-xs font-bold text-purple-700 border border-purple-200 transition-colors cursor-pointer"
        >
          tan
        </button>
        <button 
          onClick={() => appendToDisplay("π")} 
          className="py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-xs font-bold text-indigo-700 border border-indigo-200 transition-colors cursor-pointer"
        >
          π
        </button>
        <button 
          onClick={clearDisplay} 
          className="py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-xs font-black text-amber-800 border border-amber-300 transition-colors cursor-pointer"
        >
          C
        </button>

        {/* Row 3: Advanced operations & numbers */}
        <button 
          onClick={() => appendToDisplay("log(")} 
          className="py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-xs font-bold text-purple-700 border border-purple-200 transition-colors cursor-pointer"
        >
          log
        </button>
        <button 
          onClick={() => appendToDisplay("7")} 
          className="py-2.5 rounded-xl bg-white hover:bg-indigo-50/60 text-xs font-black text-slate-800 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          7
        </button>
        <button 
          onClick={() => appendToDisplay("8")} 
          className="py-2.5 rounded-xl bg-white hover:bg-indigo-50/60 text-xs font-black text-slate-800 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          8
        </button>
        <button 
          onClick={() => appendToDisplay("9")} 
          className="py-2.5 rounded-xl bg-white hover:bg-indigo-50/60 text-xs font-black text-slate-800 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          9
        </button>
        <button 
          onClick={() => appendToDisplay("/")} 
          className="py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-700 border border-blue-200 transition-colors cursor-pointer"
        >
          ÷
        </button>

        {/* Row 4: Ln, 4, 5, 6, * */}
        <button 
          onClick={() => appendToDisplay("ln(")} 
          className="py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-xs font-bold text-purple-700 border border-purple-200 transition-colors cursor-pointer"
        >
          ln
        </button>
        <button 
          onClick={() => appendToDisplay("4")} 
          className="py-2.5 rounded-xl bg-white hover:bg-indigo-50/60 text-xs font-black text-slate-800 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          4
        </button>
        <button 
          onClick={() => appendToDisplay("5")} 
          className="py-2.5 rounded-xl bg-white hover:bg-indigo-50/60 text-xs font-black text-slate-800 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          5
        </button>
        <button 
          onClick={() => appendToDisplay("6")} 
          className="py-2.5 rounded-xl bg-white hover:bg-indigo-50/60 text-xs font-black text-slate-800 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          6
        </button>
        <button 
          onClick={() => appendToDisplay("*")} 
          className="py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-700 border border-blue-200 transition-colors cursor-pointer"
        >
          ×
        </button>

        {/* Row 5: Sqrt, 1, 2, 3, - */}
        <button 
          onClick={() => appendToDisplay("sqrt(")} 
          className="py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-xs font-bold text-purple-700 border border-purple-200 transition-colors cursor-pointer"
        >
          √
        </button>
        <button 
          onClick={() => appendToDisplay("1")} 
          className="py-2.5 rounded-xl bg-white hover:bg-indigo-50/60 text-xs font-black text-slate-800 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          1
        </button>
        <button 
          onClick={() => appendToDisplay("2")} 
          className="py-2.5 rounded-xl bg-white hover:bg-indigo-50/60 text-xs font-black text-slate-800 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          2
        </button>
        <button 
          onClick={() => appendToDisplay("3")} 
          className="py-2.5 rounded-xl bg-white hover:bg-indigo-50/60 text-xs font-black text-slate-800 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          3
        </button>
        <button 
          onClick={() => appendToDisplay("-")} 
          className="py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-700 border border-blue-200 transition-colors cursor-pointer"
        >
          -
        </button>

        {/* Row 6: Exp, 0, ., +, = */}
        <button 
          onClick={() => appendToDisplay("^")} 
          className="py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-xs font-bold text-purple-700 border border-purple-200 transition-colors cursor-pointer"
          title="Exponent (base^power)"
        >
          x<sup>y</sup>
        </button>
        <button 
          onClick={() => appendToDisplay("0")} 
          className="py-2.5 rounded-xl bg-white hover:bg-indigo-50/60 text-xs font-black text-slate-800 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          0
        </button>
        <button 
          onClick={() => appendToDisplay(".")} 
          className="py-2.5 rounded-xl bg-white hover:bg-indigo-50/60 text-xs font-black text-slate-800 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          .
        </button>
        <button 
          onClick={() => appendToDisplay("+")} 
          className="py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-700 border border-blue-200 transition-colors cursor-pointer"
        >
          +
        </button>
        <button 
          onClick={calculateResult} 
          className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-xs font-black text-white transition-all flex items-center justify-center shadow-md cursor-pointer active:scale-95"
          title="Equal"
        >
          <CornerDownLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Helper brackets and constants */}
      <div className="flex flex-wrap gap-2 justify-center text-[10px] text-slate-500 font-bold border-t border-indigo-100/60 pt-3 bg-indigo-50/40 rounded-xl p-2">
        <button 
          onClick={() => appendToDisplay("(")} 
          className="px-3 py-1 rounded-lg bg-white border border-indigo-100 hover:bg-indigo-50 text-indigo-700 font-bold cursor-pointer"
        >
          (
        </button>
        <button 
          onClick={() => appendToDisplay(")")} 
          className="px-3 py-1 rounded-lg bg-white border border-indigo-100 hover:bg-indigo-50 text-indigo-700 font-bold cursor-pointer"
        >
          )
        </button>
        <button 
          onClick={() => appendToDisplay("e")} 
          className="px-3 py-1 rounded-lg bg-white border border-indigo-100 hover:bg-indigo-50 text-indigo-700 font-bold cursor-pointer"
        >
          e
        </button>
        <div className="h-4 w-px bg-indigo-200 self-center"></div>
        <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-semibold px-2">
          <Info className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
          <span>
            {isBengali 
              ? "ত্রিকোণমিতিতে DEG/RAD পরিবর্তন করে হিসাব করুন" 
              : "Use DEG/RAD mode for trigonometric calculations"}
          </span>
        </div>
      </div>

    </div>
  );
}
