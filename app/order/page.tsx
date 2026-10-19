"use client";

import { useEffect, useRef } from "react";
import CartPanel from "@/components/CartPanel";
import MenuBoard from "@/components/MenuBoard";
import { useOrder } from "@/components/OrderProvider";
import TicketView from "@/components/TicketView";
import { promoState, type PromoFlags } from "@/lib/promos";
import { slots } from "@/lib/slots";
import { useNow } from "@/lib/useNow";
import { money } from "@/lib/format";

export default function OrderPage() {
  const now = useNow();
  const { setDraft, orders, activeId, showOrder, dismissTicket } = useOrder();
  const usedQuery = useRef(false);
  const active = orders.find((order) => order.id === activeId) ?? null;

  useEffect(() => {
    if (!now || usedQuery.current) return;
    const promo = new URLSearchParams(window.location.search).get("promo");
    if (promo !== "margarita" && promo !== "tacos" && promo !== "afternoon") return;
    const match = slots(now).find((slot) => promoState(slot)[promo as keyof PromoFlags]);
    usedQuery.current = true;
    if (!match) return;
    setDraft((current) => (current.slotId ? current : { ...current, slotId: match.id }));
  }, [now, setDraft]);

  return (
    <div className="wrap py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-clay-deep">Order</p>
      <h1 className="mt-2 text-5xl sm:text-6xl">Pickup or delivery.</h1>
      <p className="mt-4 max-w-2xl text-ink-soft">Choose a window in the next seven days. The ticket reprices when that window hits margarita night, Taco Tuesday, or the afternoon board. You pay when you pick it up, or you pay the driver.</p>

      {active ? (
        <div className="mt-8">
          <TicketView order={active} onBack={dismissTicket} />
        </div>
      ) : (
        <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:gap-10">
          <MenuBoard />
          <aside id="cart" tabIndex={-1} className="sticky top-28 mt-8 hidden scroll-mt-28 lg:block">
            <CartPanel idPrefix="side" />
          </aside>
        </div>
      )}

      {orders.length > 0 && (
        <section className="mt-12 border-t border-line pt-8">
          <h2 className="text-3xl">Orders on this device</h2>
          <ul className="mt-4 divide-y divide-line">
            {orders.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-3 py-3">
                <span>
                  <span className="font-semibold">{order.code}</span>
                  <span className="block text-sm text-ink-soft">{order.slotLabel} · {money(order.total)}</span>
                </span>
                <button type="button" onClick={() => showOrder(order.id)} className="min-h-11 rounded-full px-4 text-sm font-semibold ring-1 ring-inset ring-line">View ticket</button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
