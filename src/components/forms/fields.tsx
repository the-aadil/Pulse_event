import { AlertTriangleIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
  required,
  dark = false,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  required?: boolean;
  dark?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className={cn(
          "mb-1.5 block text-sm font-semibold",
          dark ? "text-slate-200" : "text-ink"
        )}
      >
        {label}
        {required && (
          <span className={cn("ml-0.5", dark ? "text-wine-400" : "text-wine-600")} aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p className={cn(
          "mt-1.5 flex items-center gap-1.5 text-xs font-medium",
          dark ? "text-wine-300" : "text-wine-700"
        )}>
          <AlertTriangleIcon className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p className={cn(
          "mt-1.5 text-xs",
          dark ? "text-slate-400" : "text-ink/50"
        )}>{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return <input {...props} className={cn("input", error && "input-error", props.className)} />;
}

export function TextArea({ error, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  return <textarea {...props} className={cn("input min-h-28 resize-y", error && "input-error", props.className)} />;
}

export function SelectInput({ error, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return <select {...props} className={cn("input appearance-none select-chevron", error && "input-error", props.className)} />;
}

export function CheckboxInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      {...props}
      className={cn(
        "h-4 w-4 rounded border-gold-300 text-gold-600 focus:ring-gold-500",
        props.className
      )}
    />
  );
}

export function SubmitButton({
  pending,
  children,
  className,
}: {
  pending: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn("btn btn-primary w-full", className)}
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream" />
          Please wait…
        </>
      ) : (
        children
      )}
    </button>
  );
}
