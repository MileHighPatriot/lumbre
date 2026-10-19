"use client";

import Link from "next/link";
import { denver } from "@/lib/denver";
import { banner } from "@/lib/promos";
import { useNow } from "@/lib/useNow";

export default function PromoBanner() {
  const now = useNow();
  const text = now ? banner(denver(now)) : { href: "/promotions", text: "See what is on this week." };
  return (
    <div className="bg-chile text-bone">
      <div className="wrap flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
        <p>{text.text}</p>
        <Link href={text.href} className="font-semibold underline">Order for that window</Link>
      </div>
    </div>
  );
}
