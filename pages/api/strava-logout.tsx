import { NextApiRequest, NextApiResponse } from 'next'

export default function logout(req: NextApiRequest, res: NextApiResponse) {
  // Clear the ACCESS_TOKEN cookie or storage
  res.clearPreviewData() // If using Next.js preview mode, clear any preview data
  res.status(200).json({ message: 'Logged out successfully' })
}