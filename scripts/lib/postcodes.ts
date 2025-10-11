/** Kent outward codes covering Canterbury/Thanet/Dover/Folkestone/Medway/Maidstone/
 *  Tunbridge Wells/Tonbridge/Sevenoaks/Ashford/Gravesham/Dartford/Swanley/Orpington
 */
export const KENT_OUTWARDS = [
  // CT
  "CT1","CT2","CT3","CT4","CT5","CT6","CT7","CT8","CT9","CT10","CT11","CT12","CT13","CT14","CT15","CT16","CT17","CT18","CT19","CT20","CT21",
  // ME
  "ME1","ME2","ME3","ME4","ME5","ME6","ME7","ME8","ME9","ME10","ME11","ME12","ME13","ME14","ME15","ME16","ME17","ME18","ME19","ME20",
  // TN
  "TN1","TN2","TN4","TN8","TN9","TN10","TN11","TN12","TN13","TN14","TN15","TN16","TN17","TN18","TN23","TN24","TN25","TN26","TN27","TN30",
  // DA
  "DA1","DA2","DA3","DA10","DA11","DA12","DA13",
  // BR (Kent footprint)
  "BR6","BR8",
];

const LETTERS = "ABCDEFGHJKLMNPRSTUWXYZ".split(""); // avoid I/O/V for clarity
function pick<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function unit() { return `${1 + Math.floor(Math.random()*9)}${pick(LETTERS)}${pick(LETTERS)}`; }

/** Random realistic Kent postcode, e.g. "CT10 3AB" */
export function randomKentPostcode() {
  return `${pick(KENT_OUTWARDS)} ${unit()}`;
}
