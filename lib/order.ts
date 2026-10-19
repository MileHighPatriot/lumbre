import { CONCEPT_NOTE, DELIVERY_PAY, PICKUP_PAY } from "@/data/site";
import type { Slot } from "@/lib/slots";
import type { CartLine, Quote } from "@/lib/ticket";

export type SavedLine = { name: string; qty: number; detail: string; amount: number; unitRegular: number; unitCharged: number };

export type SavedOrder = {
  id: string;
  code: string;
  placedAt: string;
  method: "pickup" | "delivery";
  name: string;
  phone: string;
  address: string;
  zip: string;
  slotLabel: string;
  lines: SavedLine[];
  savings: number;
  savingsNotes: string[];
  food: number;
  deliveryFee: number;
  tax: number;
  tip: number;
  total: number;
  payNote: string;
  conceptNote: string;
};

export function orderCode(seed: string) {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `LM-${(hash >>> 0).toString(36).toUpperCase().padStart(4, "0").slice(-4)}`;
}

export function buildOrder(input: {
  lines: CartLine[];
  quote: Quote;
  method: "pickup" | "delivery";
  name: string;
  phone: string;
  address: string;
  zip: string;
  slot: Slot;
  placedAt: string;
}): SavedOrder {
  const seed = `${input.name}|${input.quote.total}|${input.placedAt}|${input.lines.length}`;
  return {
    id: `${input.placedAt}-${orderCode(seed)}`,
    code: orderCode(seed),
    placedAt: input.placedAt,
    method: input.method,
    name: input.name.trim(),
    phone: input.phone.trim(),
    address: input.method === "delivery" ? input.address.trim() : "",
    zip: input.method === "delivery" ? input.zip.trim() : "",
    slotLabel: input.slot.label,
    lines: input.quote.lines.map((line) => ({
      name: line.name,
      qty: line.qty,
      detail: line.detail,
      amount: line.amount,
      unitRegular: line.unitRegular,
      unitCharged: line.unitCharged,
    })),
    savings: input.quote.savings,
    savingsNotes: input.quote.savingsNotes,
    food: input.quote.food,
    deliveryFee: input.quote.deliveryFee,
    tax: input.quote.tax,
    tip: input.quote.tip,
    total: input.quote.total,
    payNote: input.method === "delivery" ? DELIVERY_PAY : PICKUP_PAY,
    conceptNote: CONCEPT_NOTE,
  };
}
