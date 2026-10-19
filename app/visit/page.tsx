import type { Metadata } from "next";
import { hours, site } from "@/data/site";
import { dayNames, formatMinutes, toMinutes } from "@/lib/format";
import OpenChip from "@/components/OpenChip";

export const metadata: Metadata = {
  title: "Visit",
  description: "Hours and the Santa Fe Drive neighborhood for Lumbre, a concept Mexican kitchen in Denver.",
};

const order = [1, 2, 3, 4, 5, 6, 0];

export default function VisitPage() {
  return (
    <div className="wrap py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-clay-deep">{site.address.neighborhood}</p>
      <h1 className="mt-2 max-w-3xl text-5xl sm:text-6xl">Come in, or send an order out.</h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        The kitchen is on Santa Fe Drive in Denver. This page is a concept, so the street address is fictional and the map opens the neighborhood rather than a front door.
      </p>
      <OpenChip />

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="text-3xl">Hours</h2>
          <p className="mt-2 text-sm text-ink-soft">Denver time. The last order window is 30 minutes before close.</p>
          <ul className="mt-4 divide-y divide-line">
            {order.map((day) => {
              const row = hours.find((entry) => entry.day === day)!;
              return (
                <li key={day} className="flex justify-between py-2">
                  <span>{dayNames[day]}</span>
                  <span>{formatMinutes(toMinutes(row.open))} – {formatMinutes(toMinutes(row.close))}</span>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="rounded-2xl bg-paper p-6 ring-1 ring-line">
          <h2 className="text-3xl">Getting here</h2>
          <p className="mt-3">Street parking along Santa Fe Drive and the side streets. Alameda Station is the closest light-rail stop to this stretch of the drive.</p>
          <p className="mt-3">Phone <a className="underline" href={site.phoneHref}>{site.phone}</a></p>
          <p>Email <a className="underline" href={`mailto:${site.email}`}>{site.email}</a></p>
          <a href={site.mapsHref} className="mt-6 inline-flex min-h-12 items-center rounded-full bg-anil px-6 font-semibold text-bone">Map of the neighborhood</a>
          <p className="mt-4 text-sm text-ink-soft">The printed concept address is {site.address.street}. It is not a real building.</p>
        </section>
      </div>
    </div>
  );
}
