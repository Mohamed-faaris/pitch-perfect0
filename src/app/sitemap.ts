import type { MetadataRoute } from "next";
import { env } from "~/env";

// Use the configured public base URL when available, otherwise fall back.
const siteUrl = env.NEXT_PUBLIC_BASE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
    const pages = [
        "",
        "home",
        "book",
        "contact",
        "gallery",
        "instructions",
        "view",
    ];

    return pages.map((p) => ({
        url: `${siteUrl}/${p}`.replace(/([^:]\/)\/+/g, "$1"),
        lastModified: new Date(),
        changeFrequency: p === "" ? "daily" : "weekly",
        priority: p === "" ? 1 : 0.7,
    }));
}
