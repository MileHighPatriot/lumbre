import Link from "next/link";
import HoursList from "@/components/HoursList";
import OpenChip from "@/components/OpenChip";
import { site } from "@/data/site";

export default function FindUs() {
  return (
    <section aria-labelledby="find-us" className="border-y border-line bg-paper">
      <div className="wrap grid gap-10 py-12 md:grid-cols-3">
        <div>
          <h2 id="find-us" className="text-4xl">Find the kitchen</h2>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-clay-deep">Sample address</p>
          <p className="mt-2 text-lg">{site.address.street}</p>
          <p>{site.address.neighborhood}</p>
          <p>
            {site.address.city}, {site.address.region}
          </p>
          <p className="mt-2 text-sm text-ink-soft">Not a real building. The map opens the Santa Fe Drive neighborhood, not a front door.</p>
          <a href={site.mapsHref} className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-anil px-6 font-semibold text-bone">
            Directions
          </a>
        </div>
        <div>
          <h3 className="text-4xl">Hours</h3>
          <div className="mt-3">
            <OpenChip />
          </div>
          <HoursList className="mt-2 text-sm" />
          <p className="mt-2 text-sm text-ink-soft">Denver time. The last order is 30 minutes before close.</p>
        </div>
        <div>
          <h3 className="text-4xl">Call or order</h3>
          <p className="mt-3 text-sm text-ink-soft">
            {"(303) 555-0148 is a sample number and doesn't reach anyone. This site doesn't book tables, and an order stays on this phone."}
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <a href={site.phoneHref} className="inline-flex min-h-12 items-center justify-center rounded-full bg-clay-deep px-6 font-semibold text-paper">
              Call {site.phone}
            </a>
            <Link href="/order" className="inline-flex min-h-12 items-center justify-center rounded-full px-6 font-semibold ring-1 ring-inset ring-ink">
              Start an order
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
