import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface MobileButtonProps extends ButtonProps {
  touchOptimized?: boolean;
}

export const MobileButton = forwardRef<HTMLButtonElement, MobileButtonProps>(
  ({ className, touchOptimized = true, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          touchOptimized && [
            "touch-manipulation",
            "min-h-[44px]", // iOS recommended touch target size
            "active:scale-95",
            "transition-transform duration-100"
          ],
          className
        )}
        {...props}
      />
    );
  }
);

MobileButton.displayName = "MobileButton";