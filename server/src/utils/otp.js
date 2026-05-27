import crypto from 'crypto'
import { env } from '../config/env.js'

export function createOtp() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0')
}

export function hashOtp(email, otp) {
  return crypto
    .createHash('sha256')
    .update(`${email.toLowerCase()}:${otp}:${env.otpPepper}`)
    .digest('hex')
}

export function createOtpExpiry() {
  return new Date(Date.now() + env.otpTtlMinutes * 60 * 1000)
}
