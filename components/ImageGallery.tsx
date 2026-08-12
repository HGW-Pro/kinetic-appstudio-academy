"use client";

import { useCallback, useEffect, useState } from "react";

export type LessonImage = {
  src?: string;
  url?: string;
  imageUrl?: string;
  alt?: string;
  title?: string;
  caption?: string;
  description?: string;
};

// Normalizes whatever shape the underlying lesson data actually uses
// (src/url/imageUrl, alt/title, caption/description) into a single shape.
// This makes the gallery resilient to field-name drift between the
// curriculum data files and this component, instead of silently
// rendering `<img src="undefined">` when the names don't line up.
function normalize(img: LessonImage) {
  const src = img.src ?? img.url ?? img.imageUrl ?? "";
  const alt = img.alt ?? img.title ?? img.caption ?? "Lesson screenshot";
  const caption = img.caption ?? img.description ?? img.title;
  return { src, alt, caption };
}

export default function ImageGallery({ images }: { images: LessonImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [brokenIdx, setBrokenIdx] = useState<Set<number>>(new Set());

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);
  const showNext = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (openIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, showPrev, showNext]);

  if (!images || images.length === 0) return null;

  const normalized = images.map(normalize);
  const activeIdx = openIndex;
  const active = activeIdx !== null ? normalized[activeIdx] : null;

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {normalized.map((img, i) => {
          const isBroken = brokenIdx.has(i) || !img.src;
          return (
            <button
              key={i}
              type="button"
              onClick={() => !isBroken && setOpenIndex(i)}
              disabled={isBroken}
              className={`group relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-2)] transition ${
                isBroken
                  ? "cursor-default"
                  : "hover:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              }`}
              aria-label={isBroken ? "Image unavailable" : `Expand image: ${img.alt}`}
            >
              {isBroken ? (
                <div className="flex h-32 w-full flex-col items-center justify-center gap-1 text-[var(--text-lo)] sm:h-36">
                  <span className="text-xl">🖼️</span>
                  <span className="text-[10px]">Image unavailable</span>
                </div>
              ) : (
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-32 w-full object-cover transition duration-200 group-hover:scale-105 sm:h-36"
                  loading="lazy"
                  onError={() => setBrokenIdx((prev) => new Set(prev).add(i))}
                />
              )}
              {!isBroken && (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                  🔍
                </span>
              )}
              {img.caption && (
                <span className="block truncate bg-[var(--surface-2)] px-2 py-1 text-left text-[11px] text-[var(--text-lo)]">
                  {img.caption}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {active && active.src && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            ✕
          </button>

          {normalized.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 sm:left-6"
              aria-label="Previous image"
            >
              ‹
            </button>
          )}

          <div
            className="flex max-h-[85vh] max-w-[90vw] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={active.src}
              alt={active.alt}
              className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
            {active.caption && (
              <p className="mt-3 max-w-xl text-center text-sm text-white/80">{active.caption}</p>
            )}
            {normalized.length > 1 && (
              <p className="mt-2 text-xs text-white/50">
                {activeIdx! + 1} / {normalized.length}
              </p>
            )}
          </div>

          {normalized.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 sm:right-6"
              aria-label="Next image"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
