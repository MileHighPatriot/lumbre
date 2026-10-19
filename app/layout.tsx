import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { CartDock, CartSheet } from "@/components/CartSheet";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ItemDialog from "@/components/ItemDialog";
import JsonLd from "@/components/JsonLd";
import OrderProvider from "@/components/OrderProvider";
import PromoBanner from "@/components/PromoBanner";
import { site } from "@/data/site";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const sans = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1a3358",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Lumbre · Mexican kitchen on Santa Fe Drive", template: "%s · Lumbre" },
  description: site.description,
  openGraph: { title: "Lumbre", description: site.description, locale: site.locale, type: "website", siteName: site.name },
  twitter: { card: "summary_large_image", title: "Lumbre", description: site.description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full bg-bone text-ink">
        <JsonLd />
        <OrderProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-paper focus:px-3 focus:py-2">
            Skip to content
          </a>
          <aside aria-label="Concept project notice" className="border-b border-line bg-maize/40">
            <p className="wrap py-2 text-sm">
              Concept project: a sample site built by 5280 Web Solutions. Lumbre is not a real restaurant.{" "}
              <a href={site.studio} className="font-semibold underline">See more at 5280webs.com</a>
            </p>
          </aside>
          <Header />
          <PromoBanner />
          <main id="main" className="pb-24 lg:pb-0">{children}</main>
          <Footer />
          <CartDock />
          <CartSheet />
          <ItemDialog />
        </OrderProvider>
      </body>
    </html>
  );
}
