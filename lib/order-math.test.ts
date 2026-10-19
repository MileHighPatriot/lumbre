import { describe, expect, it } from "vitest";
import { groupById } from "@/data/modifiers";
import { menu, menuById } from "@/data/menu";
import { TACO_BUNDLE_PRICE } from "@/data/promos";
import { photos } from "@/data/photos";
import { DELIVERY_MIN, hours } from "@/data/site";
import { zonedTime } from "@/lib/denver";
import { money, parseDollars, phoneDigits, toMinutes } from "@/lib/format";
import { buildOrder, orderCode } from "@/lib/order";
import { banner, promoState } from "@/lib/promos";
import { slots } from "@/lib/slots";
import { quote, taxCents, type CartLine } from "@/lib/ticket";
import { checkoutErrors } from "@/lib/validate";

const tue = { day: 2, minutes: 18 * 60, ymd: "2026-10-20" };
const thuNight = { day: 4, minutes: 17 * 60, ymd: "2026-10-22" };
const wed = { day: 3, minutes: 17 * 60, ymd: "2026-10-21" };
const friAfternoon = { day: 5, minutes: 16 * 60, ymd: "2026-10-23" };
const friNight = { day: 5, minutes: 19 * 60, ymd: "2026-10-23" };

function line(itemId: string, qty = 1, picks: CartLine["picks"] = {}, note = ""): CartLine {
  return { lineId: itemId, itemId, qty, picks, note };
}

function priced(lines: CartLine[], when: typeof tue | null, extra: Partial<Parameters<typeof quote>[0]> = {}) {
  return quote({ lines, when, method: "pickup", zip: "", tip: { kind: "percent", pct: 0 }, code: "", ...extra });
}

describe("menu", () => {
  it("has a full board with unique, priced dishes", () => {
    expect(menu.length).toBeGreaterThanOrEqual(70);
    expect(new Set(menu.map((item) => item.id)).size).toBe(menu.length);
    for (const item of menu) {
      expect(item.price).toBeGreaterThan(0);
      expect(Number.isInteger(item.price)).toBe(true);
      expect(item.description.length).toBeGreaterThan(10);
      for (const groupId of item.groups) expect(groupById[groupId], item.id).toBeTruthy();
      if (item.photo) expect(photos[item.photo]).toBeTruthy();
      if (item.nightPrice != null) expect(item.nightPrice).toBeLessThan(item.price);
      if (item.afternoonPrice != null) expect(item.afternoonPrice).toBeLessThan(item.price);
    }
  });

  it("keeps alcohol in the bar and classic street tacos at one price", () => {
    const classics = menu.filter((item) => item.streetTaco);
    expect(classics).toHaveLength(7);
    expect(classics.every((item) => item.price === 450)).toBe(true);
    expect(menu.filter((item) => item.alcohol).every((item) => item.category === "bar")).toBe(true);
    expect(menu.filter((item) => item.category === "kids").every((item) => !item.alcohol)).toBe(true);
    expect(menu.filter((item) => item.category === "bar").every((item) => item.alcohol)).toBe(true);
  });
});

describe("promos follow the pickup time", () => {
  it("opens and closes each window on the minute", () => {
    const tuesday = hours.find((entry) => entry.day === 2)!;
    expect(promoState({ ...tue, minutes: toMinutes(tuesday.open) }).tacos).toBe(true);
    expect(promoState({ ...tue, minutes: toMinutes(tuesday.close) - 1 }).tacos).toBe(true);
    expect(promoState({ ...tue, minutes: toMinutes(tuesday.close) }).tacos).toBe(false);
    expect(promoState(thuNight).margarita).toBe(true);
    expect(promoState({ ...thuNight, minutes: 16 * 60 }).margarita).toBe(true);
    expect(promoState({ ...thuNight, minutes: 22 * 60 }).margarita).toBe(false);
    expect(promoState({ ...thuNight, minutes: 14 * 60 }).margarita).toBe(false);
    expect(promoState(friAfternoon).afternoon).toBe(true);
    expect(promoState({ ...friAfternoon, minutes: 15 * 60 }).afternoon).toBe(true);
    expect(promoState({ ...friAfternoon, minutes: 18 * 60 }).afternoon).toBe(false);
    expect(promoState({ day: 0, minutes: 16 * 60, ymd: "2026-10-18" }).afternoon).toBe(false);
  });

  it("prices the specials and explains a code that does not qualify", () => {
    expect(priced([line("taco-pastor", 3)], tue).food).toBe(TACO_BUNDLE_PRICE);
    expect(priced([line("taco-pastor", 3)], tue).savings).toBe(250);
    expect(priced([line("taco-pastor", 4)], tue).food).toBe(1550);
    expect(priced([line("taco-pastor", 3)], wed).food).toBe(1350);
    expect(priced([line("taco-camaron", 3)], tue).food).toBe(1725);
    expect(priced([line("taco-plate", 1, { "plate-protein": ["pastor"] })], tue).food).toBe(1650);
    expect(priced([line("taco-pastor", 3, { "taco-finish": ["guac"] })], tue).food).toBe(1550);

    expect(priced([line("margarita-clasica")], thuNight).food).toBe(700);
    expect(priced([line("margarita-clasica")], thuNight).savings).toBe(500);
    expect(priced([line("margarita-clasica")], { ...thuNight, minutes: 14 * 60 }).food).toBe(1200);
    expect(priced([line("margarita-clasica")], wed).food).toBe(1200);

    expect(priced([line("guacamole")], friAfternoon).food).toBe(800);
    expect(priced([line("guacamole")], friNight).food).toBe(1100);
    expect(priced([line("guacamole"), line("taco-pastor", 3)], { ...tue, minutes: 16 * 60 }).food).toBe(800 + 1100);

    const outside = priced([line("taco-pastor", 3)], wed, { code: "tacos" });
    expect(outside.food).toBe(1350);
    expect(outside.code.status).toBe("outside");
    expect(priced([line("taco-pastor", 3)], tue, { code: "TACOS" }).code.status).toBe("applied");
    expect(priced([], tue, { code: "nope" }).code.status).toBe("unknown");
    expect(priced([], null, { code: "margarita" }).code.status).toBe("need-time");
  });

  it("names the special that is on, or the next one", () => {
    expect(banner(tue).text).toContain("Taco Tuesday");
    expect(banner(tue).text).toContain(money(TACO_BUNDLE_PRICE));
    expect(banner(thuNight).text).toContain(money(menuById["margarita-clasica"].nightPrice!));
    expect(banner({ ...thuNight, minutes: 19 * 60 }).text).not.toContain("afternoon");
    expect(banner({ day: 0, minutes: 10 * 60, ymd: "2026-10-18" }).text).toContain("Monday at 3pm");
    expect(banner({ ...thuNight, minutes: 10 * 60 }).text).toContain("today at 3pm");
  });
});

