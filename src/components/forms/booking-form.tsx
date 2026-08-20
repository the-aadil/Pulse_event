"use client";

import { useActionState } from "react";
import { submitBooking, type ActionResult } from "@/app/actions";
import { Field, TextInput, SelectInput, TextArea, SubmitButton } from "@/components/forms/fields";
import { SparklesIcon } from "@/components/icons";
import type { EventType } from "@/generated/prisma/client";

const initialState: ActionResult = { status: "idle", message: "" };

export function BookingForm({
  events,
  preselectedSlug,
  initialStyle,
}: {
  events: EventType[];
  preselectedSlug?: string;
  initialStyle?: string;
}) {
  const [state, formAction, pending] = useActionState(submitBooking, initialState);
  const errors = state.fieldErrors ?? {};
  const success = state.status === "success" && !!state.message;

  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" && state.message && !state.reference && (
        <div
          role="alert"
          className="rounded-xl border border-wine-500/30 bg-wine-950/40 px-4 py-3 text-sm font-medium text-wine-200"
        >
          {state.message}
        </div>
      )}

      {initialStyle && (
        <div className="flex items-start gap-2.5 rounded-xl border border-gold-400/30 bg-gold-950/40 px-4 py-3 text-sm text-gold-200">
          <SparklesIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
          <p>
            You&apos;re booking this look:{" "}
            <span className="font-semibold">{initialStyle}</span>. We&apos;ll
            aim to recreate it for your event.
          </p>
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

      <fieldset className="space-y-5">
        <legend className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400 pb-2 border-b border-gold-500/20 w-full">
          Contact Details
        </legend>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="bk-name" error={errors.name} required dark>
            <TextInput
              id="bk-name"
              name="name"
              placeholder="Your full name"
              autoComplete="name"
              required
              error={!!errors.name}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "bk-name-error" : undefined}
            />
          </Field>
          <Field label="Phone number" htmlFor="bk-phone" error={errors.phone} required dark>
            <TextInput
              id="bk-phone"
              name="phone"
              type="tel"
              placeholder="e.g. 98765 43210"
              autoComplete="tel"
              inputMode="tel"
              required
              error={!!errors.phone}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "bk-phone-error" : undefined}
            />
          </Field>
        </div>

        <Field label="Email address" htmlFor="bk-email" error={errors.email} required dark>
          <TextInput
            id="bk-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            error={!!errors.email}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "bk-email-error" : undefined}
          />
        </Field>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400 pb-2 border-b border-gold-500/20 w-full">
          Event Details
        </legend>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Event type" htmlFor="bk-type" error={errors.eventType} required dark>
            <SelectInput
              id="bk-type"
              name="eventType"
              defaultValue={preselectedSlug ?? ""}
              required
              error={!!errors.eventType}
              aria-invalid={!!errors.eventType}
              aria-describedby={errors.eventType ? "bk-type-error" : undefined}
            >
              <option value="" disabled>
                Select an event type
              </option>
              {events.map((event) => (
                <option key={event.id} value={event.slug}>
                  {event.name}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Event date" htmlFor="bk-date" error={errors.eventDate} required dark>
            <TextInput
              id="bk-date"
              name="eventDate"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              required
              error={!!errors.eventDate}
              aria-invalid={!!errors.eventDate}
              aria-describedby={errors.eventDate ? "bk-date-error" : undefined}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Expected guests" htmlFor="bk-guests" error={errors.guests} required dark>
            <TextInput
              id="bk-guests"
              name="guests"
              type="number"
              inputMode="numeric"
              min={1}
              max={100000}
              placeholder="e.g. 150"
              required
              error={!!errors.guests}
              aria-invalid={!!errors.guests}
              aria-describedby={errors.guests ? "bk-guests-error" : undefined}
            />
          </Field>
          <Field label="City / venue" htmlFor="bk-city" error={errors.city} dark>
            <TextInput
              id="bk-city"
              name="city"
              placeholder="e.g. Pune"
              autoComplete="address-level2"
              aria-describedby={errors.city ? "bk-city-error" : undefined}
            />
          </Field>
        </div>

        <Field
          label="Anything else we should know?"
          htmlFor="bk-message"
          error={errors.message}
          hint="Theme ideas, budget, special requests… (optional)"
          dark
        >
          <TextArea
            id="bk-message"
            name="message"
            placeholder="Tell us about your dream event…"
            maxLength={2000}
            defaultValue={
              initialStyle
                ? `I'd like to recreate this look: ${initialStyle}. `
                : undefined
            }
            aria-describedby={errors.message ? "bk-message-error" : "bk-message-hint"}
          />
        </Field>
      </fieldset>

      {success && (
        <p role="status" className="text-sm text-emerald-300">
          {state.message}
        </p>
      )}

      <SubmitButton pending={pending}>
        Submit booking request
      </SubmitButton>
    </form>
  );
}
