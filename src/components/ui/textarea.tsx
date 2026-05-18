import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, className, id, ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-xs font-medium tracking-widest uppercase text-[var(--color-muted)]"
        >
          {label}
        </label>
      ) : null}
      <textarea
        id={inputId}
        rows={4}
        className={cn(
          "w-full resize-none border-b border-[var(--color-border)] bg-transparent py-2.5 text-[var(--color-foreground)] placeholder-[var(--color-muted-light)] transition-colors focus:border-[var(--color-foreground)] focus:outline-none",
          error && "border-[var(--color-error)]",
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs text-[var(--color-error)]">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[var(--color-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}
