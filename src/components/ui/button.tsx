
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Atualização: sombra, gradiente, borda mais arredondada, fonte maior e efeito hover destacado
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-md active:scale-[0.97] hover:shadow-lg [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-freight-500 via-freight-700 to-freight-800 text-white hover:from-freight-600 hover:to-freight-900",
        destructive:
          "bg-gradient-to-br from-destructive via-destructive-foreground to-destructive text-white hover:brightness-110",
        outline:
          "border-2 border-freight-600 text-freight-700 bg-white hover:bg-freight-50 hover:border-freight-700",
        secondary:
          "bg-gradient-to-br from-secondary via-freight-100 to-freight-200 text-freight-800 hover:from-freight-200 hover:to-freight-400",
        ghost: "hover:bg-freight-50 hover:text-freight-700 text-freight-700",
        link: "text-freight-700 underline underline-offset-4 hover:text-freight-600",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4",
        lg: "h-14 rounded-2xl px-8 text-lg",
        icon: "h-12 w-12",
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
