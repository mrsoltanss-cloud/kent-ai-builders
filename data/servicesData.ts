export type Service = { id: string; label: string; emoji?: string };

export const SERVICES: Service[] = [
  { id: "extensions", label: "House Extensions", emoji: "🏠" },
  { id: "loft", label: "Loft Conversions", emoji: "🧰" },
  { id: "kitchen", label: "Kitchen Fitting", emoji: "🍳" },
  { id: "bathroom", label: "Bathroom Renovation", emoji: "🛁" },
  { id: "plastering", label: "Plastering", emoji: "🧱" },
  { id: "tiling", label: "Tiling", emoji: "🧩" },
];

export const servicesData = SERVICES;
export default SERVICES;
