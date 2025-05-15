
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm active:scale-[0.98] hover:shadow-md [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-freight-500 via-freight-700 to-freight-800 text-white hover:from-freight-600 hover:to-freight-900 dark:from-freight-600 dark:to-freight-800 dark:hover:from-freight-500 dark:hover:to-freight-700",
        destructive: "bg-gradient-to-br from-destructive via-destructive-foreground to-destructive text-white hover:brightness-110 dark:hover:brightness-125",
        outline: "border-2 border-freight-600 text-freight-700 bg-white hover:bg-freight-50 hover:border-freight-700 dark:border-freight-400 dark:text-freight-300 dark:bg-transparent dark:hover:bg-freight-950 dark:hover:border-freight-300",
        secondary: "bg-gradient-to-br from-secondary via-freight-100 to-freight-200 text-freight-800 hover:from-freight-200 hover:to-freight-400 dark:from-freight-800 dark:to-freight-900 dark:text-white dark:hover:from-freight-700 dark:hover:to-freight-800",
        ghost: "hover:bg-freight-50 hover:text-freight-700 text-freight-700 dark:text-freight-300 dark:hover:bg-freight-900 dark:hover:text-freight-200",
        link: "text-freight-700 underline underline-offset-4 hover:text-freight-600 dark:text-freight-400 dark:hover:text-freight-300",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 py-2 text-sm",
        lg: "h-12 rounded-2xl px-7 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
