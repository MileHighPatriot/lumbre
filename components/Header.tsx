"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Agave } from "@/components/art";
import { useOrder } from "@/components/OrderProvider";

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
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl tracking-normal">
          <Agave className="h-7 w-7 text-clay" />
          Lumbre
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-5 text-sm font-medium md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={path === link.href ? "page" : undefined} className="aria-[current=page]:underline">
              {link.label}
            </Link>
          ))}
        </nav>
        <button type="button" onClick={openCart} className="min-h-11 rounded-full bg-ink px-4 text-sm font-semibold text-bone">
          Order{count > 0 ? ` · ${count}` : ""}
          <span className="sr-only" aria-live="polite">{count === 0 ? "Your order is empty" : `${count} items in your order`}</span>
        </button>
      </div>
      <nav aria-label="Primary mobile" className="wrap flex gap-4 overflow-x-auto pb-2 text-sm md:hidden">
        {links.map((link) => (
          <Link key={link.href} href={link.href} aria-current={path === link.href ? "page" : undefined} className="shrink-0 py-1 aria-[current=page]:underline">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
