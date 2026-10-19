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
}: {
  photo: PhotoId;
  className?: string;
  priority?: boolean;
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
      priority={priority}
      sizes="(min-width: 1024px) 40vw, 100vw"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
