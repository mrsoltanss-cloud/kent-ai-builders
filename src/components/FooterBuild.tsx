/**
 * FooterBuild — safely hidden by default.
 * Set NEXT_PUBLIC_SHOW_BUILD_BADGE=true to show it again.
 */
import { BUILD_ID, BUILD_TIME } from "@/build-info";

export default function FooterBuild() {
  const show = process.env.NEXT_PUBLIC_SHOW_BUILD_BADGE === "true";
  if (!show) return null;

  return (
    <div className="w-full py-2 text-center text-xs text-zinc-500">
      Build: {BUILD_ID} • {new Date(BUILD_TIME).toLocaleString()}
    </div>
  );
}
