import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const baseClass =
  "w-full rounded-lg border border-gold/15 bg-navy-100/50 px-4 py-2.5 text-sm text-offwhite placeholder:text-mutedgray transition-colors duration-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40 disabled:opacity-50 [color-scheme:dark]";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          baseClass,
          error && "border-red-500/60 focus:border-red-500 focus:ring-red-500/30",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;

interface FieldLabelProps {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FieldLabel({ htmlFor, children, required }: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 flex items-center gap-1 text-xs font-medium uppercase tracking-luxe text-gold"
    >
      {children}
      {required && <span className="text-red-400">*</span>}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-400">{message}</p>;
}

export function Textarea({
  className,
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return (
    <textarea
      className={cn(
        baseClass,
        "resize-none",
        error && "border-red-500/60 focus:border-red-500 focus:ring-red-500/30",
        className
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  error,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  return (
    <select
      className={cn(
        baseClass,
        error && "border-red-500/60 focus:border-red-500 focus:ring-red-500/30",
        className
      )}
      {...props}
    />
  );
}
