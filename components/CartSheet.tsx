"use client";

import { usePathname } from "next/navigation";
import CartPanel from "@/components/CartPanel";
import { useOrder } from "@/components/OrderProvider";
import { useFocusTrap } from "@/components/useFocusTrap";
import { money, parseDollars } from "@/lib/format";
import { slotById, slots } from "@/lib/slots";
import { quote, type Tip } from "@/lib/ticket";
import { useNow } from "@/lib/useNow";

function bare(path: string) {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

export function CartSheet() {
  const { cartOpen, setCartOpen } = useOrder();
  const ref = useFocusTrap(cartOpen, () => setCartOpen(false));
  if (!cartOpen) return null;
  return (
    <div className="fixed inset-0 z-40 bg-ink/50">
      <div ref={ref} role="dialog" aria-modal="true" aria-label="Your order" className="ml-auto flex h-full w-full max-w-md flex-col overflow-y-auto bg-bone p-4">
        <button type="button" onClick={() => setCartOpen(false)} className="mb-3 min-h-11 self-end px-2 text-sm font-semibold">Close</button>
        <CartPanel idPrefix="sheet" />
      </div>
    </div>
  );
}

export function CartDock() {
  const path = bare(usePathname() || "/");
  const now = useNow();
  const { count, lines, draft, openCart, cartOpen } = useOrder();
  if (cartOpen) return null;
  if (count === 0 && path !== "/order") return null;
  const slot = now ? slotById(slots(now), draft.slotId) : null;
  const tip: Tip = draft.tipChoice === "custom" ? { kind: "custom", cents: parseDollars(draft.tipCustom) ?? 0 } : { kind: "percent", pct: Number(draft.tipChoice) };
  const bill = quote({
    lines,
    when: slot ? { day: slot.day, minutes: slot.minutes, ymd: slot.ymd } : null,
    method: draft.method,
    zip: draft.zip,
    tip,
    code: draft.code,
  });
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <button type="button" onClick={openCart} className="flex min-h-12 w-full items-center justify-between rounded-full bg-ink px-5 font-semibold text-bone">
        <span>View order{count > 0 ? ` · ${count}` : ""}</span>
        <span>{money(bill.total)}</span>
      </button>
    </div>
  );
}
