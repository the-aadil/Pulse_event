"use client";

import { useCallback, useLayoutEffect, useMemo, useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
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
  ArrowRightIcon,
  ArrowLeftIcon,
  CalendarIcon,
} from "@/components/icons";

const GalleryLightbox = dynamic(
  () => import("@/components/gallery/gallery-lightbox").then((mod) => mod.GalleryLightbox),
  { ssr: false }
);

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
  className,
}: {
  item: GalleryItem;
  onOpen: () => void;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("group relative overflow-hidden rounded-lg border-[2px] border-[#d4af37] bg-[#12141c] shadow-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] isolation-isolate", className)}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View ${item.alt} full size`}
        className="block w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-400"
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
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0c10]/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <Link
        href={bookHref(item)}
        className="btn btn-primary btn-sm absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-2 whitespace-nowrap opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
      >
        <CalendarIcon className="h-3.5 w-3.5" />
        Book now
      </Link>
    </div>
  );
}

function PageJumpDropdown({
  currentPage,
  totalPages,
  jumpToPage,
}: {
  currentPage: number;
  totalPages: number;
  jumpToPage: (page: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useLayoutEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, handleClick]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Jump to page"
        aria-expanded={open}
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-gold-500/30 bg-[#12141c] px-3 text-sm font-medium text-slate-400 transition-colors hover:border-gold-400 hover:text-slate-100 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
      >
        Page {currentPage}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("transition-transform duration-200", open && "rotate-180")}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full mb-1 right-0 z-50 w-full min-w-[5rem] overflow-hidden rounded-md border border-gold-500/30 bg-[#12141c] shadow-xl">
          <ul className="max-h-[128px] overflow-y-auto py-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => {
                    jumpToPage(String(page));
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-gold-500/20 hover:text-gold-400",
                    page === currentPage
                      ? "bg-gold-500/10 font-bold text-gold-400"
                      : "text-slate-300"
                  )}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  category,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  category: string | null;
  onPageChange: (page: number) => void;
}) {
  const start = Math.max(1, currentPage - Math.floor(VISIBLE_PAGES / 2));
  const end = Math.min(totalPages, start + VISIBLE_PAGES - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const jumpToPage = (value: string) => {
    const page = Number(value);
    if (!Number.isNaN(page)) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Gallery pagination"
      className="w-full flex items-center justify-center"
    >
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className={cn(
            "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors",
            currentPage === 1
              ? "cursor-not-allowed border-gold-500/20 bg-gold-950/40 text-slate-500 opacity-60"
              : "border-gold-500/30 bg-[#12141c] text-slate-100 hover:border-gold-400 hover:bg-gold-500/15"
          )}
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>

        {pages.map((page) => {
          const active = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors",
                active
                  ? "border-gold-400 bg-gradient-to-r from-gold-500 to-amber-400 text-slate-950 hover:from-gold-400 hover:to-amber-300 font-semibold"
                  : "border-gold-500/20 bg-[#12141c] text-slate-400 hover:border-gold-400 hover:text-slate-100"
              )}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className={cn(
            "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors",
            currentPage === totalPages
              ? "cursor-not-allowed border-gold-500/20 bg-gold-950/40 text-slate-500 opacity-60"
              : "border-gold-500/30 bg-[#12141c] text-slate-100 hover:border-gold-400 hover:bg-gold-500/15"
          )}
        >
          <ArrowRightIcon className="h-4 w-4" />
        </button>

        <PageJumpDropdown
          currentPage={currentPage}
          totalPages={totalPages}
          jumpToPage={jumpToPage}
        />
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
  const [, startTransition] = useTransition();
  const router = useRouter();

  useLayoutEffect(() => {
    setCategory(initialCategory);
    setPage(initialPage);
    setLightboxIndex(null);
  }, [initialCategory, initialPage]);

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
    startTransition(() => {
      setCategory(resolved);
      setPage(1);
      setLightboxIndex(null);
      router.replace(galleryUrl(resolved, 1), { scroll: false });
    });
  };

  const handlePageChange = (nextPage: number) => {
    startTransition(() => {
      setPage(nextPage);
      setLightboxIndex(null);
      router.push(galleryUrl(category, nextPage), { scroll: false });
    });
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
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-400",
                active
                  ? "border-gold-400 bg-gradient-to-r from-gold-500 to-amber-400 text-slate-950 shadow-sm font-semibold"
                  : "border-gold-500/20 bg-[#12141c] text-slate-400 hover:border-gold-400 hover:text-slate-100"
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
            itemClassName="mb-[18px] break-inside-avoid inline-block w-full"
            className="columns-2 gap-6 px-2 sm:px-0 sm:columns-2 lg:columns-3"
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
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <p className="py-12 text-center text-slate-400">
          No photos in this category yet.
        </p>
      )}

      {lightboxItem && lightboxIndex !== null && (
        <GalleryLightbox
          item={lightboxItem}
          index={lightboxIndex}
          total={pageItems.length}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  );
}
