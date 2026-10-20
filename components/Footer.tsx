import Link from "next/link";
import HoursList from "@/components/HoursList";
import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-anil text-bone">
      <div className="wrap grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-4xl">Lumbre</p>
          <p className="mt-3 max-w-xs text-bone/80">A small Mexican kitchen on Santa Fe Drive. Concept site by 5280 Web Solutions. Lumbre is not a real restaurant.</p>
          <p className="mt-4 text-sm text-bone/80">
            Sample address, not a real building.<br />
            {site.address.street}<br />
            {site.address.neighborhood}, {site.address.city}, {site.address.region}
          </p>
          <p className="mt-3"><a className="inline-flex min-h-11 items-center underline" href={site.phoneHref}>Call {site.phone}</a></p>
          <p><a className="underline" href={`mailto:${site.email}`}>{site.email}</a></p>
          <p className="mt-2"><a className="underline" href={site.mapsHref}>Directions to the neighborhood</a></p>
        </div>
        <div>
          <h2 className="font-sans text-sm font-semibold tracking-normal">Hours, Denver time</h2>
          <HoursList className="mt-3 text-sm text-bone/80" />
          <p className="mt-3 text-sm text-bone/80">Last order is 30 minutes before close.</p>
        </div>
        <div className="text-sm">
          <ul>
            <li><Link className="inline-flex min-h-11 items-center underline" href="/menu">Menu</Link></li>
            <li><Link className="inline-flex min-h-11 items-center underline" href="/order">Order</Link></li>
            <li><Link className="inline-flex min-h-11 items-center underline" href="/promotions">Promotions</Link></li>
            <li><Link className="inline-flex min-h-11 items-center underline" href="/visit">Visit</Link></li>
            <li><a className="inline-flex min-h-11 items-center underline" href={site.studio}>5280 Web Solutions</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
