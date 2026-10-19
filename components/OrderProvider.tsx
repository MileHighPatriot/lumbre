"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { menuById, type MenuItem } from "@/data/menu";
import type { Picks } from "@/lib/picks";
import { defaultPicks } from "@/lib/picks";
import { buildOrder, type SavedOrder } from "@/lib/order";
import { parseDollars } from "@/lib/format";
import { slotById, slots } from "@/lib/slots";
import { quote, type CartLine, type Tip } from "@/lib/ticket";
import { checkoutErrors, type FieldError } from "@/lib/validate";

const KEY = "lumbre-order-v1";

export type Draft = {
  method: "pickup" | "delivery";
  name: string;
  phone: string;
  address: string;
  zip: string;
  slotId: string;
  tipChoice: "0" | "15" | "18" | "20" | "custom";
  tipCustom: string;
  age: boolean;
  code: string;
  tipTouched: boolean;
};

export type Editor = { token: string; itemId: string; lineId?: string; qty: number; picks: Picks; note: string };

const emptyDraft: Draft = {
  method: "pickup",
  name: "",
  phone: "",
  address: "",
  zip: "",
  slotId: "",
  tipChoice: "0",
  tipCustom: "",
  age: false,
  code: "",
  tipTouched: false,
};

type Store = {
  lines: CartLine[];
  draft: Draft;
  orders: SavedOrder[];
  activeId: string | null;
};

type Api = Store & {
  ready: boolean;
  count: number;
  cartOpen: boolean;
  editor: Editor | null;
  setDraft: (patch: Partial<Draft> | ((draft: Draft) => Draft)) => void;
  setCartOpen: (open: boolean) => void;
  openCart: () => void;
  openItem: (item: MenuItem) => void;
  openLine: (line: CartLine) => void;
  closeEditor: () => void;
  commitEditor: (qty: number, picks: Picks, note: string) => void;
  setQty: (lineId: string, qty: number) => void;
  removeLine: (lineId: string) => void;
  place: (now: Date) => { ok: true; order: SavedOrder } | { ok: false; errors: FieldError[] };
  showOrder: (id: string) => void;
  dismissTicket: () => void;
};

const Ctx = createContext<Api | null>(null);

export function useOrder() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useOrder must be used inside OrderProvider");
  return value;
}

function tipOf(draft: Draft): Tip {
  if (draft.tipChoice === "custom") return { kind: "custom", cents: parseDollars(draft.tipCustom) ?? 0 };
  return { kind: "percent", pct: Number(draft.tipChoice) };
}

export default function OrderProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [draft, setDraftState] = useState<Draft>(emptyDraft);
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Store>;
        if (Array.isArray(parsed.lines)) {
          // Hydrate after SSR. localStorage does not exist on the server.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setLines(parsed.lines.filter((line) => line && menuById[line.itemId] && line.qty > 0));
        }
        if (parsed.draft && typeof parsed.draft === "object") {
          setDraftState({ ...emptyDraft, ...parsed.draft });
        }
        if (Array.isArray(parsed.orders)) {
          setOrders(parsed.orders.slice(0, 20));
        }
        if (typeof parsed.activeId === "string") {
          setActiveId(parsed.activeId);
        }
      }
    } catch {
      /* a broken save should not block ordering */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify({ lines, draft, orders, activeId }));
  }, [ready, lines, draft, orders, activeId]);

  const api = useMemo<Api>(() => {
    const setDraft: Api["setDraft"] = (patch) => {
      setDraftState((current) => (typeof patch === "function" ? patch(current) : { ...current, ...patch }));
    };
    return {
      lines,
      draft,
      orders,
      activeId,
      ready,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      cartOpen,
      editor,
      setDraft,
      setCartOpen,
      openCart: () => {
        const path = window.location.pathname.replace(/\/$/, "") || "/";
        if (window.matchMedia("(min-width: 1024px)").matches && path === "/order") {
          document.getElementById("cart")?.scrollIntoView({ behavior: "smooth", block: "start" });
          document.getElementById("cart")?.focus();
          return;
        }
        setCartOpen(true);
      },
      openItem: (item) => setEditor({ token: crypto.randomUUID(), itemId: item.id, qty: 1, picks: defaultPicks(item), note: "" }),
      openLine: (line) => setEditor({ token: crypto.randomUUID(), itemId: line.itemId, lineId: line.lineId, qty: line.qty, picks: line.picks, note: line.note }),
      closeEditor: () => setEditor(null),
      commitEditor: (qty, picks, note) => {
        if (!editor) return;
        if (editor.lineId) {
          const lineId = editor.lineId;
          setLines((existing) => existing.map((line) => (line.lineId === lineId ? { ...line, qty, picks, note } : line)));
        } else {
          setLines((existing) => [...existing, { lineId: crypto.randomUUID(), itemId: editor.itemId, qty, picks, note }]);
        }
        setEditor(null);
      },
      setQty: (lineId, qty) => {
        setLines((existing) => existing.flatMap((line) => (line.lineId === lineId ? (qty < 1 ? [] : [{ ...line, qty: Math.min(10, qty) }]) : [line])));
      },
      removeLine: (lineId) => setLines((existing) => existing.filter((line) => line.lineId !== lineId)),
      place: (now) => {
        const available = slots(now);
        const slot = slotById(available, draft.slotId);
        const when = slot ? { day: slot.day, minutes: slot.minutes, ymd: slot.ymd } : null;
        const bill = quote({ lines, when, method: draft.method, zip: draft.zip, tip: tipOf(draft), code: draft.code });
        const errors = checkoutErrors({
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
        });
        if (draft.tipChoice === "custom" && parseDollars(draft.tipCustom) == null) {
          errors.push({ field: "tip", message: "Enter a tip in dollars, up to $500." });
        }
        if (errors.length || !slot) return { ok: false, errors };
        const order = buildOrder({
          lines,
          quote: bill,
          method: draft.method,
          name: draft.name,
          phone: draft.phone,
          address: draft.address,
          zip: draft.zip,
          slot,
          placedAt: new Date().toISOString(),
        });
        setOrders((existing) => [order, ...existing].slice(0, 20));
        setActiveId(order.id);
        setLines([]);
        setDraftState((current) => ({ ...current, slotId: "", code: "" }));
        setCartOpen(false);
        router.push("/order");
        return { ok: true, order };
      },
      showOrder: (id) => {
        setActiveId(id);
        setCartOpen(false);
        router.push("/order");
      },
      dismissTicket: () => setActiveId(null),
    };
  }, [lines, draft, orders, activeId, ready, cartOpen, editor, router]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
