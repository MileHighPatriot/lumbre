export type When = { day: number; minutes: number; ymd: string };

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function denver(date: Date, timeZone = "America/Denver"): When {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );
  let hour = Number(parts.hour);
  if (hour === 24) hour = 0;
  const day = WEEKDAYS.indexOf(parts.weekday as (typeof WEEKDAYS)[number]);
  if (day < 0) throw new Error(`Unexpected weekday: ${parts.weekday}`);
  return { day, minutes: hour * 60 + Number(parts.minute), ymd: `${parts.year}-${parts.month}-${parts.day}` };
}

export function addDays(ymd: string, days: number) {
  const [y, m, d] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

/** A Date whose Denver wall clock is the given calendar day and minute. */
export function zonedTime(ymd: string, minutes: number, timeZone = "America/Denver") {
  const [y, mo, d] = ymd.split("-").map(Number);
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  let utc = Date.UTC(y, mo - 1, d, hour, minute);
  for (let i = 0; i < 4; i++) {
    const got = denver(new Date(utc), timeZone);
    const [gy, gm, gd] = got.ymd.split("-").map(Number);
    const wanted = Date.UTC(y, mo - 1, d, hour, minute);
    const have = Date.UTC(gy, gm - 1, gd, Math.floor(got.minutes / 60), got.minutes % 60);
    if (wanted === have) break;
    utc += wanted - have;
  }
  return new Date(utc);
}
