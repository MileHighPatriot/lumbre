import { categories, menu } from "@/data/menu";
import { site } from "@/data/site";

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.name,
    servesCuisine: "Mexican",
    url: site.url,
    telephone: site.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: "US",
    },
    description: `${site.description} Concept restaurant. Not a real business.`,
    hasMenu: {
      "@type": "Menu",
      hasMenuSection: categories.map((category) => ({
        "@type": "MenuSection",
        name: category.name,
        hasMenuItem: menu
          .filter((item) => item.category === category.id)
          .map((item) => ({
            "@type": "MenuItem",
            name: item.name,
            description: item.description,
            offers: { "@type": "Offer", price: (item.price / 100).toFixed(2), priceCurrency: "USD" },
          })),
      })),
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
  );
}
