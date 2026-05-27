import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import { authRouter } from './routes/authRoutes.js'
import { moodRouter } from './routes/moodRoutes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

export const app = express()

app.use(helmet())
app.use(cors({
  origin: env.clientUrl,
  credentials: true
}))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRouter)
app.use('/api/moods', moodRouter)

app.use(notFound)
app.use(errorHandler)
