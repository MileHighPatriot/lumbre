import Link from "next/link";
import { menuById, signatureIds } from "@/data/menu";
import { site } from "@/data/site";
import { money } from "@/lib/format";
import { Agave, Papel } from "@/components/art";
import FindUs from "@/components/FindUs";
import OpenChip from "@/components/OpenChip";
import Plate from "@/components/Plate";

export default function Home() {
  return (
    <>
      <section className="grid lg:min-h-[calc(100vh-9rem)] lg:grid-cols-12">
        <div className="relative order-2 aspect-[3/2] lg:order-1 lg:col-span-7 lg:aspect-auto lg:h-full lg:min-h-full">
          <Plate photo="table" priority />
        </div>
        <div className="order-1 flex flex-col justify-between bg-anil px-6 py-8 text-bone sm:py-12 lg:order-2 lg:col-span-5 lg:px-12 lg:py-16">
          <p className="text-xs uppercase tracking-[0.22em] text-maize">Santa Fe Drive, Denver</p>
          <div>
            <h1 className="max-w-xl text-4xl sm:text-6xl lg:text-7xl">Fire, masa, and a long table.</h1>
            <p className="mt-4 max-w-md text-base text-bone/90 sm:mt-6 sm:text-lg">
              Lumbre is a small Mexican kitchen. The salsa is made in the morning, al pastor turns on the trompo, and Thursday night the margaritas get serious.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/order" className="inline-flex min-h-12 items-center justify-center rounded-full bg-clay-deep px-6 font-semibold text-paper">Start an order</Link>
              <a href={site.phoneHref} className="inline-flex min-h-12 items-center justify-center rounded-full px-6 font-semibold ring-1 ring-inset ring-bone">Call {site.phone}</a>
            </div>
            <Link href="/menu" className="mt-4 inline-block font-semibold underline decoration-bone/50 underline-offset-4">Read the menu</Link>
          </div>
          <OpenChip light />
        </div>
      </section>
      <Papel />
      <FindUs />

      <section className="wrap py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-4xl sm:text-5xl">From the board</h2>
          <Link href="/menu" className="text-sm font-semibold underline">Full menu</Link>
        </div>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {signatureIds.map((id) => {
            const item = menuById[id];
            return (
              <li key={id} className="overflow-hidden rounded-2xl bg-paper ring-1 ring-line">
                <div className="relative aspect-[3/2] bg-anil">
                  {item.photo ? <Plate photo={item.photo} /> : <div className="grid h-full place-items-center text-maize"><Agave className="h-16 w-16" /></div>}
                </div>
                <div className="p-4">
                  <h3 className="font-sans text-lg font-semibold tracking-normal">{item.name}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{item.description}</p>
                  <p className="mt-3 font-semibold">{money(item.price)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="bg-paper">
        <div className="wrap grid items-center gap-10 py-16 lg:grid-cols-2">
          <div className="relative aspect-[3/2] overflow-hidden rounded-2xl">
            <Plate photo="kitchen" />
          </div>
          <div>
            <h2 className="text-4xl sm:text-5xl">Cooked for the room, not for a template.</h2>
            <p className="mt-4 text-ink-soft">
              The menu is the one a Denver dining room actually orders from: pastor and birria, enchiladas in four sauces, a mole that is a sauce, fajitas, aguas, and a short bar. The look is newer. The food is not a costume.
            </p>
            <ol className="mt-6 space-y-3 text-sm">
              <li><span className="font-semibold">1. Build the ticket.</span> Heat, fillings, and add-ons change the price before it hits the order.</li>
              <li><span className="font-semibold">2. Pick a window.</span> Tuesday and Thursday prices follow the time you choose, up to a week out.</li>
              <li><span className="font-semibold">3. Pay at the window.</span> Or pay the driver. No card is charged here.</li>
            </ol>
            <Link href="/order" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-bone">Order pickup or delivery</Link>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-6 py-16 md:grid-cols-3">
        <Promo href="/order?promo=margarita" kicker="Thursday, 4–10pm" title="Noche de Margaritas" body="House margaritas drop for the evening. The flight does too." />
        <Promo href="/order?promo=tacos" kicker="Tuesday, all day" title="Three tacos, one price" body="Classic street tacos, any mix, three for $11. Fish, shrimp, and birria stay at menu price." />
        <Promo href="/order?promo=afternoon" kicker="Weekdays, 3–6pm" title="Afternoon board" body="Guacamole, elote, esquites, and the quesos, at a lower price." />
      </section>
    </>
  );
}

function Promo({ href, kicker, title, body }: { href: string; kicker: string; title: string; body: string }) {
  return (
    <Link href={href} className="block rounded-2xl bg-paper p-6 ring-1 ring-line hover:ring-ink">
      <p className="text-xs uppercase tracking-[0.18em] text-clay-deep">{kicker}</p>
      <h3 className="mt-3 text-3xl">{title}</h3>
      <p className="mt-3 text-sm text-ink-soft">{body}</p>
    </Link>
  );
}
