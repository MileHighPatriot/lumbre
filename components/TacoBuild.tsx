import type { CSSProperties } from "react";
import Link from "next/link";

/**
 * "How a taco gets built": a scroll-pinned plate. Where scroll-driven animations are supported
 * the section is tall and its stage sticks while the tortilla, the meat, the onion and cilantro,
 * and the salsa land in turn. Everywhere else (and under reduced motion) it's a plain section:
 * the finished taco beside the four steps as a list. All motion is CSS: see globals.css.
 */
const steps = [
  ["Masa", "It starts with a warm corn tortilla."],
  ["Fire", "Al pastor comes off the trompo, shaved to order."],
  ["Onion and cilantro", "Chopped fine and put on by the handful."],
  ["Salsa", "Made in the morning. Lime on the side."],
];

// A small fixed-seed generator so the server and the browser scatter the toppings the same way.
function scatter(count: number, radius: number, seed: number) {
  let s = seed;
  const next = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  return Array.from({ length: count }, () => {
    const angle = next() * Math.PI * 2;
    const reach = Math.sqrt(next()) * radius;
    return { x: 200 + Math.cos(angle) * reach, y: 200 + Math.sin(angle) * reach * 0.82, turn: Math.round(next() * 180), size: 0.75 + next() * 0.5 };
  });
}

const meat = scatter(22, 84, 7);
const onion = scatter(20, 88, 19);
const cilantro = scatter(16, 90, 31);
const j = (i: number, of: number) => ({ "--j": (i / of).toFixed(3) }) as CSSProperties;

export default function TacoBuild() {
  return (
    <section aria-labelledby="taco-build" className="taco relative bg-anil-deep text-bone">
      <div className="taco-stage">
        <div className="wrap grid w-full items-center gap-8 py-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.22em] text-maize">From the trompo</p>
            <h2 id="taco-build" className="mt-3 text-4xl sm:text-6xl">
              How a taco <em className="text-maize">gets built.</em>
            </h2>
            <div aria-hidden className="taco-rail mt-6 h-1 max-w-xs overflow-hidden rounded-full bg-bone/15">
              <i className="block h-full origin-left rounded-full bg-maize" />
            </div>
            <ol className="taco-steps mt-7 grid gap-6 sm:grid-cols-2">
              {steps.map(([title, body], i) => (
                <li key={title} className="taco-step" style={{ "--a": `${i * 25}%`, "--b": `${i * 25 + 25}%` } as CSSProperties}>
                  <span className="text-xs uppercase tracking-[0.18em] text-maize">Step {i + 1} of 4</span>
                  <span className="mt-2 block font-display text-4xl sm:text-5xl">{title}</span>
                  <span className="mt-2 block max-w-sm text-lg text-bone/90">{body}</span>
                </li>
              ))}
            </ol>
            <Link href="/order?promo=tacos" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-clay-deep px-6 font-semibold text-paper">
              Order tacos
            </Link>
          </div>

          <div aria-hidden className="order-first mx-auto w-52 sm:w-72 lg:order-none lg:w-full lg:max-w-md">
            <svg viewBox="0 0 400 400" className="block h-auto w-full overflow-visible">
              <ellipse cx="200" cy="214" rx="186" ry="182" fill="#000" opacity=".28" />
              <circle cx="200" cy="200" r="184" fill="#fbf7f2" />
              <circle cx="200" cy="200" r="178" fill="none" stroke="#1a3358" strokeWidth="5" />
              <circle cx="200" cy="200" r="168" fill="none" stroke="#c4623a" strokeWidth="2" strokeDasharray="3 9" />
              <circle cx="200" cy="200" r="150" fill="#f1e8dc" />

              <g className="taco-tortilla">
                <path d="M200 76c40-4 82 14 104 48 22 33 24 78 6 112-18 36-54 60-96 64-42 4-86-12-110-46-24-33-28-80-10-116 19-37 62-58 106-62z" fill="#e8c98b" />
                <path d="M200 76c40-4 82 14 104 48 22 33 24 78 6 112-18 36-54 60-96 64-42 4-86-12-110-46-24-33-28-80-10-116 19-37 62-58 106-62z" fill="none" stroke="#c9a05a" strokeWidth="3" />
                {scatter(26, 104, 3).map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={2.2 * p.size} fill="#b98a45" opacity=".55" />
                ))}
              </g>

              {meat.map((p, i) => (
                <rect key={i} className="taco-meat" style={j(i, meat.length)} x={p.x - 11 * p.size} y={p.y - 7 * p.size} width={22 * p.size} height={14 * p.size} rx="4" fill={i % 3 ? "#9a4528" : "#c4623a"} transform={`rotate(${p.turn} ${p.x} ${p.y})`} />
              ))}
              {onion.map((p, i) => (
                <rect key={i} className="taco-top" style={j(i, onion.length)} x={p.x - 4} y={p.y - 4} width={8 * p.size} height={8 * p.size} rx="2" fill="#fbf7f2" transform={`rotate(${p.turn} ${p.x} ${p.y})`} />
              ))}
              {cilantro.map((p, i) => (
                <path key={i} className="taco-top" style={j(i, cilantro.length)} d={`M${p.x} ${p.y}c5-9 13-9 15-1-6 7-12 7-15 1z`} fill="#4c7a45" transform={`rotate(${p.turn} ${p.x} ${p.y})`} />
              ))}
              <g fill="none" stroke="#8e2a2a" strokeWidth="9" strokeLinecap="round">
                <path className="taco-salsa" pathLength={100} d="M124 168c26-22 44 20 70 0s44-20 70 0 30 10 34 4" />
                <path className="taco-salsa" pathLength={100} d="M114 224c28 20 46-18 72 2s46 18 72-2 28-8 34-2" />
              </g>
              <g className="taco-lime">
                <path d="M318 318a52 52 0 0 0 54-54z" fill="#7da24a" />
                <path d="M324 312a44 44 0 0 0 42-42z" fill="#c9dd8c" />
                <path d="M330 306 362 274M334 310l14-34M328 302l34-14" stroke="#7da24a" strokeWidth="2" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
