// src/app/api/version/route.ts
import { getEffectiveSession } from "@/lib/session"

export async function GET() {
  const s: any = await getEffectiveSession()
  const payload = {
    name: "kent-ai-builders",
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? "",
    branch: process.env.VERCEL_GIT_COMMIT_REF ?? "",
    deployedAt: new Date().toISOString(),
    impersonating: !!s?.user?.__impersonated,
    actorId: s?.user?.__actorId ?? null,
  }
  return Response.json(payload)
}
