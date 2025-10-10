import { headers } from "next/headers";
/** Next 15-safe absolute URL builder for server components */
export async function absolute(path: string = ""): Promise<string> {
  const h = await headers();
  const proto =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http");
  const host =
    h.get("x-forwarded-host") ??
    h.get("host") ??
    process.env.NEXT_PUBLIC_APP_HOST ??
    "localhost:3000";
  const base = `${proto}://${host}`;
  return path ? (path.startsWith("/") ? `${base}${path}` : `${base}/${path}`) : base;
}
