import { DateTime } from "luxon";

export const londonNow = () => DateTime.now().setZone("Europe/London");

/** Weekly anchor = Sunday 00:00 (Europe/London) */
export const weekStartLondon = (d: DateTime = londonNow()) => {
  const base = d.setZone("Europe/London");
  if (base.weekday === 7) return base.startOf("day"); // if it's Sunday, today 00:00
  return base.startOf("week").minus({ days: 1 }).startOf("day"); // otherwise last Sunday
};

export const secondsSinceWeekStart = () => {
  const now = londonNow();
  return Math.max(0, Math.floor(now.toSeconds() - weekStartLondon(now).toSeconds()));
};
