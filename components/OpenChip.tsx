"use client";

import { hours } from "@/data/site";
import { denver } from "@/lib/denver";
import { dayNames, formatMinutes, toMinutes } from "@/lib/format";
import { useNow } from "@/lib/useNow";

export default function OpenChip({ light = false }: { light?: boolean }) {
  const now = useNow();
  const tone = light ? "text-bone/80" : "text-ink-soft";
  if (!now) return <p className={`text-sm ${tone}`}>Hours in Denver time</p>;
  const here = denver(now);
  const today = hours.find((entry) => entry.day === here.day)!;
  const open = toMinutes(today.open);
  const close = toMinutes(today.close);
  if (here.minutes >= open && here.minutes < close) {
    return <p className={`text-sm ${tone}`}>Open now · until {formatMinutes(close)}</p>;
  }
  if (here.minutes < open) return <p className={`text-sm ${tone}`}>Closed · opens today at {formatMinutes(open)}</p>;
  const next = hours.find((entry) => entry.day === (here.day + 1) % 7)!;
  return <p className={`text-sm ${tone}`}>Closed · opens {dayNames[(here.day + 1) % 7]} at {formatMinutes(toMinutes(next.open))}</p>;
}
