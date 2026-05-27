import dotenv from 'dotenv'

dotenv.config()

export const env = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mood_calendar',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',
  otpPepper: process.env.OTP_PEPPER || 'dev_otp_pepper_change_me',
  otpTtlMinutes: Number(process.env.OTP_TTL_MINUTES || 10),
  cookieName: process.env.COOKIE_NAME || 'mood_calendar_token',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'Mood Calendar <no-reply@example.com>'
  }
}
