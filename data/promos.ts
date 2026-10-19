/** Windows are minutes from midnight, end exclusive. Taco Tuesday follows Tuesday's open hours. */
export const margaritaWindow = { days: [4], start: 16 * 60, end: 22 * 60 };
export const afternoonWindow = { days: [1, 2, 3, 4, 5], start: 15 * 60, end: 18 * 60 };

export const TACO_BUNDLE_QTY = 3;
export const TACO_BUNDLE_PRICE = 1100;

export const PROMO_CODES = {
  MARGARITA: "margarita",
  TACOS: "tacos",
  TARDE: "afternoon",
} as const;

export type PromoId = (typeof PROMO_CODES)[keyof typeof PROMO_CODES];
