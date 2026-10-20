"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOrder } from "@/components/OrderProvider";
import { Wordmark } from "@/components/Wordmark";
import { site } from "@/data/site";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Order" },
  { href: "/promotions", label: "Promotions" },
  { href: "/visit", label: "Visit" },
];

function bare(path: string) {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

export default function Header() {
  const path = bare(usePathname() || "/");
  const { count, openCart } = useOrder();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bone/95 backdrop-blur">
      <div className="wrap flex flex-col gap-2 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-4">
        <Link href="/" aria-label="Lumbre home" className="block w-full max-w-[22rem] shrink-0">
          <Wordmark className="h-auto w-full" />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col gap-1 lg:items-end">
          <nav aria-label="Primary" className="hidden items-center gap-5 text-sm font-medium lg:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} aria-current={path === link.href ? "page" : undefined} className="aria-[current=page]:underline">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-between gap-2 lg:justify-end">
            <nav aria-label="Primary mobile" className="flex min-w-0 gap-1 overflow-x-auto text-sm lg:hidden">
              {links.map((link) => (
                <Link key={link.href} href={link.href} aria-current={path === link.href ? "page" : undefined} className="inline-flex min-h-11 shrink-0 items-center px-2 aria-[current=page]:underline">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-2">
              <a href={site.phoneHref} className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold ring-1 ring-inset ring-ink lg:hidden">
                Call<span className="sr-only"> {site.phone}</span>
              </a>
              <a href={site.phoneHref} className="hidden text-sm font-semibold lg:inline">{site.phone}</a>
              <button type="button" onClick={openCart} className="min-h-11 rounded-full bg-ink px-4 text-sm font-semibold text-bone">
                Order{count > 0 ? ` · ${count}` : ""}
                <span className="sr-only" aria-live="polite">{count === 0 ? "Your order is empty" : `${count} items in your order`}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
