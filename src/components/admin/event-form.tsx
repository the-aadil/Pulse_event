"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent, type ActionResult } from "@/app/actions";
import { Field, TextInput, TextArea, CheckboxInput, SubmitButton } from "@/components/forms/fields";
import type { EventType } from "@/generated/prisma/client";

const initialState: ActionResult = { status: "idle", message: "" };

export function EventForm({ event }: { event?: EventType }) {
  const router = useRouter();
  const action = event
    ? updateEvent.bind(null, event.id)
    : createEvent;
  const [state, formAction, pending] = useActionState(action, initialState);
  const errors = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.status === "success" && state.message) {
      router.push("/admin/events");
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Event name" htmlFor="ev-name" error={errors.name} required>
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

      <Field label="Tagline" htmlFor="ev-tagline" error={errors.tagline}>
        <TextInput
          id="ev-tagline"
          name="tagline"
          defaultValue={event?.tagline ?? ""}
          placeholder="A short, catchy one-liner"
          maxLength={160}
        />
      </Field>

      <Field
        label="Description"
        htmlFor="ev-desc"
        error={errors.description}
        required
      >
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
        <Field label="Price from (₹)" htmlFor="ev-price" error={errors.priceFrom}>
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
        <Field label="Max capacity" htmlFor="ev-cap" error={errors.capacity}>
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
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-ink">
          <CheckboxInput name="featured" defaultChecked={event?.featured ?? false} />
          Featured (show on homepage)
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-ink">
          <CheckboxInput name="active" defaultChecked={event?.active ?? true} />
          Active (visible to visitors)
        </label>
      </div>

      <div className="flex items-center gap-3 border-t border-slate-200 pt-5">
        <SubmitButton pending={pending}>
          {event ? "Save changes" : "Create event"}
        </SubmitButton>
        <a href="/admin/events" className="btn btn-outline">
          Cancel
        </a>
      </div>
    </form>
  );
}
