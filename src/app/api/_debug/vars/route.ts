export const dynamic = "force-dynamic";

export async function GET() {
  const mask = (v?: string) => (v ? v.slice(0, 6) + "…" : "(unset)");
  return new Response(
    JSON.stringify({
      VERCEL_ENV: process.env.VERCEL_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      GOOGLE_CLIENT_ID: mask(process.env.GOOGLE_CLIENT_ID),
      GOOGLE_CLIENT_SECRET: mask(process.env.GOOGLE_CLIENT_SECRET),
    }, null, 2),
    { headers: { "content-type": "application/json" } }
  );
}
