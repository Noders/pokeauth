import jwt from 'jsonwebtoken'
import { config } from './config'

export const sign = (data) => {
  return jwt.sign(data, config.secret, {
    expiresIn: 86400,
  })
}

export const validate = (token) => {
  return jwt.verify(token, config.secret)
}

export const decode = (token) => {
  return jwt.decode(token)
}
