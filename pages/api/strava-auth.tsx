import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const CLIENT_ID = process.env.STRAVA_CLIENT_ID || '';
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  try {
    // Exchange authorization code for access token
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    });

    const accessToken = response.data.access_token;

    // Save the access token
    res.setHeader('Set-Cookie', `access_token=${accessToken}; Path=/`);

    // Redirect to the page where stuff are loaded
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Failed to exchange authorization code for access token:', error);
    res.status(500).json({ error: 'Failed to authenticate with Strava' });
  }
}
