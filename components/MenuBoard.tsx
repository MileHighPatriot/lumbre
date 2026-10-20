"use client";

import { useEffect, useMemo, useState } from "react";
import { categories, menu, type CategoryId, type MenuItem } from "@/data/menu";
import { TACO_BUNDLE_PRICE } from "@/data/promos";
import type { PhotoId } from "@/data/photos";
import { money } from "@/lib/format";
import { useOrder } from "@/components/OrderProvider";
import MenuThumb from "@/components/MenuThumb";
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
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return menu.filter((item) => {
      if (vegetarian && !item.vegetarian) return false;
      if (gluten && !item.glutenOptional) return false;
      if (!words.length) return true;
      const hay = `${item.name} ${item.description}`.toLowerCase();
      return words.every((word) => hay.split(/[^a-z0-9]+/).includes(word));
    });
  }, [query, vegetarian, gluten]);

  return (
    <div>
      <div className="-mx-4 border-b border-line bg-bone px-4 py-3">
        <label className="block text-sm font-semibold">
          Search the menu
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mt-1 w-full rounded-full border border-line bg-paper px-4 py-2 text-base font-normal"
            placeholder="Mole, pastor, horchata"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <Filter on={vegetarian} set={setVegetarian} label="Vegetarian" />
          <Filter on={gluten} set={setGluten} label="Gluten-optional" />
        </div>
      </div>
      <nav aria-label="Menu sections" className="sticky top-[7.25rem] z-20 -mx-4 flex gap-2 overflow-x-auto border-b border-line bg-bone px-4 py-2 md:top-16">
        {categories.map((category) => (
          <a key={category.id} href={`#${category.id}`} className="inline-flex min-h-11 shrink-0 items-center rounded-full px-3 text-sm ring-1 ring-inset ring-line hover:bg-paper">
            {category.name}
          </a>
        ))}
      </nav>

      {shown.length === 0 && <p className="mt-8 text-ink-soft">Nothing on the board matches that. Clear a filter and try the dish name.</p>}

      {categories.map((category) => {
        const items = shown.filter((item) => item.category === category.id);
        if (!items.length) return null;
        const photo = sectionPhoto[category.id];
        return (
          <section key={category.id} id={category.id} className="scroll-mt-48 border-b border-line py-8 md:scroll-mt-32">
            <h2 className="font-display text-4xl">{category.name}</h2>
            <p className="mt-1 text-sm text-ink-soft">{category.note}</p>
            {photo && (
              <div className="relative mt-4 aspect-[3/2] overflow-hidden rounded-2xl">
                <Plate photo={photo} />
              </div>
            )}
            <ul className="mt-5 divide-y divide-line">
              {items.map((item) => {
                const tags = itemTags(item);
                return (
                  <li key={item.id} className="py-5">
                    <div className={item.photo ? "grid grid-cols-[4.75rem_1fr] gap-3 sm:grid-cols-[7.5rem_1fr] sm:gap-4" : ""}>
                      {item.photo && (
                        <div className="relative aspect-square overflow-hidden rounded-xl">
                          <MenuThumb photo={item.photo} />
                        </div>
                      )}
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-sans text-lg font-semibold tracking-normal">{item.name}</h3>
                          <p className="shrink-0 font-semibold">{money(item.price)}</p>
                        </div>
                        {tags && <p className="mt-1 text-sm text-ink-soft">{tags}</p>}
                        <p className="mt-2 max-w-xl">{item.description}</p>
                        {item.includes && <p className="mt-1 text-sm text-ink-soft">Comes with {item.includes.toLowerCase()}.</p>}
                        {item.nightPrice != null && <p className="mt-1 text-sm text-chile">Thursday 4–10pm {money(item.nightPrice)}</p>}
                        {item.afternoonPrice != null && <p className="mt-1 text-sm text-chile">Mon–Fri 3–6pm {money(item.afternoonPrice)}</p>}
                        {item.streetTaco && <p className="mt-1 text-sm text-chile">Tuesday, 3 for {money(TACO_BUNDLE_PRICE)}</p>}
                        <button type="button" onClick={() => openItem(item)} aria-label={`Add ${item.name}`} className="mt-3 min-h-11 rounded-full bg-ink px-4 text-sm font-semibold text-bone">
                          Add
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
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

function itemTags(item: MenuItem) {
  const tags = [
    item.spice === 1 ? "Mild" : "",
    item.spice === 2 ? "Medium" : "",
    item.spice === 3 ? "Hot" : "",
    item.vegetarian ? "Vegetarian" : "",
    item.glutenOptional ? "Gluten-optional" : "",
    item.alcohol ? "21+" : "",
  ].filter(Boolean);
  return tags.join(" · ");
}

function Filter({ on, set, label }: { on: boolean; set: (value: boolean) => void; label: string }) {
  return (
    <button type="button" aria-pressed={on} onClick={() => set(!on)} className="min-h-11 rounded-full px-4 text-sm ring-1 ring-inset ring-line aria-pressed:bg-sage aria-pressed:text-bone">
      {label}
    </button>
  );
}
