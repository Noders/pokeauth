import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../../src/config'
import { dbConnection } from '../../src/databaseConnection'
import { UserEntity } from '../../src/models/user'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200
  const password = req.body?.password
  const email = req.body?.email
  console.log(req.body)
  if (!password || !email) {
    res.json({ error: true, errorMessage: 'missing body params' })
    return
  }
  console.log('creating connection')
  const connection = await dbConnection()
  console.log('getting repository')
  const repository = connection.getRepository(UserEntity)
  console.log('find user')
  const user = await repository.findOne({
    email,
  })
  const passwordIsValid = bcrypt.compareSync(password, user.password)
  if (!passwordIsValid) {
    res.statusCode = 401
    res.json({ error: true, errorMessage: 'invalid password' })
    return
  }
  const { id } = user
  const token = jwt.sign({ id }, config.secret, {
    expiresIn: 86400, // expires in 24 hours
  })
  res.json({ id, token })
}

export default handler
