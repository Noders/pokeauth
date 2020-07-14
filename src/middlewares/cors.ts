import Cors from 'cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { runMiddleware } from './helpers'

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD', 'POST', 'OPTIONS', 'DELETE'],
})

export const corsMiddleware = (req: NextApiRequest, res: NextApiResponse) =>
  runMiddleware(req, res, cors)
