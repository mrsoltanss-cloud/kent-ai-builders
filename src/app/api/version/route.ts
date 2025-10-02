export const dynamic = "force-dynamic";
export async function GET() {
  return new Response(
    JSON.stringify({
      deployedAt: new Date().toISOString(),
      commit: process.env.VERCEL_GIT_COMMIT_SHA || null,
      vercelUrl: process.env.VERCEL_URL || null,
      nodeEnv: process.env.NODE_ENV,
    }),
    { headers: { "content-type": "application/json" } }
  );
}
