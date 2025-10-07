"use client";
import React, { useEffect, useRef, useState } from "react";
import StatsCard from "./StatsCard";
import { demoCountsNow } from "../../lib/brixel/demoStats";
import { useCountUp } from "../../lib/brixel/countUp";

type LiveStats = {
  similar_requests_week: number;
  surveys_booked_week: number;
  rating: number;
  reviews_count: number;
  last_updated: string;
};

const MODE = (process.env.NEXT_PUBLIC_STATS_MODE || "demo").toLowerCase();

export default function StatsPanel() {
  const [similar, setSimilar] = useState(0);
  const [surveys, setSurveys] = useState(0);
  const [rating, setRating] = useState(4.9);
  const [reviews, setReviews] = useState<number | null>(312);

  const aSimilar = useCountUp(similar);
  const aSurveys = useCountUp(surveys);

  // rare jitter for rating (±0.01 at most daily)
  const lastJitterRef = useRef<number>(0);
  const [displayRating, setDisplayRating] = useState(rating);

  const weeklyResetNote = "This week · resets Sun 12:00am (Europe/London)";

  async function fetchLive() {
    try {
      const res = await fetch("/api/stats", { cache: "no-store" });
      const data = (await res.json()) as LiveStats;
      setSimilar(data.similar_requests_week);
      setSurveys(data.surveys_booked_week);
      setRating(data.rating);
      setReviews(data.reviews_count);
    } catch {}
  }

  useEffect(() => {
    if (MODE === "live") {
      fetchLive();
      const id = setInterval(fetchLive, 5 * 60 * 1000);
      return () => clearInterval(id);
    } else {
      const apply = () => {
        const { similar, surveys } = demoCountsNow();
        setSimilar(similar);
        setSurveys(surveys);
      };
      apply();
      const id = setInterval(apply, 60 * 1000);
      return () => clearInterval(id);
    }
  }, []);

  useEffect(() => {
    const now = Date.now();
    if (now - lastJitterRef.current > 24 * 60 * 60 * 1000) {
      lastJitterRef.current = now;
      const delta = Math.random() < 0.25 ? (Math.random() * 0.02 - 0.01) : 0;
      setDisplayRating(parseFloat((rating + delta).toFixed(2)));
    } else {
      setDisplayRating(rating);
    }
  }, [rating]);

  const liveTips = {
    similar: "Number of new quote requests received in the last 7 days. Updates ~10 min. Resets Sun 12:00am (Europe/London).",
    surveys: "Site surveys booked in the last 7 days. Updates ~10 min. Resets Sun 12:00am (Europe/London).",
    rating: "Average rating from verified reviews. Weighted by recency and volume. Updated daily.",
  };
  const demoTips = {
    similar: "Preview metric while we finish integration. Simulated trend. Will reset Sun 12:00am (Europe/London).",
    surveys: "Preview metric while we finish integration. Simulated bookings. Will reset Sun 12:00am (Europe/London).",
    rating: "Placeholder rating during beta. Final value will reflect verified reviews.",
  };
  const tips = MODE === "live" ? liveTips : demoTips;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatsCard label={`Similar requests (last 7 days) · ${weeklyResetNote}`} value={aSimilar} tooltip={tips.similar} />
      <StatsCard label={`Surveys booked (last 7 days) · ${weeklyResetNote}`} value={aSurveys} tooltip={tips.surveys} />
      <StatsCard label={`Homeowner rating ${reviews ? `(${reviews} reviews)` : ""}`} value={displayRating.toFixed(1)} suffix="/5" tooltip={tips.rating} />
    </div>
  );
}
