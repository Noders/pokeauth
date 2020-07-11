import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { UserEntity } from '../../src/models'
import { dbConnection } from '../../src/databaseConnection'
import { sign } from '../../src/jwt'
import { corsMiddleware } from '../../src/middlewares'
import { apiError } from '../../src/apiErrors'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200
  try {
    await corsMiddleware(req, res)
    const password = req.body?.password
    const email = req.body?.email
    if (!password || !email) {
      apiError(res, 'missing body params', 401)
      return
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 8)
    const connection = await dbConnection()
    const repository = connection.getRepository(UserEntity)
    const user = new UserEntity()
    user.email = email
    user.password = hashedPassword
    try {
      const { id } = await repository.save(user)
      const token = sign
      res.json({ id, token })
    } catch (e) {
      apiError(res, 'could not create account', 401)
    }
  } catch (e) {
    apiError(res, 'could not create account', 401)
  }
}

export default handler
