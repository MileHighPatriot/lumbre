import type { Metadata } from "next";
import HoursList from "@/components/HoursList";
import OpenChip from "@/components/OpenChip";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Visit",
  description: "Hours and the Santa Fe Drive neighborhood for Lumbre, a concept Mexican kitchen in Denver.",
};

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
          <HoursList className="mt-4 divide-y divide-line" />
        </section>
        <section className="rounded-2xl bg-paper p-6 ring-1 ring-line">
          <h2 className="text-3xl">Getting here</h2>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-clay-deep">Sample address</p>
          <p className="mt-2 text-lg">{site.address.street}</p>
          <p>{site.address.neighborhood}, {site.address.city}, {site.address.region}</p>
          <p className="mt-3">Street parking along Santa Fe Drive and the side streets. Alameda Station is the closest light-rail stop to this stretch of the drive.</p>
          <p className="mt-3 text-sm text-ink-soft">The street is made up. The map opens the neighborhood, not a front door. Call the sample number to ask about a table. Nothing is booked on this site.</p>
          <div className="mt-6 flex flex-col gap-3">
            <a href={site.phoneHref} className="inline-flex min-h-12 items-center justify-center rounded-full bg-clay-deep px-6 font-semibold text-paper">Call {site.phone}</a>
            <a href={site.mapsHref} className="inline-flex min-h-12 items-center justify-center rounded-full bg-anil px-6 font-semibold text-bone">Directions</a>
          </div>
          <p className="mt-4">Email <a className="underline" href={`mailto:${site.email}`}>{site.email}</a></p>
        </section>
      </div>
    </div>
  );
}
