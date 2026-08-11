"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  galleryCategories,
  PAGE_SIZE,
  CATEGORY_TO_SLUG,
  type GalleryItem,
} from "@/lib/gallery";
import { cn } from "@/lib/utils";
import { Stagger } from "@/components/motion/stagger";
import {
  CloseIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CalendarIcon,
} from "@/components/icons";

const VISIBLE_PAGES = 5;

function bookHref(item: GalleryItem) {
  const params = new URLSearchParams();
  const type = CATEGORY_TO_SLUG[item.category];
  if (type) params.set("type", type);
  params.set("style", item.alt);
  return `/book?${params.toString()}`;
}

function galleryUrl(category: string | null, page: number) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/gallery?${qs}` : "/gallery";
}

function GalleryCard({
  item,
  onOpen,
  priority = false,
}: {
  item: GalleryItem;
  onOpen: () => void;
  priority?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gold-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-xl hover:shadow-ink/15">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View ${item.alt} full size`}
        className="block w-full"
      >
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </button>
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <Link
        href={bookHref(item)}
        className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 translate-y-2 items-center gap-1.5 whitespace-nowrap rounded-md bg-gold-500 px-4 py-2 text-xs font-bold text-ink opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
      >
        <CalendarIcon className="h-3.5 w-3.5" />
        Book now
      </Link>
    </div>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  category,
}: {
  currentPage: number;
  totalPages: number;
  category: string | null;
}) {
  const router = useRouter();
  const start = Math.max(1, currentPage - Math.floor(VISIBLE_PAGES / 2));
  const end = Math.min(totalPages, start + VISIBLE_PAGES - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const jumpToPage = (value: string) => {
    const page = Number(value);
    if (!Number.isNaN(page)) {
      router.push(galleryUrl(category, page));
    }
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Gallery pagination"
      className="flex flex-wrap items-center justify-center gap-1"
    >
      <div className="flex items-center gap-1">
        <Link
          href={galleryUrl(category, Math.max(1, currentPage - 1))}
          aria-label="Previous page"
          className={cn(
            "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors",
            currentPage === 1
              ? "cursor-not-allowed border-gold-200 bg-gold-100 text-ink-soft"
              : "border-gold-300 bg-white text-ink hover:border-gold-400 hover:bg-gold-50"
          )}
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Link>

        {pages.map((page) => {
          const active = page === currentPage;
          return (
            <Link
              key={page}
              href={galleryUrl(category, page)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors",
                active
                  ? "border-gold-600 bg-gold-600 text-white hover:bg-gold-700"
                  : "border-gold-200 bg-white text-ink-soft hover:border-gold-400 hover:text-ink"
              )}
            >
              {page}
            </Link>
          );
        })}

        <Link
          href={galleryUrl(category, Math.min(totalPages, currentPage + 1))}
          aria-label="Next page"
          className={cn(
            "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors",
            currentPage === totalPages
              ? "cursor-not-allowed border-gold-200 bg-gold-100 text-ink-soft"
              : "border-gold-300 bg-white text-ink hover:border-gold-400 hover:bg-gold-50"
          )}
        >
          <ArrowRightIcon className="h-4 w-4" />
        </Link>

        <select
          value={currentPage}
          onChange={(e) => jumpToPage(e.target.value)}
          aria-label="Jump to page"
          className="inline-flex h-9 items-center justify-center rounded-md border border-gold-300 bg-white px-3 text-sm font-medium text-ink-soft transition-colors hover:border-gold-400 hover:text-ink focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-400"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}

export function GalleryGrid({
  items,
  initialCategory,
  initialPage,
}: {
  items: GalleryItem[];
  initialCategory: string | null;
  initialPage: number;
}) {
  const [category, setCategory] = useState<string | null>(initialCategory);
  const [page, setPage] = useState(initialPage);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const router = useRouter();

  const filtered = useMemo(
    () =>
      category === null || category === "All"
        ? items
        : items.filter((item) => item.category === category),
    [items, category]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const selectCategory = (next: string) => {
    const resolved = next === "All" ? null : next;
    setCategory(resolved);
    setPage(1);
    setLightboxIndex(null);
    router.replace(galleryUrl(resolved, 1));
  };

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const nextImage = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? i : (i + 1) % pageItems.length
      ),
    [pageItems.length]
  );
  const prevImage = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? i : (i - 1 + pageItems.length) % pageItems.length
      ),
    [pageItems.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") nextImage();
      if (event.key === "ArrowLeft") prevImage();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, nextImage, prevImage]);

  const lightboxItem =
    lightboxIndex !== null ? pageItems[lightboxIndex] : null;

  return (
    <div className="space-y-10">
      <div
        className="flex flex-wrap items-center justify-center gap-2"
        role="group"
        aria-label="Filter gallery by category"
      >
        {galleryCategories.map((label) => {
          const resolved = label === "All" ? null : label;
          const active = category === resolved;
          return (
            <button
              key={label}
              type="button"
              onClick={() => selectCategory(label)}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-gold-600 bg-gold-600 text-white shadow-sm"
                  : "border-gold-200 bg-white text-ink-soft hover:border-gold-400 hover:text-ink"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-col items-center gap-8">
          <Stagger
            gap={110}
            itemClassName="mb-4 break-inside-avoid"
            className="columns-1 gap-4 sm:columns-2 lg:columns-3"
          >
            {pageItems.map((item, index) => (
              <GalleryCard
                key={item.src}
                item={item}
                onOpen={() => setLightboxIndex(index)}
                priority={page === 1 && index === 0}
              />
            ))}
          </Stagger>

          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            category={category}
          />
        </div>
      ) : (
        <p className="py-12 text-center text-ink-soft">
          No photos in this category yet.
        </p>
      )}

      {lightboxItem && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.alt}
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink/95 p-4 backdrop-blur-sm sm:p-8"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-cream/70">
              <span className="font-semibold text-cream">
                {lightboxItem.category}
              </span>{" "}
              · {lightboxIndex + 1} / {pageItems.length}
            </p>
            <button
              type="button"
              onClick={closeLightbox}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-cream/20 text-cream transition-colors hover:border-gold-400 hover:text-gold-400"
              aria-label="Close image viewer"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center py-4">
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-0 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 bg-ink/40 text-cream transition-colors hover:border-gold-400 hover:text-gold-400"
              aria-label="Previous image"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div className="relative h-[70vh] h-[70dvh] w-full max-w-4xl">
              <Image
                src={lightboxItem.src}
                alt={lightboxItem.alt}
                fill
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="object-contain"
                priority
              />
            </div>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-0 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 bg-ink/40 text-cream transition-colors hover:border-gold-400 hover:text-gold-400"
              aria-label="Next image"
            >
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>

          <p className="mx-auto max-w-2xl text-center text-sm text-cream/70">
            {lightboxItem.category}
          </p>
        </div>
      )}
    </div>
  );
}
