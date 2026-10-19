/**
 * Single edit point for the concept restaurant.
 * The phone uses the 555-01xx fiction range. The street is made up.
 * Maps links search the neighborhood, not this street, so they never
 * land on a real front door.
 *
 * salesTaxBps is Denver's combined prepared-food rate as of September 2026:
 * Colorado 2.90 + Denver 5.15 + RTD/SCFD 1.10 = 9.15%.
 */
export const site = {
  name: "Lumbre",
  url: "https://milehighpatriot.github.io/lumbre",
  description:
    "A small Mexican kitchen on Santa Fe Drive in Denver. Order for pickup or delivery, with Thursday margarita night and Tuesday street tacos priced on the ticket.",
  locale: "en_US",
  phone: "(303) 555-0148",
  phoneHref: "tel:+13035550148",
  email: "hello@lumbre.example",
  address: {
    street: "1840 Example Court",
    city: "Denver",
    region: "CO",
    neighborhood: "Santa Fe Drive",
  },
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Santa Fe Drive, Denver, CO"),
  studio: "https://5280webs.com",
};

export const hours: { day: number; open: string; close: string }[] = [
  { day: 0, open: "11:00", close: "21:00" },
  { day: 1, open: "11:00", close: "21:30" },
  { day: 2, open: "11:00", close: "21:30" },
  { day: 3, open: "11:00", close: "21:30" },
  { day: 4, open: "11:00", close: "21:30" },
  { day: 5, open: "11:00", close: "22:00" },
  { day: 6, open: "11:00", close: "22:00" },
];

/** Basis points. 915 = 9.15%. Tip is not taxed. Delivery fee is. */
export const salesTaxBps = 915;
export const salesTaxLabel = "Denver prepared-food tax (9.15%)";

export const DELIVERY_ZIPS = ["80204", "80219", "80223", "80236"] as const;
export const DELIVERY_MIN = 2500;
export const DELIVERY_FEE = 450;

export const PICKUP_LEAD_MIN = 25;
export const SLOT_MINUTES = 15;
export const LAST_CALL_MIN = 30;
export const ORDER_DAYS = 7;

export const PICKUP_PAY = "Pay at the window when you pick up.";
export const DELIVERY_PAY = "Pay the driver when the order arrives. We don't charge a card on this site.";
export const CONCEPT_NOTE = "Concept site: nothing was sent to a kitchen and nothing was charged.";

export const fullNeighborhood = `${site.address.neighborhood}, ${site.address.city}, ${site.address.region}`;
