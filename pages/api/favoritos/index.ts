import { NextApiRequest, NextApiResponse } from 'next'
// import { dbConnection } from '../../src/databaseConnection'
// import { UserEntity } from '../../src/models/user'
// import { sign } from '../../src/jwt'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200
  if (req.method === 'POST') {
    res.send({})
  }
  if (req.method === 'GET') {
    res.send({})
  }
}

export default handler
