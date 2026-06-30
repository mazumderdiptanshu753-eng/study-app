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
    <div className="bg-white rounded-xl border border-slate-100 shadow-3xs p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
            <span className="text-emerald-500">🧮</span> {t.title}
          </h3>
          <p className="text-[10px] text-slate-400 font-medium">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Rad/Deg Toggle Switch */}
          <div className="flex bg-slate-100 rounded-lg p-0.5 text-3xs font-extrabold">
            <button
              onClick={() => setIsRad(false)}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                !isRad 
                  ? "bg-white text-emerald-700 shadow-3xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.deg}
            </button>
            <button
              onClick={() => setIsRad(true)}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                isRad 
                  ? "bg-white text-emerald-700 shadow-3xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.rad}
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-1.5 rounded-lg border border-rose-100 transition-all cursor-pointer"
              title={lang === "bn" ? "বন্ধ করুন" : "Close Calculator"}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Screen / Display Display */}
      <div className="bg-slate-900 rounded-xl p-4 text-right font-mono relative overflow-hidden shadow-inner select-all">
        {/* Subtle grid pattern background to look digital */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* History / Equation track */}
        <div className="text-[10px] text-emerald-400/60 font-semibold h-4 truncate">
          {history}
        </div>
        
        {/* Current Entry */}
        <div className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight h-8 truncate mt-1">
          {display || "0"}
        </div>

        {/* Bottom row: Memory & Copy actions inside Screen */}
        <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-500 uppercase">MEM:</span>
            <span className="font-bold text-emerald-500/80">{memory}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-bold">
              {t.lastAns} <span className="text-emerald-500/80">{lastAnswer}</span>
            </span>
            <button
              onClick={handleCopy}
              className="text-emerald-400/70 hover:text-emerald-300 font-bold transition-colors cursor-pointer"
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
          className="py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-[10px] font-black text-slate-500 transition-colors cursor-pointer"
        >
          MC
        </button>
        <button 
          onClick={() => handleMemory("MR")} 
          className="py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-[10px] font-black text-slate-500 transition-colors cursor-pointer"
        >
          MR
        </button>
        <button 
          onClick={() => handleMemory("M+")} 
          className="py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-[10px] font-black text-slate-500 transition-colors cursor-pointer"
        >
          M+
        </button>
        <button 
          onClick={() => handleMemory("M-")} 
          className="py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-[10px] font-black text-slate-500 transition-colors cursor-pointer"
        >
          M-
        </button>
        <button 
          onClick={handleBackspace} 
          className="py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors flex items-center justify-center cursor-pointer"
          title="Backspace"
        >
          <Delete className="h-3.5 w-3.5" />
        </button>

        {/* Row 2: Sci functions */}
        <button 
          onClick={() => appendToDisplay("sin(")} 
          className="py-2.5 rounded-lg bg-emerald-50/50 hover:bg-emerald-50 text-xs font-bold text-emerald-800 transition-colors cursor-pointer"
        >
          sin
        </button>
        <button 
          onClick={() => appendToDisplay("cos(")} 
          className="py-2.5 rounded-lg bg-emerald-50/50 hover:bg-emerald-50 text-xs font-bold text-emerald-800 transition-colors cursor-pointer"
        >
          cos
        </button>
        <button 
          onClick={() => appendToDisplay("tan(")} 
          className="py-2.5 rounded-lg bg-emerald-50/50 hover:bg-emerald-50 text-xs font-bold text-emerald-800 transition-colors cursor-pointer"
        >
          tan
        </button>
        <button 
          onClick={() => appendToDisplay("π")} 
          className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
        >
          π
        </button>
        <button 
          onClick={clearDisplay} 
          className="py-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-xs font-black text-amber-700 transition-colors cursor-pointer"
        >
          C
        </button>

        {/* Row 3: Advanced operations & numbers */}
        <button 
          onClick={() => appendToDisplay("log(")} 
          className="py-2.5 rounded-lg bg-emerald-50/50 hover:bg-emerald-50 text-xs font-bold text-emerald-800 transition-colors cursor-pointer"
        >
          log
        </button>
        <button 
          onClick={() => appendToDisplay("7")} 
          className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-black text-slate-800 transition-colors cursor-pointer"
        >
          7
        </button>
        <button 
          onClick={() => appendToDisplay("8")} 
          className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-black text-slate-800 transition-colors cursor-pointer"
        >
          8
        </button>
        <button 
          onClick={() => appendToDisplay("9")} 
          className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-black text-slate-800 transition-colors cursor-pointer"
        >
          9
        </button>
        <button 
          onClick={() => appendToDisplay("/")} 
          className="py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
        >
          ÷
        </button>

        {/* Row 4: Ln, 4, 5, 6, * */}
        <button 
          onClick={() => appendToDisplay("ln(")} 
          className="py-2.5 rounded-lg bg-emerald-50/50 hover:bg-emerald-50 text-xs font-bold text-emerald-800 transition-colors cursor-pointer"
        >
          ln
        </button>
        <button 
          onClick={() => appendToDisplay("4")} 
          className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-black text-slate-800 transition-colors cursor-pointer"
        >
          4
        </button>
        <button 
          onClick={() => appendToDisplay("5")} 
          className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-black text-slate-800 transition-colors cursor-pointer"
        >
          5
        </button>
        <button 
          onClick={() => appendToDisplay("6")} 
          className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-black text-slate-800 transition-colors cursor-pointer"
        >
          6
        </button>
        <button 
          onClick={() => appendToDisplay("*")} 
          className="py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
        >
          ×
        </button>

        {/* Row 5: Sqrt, 1, 2, 3, - */}
        <button 
          onClick={() => appendToDisplay("sqrt(")} 
          className="py-2.5 rounded-lg bg-emerald-50/50 hover:bg-emerald-50 text-xs font-bold text-emerald-800 transition-colors cursor-pointer"
        >
          √
        </button>
        <button 
          onClick={() => appendToDisplay("1")} 
          className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-black text-slate-800 transition-colors cursor-pointer"
        >
          1
        </button>
        <button 
          onClick={() => appendToDisplay("2")} 
          className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-black text-slate-800 transition-colors cursor-pointer"
        >
          2
        </button>
        <button 
          onClick={() => appendToDisplay("3")} 
          className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-black text-slate-800 transition-colors cursor-pointer"
        >
          3
        </button>
        <button 
          onClick={() => appendToDisplay("-")} 
          className="py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
        >
          -
        </button>

        {/* Row 6: Exp, 0, ., +, = */}
        <button 
          onClick={() => appendToDisplay("^")} 
          className="py-2.5 rounded-lg bg-emerald-50/50 hover:bg-emerald-50 text-xs font-bold text-emerald-800 transition-colors cursor-pointer"
          title="Exponent (base^power)"
        >
          x<sup>y</sup>
        </button>
        <button 
          onClick={() => appendToDisplay("0")} 
          className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-black text-slate-800 transition-colors cursor-pointer"
        >
          0
        </button>
        <button 
          onClick={() => appendToDisplay(".")} 
          className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-black text-slate-800 transition-colors cursor-pointer"
        >
          .
        </button>
        <button 
          onClick={() => appendToDisplay("+")} 
          className="py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
        >
          +
        </button>
        <button 
          onClick={calculateResult} 
          className="py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-black text-white transition-colors flex items-center justify-center shadow-xs cursor-pointer active:scale-98"
          title="Equal"
        >
          <CornerDownLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Helper brackets and constants */}
      <div className="flex gap-2 justify-center text-[10px] text-slate-400 font-bold border-t border-slate-50 pt-2 bg-slate-50/30 rounded-lg p-1.5">
        <button 
          onClick={() => appendToDisplay("(")} 
          className="px-3 py-1 rounded hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
        >
          (
        </button>
        <button 
          onClick={() => appendToDisplay(")")} 
          className="px-3 py-1 rounded hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
        >
          )
        </button>
        <button 
          onClick={() => appendToDisplay("e")} 
          className="px-3 py-1 rounded hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
        >
          e
        </button>
        <div className="h-4 w-px bg-slate-200 self-center"></div>
        <div className="flex items-center gap-1 text-[9px] text-slate-400 font-medium px-2">
          <Info className="h-3 w-3 shrink-0 text-slate-400" />
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
