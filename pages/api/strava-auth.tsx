import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  // Exchange the authorization code for an access token
  const tokenResponse = await axios.post('https://www.strava.com/oauth/token', null, {
    params: {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code'
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Extract the access token from the response
  const accessToken = tokenResponse.data.access_token;

  // Handle the access token as needed (store it in a database, set it as a cookie, etc.)
  // You can also redirect the user to another page with the access token in the query parameters

  res.status(200).json({ accessToken });
}
