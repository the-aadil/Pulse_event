"use client";

import { useActionState } from "react";
import { submitEnquiry, type ActionResult } from "@/app/actions";
import { Field, TextInput, TextArea, SubmitButton } from "@/components/forms/fields";
import { SuccessToast } from "@/components/forms/success-toast";
import { CheckIcon } from "@/components/icons";

const initialState: ActionResult = { status: "idle", message: "" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);
  const errors = state.fieldErrors ?? {};
  const success = state.status === "success" && !!state.message;

  return (
    <>
      {success && (
        <SuccessToast
          key={state.message ?? "message-sent"}
          title="Message sent!"
          message={state.message}
        />
      )}

      <form action={formAction} noValidate className="space-y-5">
        {state.status === "error" && state.message && (
          <div
            role="alert"
            className="rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-sm font-medium text-accent-700"
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
          aria-hidden
        />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="ct-name" error={errors.name} required>
          <TextInput
            id="ct-name"
            name="name"
            placeholder="Your full name"
            autoComplete="name"
            required
            aria-invalid={!!errors.name}
          />
        </Field>
        <Field label="Phone" htmlFor="ct-phone" error={errors.phone}>
          <TextInput
            id="ct-phone"
            name="phone"
            type="tel"
            placeholder="Optional"
            autoComplete="tel"
            inputMode="tel"
          />
        </Field>
      </div>

      <Field label="Email address" htmlFor="ct-email" error={errors.email} required>
        <TextInput
          id="ct-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          aria-invalid={!!errors.email}
        />
      </Field>

      <Field label="Subject" htmlFor="ct-subject" error={errors.subject}>
        <TextInput
          id="ct-subject"
          name="subject"
          placeholder="What is this about? (optional)"
        />
      </Field>

      <Field label="Message" htmlFor="ct-message" error={errors.message} required>
        <TextArea
          id="ct-message"
          name="message"
          placeholder="How can we help you?"
          minLength={10}
          maxLength={2000}
          required
          aria-invalid={!!errors.message}
        />
      </Field>

      {success && (
        <div
          role="status"
          className="flex items-start gap-2.5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm"
        >
          <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <div>
            <p className="font-semibold text-emerald-800">
              Message sent successfully
            </p>
            <p className="text-emerald-700">{state.message}</p>
          </div>
        </div>
      )}

      <SubmitButton pending={pending}>Send message</SubmitButton>
      </form>
    </>
  );
}
