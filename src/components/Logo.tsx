
import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  size = "md", 
  variant = "full" 
}) => {
  const sizeClasses = {
    sm: variant === "full" ? "h-6" : "h-6 w-6",
    md: variant === "full" ? "h-8" : "h-8 w-8",
    lg: variant === "full" ? "h-10" : "h-10 w-10",
  };

  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  };

  if (variant === "icon") {
    return (
      <img 
        src="/icons/fretevalor-logo.png"
        alt="FreteValor Logo"
        className={`${iconSizes[size]} rounded-md ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/icons/fretevalor-logo.png"
        alt="FreteValor Logo"
        className={`${iconSizes[size]} rounded-md`}
      />
      <span className={`font-bold text-freight-700 dark:text-freight-300 ${size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl"}`}>
        FreteValor
      </span>
    </div>
  );
};

export default Logo;
