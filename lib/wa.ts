export function normaliseToE164(raw: string): string {
  const s = (raw || "").trim();
  if (!s) return "441474462265"; // default
  const digits = s.replace(/[^0-9]/g, "");
  if (/^0\d+/.test(digits)) return "44" + digits.slice(1);
  if (/^44\d+/.test(digits)) return digits;
  return digits;
}
export function waLink(raw: string): string {
  const e164 = normaliseToE164(raw);
  return `https://wa.me/${e164}`;
}
