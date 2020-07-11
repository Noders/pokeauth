import { NextApiRequest, NextApiResponse } from 'next'
import { validate } from '../jwt'
import { apiError } from '../apiErrors'
import { runMiddleware } from './helpers'
import { config } from '../config'

const authentication = (
  req: NextApiRequest,
  res: NextApiResponse,
  callback: (params?: any) => void
) => {
  const token = req.headers?.[config.authentication.header]
  if (!validate(token)) {
    apiError(res, 'Token invalid', 401)
    callback(new Error('Token invalid'))
  } else {
    callback()
  }
}

export const authenticationMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse
) => runMiddleware(req, res, authentication)
