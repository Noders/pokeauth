import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { dbConnection } from '../../src/databaseConnection'
import { UserEntity } from '../../src/models'
import { sign } from '../../src/jwt'
import { corsMiddleware } from '../../src/middlewares'
import { apiError } from '../../src/apiErrors'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)
  res.statusCode = 200
  if (req.method !== 'POST') {
    apiError(res, 'unauthorized method', 401)
    return
  }
  try {
    const requestPassword = req.body?.password
    const email = req.body?.email
    if (!requestPassword || !email) {
      apiError(res, 'missing body params', 401)
      return
    }
    const connection = await dbConnection()
    const repository = connection.getRepository(UserEntity)
    const { password, id } = await repository.findOne({
      email,
    })
    const passwordIsValid = bcrypt.compareSync(requestPassword, password)
    if (!passwordIsValid) {
      apiError(res, 'invalid password', 401)
      return
    }
    const token = sign({ id })
    res.json({ id, token })
  } catch (e) {
    console.error(e)
    console.error(e)
    apiError(res, 'could not login', 500)
    return
  }
}

export default handler
