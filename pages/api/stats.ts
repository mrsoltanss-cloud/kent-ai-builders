import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    similar_requests_week: 124,
    surveys_booked_week: 98,
    rating: 4.9,
    reviews_count: 312,
    last_updated: new Date().toISOString(),
  });
}
