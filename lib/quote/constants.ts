/** Soft Emerald: structured categories (Main → Sub), dynamic stats, towns near West Kingsdown (~30mi) */
export type MainCategoryKey =
  | "building" | "interior" | "landscaping" | "roofing" | "commercial" | "maintenance" | "lifestyle";

export const MAIN_CATEGORIES: Array<{
  key: MainCategoryKey; label: string; emoji: string; sub: string[];
}> = [
  { key: "building", label: "Building & Renovation", emoji: "🏗", sub: [
    "House Extension","Loft Conversion","Garage Conversion","Basement Conversion","New Build Homes",
    "Structural Alterations","Property Renovation","Outbuildings / Garden Offices","Reconfiguration / Knock-through","Other"
  ]},
  { key: "interior", label: "Interior Projects", emoji: "🎨", sub: [
    "Kitchen Renovation","Bathroom Installation","Tiling & Flooring","Plastering & Decorating","Lighting & Electrics",
    "Carpentry & Joinery","Staircase / Storage","Painting & Finishing","Other"
  ]},
  { key: "landscaping", label: "Exterior & Landscaping", emoji: "🌿", sub: [
    "Driveway / Paving","Patio / Decking","Fencing / Gates","Brickwork / Repointing","Garden Walls",
    "Turfing / Artificial Grass","Drainage / Soakaway","Rendering / Cladding","Other"
  ]},
  { key: "roofing", label: "Windows, Doors & Roofing", emoji: "🪟", sub: [
    "Window Replacement","Bifold / Sliding Doors","Roof Lantern / Skylight","Conservatory Upgrade",
    "Roof Repairs / Replacement","Flat Roofs (GRP / EPDM)","Guttering / Fascia","Velux Installation","Other"
  ]},
  { key: "commercial", label: "Commercial & Fit-outs", emoji: "🏢", sub: [
    "Office Refurbishment","Shopfitting / Retail","Restaurant / Bar Fit-out","Salon / Clinic Refurbishment",
    "Industrial Unit Conversion","Landlord / HMO Conversion","Accessibility Works","Other"
  ]},
  { key: "maintenance", label: "Maintenance & Reactive Works", emoji: "🔧", sub: [
    "Emergency Repairs","Handyman Tasks","Electrical Faults","Boiler / Heating Repair","Leak Detection",
    "General Maintenance","Insurance Work","End-of-Tenancy Refurb","Other"
  ]},
  { key: "lifestyle", label: "Premium & Lifestyle Builds", emoji: "💎", sub: [
    "Luxury Bathroom / Spa","Designer Kitchen","Cinema Room","Home Gym","Outdoor Kitchen",
    "Swimming Pool","Sauna / Steam Room","Bespoke Garden Room","Architectural Lighting","Other"
  ]},
];

export const STATS = {
  aiQuotesThisWeek: 142,
  surveysBooked7Days: 36,
  // update these weekly if you want real-time vibes
};

export const TOWNS_30MI_WEST_KINGSDOWN = [
  "West Kingsdown","Sevenoaks","Swanley","Dartford","Gravesend","Longfield","New Ash Green","Hartley",
  "Rochester","Chatham","Gillingham","Strood","Cuxton","Halling","Aylesford","Maidstone","Snodland",
  "West Malling","East Malling","Kings Hill","Tonbridge","Royal Tunbridge Wells","Paddock Wood","Orpington",
  "Bromley","Sidcup","Bexleyheath","Welling","Greenhithe","Swanscombe","Ebbsfleet","Northfleet","Sittingbourne",
  "Faversham","Canterbury","Whitstable","Herne Bay","Ashford","Tenterden","Edenbridge","Oxted","Biggin Hill",
  "Westerham","Otford","Kemsing","Hextable","Borough Green","Meopham","Higham","Grain","Hoo St Werburgh"
];

// Helpers
export function formatGBP(n: number) {
  return new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP",maximumFractionDigits:0}).format(n);
}
export function readableUrgency(u: string) {
  const map: any = { ASAP:"ASAP", THIS_MONTH:"This month", THIS_QUARTER:"This quarter", FLEXIBLE:"Flexible" };
  return map[u] ?? u;
}
export function waLinkPrefill(payload: {
  main: string; sub: string; town: string; sqm: number; rooms: number; urgency: string;
  low?: number; mid?: number; high?: number;
}) {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+441474462265").replace(/^\+/,"");
  const lines = [
    "Hi Brixel 👋 I’ve just used your AI quote simulator — here are my details:",
    `• Project: ${payload.main} – ${payload.sub}`,
    `• Location: ${payload.town}`,
    `• Size: ${payload.sqm} m² • Rooms: ${payload.rooms}`,
    `• Urgency: ${readableUrgency(payload.urgency)}`,
    ...(payload.mid ? [`• Estimate: £${payload.mid} (range £${payload.low}–£${payload.high})`] : []),
    "",
    "Let’s arrange a site visit when convenient!"
  ].join("\n");
  return `https://wa.me/${number}?text=${encodeURIComponent(lines)}`;
}
