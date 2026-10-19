const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a public path. next/link adds the base path. An unoptimized next/image does not, so photos go through here. */
export function asset(path: string) {
  return `${basePath}${path}`;
}
