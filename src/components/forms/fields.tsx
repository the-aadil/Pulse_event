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
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;
  const hintId = htmlFor ? `${htmlFor}-hint` : undefined;

  return (
    <div>
      <label
        htmlFor={htmlFor}
        className={cn(
          "mb-1.5 block text-sm font-semibold",
          dark ? "text-slate-200" : "text-slate-700"
        )}
      >
        {label}
        {required && (
          <span
            className={cn("ml-0.5", dark ? "text-wine-400" : "text-red-500")}
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className={cn(
            "mt-1.5 flex items-center gap-1.5 text-xs font-medium",
            dark ? "text-wine-300" : "text-red-600"
          )}
        >
          <AlertTriangleIcon className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p
          id={hintId}
          className={cn(
            "mt-1.5 text-xs",
            dark ? "text-slate-400" : "text-slate-500"
          )}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({
  light,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  light?: boolean;
  error?: boolean;
}) {
  return (
    <input
      {...props}
      className={cn(
        "input",
        light && "input-light",
        error && "input-error",
        props.className
      )}
    />
  );
}

export function TextArea({
  light,
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  light?: boolean;
  error?: boolean;
}) {
  return (
    <textarea
      {...props}
      className={cn(
        "input min-h-28 resize-y",
        light && "input-light",
        error && "input-error",
        props.className
      )}
    />
  );
}

export function SelectInput({
  light,
  error,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  light?: boolean;
  error?: boolean;
}) {
  return (
    <select
      {...props}
      className={cn(
        "input appearance-none select-chevron",
        light && "input-light",
        error && "input-error",
        props.className
      )}
    />
  );
}

export function CheckboxInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      {...props}
      className={cn(
        "h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500",
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
      aria-busy={pending}
      className={cn("btn", className ?? "btn-dark w-full cursor-pointer")}
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
          Please wait…
        </>
      ) : (
        children
      )}
    </button>
  );
}
