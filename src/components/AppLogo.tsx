import React from "react";

interface AppLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function AppLogo({ className = "", size = "md" }: AppLogoProps) {
  // Configurable dimensions
  const dims = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-20 w-20",
    xl: "h-36 w-36"
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-xl bg-[#c81d25] flex flex-col items-center justify-center p-1 select-none shadow-sm ${dims[size]} ${className}`}
      id="study-hub-app-logo"
    >
      {/* Semicircular white arch dome in upper half */}
      <div 
        className="absolute top-1 left-1/2 -translate-x-1/2 rounded-t-full bg-white -z-0"
        style={{
          width: "88%",
          height: "82%",
        }}
      ></div>

      {/* Internal Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-between w-full h-full py-1">
        
        {/* Books & Trophy Stack */}
        <div className="flex flex-col items-center -space-y-0.5 mt-0.5">
          {/* Golden Trophy Icon */}
          <svg 
            className="w-5 h-5 text-amber-500 drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M18 2H6v2H2v3c0 3.1 2.2 5.7 5.2 6.3C8.1 14.7 10 16 12 16s3.9-1.3 4.8-2.7c3-.6 5.2-3.2 5.2-6.3V4h-4V2zm-12 5V6h10v1c0 2.2-1.8 4-4 4s-4-1.8-4-4zm15 0c0 1.9-1.3 3.5-3 3.8V6h3v1zm-15 3.8C4.3 10.5 3 8.9 3 7V6h3v4.8zM12 17a4 4 0 01-3.9-3h7.8a4 4 0 01-3.9 3zm3 1H9v3h6v-3z" />
          </svg>
          
          {/* Styled Book Stack */}
          <div className="flex flex-col items-center -space-y-1 w-8">
            {/* Red Book (Top) */}
            <div className="h-1.5 w-6 bg-[#b91c1c] rounded-xs border-b border-red-950 flex justify-between px-0.5">
              <div className="w-0.5 h-full bg-amber-400"></div>
              <div className="w-0.5 h-full bg-amber-400"></div>
            </div>
            {/* Blue Book (Middle) */}
            <div className="h-1.5 w-7 bg-[#1d4ed8] rounded-xs border-b border-blue-950 flex justify-between px-0.5">
              <div className="w-0.5 h-full bg-amber-300"></div>
              <div className="w-0.5 h-full bg-amber-300"></div>
            </div>
            {/* Brown Book (Bottom) */}
            <div className="h-1.5 w-8 bg-[#78350f] rounded-xs border-b border-amber-950 flex justify-between px-0.5">
              <div className="w-0.5 h-full bg-amber-400"></div>
              <div className="w-0.5 h-full bg-amber-400"></div>
            </div>
          </div>
        </div>

        {/* Initials SH */}
        <div className="text-[11px] font-extrabold tracking-widest text-[#0f172a] font-serif select-none leading-none -my-0.5 drop-shadow-sm">
          SH
        </div>

        {/* Yellow Label Banner for "Study Hub" */}
        <div className="w-[94%] bg-[#fbbf24] py-0.5 border border-[#d97706] shadow-2xs flex items-center justify-center rounded-xs mb-0.5">
          <span className="text-[7.5px] font-black tracking-tight text-[#4c1d95] font-sans uppercase">
            Study Hub
          </span>
        </div>
      </div>
    </div>
  );
}
