"use client";

import { useState } from "react";
import { groupById } from "@/data/modifiers";
import { menuById } from "@/data/menu";
import { TACO_BUNDLE_PRICE } from "@/data/promos";
import { money } from "@/lib/format";
import { extrasCents, requirementsMet, type Picks } from "@/lib/picks";
import { promoState } from "@/lib/promos";
import { slotById, slots } from "@/lib/slots";
import { unitBase } from "@/lib/ticket";
import { useNow } from "@/lib/useNow";
import { useFocusTrap } from "@/components/useFocusTrap";
import { useOrder, type Editor } from "@/components/OrderProvider";

export default function ItemDialog() {
  const { editor, closeEditor } = useOrder();
  if (!editor) return null;
  return <ItemForm key={editor.token} editor={editor} onClose={closeEditor} />;
}

function ItemForm({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const { commitEditor, draft, setDraft } = useOrder();
  const now = useNow();
  const ref = useFocusTrap(true, onClose);
  const item = menuById[editor.itemId];
  const [qty, setQty] = useState(editor.qty);
  const [picks, setPicks] = useState<Picks>(editor.picks);
  const [note, setNote] = useState(editor.note);
  const [age, setAge] = useState(draft.age);
  if (!item) return null;
  const slot = now ? slotById(slots(now), draft.slotId) : null;
  const base = unitBase(item, slot ? promoState(slot) : { margarita: false, tacos: false, afternoon: false });
  const extras = extrasCents(item, picks);
  const missing = requirementsMet(item, picks);
  const ageBlocked = Boolean(item.alcohol) && !age;
  const blocked = Boolean(missing) || ageBlocked;
  const total = (base + extras) * qty;

  const toggle = (groupId: string, choiceId: string, max: number, min: number) => {
    setPicks((current) => {
      const chosen = current[groupId] ?? [];
      if (max === 1) return { ...current, [groupId]: chosen[0] === choiceId && min === 0 ? [] : [choiceId] };
      if (chosen.includes(choiceId)) return { ...current, [groupId]: chosen.filter((id) => id !== choiceId) };
      return { ...current, [groupId]: [...chosen, choiceId].slice(0, max) };
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-ink/50 sm:place-items-center sm:p-6">
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-title"
        className="max-h-[92vh] w-full overflow-y-auto bg-paper p-5 shadow-xl sm:max-w-lg sm:rounded-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="item-title" className="font-display text-4xl">{item.name}</h2>
            <p className="mt-2 text-ink-soft">{item.description}</p>
            {item.includes && <p className="mt-2 text-sm text-ink-soft">Comes with {item.includes.toLowerCase()}.</p>}
          </div>
          <button type="button" onClick={onClose} className="min-h-11 shrink-0 px-2 text-sm font-semibold">Close</button>
        </div>

        <div className="mt-6 space-y-5">
          {item.groups.map((groupId) => {
            const group = groupById[groupId];
            if (!group) return null;
            const chosen = picks[groupId] ?? [];
            return (
              <fieldset key={groupId}>
                <legend className="text-sm font-semibold">
                  {group.name}
                  {group.min > 0 ? " · required" : " · optional"}
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {group.choices.map((choice) => {
                    const on = chosen.includes(choice.id);
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(groupId, choice.id, group.max, group.min)}
                        className="min-h-11 rounded-full px-4 text-sm ring-1 ring-inset ring-line aria-pressed:bg-anil aria-pressed:text-bone aria-pressed:ring-anil"
                      >
                        {choice.name}
                        {choice.price > 0 ? ` · ${money(choice.price)}` : ""}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}

          <label className="block text-sm font-semibold">
            Note for the kitchen
            <textarea
              value={note}
              maxLength={140}
              onChange={(event) => setNote(event.target.value)}
              rows={2}
              className="mt-2 w-full rounded-xl border border-line bg-bone px-3 py-2 text-base font-normal"
            />
          </label>

          {item.alcohol && (
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5"
                checked={age}
                onChange={(event) => {
                  setAge(event.target.checked);
                  if (event.target.checked) setDraft({ age: true });
                  else setDraft({ age: false });
                }}
              />
              <span>I am 21 or older. An ID is checked at pickup. This box does not verify an ID.</span>
            </label>
          )}
          {ageBlocked && <p className="text-sm text-chile">Check the 21+ box to add this drink.</p>}
          {missing && <p className="text-sm text-chile">{missing}</p>}
          {item.streetTaco && <p className="text-sm text-ink-soft">On Tuesday, three classic street tacos are {money(TACO_BUNDLE_PRICE)}.</p>}
          {item.nightPrice != null && <p className="text-sm text-ink-soft">Thursday, 4–10pm, this is {money(item.nightPrice)}.</p>}
          {item.afternoonPrice != null && <p className="text-sm text-ink-soft">Monday–Friday, 3–6pm, this is {money(item.afternoonPrice)}.</p>}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button type="button" className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-inset ring-line" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label={`Decrease quantity of ${item.name}`}>−</button>
            <span className="w-6 text-center font-semibold" aria-live="polite">{qty}</span>
            <button type="button" className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-inset ring-line" onClick={() => setQty((value) => Math.min(10, value + 1))} aria-label={`Increase quantity of ${item.name}`}>+</button>
          </div>
          <button
            type="button"
            aria-disabled={blocked}
            onClick={() => {
              if (blocked) return;
              if (item.alcohol) setDraft({ age: true });
              commitEditor(qty, picks, note);
            }}
            className="min-h-12 rounded-full bg-clay-deep px-5 font-semibold text-paper aria-disabled:bg-line aria-disabled:text-ink-soft"
          >
            {editor.lineId ? "Update" : "Add"} · {money(total)}
            {base < item.price ? <span className="ml-2 line-through opacity-70">{money((item.price + extras) * qty)}</span> : null}
          </button>
        </div>
      </div>
    </div>
  );
}
