import type { Metadata } from "next";
import Link from "next/link";
import { menu } from "@/data/menu";
import { TACO_BUNDLE_PRICE } from "@/data/promos";
import { money } from "@/lib/format";
import Plate from "@/components/Plate";

export const metadata: Metadata = {
  title: "Promotions",
  description: "Noche de Margaritas on Thursday, Taco Tuesday, and a weekday afternoon board. The prices are the ones on the ticket.",
};

export default function PromotionsPage() {
  const night = menu.filter((item) => item.nightPrice != null);
  const afternoon = menu.filter((item) => item.afternoonPrice != null);
  const classics = menu.filter((item) => item.streetTaco);
  return (
    <div className="wrap py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-clay-deep">This week</p>
      <h1 className="mt-2 max-w-3xl text-5xl sm:text-6xl">Specials that change the bill.</h1>
      <p className="mt-4 max-w-2xl text-ink-soft">A deal follows the pickup or delivery time. Order on Monday for Thursday night and the margarita is the Thursday price. A code does the same thing, and it tells you when the window does not match.</p>

      <article className="mt-12 grid items-center gap-8 lg:grid-cols-2">
        <div className="relative aspect-[3/2] overflow-hidden rounded-2xl">
          <Plate photo="margarita" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-clay-deep">Thursday, 4–10pm · code MARGARITA</p>
          <h2 className="mt-2 text-4xl">Noche de Margaritas</h2>
          <p className="mt-3 text-ink-soft">House margaritas and the flight. The rest of the bar stays at the menu price. You confirm you are 21 or older, and an ID is checked at pickup.</p>
          <ul className="mt-4 space-y-1 text-sm">
            {night.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span>{item.name}</span>
                <span>{money(item.nightPrice!)} <s className="text-ink-soft">{money(item.price)}</s></span>
              </li>
            ))}
          </ul>
          <Link href="/order?promo=margarita" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-clay px-6 font-semibold text-paper">Order for Thursday</Link>
        </div>
      </article>

      <article className="mt-16 grid items-center gap-8 lg:grid-cols-2">
        <div className="lg:order-2 relative aspect-[3/2] overflow-hidden rounded-2xl">
          <Plate photo="pastor" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-clay-deep">Tuesday, while the kitchen is open · code TACOS</p>
          <h2 className="mt-2 text-4xl">Three street tacos, {money(TACO_BUNDLE_PRICE)}</h2>
          <p className="mt-3 text-ink-soft">Any mix of the classic street tacos. A fourth rings at the regular price. Add-ons, like guacamole, stay extra. Fish, shrimp, and birria are not in the bundle.</p>
          <ul className="mt-4 space-y-1 text-sm">
            {classics.map((item) => (
              <li key={item.id}>{item.name} · {money(item.price)} each</li>
            ))}
          </ul>
          <Link href="/order?promo=tacos" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-bone">Order for Tuesday</Link>
        </div>
      </article>

      <article className="mt-16">
        <p className="text-xs uppercase tracking-[0.18em] text-clay-deep">Monday–Friday, 3–6pm · code TARDE</p>
        <h2 className="mt-2 text-4xl">Afternoon board</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">A short list of antojitos. It can overlap Taco Tuesday and the start of margarita night. Each dish takes its own special.</p>
        <ul className="mt-4 max-w-md space-y-1 text-sm">
          {afternoon.map((item) => (
            <li key={item.id} className="flex justify-between gap-3">
              <span>{item.name}</span>
              <span>{money(item.afternoonPrice!)} <s className="text-ink-soft">{money(item.price)}</s></span>
            </li>
          ))}
        </ul>
        <Link href="/order?promo=afternoon" className="mt-6 inline-flex min-h-12 items-center rounded-full px-6 font-semibold ring-1 ring-inset ring-ink">Order for the afternoon</Link>
      </article>
    </div>
  );
}
