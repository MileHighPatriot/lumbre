"use client";

import { useEffect, useMemo, useState } from "react";
import { categories, menu, type CategoryId } from "@/data/menu";
import { TACO_BUNDLE_PRICE } from "@/data/promos";
import type { PhotoId } from "@/data/photos";
import { money } from "@/lib/format";
import { useOrder } from "@/components/OrderProvider";
import Plate from "@/components/Plate";

const sectionPhoto: Partial<Record<CategoryId, PhotoId>> = {
  postres: "postres",
  drinks: "aguas",
};

export default function MenuBoard() {
  const { openItem } = useOrder();
  const [query, setQuery] = useState("");
  const [vegetarian, setVegetarian] = useState(false);
  const [gluten, setGluten] = useState(false);

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menu.filter((item) => {
      if (vegetarian && !item.vegetarian) return false;
      if (gluten && !item.glutenOptional) return false;
      if (!q) return true;
      return `${item.name} ${item.description}`.toLowerCase().includes(q);
    });
  }, [query, vegetarian, gluten]);

  return (
    <div>
      <div className="sticky top-28 z-20 -mx-4 border-b border-line bg-bone px-4 py-3 md:top-16">
        <label className="block text-sm font-semibold">
          Search the menu
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mt-1 w-full rounded-full border border-line bg-paper px-4 py-2 font-normal"
            placeholder="Mole, pastor, horchata"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <Filter on={vegetarian} set={setVegetarian} label="Vegetarian" />
          <Filter on={gluten} set={setGluten} label="Gluten-optional" />
        </div>
        <nav aria-label="Menu sections" className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => (
            <a key={category.id} href={`#${category.id}`} className="shrink-0 rounded-full px-3 py-2 text-sm ring-1 ring-inset ring-line hover:bg-paper">
              {category.name}
            </a>
          ))}
        </nav>
      </div>

      {shown.length === 0 && <p className="mt-8 text-ink-soft">Nothing on the board matches that. Clear a filter and try the dish name.</p>}

      {categories.map((category) => {
        const items = shown.filter((item) => item.category === category.id);
        if (!items.length) return null;
        const photo = sectionPhoto[category.id];
        return (
          <section key={category.id} id={category.id} className="scroll-mt-56 border-b border-line py-8">
            <h2 className="font-display text-4xl">{category.name}</h2>
            <p className="mt-1 text-sm text-ink-soft">{category.note}</p>
            {photo && (
              <div className="relative mt-4 aspect-[3/2] overflow-hidden rounded-2xl">
                <Plate photo={photo} />
              </div>
            )}
            <ul className="mt-5 divide-y divide-line">
              {items.map((item) => (
                <li key={item.id} className="grid gap-4 py-5 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div className={item.photo ? "sm:grid sm:grid-cols-[7.5rem_1fr] sm:gap-4" : ""}>
                    {item.photo && (
                      <div className="relative mb-3 aspect-[3/2] overflow-hidden rounded-xl sm:mb-0 sm:aspect-square">
                        <Plate photo={item.photo} />
                      </div>
                    )}
                    <div>
                      <h3 className="font-sans text-lg font-semibold tracking-normal">{item.name}</h3>
                      <p className="mt-1 text-sm text-ink-soft">
                        {[item.spice === 1 ? "Mild" : "", item.spice === 2 ? "Medium" : "", item.spice === 3 ? "Hot" : "", item.vegetarian ? "Vegetarian" : "", item.glutenOptional ? "Gluten-optional" : "", item.alcohol ? "21+" : ""].filter(Boolean).join(" · ")}
                      </p>
                      <p className="mt-2 max-w-xl">{item.description}</p>
                      {item.includes && <p className="mt-1 text-sm text-ink-soft">Comes with {item.includes.toLowerCase()}.</p>}
                      {item.nightPrice != null && <p className="mt-1 text-sm text-chile">Thursday 4–10pm {money(item.nightPrice)}</p>}
                      {item.afternoonPrice != null && <p className="mt-1 text-sm text-chile">Mon–Fri 3–6pm {money(item.afternoonPrice)}</p>}
                      {item.streetTaco && <p className="mt-1 text-sm text-chile">Tuesday, 3 for {money(TACO_BUNDLE_PRICE)}</p>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <p className="font-semibold">{money(item.price)}</p>
                    <button type="button" onClick={() => openItem(item)} className="min-h-11 rounded-full bg-ink px-4 text-sm font-semibold text-bone">
                      Add {item.name}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <p className="mt-6 max-w-xl text-sm text-ink-soft">
        Gluten-optional means the kitchen can plate the dish without flour tortillas or wheat. This is not a dedicated gluten-free kitchen. Ask when you order.
      </p>
    </div>
  );
}

function Filter({ on, set, label }: { on: boolean; set: (value: boolean) => void; label: string }) {
  return (
    <button type="button" aria-pressed={on} onClick={() => set(!on)} className="min-h-11 rounded-full px-4 text-sm ring-1 ring-inset ring-line aria-pressed:bg-sage aria-pressed:text-bone">
      {label}
    </button>
  );
}
