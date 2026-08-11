"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, type ActionResult } from "@/app/actions";
import { Field, TextInput, SubmitButton } from "@/components/forms/fields";

const initialState: ActionResult = { status: "success", message: "" };

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(adminLogin, initialState);
  const errors = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.status === "success" && state.message) {
      router.push("/admin");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state.status === "error" && state.message && (
        <div
          role="alert"
          className="rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-sm font-medium text-accent-700"
        >
          {state.message}
        </div>
      )}

      <Field label="Email address" htmlFor="login-email" error={errors.email} required>
        <TextInput
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="admin@pulseevent.com"
          required
          aria-invalid={!!errors.email}
        />
      </Field>

      <Field label="Password" htmlFor="login-password" error={errors.password} required>
        <TextInput
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          aria-invalid={!!errors.password}
        />
      </Field>

      <SubmitButton pending={pending} className="w-full">
        Sign in
      </SubmitButton>
    </form>
  );
}
