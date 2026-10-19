"use client";

import { salesTaxLabel } from "@/data/site";
import { money } from "@/lib/format";
import type { SavedOrder } from "@/lib/order";

export default function TicketView({ order, onBack }: { order: SavedOrder; onBack: () => void }) {
  return (
    <article id="ticket" className="mx-auto max-w-xl rounded-2xl bg-paper p-6 ring-1 ring-line sm:p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-clay-deep">Order {order.code}</p>
      <h1 className="mt-2 font-display text-5xl">{order.slotLabel}</h1>
      <p className="mt-3 text-ink-soft">
        {order.method === "pickup" ? "Pickup" : `Delivery to ${order.address}, ${order.zip}`} for {order.name}. {order.phone}
      </p>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {order.lines.map((line, index) => (
          <li key={`${line.name}-${index}`} className="flex justify-between gap-3 py-3">
            <span>
              {line.qty} × {line.name}
              {line.detail && <span className="block text-sm text-ink-soft">{line.detail}</span>}
              {line.unitCharged < line.unitRegular && <span className="block text-sm text-chile">{money(line.unitCharged)} each, was {money(line.unitRegular)}</span>}
            </span>
            <span className="font-semibold">{money(line.amount)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-1 text-sm">
        <Line label="Food" value={money(order.lines.reduce((sum, line) => sum + line.amount, 0))} />
        {order.lines.reduce((sum, line) => sum + line.amount, 0) > order.food && (
          <Line label={order.savingsNotes.find((note) => note.startsWith("Taco")) ?? "Taco Tuesday"} value={`−${money(order.lines.reduce((sum, line) => sum + line.amount, 0) - order.food)}`} />
        )}
        {order.method === "delivery" && <Line label="Delivery" value={money(order.deliveryFee)} />}
        <Line label={salesTaxLabel} value={money(order.tax)} />
        <Line label="Tip" value={money(order.tip)} />
        <div className="flex justify-between pt-2 text-base font-semibold">
          <dt>Total</dt>
          <dd>{money(order.total)}</dd>
        </div>
      </dl>
      <p className="mt-5 font-semibold">{order.payNote}</p>
      <p className="mt-2 text-sm text-ink-soft">{order.conceptNote}</p>
      <div className="no-print mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => window.print()} className="min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-bone">Print ticket</button>
        <button type="button" onClick={onBack} className="min-h-11 rounded-full px-5 text-sm font-semibold ring-1 ring-inset ring-line">Back to the menu</button>
      </div>
    </article>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
