import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/requireUser";

export default async function Me() {
  const { user } = await requireUser();
  if (!user) redirect("/auth/signin"); // not signed in
  if (user.role === "TRADER") redirect("/trade");
  if (user.role === "ADMIN") redirect("/trade"); // or /admin later
  redirect("/home");
}
