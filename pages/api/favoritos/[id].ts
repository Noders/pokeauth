import { dbConnection } from './../../../src/databaseConnection'
import { config } from './../../../src/config'
import { NextApiRequest, NextApiResponse } from 'next'
import { apiError } from '../../../src/apiErrors'
import { corsMiddleware } from '../../../src/middlewares'
import { decode } from '../../../src/jwt'
import { UserEntity } from '../../../src/models'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)
  try {
    const anId = req?.query?.id
    if (!anId) {
      apiError(res, 'no id present', 500)
      return
    }
    const pokemonId = Number(anId)
    if (Number.isNaN(pokemonId)) {
      apiError(res, 'id has to be a number', 500)
      return
    }
    const token = req.headers?.[config.authentication.header]
    const { id } = decode(token) as { id: string }
    const connection = await dbConnection()
    const repository = connection.getRepository(UserEntity)
    const user = await repository.findOne({ id })
    if (!user) {
      apiError(res, 'could not find user', 500)
      return
    }
    if (req.method === 'POST') {
      res.statusCode = 200
      try {
        const favorites = (JSON.parse(user.favorites) || []) as number[]
        favorites.push(pokemonId)
        const newFavorites = Array.from(new Set(favorites.map(Number)))
        user.favorites = JSON.stringify(newFavorites)
        repository.save(user)
        res.json({
          success: true,
          newFavorites,
        })
        return
      } catch (e) {
        apiError(res, 'could not save favourites', 401)
        return
      }
    } else if (req.method === 'GET') {
      const favorites = (JSON.parse(user.favorites) || []) as number[]
      const isFavorite = favorites.some((fav) => fav === pokemonId)
      res.json({
        success: true,
        isFavorite,
      })
      return
    } else if (req.method === 'DELETE') {
      res.statusCode = 200
      try {
        const favorites = ((JSON.parse(user.favorites) ||
          []) as number[]).filter((fav) => fav !== pokemonId)
        const newFavorites = Array.from(new Set(favorites.map(Number)))
        user.favorites = JSON.stringify(newFavorites)
        repository.save(user)
        res.json({
          success: true,
          newFavorites,
        })
        return
      } catch (e) {
        apiError(res, 'could not delete favourites', 401)
        return
      }
    } else {
      apiError(res, 'unauthorized method', 401)
    }
  } catch (e) {
    apiError(res, 'invalid token', 500)
  }
}

export default handler
