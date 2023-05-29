import { NextApiRequest, NextApiResponse } from 'next'

export default function logout(req: NextApiRequest, res: NextApiResponse) {
  // Clear the access_token cookie
  res.setHeader('Set-Cookie', 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT')

  // Redirect the user to the dashboard or login page
  res.redirect('/')
}