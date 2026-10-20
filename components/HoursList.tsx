import { hours } from "@/data/site";
import { dayNames, formatMinutes, toMinutes } from "@/lib/format";

const order = [1, 2, 3, 4, 5, 6, 0];

export default function HoursList({ className = "" }: { className?: string }) {
  return (
    <ul className={className}>
      {order.map((day) => {
        const row = hours.find((entry) => entry.day === day)!;
        return (
          <li key={day} className="flex justify-between gap-6 py-2">
            <span>{dayNames[day]}</span>
            <span>
              {formatMinutes(toMinutes(row.open))} to {formatMinutes(toMinutes(row.close))}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
