import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-lg transition-colors",
          "font-medium",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          
          // Variant styles
          variant === 'default' && "bg-blue-600 text-white hover:bg-blue-700",
          variant === 'destructive' && "bg-red-600 text-white hover:bg-red-700",
          variant === 'outline' && "border-2 border-gray-300 hover:bg-gray-50",
          variant === 'ghost' && "hover:bg-gray-100",
          variant === 'link' && "text-blue-600 underline-offset-4 hover:underline",
          
          // Size styles
          size === 'default' && "h-10 px-4 py-2",
          size === 'sm' && "h-8 px-3 text-sm",
          size === 'lg' && "h-12 px-8",
          
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }