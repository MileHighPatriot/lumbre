import { menu, menuById } from "@/data/menu";
import { afternoonWindow, margaritaWindow, PROMO_CODES, TACO_BUNDLE_PRICE, type PromoId } from "@/data/promos";
import { hours } from "@/data/site";
import type { When } from "@/lib/denver";
import { dayNames, formatMinutes, money, toMinutes } from "@/lib/format";

export type PromoFlags = { margarita: boolean; tacos: boolean; afternoon: boolean };

function tacoBounds() {
  const tuesday = hours.find((entry) => entry.day === 2)!;
  return { start: toMinutes(tuesday.open), end: toMinutes(tuesday.close) };
}

export function promoState(when: When): PromoFlags {
  const tacos = tacoBounds();
  return {
    tacos: when.day === 2 && when.minutes >= tacos.start && when.minutes < tacos.end,
    margarita:
      margaritaWindow.days.includes(when.day) &&
      when.minutes >= margaritaWindow.start &&
      when.minutes < margaritaWindow.end,
    afternoon:
      afternoonWindow.days.includes(when.day) &&
      when.minutes >= afternoonWindow.start &&
      when.minutes < afternoonWindow.end,
  };
}

export type CodeStatus = "empty" | "applied" | "outside" | "unknown" | "need-time";

export function codeResult(raw: string, when: When | null): { status: CodeStatus; message: string } {
  const code = raw.trim().toUpperCase();
  if (!code) return { status: "empty", message: "" };
  const id = PROMO_CODES[code as keyof typeof PROMO_CODES];
  if (!id) return { status: "unknown", message: "That code isn't one of ours." };
  if (!when) {
    if (id === "margarita") return { status: "need-time", message: "Choose a time first. MARGARITA applies Thursday, 4–10pm." };
    if (id === "tacos") return { status: "need-time", message: "Choose a time first. TACOS applies while the kitchen is open on Tuesday." };
    return { status: "need-time", message: "Choose a time first. TARDE applies Monday through Friday, 3–6pm." };
  }
  if (!promoState(when)[id]) {
    const label = `${dayNames[when.day]} at ${formatMinutes(when.minutes)}`;
    if (id === "margarita") {
      return { status: "outside", message: `Noche de Margaritas is Thursday, 4–10pm. This order is for ${label}, so the margaritas stay at the regular price.` };
    }
    if (id === "tacos") {
      return { status: "outside", message: `Taco Tuesday runs while the kitchen is open on Tuesday. This order is for ${label}, so the tacos stay at the regular price.` };
    }
    return { status: "outside", message: `The afternoon board runs Monday through Friday, 3–6pm. This order is for ${label}, so those prices stay regular.` };
  }
  if (id === "margarita") return { status: "applied", message: "Noche de Margaritas is on this ticket." };
  if (id === "tacos") return { status: "applied", message: "Taco Tuesday is on this ticket." };
  return { status: "applied", message: "The afternoon board is on this ticket." };
}

function windowFor(id: PromoId, day: number) {
  if (id === "tacos") return day === 2 ? tacoBounds() : null;
  if (id === "margarita") return margaritaWindow.days.includes(day) ? margaritaWindow : null;
  return afternoonWindow.days.includes(day) ? afternoonWindow : null;
}

export function banner(when: When): { href: string; text: string } {
  const flags = promoState(when);
  const nightFrom = Math.min(...menu.filter((item) => item.nightPrice != null).map((item) => item.nightPrice!));
  if (flags.margarita && flags.afternoon) {
    return {
      href: "/order?promo=margarita",
      text: `Thursday specials are on: house margaritas from ${money(nightFrom)}, and the afternoon board until 6pm.`,
    };
  }
  if (flags.margarita) {
    return { href: "/order?promo=margarita", text: `Noche de Margaritas is on. House margaritas start at ${money(nightFrom)} until 10pm.` };
  }
  if (flags.tacos && flags.afternoon) {
    return {
      href: "/order?promo=tacos",
      text: `Taco Tuesday is on: three classic street tacos for ${money(TACO_BUNDLE_PRICE)}. The afternoon board runs until 6pm.`,
    };
  }
  if (flags.tacos) {
    return { href: "/order?promo=tacos", text: `Taco Tuesday is on. Three classic street tacos are ${money(TACO_BUNDLE_PRICE)}.` };
  }
  if (flags.afternoon) {
    return { href: "/order?promo=afternoon", text: "The afternoon board is on until 6pm. Guacamole, elote, and a few other antojitos are reduced." };
  }

  let best: { id: PromoId; offset: number; start: number } | null = null;
  for (const id of ["afternoon", "tacos", "margarita"] as const) {
    for (let offset = 0; offset < 8; offset++) {
      const bounds = windowFor(id, (when.day + offset) % 7);
      if (!bounds) continue;
      if (offset === 0 && when.minutes >= bounds.start) continue;
      if (!best || offset < best.offset || (offset === best.offset && bounds.start < best.start)) {
        best = { id, offset, start: bounds.start };
      }
      break;
    }
  }
  if (!best) return { href: "/promotions", text: "See this week's specials." };
  const day = (when.day + best.offset) % 7;
  const whenText = best.offset === 0 ? `today at ${formatMinutes(best.start)}` : `${dayNames[day]} at ${formatMinutes(best.start)}`;
  if (best.id === "margarita") return { href: "/promotions", text: `Next up: Noche de Margaritas, ${whenText}.` };
  if (best.id === "tacos") return { href: "/promotions", text: `Next up: Taco Tuesday, ${whenText}. Three classic street tacos for ${money(TACO_BUNDLE_PRICE)}.` };
  return { href: "/promotions", text: `Next up: the afternoon board, ${whenText}.` };
}

export function nightPriceOf(id: string) {
  return menuById[id]?.nightPrice ?? null;
}
