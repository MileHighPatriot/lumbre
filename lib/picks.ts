import { groupById } from "@/data/modifiers";
import type { MenuItem } from "@/data/menu";

export type Picks = Record<string, string[]>;

/** Keep only choices that belong to this dish, and never more than the group allows. */
export function normalizePicks(item: MenuItem, picks: Picks): Picks {
  const next: Picks = {};
  for (const groupId of item.groups) {
    const group = groupById[groupId];
    if (!group) continue;
    const chosen = (picks[groupId] ?? []).filter((id) => group.choices.some((choice) => choice.id === id));
    next[groupId] = chosen.slice(0, group.max);
  }
  return next;
}

export function extrasCents(item: MenuItem, picks: Picks) {
  const chosen = normalizePicks(item, picks);
  let total = 0;
  for (const groupId of item.groups) {
    const group = groupById[groupId];
    if (!group) continue;
    for (const id of chosen[groupId] ?? []) {
      total += group.choices.find((choice) => choice.id === id)?.price ?? 0;
    }
  }
  return total;
}

export function pickDetail(item: MenuItem, picks: Picks, note: string) {
  const chosen = normalizePicks(item, picks);
  const parts: string[] = [];
  for (const groupId of item.groups) {
    const group = groupById[groupId];
    if (!group) continue;
    for (const id of chosen[groupId] ?? []) {
      const name = group.choices.find((choice) => choice.id === id)?.name;
      if (name) parts.push(name);
    }
  }
  const trimmed = note.trim();
  if (trimmed) parts.push(trimmed);
  return parts.join(", ");
}

export function requirementsMet(item: MenuItem, picks: Picks) {
  const chosen = normalizePicks(item, picks);
  for (const groupId of item.groups) {
    const group = groupById[groupId];
    if (!group) continue;
    if ((chosen[groupId]?.length ?? 0) < group.min) return `Choose ${group.name.toLowerCase()} for ${item.name}.`;
  }
  return null;
}

export function defaultPicks(item: MenuItem): Picks {
  const picks: Picks = {};
  for (const groupId of item.groups) {
    const group = groupById[groupId];
    picks[groupId] = group && group.min > 0 ? [group.choices[0].id] : [];
  }
  return picks;
}
