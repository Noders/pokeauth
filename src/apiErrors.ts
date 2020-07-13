import { NextApiResponse } from 'next'

export const apiError = (
  res: NextApiResponse,
  message: string,
  statusCode = 404,
  extra: object = {}
) => {
  res.statusCode = statusCode
  res.send({ success: false, message, ...extra })
}
