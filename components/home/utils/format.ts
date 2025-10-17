export function formatGBP(n: number) {
  if (Number.isNaN(n) || !Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
}
