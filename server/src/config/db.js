import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDb() {
  try {
    await mongoose.connect(env.mongodbUri)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }
}
