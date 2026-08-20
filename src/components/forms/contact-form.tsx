"use client";

import { useActionState } from "react";
import { submitEnquiry, type ActionResult } from "@/app/actions";
import { Field, TextInput, TextArea, SubmitButton } from "@/components/forms/fields";

const initialState: ActionResult = { status: "idle", message: "" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);
  const errors = state.fieldErrors ?? {};
  const success = state.status === "success" && !!state.message;

  return (
    <form action={formAction} className="space-y-5">
      {state.status === "error" && state.message && (
        <div
          role="alert"
          className="rounded-xl border border-wine-500/30 bg-wine-950/40 px-4 py-3 text-sm font-medium text-wine-200"
        >
          {state.message}
        </div>
      )}

      <input
        type="text"
        name="company_website"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="ct-name" error={errors.name} required dark>
          <TextInput
            id="ct-name"
            name="name"
            placeholder="Your full name"
            autoComplete="name"
            required
            error={!!errors.name}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "ct-name-error" : undefined}
          />
        </Field>
        <Field label="Phone" htmlFor="ct-phone" error={errors.phone} dark>
          <TextInput
            id="ct-phone"
            name="phone"
            type="tel"
            placeholder="Optional"
            autoComplete="tel"
            inputMode="tel"
            error={!!errors.phone}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "ct-phone-error" : undefined}
          />
        </Field>
      </div>

      <Field label="Email address" htmlFor="ct-email" error={errors.email} required dark>
        <TextInput
          id="ct-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          error={!!errors.email}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "ct-email-error" : undefined}
        />
      </Field>

      <Field label="Subject" htmlFor="ct-subject" error={errors.subject} dark>
        <TextInput
          id="ct-subject"
          name="subject"
          placeholder="What is this about? (optional)"
          aria-describedby={errors.subject ? "ct-subject-error" : undefined}
        />
      </Field>

      <Field label="Message" htmlFor="ct-message" error={errors.message} required dark>
        <TextArea
          id="ct-message"
          name="message"
          placeholder="How can we help you?"
          minLength={10}
          maxLength={2000}
          required
          error={!!errors.message}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "ct-message-error" : undefined}
        />
      </Field>

      {success && (
        <p role="status" className="text-sm text-emerald-300">
          {state.message}
        </p>
      )}

      <SubmitButton pending={pending}>Send message</SubmitButton>
    </form>
  );
}
