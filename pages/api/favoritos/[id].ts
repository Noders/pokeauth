/* eslint-disable no-console */
import elapsed from '@f/elapsed-time'
import { dbConnection } from './../../../src/databaseConnection'
import { config } from './../../../src/config'
import { NextApiRequest, NextApiResponse } from 'next'
import { apiError } from '../../../src/apiErrors'
import { corsMiddleware } from '../../../src/middlewares'
import { decode } from '../../../src/jwt'
import { UserEntity } from '../../../src/models'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const time = elapsed()
  await corsMiddleware(req, res)
  res.statusCode = 200
  console.log('Cors Middleware', time())
  try {
    const anId = req?.query?.id
    if (!anId) {
      apiError(res, 'no id present', 500)
      return
    }
    const pokemonId = Number(anId)
    console.log('pokemonid', time())
    if (Number.isNaN(pokemonId)) {
      apiError(res, 'id has to be a number', 500)
      return
    }
    const token = req.headers?.[config.authentication.header]
    const { id } = decode(token) as { id: string }
    console.log('token', time())
    const connection = await dbConnection()
    const repository = connection.getRepository(UserEntity)
    console.log('user repository', time())
    if (req.method === 'POST') {
      try {
        console.log('POST - start', time())
        const user = await repository.findOne({ id })
        console.log('POST - find user', time())
        if (!user) {
          apiError(res, 'could not find user', 500)
          return
        }
        const favorites = (JSON.parse(user.favorites) || []) as number[]
        favorites.push(pokemonId)
        const newFavorites = Array.from(new Set(favorites.map(Number)))
        user.favorites = JSON.stringify(newFavorites)
        console.log('POST - update favorites', time())
        await repository.save(user)
        console.log('POST - save user', time())
        res.json({
          success: true,
          newFavorites,
        })
        console.log('POST - return response', time())
        return
      } catch (e) {
        apiError(res, 'could not save favourites', 401)
        return
      }
    } else if (req.method === 'GET') {
      console.log('GET - start', time())
      const user = await repository.findOne({ id })
      console.log('GET - find user', time())
      if (!user) {
        apiError(res, 'could not find user', 500)
        return
      }
      const favorites = (JSON.parse(user.favorites) || []) as number[]
      const isFavorite = favorites.some((fav) => fav === pokemonId)
      console.log('GET - modify data', time())
      res.json({
        success: true,
        isFavorite,
      })
      console.log('GET - return response', time())
      return
    } else if (req.method === 'DELETE') {
      console.log('DELETE - delete', time())
      const user = await repository.findOne({ id })
      console.log('DELETE - find user', time())
      if (!user) {
        apiError(res, 'could not find user', 500)
        return
      }
      try {
        console.log('DELETE - find user', time())
        const favorites = ((JSON.parse(user.favorites) ||
          []) as number[]).filter((fav) => fav !== pokemonId)
        const newFavorites = Array.from(new Set(favorites.map(Number)))
        user.favorites = JSON.stringify(newFavorites)
        console.log('DELETE - update favorites', time())
        await repository.save(user)
        console.log('DELETE - save user', time())
        res.json({
          success: true,
          newFavorites,
        })
        console.log('DELETE - find user', time())
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
