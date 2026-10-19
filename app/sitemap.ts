import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-19");
  return ["", "/menu", "/order", "/promotions", "/visit"].map((path) => ({
    url: `${site.url}${path}/`,
    lastModified,
  }));
}
