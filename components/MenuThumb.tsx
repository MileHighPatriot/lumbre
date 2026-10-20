import { photos, type PhotoId } from "@/data/photos";
import { asset } from "@/lib/asset";

/** Menu rows are 76px, or 120px from the sm breakpoint. next/image is unoptimized, so it would still fetch the full frame. */
export default function MenuThumb({ photo }: { photo: PhotoId }) {
  const small = asset(`/photos/thumbs/${photo}-160.webp`);
  const large = asset(`/photos/thumbs/${photo}-240.webp`);
  return (
    // The site exports static files with images.unoptimized, so next/image drops srcSet.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={small}
      srcSet={`${small} 160w, ${large} 240w`}
      sizes="(min-width: 640px) 120px, 76px"
      alt={photos[photo].alt}
      width={160}
      height={160}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
