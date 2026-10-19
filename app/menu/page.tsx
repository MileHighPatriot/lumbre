import type { Metadata } from "next";
import MenuBoard from "@/components/MenuBoard";

export const metadata: Metadata = {
  title: "Menu",
  description: "The Lumbre menu: antojitos, tacos, enchiladas, platillos, fajitas, aguas, and a short bar.",
};

export default function MenuPage() {
  return (
    <div className="wrap py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-clay-deep">The board</p>
      <h1 className="mt-2 max-w-3xl text-5xl sm:text-6xl">What the kitchen cooks.</h1>
      <p className="mt-4 max-w-2xl text-ink-soft">Prices are in dollars. Add a dish and it joins the same order you finish on the order page. Specials apply to the pickup or delivery time, not to a banner.</p>
      <div className="mt-8">
        <MenuBoard />
      </div>
    </div>
  );
}
