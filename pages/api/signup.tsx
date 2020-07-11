import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { config } from '../../src/config'
import { UserEntity } from '../../src/models/user'
import { dbConnection } from '../../src/databaseConnection'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200
  const password = req.body?.password
  const email = req.body?.email
  console.log(req.body)

  if (!password || !email) {
    res.statusCode = 200
    res.json({ error: true, errorMessage: 'missing body params' })
    return
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 8)
  console.log('creating connection')
  const connection = await dbConnection()
  console.log('getting repository')
  const repository = connection.getRepository(UserEntity)
  const user = new UserEntity()
  user.email = email
  user.password = hashedPassword
  console.log('save user')
  const { id } = await repository.save(user)
  const token = jwt.sign({ id }, config.secret, {
    expiresIn: 86400, // expires in 24 hours
  })
  res.json({ id, token })
}

export default handler
