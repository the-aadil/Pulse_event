"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent, type ActionResult } from "@/app/actions";
import {
  Field,
  TextInput,
  TextArea,
  CheckboxInput,
  SubmitButton,
} from "@/components/forms/fields";
import type { EventType } from "@/generated/prisma/client";

const initialState: ActionResult = { status: "idle", message: "" };

export function EventForm({ event }: { event?: EventType }) {
  const router = useRouter();
  const action = event ? updateEvent.bind(null, event.id) : createEvent;
  const [state, formAction, pending] = useActionState(action, initialState);
  const errors = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.status === "success") {
      router.push("/admin/events");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state.status === "error" && state.message && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300"
        >
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-red-400"
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
          <span>{state.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Event name" htmlFor="ev-name" error={errors.name} required dark>
          <TextInput
            id="ev-name"
            name="name"
            defaultValue={event?.name}
            placeholder="e.g. Birthday Party"
            required
            aria-invalid={!!errors.name}
          />
        </Field>
        <Field
          label="Slug"
          htmlFor="ev-slug"
          error={errors.slug}
          hint="Used in the URL. e.g. birthday-party"
          required
          dark
        >
          <TextInput
            id="ev-slug"
            name="slug"
            defaultValue={event?.slug}
            placeholder="e.g. birthday-party"
            pattern="[a-z0-9-]+"
            required
            aria-invalid={!!errors.slug}
          />
        </Field>
      </div>

      <Field label="Tagline" htmlFor="ev-tagline" error={errors.tagline} dark>
        <TextInput
          id="ev-tagline"
          name="tagline"
          defaultValue={event?.tagline ?? ""}
          placeholder="A short, catchy one-liner"
          maxLength={160}
        />
      </Field>

      <Field label="Description" htmlFor="ev-desc" error={errors.description} required dark>
        <TextArea
          id="ev-desc"
          name="description"
          defaultValue={event?.description}
          placeholder="Describe what this event package includes…"
          minLength={10}
          maxLength={4000}
          required
          aria-invalid={!!errors.description}
        />
      </Field>

      <Field
        label="Image path"
        htmlFor="ev-image"
        error={errors.image}
        hint="Relative path under /public, e.g. /images/birthday-party.svg"
        dark
      >
        <TextInput
          id="ev-image"
          name="image"
          defaultValue={event?.image ?? ""}
          placeholder="/images/event.svg"
          maxLength={500}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Field label="Price from (₹)" htmlFor="ev-price" error={errors.priceFrom} dark>
          <TextInput
            id="ev-price"
            name="priceFrom"
            type="number"
            inputMode="numeric"
            min={0}
            defaultValue={event?.priceFrom ?? ""}
            placeholder="e.g. 15000"
          />
        </Field>
        <Field label="Max capacity" htmlFor="ev-cap" error={errors.capacity} dark>
          <TextInput
            id="ev-cap"
            name="capacity"
            type="number"
            inputMode="numeric"
            min={1}
            defaultValue={event?.capacity ?? ""}
            placeholder="e.g. 500"
          />
        </Field>
        <Field
          label="Sort order"
          htmlFor="ev-sort"
          error={errors.sortOrder}
          hint="Lower shows first"
          dark
        >
          <TextInput
            id="ev-sort"
            name="sortOrder"
            type="number"
            inputMode="numeric"
            min={0}
            defaultValue={event?.sortOrder ?? 0}
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-300">
          <CheckboxInput name="featured" defaultChecked={event?.featured ?? false} />
          Featured (show on homepage)
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-300">
          <CheckboxInput name="active" defaultChecked={event?.active ?? true} />
          Active (visible to visitors)
        </label>
      </div>

      <div className="flex items-center gap-3 border-t border-white/8 pt-5">
        <SubmitButton pending={pending} className="btn btn-primary">
          {event ? "Save changes" : "Create event"}
        </SubmitButton>
        <a href="/admin/events" className="btn btn-outline">
          Cancel
        </a>
      </div>
    </form>
  );
}
