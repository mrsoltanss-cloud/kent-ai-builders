export const dynamic = "force-static";
export const revalidate = 0;

export default function PublicTradeLayout({ children }: { children: React.ReactNode }) {
  // Minimal wrapper: no sidebar, no header, no sign-out.
  return <>{children}</>;
}
