"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  alt,
}: {
  images: Array<{ url: string; alt: string | null }>;
  alt: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-xl border border-border bg-surface" />
    );
  }

  const main = images[active];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-surface/40">
        <Image
          src={main.url}
          alt={main.alt ?? alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border-2 transition-colors",
                i === active ? "border-blue-600" : "border-border hover:border-muted"
              )}
              aria-label={`Изображение ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt ?? alt}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
