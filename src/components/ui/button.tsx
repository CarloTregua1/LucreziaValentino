"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-sans text-sm font-medium tracking-wide transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-foreground)] text-[var(--color-background)] hover:bg-[var(--color-accent)] px-8 py-3",
        secondary:
          "border border-[var(--color-foreground)] text-[var(--color-foreground)] hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)] px-8 py-3",
        ghost:
          "text-[var(--color-foreground)] hover:text-[var(--color-accent)] underline-offset-4 hover:underline",
        link: "text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-accent-hover)] p-0 h-auto",
        destructive:
          "bg-[var(--color-error)] text-white hover:opacity-90 px-8 py-3",
      },
      size: {
        sm: "text-xs px-5 py-2",
        md: "px-8 py-3",
        lg: "text-base px-10 py-4",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  isLoading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled ?? isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
