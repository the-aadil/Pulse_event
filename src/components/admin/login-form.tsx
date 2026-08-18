"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, type ActionResult } from "@/app/actions";
import { Field, TextInput, SubmitButton } from "@/components/forms/fields";

const initialState: ActionResult = { status: "idle", message: "" };

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(adminLogin, initialState);
  const errors = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.status === "success") {
      router.push("/admin");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} noValidate className="space-y-5">
      {/* Global error alert */}
      {state.status === "error" && state.message && (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300"
        >
          <svg
            className="h-4 w-4 shrink-0 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
          {state.message}
        </div>
      )}

      <Field label="Email address" htmlFor="login-email" error={errors.email} required dark>
        <TextInput
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="admin@example.com"
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "login-email-err" : undefined}
        />
        {errors.email && (
          <p id="login-email-err" className="sr-only" role="alert">
            {errors.email}
          </p>
        )}
      </Field>

      <Field label="Password" htmlFor="login-password" error={errors.password} required dark>
        <TextInput
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "login-password-err" : undefined}
        />
        {errors.password && (
          <p id="login-password-err" className="sr-only" role="alert">
            {errors.password}
          </p>
        )}
      </Field>

      <SubmitButton pending={pending} className="btn btn-primary w-full">
        Sign in
      </SubmitButton>
    </form>
  );
}
