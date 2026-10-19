import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap py-20">
      <p className="text-xs uppercase tracking-[0.2em] text-clay-deep">404</p>
      <h1 className="mt-2 text-5xl">That page is not on the menu.</h1>
      <p className="mt-4 max-w-xl text-ink-soft">The link may be old. The menu and the order are both still here.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/menu" className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-bone">Menu</Link>
        <Link href="/" className="inline-flex min-h-12 items-center rounded-full px-6 font-semibold ring-1 ring-inset ring-line">Home</Link>
      </div>
    </div>
  );
}