describe("the ticket", () => {
  it("rounds tax in cents and keeps the tip off the tax", () => {
    expect(taxCents(1000)).toBe(92);
    expect(taxCents(2500)).toBe(229);
    expect(taxCents(1100)).toBe(101);
    const bill = quote({
      lines: [line("asada-plate")],
      when: wed,
      method: "delivery",
      zip: "80204",
      tip: { kind: "percent", pct: 18 },
      code: "",
    });
    expect(bill.food).toBe(1950);
    expect(bill.deliveryFee).toBe(450);
    expect(bill.tax).toBe(taxCents(2400));
    expect(bill.tip).toBe(351);
    expect(bill.total).toBe(1950 + 450 + bill.tax + 351);
    expect(quote({ ...{ lines: [line("arroz")], when: wed, method: "delivery", zip: "80205", tip: { kind: "percent", pct: 0 }, code: "" } }).deliveryFee).toBe(0);
  });

  it("blocks a bad checkout and accepts a real one", () => {
    const now = zonedTime("2026-10-20", 12 * 60);
    const available = slots(now);
    const slot = available.find((entry) => entry.ymd === "2026-10-22" && entry.minutes === 17 * 60)!;
    expect(slot.day).toBe(4);
    const margarita = line("margarita-clasica");
    const bill = priced([margarita], slot, { method: "pickup" });
    expect(bill.food).toBe(700);
    const bad = checkoutErrors({
      lines: [margarita],
      name: "",
      phone: "555",
      method: "delivery",
      address: "",
      zip: "99999",
      slot: null,
      age: false,
      quote: bill,
      now,
    });
    expect(bad.map((error) => error.field)).toEqual(expect.arrayContaining(["name", "phone", "slot", "age", "address", "zip"]));

    const small = priced([line("taco-pastor", 3)], available.find((entry) => entry.day === 2)!);
    const minimum = checkoutErrors({
      lines: [line("taco-pastor", 3)],
      name: "Ana",
      phone: "(303) 555-0148",
      method: "delivery",
      address: "10 Example Court",
      zip: "80219",
      slot: available.find((entry) => entry.day === 2)!,
      age: false,
      quote: small,
      now,
    });
    expect(minimum.map((error) => error.field)).toContain("minimum");
    expect(minimum.find((error) => error.field === "minimum")?.message).toContain(money(DELIVERY_MIN - small.food));

    const ready = checkoutErrors({
      lines: [margarita],
      name: "Ana",
      phone: "13035550148",
      method: "pickup",
      address: "",
      zip: "",
      slot,
      age: true,
      quote: bill,
      now,
    });
    expect(ready).toEqual([]);
    expect(phoneDigits("(303) 555-0148")).toHaveLength(10);
    expect(parseDollars("4.50")).toBe(450);
    expect(parseDollars("500.01")).toBeNull();
  });

  it("saves a ticket that matches the quote", () => {
    const now = zonedTime("2026-10-20", 11 * 60);
    const today = slots(now);
    expect(today.find((slot) => slot.ymd === "2026-10-20")?.minutes).toBe(11 * 60 + 30);
    expect(today.filter((slot) => slot.ymd === "2026-10-20").at(-1)?.minutes).toBe(21 * 60);
    const late = slots(zonedTime("2026-10-20", 21 * 60 + 10));
    expect(late.some((slot) => slot.ymd === "2026-10-20")).toBe(false);

    const slot = today.find((entry) => entry.ymd === "2026-10-22" && entry.minutes === 17 * 60)!;
    const lines = [line("margarita-clasica"), line("enchiladas-rojas", 1, { "enchilada-filling": ["queso"] })];
    const bill = priced(lines, slot);
    const saved = buildOrder({
      lines,
      quote: bill,
      method: "pickup",
      name: "Ana",
      phone: "(303) 555-0148",
      address: "",
      zip: "",
      slot,
      placedAt: "2026-10-20T18:00:00.000Z",
    });
    expect(saved.code).toMatch(/^LM-[A-Z0-9]{4}$/);
    expect(saved.total).toBe(bill.total);
    expect(saved.conceptNote).toMatch(/nothing was charged/);
    expect(saved.payNote).toMatch(/window/);
    expect(orderCode("same")).toBe(orderCode("same"));
  });
});
