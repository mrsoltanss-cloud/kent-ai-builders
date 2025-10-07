export type Option = { value: string; label: string };
export type MicroQuestion = { id: string; label: string; options: Option[]; required?: boolean };

export const universal: MicroQuestion[] = [
  {
    id: "propertyType",
    label: "Property type",
    options: [
      { value: "house", label: "House" },
      { value: "flat", label: "Flat" },
      { value: "bungalow", label: "Bungalow" },
      { value: "maisonette", label: "Maisonette" },
      { value: "commercial", label: "Commercial" }
    ],
  },
  {
    id: "propertyAgeBand",
    label: "Property age",
    options: [
      { value: "pre1919", label: "Pre-1919" },
      { value: "1919-1970", label: "1919–1970" },
      { value: "1970-2000", label: "1970–2000" },
      { value: "2000-2015", label: "2000–2015" },
      { value: "2016plus", label: "2016+" }
    ],
  },
  {
    id: "occupied",
    label: "Will the property be occupied during works?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ],
  },
  {
    id: "parkingAccess",
    label: "Parking & access",
    options: [
      { value: "driveway", label: "Driveway" },
      { value: "street-permit", label: "Street permit" },
      { value: "restricted", label: "Restricted access" },
      { value: "none", label: "None" }
    ],
  },
  {
    id: "budgetBand",
    label: "Budget band (optional)",
    options: [
      { value: "<5k", label: "<£5k" },
      { value: "5-15k", label: "£5–15k" },
      { value: "15-40k", label: "£15–40k" },
      { value: "40-80k", label: "£40–80k" },
      { value: "80k+", label: "£80k+" }
    ],
  },
];

const mk = (arr: MicroQuestion[], pick: number) => arr.slice(0, pick);

