export const dynamic = "force-dynamic"; // don't pre-render anything under /my
export const revalidate = 0;

export default function MyLayout({ children }: { children: React.ReactNode }) {
  return children; // no UI change; just a wrapper
}
