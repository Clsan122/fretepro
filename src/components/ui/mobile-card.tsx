import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MobileCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const MobileCard = ({ children, className, onClick }: MobileCardProps) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-lg border shadow-sm p-4 mb-3 touch-manipulation",
        "hover:shadow-md transition-shadow duration-200",
        "dark:bg-gray-800 dark:border-gray-700",
        onClick && "cursor-pointer active:scale-[0.98] active:bg-gray-50 dark:active:bg-gray-700",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};