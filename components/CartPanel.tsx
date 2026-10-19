"use client";

import { useMemo, useState } from "react";
import { DELIVERY_FEE, DELIVERY_MIN, DELIVERY_ZIPS, salesTaxLabel } from "@/data/site";
import { TACO_BUNDLE_PRICE } from "@/data/promos";
import { denver } from "@/lib/denver";
import { money, parseDollars } from "@/lib/format";
import { slotById, slots } from "@/lib/slots";
import { quote, type Tip } from "@/lib/ticket";
import { checkoutErrors } from "@/lib/validate";
import { useNow } from "@/lib/useNow";
import { useOrder, type Draft } from "@/components/OrderProvider";

const LIVE = new Set(["minimum", "zip", "cart", "age"]);

export default function CartPanel({ idPrefix = "cart" }: { idPrefix?: string }) {
  const order = useOrder();
  const now = useNow();
  const [attempted, setAttempted] = useState(false);
  const { draft, lines, setDraft, setQty, removeLine, openLine, place } = order;

  const available = useMemo(() => (now ? slots(now) : []), [now]);
  const slot = slotById(available, draft.slotId);
  const when = slot ? { day: slot.day, minutes: slot.minutes, ymd: slot.ymd } : null;
  const tip: Tip = draft.tipChoice === "custom"
    ? { kind: "custom", cents: parseDollars(draft.tipCustom) ?? 0 }
    : { kind: "percent", pct: Number(draft.tipChoice) };
  const bill = quote({ lines, when, method: draft.method, zip: draft.zip, tip, code: draft.code });
  const errors = now
    ? checkoutErrors({
        lines,
        name: draft.name,
        phone: draft.phone,
        method: draft.method,
        address: draft.address,
        zip: draft.zip,
        slot,
        age: draft.age,
        quote: bill,
        now,
      })
    : [];
  const visible = errors.filter((error) => {
    if (attempted) return true;
    if (!LIVE.has(error.field)) return false;
    if (error.field === "zip" && draft.zip.trim().length < 5) return false;
    if (error.field === "age" && !bill.lines.some((line) => line.alcohol)) return false;
    return true;
  });
  const message = (field: string) => visible.find((error) => error.field === field)?.message;
  const days = [...new Map(available.map((entry) => [entry.ymd, entry.dayLabel])).entries()];
  const selectedDay = slot?.ymd ?? days[0]?.[0] ?? "";
  const times = available.filter((entry) => entry.ymd === selectedDay);

  const chooseMethod = (method: Draft["method"]) => {
    setDraft((current) => ({
      ...current,
      method,
      tipChoice: method === "delivery" && !current.tipTouched ? "18" : current.tipChoice,
    }));
  };

  return (
    <div className="rounded-2xl bg-paper p-4 ring-1 ring-line sm:p-5">
      <h2 className="font-display text-3xl">Your order</h2>
      {lines.length === 0 ? (
        <p className="mt-3 text-sm text-ink-soft">The ticket is empty. Add a dish and the price will follow the time you choose.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {bill.lines.map((line) => (
            <li key={line.lineId} className="py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{line.name}</p>
                  {line.detail && <p className="text-sm text-ink-soft">{line.detail}</p>}
                  {line.unitCharged < line.unitRegular && (
                    <p className="text-sm text-chile">
                      {money(line.unitCharged)} <s className="text-ink-soft">{money(line.unitRegular)}</s>
                    </p>
                  )}
                </div>
                <p className="font-semibold">{money(line.amount)}</p>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button type="button" className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-inset ring-line" aria-label={`Decrease quantity of ${line.name}`} onClick={() => setQty(line.lineId, line.qty - 1)}>−</button>
                <span className="w-6 text-center text-sm">{line.qty}</span>
                <button type="button" className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-inset ring-line" aria-label={`Increase quantity of ${line.name}`} onClick={() => setQty(line.lineId, line.qty + 1)}>+</button>
                <button type="button" className="min-h-10 px-2 text-sm underline" onClick={() => openLine(lines.find((item) => item.lineId === line.lineId)!)}>Edit</button>
                <button type="button" className="min-h-10 px-2 text-sm underline" onClick={() => removeLine(line.lineId)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {bill.taco.short > 0 && (
        <p className="mt-3 text-sm text-chile">Add {bill.taco.short} more classic street {bill.taco.short === 1 ? "taco" : "tacos"} to reach the {money(TACO_BUNDLE_PRICE)} Tuesday bundle.</p>
      )}

      <label className="mt-4 block text-sm font-semibold">
        Promo code
        <input value={draft.code} onChange={(event) => setDraft({ code: event.target.value })} className="mt-1 w-full rounded-xl border border-line bg-bone px-3 py-2 font-normal uppercase" />
      </label>
      {bill.code.message && <p className={`mt-2 text-sm ${bill.code.status === "applied" ? "text-sage" : "text-ink-soft"}`}>{bill.code.message}</p>}
      {when && bill.active.margarita && <p className="mt-2 text-sm text-sage">Noche de Margaritas is on for this time.</p>}
      {when && bill.active.tacos && <p className="mt-2 text-sm text-sage">Taco Tuesday is on for this time.</p>}
      {when && bill.active.afternoon && <p className="mt-2 text-sm text-sage">The afternoon board is on for this time.</p>}
      {!when && <p className="mt-2 text-sm text-ink-soft">Pick a time to price Thursday and Tuesday specials. They follow the window, not the moment you tap.</p>}

      <dl className="mt-4 space-y-1 text-sm">
        <Row label="Food" value={money(bill.lines.reduce((sum, line) => sum + line.amount, 0))} />
        {bill.taco.savings > 0 && <Row label={bill.savingsNotes.find((note) => note.startsWith("Taco")) ?? "Taco Tuesday"} value={`−${money(bill.taco.savings)}`} />}
        {draft.method === "delivery" && <Row label="Delivery" value={bill.deliveryFee ? money(bill.deliveryFee) : "—"} />}
        <Row label={salesTaxLabel} value={money(bill.tax)} />
        <Row label="Tip, on food" value={money(bill.tip)} />
        <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
          <dt>Total</dt>
          <dd>{money(bill.total)}</dd>
        </div>
      </dl>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold">How to get it</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(["pickup", "delivery"] as const).map((method) => (
            <button key={method} type="button" aria-pressed={draft.method === method} onClick={() => chooseMethod(method)} className="min-h-11 rounded-full capitalize ring-1 ring-inset ring-line aria-pressed:bg-anil aria-pressed:text-bone">
              {method}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-4">
        <legend className="text-sm font-semibold">Time, next seven days</legend>
        {!now && <p className="mt-2 text-sm text-ink-soft">Loading today’s windows…</p>}
        {now && days.length === 0 && <p className="mt-2 text-sm">The kitchen is done for tonight, and the next week is closed. Check the hours.</p>}
        {now && denver(now) && available.some((entry) => entry.ymd === denver(now).ymd) === false && days.length > 0 && (
          <p className="mt-2 text-sm text-ink-soft">The kitchen is done for tonight. The next window is {days[0][1]}.</p>
        )}
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {days.map(([ymd, label]) => (
            <button
              key={ymd}
              type="button"
              aria-pressed={selectedDay === ymd}
              onClick={() => {
                const first = available.find((entry) => entry.ymd === ymd);
                if (first) setDraft({ slotId: first.id });
              }}
              className="min-h-11 shrink-0 rounded-full px-3 text-sm ring-1 ring-inset ring-line aria-pressed:bg-ink aria-pressed:text-bone"
            >
              {label}
            </button>
          ))}
        </div>
        <label className="mt-3 block text-sm font-semibold">
          Window
          <select
            id={`${idPrefix}-slot`}
            value={slot && slot.ymd === selectedDay ? slot.id : ""}
            onChange={(event) => setDraft({ slotId: event.target.value })}
            className="mt-1 w-full rounded-xl border border-line bg-bone px-3 py-2 font-normal"
          >
            <option value="">Choose a time</option>
            {times.map((entry) => (
              <option key={entry.id} value={entry.id}>{entry.timeLabel}</option>
            ))}
          </select>
        </label>
        {message("slot") && <p className="mt-1 text-sm text-chile">{message("slot")}</p>}
      </fieldset>

      {draft.method === "delivery" && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-ink-soft">Delivery is {money(DELIVERY_FEE)} inside {DELIVERY_ZIPS.join(", ")}. The food minimum is {money(DELIVERY_MIN)}.</p>
          <Field id={`${idPrefix}-address`} label="Street address" value={draft.address} autoComplete="street-address" error={message("address")} onChange={(address) => setDraft({ address })} />
          <Field id={`${idPrefix}-zip`} label="ZIP code" value={draft.zip} autoComplete="postal-code" error={message("zip")} onChange={(zip) => setDraft({ zip })} />
          {message("minimum") && <p className="text-sm text-chile">{message("minimum")}</p>}
        </div>
      )}

      <div className="mt-4 space-y-3">
        <Field id={`${idPrefix}-name`} label="Name" value={draft.name} autoComplete="name" error={message("name")} onChange={(name) => setDraft({ name })} />
        <Field id={`${idPrefix}-phone`} label="Phone" value={draft.phone} autoComplete="tel" error={message("phone")} onChange={(phone) => setDraft({ phone })} />
      </div>

      <fieldset className="mt-4">
        <legend className="text-sm font-semibold">Tip, on the food</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["0", "15", "18", "20", "custom"] as const).map((choice) => (
            <button
              key={choice}
              type="button"
              aria-pressed={draft.tipChoice === choice}
              onClick={() => setDraft({ tipChoice: choice, tipTouched: true })}
              className="min-h-11 rounded-full px-3 text-sm ring-1 ring-inset ring-line aria-pressed:bg-anil aria-pressed:text-bone"
            >
              {choice === "0" ? "No tip" : choice === "custom" ? "Custom" : `${choice}%`}
            </button>
          ))}
        </div>
        {draft.tipChoice === "custom" && (
          <label className="mt-2 block text-sm">
            Dollars
            <input value={draft.tipCustom} inputMode="decimal" onChange={(event) => setDraft({ tipCustom: event.target.value, tipTouched: true })} className="mt-1 w-full rounded-xl border border-line bg-bone px-3 py-2" />
          </label>
        )}
        {message("tip") && <p className="mt-1 text-sm text-chile">{message("tip")}</p>}
      </fieldset>

      {bill.lines.some((line) => line.alcohol) && (
        <label className="mt-4 flex items-start gap-3 text-sm">
          <input id={`${idPrefix}-age`} type="checkbox" className="mt-1 h-5 w-5" checked={draft.age} onChange={(event) => setDraft({ age: event.target.checked })} />
          <span>I am 21 or older. An ID is checked at pickup. This box does not verify an ID.</span>
        </label>
      )}
      {message("age") && <p className="mt-1 text-sm text-chile">{message("age")}</p>}
      {message("cart") && <p className="mt-3 text-sm text-chile">{message("cart")}</p>}

      {attempted && visible.length > 0 && (
        <div role="alert" className="mt-4 rounded-xl bg-bone p-3 text-sm text-chile">
          <p className="font-semibold">The order is not placed yet.</p>
          <ul className="mt-1 list-disc pl-5">
            {visible.map((error) => <li key={`${error.field}-${error.message}`}>{error.message}</li>)}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          if (!now) return;
          setAttempted(true);
          const result = place(now);
          if (!result.ok) return;
          setAttempted(false);
        }}
        className="mt-5 min-h-12 w-full rounded-full bg-clay font-semibold text-paper"
      >
        Place order · {money(bill.total)}
      </button>
      <p className="mt-3 text-xs text-ink-soft">Pay at the window, or pay the driver. This site does not charge a card. Nothing is sent to a kitchen.</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Field({ id, label, value, onChange, error, autoComplete }: { id: string; label: string; value: string; onChange: (value: string) => void; error?: string; autoComplete: string }) {
  return (
    <label className="block text-sm font-semibold" htmlFor={id}>
      {label}
      <input id={id} value={value} autoComplete={autoComplete} aria-invalid={Boolean(error)} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-xl border border-line bg-bone px-3 py-2 font-normal" />
      {error && <span className="mt-1 block font-normal text-chile">{error}</span>}
    </label>
  );
}
