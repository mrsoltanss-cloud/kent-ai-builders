export type Town = { slug: string; name: string; county?: string };

export const LOCATIONS: Town[] = [
  { slug: "ashford", name: "Ashford", county: "Kent" },
  { slug: "canterbury", name: "Canterbury", county: "Kent" },
  { slug: "maidstone", name: "Maidstone", county: "Kent" },
  { slug: "medway", name: "Medway", county: "Kent" },
  { slug: "tonbridge", name: "Tonbridge", county: "Kent" },
];

export const locationsData = LOCATIONS;
export default LOCATIONS;
