
import React from "react";
import { cn } from "@/lib/utils";

interface FormRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const FormRow = React.forwardRef<HTMLDivElement, FormRowProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col md:flex-row gap-3", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormRow.displayName = "FormRow";
