import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("Brixel email stub:", req.body);
    res.status(202).json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
}
