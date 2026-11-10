import type { CSSProperties } from "react";

// Fixed positions so the server and the browser draw the same sparks: [left %, size px, seconds, delay s].
const sparks: [number, number, number, number][] = [
  [8, 3, 9, 0],
  [17, 4, 12, 4],
  [26, 2, 8, 2],
  [36, 4, 13, 7],
  [47, 3, 10, 1],
  [57, 5, 14, 5],
  [66, 2, 8, 3],
  [75, 4, 11, 8],
  [84, 3, 9, 6],
  [93, 4, 12, 2.5],
];

/** Lumbre means firelight: sparks rising off the fire. Decorative, and still under reduced motion. */
export default function Embers() {
  return (
    <div aria-hidden className="embers pointer-events-none absolute inset-0 overflow-hidden">
      {sparks.map(([left, size, time, delay]) => (
        <i key={left} style={{ left: `${left}%`, width: size, height: size, "--t": `${time}s`, "--w": `${delay}s` } as CSSProperties} />
      ))}
    </div>
  );
}
