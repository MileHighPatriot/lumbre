import { menuById, type MenuItem } from "@/data/menu";
import { TACO_BUNDLE_PRICE, TACO_BUNDLE_QTY } from "@/data/promos";
import { DELIVERY_FEE, DELIVERY_ZIPS, salesTaxBps } from "@/data/site";
import type { When } from "@/lib/denver";
import { money } from "@/lib/format";
import { extrasCents, pickDetail, type Picks } from "@/lib/picks";
import { codeResult, promoState, type PromoFlags } from "@/lib/promos";

export type CartLine = {
  lineId: string;
  itemId: string;
  qty: number;
  picks: Picks;
  note: string;
};

export type Tip = { kind: "percent"; pct: number } | { kind: "custom"; cents: number };

export type QuotedLine = {
  lineId: string;
  itemId: string;
  name: string;
  qty: number;
  detail: string;
  unitRegular: number;
  unitCharged: number;
  extras: number;
  amount: number;
  alcohol: boolean;
};

export type Quote = {
  lines: QuotedLine[];
  food: number;
  savings: number;
  savingsNotes: string[];
  deliveryFee: number;
  tax: number;
  tip: number;
  total: number;
  code: ReturnType<typeof codeResult>;
  active: PromoFlags;
  taco: { groups: number; savings: number; classicCount: number; short: number };
};

export function taxCents(cents: number) {
  return Math.round((cents * salesTaxBps) / 10000);
}

export function percentCents(cents: number, pct: number) {
  return Math.round((cents * pct) / 100);
}

export function unitBase(item: MenuItem, flags: PromoFlags) {
  if (flags.margarita && item.nightPrice != null) return item.nightPrice;
  if (flags.afternoon && item.afternoonPrice != null) return item.afternoonPrice;
  return item.price;
}

export function quote(input: {
  lines: CartLine[];
  when: When | null;
  method: "pickup" | "delivery";
  zip: string;
  tip: Tip;
  code: string;
}): Quote {
  const active = input.when ? promoState(input.when) : { margarita: false, tacos: false, afternoon: false };
  const lines: QuotedLine[] = [];
  const units: { base: number; street: boolean }[] = [];
  let nightSavings = 0;
  let afternoonSavings = 0;

  for (const line of input.lines) {
    const item = menuById[line.itemId];
    if (!item || line.qty < 1) continue;
    const qty = Math.min(line.qty, 10);
    const extras = extrasCents(item, line.picks);
    const charged = unitBase(item, active);
    if (active.margarita && item.nightPrice != null) nightSavings += qty * (item.price - item.nightPrice);
    if (active.afternoon && item.afternoonPrice != null) afternoonSavings += qty * (item.price - item.afternoonPrice);
    lines.push({
      lineId: line.lineId,
      itemId: item.id,
      name: item.name,
      qty,
      detail: pickDetail(item, line.picks, line.note),
      unitRegular: item.price,
      unitCharged: charged,
      extras,
      amount: qty * (charged + extras),
      alcohol: Boolean(item.alcohol),
    });
    for (let i = 0; i < qty; i++) units.push({ base: charged, street: Boolean(item.streetTaco) });
  }

  const classics = units.filter((unit) => unit.street).sort((a, b) => a.base - b.base);
  const groups = active.tacos ? Math.floor(classics.length / TACO_BUNDLE_QTY) : 0;
  const bundled = groups * TACO_BUNDLE_QTY;
  const bundleSavings = groups > 0 ? classics.slice(0, bundled).reduce((sum, unit) => sum + unit.base, 0) - groups * TACO_BUNDLE_PRICE : 0;
  const food = lines.reduce((sum, line) => sum + line.amount, 0) - bundleSavings;
  const deliveryFee = input.method === "delivery" && (DELIVERY_ZIPS as readonly string[]).includes(input.zip.trim()) ? DELIVERY_FEE : 0;
  const tax = taxCents(Math.max(0, food) + deliveryFee);
  const tip = input.tip.kind === "custom" ? Math.max(0, input.tip.cents) : percentCents(Math.max(0, food), input.tip.pct);
  const notes: string[] = [];
  if (nightSavings > 0) notes.push("Noche de Margaritas");
  if (afternoonSavings > 0) notes.push("Afternoon board");
  if (groups > 0) notes.push(`Taco Tuesday, ${groups} ${groups === 1 ? "bundle" : "bundles"} of 3 for ${money(TACO_BUNDLE_PRICE)}`);
  const short = !active.tacos || classics.length === 0 ? 0 : (TACO_BUNDLE_QTY - (classics.length % TACO_BUNDLE_QTY)) % TACO_BUNDLE_QTY;

  return {
    lines,
    food,
    savings: nightSavings + afternoonSavings + bundleSavings,
    savingsNotes: notes,
    deliveryFee,
    tax,
    tip,
    total: food + deliveryFee + tax + tip,
    code: codeResult(input.code, input.when),
    active,
    taco: { groups, savings: bundleSavings, classicCount: classics.length, short },
  };
}
