import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const disallow = process.env.ROBOTS === "disallow";
  const base = process.env.NEXTAUTH_URL?.replace(/\/$/, "");
  return disallow
    ? { rules: [{ userAgent: "*", disallow: "/" }] }
    : { rules: [{ userAgent: "*", allow: "/" }], sitemap: base ? `${base}/sitemap.xml` : undefined };
}
