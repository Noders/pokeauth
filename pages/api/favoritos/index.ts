import { NextApiRequest, NextApiResponse } from 'next'
import { UserEntity } from '../../../src/models/user'
import { decode } from '../../../src/jwt'
import { config } from '../../../src/config'
import { dbConnection } from '../../../src/databaseConnection'
import { apiError } from '../../../src/apiErrors'
import { corsMiddleware } from '../../../src/middlewares'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)
  try {
    const token = req.headers?.[config.authentication.header]
    const { id } = decode(token) as { id: string }
    res.statusCode = 200
    const connection = await dbConnection()
    const repository = connection.getRepository(UserEntity)
    const user = await repository.findOne({ id })
    if (!user) {
      apiError(res, 'could not find user', 500)
      return
    }
    if (req.method === 'POST') {
      const favorites = req.body?.favorites
      if (!Array.isArray(favorites)) {
        apiError(res, 'favorites is not an array', 500)
        return
      }
      if (favorites.length === 0) {
        apiError(res, 'no favorites added', 500)
        return
      }
      try {
        user.favorites = JSON.stringify(favorites)
        const data = await repository.save(user)
        res.json({ success: true, favorites: JSON.parse(data.favorites) })
        return
      } catch (e) {
        apiError(res, 'could not save favourites', 401)
        return
      }
    } else if (req.method === 'GET') {
      const favorites = user.favorites
      res.send({ success: true, favorites: JSON.parse(favorites) })
      return
    } else {
      apiError(res, 'unauthorized method', 401)
    }
  } catch (e) {
    apiError(res, 'invalid token', 500)
    return
  }
}

export default handler
