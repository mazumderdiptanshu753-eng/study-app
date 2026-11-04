import React from "react";

interface AppLogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  showBorder?: boolean;
}

export default function AppLogo({ 
  className = "", 
  size = "md",
  rounded = "2xl",
  showBorder = true
}: AppLogoProps) {
  // Preset container sizes
  const dims = {
    xs: "h-7 w-7 min-w-[1.75rem]",
    sm: "h-9 w-9 min-w-[2.25rem]",
    md: "h-11 w-11 min-w-[2.75rem]",
    lg: "h-20 w-20 min-w-[5rem]",
    xl: "h-32 w-32 min-w-[8rem]",
    xxl: "h-44 w-44 min-w-[11rem]"
  };

  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-md",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-2xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full"
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center overflow-hidden bg-white/95 backdrop-blur-xs select-none shrink-0 transition-transform ${dims[size]} ${roundedClasses[rounded]} ${showBorder ? "border border-slate-200/80 shadow-xs" : ""} ${className}`}
      id="study-hub-app-logo"
    >
      <img
        src="/assets/aistudio/study_hub_png_6009f548.png"
        alt="Study Hub Official Logo"
        className="w-full h-full object-contain p-0.5 select-none pointer-events-none drop-shadow-2xs"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
