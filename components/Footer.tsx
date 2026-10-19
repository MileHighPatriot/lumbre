import Link from "next/link";
import { hours, site } from "@/data/site";
import { dayNames, formatMinutes, toMinutes } from "@/lib/format";

const order = [1, 2, 3, 4, 5, 6, 0];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-anil text-bone">
      <div className="wrap grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-4xl">Lumbre</p>
          <p className="mt-3 max-w-xs text-bone/80">A small Mexican kitchen on Santa Fe Drive. Concept site by 5280 Web Solutions. Lumbre is not a real restaurant.</p>
          <p className="mt-4"><a className="underline" href={site.phoneHref}>{site.phone}</a></p>
          <p><a className="underline" href={`mailto:${site.email}`}>{site.email}</a></p>
        </div>
        <div>
          <h2 className="font-sans text-sm font-semibold tracking-normal">Hours, Denver time</h2>
          <ul className="mt-3 space-y-1 text-sm text-bone/80">
            {order.map((day) => {
              const row = hours.find((entry) => entry.day === day)!;
              return (
                <li key={day} className="flex justify-between gap-6">
                  <span>{dayNames[day]}</span>
                  <span>{formatMinutes(toMinutes(row.open))} – {formatMinutes(toMinutes(row.close))}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-sm text-bone/70">Last order is 30 minutes before close.</p>
        </div>
        <div className="text-sm">
          <ul className="space-y-2">
            <li><Link className="underline" href="/menu">Menu</Link></li>
            <li><Link className="underline" href="/order">Order</Link></li>
            <li><Link className="underline" href="/promotions">Promotions</Link></li>
            <li><Link className="underline" href="/visit">Visit</Link></li>
            <li><a className="underline" href={site.studio}>5280 Web Solutions</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
