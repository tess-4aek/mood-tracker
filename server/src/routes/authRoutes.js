import express from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createOtp, createOtpExpiry, hashOtp } from '../utils/otp.js'
import { sendOtpEmail } from '../services/mailService.js'
import { requireAuth } from '../middleware/auth.js'

export const authRouter = express.Router()

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')
}

function setAuthCookie(res, token) {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000
  })
}

authRouter.post('/request-otp', asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase()

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Введите корректный email' })
  }

  const otp = createOtp()
  const otpCodeHash = hashOtp(email, otp)
  const otpExpiresAt = createOtpExpiry()

  await User.findOneAndUpdate(
    { email },
    { email, otpCodeHash, otpExpiresAt },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  await sendOtpEmail(email, otp)

  res.json({ message: 'Код отправлен на email' })
}))

authRouter.post('/verify-otp', asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase()
  const otp = String(req.body.otp || '').trim()

  if (!isValidEmail(email) || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({ message: 'Введите email и 6-значный код' })
  }

  const user = await User.findOne({ email })

  if (!user || !user.otpCodeHash || !user.otpExpiresAt) {
    return res.status(400).json({ message: 'Сначала запросите OTP-код' })
  }

  if (user.otpExpiresAt.getTime() < Date.now()) {
    return res.status(400).json({ message: 'Код устарел' })
  }

  const incomingHash = hashOtp(email, otp)

  if (incomingHash !== user.otpCodeHash) {
    return res.status(400).json({ message: 'Неверный код' })
  }

  user.otpCodeHash = null
  user.otpExpiresAt = null
  user.lastLoginAt = new Date()
  await user.save()

  const token = jwt.sign({ userId: user._id.toString() }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  })

  setAuthCookie(res, token)

  res.json({
    user: {
      id: user._id,
      email: user.email
    }
  })
}))

authRouter.post('/logout', (req, res) => {
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: env.nodeEnv === 'production' ? 'none' : 'lax'
  })
  res.json({ message: 'Вы вышли из аккаунта' })
})

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email
    }
  })
})
