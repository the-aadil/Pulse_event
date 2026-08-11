"use client";

import { useActionState } from "react";
import { submitBooking, type ActionResult } from "@/app/actions";
import { Field, TextInput, SelectInput, TextArea, SubmitButton } from "@/components/forms/fields";
import { SuccessToast } from "@/components/forms/success-toast";
import { CheckIcon, SparklesIcon } from "@/components/icons";
import type { EventType } from "@/generated/prisma/client";

const initialState: ActionResult = { status: "success", message: "" };

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
    <>
      {success && (
        <SuccessToast
          key={state.message ?? "booking-sent"}
          title="Booking request received!"
          message={state.message}
        />
      )}

      <form action={formAction} noValidate className="space-y-5">
        {state.status === "error" && state.message && !state.reference && (
          <div
            role="alert"
            className="rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-sm font-medium text-accent-700"
          >
            {state.message}
          </div>
        )}

        {initialStyle && (
          <div className="flex items-start gap-2.5 rounded-md border border-gold-300/60 bg-gold-50 px-4 py-3 text-sm text-gold-800">
            <SparklesIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
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
        aria-hidden
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="bk-name" error={errors.name} required>
          <TextInput
            id="bk-name"
            name="name"
            placeholder="Your full name"
            autoComplete="name"
            required
            aria-invalid={!!errors.name}
          />
        </Field>
        <Field label="Phone number" htmlFor="bk-phone" error={errors.phone} required>
          <TextInput
            id="bk-phone"
            name="phone"
            type="tel"
            placeholder="e.g. 98765 43210"
            autoComplete="tel"
            inputMode="tel"
            required
            aria-invalid={!!errors.phone}
          />
        </Field>
      </div>

      <Field label="Email address" htmlFor="bk-email" error={errors.email} required>
        <TextInput
          id="bk-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          aria-invalid={!!errors.email}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Event type" htmlFor="bk-type" error={errors.eventType} required>
          <SelectInput
            id="bk-type"
            name="eventType"
            defaultValue={preselectedSlug ?? ""}
            required
            aria-invalid={!!errors.eventType}
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
        <Field label="Event date" htmlFor="bk-date" error={errors.eventDate} required>
          <TextInput
            id="bk-date"
            name="eventDate"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            required
            aria-invalid={!!errors.eventDate}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Expected guests" htmlFor="bk-guests" error={errors.guests} required>
          <TextInput
            id="bk-guests"
            name="guests"
            type="number"
            inputMode="numeric"
            min={1}
            max={100000}
            placeholder="e.g. 150"
            required
            aria-invalid={!!errors.guests}
          />
        </Field>
        <Field label="City / venue" htmlFor="bk-city" error={errors.city}>
          <TextInput
            id="bk-city"
            name="city"
            placeholder="e.g. Pune"
            autoComplete="address-level2"
          />
        </Field>
      </div>

        <Field
          label="Anything else we should know?"
          htmlFor="bk-message"
          error={errors.message}
          hint="Theme ideas, budget, special requests… (optional)"
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
                Request submitted successfully
              </p>
              <p className="text-emerald-700">{state.message}</p>
            </div>
          </div>
        )}

        <SubmitButton pending={pending}>Submit booking request</SubmitButton>
      </form>
    </>
  );
}
