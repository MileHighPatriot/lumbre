import { menuById } from "@/data/menu";
import { DELIVERY_MIN, DELIVERY_ZIPS } from "@/data/site";
import { money, phoneDigits } from "@/lib/format";
import { requirementsMet } from "@/lib/picks";
import { slots, type Slot } from "@/lib/slots";
import type { CartLine, Quote } from "@/lib/ticket";

export type FieldError = { field: string; message: string };

export function checkoutErrors(input: {
  lines: CartLine[];
  name: string;
  phone: string;
  method: "pickup" | "delivery";
  address: string;
  zip: string;
  slot: Slot | null;
  age: boolean;
  quote: Quote;
  now: Date;
}): FieldError[] {
  const errors: FieldError[] = [];
  const active = input.lines.filter((line) => line.qty > 0);
  if (active.length === 0) errors.push({ field: "cart", message: "Add something before you place the order." });

  for (const line of active) {
    const item = menuById[line.itemId];
    if (!item) {
      errors.push({ field: "cart", message: "A dish in the cart is no longer on the menu." });
      continue;
    }
    if (line.qty > 10) errors.push({ field: line.lineId, message: `Quantity for ${item.name} has to be between 1 and 10.` });
    const missing = requirementsMet(item, line.picks);
    if (missing) errors.push({ field: line.lineId, message: missing });
  }

  if (input.name.trim().length < 2) errors.push({ field: "name", message: "Enter the name for the order." });
  if (phoneDigits(input.phone).length !== 10) errors.push({ field: "phone", message: "Enter a 10-digit phone number." });

  if (!input.slot) errors.push({ field: "slot", message: "Choose a time." });
  else if (!slots(input.now).some((slot) => slot.id === input.slot!.id)) {
    errors.push({ field: "slot", message: "That window has passed. Choose another time." });
  }

  if (input.quote.lines.some((line) => line.alcohol) && !input.age) {
    errors.push({ field: "age", message: "Confirm you are 21 or older. We check an ID at pickup." });
  }

  if (input.method === "delivery") {
    if (input.address.trim().length < 6) errors.push({ field: "address", message: "Enter the street address." });
    const zip = input.zip.trim();
    if (!/^\d{5}$/.test(zip)) errors.push({ field: "zip", message: "Enter a 5-digit ZIP code." });
    else if (!(DELIVERY_ZIPS as readonly string[]).includes(zip)) {
      errors.push({
        field: "zip",
        message: `We deliver to ${DELIVERY_ZIPS.join(", ")}. This ZIP is outside that area. Pickup is still open.`,
      });
    } else if (input.quote.food < DELIVERY_MIN) {
      errors.push({ field: "minimum", message: `Add ${money(DELIVERY_MIN - input.quote.food)} more for delivery.` });
    }
  }

  return errors;
}
