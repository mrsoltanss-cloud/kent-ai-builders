import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

/** Broad Kent outward codes (Canterbury/Thanet/Medway/Sevenoaks/TW/Ashford/Gravesham/Dartford/Swanley/Orpington) */
const OUT = [
  // CT (Canterbury, Thanet, Dover, Folkestone/Hythe, Whitstable/Herne Bay, Deal/Sandwich)
  "CT1","CT2","CT3","CT4","CT5","CT6","CT7","CT8","CT9","CT10","CT11","CT12","CT13","CT14","CT15","CT16","CT17","CT18","CT19","CT20","CT21",
  // ME (Medway, Maidstone, Sittingbourne/Sheppey, Malling)
  "ME1","ME2","ME3","ME4","ME5","ME6","ME7","ME8","ME9","ME10","ME11","ME12","ME13","ME14","ME15","ME16","ME17","ME18","ME19","ME20",
  // TN (Tonbridge, Tunbridge Wells, Sevenoaks, Ashford, Tenterden, Cranbrook, Edenbridge)
  "TN1","TN2","TN4","TN8","TN9","TN10","TN11","TN12","TN13","TN14","TN15","TN16","TN17","TN18","TN23","TN24","TN25","TN26","TN27","TN30",
  // DA (Dartford, Gravesham border)
  "DA1","DA2","DA3","DA10","DA11","DA12","DA13",
  // BR (parts of Kent footprint)
  "BR6","BR8"
];

/** Generate a plausible UK unit (skip ambiguous letters) */
const LETTERS = "ABCDEFGHJKLMNPRSTUWXYZ".split(""); // no I/O/V
function rand<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomUnit() {
  const digit = String(1 + Math.floor(Math.random() * 9));
  return `${digit}${rand(LETTERS)}${rand(LETTERS)}`;
}
function randomKentPostcode() {
  const outward = rand(OUT);
  return `${outward} ${randomUnit()}`;
}

async function main() {
  const jobs = await db.job.findMany({ select: { id: true } });
  if (!jobs.length) {
    console.log(JSON.stringify({ updated: 0, note: "no jobs found" }));
    return;
  }

  // Pre-generate a pool of unique postcodes (2x jobs to avoid collisions)
  const pool = new Set<string>();
  while (pool.size < jobs.length * 2) pool.add(randomKentPostcode());
  const unique = Array.from(pool);

  let updated = 0;
  const outwardCounts: Record<string, number> = {};

  for (let i = 0; i < jobs.length; i++) {
    const pc = unique[i];
    const outward = pc.split(" ")[0];
    outwardCounts[outward] = (outwardCounts[outward] ?? 0) + 1;
    await db.job.update({ where: { id: jobs[i].id }, data: { postcode: pc } });
    updated++;
  }

  console.log(JSON.stringify({ updated, sample: unique.slice(0,8), dist: outwardCounts }, null, 2));
}

main().finally(() => db.$disconnect());
