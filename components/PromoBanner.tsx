"use client";

import Link from "next/link";
import { denver } from "@/lib/denver";
import { banner } from "@/lib/promos";
import { useNow } from "@/lib/useNow";

export default function PromoBanner() {
  const now = useNow();
  const text = now ? banner(denver(now)) : { href: "/promotions", text: "See what is on this week." };
  return (
    <Link href={text.href} className="block bg-chile text-bone">
      <span className="wrap flex min-h-11 items-center justify-between gap-3 py-2 text-sm">
        <span>{text.text}</span>
        <span className="shrink-0 font-semibold underline">Order</span>
      </span>
    </Link>
  );
}
