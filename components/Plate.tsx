"use client";

import { useState } from "react";
import Image from "next/image";
import { photos, type PhotoId } from "@/data/photos";
import { asset } from "@/lib/asset";
import { Agave } from "@/components/art";

export default function Plate({
  photo,
  className = "object-cover",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  photo: PhotoId;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="grid h-full w-full place-items-center bg-anil text-maize">
        <Agave className="h-16 w-16" />
      </div>
    );
  }
  return (
    <Image
      src={asset(photos[photo].src)}
      alt={photos[photo].alt}
      fill
      sizes={sizes}
      className={className}
      decoding="async"
      onError={() => setFailed(true)}
      {...(priority ? { priority: true } : { loading: "lazy" as const })}
    />
  );
}