export const banks: Record<string, MicroQuestion[]> = {
  "kitchen renovation": [
    { id: "scope", label: "Scope", options: [
      { value: "refresh", label: "Refresh fronts & worktops" },
      { value: "full", label: "Full new kitchen" },
      { value: "reconfigure", label: "Reconfigure layout" },
    ], required: true },
    { id: "size", label: "Kitchen size", options: [
      { value: "small", label: "Small (≤8m²)" },
      { value: "medium", label: "Medium (9–14m²)" },
      { value: "large", label: "Large (15–22m²)" },
      { value: "xl", label: "XL (22m²+)" },
    ]},
    { id: "appliances", label: "Appliances to fit/connect", options: [
      { value: "0-2", label: "0–2" },
      { value: "3-5", label: "3–5" },
      { value: "6+", label: "6+" },
    ]},
    { id: "worktops", label: "Worktops", options: [
      { value: "laminate", label: "Laminate" },
      { value: "wood", label: "Solid wood" },
      { value: "stone", label: "Quartz/Granite" },
      { value: "unsure", label: "Not sure" },
    ]},
    { id: "walls", label: "Wall changes", options: [
      { value: "none", label: "None" },
      { value: "stud", label: "Remove stud" },
      { value: "structural", label: "Remove structural (RSJ likely)" },
    ]},
  ],
  "bathroom refurbishment": [
    { id: "scope", label: "Scope", options: [
      { value: "like-for-like", label: "Like-for-like" },
      { value: "partial", label: "Partial" },
      { value: "full", label: "Full redesign" },
    ], required: true },
    { id: "size", label: "Size", options: [
      { value: "cloak", label: "Cloakroom" },
      { value: "small", label: "Small" },
      { value: "standard", label: "Standard" },
      { value: "large", label: "Large" },
    ]},
    { id: "tiling", label: "Tiling coverage", options: [
      { value: "splashback", label: "Splashback" },
      { value: "half", label: "Half-height" },
      { value: "full", label: "Full-height" },
      { value: "wet", label: "Wet-room" },
    ]},
    { id: "ufh", label: "Underfloor heating", options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ]},
  ],
  "loft conversion": [
    { id: "type", label: "Type", options: [
      { value: "velux", label: "Roof-light (Velux)" },
      { value: "dormer", label: "Dormer" },
      { value: "hip-to-gable", label: "Hip-to-gable" },
      { value: "mansard", label: "Mansard" },
    ], required: true },
    { id: "rooms", label: "Rooms", options: [
      { value: "1bed", label: "1 bed" },
      { value: "bed+ensuite", label: "Bed + ensuite" },
      { value: "2rooms", label: "2 rooms" },
      { value: "studio", label: "Studio" },
    ]},
    { id: "planning", label: "Planning status", options: [
      { value: "not-needed", label: "Not needed" },
      { value: "pd", label: "Permitted dev" },
      { value: "full", label: "Full planning" },
    ]},
  ],
  "house extension": [
    { id: "type", label: "Type", options: [
      { value: "rear", label: "Rear" },
      { value: "side", label: "Side" },
      { value: "wrap", label: "Wrap-around" },
      { value: "two-storey", label: "Two-storey" },
    ], required: true },
    { id: "footprint", label: "Footprint", options: [
      { value: "≤10", label: "≤10m²" },
      { value: "11-20", label: "11–20m²" },
      { value: "21-35", label: "21–35m²" },
      { value: "36+", label: "36m²+" },
    ]},
    { id: "openings", label: "Openings", options: [
      { value: "std", label: "Standard doors/windows" },
      { value: "slider", label: "Bi-fold/slider" },
      { value: "rooflights", label: "Rooflights" },
    ]},
    { id: "planning", label: "Planning status", options: [
      { value: "not-needed", label: "Not needed" },
      { value: "pd", label: "Permitted dev" },
      { value: "full", label: "Full planning" },
    ]},
  ],
  "roofing": [
    { id: "work", label: "Work", options: [
      { value: "repair", label: "Repair" },
      { value: "partial", label: "Partial re-tile" },
      { value: "full", label: "Full re-roof" },
    ], required: true },
    { id: "roofType", label: "Roof type", options: [
      { value: "pitched", label: "Pitched" },
      { value: "flat", label: "Flat" },
      { value: "mixed", label: "Mixed" },
    ]},
    { id: "material", label: "Material", options: [
      { value: "tile", label: "Concrete tile" },
      { value: "slate", label: "Slate" },
      { value: "felt", label: "Felt/EPDM" },
      { value: "grp", label: "GRP" },
      { value: "unknown", label: "Unknown" },
    ]},
  ],
  "plastering": [
    { id: "scope", label: "Scope", options: [
      { value: "patch", label: "Patch repairs" },
      { value: "room", label: "One room skim" },
      { value: "whole", label: "Whole-house skim" },
      { value: "newboards", label: "New boards + skim" },
    ], required: true },
    { id: "area", label: "Area size", options: [
      { value: "small", label: "Small" },
      { value: "medium", label: "Medium" },
      { value: "large", label: "Large" },
      { value: "xl", label: "Very large" },
    ]},
    { id: "surfaces", label: "Surfaces", options: [
      { value: "walls", label: "Walls" },
      { value: "ceilings", label: "Ceilings" },
      { value: "both", label: "Both" },
    ]},
  ],
  "plumbing": [
    { id: "job", label: "Job type", options: [
      { value: "leak", label: "Fix leak" },
      { value: "bathroom", label: "New bathroom fit" },
      { value: "kitchen", label: "New kitchen fit" },
      { value: "boiler", label: "Boiler-related" },
      { value: "rads", label: "Radiators" },
    ], required: true },
    { id: "fixtureCount", label: "Count", options: [
      { value: "1-2", label: "1–2 fixtures" },
      { value: "3-5", label: "3–5" },
      { value: "6+", label: "6+" },
    ]},
    { id: "pipework", label: "Pipework", options: [
      { value: "surface", label: "Surface only" },
      { value: "concealed", label: "Concealed" },
      { value: "newruns", label: "New runs" },
    ]},
  ],
  "electrical": [
    { id: "scope", label: "Scope", options: [
      { value: "extras", label: "Extra points" },
      { value: "partial", label: "Partial rewire" },
      { value: "full", label: "Full rewire" },
      { value: "cu", label: "Consumer unit upgrade" },
    ], required: true },
    { id: "points", label: "Points", options: [
      { value: "1-4", label: "1–4" },
      { value: "5-12", label: "5–12" },
      { value: "13-25", label: "13–25" },
      { value: "26+", label: "26+" },
    ]},
    { id: "cert", label: "Testing cert", options: [
      { value: "na", label: "Not needed" },
      { value: "eicr", label: "EICR" },
      { value: "partp", label: "Part-P sign-off" },
    ]},
  ],
};

export function getMicroQuestions(service: string): MicroQuestion[] {
  const key = (service || "").toLowerCase().trim();
  const bank = banks[key] || [];
  // Keep it snappy: pick 2–3 universal items + up to 2 service-specific
  const uniPick = mk(universal, 3);
  const svcPick = mk(bank, 2);
  return [...svcPick, ...uniPick];
}
