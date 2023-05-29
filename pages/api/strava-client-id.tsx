import { NextApiRequest, NextApiResponse } from 'next';

const STRAVA_CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || '';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ clientId: STRAVA_CLIENT_ID });
}