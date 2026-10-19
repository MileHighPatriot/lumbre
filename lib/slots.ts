import { hours, LAST_CALL_MIN, ORDER_DAYS, PICKUP_LEAD_MIN, SLOT_MINUTES } from "@/data/site";
import { addDays, denver, type When } from "@/lib/denver";
import { formatDayLabel, formatMinutes, toMinutes } from "@/lib/format";

export type Slot = When & {
  id: string;
  dayLabel: string;
  timeLabel: string;
  label: string;
};

function ceilTo(value: number, step: number) {
  return Math.ceil(value / step) * step;
}

/** Pickup and delivery windows for the next seven days, Denver time. */
export function slots(now: Date): Slot[] {
  const here = denver(now);
  const out: Slot[] = [];
  for (let offset = 0; offset < ORDER_DAYS; offset++) {
    const day = (here.day + offset) % 7;
    const ymd = addDays(here.ymd, offset);
    const schedule = hours.find((entry) => entry.day === day);
    if (!schedule) continue;
    const open = toMinutes(schedule.open);
    const last = toMinutes(schedule.close) - LAST_CALL_MIN;
    const earliest = offset === 0 ? Math.max(open, ceilTo(here.minutes + PICKUP_LEAD_MIN, SLOT_MINUTES)) : open;
    for (let minutes = earliest; minutes <= last; minutes += SLOT_MINUTES) {
      const dayLabel = formatDayLabel(ymd);
      const timeLabel = formatMinutes(minutes);
      out.push({
        day,
        minutes,
        ymd,
        id: `${ymd}-${minutes}`,
        dayLabel,
        timeLabel,
        label: `${dayLabel} · ${timeLabel}`,
      });
    }
  }
  return out;
}

export function slotById(list: Slot[], id: string) {
  return list.find((slot) => slot.id === id) ?? null;
}
