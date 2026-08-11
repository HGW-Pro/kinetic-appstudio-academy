"use client";

export type LessonImage = {
  url: string;
  caption: string;
};

export default function ImageGallery({ images }: { images: LessonImage[] }) {
  return (
    <div className="my-5 grid gap-4 sm:grid-cols-2">
      {images.map((img, i) => (
        <figure
          key={i}
          className="overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] shadow-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt={img.caption}
            className="w-full border-b border-[var(--border)] object-contain"
            loading="lazy"
          />
          <figcaption className="px-3 py-2 text-xs text-[var(--text-mid)]">{img.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
