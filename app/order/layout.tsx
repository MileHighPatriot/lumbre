import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order",
  description: "Order pickup or delivery from Lumbre. Specials follow the time you choose.",
};

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
