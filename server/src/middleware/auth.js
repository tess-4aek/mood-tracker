import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { User } from '../models/User.js'

export async function requireAuth(req, res, next) {
  try {
    const cookieToken = req.cookies?.[env.cookieName]
    const authHeader = req.headers.authorization || ''
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    const token = cookieToken || bearerToken

    if (!token) {
      return res.status(401).json({ message: 'Необходима авторизация' })
    }

    const payload = jwt.verify(token, env.jwtSecret)
    const user = await User.findById(payload.userId).select('_id email createdAt')

    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Сессия недействительна или истекла' })
  }
}
